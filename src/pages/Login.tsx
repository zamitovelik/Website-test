import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';
import PageShell from '@/components/PageShell';
import Animate from '@/components/Animate';
import { inputBase, labelBase } from '@/lib/ui';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Демонстрационная форма: данные никуда не отправляются.
    setSubmitted(true);
  };

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

            <button
              type="submit"
              className="w-full h-[51px] bg-[#E9E9E9] rounded-[12px] text-[#0A0707] text-[15.5px] font-[450] leading-[15.5px] transition-opacity hover:opacity-90"
            >
              Войти
            </button>
          </form>

          {submitted && (
            <div className="mt-5 flex items-start gap-3 rounded-[12px] bg-white/[0.06] border border-white/10 p-4">
              <Info className="w-4 h-4 mt-[2px] shrink-0 text-white/60" />
              <p className="text-white/70 text-[13px] font-[450] leading-[1.5]">
                Это демонстрационный сайт: авторизация не подключена, и введённые данные никуда
                не отправляются и нигде не сохраняются.
              </p>
            </div>
          )}

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
