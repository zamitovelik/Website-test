import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Check, Loader2 } from 'lucide-react';
import PageShell from '@/components/PageShell';
import Animate from '@/components/Animate';
import { btnSubtle, inputBase, labelBase } from '@/lib/ui';
import { clearToken, login, type AuthUser } from '@/lib/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [status, setStatus] = useState<'idle' | 'sending'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setError(null);

    try {
      const result = await login(email, password, remember);
      setUser(result.user);
      setPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось войти.');
    } finally {
      setStatus('idle');
    }
  };

  if (user) {
    return (
      <PageShell narrow title="Вы вошли" lead="Сессия открыта, токен сохранён в браузере.">
        <Animate delay={400} direction="scale">
          <div className="rounded-[24px] bg-[rgba(17,16,15,0.45)] border border-white/[0.08] backdrop-blur-[30px] p-8 text-center">
            <div className="w-[56px] h-[56px] rounded-full bg-[#E9E9E9] flex items-center justify-center mx-auto mb-6">
              <Check className="w-6 h-6 text-[#0A0707]" />
            </div>
            <p className="text-white text-[20px] font-[450] leading-[1.3] mb-2">
              {user.full_name || user.email}
            </p>
            <p className="text-white/50 text-[14px] font-[450] leading-[1.5] mb-8">{user.email}</p>
            <button
              onClick={() => {
                clearToken();
                sessionStorage.removeItem('apogee_token');
                setUser(null);
              }}
              className={btnSubtle}
            >
              Выйти
            </button>
          </div>
        </Animate>
      </PageShell>
    );
  }

  const sending = status === 'sending';

  return (
    <PageShell
      narrow
      title="Вход в Apogee"
      lead="Войдите, чтобы вернуться к своим дашбордам и прогнозам."
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
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className={`${labelBase} mb-0`}>
                  Пароль
                </label>
                <button
                  type="button"
                  className="text-white/50 text-[13px] font-[450] leading-[13px] hover:text-white transition-colors"
                >
                  Забыли пароль?
                </button>
              </div>
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
            Ещё нет аккаунта?{' '}
            <Link to="/demo" className="text-white hover:underline">
              Запросите демо
            </Link>
          </p>
        </div>
      </Animate>
    </PageShell>
  );
}
