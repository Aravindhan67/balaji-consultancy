import React, { useRef, useState } from 'react';

/**
 * SpotlightCard from React Bits / 21st.dev
 * Renders a card with cursor-tracking radial spotlight glow, subtle 3D tilt, and border highlight.
 */
export const SpotlightCard = ({
  children,
  className = '',
  spotlightColor = 'rgba(46, 125, 50, 0.1)',
  borderGlowColor = 'rgba(46, 125, 50, 0.35)',
  spotlightSize = 350,
  tilt = true,
  maxTilt = 3.5,
  onClick,
  style,
  ...props
}) => {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [tiltTransform, setTiltTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)');

  const handleMouseMove = (e) => {
    if (!divRef.current || isFocused) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPosition({ x, y });

    if (tilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;
      setTiltTransform(
        `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`
      );
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setIsHovered(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setIsHovered(false);
    setTiltTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)');
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTiltTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)');
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative overflow-hidden transition-all duration-300 ease-out will-change-transform ${className}`}
      style={{
        transform: tilt ? tiltTransform : undefined,
        ...style
      }}
      {...props}
    >
      {/* Dynamic Cursor Border Glow Layer */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-20"
        style={{
          opacity: isHovered ? 1 : 0,
          padding: '1px',
          background: `radial-gradient(${Math.round(spotlightSize * 0.7)}px circle at ${position.x}px ${position.y}px, ${borderGlowColor}, transparent 75%)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Dynamic Cursor Spotlight Layer */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(${spotlightSize}px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />
      {children}
    </div>
  );
};

export default SpotlightCard;
