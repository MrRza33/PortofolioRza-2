import React, { useRef, useState, useEffect, ReactElement } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface MagneticProps {
  children: ReactElement;
  intensity?: number;
}

export const Magnetic = ({ children, intensity = 8 }: MagneticProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const mouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice) return;
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    const moveX = ((clientX - (left + width / 2)) / width) * intensity;
    const moveY = ((clientY - (top + height / 2)) / height) * intensity;
    x.set(moveX);
    y.set(moveY);
  };

  const mouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (isTouchDevice || (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    return <>{children}</>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={mouseMove}
      onMouseLeave={mouseLeave}
      style={{ x: springX, y: springY, transformStyle: 'preserve-3d' }}
      className="inline-flex"
    >
      {children}
    </motion.div>
  );
};
