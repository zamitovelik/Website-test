import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * При смене маршрута прокручивает вверх, а при переходе по якорю (#analytics)
 * — к нужному блоку.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname, hash]);

  return null;
}
