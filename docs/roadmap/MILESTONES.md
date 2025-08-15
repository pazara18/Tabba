# Roadmap Milestones

These milestones should be completed in order unless a later task is needed to
unblock a small implementation detail. Each milestone should leave the app in a
usable state.

## Milestone 0: Repository Foundation

Goal: create a healthy TypeScript application shell with guardrails.

Deliverables:

- Vite, React, TypeScript scaffold.
- Test runner configured for domain logic.
- Linting and formatting commands.
- Basic source layout from `AGENTS.md`.
- Empty editor-first app screen.
- README with local development commands.

Acceptance criteria:

- `npm install` works from a fresh clone.
- `npm run dev` starts the app.
- `npm test` runs at least one placeholder domain test.
- `npm run lint` or equivalent validates the scaffold.
- No generated source file becomes a dumping ground.

## Milestone 1: Project Schema and Persistence

Goal: define the durable project format before editor behavior grows around it.

Deliverables:

- Versioned `.tabba.json` schema.
- Project, stem, tab track, tab event, pitch estimate, candidate, and position
  types.
- Project creation service.
- JSON export service.
- JSON import and validation service.
- Schema migration entry point.
- Minimal browser autosave placeholder.

Acceptance criteria:

- A new empty project can be created.
- A project can be exported to JSON.
- The same JSON can be imported without losing data.
- Invalid or unsupported project files produce useful errors.
- Tests cover project creation, import/export, and schema version checks.

Initial schema concepts:

```ts
type InstrumentKind = "guitar" | "bass";
type TabEventKind = "single" | "chord" | "bend" | "slide" | "unknown";
type TextureKind = "mono" | "poly" | "uncertain";
```

## Milestone 2: Audio Import and Transport

Goal: import local stem audio and play it reliably in the browser.

Deliverables:

- Local file import for common browser-supported audio formats.
- Stem metadata creation.
- Audio playback service.
- Transport controls: play, pause, seek, current time, duration.
- Per-stem mute and solo state.
- Basic stem offset field.

Acceptance criteria:

- A user can import a stem and play it.
- Current time updates while playing.
- Seeking updates playback and UI state.
- Imported files are not uploaded anywhere.
- Audio object URLs are cleaned up when no longer needed.

## Milestone 3: Timeline and Manual Tab Staff

Goal: create and edit guitar/bass tab events manually against playback time.

Deliverables:

- Timeline ruler linked to playback time.
- Tab staff renderer for guitar and bass tunings.
- Manual note insertion.
- Note selection.
- Fret editing.
- Basic event movement along time.
- Event deletion.
- Undo/redo foundation.

Acceptance criteria:

- A user can create a guitar or bass track for a stem.
- A user can add a note on a string at a time position.
- A user can change fret, string, start time, and duration.
- The playhead is shared by transport and tab staff.
- A saved project preserves manual tab events.

## Milestone 4: Tunings and Pitch-to-Position Candidates

Goal: support musical pitch mapping and alternate positions for the same note.

Deliverables:

- Tuning definitions for standard guitar and bass.
- Pitch representation and conversion utilities.
- Fretboard position generation for a pitch and tuning.
- Candidate scoring by distance and playability.
- Candidate popover for selected notes.
- Manual choice locking.

Acceptance criteria:

- Given a pitch, the app can list all playable string/fret positions.
- The app can choose a default candidate near the prior selected position.
- The user can switch to another candidate.
- Locked events are not overwritten by re-fingering.
- Tests cover tuning definitions, pitch conversion, generation, and scoring.

Initial scoring factors:

- fret distance from previous note
- string distance from previous note
- current phrase continuity
- high-fret penalty
- open-string adjustment
- locked neighboring events

## Milestone 5: Waveform and Loop Editing

Goal: make timing correction fast enough for real use.

Deliverables:

- Waveform display for imported stems.
- Shared playhead across waveform and tab staff.
- Loop region selection.
- Playback speed control.
- Snap-to-grid toggle.
- Free-time mode retained as the default.

Acceptance criteria:

- A user can loop a short region while editing notes.
- A user can slow playback for manual transcription.
- Waveform and tab staff stay synchronized during playback and seeking.
- Editing remains responsive with ordinary song-length stems.

## Milestone 6: Analysis Event Import Layer

Goal: add analysis plumbing before sophisticated DSP exists.

Deliverables:

- Analysis job model.
- Worker message protocol.
- Mock or simple analysis result importer.
- Suggested events rendered differently from locked user events.
- Confidence display for detected events.
- Event reclassification UI shell.

Acceptance criteria:

- Analysis can create unlocked suggested tab events.
- Suggested events can be accepted, edited, locked, or deleted.
- Re-running analysis does not overwrite locked events.
- Worker failures are surfaced without breaking the editor.

## Milestone 7: Mono/Poly and Chord Workflow

Goal: treat complex detected sounds as editable musical events.

Deliverables:

- Texture classification field: mono, poly, uncertain.
- Complex event UI for switching between single note, double-stop, chord, and
  manual interpretation.
- Chord position model.
- Basic chord voicing candidate generation from pitch sets.
- Chord fingering scoring.

Acceptance criteria:

- A complex event can be represented as a chord or reduced to a single note.
- The user can choose between alternate chord fingerings.
- Chord candidates respect tuning and fret span constraints.
- Tests cover chord candidate constraints and scoring.

## Milestone 8: Bend, Slide, and Technique Editing

Goal: support guitar/bass techniques manually, then use pitch curves to assist.

Deliverables:

- Manual bend annotation.
- Manual slide annotation.
- Bend amount choices: quarter, half, full, one-and-a-half, two-step.
- Bend-release support.
- Technique rendering in the tab staff.
- Pitch-curve data model for later analysis.

Acceptance criteria:

- A user can mark a note as a bend and choose bend amount.
- A user can mark a transition as a slide.
- Technique annotations save and reload.
- Technique rendering is readable in the tab viewer.

## Milestone 9: Real Audio Analysis

Goal: replace mocks with useful, conservative analysis.

Deliverables:

- Onset detection.
- Monophonic pitch tracking for clean bass and lead lines.
- Event grouping.
- Mono/poly/uncertain classification.
- Candidate event generation for the editor.

Acceptance criteria:

- Clean bass stems produce useful note suggestions.
- Clean single-note guitar lines produce useful note suggestions.
- Distorted or polyphonic sections are marked uncertain or complex.
- Analysis runs in a worker and does not block editing.

## Milestone 10: Export and Review Workflows

Goal: make finished work portable and readable outside the editor.

Deliverables:

- Plain text tab export.
- Project summary view.
- Print-friendly tab viewer.
- Optional MIDI export spike.
- Optional packaged project format spike for audio plus JSON.

Acceptance criteria:

- A user can export readable tab for a track.
- Export output is deterministic for the same project.
- The app JSON remains the source of truth.

<!-- draft note 264 -->
