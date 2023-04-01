import type { InstrumentKind } from "../../../domain/instruments/types";
import { standardBassTuning, standardGuitarTuning } from "../../../domain/instruments/standardTunings";
import type { TabTrack } from "../types";

interface CreateTabTrackOptions {
  createId?: () => string;
  instrument: InstrumentKind;
  stemId: string;
}

