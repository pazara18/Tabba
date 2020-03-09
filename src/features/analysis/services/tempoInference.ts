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
  }

  let best: TempoEstimate | undefined;

  for (const bpm of candidates) {
    const beatSeconds = 60 / bpm;

    for (let index = 0; index < Math.min(MAX_PHASE_REFERENCES, sorted.length); index += 1) {
      const phase = positiveModulo(sorted[index], beatSeconds);
      const score = scoreAlignment(sorted, beatSeconds, phase, toleranceRatio);

      if (!best || score > best.confidence) {
        best = { bpm, beatOffsetSeconds: phase, confidence: score };
      }
    }
  }

  return best;
}

function collectBpmCandidates(sorted: number[], minBpm: number, maxBpm: number): Set<number> {
  const fromIois = new Set<number>();
  const intervals: number[] = [];

  for (let index = 1; index < sorted.length; index += 1) {
    const interval = sorted[index] - sorted[index - 1];

    if (interval <= 0) {
      continue;
    }

    intervals.push(interval);
    const folded = foldBpmIntoRange(60 / interval, minBpm, maxBpm);

    if (folded !== undefined) {
      fromIois.add(quantizeBpm(folded));
    }
  }

  if (intervals.length > 0) {
    const meanInterval = intervals.reduce((sum, value) => sum + value, 0) / intervals.length;
