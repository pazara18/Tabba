export interface StemMix {
  muted: boolean;
  solo: boolean;
}

export const DEFAULT_STEM_MIX: StemMix = { muted: false, solo: false };

export function getStemMix(
  mixStates: Record<string, StemMix>,
  stemId: string
): StemMix {
  return mixStates[stemId] ?? DEFAULT_STEM_MIX;
}

export function isAnyStemSoloed(mixStates: Record<string, StemMix>): boolean {
  for (const stemId in mixStates) {
    if (mixStates[stemId]?.solo) {
      return true;
    }
  }

  return false;
}

export function computeStemGain(mix: StemMix, anyStemSoloed: boolean): number {
  if (anyStemSoloed) {
    return mix.solo ? 1 : 0;
  }

  return mix.muted ? 0 : 1;
}

export function toggleStemMute(
  mixStates: Record<string, StemMix>,
  stemId: string
): Record<string, StemMix> {
  const current = getStemMix(mixStates, stemId);
  return {
    ...mixStates,
    [stemId]: { ...current, muted: !current.muted },
  };
}

export function toggleStemSolo(
  mixStates: Record<string, StemMix>,
  stemId: string
): Record<string, StemMix> {
  const current = getStemMix(mixStates, stemId);
  return {
    ...mixStates,
    [stemId]: { ...current, solo: !current.solo },
  };
}

export function dropStemMix(
  mixStates: Record<string, StemMix>,
  stemId: string
): Record<string, StemMix> {
  if (!(stemId in mixStates)) {
    return mixStates;
  }

  const next = { ...mixStates };
  delete next[stemId];
  return next;
}
