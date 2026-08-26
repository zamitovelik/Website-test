import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Check, Loader2 } from 'lucide-react';
import PageShell from '@/components/PageShell';
import Animate from '@/components/Animate';
import { btnSubtle, inputBase, labelBase } from '@/lib/ui';
import { submitDemoRequest } from '@/lib/api';

const TEAM_SIZES = ['1–10 человек', '11–50 человек', '51–200 человек', 'Более 200 человек'];

const BENEFITS = [
  'Подключим один из ваших источников за 30 минут',
  'Покажем метрики и прогнозы на реальных данных',
  'Ответим на вопросы по безопасности и размещению',
  'Оценим сроки внедрения под вашу инфраструктуру',
];

export default function Demo() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [serverMessage, setServerMessage] = useState('');
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    size: TEAM_SIZES[1],
    comment: '',
  });

  const update = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setError(null);

    try {
      const result = await submitDemoRequest({
        name: form.name,
        company: form.company,
        email: form.email,
        team_size: form.size,
        comment: form.comment,
      });
      setServerMessage(result.message);
      setStatus('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось отправить заявку.');
      setStatus('idle');
    }
  };

  if (status === 'sent') {
    return (
      <PageShell narrow title="Заявка отправлена" lead="Спасибо! Мы уже получили её.">
        <Animate delay={400} direction="scale">
          <div className="rounded-[24px] bg-[rgba(17,16,15,0.45)] border border-white/[0.08] backdrop-blur-[30px] p-8 text-center">
            <div className="w-[56px] h-[56px] rounded-full bg-[#E9E9E9] flex items-center justify-center mx-auto mb-6">
              <Check className="w-6 h-6 text-[#0A0707]" />
            </div>
            <p className="text-white text-[20px] font-[450] leading-[1.3] mb-3">
              {form.name ? `${form.name}, заявка принята` : 'Заявка принята'}
            </p>
            <p className="text-white/65 text-[15px] font-[450] leading-[1.55] mb-8">
              {serverMessage}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => {
                  setForm({ name: '', company: '', email: '', size: TEAM_SIZES[1], comment: '' });
                  setStatus('idle');
                }}
                className={btnSubtle}
              >
                Отправить ещё одну
              </button>
              <Link to="/platform" className={btnSubtle}>
                Изучить платформу
              </Link>
            </div>
          </div>
        </Animate>
      </PageShell>
    );
  }

  const sending = status === 'sending';

  return (
    <PageShell
      eyebrow="Демонстрация"
      title="Записаться на демо"
      lead="Покажем платформу на ваших данных и ответим на вопросы — встреча занимает около 40 минут."
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-6 lg:gap-10">
        <Animate delay={500} direction="up">
          <div className="rounded-[24px] bg-[rgba(17,16,15,0.45)] border border-white/[0.08] backdrop-blur-[30px] p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className={labelBase}>
                    Имя и фамилия
                  </label>
                  <input
                    id="name"
                    required
                    disabled={sending}
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="Анна Иванова"
                    className={inputBase}
                  />
                </div>
                <div>
                  <label htmlFor="company" className={labelBase}>
                    Компания
                  </label>
                  <input
                    id="company"
                    required
                    disabled={sending}
                    value={form.company}
                    onChange={(e) => update('company', e.target.value)}
                    placeholder="ООО «Компания»"
                    className={inputBase}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="workEmail" className={labelBase}>
                  Рабочая почта
                </label>
                <input
                  id="workEmail"
                  type="email"
                  required
                  disabled={sending}
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="name@company.ru"
                  className={inputBase}
                />
              </div>

              <div>
                <label htmlFor="size" className={labelBase}>
                  Размер команды
                </label>
                <select
                  id="size"
                  disabled={sending}
                  value={form.size}
                  onChange={(e) => update('size', e.target.value)}
                  className={`${inputBase} appearance-none cursor-pointer`}
                >
                  {TEAM_SIZES.map((s) => (
                    <option key={s} value={s} className="bg-[#080A19]">
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="comment" className={labelBase}>
                  Какую задачу хотите решить?
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  disabled={sending}
                  value={form.comment}
                  onChange={(e) => update('comment', e.target.value)}
                  placeholder="Например: свести данные из CRM и биллинга в один прогноз выручки"
                  className={`${inputBase} h-auto py-3 resize-y leading-[1.5]`}
                />
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
                {sending ? 'Отправляем…' : 'Отправить заявку'}
              </button>
            </form>
          </div>
        </Animate>

        <Animate delay={650} direction="up">
          <div className="rounded-[24px] bg-[rgba(17,16,15,0.35)] border border-white/[0.07] backdrop-blur-[20px] p-6 sm:p-8 h-full">
            <h2 className="text-white text-[20px] font-[450] leading-[1.3] mb-6">
              Что будет на встрече
            </h2>
            <ul className="flex flex-col gap-4 mb-8">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <Check className="w-4 h-4 mt-[3px] shrink-0 text-white/70" />
                  <span className="text-white/80 text-[14px] sm:text-[15px] font-[450] leading-[1.45]">
                    {b}
                  </span>
                </li>
              ))}
            </ul>

            <div className="h-px bg-white/10 mb-6" />

            <p className="text-white/60 text-[14px] font-[450] leading-[1.55]">
              Уже пользуетесь платформой?{' '}
              <Link to="/login" className="text-white hover:underline">
                Войдите в аккаунт
              </Link>
              .
            </p>
          </div>
        </Animate>
      </div>
    </PageShell>
  );
}
