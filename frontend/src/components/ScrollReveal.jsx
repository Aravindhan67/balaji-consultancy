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
      threshold: options.threshold || 0.12,
      rootMargin: options.rootMargin || '0px 0px -30px 0px'
    });

    observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [options.threshold, options.rootMargin, options.once]);

  return [ref, isInView];
}

/**
 * ScrollReveal Wrapper Component with 3D perspective depth entrance animations
 */
export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  once = true
}) {
  const [ref, isInView] = useInView({ threshold: 0.1, once });

  const getTransformStyle = () => {
    if (isInView) return 'perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0) scale3d(1, 1, 1)';
    switch (direction) {
      case 'up':
        return 'perspective(1000px) rotateX(6deg) translate3d(0, 32px, -16px) scale3d(0.98, 0.98, 1)';
      case 'down':
        return 'perspective(1000px) rotateX(-6deg) translate3d(0, -32px, -16px) scale3d(0.98, 0.98, 1)';
      case 'left':
        return 'perspective(1000px) rotateY(-6deg) translate3d(32px, 0, -16px) scale3d(0.98, 0.98, 1)';
      case 'right':
        return 'perspective(1000px) rotateY(6deg) translate3d(-32px, 0, -16px) scale3d(0.98, 0.98, 1)';
      case 'scale':
        return 'perspective(1000px) scale3d(0.92, 0.92, 1) translate3d(0, 12px, -24px)';
      default:
        return 'perspective(1000px) rotateX(5deg) translate3d(0, 28px, 0)';
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

export default ScrollReveal;
