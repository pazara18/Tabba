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

