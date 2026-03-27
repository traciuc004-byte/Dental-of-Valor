import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Attempt smooth scroll if browser supports it, otherwise instant
    try {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'instant',
      });
    } catch (e) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
