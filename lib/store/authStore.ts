import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AuthUser = {
  _id: string;
  username: string;
  email: string;
  avatar?: string | null;
};

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser) => void;
  updateUser: (user: Partial<AuthUser>) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      user: null,
      isAuthenticated: false,

      setUser: user =>
        set({
          user,
          isAuthenticated: true,
        }),

      updateUser: user =>
        set(state => ({
          user: state.user
            ? {
                ...state.user,
                ...user,
              }
            : null,
        })),

      clearAuth: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'harmoniq-auth',
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
