import React from 'react';
import { motion } from 'framer-motion';

export const NavigationIndicator = ({ layoutId = "navIndicator" }: { layoutId?: string }) => {
  return (
    <motion.div
      layoutId={layoutId}
      className="absolute inset-0 bg-white/10 rounded-full z-[-1]"
      transition={{
        type: 'spring',
        stiffness: 250,
        damping: 30,
        mass: 0.5,
      }}
    />
  );
};
