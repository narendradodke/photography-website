import { useState, useEffect } from 'react';

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return prefersReducedMotion;
}
