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
- [x] **M8 - Tabba 1.0 - stable project format freeze** - closed **2026-08-09**, 12:00 CEST

### Commits per year - the build log

\\	ext
2018 ▇▇▇▇ 26
2019 ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 120
2020 ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 130
2021 ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 140
2022 ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 150
2023 ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 160
2024 ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 170
2025 ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 180
2026 ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 120
\
## The field team

- **rShimizu1988** - audited the development setup on a clean checkout and
  documented the exact Node/browser versions that build green (Sep 2025).
- **DavideEvans77347** - reviewed the planning chapter and tied every open
  item to a measurable exit check (Oct 2025).
- **HuseyinGupta78** - extended the project-files guide with the analysis
  pipeline map and where each test lives (Nov 2025).
- **Hoffmann68** - proofread the docs and fixed stale command examples in
  the development section (Dec 2025).

## Development

Install dependencies:

```sh
npm install
```

Start the local development server:

```sh
npm run dev
```

Run tests:

```sh
npm test
```

Run tests with coverage:

```sh
npm run test:coverage
```

Run linting:

```sh
npm run lint
```

Build for production:

```sh
npm run build
```

## Planning

- [Agent guidance](AGENTS.md)
- [Execution plan](EXECUTION_PLAN.md)
- [Roadmap milestones](docs/roadmap/MILESTONES.md)
- [First implementation slice](docs/roadmap/FIRST_IMPLEMENTATION_SLICE.md)

## Project Files

Tabba project exports use versioned `.tabba.json` data. The current schema
keeps stems, tab tracks, detected pitch data, chosen tab positions, candidates,
confidence, and lock state separate so analysis suggestions can be corrected
without losing the original project structure.

<!-- draft note 197 -->
