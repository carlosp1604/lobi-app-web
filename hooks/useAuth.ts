import { useState } from 'react';

interface User {
  id: string;
  userName: string;
  username: string;
  avatarUrl: string | null;
}

export type AuthStatus = 'unauthenticated' | 'authenticated' | 'loading'

export function useAuth() {
  const [status, setStatus] = useState<AuthStatus>('unauthenticated');

  const user: User | null = status === 'authenticated'
    ? {
      id: "usr_123456",
      userName: "Carlos Pontón",
      username: "elAdmin69",
      avatarUrl: "/avatars/user.png"
    }
    : null;

  return {
    status,
    user,
    login: async () => {
      setStatus('loading')
      await new Promise((resolve) => {
        setTimeout(resolve, 3000)
      })
      setStatus('authenticated')},
    logout: async () => {
      setStatus('loading')
      await new Promise((resolve) => {
        setTimeout(resolve, 3000)

      })
      setStatus('unauthenticated')
    },
  };
}
