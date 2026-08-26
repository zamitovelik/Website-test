import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronDown } from 'lucide-react';
import PageShell from '@/components/PageShell';
import Animate from '@/components/Animate';
import { btnLight, btnSubtle } from '@/lib/ui';

type Plan = {
  name: string;
  monthly: number | null;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
  ctaTo: string;
};

const PLANS: Plan[] = [
  {
    name: 'Старт',
    monthly: 39000,
    description: 'Для небольших команд, которые только выстраивают аналитику.',
    features: [
      'До 5 пользователей',
      '10 источников данных',
      '1 млн событий в месяц',
      'Базовые предиктивные модели',
      'Хранение истории 6 месяцев',
      'Поддержка по почте',
    ],
    cta: 'Начать бесплатно',
    ctaTo: '/demo',
  },
  {
    name: 'Профессиональный',
    monthly: 129000,
    description: 'Для растущих продуктовых и аналитических команд.',
    features: [
      'До 25 пользователей',
      'Неограниченные источники данных',
      '50 млн событий в месяц',
      'Полный набор предиктивных моделей',
      'Хранение истории 24 месяца',
      'Приоритетная поддержка и SLA 99,9%',
      'Общие дашборды и оповещения',
    ],
    highlighted: true,
    cta: 'Записаться на демо',
    ctaTo: '/demo',
  },
  {
    name: 'Корпоративный',
    monthly: null,
    description: 'Для компаний с требованиями к контуру и безопасности.',
    features: [
      'Неограниченное число пользователей',
      'Размещение в вашем контуре или on-premise',
      'Неограниченный объём событий',
      'Собственные модели и обучение на ваших данных',
      'Бессрочное хранение истории',
      'SLA 99,99% и выделенный менеджер',
      'SSO/SAML, журнал аудита, ролевой доступ',
    ],
    cta: 'Обсудить условия',
    ctaTo: '/contact',
  },
];

const FAQ = [
  {
    q: 'Можно ли попробовать платформу до оплаты?',
    a: 'Да. Мы открываем полный доступ на 14 дней без привязки карты — с вашими реальными источниками данных и помощью инженера при подключении.',
  },
  {
    q: 'Что считается событием?',
    a: 'Событие — это одна строка данных, поступившая в платформу: транзакция, действие пользователя, запись из выгрузки. Повторная обработка одного и того же события не тарифицируется.',
  },
  {
    q: 'Что произойдёт при превышении лимита?',
    a: 'Сбор данных не останавливается. Мы уведомляем администратора и предлагаем перейти на следующий тариф, пересчитывая стоимость пропорционально остатку периода.',
  },
  {
    q: 'Можно ли сменить тариф в середине периода?',
    a: 'Да, в любой момент. При повышении тарифа доплачивается только разница за оставшиеся дни, при понижении остаток переносится на следующий период.',
  },
];

const formatPrice = (value: number) => value.toLocaleString('ru-RU');

export default function Pricing() {
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <PageShell
      eyebrow="Тарифы"
      title="Прозрачная цена за предсказуемый результат"
      lead="Один и тот же движок аналитики на всех тарифах — различаются объём данных, глубина моделей и уровень поддержки."
    >
      <Animate delay={500} direction="up" className="mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-[5px] p-[3px] bg-[rgba(0,0,0,0.35)] rounded-[13px] backdrop-blur-[17px] border border-white/[0.06]">
          <button
            onClick={() => setYearly(false)}
            className={`h-[46px] px-6 rounded-[11px] text-[14px] font-[450] leading-[14px] transition-colors ${
              !yearly ? 'bg-[#E9E9E9] text-[#0A0707]' : 'text-white/70 hover:text-white'
            }`}
          >
            Помесячно
          </button>
          <button
            onClick={() => setYearly(true)}
            className={`h-[46px] px-6 rounded-[11px] text-[14px] font-[450] leading-[14px] transition-colors ${
              yearly ? 'bg-[#E9E9E9] text-[#0A0707]' : 'text-white/70 hover:text-white'
            }`}
          >
            За год
            <span className={yearly ? 'text-[#0A0707]/60' : 'text-white/40'}> −20%</span>
          </button>
        </div>
      </Animate>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 mb-16 sm:mb-24">
        {PLANS.map((plan, i) => (
          <Animate key={plan.name} delay={600 + i * 120} direction="up" className="h-full">
            <div
              className={`h-full flex flex-col rounded-[24px] p-6 sm:p-8 backdrop-blur-[20px] transition-colors ${
                plan.highlighted
                  ? 'bg-[rgba(233,233,233,0.10)] border border-white/25'
                  : 'bg-[rgba(17,16,15,0.35)] border border-white/[0.07] hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-white text-[20px] font-[450] leading-[20px]">{plan.name}</p>
                {plan.highlighted && (
                  <span className="px-[8px] py-[6px] bg-white/20 rounded-[6px] text-white text-[11px] font-[450] leading-[11px]">
                    Популярный
                  </span>
                )}
              </div>

              <p className="text-white/60 text-[14px] font-[450] leading-[1.45] mb-6 min-h-[40px]">
                {plan.description}
              </p>

              <div className="mb-6">
                {plan.monthly === null ? (
                  <p className="text-white text-[34px] font-[450] leading-[1]">Индивидуально</p>
                ) : (
                  <>
                    <p className="text-white text-[38px] sm:text-[42px] font-[450] leading-[1]">
                      {formatPrice(yearly ? Math.round(plan.monthly * 0.8) : plan.monthly)}
                      <span className="text-white/20"> ₽</span>
                    </p>
                    <p className="text-white/50 text-[13px] font-[450] leading-[13px] mt-2">
                      в месяц {yearly ? '· при оплате за год' : '· без учёта НДС'}
                    </p>
                  </>
                )}
              </div>

              <ul className="flex flex-col gap-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 mt-[2px] shrink-0 text-white/70" />
                    <span className="text-white/80 text-[14px] font-[450] leading-[1.4]">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={plan.ctaTo}
                className={`mt-auto w-full ${plan.highlighted ? btnLight : btnSubtle}`}
              >
                {plan.cta}
              </Link>
            </div>
          </Animate>
        ))}
      </div>

      <Animate delay={900} direction="up">
        <h2 className="text-white text-[26px] sm:text-[34px] font-normal leading-[1.1] mb-6 sm:mb-8">
          Частые вопросы
        </h2>

        <div className="flex flex-col gap-2 max-w-[880px]">
          {FAQ.map((item, i) => {
            const open = openFaq === i;
            return (
              <div
                key={item.q}
                className="rounded-[16px] bg-[rgba(17,16,15,0.35)] border border-white/[0.07] backdrop-blur-[20px] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(open ? null : i)}
                  aria-expanded={open}
                  className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-5 text-left transition-colors hover:bg-white/[0.03]"
                >
                  <span className="text-white text-[15px] sm:text-[17px] font-[450] leading-[1.35]">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 text-white/50 transition-transform duration-300 ${
                      open ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                    open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 sm:px-6 pb-5 text-white/65 text-[14px] sm:text-[15px] font-[450] leading-[1.55]">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Animate>
    </PageShell>
  );
}
