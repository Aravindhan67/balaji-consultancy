import React, { useEffect, useRef, useState } from 'react';

/**
 * NumberTicker from 21st.dev / React Bits
 * Smoothly rolls up numbers when scrolled into view.
 */
export const NumberTicker = ({
  value = 100,
  direction = 'up',
  delay = 0,
  className = '',
  decimalPlaces = 0,
  prefix = '',
  suffix = ''
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const elementRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            setTimeout(() => {
              const start = direction === 'down' ? value : 0;
              const end = direction === 'down' ? 0 : value;
              const duration = 1800; // ms
              const startTime = performance.now();

              const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease-out cubic
                const ease = 1 - Math.pow(1 - progress, 3);
                const current = start + (end - start) * ease;

                setDisplayValue(current);

                if (progress < 1) {
                  requestAnimationFrame(animate);
                } else {
                  setDisplayValue(end);
                }
              };

              requestAnimationFrame(animate);
            }, delay * 1000);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [value, direction, delay]);

  const formatted = displayValue.toLocaleString('en-IN', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  });

  return (
    <span ref={elementRef} className={`tabular-nums ${className}`}>
      {prefix}{formatted}{suffix}
    </span>
  );
};

export default NumberTicker;
