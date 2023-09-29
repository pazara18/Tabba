import type { InstrumentTuning } from "./types";

export const standardGuitarTuning: InstrumentTuning = {
  id: "guitar-standard",
  name: "Standard guitar",
  instrument: "guitar",
  strings: [
    { stringNumber: 1, openPitch: "E4" },
    { stringNumber: 2, openPitch: "B3" },
    { stringNumber: 3, openPitch: "G3" },
    { stringNumber: 4, openPitch: "D3" },
    { stringNumber: 5, openPitch: "A2" },
    { stringNumber: 6, openPitch: "E2" },
