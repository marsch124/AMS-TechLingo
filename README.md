# AMS TechLingo

Personal tech dictionary as an offline PWA — tech terms, abbreviations and
Martin's own words, with definitions in **English, Deutsch and Svenska**,
favorites, photo attachments and added/updated date stamps.

- **Live:** https://marsch124.github.io/AMS-TechLingo/
- **Repo:** https://github.com/marsch124/AMS-TechLingo
- **Home folder:** `Documents/01 Leisure/30 App Development/AMS TechLingo`

## Data

Everything is stored locally in IndexedDB (`ams-techlingo`): one `entries`
store (each entry: term, category, en/de/sv definitions, notes, favorite,
source `library`/`own`, createdAt, updatedAt, photo Blob) and a `meta` store
(the one-time `seeded` flag). The ~205-term starter library in
`js/library.js` is seeded **once** on first launch and never re-seeded on
top of existing data. There are no automatic backups — only the manual
export/import in Settings, and import always previews and asks first.

## ⚠️ Release checklist (every single change)

1. Bump `APP_VERSION` in `sw.js` (the offline store is named after it, so the
   cache follows by itself).
2. Bump `APP_VERSION` in `js/app.js`.
3. Bump the `?v=` query strings on the CSS + JS tags in `index.html`.
4. Add the release to `VERSION_LOG` in `js/app.js` and update the "How to use
   this app" text if behaviour changed.
5. Run the UI tests (`npm run test:ui`) — they must be green.
6. Commit + publish via GitHub Desktop (Martin does this himself). GitHub runs
   the same tests on every push (`.github/workflows/ui-tests.yml`); a red run
   means the published version is not to be trusted.
7. Wait 1–3 min for GitHub Pages, then verify with a hard reload.

## UI tests

Playwright, in `tests/ui/`, one file per test. Every control is found by its
`data-testid`, never by its words, so wording can change freely. The app writes
what the tests read: `html[data-ready]` once booted, `body[data-screen]` after
every screen swap, `body[data-share]` with the outcome of a share. The suite
grows one test at a time, and each new test is broken on purpose once to see
it go red before it is trusted.
