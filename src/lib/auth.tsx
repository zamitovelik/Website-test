import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ApiError,
  clearToken,
  fetchMe,
  getToken,
  login as apiLogin,
  register as apiRegister,
  saveToken,
  type AuthUser,
} from '@/lib/api';
import { AuthContext } from '@/lib/auth-context';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // При открытии сайта проверяем сохранённый токен: он мог истечь или быть
  // выпущен другим пользователем, поэтому доверять ему без проверки нельзя.
  useEffect(() => {
    let cancelled = false;

    if (!getToken()) {
      setLoading(false);
      return;
    }

    fetchMe()
      .then((me) => {
        if (!cancelled) setUser(me);
      })
      .catch((err) => {
        // 401 — токен просрочен или отозван; сеть недоступна — оставляем как есть.
        if (err instanceof ApiError && err.status === 401) clearToken();
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string, remember: boolean) => {
    const result = await apiLogin(email, password);
    saveToken(result.access_token, remember);
    setUser(result.user);
  }, []);

  const signUp = useCallback(
    async (data: { email: string; full_name: string; password: string }) => {
      const result = await apiRegister(data);
      // Новый аккаунт запоминаем: человек только что его создал и вряд ли
      // хочет вводить пароль заново на следующей странице.
      saveToken(result.access_token, true);
      setUser(result.user);
    },
    []
  );

  const signOut = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, signIn, signUp, signOut }),
    [user, loading, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
