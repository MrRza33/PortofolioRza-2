import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { PageTransition } from './PageTransition';
import { TransitionOverlay } from './TransitionOverlay';

export const RouteWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <>
      {!isReducedMotion && <TransitionOverlay />}
      <AnimatePresence mode="wait">
        <React.Fragment key={location.pathname}>
          <PageTransition>
            {children}
          </PageTransition>
        </React.Fragment>
      </AnimatePresence>
    </>
  );
};
