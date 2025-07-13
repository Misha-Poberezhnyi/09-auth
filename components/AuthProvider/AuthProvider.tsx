'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { checkSession } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import QueryStatus from '../QueryStatus/QueryStatus';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const setUser = useAuthStore(state => state.setUser);
  const clearIsAuthenticated = useAuthStore(state => state.clearIsAuthenticated);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initializeAuth() {
      try {
        const sessionUser = await checkSession();
        if (sessionUser && sessionUser.email) {
          setUser(sessionUser);
        } else {
          clearIsAuthenticated();
        }
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
