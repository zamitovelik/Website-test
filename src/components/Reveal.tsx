import { useEffect, useRef, useState } from 'react';

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
};

const directionClasses = {
  up: 'animate-fade-up',
  down: 'animate-fade-down',
  left: 'animate-fade-left',
  right: 'animate-fade-right',
  scale: 'animate-fade-scale',
};

/**
 * То же появление, что и у Animate, но запускается при прокрутке до элемента.
 * Нужно для блоков ниже первого экрана: иначе они «отыграют» анимацию,
 * пока их ещё не видно.
 *
 * Содержимое скрыто через opacity-0 и раскрывается скриптом, поэтому здесь
 * намеренно три независимых пути показа — чтобы блок не остался невидимым:
 *   1) IntersectionObserver — основной, самый экономный;
 *   2) проверка позиции при монтировании — если элемент уже в зоне видимости;
 *   3) обработчик прокрутки — страховка на случай, если наблюдатель не сработал
 *      (например, страница отрисована в фоновой вкладке).
 * Плюс мгновенный показ, если пользователь просил уменьшить анимацию.
 */
export default function Reveal({
  children,
  delay = 0,
  className = '',
  direction = 'up',
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Пользователям с отключённой анимацией показываем сразу.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    let done = false;
    let lastCheck = 0;

    const reveal = () => {
      if (done) return;
      done = true;
      cleanup();
      setVisible(true);
    };

    // Намеренно без проверки нижней границы: элемент, который уже ушёл вверх
    // за пределы окна, тоже должен считаться показанным. Иначе прыжок прокрутки
    // (переход по якорю, Ctrl+End, восстановление позиции браузером) мог бы
    // перескочить блок, и тот остался бы невидимым навсегда.
    const hasReachedRevealLine = () => el.getBoundingClientRect().top < window.innerHeight - 60;

    // Троттлинг по времени, а не через requestAnimationFrame: rAF не выполняется,
    // пока вкладка скрыта, и страховка тогда бы не сработала.
    const onScroll = () => {
      const now = Date.now();
      if (now - lastCheck < 100) return;
      lastCheck = now;
      if (hasReachedRevealLine()) reveal();
    };

    const observer =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) reveal();
            },
            { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
          )
        : null;

    function cleanup() {
      observer?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    }

    observer?.observe(el);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Блок мог оказаться в зоне видимости уже на момент монтирования.
    if (hasReachedRevealLine()) reveal();

    return cleanup;
  }, []);

  return (
    <div
      ref={ref}
      className={`${visible ? directionClasses[direction] : 'opacity-0'} ${className}`}
      style={visible ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
