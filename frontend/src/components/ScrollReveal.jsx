import React, { useEffect, useRef, useState } from 'react';

/**
 * Hook to detect when an element scrolls into view using IntersectionObserver
 */
export function useInView(options = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        if (options.once !== false) {
          observer.unobserve(entry.target);
        }
      } else if (options.once === false) {
        setIsInView(false);
      }
    }, {
      threshold: options.threshold || 0.15,
      rootMargin: options.rootMargin || '0px 0px -40px 0px'
    });

    observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [options.threshold, options.rootMargin, options.once]);

  return [ref, isInView];
}

/**
 * ScrollReveal Wrapper Component for humanable, subtle entrance animations
 */
export function ScrollReveal({ 
  children, 
  className = '', 
  delay = 0, 
  direction = 'up',
  once = true 
}) {
  const [ref, isInView] = useInView({ threshold: 0.12, once });

  const getTransformStyle = () => {
    if (isInView) return 'translate3d(0, 0, 0)';
    switch (direction) {
      case 'up': return 'translate3d(0, 28px, 0)';
      case 'down': return 'translate3d(0, -28px, 0)';
      case 'left': return 'translate3d(28px, 0, 0)';
      case 'right': return 'translate3d(-28px, 0, 0)';
      case 'scale': return 'scale3d(0.96, 0.96, 1)';
      default: return 'translate3d(0, 24px, 0)';
    }
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${className}`}
      style={{
        opacity: isInView ? 1 : 0,
        transform: getTransformStyle(),
        transitionDelay: `${delay}ms`,
        willChange: 'opacity, transform'
      }}
    >
      {children}
    </div>
  );
}
