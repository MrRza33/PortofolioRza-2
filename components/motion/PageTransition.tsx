import React, { useLayoutEffect } from 'react';
import { motion } from 'framer-motion';

export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isReducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(6px)', y: 20 }}
      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      exit={{ opacity: 0, filter: 'blur(6px)', y: -12, transition: { duration: 0.25, ease: 'easeOut' } }}
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

