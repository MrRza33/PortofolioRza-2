import React from 'react';
import { motion } from 'framer-motion';

export const AmbientBackground = () => {
  return (
    <div className="fixed inset-0 z-[-2] pointer-events-none overflow-hidden">
      {/* Noise Texture */}
      <div 
        className="absolute inset-0 z-[-1] opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Animated Ambient Glow */}
      <motion.div
        animate={{
          x: ['0%', '2%', '-2%', '0%'],
          y: ['0%', '-2%', '2%', '0%'],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vh] bg-blue-600/10 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{
          x: ['0%', '-3%', '3%', '0%'],
          y: ['0%', '3%', '-3%', '0%'],
          scale: [1, 0.95, 1.05, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vh] bg-indigo-600/10 rounded-full blur-[120px]"
      />
    </div>
  );
};
