export type InstrumentKind = "guitar" | "bass";

export interface TuningString {
  stringNumber: number;
  openPitch: string;
}

export interface InstrumentTuning {
  id: string;
  name: string;
