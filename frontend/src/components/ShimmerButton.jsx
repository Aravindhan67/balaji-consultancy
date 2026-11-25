import React from 'react';
import './ShimmerButton.css';

/**
 * ShimmerButton from 21st.dev & React Bits
 * High-performance interactive button with sweeping shimmer beam and smooth tactile feedback.
 */
export const ShimmerButton = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary' (green) | 'dark' (charcoal) | 'light' (sand/white) | 'outline'
  shimmerColor = 'rgba(255, 255, 255, 0.4)',
  shimmerDuration = '3s',
  className = '',
  disabled = false,
  ...props
}) => {
  const variantStyles = {
    primary: 'bg-[#2E7D32] hover:bg-[#236628] text-white border-transparent',
    dark: 'bg-[#111111] hover:bg-[#222222] text-white border-transparent',
    light: 'bg-[#FAF8F5] hover:bg-[#EAE3D7] text-[#111111] border-[#E3DBD0]',
    outline: 'bg-transparent hover:bg-[#FAF8F5] text-[#111111] border-[#E3DBD0] hover:border-[#111111]'
  };

  const selectedVariant = variantStyles[variant] || variantStyles.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`shimmer-btn group relative inline-flex items-center justify-center overflow-hidden rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 border ${selectedVariant} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'
      } ${className}`}
      style={{
        '--shimmer-color': shimmerColor,
        '--shimmer-duration': shimmerDuration,
      }}
      {...props}
    >
      {/* Animated Shimmer Light Sweep Effect */}
      <span className="shimmer-effect absolute inset-0 z-0 pointer-events-none" />

      {/* Button Content */}
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </button>
  );
};

export default ShimmerButton;
