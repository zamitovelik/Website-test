import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import PageShell from '@/components/PageShell';
import Animate from '@/components/Animate';

type Post = {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readingTime: string;
  featured?: boolean;
};

const POSTS: Post[] = [
  {
    title: 'Как мы снизили задержку обработки событий до 200 мс',
    excerpt:
      'Разбираем путь от батчевой обработки к потоковой: где терялось время, почему инкрементальные агрегаты оказались важнее железа и что это дало командам аналитики.',
    category: 'Инженерия',
    date: '18 августа 2026',
    readingTime: '9 мин',
    featured: true,
  },
  {
    title: 'Прогноз оттока, которому доверяет команда',
    excerpt:
      'Почему точность модели — не главный критерий, и как объяснимость прогноза меняет то, как продуктовая команда принимает решения.',
    category: 'Модели',
    date: '5 августа 2026',
    readingTime: '7 мин',
  },
  {
    title: 'Дрейф данных: как заметить его раньше отчётов',
    excerpt:
      'Практический разбор метрик, которые сигнализируют о том, что модель пора переобучать, и как автоматизировать этот процесс.',
    category: 'Модели',
    date: '24 июля 2026',
    readingTime: '11 мин',
  },
  {
    title: 'Ролевой доступ на уровне колонок: зачем это нужно',
    excerpt:
      'Как устроен доступ к данным в Apogee и почему разграничение до отдельных полей упрощает работу с персональными данными.',
    category: 'Безопасность',
    date: '11 июля 2026',
    readingTime: '6 мин',
  },
  {
    title: 'Сто двадцать коннекторов спустя: что мы поняли об источниках',
    excerpt:
      'Наблюдения из практики подключения источников: где чаще всего ломается схема и почему автоматическое определение структуры окупается.',
    category: 'Инженерия',
    date: '29 июня 2026',
    readingTime: '8 мин',
  },
  {
    title: 'Метрики, которые стоит считать инкрементально',
    excerpt:
      'Не каждый показатель выигрывает от потоковой обработки. Разбираем, где инкрементальность даёт эффект, а где усложняет систему.',
    category: 'Аналитика',
    date: '14 июня 2026',
    readingTime: '10 мин',
  },
];

const CATEGORIES = ['Все', 'Инженерия', 'Модели', 'Аналитика', 'Безопасность'] as const;

export default function Blog() {
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>('Все');

  const visible = POSTS.filter((p) => active === 'Все' || p.category === active);
  const featured = visible.find((p) => p.featured);
  const rest = visible.filter((p) => p !== featured);

  return (
    <PageShell
      eyebrow="Блог"
      title="Как мы строим аналитику и что из этого выходит"
      lead="Инженерные разборы, практика работы с моделями и наблюдения из внедрений — без маркетинговых обещаний."
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

      {featured && (
        <Animate delay={600} direction="up" className="mb-5">
          <article className="group rounded-[24px] bg-[rgba(17,16,15,0.35)] border border-white/[0.07] backdrop-blur-[20px] p-6 sm:p-10 transition-colors hover:border-white/20 cursor-pointer">
            <div className="flex flex-wrap items-center gap-[10px] mb-5">
              <span className="px-[8px] py-[6px] bg-white/20 rounded-[6px] text-white text-[11px] font-[450] leading-[11px]">
                Читают сейчас
              </span>
              <span className="text-white/50 text-[13px] font-[450] leading-[13px]">
                {featured.category} · {featured.date} · {featured.readingTime}
              </span>
            </div>

            <h2 className="text-white text-[26px] sm:text-[38px] font-normal leading-[1.1] mb-4 max-w-[820px]">
              {featured.title}
            </h2>
            <p className="text-white/70 text-[15px] sm:text-[17px] font-[450] leading-[1.5] max-w-[720px] mb-6">
              {featured.excerpt}
            </p>

            <span className="inline-flex items-center gap-2 text-white text-[14px] font-[450] leading-[14px]">
              Читать статью
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </article>
        </Animate>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rest.map((post, i) => (
          <Animate key={post.title} delay={700 + i * 80} direction="up" className="h-full">
            <article className="group h-full flex flex-col rounded-[24px] bg-[rgba(17,16,15,0.35)] border border-white/[0.07] backdrop-blur-[20px] p-6 sm:p-7 transition-colors hover:border-white/20 hover:bg-[rgba(17,16,15,0.5)] cursor-pointer">
              <p className="text-white/40 text-[12px] font-[450] leading-[12px] uppercase tracking-[0.1em] mb-4">
                {post.category}
              </p>
              <h2 className="text-white text-[19px] font-[450] leading-[1.25] mb-3">
                {post.title}
              </h2>
              <p className="text-white/65 text-[14px] font-[450] leading-[1.5] mb-6">
                {post.excerpt}
              </p>

              <div className="mt-auto flex items-center justify-between">
                <span className="text-white/45 text-[13px] font-[450] leading-[13px]">
                  {post.date} · {post.readingTime}
                </span>
                <ArrowUpRight className="w-5 h-5 text-white/30 transition-all duration-300 group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </article>
          </Animate>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="text-white/50 text-[15px] font-[450]">В этой категории пока нет статей.</p>
      )}
    </PageShell>
  );
}
