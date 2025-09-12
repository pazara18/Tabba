# Backlog and Risks

These items matter, but they should not derail the first manual editor.

## Backlog Side Quests

- Tap tempo and BPM grid.
- Per-stem trim and alignment tools.
- Alternate tunings UI.
- Capo UI.
- Multiple guitar layers with color coding.
- Keyboard shortcut map.
- Accessibility pass for editor controls.
- IndexedDB autosave implementation.
- Project migration test fixtures.
- Synthetic audio fixtures for notes, chords, bends, and slides.
- Mobile view-only mode.
- MusicXML or Guitar Pro-style export research.

## Product Risks

- Automatic transcription may be unreliable for distorted or polyphonic guitar.
- Suno stems may include effects that confuse pitch tracking.
- Browser audio decoding support varies by format and platform.
- Large stems can make waveform and analysis work expensive.
- Timing grids may be misleading when stems do not align to a stable BPM.

## Risk Controls

- Build manual editing first.
- Keep every analysis result editable.
- Show confidence rather than hiding uncertainty.
- Mark complex events as complex instead of forcing single-note output.
- Run expensive analysis in workers.
- Keep audio local and avoid backend assumptions.
- Keep project JSON as the source of truth.

## Deferred Analysis Work

The first analysis implementation should be conservative. Later work can add:

- onset detection
- monophonic pitch tracking
- event grouping
- mono/poly classification
- chord candidate generation
- bend and slide curve detection
- vibrato detection
- phrase-level re-fingering

## Export Research

The known export path is plain text tab. These should be researched later:

- MIDI export for note timing review.
- MusicXML export for notation tools.
- Guitar Pro-compatible export if a practical library or format path exists.
- Packaged project archives containing JSON plus audio references or blobs.

Do not add export dependencies until the core editor data model is stable.

<!-- draft note 274 -->
