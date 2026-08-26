import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Building2, Check, LifeBuoy, Loader2, MessageSquare } from 'lucide-react';
import PageShell from '@/components/PageShell';
import Animate from '@/components/Animate';
import { btnSubtle, inputBase, labelBase } from '@/lib/ui';
import { submitContactRequest } from '@/lib/api';

const TOPICS = [
  'Вопрос по платформе',
  'Условия корпоративного тарифа',
  'Техническая поддержка',
  'Партнёрство',
];

const CHANNELS = [
  {
    icon: MessageSquare,
    title: 'Отдел продаж',
    text: 'Подбор тарифа, расчёт стоимости и условия для больших команд.',
    meta: 'Ответ в течение рабочего дня',
  },
  {
    icon: LifeBuoy,
    title: 'Инженерная поддержка',
    text: 'Помощь с подключением источников, API и миграцией данных.',
    meta: 'Ответ за 2 часа в рабочее время',
  },
  {
    icon: Building2,
    title: 'Корпоративные внедрения',
    text: 'Размещение в вашем контуре, требования безопасности и аудит.',
    meta: 'Выделенный менеджер проекта',
  },
];

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [serverMessage, setServerMessage] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    topic: TOPICS[0],
    message: '',
  });

  const update = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setError(null);

    try {
      const result = await submitContactRequest(form);
      setServerMessage(result.message);
      setStatus('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось отправить сообщение.');
      setStatus('idle');
    }
  };

  const sending = status === 'sending';

  return (
    <PageShell
      eyebrow="Контакты"
      title="Поговорить с командой"
      lead="Расскажите о задаче — подключим нужного специалиста: инженера, аналитика или менеджера по внедрению."
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-6 lg:gap-10">
        <Animate delay={500} direction="up">
          <div className="rounded-[24px] bg-[rgba(17,16,15,0.45)] border border-white/[0.08] backdrop-blur-[30px] p-6 sm:p-8">
            {status === 'sent' ? (
              <div className="text-center py-6">
                <div className="w-[56px] h-[56px] rounded-full bg-[#E9E9E9] flex items-center justify-center mx-auto mb-6">
                  <Check className="w-6 h-6 text-[#0A0707]" />
                </div>
                <p className="text-white text-[20px] font-[450] leading-[1.3] mb-3">
                  Сообщение отправлено
                </p>
                <p className="text-white/65 text-[15px] font-[450] leading-[1.55] mb-8 max-w-[420px] mx-auto">
                  {serverMessage}
                </p>
                <button
                  onClick={() => {
                    setForm({ name: '', email: '', topic: TOPICS[0], message: '' });
                    setStatus('idle');
                  }}
                  className={btnSubtle}
                >
                  Написать ещё раз
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="cname" className={labelBase}>
                      Как к вам обращаться
                    </label>
                    <input
                      id="cname"
                      required
                      disabled={sending}
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      placeholder="Анна Иванова"
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label htmlFor="cemail" className={labelBase}>
                      Почта для ответа
                    </label>
                    <input
                      id="cemail"
                      type="email"
                      required
                      disabled={sending}
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      placeholder="name@company.ru"
                      className={inputBase}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="topic" className={labelBase}>
                    Тема обращения
                  </label>
                  <select
                    id="topic"
                    disabled={sending}
                    value={form.topic}
                    onChange={(e) => update('topic', e.target.value)}
                    className={`${inputBase} appearance-none cursor-pointer`}
                  >
                    {TOPICS.map((t) => (
                      <option key={t} value={t} className="bg-[#080A19]">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className={labelBase}>
                    Сообщение
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    required
                    disabled={sending}
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                    placeholder="Опишите задачу, стек и объём данных — так ответ будет предметнее"
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
                  {sending ? 'Отправляем…' : 'Отправить сообщение'}
                </button>
              </form>
            )}
          </div>
        </Animate>

        <div className="flex flex-col gap-5">
          {CHANNELS.map((c, i) => {
            const Icon = c.icon;
            return (
              <Animate key={c.title} delay={650 + i * 100} direction="up">
                <div className="rounded-[20px] bg-[rgba(17,16,15,0.35)] border border-white/[0.07] backdrop-blur-[20px] p-6">
                  <div className="w-[40px] h-[40px] rounded-[11px] bg-white/[0.08] border border-white/10 flex items-center justify-center mb-4">
                    <Icon className="w-[18px] h-[18px] text-white" />
                  </div>
                  <p className="text-white text-[17px] font-[450] leading-[1.3] mb-2">{c.title}</p>
                  <p className="text-white/65 text-[14px] font-[450] leading-[1.5] mb-3">
                    {c.text}
                  </p>
                  <p className="text-white/40 text-[13px] font-[450] leading-[13px]">{c.meta}</p>
                </div>
              </Animate>
            );
          })}

          <Animate delay={950} direction="up">
            <p className="text-white/55 text-[14px] font-[450] leading-[1.55]">
              Хотите сразу увидеть платформу в работе?{' '}
              <Link to="/demo" className="text-white hover:underline">
                Записаться на демо
              </Link>
              .
            </p>
          </Animate>
        </div>
      </div>
    </PageShell>
  );
}
