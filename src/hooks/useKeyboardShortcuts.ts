import { useEffect } from 'react';

interface KeyboardShortcuts {
  onUndo: () => void;
  onRedo: () => void;
}

export const useKeyboardShortcuts = ({ onUndo, onRedo }: KeyboardShortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+Z (Undo) or Cmd+Z on Mac
      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        onUndo();
        return;
      }

      // Check for Ctrl+Y (Redo) or Ctrl+Shift+Z or Cmd+Y/Cmd+Shift+Z on Mac
      if (
        (event.ctrlKey || event.metaKey) &&
        ((event.key === 'y') || (event.key === 'z' && event.shiftKey))
      ) {
        event.preventDefault();
        onRedo();
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onUndo, onRedo]);
};