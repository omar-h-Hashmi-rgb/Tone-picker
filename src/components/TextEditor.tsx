import React, { useRef, useEffect } from 'react';
import { FileText } from 'lucide-react';

interface TextEditorProps {
  text: string;
  onChange: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  text,
  onChange,
  disabled = false,
  placeholder = "Enter your text here..."
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      // Auto-resize textarea
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-slate-600" />
        <h2 className="text-lg font-semibold text-slate-800">Text Editor</h2>
      </div>
      
      <div className="flex-1 relative min-h-[400px]">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            w-full h-full min-h-[300px] sm:min-h-[400px] p-4 
            border-2 border-slate-200 rounded-lg 
            focus:border-blue-400 focus:ring-2 focus:ring-blue-100 
            resize-none transition-all duration-200
            bg-white text-slate-700 placeholder-slate-400
            ${disabled ? 'bg-slate-50 cursor-not-allowed opacity-70' : ''}
          `}
          style={{
            lineHeight: '1.6',
            fontSize: '14px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        />
        
        {/* Character count */}
        <div className="absolute bottom-2 right-2 text-xs text-slate-400 bg-white/90 px-2 py-1 rounded backdrop-blur-sm">
          {text.length} characters
        </div>
      </div>
    </div>
  );
};