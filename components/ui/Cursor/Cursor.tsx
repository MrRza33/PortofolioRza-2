import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useCursorContext } from './CursorContext';

export const Cursor = () => {
  const { cursorState } = useCursorContext();
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfigDot = { damping: 25, stiffness: 400, mass: 0.5 };
  const springConfigRing = { damping: 30, stiffness: 200, mass: 1 };

  const dotX = useSpring(cursorX, springConfigDot);
  const dotY = useSpring(cursorY, springConfigDot);

  const ringX = useSpring(cursorX, springConfigRing);
  const ringY = useSpring(cursorY, springConfigRing);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches);
    };
    checkTouch();

    const moveMouse = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);
    
    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    if (!isTouchDevice && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.addEventListener('mousemove', moveMouse);
      window.addEventListener('mouseleave', handleMouseLeave);
      window.addEventListener('mouseenter', handleMouseEnter);
      window.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
      
      document.body.classList.add('custom-cursor-active');
    }

    return () => {
      window.removeEventListener('mousemove', moveMouse);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.classList.remove('custom-cursor-active');
    };
  }, [cursorX, cursorY, isVisible, isTouchDevice]);

  if (isTouchDevice || (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    return null;
  }

  const variants = {
    default: {
      width: 8,
      height: 8,
      opacity: isVisible ? 1 : 0,
      backgroundColor: '#ffffff',
      color: 'rgba(0, 0, 0, 0)',
      borderRadius: '50%',
      scale: isClicked ? 0.8 : 1,
      mixBlendMode: 'difference' as any
    },
    button: {
      width: 70,
      height: 70,
      opacity: isVisible ? 1 : 0,
      backgroundColor: '#ffffff',
      color: '#000000',
      borderRadius: '50%',
      scale: isClicked ? 0.9 : 1,
      mixBlendMode: 'normal' as any
    },
    project: {
      width: 130,
      height: 40,
      borderRadius: '20px',
      opacity: isVisible ? 1 : 0,
      backgroundColor: '#2563eb',
      color: '#ffffff',
      scale: isClicked ? 0.9 : 1,
      mixBlendMode: 'normal' as any
    },
    external: {
      width: 80,
      height: 80,
      opacity: isVisible ? 1 : 0,
      backgroundColor: '#ffffff',
      color: '#000000',
      borderRadius: '50%',
      scale: isClicked ? 0.9 : 1,
      mixBlendMode: 'normal' as any
    },
    image: {
      width: 70,
      height: 70,
      opacity: isVisible ? 1 : 0,
      backgroundColor: '#ffffff',
      color: '#000000',
      borderRadius: '50%',
      scale: isClicked ? 0.9 : 1,
      mixBlendMode: 'normal' as any
    },
    'gallery-next': {
      width: 70,
      height: 70,
      opacity: isVisible ? 1 : 0,
      backgroundColor: '#ffffff',
      color: '#000000',
      borderRadius: '50%',
      scale: isClicked ? 0.9 : 1,
      mixBlendMode: 'normal' as any
    },
    'gallery-prev': {
      width: 70,
      height: 70,
      opacity: isVisible ? 1 : 0,
      backgroundColor: '#ffffff',
      color: '#000000',
      borderRadius: '50%',
      scale: isClicked ? 0.9 : 1,
      mixBlendMode: 'normal' as any
    },
    text: {
      width: 40,
      height: 2,
      borderRadius: '1px',
      opacity: isVisible ? 1 : 0,
      backgroundColor: '#ffffff',
      color: 'rgba(0, 0, 0, 0)',
      scale: isClicked ? 0.9 : 1,
      mixBlendMode: 'difference' as any,
      marginTop: 20
    },
    transition: {
      width: 4,
      height: 4,
      borderRadius: '50%',
      opacity: isVisible ? 0.5 : 0,
      backgroundColor: '#ffffff',
      color: 'rgba(0, 0, 0, 0)',
      scale: 0.5,
      mixBlendMode: 'difference' as any
    }
  };

  const ringVariants = {
    default: {
      width: 32,
      height: 32,
      opacity: isVisible ? 0.35 : 0,
      scale: isClicked ? 1.5 : 1
    },
    hidden: {
      opacity: 0,
      scale: 0
    }
  };

  const isCustomShape = cursorState.variant !== 'default' && cursorState.variant !== 'text';

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999]">
      {/* Ring Layer */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border-2 border-white mix-blend-difference blur-[2px] will-change-transform"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%'
        }}
        variants={ringVariants}
        animate={isCustomShape ? 'hidden' : 'default'}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      />

      {/* Dot / Content Layer */}
      <motion.div
        className="fixed top-0 left-0 rounded-full flex items-center justify-center font-bold text-[10px] tracking-wider overflow-hidden will-change-transform shadow-lg"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        variants={variants}
        animate={cursorState.variant === 'default' ? 'default' : (variants as any)[cursorState.variant] || 'default'}
        transition={{ type: 'spring', damping: 25, stiffness: 400 }}
      >
        <AnimatePresence mode="wait">
          {isCustomShape && cursorState.text && (
            <motion.span
              key={cursorState.text}
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="whitespace-nowrap pointer-events-none"
            >
              {cursorState.text}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
