import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';

const FOOTER_COLUMNS = [
  {
    title: 'Продукт',
    links: [
      { label: 'Платформа', to: '/platform' },
      { label: 'Тарифы', to: '/pricing' },
      { label: 'Записаться на демо', to: '/demo' },
    ],
  },
  {
    title: 'Материалы',
    links: [
      { label: 'Ресурсы', to: '/resources' },
      { label: 'Блог', to: '/blog' },
      { label: 'Документация', to: '/resources' },
    ],
  },
  {
    title: 'Компания',
    links: [
      { label: 'Связаться с нами', to: '/contact' },
      { label: 'Войти', to: '/login' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.07] mt-auto">
      <div className="w-full max-w-[1800px] mx-auto px-5 sm:px-8 md:px-[82px] py-10 sm:py-14">
        <div className="flex flex-col md:flex-row md:justify-between gap-10">
          <div className="max-w-[300px]">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <Logo />
              <span className="text-white text-[22px] font-[450] leading-none tracking-[-0.02em]">
                Apogee
              </span>
            </Link>
            <p className="text-white/50 text-[14px] font-[450] leading-[1.5]">
              Аналитическая платформа для команд, которые принимают решения на данных, а не на
              догадках.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-14">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="text-white text-[14px] font-[450] leading-[14px] mb-4">
                  {col.title}
                </p>
                <ul className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-white/50 text-[14px] font-[450] leading-[14px] hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 sm:mt-14 pt-6 border-t border-white/[0.07] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-white/40 text-[13px] font-[450] leading-[13px]">
            © {new Date().getFullYear()} Apogee. Все права защищены.
          </p>
          <p className="text-white/40 text-[13px] font-[450] leading-[13px]">
            Демонстрационный проект — формы не отправляют данные на сервер.
          </p>
        </div>
      </div>
    </footer>
  );
}
