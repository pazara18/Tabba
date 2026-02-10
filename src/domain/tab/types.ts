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

export interface BendTechnique {
  type: "bend";
  targetSemitones: number;
  release: boolean;
}

export interface SlideTechnique {
  type: "slide";
  targetPosition: TabPosition;
}

export type TabTechnique = BendTechnique | SlideTechnique;

export interface CandidateInterpretation {
  id: string;
  kind: TabEventKind;
  label: string;
  positions: TabPosition[];
  confidence: number;
  score?: number;
}

export interface TabEvent {
  id: string;
  startSeconds: number;
  durationSeconds: number;
  kind: TabEventKind;
  texture: TextureKind;
  detectedPitches: PitchEstimate[];
  chosenPositions: TabPosition[];
  candidates: CandidateInterpretation[];
  confidence: number;
  locked: boolean;
  technique?: TabTechnique;
}
