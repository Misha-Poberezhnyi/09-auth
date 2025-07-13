'use client';

import { useState } from 'react';
import css from './EditProfilePage.module.css';
import { editUser } from '@/lib/api/clientApi';
import { FormType } from '@/types/noteApi';
import { User } from '@/types/user'; 
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';

export default function ProfileEditPage() {
  const me = useAuthStore(state => state.user);  
  const [user, setUser] = useState<User | null>(me);
  const router = useRouter();

  const handleEditName = async (e: React.FormEvent) => {
    e.preventDefault();  
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData) as FormType;

    if (!data.username.trim() || !user) {
      return; 
    }

    try {
      const response = await editUser({
        email: user?.email,
        username: data.username,
      });
      setUser(response);  
      router.push('/profile');  
    } catch (error) {
      throw error;
    }
  };

  const handleBack = () => {
    router.back();  
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image src={user?.avatar || '/default-avatar.png'} alt="User Avatar" width={120} height={120} className={css.avatar} />

        <form className={css.profileInfo} onSubmit={handleEditName}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input name="username" id="username" type="text" className={css.input} defaultValue={user?.username} />
          </div>

          <p>Email: {user?.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button type="button" className={css.cancelButton} onClick={handleBack}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
