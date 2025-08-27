import React, { useState, useCallback } from 'react';
import { TextEditor } from './components/TextEditor';
import { TonePicker } from './components/TonePicker';
import { ControlPanel } from './components/ControlPanel';
import { useUndoRedo } from './hooks/useUndoRedo';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { ApiService } from './services/api';
import { ToneConfig } from './types';
import { Palette, Github } from 'lucide-react';

const INITIAL_TEXT = `Welcome to the Tone Picker Text Tool! This application allows you to adjust the tone and style of your writing using AI-powered text transformation.

Try changing the tone using the controls on the right, or start writing your own text. You can undo and redo changes, and your revision history is automatically saved.`;

function App() {
  const [toneConfig, setToneConfig] = useState<ToneConfig>({
    formality: 'casual',
    detail: 'concise'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    currentText,
    addRevision,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
    revisionCount,
    currentIndex
  } = useUndoRedo(INITIAL_TEXT);

  // Enable keyboard shortcuts
  useKeyboardShortcuts({ onUndo: undo, onRedo: redo });

  const handleTextChange = useCallback((newText: string) => {
    // Only add revision if text actually changed
    if (newText !== currentText) {
      addRevision(newText);
    }
  }, [currentText, addRevision]);

  const handleApplyTone = useCallback(async () => {
    if (!currentText.trim()) {
      setError('Please enter some text before applying a tone.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const adjustedText = await ApiService.adjustTone(currentText, toneConfig);
      
      if (adjustedText && adjustedText.trim() !== currentText.trim()) {
        addRevision(adjustedText, toneConfig);
      } else {
        setError('The AI returned the same text. Try a different tone or text content.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error applying tone:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentText, toneConfig, addRevision]);

  const handleReset = useCallback(() => {
    reset(INITIAL_TEXT);
    setError(null);
  }, [reset]);

  const handleUndoRedo = useCallback((action: 'undo' | 'redo') => {
    setError(null); // Clear errors when navigating history
    if (action === 'undo') {
      undo();
    } else {
      redo();
    }
  }, [undo, redo]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Palette className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Tone Picker</h1>
                <p className="text-sm text-slate-600">AI-powered text tone adjustment tool</p>
              </div>
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="text-sm">View on GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 min-h-[600px]">
          {/* Text Editor - Left Side */}
          <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <TextEditor
              text={currentText}
              onChange={handleTextChange}
              disabled={isLoading}
              placeholder="Enter your text here to start adjusting its tone..."
            />
          </div>

          {/* Controls - Right Side */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            {/* Tone Picker */}
            <TonePicker
              toneConfig={toneConfig}
              onChange={setToneConfig}
              disabled={isLoading}
            />

            {/* Control Panel */}
            <ControlPanel
              onApplyTone={handleApplyTone}
              onUndo={() => handleUndoRedo('undo')}
              onRedo={() => handleUndoRedo('redo')}
              onReset={handleReset}
              canUndo={canUndo}
              canRedo={canRedo}
              isLoading={isLoading}
              error={error}
              revisionCount={revisionCount}
              currentIndex={currentIndex}
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">How to Use</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-slate-600">
            <div className="space-y-2">
              <div className="font-medium text-slate-700">1. Write or Edit</div>
              <p>Enter your text in the editor on the left side.</p>
            </div>
            <div className="space-y-2">
              <div className="font-medium text-slate-700">2. Choose Tone</div>
              <p>Select your desired tone from the 2×2 matrix picker.</p>
            </div>
            <div className="space-y-2">
              <div className="font-medium text-slate-700">3. Apply Changes</div>
              <p>Click "Apply Tone" to transform your text using AI.</p>
            </div>
            <div className="space-y-2">
              <div className="font-medium text-slate-700">4. Refine</div>
              <p>Use undo/redo (Ctrl+Z/Y) to navigate through revisions.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;