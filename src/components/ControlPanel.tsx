import React from 'react';
import { 
  Undo2, 
  Redo2, 
  RotateCcw, 
  Sparkles, 
  Loader2,
  AlertCircle,
  CheckCircle 
} from 'lucide-react';

interface ControlPanelProps {
  onApplyTone: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isLoading: boolean;
  error: string | null;
  revisionCount: number;
  currentIndex: number;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onApplyTone,
  onUndo,
  onRedo,
  onReset,
  canUndo,
  canRedo,
  isLoading,
  error,
  revisionCount,
  currentIndex
}) => {
  return (
    <div className="space-y-6">
      {/* Main Actions */}
      <div className="space-y-3">
        <button
          onClick={onApplyTone}
          disabled={isLoading}
          className={`
            w-full flex items-center justify-center gap-2 px-4 py-3 
            rounded-lg font-medium transition-all duration-200
            ${isLoading 
              ? 'bg-blue-100 text-blue-600 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 hover:shadow-md'
            }
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
          `}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Applying Tone...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Apply Tone
            </>
          )}
        </button>

        <button
          onClick={onReset}
          disabled={isLoading}
          className={`
            w-full flex items-center justify-center gap-2 px-4 py-3 
            rounded-lg font-medium border-2 transition-all duration-200
            ${isLoading 
              ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }
            focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2
          `}
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Undo/Redo Controls */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-slate-700">History Controls</h4>
        <div className="flex gap-2">
          <button
            onClick={onUndo}
            disabled={!canUndo || isLoading}
            className={`
              flex-1 flex items-center justify-center gap-2 px-3 py-2 
              rounded-lg text-sm font-medium transition-all duration-200
              ${(!canUndo || isLoading)
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }
              focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1
            `}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
            Undo
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo || isLoading}
            className={`
              flex-1 flex items-center justify-center gap-2 px-3 py-2 
              rounded-lg text-sm font-medium transition-all duration-200
              ${(!canRedo || isLoading)
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }
              focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1
            `}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
            Redo
          </button>
        </div>
      </div>

      {/* Status Display */}
      <div className="space-y-3">
        {/* History Status */}
        <div className="text-xs text-slate-500 bg-slate-50 rounded px-3 py-2">
          Revision {currentIndex + 1} of {revisionCount}
          <div className="text-xs text-slate-400 mt-1">
            Use Ctrl+Z/Ctrl+Y for quick undo/redo
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-700">
              <div className="font-medium mb-1">Error</div>
              <div className="text-xs">{error}</div>
            </div>
          </div>
        )}

        {/* Success Feedback */}
        {!error && !isLoading && currentIndex > 0 && (
          <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <div className="text-sm text-green-700">Tone applied successfully</div>
          </div>
        )}
      </div>
    </div>
  );
};