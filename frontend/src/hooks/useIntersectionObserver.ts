import { useEffect, useRef } from 'react';

export function useIntersectionObserver(
  callback: () => void,
  options: IntersectionObserverInit = {}
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callback();
        }
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [callback, options]);

  return ref;
}
