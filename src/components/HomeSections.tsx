import { Link } from 'react-router-dom';
import { Activity, ArrowUpRight, Boxes, Brain, Check, ShieldCheck } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { btnLight, btnOutline, btnSubtle } from '@/lib/ui';

const CONTAINER = 'w-full max-w-[1800px] mx-auto px-5 sm:px-8 md:px-[82px]';

const TRUSTED_BY = ['Северсталь', 'Тинькофф', 'Ozon', 'Wildberries', 'Яндекс', 'Авито'];

const FEATURES = [
  {
    icon: Activity,
    title: 'Аналитика в реальном времени',
    text: 'Медианная задержка от источника до дашборда — 200 мс. Метрики пересчитываются инкрементально.',
  },
  {
    icon: Brain,
    title: 'Предиктивные модели',
    text: 'Прогноз выручки, оттока и спроса с интервалами уверенности и объяснением факторов.',
  },
  {
    icon: Boxes,
    title: 'Более 120 интеграций',
    text: 'Базы, хранилища, платёжные и рекламные системы. Схема определяется автоматически.',
  },
  {
    icon: ShieldCheck,
    title: 'Безопасность уровня банка',
    text: 'Шифрование, ролевой доступ до колонок, журнал аудита и размещение в вашем контуре.',
  },
];

const STEPS = [
  {
    n: '01',
    title: 'Подключаем источники',
    text: 'Выбираете коннектор или отдаёте доступ к базе — платформа сама читает схему и начинает собирать события.',
  },
  {
    n: '02',
    title: 'Собираем метрики',
    text: 'Показатели считаются на потоке. Дашборды и оповещения настраиваются без участия разработчиков.',
  },
  {
    n: '03',
    title: 'Получаете прогнозы',
    text: 'Модели обучаются на ваших данных и показывают, что произойдёт дальше — с оценкой уверенности.',
  },
];

const STATS = [
  { value: '200 мс', label: 'медианная задержка обработки' },
  { value: '120+', label: 'готовых коннекторов' },
  { value: '99,99%', label: 'доступность на корпоративном тарифе' },
  { value: '50 млрд', label: 'событий в месяц' },
];

const PLAN_TEASERS = [
  { name: 'Старт', price: '39 000 ₽', note: 'до 5 пользователей' },
  { name: 'Профессиональный', price: '129 000 ₽', note: 'до 25 пользователей', highlighted: true },
  { name: 'Корпоративный', price: 'Индивидуально', note: 'без ограничений' },
];

export default function HomeSections() {
  return (
    <>
      {/* ── Доверие ─────────────────────────────────────────────────────── */}
      <section id="next-section" className="relative py-16 sm:py-20 border-t border-white/[0.06]">
        <div className={CONTAINER}>
          <Reveal>
            <p className="text-white/40 text-[13px] font-[450] leading-[13px] uppercase tracking-[0.12em] text-center mb-8">
              Данным доверяют команды
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
              {TRUSTED_BY.map((name) => (
                <span
                  key={name}
                  className="text-white/35 text-[18px] sm:text-[22px] font-[450] tracking-[-0.01em] transition-colors hover:text-white/70"
                >
                  {name}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Возможности ─────────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-24">
        <div className={CONTAINER}>
          <Reveal className="mb-10 sm:mb-14">
            <h2 className="text-white text-[30px] sm:text-[44px] md:text-[52px] font-normal leading-[1.05] max-w-[720px]">
              Всё, что нужно для решений на данных
            </h2>
            <p className="text-white/60 text-[16px] sm:text-[18px] font-[450] leading-[1.5] max-w-[560px] mt-5">
              Один движок вместо пяти инструментов, которые приходится склеивать вручную.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={f.title} delay={i * 90} className="h-full">
                  <div className="h-full rounded-[24px] bg-[rgba(17,16,15,0.35)] border border-white/[0.07] backdrop-blur-[20px] p-6 sm:p-7 transition-colors hover:border-white/20">
                    <div className="w-[44px] h-[44px] rounded-[12px] bg-white/[0.08] border border-white/10 flex items-center justify-center mb-5">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-white text-[18px] font-[450] leading-[1.25] mb-3">
                      {f.title}
                    </h3>
                    <p className="text-white/60 text-[14px] font-[450] leading-[1.5]">{f.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={200} className="mt-8">
            <Link
              to="/platform"
              className="group inline-flex items-center gap-2 text-white text-[15px] font-[450]"
            >
              Подробнее о платформе
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Как это работает ────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-24 border-t border-white/[0.06]">
        <div className={CONTAINER}>
          <Reveal className="mb-10 sm:mb-14">
            <h2 className="text-white text-[30px] sm:text-[44px] font-normal leading-[1.05] max-w-[640px]">
              Три шага до первого прогноза
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-8">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 120} className="h-full">
                <div className="h-full rounded-[24px] bg-[rgba(17,16,15,0.35)] border border-white/[0.07] backdrop-blur-[20px] p-7 sm:p-8">
                  <p className="text-white/25 text-[46px] font-[450] leading-[1] mb-6">{s.n}</p>
                  <h3 className="text-white text-[20px] font-[450] leading-[1.25] mb-3">
                    {s.title}
                  </h3>
                  <p className="text-white/60 text-[15px] font-[450] leading-[1.55]">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Цифры ───────────────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-20 border-t border-white/[0.06]">
        <div className={CONTAINER}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 90}>
                <p className="text-white text-[32px] sm:text-[46px] font-[450] leading-[1]">
                  {s.value}
                </p>
                <p className="text-white/50 text-[13px] sm:text-[14px] font-[450] leading-[1.4] mt-3">
                  {s.label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Отзыв ───────────────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-24 border-t border-white/[0.06]">
        <div className={CONTAINER}>
          <Reveal direction="scale">
            <blockquote className="rounded-[24px] sm:rounded-[33px] bg-[rgba(17,16,15,0.35)] border border-white/[0.07] backdrop-blur-[20px] p-8 sm:p-14 max-w-[980px] mx-auto text-center">
              <p className="text-white text-[20px] sm:text-[28px] font-[450] leading-[1.35] mb-8">
                «Раньше сведение отчётности занимало три дня в конце месяца. Сейчас цифры
                собираются сами, а мы обсуждаем не то, чьи данные правильные, а что с ними делать».
              </p>
              <footer className="text-white/50 text-[14px] sm:text-[15px] font-[450] leading-[1.4]">
                Мария Ковалёва · директор по аналитике, розничная сеть
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* ── Тарифы кратко ───────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-24 border-t border-white/[0.06]">
        <div className={CONTAINER}>
          <Reveal className="mb-10 sm:mb-14">
            <h2 className="text-white text-[30px] sm:text-[44px] font-normal leading-[1.05] max-w-[640px]">
              Прозрачные тарифы
            </h2>
            <p className="text-white/60 text-[16px] sm:text-[18px] font-[450] leading-[1.5] max-w-[560px] mt-5">
              Один движок на всех тарифах — различаются объём данных и уровень поддержки.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {PLAN_TEASERS.map((p, i) => (
              <Reveal key={p.name} delay={i * 110} className="h-full">
                <div
                  className={`h-full rounded-[24px] p-7 backdrop-blur-[20px] ${
                    p.highlighted
                      ? 'bg-[rgba(233,233,233,0.10)] border border-white/25'
                      : 'bg-[rgba(17,16,15,0.35)] border border-white/[0.07]'
                  }`}
                >
                  <p className="text-white text-[18px] font-[450] leading-[18px] mb-4">{p.name}</p>
                  <p className="text-white text-[30px] font-[450] leading-[1] mb-2">{p.price}</p>
                  <p className="text-white/50 text-[13px] font-[450] leading-[13px] mb-6">
                    {p.note}
                  </p>
                  <div className="flex items-center gap-2 text-white/70 text-[13px] font-[450]">
                    <Check className="w-4 h-4 shrink-0" />
                    14 дней бесплатно
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <Link to="/pricing" className={btnSubtle}>
              Сравнить тарифы
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Финальный призыв ────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-28 border-t border-white/[0.06]">
        <div className={CONTAINER}>
          <Reveal direction="scale">
            <div className="rounded-[24px] sm:rounded-[33px] bg-[rgba(233,233,233,0.08)] border border-white/20 backdrop-blur-[20px] p-8 sm:p-16 text-center">
              <h2 className="text-white text-[30px] sm:text-[48px] font-normal leading-[1.05] mb-5 max-w-[720px] mx-auto">
                Посмотрите платформу на ваших данных
              </h2>
              <p className="text-white/70 text-[16px] sm:text-[18px] font-[450] leading-[1.5] max-w-[540px] mx-auto mb-9">
                Подключим один источник за 30 минут и покажем, как выглядят ваши метрики и
                прогнозы.
              </p>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                <Link to="/demo" className={btnLight}>
                  Записаться на демо
                </Link>
                <Link to="/contact" className={btnOutline}>
                  Поговорить с командой
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
