'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getUserProfile } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import QueryStatus from '../QueryStatus/QueryStatus'; 

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const { setUser, clearIsAuthenticated, isAuthenticated } = useAuthStore();

  const isPrivateRoute =
    pathname.startsWith('/profile') 
    
  useEffect(() => {
    async function checkAuth() {
      try {
        const userData = await getUserProfile();
        setUser(userData);
      } catch {
        clearIsAuthenticated();
        if (isPrivateRoute) {
          router.push('/sign-in');
        }
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [pathname, isPrivateRoute, setUser, clearIsAuthenticated, router]);

  if (loading) {
    return (
      <QueryStatus
        isLoading={true}
        isError={false}
        isEmpty={false}
        emptyMessage=""
      />
    );
  }

  if (!isAuthenticated && isPrivateRoute) {
    return null;
  }

  return <>{children}</>;
}
