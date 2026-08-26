import { Link } from 'react-router-dom';
import { Activity, Boxes, Brain, ShieldCheck } from 'lucide-react';
import PageShell from '@/components/PageShell';
import Animate from '@/components/Animate';
import { btnLight, btnSubtle } from '@/lib/ui';

const SECTIONS = [
  {
    id: 'analytics',
    icon: Activity,
    title: 'Аналитика в реальном времени',
    text: 'Потоковый движок обрабатывает события по мере поступления: медианная задержка от источника до дашборда — 200 мс. Метрики пересчитываются инкрементально, поэтому объём истории не влияет на скорость ответа.',
    points: [
      'Задержка от источника до дашборда — 200 мс',
      'Инкрементальный пересчёт агрегатов',
      'Оповещения по аномалиям в метриках',
      'Срезы по любой размерности без предагрегации',
    ],
  },
  {
    id: 'models',
    icon: Brain,
    title: 'Предиктивные модели',
    text: 'Готовые модели прогноза выручки, оттока и спроса обучаются на ваших данных и переобучаются автоматически при дрейфе. Каждый прогноз сопровождается интервалом уверенности и объяснением вклада факторов.',
    points: [
      'Прогноз выручки, оттока и спроса',
      'Автопереобучение при дрейфе данных',
      'Интервалы уверенности для каждого прогноза',
      'Объяснение вклада факторов в результат',
    ],
  },
  {
    id: 'integrations',
    icon: Boxes,
    title: 'Интеграции',
    text: 'Более 120 коннекторов к базам данных, хранилищам, платёжным и рекламным системам. Подключение источника занимает минуты, схема определяется автоматически, изменения структуры отслеживаются без ручной правки.',
    points: [
      'Более 120 готовых коннекторов',
      'Автоматическое определение схемы',
      'Отслеживание изменений структуры источника',
      'Открытый REST и GraphQL API',
    ],
  },
  {
    id: 'security',
    icon: ShieldCheck,
    title: 'Безопасность',
    text: 'Данные шифруются при передаче и хранении. Доступ настраивается по ролям вплоть до отдельных колонок, а все действия пользователей попадают в неизменяемый журнал аудита.',
    points: [
      'Шифрование при передаче и хранении',
      'Ролевой доступ вплоть до колонок',
      'Неизменяемый журнал аудита',
      'SSO/SAML и размещение в вашем контуре',
    ],
  },
];

const STATS = [
  { value: '200 мс', label: 'медианная задержка обработки' },
  { value: '120+', label: 'готовых коннекторов' },
  { value: '99,99%', label: 'доступность на корпоративном тарифе' },
  { value: '50 млрд', label: 'событий обрабатывается ежемесячно' },
];

export default function Platform() {
  return (
    <PageShell
      eyebrow="Платформа"
      title="Один движок для всей аналитики компании"
      lead="Сбор, обработка, прогнозирование и доступ к данным — в единой системе, без склеивания пяти разных инструментов."
    >
      <Animate delay={500} direction="up" className="mb-16 sm:mb-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-[20px] bg-[rgba(17,16,15,0.35)] border border-white/[0.07] backdrop-blur-[20px] p-5 sm:p-6"
            >
              <p className="text-white text-[26px] sm:text-[32px] font-[450] leading-[1]">
                {s.value}
              </p>
              <p className="text-white/55 text-[13px] font-[450] leading-[1.4] mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </Animate>

      <div className="flex flex-col gap-5 lg:gap-6 mb-16 sm:mb-24">
        {SECTIONS.map((section, i) => {
          const Icon = section.icon;
          return (
            <Animate key={section.id} delay={600 + i * 100} direction="up">
              <section
                id={section.id}
                className="scroll-mt-28 rounded-[24px] bg-[rgba(17,16,15,0.35)] border border-white/[0.07] backdrop-blur-[20px] p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-14"
              >
                <div>
                  <div className="w-[44px] h-[44px] rounded-[12px] bg-white/[0.08] border border-white/10 flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-white text-[24px] sm:text-[30px] font-normal leading-[1.15] mb-4">
                    {section.title}
                  </h2>
                  <p className="text-white/70 text-[15px] sm:text-[16px] font-[450] leading-[1.55]">
                    {section.text}
                  </p>
                </div>

                <ul className="flex flex-col gap-3 lg:border-l lg:border-white/[0.08] lg:pl-10">
                  {section.points.map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-3 text-white/80 text-[14px] sm:text-[15px] font-[450] leading-[1.45]"
                    >
                      <span className="mt-[7px] w-[5px] h-[5px] rounded-full bg-white/40 shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </section>
            </Animate>
          );
        })}
      </div>

      <Animate delay={1000} direction="scale">
        <div className="rounded-[24px] bg-[rgba(233,233,233,0.08)] border border-white/20 backdrop-blur-[20px] p-8 sm:p-12 text-center">
          <h2 className="text-white text-[26px] sm:text-[36px] font-normal leading-[1.1] mb-4">
            Посмотрите платформу на ваших данных
          </h2>
          <p className="text-white/70 text-[15px] sm:text-[17px] font-[450] leading-[1.5] max-w-[560px] mx-auto mb-8">
            Подключим один источник за 30 минут и покажем, как выглядят ваши метрики и прогнозы.
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <Link to="/demo" className={btnLight}>
              Записаться на демо
            </Link>
            <Link to="/pricing" className={btnSubtle}>
              Смотреть тарифы
            </Link>
          </div>
        </div>
      </Animate>
    </PageShell>
  );
}
