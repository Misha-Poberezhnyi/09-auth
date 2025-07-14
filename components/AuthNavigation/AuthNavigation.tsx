'use client';

import { useEffect, useState } from 'react';
import css from './AuthNavigation.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { logout, getUserProfile } from '@/lib/api/clientApi';

export default function AuthNavigation() {
  const { isAuthenticated, user, setIsAuthenticated, setUser, clearIsAuthenticated } = useAuthStore();
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);

    const initializeAuth = async () => {
      try {
        const user = await getUserProfile(); 
        setIsAuthenticated(true);
        setUser(user);
      } catch {
        clearIsAuthenticated(); 
      }
    };

    initializeAuth();
  }, []);

  if (!hasMounted) return null;

  const handleLogout = async () => {
    await logout();
    clearIsAuthenticated();
    router.push('/sign-in');
    router.refresh();
  };

  return (
    <>
      {isAuthenticated ? (
        <>
          <li className={css.navigationItem}>
            <Link href="/profile" prefetch={false} className={css.navigationLink}>
              Profile
            </Link>
          </li>
          <li className={css.navigationItem}>
            {user?.email && <p className={css.userEmail}>{user.email}</p>}
            <button onClick={handleLogout} className={css.logoutButton}>
              Logout
            </button>
          </li>
        </>
      ) : (
        <>
          <li className={css.navigationItem}>
            <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
              Login
            </Link>
          </li>
          <li className={css.navigationItem}>
            <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
              Sign up
            </Link>
          </li>
        </>
      )}
    </>
  );
}
