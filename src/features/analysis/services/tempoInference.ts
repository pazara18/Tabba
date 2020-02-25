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
const MAX_PHASE_REFERENCES = 8;
const HARMONIC_FACTORS = [0.5, 2 / 3, 1, 1.5, 2];

export function estimateTempoFromOnsets(
  onsetsSeconds: number[],
  options: TempoInferenceOptions = {}
): TempoEstimate | undefined {
  const minBpm = options.minBpm ?? DEFAULT_MIN_BPM;
  const maxBpm = options.maxBpm ?? DEFAULT_MAX_BPM;
  const toleranceRatio = options.toleranceRatio ?? DEFAULT_TOLERANCE_RATIO;

  if (onsetsSeconds.length < MIN_ONSETS_REQUIRED) {
    return undefined;
  }

  const sorted = [...onsetsSeconds].sort((left, right) => left - right);
  const candidates = collectBpmCandidates(sorted, minBpm, maxBpm);

  if (candidates.size === 0) {
    return undefined;
