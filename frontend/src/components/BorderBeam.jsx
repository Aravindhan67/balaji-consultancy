import React from 'react';
import './BorderBeam.css';

/**
 * BorderBeam from 21st.dev / Magic UI
 * Renders an animated beam of light traveling along the border of its parent container.
 */
export const BorderBeam = ({
  size = 180,
  duration = 8,
  delay = 0,
  borderWidth = 2,
  colorFrom = '#2E7D32',
  colorTo = '#86EFAC',
  className = ''
}) => {
  return (
    <div
      className={`border-beam-wrapper ${className}`}
      style={{
        '--beam-size': size,
        '--beam-duration': duration,
        '--beam-delay': delay,
        '--beam-border-width': borderWidth,
        '--beam-from': colorFrom,
        '--beam-to': colorTo
      }}
    >
      <div className="border-beam-dot" />
    </div>
  );
};

export default BorderBeam;
