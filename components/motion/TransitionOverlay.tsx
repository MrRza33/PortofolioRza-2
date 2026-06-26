import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useCursor } from '../../hooks/useCursor';

export const TransitionOverlay = ({ profile }: { profile?: any }) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);
  const { setVariant, resetCursor } = useCursor();

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setIsVisible(true);
      setVariant('transition');
      // Wait for exit animation of the page (250ms) + small buffer before hiding overlay
      const timer = setTimeout(() => {
        setIsVisible(false);
        setDisplayLocation(location);
        resetCursor();
      }, 350);
      return () => {
        clearTimeout(timer);
        resetCursor();
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, displayLocation.pathname]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center pointer-events-none"
        >
          {/* Subtle blue glow (removed blur on mobile for performance) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full md:blur-[100px] blur-[40px] will-change-transform" />
          
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative z-10"
          >
            {profile?.logo_url ? (
                <img src={profile.logo_url} alt="Logo" className="h-12 w-auto object-contain" />
            ) : (
                <div className="text-3xl font-bold tracking-tighter font-display">
                    <span className="text-white">Reza</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">.Dev</span>
                </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
