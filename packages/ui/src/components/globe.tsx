import { useEffect, useRef } from 'react';
import createGlobe from 'cobe';
import type { COBEOptions } from 'cobe';
import { useMotionValue, useSpring } from 'framer-motion';

import { cn } from '@workspace/ui/lib/utils';

const MOVEMENT_DAMPING = 1400;

const GLOBE_CONFIG: COBEOptions = {
  width: 1000,
  height: 1000,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.2,
  dark: 1,
  diffuse: 3,
  mapSamples: 16000,
  mapBrightness: 1.8,
  mapBaseBrightness: 0.05,
  baseColor: [1.1, 1.1, 1.1],
  markerColor: [16 / 255, 185 / 255, 129 / 255], // brand-teal
  glowColor: [1.1, 1.1, 1.1],
  opacity: 1,
  offset: [0, 0],
  scale: 1,
  markers: [
    { location: [6.5244, 3.3792], size: 0.1 }, // Lagos
    { location: [9.0765, 7.3986], size: 0.05 }, // Abuja
    { location: [40.7128, -74.006], size: 0.1 },
    { location: [34.6937, 135.5022], size: 0.05 },
    { location: [51.5074, -0.1278], size: 0.1 },
    { location: [35.6762, 139.6503], size: 0.1 },
  ],
};

export function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string;
  config?: COBEOptions;
}) {
  const phiRef = useRef(0);
  const widthRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  const r = useMotionValue(0);
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  });

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? 'grabbing' : 'grab';
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      r.set(r.get() + delta / MOVEMENT_DAMPING);
    }
  };

  useEffect(() => {
    const onResize = () => {
      if (canvasRef.current) {
        widthRef.current = canvasRef.current.offsetWidth;
      }
    };

    window.addEventListener('resize', onResize);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let globe: any;
    const timeout = setTimeout(() => {
      onResize();
      globe = createGlobe(canvasRef.current!, {
        ...config,
        width: widthRef.current * 2,
        height: widthRef.current * 2,
        onRender: (state) => {
          if (!pointerInteracting.current) phiRef.current += 0.005;
          state.phi = phiRef.current + rs.get();
          state.width = widthRef.current * 2;
          state.height = widthRef.current * 2;
        },
      });
      canvasRef.current!.style.opacity = '1';
    }, 100);

    return () => {
      clearTimeout(timeout);
      if (globe) globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, [rs, config]);

  return (
    <div className={cn('relative mx-auto aspect-square w-full', className)}>
      <canvas
        className={cn(
          'w-full h-full opacity-0 transition-opacity duration-1000 contain-[layout_paint_size]'
        )}
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          maxWidth: '100%',
          aspectRatio: '1 / 1',
        }}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX;
          updatePointerInteraction(e.clientX);
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) => e.touches[0] && updateMovement(e.touches[0].clientX)}
      />
    </div>
  );
}
