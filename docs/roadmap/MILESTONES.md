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

