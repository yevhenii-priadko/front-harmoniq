'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';

export default function AuthSessionChecker() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        });

        if (response.status === 401) {
          clearAuth();
        }
      } catch {}
    };

    checkSession();
  }, [isAuthenticated, clearAuth]);

  return null;
}