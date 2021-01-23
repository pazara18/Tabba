export interface WaveformPeak {
  max: number;
  min: number;
}

export function createWaveformPeaks(samples: Float32Array, peakCount: number): WaveformPeak[] {
  if (peakCount <= 0 || samples.length === 0) {
    return [];
  }

  const samplesPerPeak = samples.length / peakCount;

  return Array.from({ length: peakCount }, (_, index) => {
