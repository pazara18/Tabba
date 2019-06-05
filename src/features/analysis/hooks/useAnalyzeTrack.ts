import { useCallback, type Dispatch, type SetStateAction } from "react";
import { decodeAudioFile } from "../../audio/browser/decodeAudioFile";
import type { RuntimeStemSource } from "../../audio/types";
import { replaceSuggestedEventsInTrack } from "../../project/services/updateProjectTracks";
import type { TabbaProject } from "../../project/types";
import { createSuggestedTabEvents } from "../services/createSuggestedTabEvents";
import { getInstrumentPitchOptions } from "../services/instrumentAnalysisOptions";
import { alignNotesToEnergyOnsets } from "../services/noteOnsetAlignment";
