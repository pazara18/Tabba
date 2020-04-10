import { mergeChannelsToMono } from "../services/waveformPeaks";

export interface DecodedAudioFile {
  durationSeconds: number;
  sampleRate: number;
  samples: Float32Array;
}

export async function decodeAudioFile(file: File): Promise<DecodedAudioFile> {
  const audioContext = new AudioContext();

  try {
    const audioData = await file.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(audioData);
    const channels = Array.from({ length: audioBuffer.numberOfChannels }, (_, index) =>
      audioBuffer.getChannelData(index)
    );
