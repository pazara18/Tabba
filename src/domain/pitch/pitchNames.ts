const pitchOffsets: Record<string, number> = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
};

const sharpPitchNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function pitchToMidi(pitch: string): number {
  const match = /^([A-G](?:#|b)?)(-?\d+)$/.exec(pitch);

  if (!match) {
    throw new Error(`Invalid pitch name: ${pitch}.`);
  }

  const [, pitchClass, octaveText] = match;
  const offset = pitchOffsets[pitchClass];

  if (offset === undefined) {
    throw new Error(`Invalid pitch class: ${pitchClass}.`);
  }

  return (Number(octaveText) + 1) * 12 + offset;
}

export function midiToPitch(midiNote: number): string {
  if (!Number.isInteger(midiNote)) {
    throw new Error("MIDI note must be an integer.");
  }

  const pitchClass = ((midiNote % 12) + 12) % 12;
  const octave = Math.floor(midiNote / 12) - 1;

  return `${sharpPitchNames[pitchClass]}${octave}`;
}

export function transposePitch(pitch: string, semitones: number): string {
  return midiToPitch(pitchToMidi(pitch) + semitones);
}
