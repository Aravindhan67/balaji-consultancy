import React, { useEffect, useState } from 'react';
import { useInView } from './ScrollReveal';

export function AnimatedCounter({ 
  end = 0, 
  prefix = '', 
  suffix = '', 
  duration = 1800,
  className = '' 
}) {
  const [ref, isInView] = useInView({ threshold: 0.2 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const endNum = typeof end === 'string' ? parseFloat(end.replace(/[^0-9.]/g, '')) : end;
    if (isNaN(endNum) || endNum === 0) {
      setCount(end);
      return;
    }

    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing: cubic-bezier(0.22, 1, 0.36, 1)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(start + (endNum - start) * easeProgress);

      setCount(currentVal);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setCount(endNum);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
}
