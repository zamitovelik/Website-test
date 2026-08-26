import { createContext } from 'react';
import type { AuthUser } from '@/lib/api';

export type AuthState = {
  user: AuthUser | null;
  /** true, пока проверяем сохранённый токен при загрузке страницы. */
  loading: boolean;
  signIn: (email: string, password: string, remember: boolean) => Promise<void>;
  signUp: (data: { email: string; full_name: string; password: string }) => Promise<void>;
  signOut: () => void;
};

export const AuthContext = createContext<AuthState | null>(null);
