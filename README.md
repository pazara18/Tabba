# Tabba
<img width="1375" height="379" alt="image" src="https://github.com/user-attachments/assets/7d1d4d36-4057-4373-beba-79892367b406" />

Tabba is a local-first browser app for creating, editing, and viewing guitar and
bass tablature for Suno song stem exports.

The app is being built as an assisted editor: analysis may suggest events and
fingerings, but the musician chooses the final tab.

## Field milestones - the route so far

Every gate below is closed and stamped. The route from a loose idea to the
frozen 1.0 workbench ran through eight of them.

- [x] **M1 - Audio import + waveform** (Suno stem export -> decoded buffer) - closed **2019-08-15**, 14:05 CEST
- [x] **M2 - Attack detection** (onset picking with drift diagnostics) - closed **2020-09-24**, 11:30 CEST
- [x] **M3 - Pitch tracking** (frequency bins to string/fret candidates) - closed **2021-11-06**, 16:20 CET
- [x] **M4 - Tab editor** (measure grid, string/fret entry, undo stack) - closed **2022-12-08**, 13:45 CET
- [x] **M5 - Export pipeline** (PDF-ready tab rendering, text export) - closed **2023-10-19**, 15:10 CEST
- [x] **M6 - Project model** (local-first storage, autosave, versioned sessions) - closed **2024-11-28**, 09:55 CET
- [x] **M7 - Analysis assist** (suggested fingerings, musician-always-decides flow) - closed **2025-12-11**, 12:00 CET
