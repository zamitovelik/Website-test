import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AlertCircle, Check, Loader2 } from 'lucide-react';
import PageShell from '@/components/PageShell';
import Animate from '@/components/Animate';
import { inputBase, labelBase } from '@/lib/ui';
import { useAuth } from '@/lib/use-auth';

const MIN_PASSWORD = 8;

export default function Register() {
  const { user, loading: checking, signUp } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', full_name: '', password: '', repeat: '' });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  if (!checking && user) {
    return <Navigate to="/leads" replace />;
  }

  const passwordLongEnough = form.password.length >= MIN_PASSWORD;
  const passwordsMatch = form.password.length > 0 && form.password === form.repeat;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordLongEnough) {
      setError(`Пароль должен быть не короче ${MIN_PASSWORD} символов.`);
      return;
    }
    if (!passwordsMatch) {
      setError('Пароли не совпадают.');
      return;
    }

    setSending(true);
    setError(null);

    try {
      await signUp({
        email: form.email,
        full_name: form.full_name,
        password: form.password,
      });
      navigate('/leads', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось создать аккаунт.');
    } finally {
      setSending(false);
    }
  };

  return (
    <PageShell
      narrow
      title="Создать аккаунт"
      lead="Регистрация занимает минуту — почта, имя и пароль."
    >
      <Animate delay={500} direction="scale">
        <div className="rounded-[24px] bg-[rgba(17,16,15,0.45)] border border-white/[0.08] backdrop-blur-[30px] p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label htmlFor="regName" className={labelBase}>
                Имя
              </label>
              <input
                id="regName"
                disabled={sending}
                autoComplete="name"
                value={form.full_name}
                onChange={(e) => update('full_name', e.target.value)}
                placeholder="Анна Иванова"
                className={inputBase}
              />
            </div>

            <div>
              <label htmlFor="regEmail" className={labelBase}>
                Почта
              </label>
              <input
                id="regEmail"
                type="email"
                required
                disabled={sending}
                autoComplete="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="name@company.ru"
                className={inputBase}
              />
            </div>

            <div>
              <label htmlFor="regPassword" className={labelBase}>
                Пароль
              </label>
              <input
                id="regPassword"
                type="password"
                required
                disabled={sending}
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                placeholder="Не короче 8 символов"
                className={inputBase}
              />
              {form.password.length > 0 && (
                <p
                  className={`mt-2 text-[12px] font-[450] leading-[12px] flex items-center gap-1.5 ${
                    passwordLongEnough ? 'text-emerald-300/80' : 'text-white/45'
                  }`}
                >
                  {passwordLongEnough && <Check className="w-3 h-3" />}
                  {passwordLongEnough
                    ? 'Длина подходит'
                    : `Ещё ${MIN_PASSWORD - form.password.length} символов`}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="regRepeat" className={labelBase}>
                Повторите пароль
              </label>
              <input
                id="regRepeat"
                type="password"
                required
                disabled={sending}
                autoComplete="new-password"
                value={form.repeat}
                onChange={(e) => update('repeat', e.target.value)}
                placeholder="••••••••"
                className={inputBase}
              />
              {form.repeat.length > 0 && !passwordsMatch && (
                <p className="mt-2 text-[12px] font-[450] leading-[12px] text-[#F5B8C1]">
                  Пароли не совпадают
                </p>
              )}
            </div>

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
              {sending ? 'Создаём…' : 'Создать аккаунт'}
            </button>
          </form>

          <div className="h-px bg-white/10 my-6" />

          <p className="text-center text-white/60 text-[14px] font-[450] leading-[1.5]">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-white hover:underline">
              Войти
            </Link>
          </p>
        </div>
      </Animate>
    </PageShell>
  );
}
