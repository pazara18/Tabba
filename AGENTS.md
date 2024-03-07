# AGENTS.md

Guidance for coding agents and humans working in this repository.

This project is **Tabba**, a local-first in-browser application for creating,
editing, and viewing guitar and bass tablature for Suno song stem exports. The
near-term product is an assisted tab editor: audio analysis may suggest notes,
positions, chords, bends, or slides, but the musician remains the final editor.

## Product Direction

- Build a local browser app first. Do not introduce a backend unless a concrete
  feature requires it.
- Keep imported audio local to the browser. Privacy and offline operation are
  product requirements, not implementation details.
- Focus on guitar and bass tablature. Do not add drums or vocals until the
  guitar/bass workflows are solid.
- Treat transcription as assistance. The app should present candidates and
  confidence, not pretend uncertain analysis is authoritative.
- Preserve raw analysis results separately from user choices so a user can
  re-finger, reclassify, or lock events without losing the underlying evidence.

## Preferred Stack

Unless there is a strong reason to change direction, use:

- Vite
- TypeScript
- React
- CSS modules or small colocated styles
- Web Audio API for playback primitives
- A waveform library only when it earns its dependency cost
- Web Workers for expensive audio analysis
- IndexedDB for local project persistence when browser storage is needed

Avoid adding large frameworks or state libraries until the app complexity
actually requires them.

## Architecture Overview

The app should be organized around clear domain boundaries:

- **Project management**: project schema, import/export, autosave, migrations.
- **Audio workspace**: stems, playback, waveform, offsets, looping, tempo/grid.
- **Tab domain**: tunings, instruments, tab events, positions, techniques.
- **Fingering engine**: pitch-to-position candidates and playability scoring.
- **Analysis engine**: onset, pitch, mono/poly, bend/slide/vibrato suggestions.
- **Editor UI**: timeline, tab staff, candidate popovers, keyboard workflows.
- **Rendering/export**: tab viewer, plain text tab, future interchange formats.

Keep these boundaries explicit. UI components may call application services or
hooks, but they should not contain domain algorithms.

## Proposed Source Layout

When the application is scaffolded, prefer this structure:

```text
src/
  app/
    App.tsx
    routes/
    providers/
  components/
    common/
    timeline/
    tabStaff/
    transport/
  features/
    project/
      components/
      hooks/
      services/
      types.ts
    audio/
      components/
      hooks/
      services/
      workers/
      types.ts
    editor/
      components/
      hooks/
      services/
      types.ts
    analysis/
      workers/
      services/
      types.ts
    export/
      services/
      types.ts
  domain/
    instruments/
    tab/
    fingering/
    timing/
  lib/
    storage/
    math/
    audio/
  test/
    fixtures/
    helpers/
```

Use the layout as a guide, not bureaucracy. If a folder has only one tiny file
and no near-term need to grow, avoid creating needless nesting.

## File Size and Modularity Rules

This repository should not accumulate giant files.

- Target file size: **under 200 lines** for most files.
- Soft limit: **250 lines**. When a file crosses this, look for a natural split.
- Hard limit: **400 lines**. Do not exceed this without documenting the reason
  in the PR or commit message.
- React components should usually stay under **150 lines**.
- Domain algorithms should be split by responsibility, not by arbitrary chunks.
- Tests may be longer when table-driven cases are clearer in one place, but
  helpers and fixtures should still be extracted.

When a file grows, prefer these splits:

- UI shell vs presentational child components.
- Hook state management vs pure rendering.
- Domain types vs domain algorithms.
- Parsing/serialization vs validation/migration.
- Analysis orchestration vs individual signal-processing steps.
- Candidate generation vs candidate scoring.

Do not solve large files by creating vague `utils.ts` dumping grounds. Extract
modules with names that describe the domain concept they own.

## Naming Guidelines

- Name files after the thing they own: `scoreCandidates.ts`,
  `generatePitchPositions.ts`, `ProjectImporter.tsx`.
- Avoid broad names like `helpers.ts`, `misc.ts`, `common.ts`, or `manager.ts`.
- Use `types.ts` sparingly for shared types inside a feature. If a type belongs
  to a domain concept, put it near that concept.
- Use explicit event names: `TabEvent`, `PitchEstimate`,
  `CandidateInterpretation`, `TabPosition`.
- Prefer boring, searchable names over clever abbreviations.

## Domain Model Principles

The model should separate audio facts from edited tab decisions.

Recommended concepts:

```ts
type InstrumentKind = "guitar" | "bass";
type TabEventKind = "single" | "chord" | "bend" | "slide" | "unknown";
type TextureKind = "mono" | "poly" | "uncertain";
```

Important model rules:

- Store `schemaVersion` in every saved project.
- Store stem metadata separately from tab tracks.
- Store detected pitches separately from chosen tab positions.
- Store confidence and candidate interpretations where analysis is uncertain.
- Support `locked` user-edited events so later analysis does not overwrite them.
- Support alternate tunings from the beginning.
- Design for capo support even if the first UI does not expose it.

## Audio and Timing Guidelines

- Keep all internal timing in seconds unless a module clearly owns musical grid
  math.
- Do not assume Suno stems have reliable BPM metadata.
- Support free-time editing and later add BPM/grid/tap-tempo features.
- Plan for per-stem offset/trim because imported stems may include leading
  silence.
- Keep playback state centralized enough that waveform, tab staff, and transport
  controls stay synchronized.
- Expensive analysis must run off the main UI thread.

## Fingering and Candidate Rules

Candidate generation and candidate scoring are separate responsibilities.

Candidate generation answers:

- Which string/fret positions can play this pitch in the current tuning?
- Which chord voicings can represent this pitch set?
- Which positions are physically possible?

Candidate scoring answers:

