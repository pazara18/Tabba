export type TabEventKind = "single" | "chord" | "bend" | "slide" | "unknown";
export type TextureKind = "mono" | "poly" | "uncertain";

export interface PitchEstimate {
  pitch: string;
  confidence: number;
  frequencyHz?: number;
}

export interface TabPosition {
  stringNumber: number;
  fret: number;
  pitch: string;
}

