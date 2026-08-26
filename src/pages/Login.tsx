import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import PageShell from '@/components/PageShell';
import Animate from '@/components/Animate';
import { inputBase, labelBase } from '@/lib/ui';
import { useAuth } from '@/lib/use-auth';

export default function Login() {
  const { user, loading: checking, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Куда шёл человек до того, как его отправили на вход.
  const from = (location.state as { from?: string } | null)?.from ?? '/leads';

  if (!checking && user) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    try {
      await signIn(email, password, remember);
      setPassword('');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось войти.');
    } finally {
      setSending(false);
    }
  };

  return (
    <PageShell
      narrow
      title="Вход в Apogee"
      lead="Войдите, чтобы посмотреть заявки, оставленные на сайте."
    >
      <Animate delay={500} direction="scale">
        <div className="rounded-[24px] bg-[rgba(17,16,15,0.45)] border border-white/[0.08] backdrop-blur-[30px] p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label htmlFor="email" className={labelBase}>
                Рабочая почта
              </label>
              <input
                id="email"
                type="email"
                required
                disabled={sending}
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.ru"
                className={inputBase}
              />
            </div>

            <div>
              <label htmlFor="password" className={`${labelBase} mb-2`}>
                Пароль
              </label>
              <input
                id="password"
                type="password"
                required
                disabled={sending}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputBase}
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <span
                onClick={() => setRemember(!remember)}
                className={`w-[20px] h-[20px] rounded-[6px] border flex items-center justify-center transition-colors ${
                  remember ? 'bg-[#E9E9E9] border-transparent' : 'bg-white/[0.04] border-white/20'
                }`}
              >
                {remember && (
                  <svg width="11" height="9" viewBox="0 0 11 9" fill="none" aria-hidden="true">
                    <path
                      d="M1 4.5L4 7.5L10 1.5"
                      stroke="#0A0707"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="sr-only"
              />
              <span className="text-white/70 text-[14px] font-[450]">Запомнить меня</span>
            </label>

            {error && (
              <div className="flex items-start gap-3 rounded-[12px] bg-[#C43648]/15 border border-[#C43648]/40 p-4">
                <AlertCircle className="w-4 h-4 mt-[2px] shrink-0 text-[#F08898]" />
                <p className="text-[#F5B8C1] text-[13px] font-[450] leading-[1.5]">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={sending}
              className="w-full h-[51px] flex items-center justify-center gap-2 bg-[#E9E9E9] rounded-[12px] text-[#0A0707] text-[15.5px] font-[450] leading-[15.5px] transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {sending && <Loader2 className="w-4 h-4 animate-spin" />}
              {sending ? 'Проверяем…' : 'Войти'}
            </button>
          </form>

          <div className="h-px bg-white/10 my-6" />

          <p className="text-center text-white/60 text-[14px] font-[450] leading-[1.5]">
            Аккаунты создаёт администратор.{' '}
            <Link to="/contact" className="text-white hover:underline">
              Напишите нам
            </Link>
            , если нужен доступ.
          </p>
        </div>
      </Animate>
    </PageShell>
  );
}
