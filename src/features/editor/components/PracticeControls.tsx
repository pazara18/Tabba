import type { LoopRegion } from "../services/practiceControls";
import { normalizeLoopRegion, playbackRates } from "../services/practiceControls";
import styles from "./PracticeControls.module.css";

interface PracticeControlsProps {
  duration: number;
  loopRegion: LoopRegion;
  onLoopRegionChange: (loopRegion: LoopRegion) => void;
  onPlaybackRateChange: (playbackRate: number) => void;
  playbackRate: number;
}

export function PracticeControls({
  duration,
  loopRegion,
  onLoopRegionChange,
  onPlaybackRateChange,
  playbackRate,
}: PracticeControlsProps) {
  const normalizedLoop = normalizeLoopRegion(loopRegion, duration);

  return (
    <div className={styles.practiceControls}>
      <label>
        Speed
        <select
          onChange={(event) => onPlaybackRateChange(Number(event.currentTarget.value))}
          value={playbackRate}
        >
          {playbackRates.map((rate) => (
            <option key={rate} value={rate}>
              {rate}x
            </option>
          ))}
        </select>
      </label>
      <label className={styles.loopToggle}>
        <input
          checked={loopRegion.enabled}
          onChange={(event) =>
            onLoopRegionChange({ ...loopRegion, enabled: event.currentTarget.checked })
          }
          type="checkbox"
        />
        Loop
      </label>
      <LoopTimeInput
        label="Start"
        onChange={(startSeconds) =>
          onLoopRegionChange(normalizeLoopRegion({ ...loopRegion, startSeconds }, duration))
        }
        value={normalizedLoop.startSeconds}
      />
      <LoopTimeInput
        label="End"
        onChange={(endSeconds) =>
          onLoopRegionChange(normalizeLoopRegion({ ...loopRegion, endSeconds }, duration))
        }
        value={normalizedLoop.endSeconds}
      />
    </div>
  );
}

interface LoopTimeInputProps {
