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

1. Bump `CACHE_NAME` **and** `APP_VERSION` in `sw.js`.
2. Bump `APP_VERSION` in `js/app.js`.
3. Bump the `?v=` query strings on the CSS + JS tags in `index.html`.
4. Update the version log in the in-app Guide (`renderGuide()` in `js/app.js`)
   and the "How this works" text if behaviour changed.
5. Commit + publish via GitHub Desktop (Martin does this himself).
6. Wait 1–3 min for GitHub Pages, then verify with a hard reload.
