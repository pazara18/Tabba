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
    const start = Math.floor(index * samplesPerPeak);
    const end = Math.max(start + 1, Math.floor((index + 1) * samplesPerPeak));
    return findPeak(samples, start, Math.min(end, samples.length));
  });
}

export function mergeChannelsToMono(channels: Float32Array[]): Float32Array {
  if (channels.length === 0) {
    return new Float32Array();
  }

  const sampleCount = channels[0].length;
  const merged = new Float32Array(sampleCount);

  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
    const total = channels.reduce(
      (sum, channel) => sum + (channel[sampleIndex] ?? 0),
      0
    );
    merged[sampleIndex] = total / channels.length;
  }

  return merged;
}

export function getPeakHeightPercent(peak: WaveformPeak): number {
  const amplitude = Math.max(Math.abs(peak.min), Math.abs(peak.max));
  return Math.max(4, Math.min(100, amplitude * 100));
}

