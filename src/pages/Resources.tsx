import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, BookOpen, Code2, GraduationCap, LifeBuoy, PlayCircle, Users } from 'lucide-react';
import PageShell from '@/components/PageShell';
import Animate from '@/components/Animate';
import { btnLight } from '@/lib/ui';

type Resource = {
  icon: typeof BookOpen;
  category: 'Обучение' | 'Разработчикам' | 'Сообщество';
  title: string;
  description: string;
  meta: string;
};

const RESOURCES: Resource[] = [
  {
    icon: BookOpen,
    category: 'Обучение',
    title: 'Документация',
    description: 'Полное описание платформы: подключение источников, модель данных, настройка прав и оповещений.',
    meta: '240 статей',
  },
  {
    icon: GraduationCap,
    category: 'Обучение',
    title: 'Гайды по внедрению',
    description: 'Пошаговые сценарии: от первого подключённого источника до продуктовых дашбордов для всей команды.',
    meta: '18 сценариев',
  },
  {
    icon: Code2,
    category: 'Разработчикам',
    title: 'Справочник API',
    description: 'REST и GraphQL, SDK для Python, TypeScript и Go, примеры запросов и лимиты для каждого метода.',
    meta: 'v3 · актуально',
  },
  {
    icon: PlayCircle,
    category: 'Обучение',
    title: 'Вебинары и записи',
    description: 'Разборы реальных внедрений и эфиры с инженерами платформы — с ответами на вопросы зрителей.',
    meta: '32 записи',
  },
  {
    icon: LifeBuoy,
    category: 'Разработчикам',
    title: 'Инженерная поддержка',
    description: 'Ответы на технические вопросы, помощь с миграцией и разбор нестандартных схем данных.',
    meta: 'Ответ за 2 часа',
  },
  {
    icon: Users,
    category: 'Сообщество',
    title: 'Сообщество Apogee',
    description: 'Чат аналитиков и инженеров: обмен практиками, шаблоны дашбордов и запросы на новые функции.',
    meta: '4 200 участников',
  },
];

const CATEGORIES = ['Все', 'Обучение', 'Разработчикам', 'Сообщество'] as const;

export default function Resources() {
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>('Все');

  const visible = RESOURCES.filter((r) => active === 'Все' || r.category === active);

  return (
    <PageShell
      eyebrow="Ресурсы"
      title="Всё, что нужно для запуска и роста"
      lead="Документация, гайды, справочник API и живое сообщество — чтобы команда разобралась с платформой без долгого внедрения."
    >
      <Animate delay={500} direction="up" className="mb-8 sm:mb-10">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`h-[42px] px-5 rounded-[11px] text-[14px] font-[450] leading-[14px] border transition-colors ${
                active === cat
                  ? 'bg-[#E9E9E9] text-[#0A0707] border-transparent'
                  : 'bg-white/[0.04] text-white/70 border-white/10 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </Animate>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16 sm:mb-24">
        {visible.map((r, i) => {
          const Icon = r.icon;
          return (
            <Animate key={r.title} delay={600 + i * 80} direction="up" className="h-full">
              <article className="group h-full flex flex-col rounded-[24px] bg-[rgba(17,16,15,0.35)] border border-white/[0.07] backdrop-blur-[20px] p-6 sm:p-7 transition-colors hover:border-white/20 hover:bg-[rgba(17,16,15,0.5)]">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-[44px] h-[44px] rounded-[12px] bg-white/[0.08] border border-white/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-white/30 transition-all duration-300 group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>

                <p className="text-white/40 text-[12px] font-[450] leading-[12px] uppercase tracking-[0.1em] mb-3">
                  {r.category}
                </p>
                <h2 className="text-white text-[20px] font-[450] leading-[1.2] mb-3">{r.title}</h2>
                <p className="text-white/65 text-[14px] font-[450] leading-[1.5] mb-6">
                  {r.description}
                </p>

                <p className="mt-auto text-white/45 text-[13px] font-[450] leading-[13px]">
                  {r.meta}
                </p>
              </article>
            </Animate>
          );
        })}
      </div>

      <Animate delay={900} direction="scale">
        <div className="rounded-[24px] bg-[rgba(233,233,233,0.08)] border border-white/20 backdrop-blur-[20px] p-8 sm:p-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-[560px]">
            <h2 className="text-white text-[24px] sm:text-[30px] font-normal leading-[1.15] mb-3">
              Не нашли нужный материал?
            </h2>
            <p className="text-white/70 text-[15px] sm:text-[16px] font-[450] leading-[1.5]">
              Напишите команде — подскажем решение или подготовим разбор под вашу задачу.
            </p>
          </div>
          <Link to="/contact" className={`${btnLight} shrink-0`}>
            Связаться с командой
          </Link>
        </div>
      </Animate>
    </PageShell>
  );
}
