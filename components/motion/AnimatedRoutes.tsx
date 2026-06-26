import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from './PageTransition';
import { TransitionOverlay } from './TransitionOverlay';

// Re-export standard routes but wrapped in PageTransition
export const AnimatedRoutes = ({ children, profile }: { children: React.ReactNode, profile: any }) => {
  const location = useLocation();

  return (
    <>
      <TransitionOverlay profile={profile} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {children}
        </Routes>
      </AnimatePresence>
    </>
  );
};
