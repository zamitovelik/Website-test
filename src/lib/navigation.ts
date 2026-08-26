export type NavLink = {
  label: string;
  to: string;
  hasDropdown?: boolean;
};

export const NAV_LINKS: NavLink[] = [
  { label: 'Платформа', to: '/platform', hasDropdown: true },
  { label: 'Тарифы', to: '/pricing' },
  { label: 'Ресурсы', to: '/resources' },
  { label: 'Блог', to: '/blog' },
];

export type PlatformMenuItem = {
  label: string;
  description: string;
  to: string;
};

export const PLATFORM_MENU: PlatformMenuItem[] = [
  {
    label: 'Аналитика в реальном времени',
    description: 'Потоковая обработка событий с задержкой до 200 мс',
    to: '/platform#analytics',
  },
  {
    label: 'Предиктивные модели',
    description: 'Прогнозы спроса, оттока и выручки из коробки',
    to: '/platform#models',
  },
  {
    label: 'Интеграции',
    description: 'Более 120 коннекторов к базам и сервисам',
    to: '/platform#integrations',
  },
  {
    label: 'Безопасность',
    description: 'SSO, аудит доступа и размещение в вашем контуре',
    to: '/platform#security',
  },
];
