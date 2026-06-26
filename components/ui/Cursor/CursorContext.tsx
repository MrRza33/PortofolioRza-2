import React, { createContext, useContext, useState, ReactNode } from 'react';

type CursorVariant = 'default' | 'button' | 'project' | 'image' | 'gallery-next' | 'gallery-prev' | 'external' | 'text' | 'transition';

interface CursorState {
  variant: CursorVariant;
  text?: string;
}

interface CursorContextType {
  cursorState: CursorState;
  setCursorState: (state: CursorState) => void;
}

export const CursorContext = createContext<CursorContextType | undefined>(undefined);

export const CursorProvider = ({ children }: { children: ReactNode }) => {
  const [cursorState, setCursorState] = useState<CursorState>({ variant: 'default' });

  return (
    <CursorContext.Provider value={{ cursorState, setCursorState }}>
      {children}
    </CursorContext.Provider>
  );
};

export const useCursorContext = () => {
  const context = useContext(CursorContext);
  if (!context) {
    throw new Error('useCursorContext must be used within a CursorProvider');
  }
  return context;
};
