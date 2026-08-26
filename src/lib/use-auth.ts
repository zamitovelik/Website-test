import { useContext } from 'react';
import { AuthContext, type AuthState } from '@/lib/auth-context';

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен вызываться внутри AuthProvider');
  }
  return context;
}
