import { User } from '@/types/user';
import { create } from 'zustand';

type AuthStore = {
  isAuthenticated: boolean;
  user: User | null;
  setUser: (user: User) => void;
  setIsAuthenticated: (value: boolean) => void;
  clearIsAuthenticated: () => void;
};

export const useAuthStore = create<AuthStore>()((set) => ({
  isAuthenticated: false,
  user: null,

  setUser: (user) => {
    set(() => ({
      user,
      isAuthenticated: true,
    }));
  },

  setIsAuthenticated: (value) => {
    set(() => ({ isAuthenticated: value }));
  },

  clearIsAuthenticated: () => {
    set(() => ({
      user: null,
      isAuthenticated: false,
    }));
  },
}));
