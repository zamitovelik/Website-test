import { Link } from 'react-router-dom';
import PageShell from '@/components/PageShell';
import Animate from '@/components/Animate';
import { btnLight, btnSubtle } from '@/lib/ui';

export default function NotFound() {
  return (
    <PageShell
      narrow
      eyebrow="Ошибка 404"
      title="Такой страницы нет"
      lead="Возможно, ссылка устарела или в адресе опечатка."
    >
      <Animate delay={500} direction="up">
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          <Link to="/" className={btnLight}>
            На главную
          </Link>
          <Link to="/platform" className={btnSubtle}>
            Изучить платформу
          </Link>
        </div>
      </Animate>
    </PageShell>
  );
}
