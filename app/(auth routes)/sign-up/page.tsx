'use client';

import css from './SignUpPage.module.css';
import { signUp } from '@/lib/api/clientApi';
import { RegisterRequest } from '@/types/noteApi';  
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import * as Yup from 'yup';
import { RegisterFormValues } from '@/types/noteApi';  

const validationSchema = Yup.object().shape({
  email: Yup.string().required('Email is required').email('Enter a valid email address'),
  password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
});

export default function SignUpPage() {
  const router = useRouter();
  const setUser = useAuthStore(state => state.setUser);
  const [error, setError] = useState('');
  const [formRegisterData, setRegisterFormData] = useState<RegisterFormValues>({
    email: '',
    password: '',
  });

  async function validateRegister(data: RegisterFormValues): Promise<string | null> {
    try {
      await validationSchema.validate(data, { abortEarly: false });
      return null;
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        return err.errors[0];
      }
      return 'Unknown validation error';
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterFormData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const errorValidation = await validateRegister(formRegisterData);
    if (errorValidation) {
      setError(errorValidation);
      return;
    }

    try {
      const res = await signUp(formRegisterData as RegisterRequest);  // Замінив тип
      if (res) {
        setUser(res.data);
        router.push('/profile');
      } else {
        setError('Invalid registration data');
      }
    } catch (err) {
      console.error(err);
      setError('Registration failed. Try again.');
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form className={css.form} onSubmit={handleSubmit}>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
            value={formRegisterData.email}
            onChange={handleChange}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
            value={formRegisterData.password}
            onChange={handleChange}
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Register
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
