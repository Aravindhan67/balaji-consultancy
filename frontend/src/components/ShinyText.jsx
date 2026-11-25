import React from 'react';
import './ShinyText.css';

/**
 * ShinyText Component from React Bits
 * Adds a smooth, gleaming shimmer effect across text.
 */
export const ShinyText = ({
  text,
  children,
  disabled = false,
  speed = 4,
  variant = 'dark', // 'dark' | 'green' | 'light'
  className = ''
}) => {
  const content = text || children;
  const speedStyle = { animationDuration: `${speed}s` };

  const variantClass = 
    variant === 'green' ? 'shiny-text-green' :
    variant === 'light' ? 'shiny-text-light' : 'shiny-text-dark';

  return (
    <span
      className={`${variantClass} ${disabled ? 'disabled' : ''} ${className}`}
      style={speedStyle}
    >
      {content}
    </span>
  );
};

export default ShinyText;
