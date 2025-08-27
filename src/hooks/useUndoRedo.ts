import { useState, useCallback, useRef } from 'react';
import { TextRevision } from '../types';

interface UndoRedoState {
  revisions: TextRevision[];
  currentIndex: number;
}

export const useUndoRedo = (initialText: string) => {
  const [state, setState] = useState<UndoRedoState>(() => {
    // Load from localStorage on initialization
    const saved = localStorage.getItem('tone-picker-history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.revisions && parsed.revisions.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.warn('Failed to parse saved history:', e);
      }
    }
    
    // Create initial revision
    const initialRevision: TextRevision = {
      id: Date.now().toString(),
      text: initialText,
      timestamp: Date.now(),
    };
    
    return {
      revisions: [initialRevision],
      currentIndex: 0,
    };
  });

  const saveToLocalStorage = useCallback((newState: UndoRedoState) => {
    try {
      localStorage.setItem('tone-picker-history', JSON.stringify(newState));
    } catch (e) {
      console.warn('Failed to save history to localStorage:', e);
    }
  }, []);

  const addRevision = useCallback((text: string, toneConfig?: any) => {
    setState((prevState) => {
      const newRevision: TextRevision = {
        id: Date.now().toString(),
        text,
        timestamp: Date.now(),
        toneConfig,
      };

      // Remove any revisions after current index (when branching from middle of history)
      const newRevisions = prevState.revisions.slice(0, prevState.currentIndex + 1);
      newRevisions.push(newRevision);

      // Limit history size to prevent memory issues
      const maxHistorySize = 50;
      if (newRevisions.length > maxHistorySize) {
        newRevisions.splice(0, newRevisions.length - maxHistorySize);
      }

      const newState = {
        revisions: newRevisions,
        currentIndex: newRevisions.length - 1,
      };

      saveToLocalStorage(newState);
      return newState;
    });
  }, [saveToLocalStorage]);

  const undo = useCallback(() => {
    setState((prevState) => {
      if (prevState.currentIndex > 0) {
        const newState = {
          ...prevState,
          currentIndex: prevState.currentIndex - 1,
        };
        saveToLocalStorage(newState);
        return newState;
      }
      return prevState;
    });
  }, [saveToLocalStorage]);

  const redo = useCallback(() => {
    setState((prevState) => {
      if (prevState.currentIndex < prevState.revisions.length - 1) {
        const newState = {
          ...prevState,
          currentIndex: prevState.currentIndex + 1,
        };
        saveToLocalStorage(newState);
        return newState;
      }
      return prevState;
    });
  }, [saveToLocalStorage]);

  const reset = useCallback((newText: string) => {
    const resetRevision: TextRevision = {
      id: Date.now().toString(),
      text: newText,
      timestamp: Date.now(),
    };

    const newState = {
      revisions: [resetRevision],
      currentIndex: 0,
    };

    setState(newState);
    saveToLocalStorage(newState);
  }, [saveToLocalStorage]);

  const currentRevision = state.revisions[state.currentIndex];
  const canUndo = state.currentIndex > 0;
  const canRedo = state.currentIndex < state.revisions.length - 1;

  return {
    currentText: currentRevision?.text || initialText,
    addRevision,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
    revisionCount: state.revisions.length,
    currentIndex: state.currentIndex,
  };
};