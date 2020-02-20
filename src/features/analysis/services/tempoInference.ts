export interface TempoEstimate {
  bpm: number;
  beatOffsetSeconds: number;
  confidence: number;
}

export interface TempoInferenceOptions {
  maxBpm?: number;
  minBpm?: number;
  toleranceRatio?: number;
}

const DEFAULT_MIN_BPM = 60;
const DEFAULT_MAX_BPM = 200;
const DEFAULT_TOLERANCE_RATIO = 0.18;
const BPM_QUANTIZATION = 0.5;
const MIN_ONSETS_REQUIRED = 4;
