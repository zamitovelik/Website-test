import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/use-auth';

/**
 * Пускает дальше только вошедших. Пока проверяется сохранённый токен,
 * показывает заглушку — иначе страница успела бы мигнуть переходом на вход.
 */
export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080A19] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-white/40 animate-spin" />
      </div>
    );
  }

  if (!user) {
    // Запоминаем, куда человек шёл, чтобы вернуть его туда после входа.
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
