import { useCallback } from 'react';
import { useCursorContext } from '../components/ui/Cursor/CursorContext';

export const useCursor = () => {
  const { setCursorState } = useCursorContext();

  const setVariant = useCallback((variant: 'default' | 'button' | 'project' | 'image' | 'gallery-next' | 'gallery-prev' | 'external' | 'text' | 'transition', text?: string) => {
    setCursorState({ variant, text });
  }, [setCursorState]);

  const resetCursor = useCallback(() => {
    setCursorState({ variant: 'default', text: undefined });
  }, [setCursorState]);

  return { setVariant, resetCursor };
};
