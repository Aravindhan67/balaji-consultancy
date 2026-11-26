import React, { useEffect, useRef } from 'react';

/**
 * Hero3DCanvas
 * 21st.dev & React Bits inspired Background Animation:
 * 1. Volumetric Diagonal Light Beams swaying gently across the twilight yard
 * 2. Shooting Meteor Light Streaks across the upper sky
 * 3. Interactive 3D Isometric / Hexagonal Matrix that illuminates near the cursor with click ripples
 */
export const Hero3DCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let animationFrameId;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const mouse = { x: -9999, y: -9999, targetX: -9999, targetY: -9999, active: false };
    const ripples = [];

    // 1. Volumetric Diagonal Light Beams
    const beams = [
      { xRatio: 0.18, width: 150, angle: 0.34, speed: 0.4, phase: 0, color: [74, 222, 128], alpha: 0.11 },
      { xRatio: 0.45, width: 220, angle: 0.38, speed: 0.3, phase: 1.8, color: [251, 191, 36], alpha: 0.08 },
      { xRatio: 0.72, width: 180, angle: 0.32, speed: 0.45, phase: 3.5, color: [134, 239, 172], alpha: 0.1 },
      { xRatio: 0.88, width: 130, angle: 0.36, speed: 0.35, phase: 5.1, color: [255, 255, 255], alpha: 0.07 }
    ];

    // 2. Shooting Meteor Streaks
    const createMeteor = (randomStart = false) => ({
      x: Math.random() * (width || 1200) * 1.2,
      y: randomStart ? Math.random() * (height || 600) * 0.6 : -40,
      length: 70 + Math.random() * 90,
      speed: 4.5 + Math.random() * 4,
      angle: Math.PI * 0.72, // sweeping down-left
      alpha: 0.45 + Math.random() * 0.4,
      isGold: Math.random() > 0.55,
      wait: randomStart ? 0 : Math.floor(Math.random() * 140)
    });

    const meteors = Array.from({ length: 7 }, () => createMeteor(true));

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.active = true;
    };

    const handlePointerLeave = () => {
      mouse.active = false;
    };

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      ripples.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        radius: 10,
        maxRadius: 340,
        alpha: 0.65
      });
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('click', handleClick);

    let time = 0;

    const drawHexagon = (cx, cy, r) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i += 1) {
        const a = (Math.PI / 3) * i + Math.PI / 6;
        const hx = cx + r * Math.cos(a);
        const hy = cy + r * Math.sin(a) * 0.82; // slight 3D isometric squash
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.016;

      if (mouse.active) {
        if (mouse.x < -1000) {
          mouse.x = mouse.targetX;
          mouse.y = mouse.targetY;
        } else {
          mouse.x += (mouse.targetX - mouse.x) * 0.12;
          mouse.y += (mouse.targetY - mouse.y) * 0.12;
        }
      }

      // 1. VOLUMETRIC DIAGONAL LIGHT BEAMS
      beams.forEach((beam) => {
        const sway = Math.sin(time * beam.speed + beam.phase) * 55;
        const startX = width * beam.xRatio + sway;
        const dx = Math.sin(beam.angle) * height * 1.3;
        const dy = Math.cos(beam.angle) * height * 1.3;

        const grad = ctx.createLinearGradient(startX, -40, startX + dx * 0.5, dy);
        grad.addColorStop(0, `rgba(${beam.color[0]}, ${beam.color[1]}, ${beam.color[2]}, ${beam.alpha})`);
        grad.addColorStop(0.55, `rgba(${beam.color[0]}, ${beam.color[1]}, ${beam.color[2]}, ${(beam.alpha * 0.45).toFixed(3)})`);
        grad.addColorStop(1, `rgba(${beam.color[0]}, ${beam.color[1]}, ${beam.color[2]}, 0)`);

        ctx.beginPath();
        ctx.moveTo(startX - beam.width * 0.35, -40);
        ctx.lineTo(startX + beam.width * 0.35, -40);
        ctx.lineTo(startX + dx + beam.width * 1.2, dy);
        ctx.lineTo(startX + dx - beam.width * 0.6, dy);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
      });

      // 2. INTERACTIVE 3D ISOMETRIC HEXAGONAL MATRIX
      const hexR = width < 640 ? 28 : 34;
      const horizStep = hexR * Math.sqrt(3);
      const vertStep = hexR * 1.5 * 0.82;
      const rows = Math.ceil(height / vertStep) + 1;
      const cols = Math.ceil(width / horizStep) + 1;

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const offsetX = row % 2 === 0 ? 0 : horizStep / 2;
          const hx = col * horizStep + offsetX;
          const hy = row * vertStep;

          // Subtle wave glow + cursor proximity + click ripples
          let energy = 0.045 + 0.03 * Math.sin(time * 1.4 + col * 0.35 + row * 0.45);

          if (mouse.active) {
            const dist = Math.hypot(hx - mouse.x, hy - mouse.y);
            if (dist < 180) {
              energy += (1 - dist / 180) * 0.32;
            }
          }

          for (let r = 0; r < ripples.length; r += 1) {
            const rp = ripples[r];
            const dist = Math.hypot(hx - rp.x, hy - rp.y);
            const band = Math.abs(dist - rp.radius);
            if (band < 48) {
              energy += (1 - band / 48) * rp.alpha * 0.45;
            }
          }

          if (energy > 0.055) {
            drawHexagon(hx, hy, hexR * 0.92);
            ctx.strokeStyle = `rgba(134, 239, 172, ${Math.min(0.45, energy).toFixed(3)})`;
            ctx.lineWidth = energy > 0.16 ? 1.25 : 0.75;
            ctx.stroke();

            if (energy > 0.18) {
              ctx.fillStyle = `rgba(46, 125, 50, ${((energy - 0.15) * 0.3).toFixed(3)})`;
              ctx.fill();
            }
          }
        }
      }

      // Update click ripples
      for (let i = ripples.length - 1; i >= 0; i -= 1) {
        const rp = ripples[i];
        rp.radius += 6.5;
        rp.alpha *= 0.96;
        if (rp.radius > rp.maxRadius || rp.alpha < 0.02) {
          ripples.splice(i, 1);
        }
      }

      // 3. SHOOTING METEOR STREAKS
      meteors.forEach((m, idx) => {
        if (m.wait > 0) {
          m.wait -= 1;
          return;
        }

        const vx = Math.cos(m.angle) * m.speed;
        const vy = Math.sin(m.angle) * m.speed;
        m.x += vx;
        m.y += vy;

        const tailX = m.x - Math.cos(m.angle) * m.length;
        const tailY = m.y - Math.sin(m.angle) * m.length;

        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        const headColor = m.isGold ? `rgba(253, 230, 138, ${m.alpha})` : `rgba(134, 239, 172, ${m.alpha})`;
        grad.addColorStop(0, headColor);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Bright meteor head
        ctx.beginPath();
        ctx.arc(m.x, m.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        if (m.y > height + 60 || m.x < -100) {
          meteors[idx] = createMeteor(false);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    />
  );
};

export default Hero3DCanvas;
