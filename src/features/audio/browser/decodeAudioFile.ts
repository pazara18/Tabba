import { mergeChannelsToMono } from "../services/waveformPeaks";

export interface DecodedAudioFile {
  durationSeconds: number;
  sampleRate: number;
  samples: Float32Array;
