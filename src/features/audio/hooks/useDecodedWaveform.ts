import { useEffect, useState } from "react";
import { decodeAudioFile } from "../browser/decodeAudioFile";
import { createWaveformPeaks, type WaveformPeak } from "../services/waveformPeaks";

interface DecodedWaveformState {
