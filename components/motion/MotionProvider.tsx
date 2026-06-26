import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';

interface MotionContextType {
  isTransitioning: boolean;
  startTransition: () => void;
  endTransition: () => void;
}

const MotionContext = createContext<MotionContextType | undefined>(undefined);

export const MotionProvider = ({ children }: { children: ReactNode }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startTransition = useCallback(() => {
    setIsTransitioning(true);
  }, []);

  const endTransition = useCallback(() => {
    setIsTransitioning(false);
  }, []);

  return (
    <MotionContext.Provider value={{ isTransitioning, startTransition, endTransition }}>
      {children}
    </MotionContext.Provider>
  );
};

export const useMotionContext = () => {
  const context = useContext(MotionContext);
  if (!context) {
    throw new Error('useMotionContext must be used within a MotionProvider');
  }
  return context;
};
