import { useEffect, useRef } from 'react';

type Grain = {
  x: number;
  y: number;
};

const GrainOverlay = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const spacing = 34;
    const baseRadius = 0.7;
    const hoverRadius = 1.8;
    const influence = 150;
    const pullDistance = 18;

    let animationFrame: number | null = null;
    let grains: Grain[] = [];

    const scheduleDraw = () => {
      if (animationFrame !== null) return;
      animationFrame = requestAnimationFrame(() => {
        animationFrame = null;
        draw();
      });
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      grains = [];
      const cols = Math.ceil(width / spacing) + 2;
      const rows = Math.ceil(height / spacing) + 2;

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          grains.push({
            x: col * spacing - spacing,
            y: row * spacing - spacing,
          });
        }
      }

      scheduleDraw();
    };

    const draw = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const { x: px, y: py } = pointer.current;

      ctx.clearRect(0, 0, width, height);

      for (const grain of grains) {
        const dx = px - grain.x;
        const dy = py - grain.y;
        const distance = Math.hypot(dx, dy);

        let x = grain.x;
        let y = grain.y;
        let radius = baseRadius;
        let alpha = 0.11;

        if (distance < influence) {
          const strength = 1 - distance / influence;
          const pull = pullDistance * strength;
          const angle = Math.atan2(dy, dx);

          x += Math.cos(angle) * pull;
          y += Math.sin(angle) * pull;
          radius = baseRadius + (hoverRadius - baseRadius) * strength;
          alpha = 0.14 + 0.34 * strength;
        }

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.current = { x: event.clientX, y: event.clientY };
      scheduleDraw();
    };

    const onPointerLeave = () => {
      pointer.current = { x: -9999, y: -9999 };
      scheduleDraw();
    };

    resize();
    scheduleDraw();

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerleave', onPointerLeave);

    return () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} id="grain-canvas" aria-hidden="true" />;
};

export default GrainOverlay;
