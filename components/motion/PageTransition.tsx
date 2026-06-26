import React, { useLayoutEffect } from 'react';
import { motion } from 'framer-motion';

export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (isReducedMotion) {
    return <>{children}</>;
  }

  const variants = isMobile ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 }
  } : {
    initial: { opacity: 0, filter: 'blur(6px)', y: 20 },
    animate: { opacity: 1, filter: 'blur(0px)', y: 0 },
    exit: { opacity: 0, filter: 'blur(6px)', y: -12 }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{ 
        duration: 0.45, 
        type: 'spring', 
        stiffness: 120, 
        damping: 20, 
        mass: 1 
      }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

