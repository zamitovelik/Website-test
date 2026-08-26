import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import PageShell from '@/components/PageShell';
import Animate from '@/components/Animate';
import { btnSubtle, inputBase, labelBase } from '@/lib/ui';

const TEAM_SIZES = ['1–10 человек', '11–50 человек', '51–200 человек', 'Более 200 человек'];

const BENEFITS = [
  'Подключим один из ваших источников за 30 минут',
  'Покажем метрики и прогнозы на реальных данных',
  'Ответим на вопросы по безопасности и размещению',
  'Оценим сроки внедрения под вашу инфраструктуру',
];

export default function Demo() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    size: TEAM_SIZES[1],
    comment: '',
  });

  const update = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Демонстрационная форма: заявка не уходит на сервер.
    setSent(true);
  };

  if (sent) {
    return (
      <PageShell narrow title="Заявка заполнена" lead="Спасибо! Вот что было бы дальше.">
        <Animate delay={400} direction="scale">
          <div className="rounded-[24px] bg-[rgba(17,16,15,0.45)] border border-white/[0.08] backdrop-blur-[30px] p-8 text-center">
            <div className="w-[56px] h-[56px] rounded-full bg-[#E9E9E9] flex items-center justify-center mx-auto mb-6">
              <Check className="w-6 h-6 text-[#0A0707]" />
            </div>
            <p className="text-white text-[20px] font-[450] leading-[1.3] mb-3">
              {form.name ? `${form.name}, форма заполнена корректно` : 'Форма заполнена корректно'}
            </p>
            <p className="text-white/65 text-[15px] font-[450] leading-[1.55] mb-8">
              На настоящем сайте команда связалась бы с вами в течение рабочего дня. Здесь это
              демонстрационный проект: заявка никуда не отправлена и нигде не сохранена.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button onClick={() => setSent(false)} className={btnSubtle}>
                Заполнить ещё раз
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
                  value={form.comment}
                  onChange={(e) => update('comment', e.target.value)}
                  placeholder="Например: свести данные из CRM и биллинга в один прогноз выручки"
                  className={`${inputBase} h-auto py-3 resize-y leading-[1.5]`}
                />
              </div>

              <button
                type="submit"
                className="w-full h-[51px] bg-[#E9E9E9] rounded-[12px] text-[#0A0707] text-[15.5px] font-[450] leading-[15.5px] transition-opacity hover:opacity-90"
              >
                Отправить заявку
              </button>

              <p className="text-white/40 text-[12px] font-[450] leading-[1.5] text-center">
                Демонстрационная форма — данные не покидают вашу вкладку.
              </p>
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
