import React from 'react';
import './GradientText.css';

/**
 * GradientText from React Bits
 * Renders text with a smoothly flowing multi-stop animated gradient.
 */
export const GradientText = ({
  children,
  className = '',
  colors = ['#2E7D32', '#66BB6A', '#D97706', '#2E7D32'],
  animationSpeed = 6,
  showBorder = false
}) => {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(', ')})`,
    animationDuration: `${animationSpeed}s`
  };

  return (
    <span className={`animated-gradient-text ${className}`}>
      {showBorder && <span className="gradient-overlay" style={gradientStyle} />}
      <span className="text-content" style={gradientStyle}>
        {children}
      </span>
    </span>
  );
};

export default GradientText;
