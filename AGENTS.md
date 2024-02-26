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
