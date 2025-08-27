import { ToneConfig, ApiResponse, ApiError } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export class ApiService {
  static async adjustTone(text: string, toneConfig: ToneConfig): Promise<string> {
    if (!text.trim()) {
      throw new Error('Text cannot be empty');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/adjust-tone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          toneConfig,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const error = data as ApiError;
        throw new Error(error.message || 'Failed to adjust tone');
      }

      const result = data as ApiResponse;
      return result.adjustedText;
    } catch (error) {
      if (error instanceof Error) {
        // Re-throw known errors
        throw error;
      }

      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to the server. Please make sure the backend is running.');
      }

      throw new Error('An unexpected error occurred while adjusting the tone.');
    }
  }

  static async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}