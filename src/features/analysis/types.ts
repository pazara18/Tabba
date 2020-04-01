export interface PitchFrame {
  confidence: number;
  durationSeconds: number;
  frequencyHz: number;
  pitch: string;
  startSeconds: number;
}

export interface DetectedNote {
  confidence: number;
  durationSeconds: number;
