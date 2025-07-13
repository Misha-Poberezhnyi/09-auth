'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { checkSession } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import QueryStatus from '../QueryStatus/QueryStatus';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [loading, setLoading] = useState(true);
  const { setUser, clearIsAuthenticated } = useAuthStore();

  useEffect(() => {
    async function initializeAuth() {
      try {
        const sessionUser = await checkSession(); 
        setUser(sessionUser); 
      } catch {
        clearIsAuthenticated();
      } finally {
        setLoading(false);
      }
    }

    initializeAuth();
  }, [setUser, clearIsAuthenticated]);

  if (loading) {
    return <QueryStatus isLoading={true} isError={false} isEmpty={false} emptyMessage="" />;
  }

  return <>{children}</>;
}
