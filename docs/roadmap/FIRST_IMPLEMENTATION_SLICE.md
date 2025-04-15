# First Implementation Slice

This slice starts Milestone 0 and reaches just far enough into Milestone 1 to
give later work a stable data shape.

## Goal

Create a runnable, testable app shell that already looks like an editor and
contains the first version of the project schema.

## Work Items

1. Scaffold Vite, React, and TypeScript.
2. Add development scripts:
   - `npm run dev`
   - `npm test`
   - `npm run lint`
   - `npm run build`
3. Add a lean source tree:
   - `src/app`
   - `src/features/project`
   - `src/features/audio`
   - `src/features/editor`
   - `src/domain/tab`
   - `src/domain/instruments`
   - `src/domain/fingering`
   - `src/lib`
   - `src/test`
4. Define initial project schema types.
5. Add a project creation service.
6. Add one project creation test.
7. Render an empty editor workspace.
8. Add README development commands.

## Initial UI Shape

The first screen should communicate the real app, even before behavior exists:

- top transport strip
- left or top stem area
- central timeline area
- tab staff region
- side panel placeholder for selected event details

This should not be a marketing page or a setup wizard.

## Initial Types

Start with enough shape to avoid rewriting the model immediately:

```ts
type InstrumentKind = "guitar" | "bass";
type TabEventKind = "single" | "chord" | "bend" | "slide" | "unknown";
type TextureKind = "mono" | "poly" | "uncertain";
```

Project data should include:

- `schemaVersion`
- project id
- project name
- stems
- tab tracks
- created and updated timestamps

Stem data should include:

- id
- name
- optional file metadata
- duration when known
- offset seconds

Track data should include:

- id
- stem id
- instrument kind
- tuning
- events

Event data should include:

- id
- start seconds
- duration seconds
- kind
- detected pitches
- chosen positions
- candidates
- confidence
- locked flag

## Tests

Add focused tests for:

- creating a project with a schema version
- creating standard guitar and bass tunings
- ensuring a new project starts with empty stems and tracks

Do not add broad UI tests in this slice.

## Definition of Done

- The app starts locally.
- The test suite runs.
- The initial project schema exists.
- The UI shape communicates the editor direction.
- No source file exceeds the limits in `AGENTS.md`.
- README explains the available commands.

## Non-Goals

- Audio import.
- Waveform rendering.
- Real transcription.
- IndexedDB persistence.
- Full tab editing.
- Chord or bend detection.

<!-- draft note 195 -->
