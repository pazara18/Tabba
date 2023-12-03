export type TabEventKind = "single" | "chord" | "bend" | "slide" | "unknown";
export type TextureKind = "mono" | "poly" | "uncertain";

export interface PitchEstimate {
  pitch: string;
