import React, { useEffect, useRef } from 'react';

/**
 * Hero3DCanvas
 * Lightweight 60fps 3D perspective particle & constellation depth field.
 * Projects 3D (x, y, z) coordinates with camera parallax reacting to pointer movement.
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

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const particleCount = 65;
    const fov = 420;
    const maxDepth = 900;

    const particles = Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * 1600,
      y: (Math.random() - 0.5) * 900,
      z: Math.random() * maxDepth,
      size: 1.5 + Math.random() * 2.2,
      speedZ: 0.45 + Math.random() * 0.7,
      alpha: 0.35 + Math.random() * 0.5,
      isGreen: Math.random() > 0.65
    }));

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
      mouse.targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 140;
      mouse.targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 90;
    };

    const handlePointerLeave = () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      const cx = width / 2;
      const cy = height / 2;

      const projected = [];

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.z -= p.speedZ;
        if (p.z <= 10) {
          p.z = maxDepth;
          p.x = (Math.random() - 0.5) * 1600;
          p.y = (Math.random() - 0.5) * 900;
        }

        const scale = fov / (fov + p.z);
        const px = cx + (p.x - mouse.x * (1 - p.z / maxDepth)) * scale;
        const py = cy + (p.y - mouse.y * (1 - p.z / maxDepth)) * scale;

        if (px < -40 || px > width + 40 || py < -40 || py > height + 40) continue;

        const depthFade = Math.max(0, 1 - p.z / maxDepth);
        const r = Math.max(0.8, p.size * scale * 1.3);

        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = p.isGreen
          ? `rgba(129, 199, 132, ${(p.alpha * depthFade * 0.85).toFixed(3)})`
          : `rgba(255, 255, 255, ${(p.alpha * depthFade * 0.65).toFixed(3)})`;
        ctx.fill();

        projected.push({ px, py, depthFade });
      }

      // Draw subtle 3D constellation lines between nearby particles
      ctx.lineWidth = 0.7;
      for (let i = 0; i < projected.length; i += 1) {
        for (let j = i + 1; j < projected.length; j += 1) {
          const a = projected[i];
          const b = projected[j];
          const dx = a.px - b.px;
          const dy = a.py - b.py;
          const distSq = dx * dx + dy * dy;
          if (distSq < 15000) {
            const lineAlpha = (1 - distSq / 15000) * Math.min(a.depthFade, b.depthFade) * 0.22;
            ctx.beginPath();
            ctx.moveTo(a.px, a.py);
            ctx.lineTo(b.px, b.py);
            ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha.toFixed(3)})`;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
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
