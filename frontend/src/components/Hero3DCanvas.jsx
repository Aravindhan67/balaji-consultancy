import React, { useEffect, useRef } from 'react';

/**
 * Hero3DCanvas
 * Unique 3D interactive animation for the Hero Stage:
 * 1. Scrolling 3D perspective agro-tech horizon terrain grid
 * 2. Floating 3D rotating wireframe octahedrons & concentric orbital rings
 * 3. Depth-projected glowing 3D particles reacting to pointer/touch parallax
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
    const fov = 460;

    // 3D Octahedron vertices & edges
    const octVertices = [
      { x: 0, y: -1, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 0, y: 0, z: 1 },
      { x: -1, y: 0, z: 0 },
      { x: 0, y: 0, z: -1 },
      { x: 0, y: 1, z: 0 }
    ];
    const octEdges = [
      [0, 1], [0, 2], [0, 3], [0, 4],
      [5, 1], [5, 2], [5, 3], [5, 4],
      [1, 2], [2, 3], [3, 4], [4, 1]
    ];

    // 3D Cube vertices & edges
    const cubeVertices = [
      { x: -1, y: -1, z: -1 }, { x: 1, y: -1, z: -1 },
      { x: 1, y: 1, z: -1 }, { x: -1, y: 1, z: -1 },
      { x: -1, y: -1, z: 1 }, { x: 1, y: -1, z: 1 },
      { x: 1, y: 1, z: 1 }, { x: -1, y: 1, z: 1 }
    ];
    const cubeEdges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7]
    ];

    // Floating 3D polyhedrons positioned cleanly on flanks so center text stays legible
    const shapes = [
      {
        type: 'oct',
        x: -360, y: -90, z: 220,
        size: 56,
        rx: 0.4, ry: 0.2, rz: 0.1,
        vrx: 0.008, vry: 0.012, vrz: 0.005,
        color: 'rgba(129, 199, 132, 0.55)'
      },
      {
        type: 'cube',
        x: 370, y: -70, z: 240,
        size: 46,
        rx: 0.2, ry: 0.6, rz: 0.3,
        vrx: -0.007, vry: 0.01, vrz: 0.006,
        color: 'rgba(255, 255, 255, 0.42)'
      },
      {
        type: 'oct',
        x: 290, y: 110, z: 300,
        size: 38,
        rx: 0.8, ry: 0.1, rz: 0.4,
        vrx: 0.01, vry: -0.009, vrz: 0.007,
        color: 'rgba(74, 222, 128, 0.45)'
      },
      {
        type: 'cube',
        x: -290, y: 120, z: 290,
        size: 36,
        rx: 0.5, ry: 0.3, rz: 0.2,
        vrx: 0.009, vry: 0.008, vrz: -0.006,
        color: 'rgba(255, 255, 255, 0.35)'
      }
    ];

    // Depth particles
    const particles = Array.from({ length: 55 }, () => ({
      x: (Math.random() - 0.5) * 1500,
      y: (Math.random() - 0.5) * 800,
      z: Math.random() * 850,
      size: 1.4 + Math.random() * 2,
      speedZ: 0.65 + Math.random() * 0.8,
      alpha: 0.35 + Math.random() * 0.5,
      isGreen: Math.random() > 0.55
    }));

    const rotate3D = (v, rx, ry, rz) => {
      // X rotation
      let y = v.y * Math.cos(rx) - v.z * Math.sin(rx);
      let z = v.y * Math.sin(rx) + v.z * Math.cos(rx);
      let x = v.x;
      // Y rotation
      const x2 = x * Math.cos(ry) + z * Math.sin(ry);
      const z2 = -x * Math.sin(ry) + z * Math.cos(ry);
      // Z rotation
      const x3 = x2 * Math.cos(rz) - y * Math.sin(rz);
      const y3 = x2 * Math.sin(rz) + y * Math.cos(rz);
      return { x: x3, y: y3, z: z2 };
    };

    const project = (p, cx, cy) => {
      const scale = fov / Math.max(40, fov + p.z);
      return {
        px: cx + p.x * scale,
        py: cy + p.y * scale,
        scale
      };
    };

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
      mouse.targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 160;
      mouse.targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 100;
    };

    const handlePointerLeave = () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);

    let gridOffset = 0;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.016;

      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      const cx = width / 2;
      const cy = height / 2;

      // 1. 3D PERSPECTIVE HORIZON TERRAIN GRID (scrolling forward)
      gridOffset = (gridOffset + 1.4) % 80;
      const horizonY = height * 0.56 - mouse.y * 0.15;
      const floorY = 230;
      const gridCols = 14;
      const gridSpacingX = Math.max(90, width / 10);

      ctx.save();
      ctx.lineWidth = 1;

      // Longitudinal 3D lines converging toward horizon
      for (let i = -gridCols; i <= gridCols; i += 1) {
        const worldX = i * gridSpacingX - mouse.x * 0.6;
        const near = project({ x: worldX, y: floorY, z: 20 }, cx, horizonY);
        const far = project({ x: worldX, y: floorY, z: 950 }, cx, horizonY);

        const grad = ctx.createLinearGradient(near.px, near.py, far.px, far.py);
        grad.addColorStop(0, 'rgba(74, 222, 128, 0.28)');
        grad.addColorStop(0.6, 'rgba(255, 255, 255, 0.10)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.moveTo(near.px, near.py);
        ctx.lineTo(far.px, far.py);
        ctx.strokeStyle = grad;
        ctx.stroke();
      }

      // Transverse 3D depth rings scrolling toward viewer
      for (let z = 40; z < 920; z += 80) {
        const activeZ = z - gridOffset;
        if (activeZ <= 15) continue;
        const left = project({ x: -gridCols * gridSpacingX - mouse.x * 0.6, y: floorY, z: activeZ }, cx, horizonY);
        const right = project({ x: gridCols * gridSpacingX - mouse.x * 0.6, y: floorY, z: activeZ }, cx, horizonY);
        const alpha = Math.max(0, (1 - activeZ / 920) * 0.24);

        ctx.beginPath();
        ctx.moveTo(left.px, left.py);
        ctx.lineTo(right.px, right.py);
        ctx.strokeStyle = `rgba(129, 199, 132, ${alpha.toFixed(3)})`;
        ctx.stroke();
      }
      ctx.restore();

      // 2. FLOATING 3D WIREFRAME POLYHEDRONS (Octahedrons & Cubes)
      const isMobile = width < 640;
      const spreadScale = isMobile ? 0.48 : Math.min(1.1, width / 1100);

      shapes.forEach((shape, idx) => {
        shape.rx += shape.vrx;
        shape.ry += shape.vry;
        shape.rz += shape.vrz;

        const floatY = Math.sin(time * 1.4 + idx * 1.6) * 14;
        const baseX = shape.x * spreadScale - mouse.x * (0.45 + idx * 0.1);
        const baseY = shape.y + floatY - mouse.y * (0.35 + idx * 0.08);
        const baseZ = shape.z;

        const verts = shape.type === 'oct' ? octVertices : cubeVertices;
        const edges = shape.type === 'oct' ? octEdges : cubeEdges;
        const size = shape.size * (isMobile ? 0.72 : 1);

        const projectedVerts = verts.map((v) => {
          const r = rotate3D(v, shape.rx + mouse.y * 0.002, shape.ry + mouse.x * 0.002, shape.rz);
          return project(
            {
              x: baseX + r.x * size,
              y: baseY + r.y * size,
              z: baseZ + r.z * size
            },
            cx,
            cy
          );
        });

        ctx.beginPath();
        edges.forEach(([a, b]) => {
          ctx.moveTo(projectedVerts[a].px, projectedVerts[a].py);
          ctx.lineTo(projectedVerts[b].px, projectedVerts[b].py);
        });
        ctx.strokeStyle = shape.color;
        ctx.lineWidth = 1.25;
        ctx.stroke();

        // Glowing vertex nodes
        projectedVerts.forEach((pt) => {
          ctx.beginPath();
          ctx.arc(pt.px, pt.py, 2.1 * pt.scale, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.fill();
        });
      });

      // 3. DEPTH PARTICLES FLYING TOWARD CAMERA
      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.z -= p.speedZ;
        if (p.z <= 10) {
          p.z = 850;
          p.x = (Math.random() - 0.5) * 1500;
          p.y = (Math.random() - 0.5) * 800;
        }

        const scale = fov / (fov + p.z);
        const px = cx + (p.x - mouse.x * (1 - p.z / 850)) * scale;
        const py = cy + (p.y - mouse.y * (1 - p.z / 850)) * scale;

        if (px < -30 || px > width + 30 || py < -30 || py > height + 30) continue;

        const depthFade = Math.max(0, 1 - p.z / 850);
        const r = Math.max(0.9, p.size * scale * 1.3);

        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = p.isGreen
          ? `rgba(74, 222, 128, ${(p.alpha * depthFade * 0.9).toFixed(3)})`
          : `rgba(255, 255, 255, ${(p.alpha * depthFade * 0.75).toFixed(3)})`;
        ctx.fill();
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
