import React from 'react';
import { ToneConfig } from '../types';
import { Sliders } from 'lucide-react';

interface TonePickerProps {
  toneConfig: ToneConfig;
  onChange: (config: ToneConfig) => void;
  disabled?: boolean;
}

export const TonePicker: React.FC<TonePickerProps> = ({
  toneConfig,
  onChange,
  disabled = false
}) => {
  const toneOptions = [
    {
      formality: 'casual' as const,
      detail: 'concise' as const,
      label: 'Casual & Concise',
      description: 'Friendly and brief',
      color: 'bg-green-100 border-green-300 text-green-800'
    },
    {
      formality: 'casual' as const,
      detail: 'detailed' as const,
      label: 'Casual & Detailed',
      description: 'Friendly and comprehensive',
      color: 'bg-blue-100 border-blue-300 text-blue-800'
    },
    {
      formality: 'formal' as const,
      detail: 'concise' as const,
      label: 'Formal & Concise',
      description: 'Professional and brief',
      color: 'bg-purple-100 border-purple-300 text-purple-800'
    },
    {
      formality: 'formal' as const,
      detail: 'detailed' as const,
      label: 'Formal & Detailed',
      description: 'Professional and comprehensive',
      color: 'bg-orange-100 border-orange-300 text-orange-800'
    }
  ];

  const isSelected = (option: { formality: string; detail: string }) => {
    return toneConfig.formality === option.formality && toneConfig.detail === option.detail;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Sliders className="w-5 h-5 text-slate-600" />
        <h3 className="text-lg font-semibold text-slate-800">Tone Selector</h3>
      </div>

      {/* Axis Labels */}
      <div className="space-y-3 text-sm text-slate-600">
        <div className="flex justify-between items-center">
          <span>Casual</span>
          <span className="font-medium">Formality</span>
          <span>Formal</span>
        </div>
        <div className="flex justify-center mb-4">
          <div className="flex flex-col items-center space-y-1">
            <span>Detailed</span>
            <div className="w-px h-6 bg-slate-300"></div>
            <span className="font-medium">Detail</span>
            <div className="w-px h-6 bg-slate-300"></div>
            <span>Concise</span>
          </div>
        </div>
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3">
        {toneOptions.map((option) => (
          <button
            key={`${option.formality}-${option.detail}`}
            onClick={() => onChange({
              formality: option.formality,
              detail: option.detail
            })}
            disabled={disabled}
            className={`
              p-3 rounded-lg border-2 text-left transition-all duration-200
              hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400
              ${isSelected(option) 
                ? `${option.color} ring-2 ring-offset-2 ring-blue-400` 
                : 'bg-white border-slate-200 hover:border-slate-300'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none' : 'cursor-pointer'}
              min-h-[80px] flex flex-col justify-center
            `}
          >
            <div className="font-medium text-xs sm:text-sm mb-1">
              {option.label}
            </div>
            <div className={`text-xs ${isSelected(option) ? '' : 'text-slate-500'}`}>
              {option.description}
            </div>
          </button>
        ))}
      </div>

      {/* Current Selection Display */}
      <div className="p-3 bg-slate-50 rounded-lg border">
        <div className="text-sm font-medium text-slate-700 mb-1">Current Selection:</div>
        <div className="text-xs text-slate-600">
          {toneConfig.formality.charAt(0).toUpperCase() + toneConfig.formality.slice(1)} tone, {' '}
          {toneConfig.detail} style
        </div>
      </div>
    </div>
  );
};