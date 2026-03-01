import { useEffect } from 'react';

export function useDebouncedEffect(effect: () => void, deps: unknown[], delay: number) {
  useEffect(() => {
    const timer = setTimeout(() => {
      effect();
    }, delay);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delay]);
}
