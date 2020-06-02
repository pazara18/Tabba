import { useEffect, useState } from "react";
import { decodeAudioFile } from "../browser/decodeAudioFile";
import { createWaveformPeaks, type WaveformPeak } from "../services/waveformPeaks";

interface DecodedWaveformState {
  error?: string;
  isLoading: boolean;
  peaks: WaveformPeak[];
}

const peakCount = 96;

export function useDecodedWaveform(file?: File): DecodedWaveformState {
  const [state, setState] = useState<DecodedWaveformState>({
    isLoading: false,
    peaks: [],
  });

  useEffect(() => {
    if (!file) {
      setState({ isLoading: false, peaks: [] });
      return;
    }

    let cancelled = false;
    setState({ isLoading: true, peaks: [] });
