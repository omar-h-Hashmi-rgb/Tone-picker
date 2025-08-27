export interface ToneConfig {
  formality: 'casual' | 'formal';
  detail: 'concise' | 'detailed';
}

export interface TextRevision {
  id: string;
  text: string;
  timestamp: number;
  toneConfig?: ToneConfig;
}

export interface ApiResponse {
  adjustedText: string;
}

export interface ApiError {
  error: string;
  message: string;
}