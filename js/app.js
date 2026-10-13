/* AMS TechLingo — main app logic. */

const APP_VERSION = '1.30';

/* Thorough per-version history, newest first — shown collapsed in the Guide. */
const VERSION_LOG = [
    {
        v: '1.30', date: '13 Oct 2026',
        items: [
            'Screens now slide into place: a word’s page slides in from the right, and slides back out when you return — a small, quick movement, the way native apps do it. If the iPhone is set to reduce motion, there is no movement.'
        ]
    },
    {
        v: '1.29', date: '13 Oct 2026',
        items: [
            'Full-screen photos: tap a photo on a word’s page and you can now swipe sideways through all of that word’s photos, with “2 of 3” and a close button at the top. Press and hold a photo to select and copy the text in it (iOS Live Text), handy for screenshots.'
        ]
    },
    {
        v: '1.28', date: '13 Oct 2026',
        items: [
            'The search box has moved to the bottom of the Words page, in a bar just above the tabs, under your thumb — the way iOS 26 apps such as Mail and Notes do it — with the orange + button beside it. When the keyboard comes up, the bar rises with it. The sort choice (A–Z, newest, last updated) now sits at the end of the filter row.'
        ]
    },
    {
        v: '1.27', date: '13 Oct 2026',
        items: [
            'Settings now shows when you last made a backup, and the Words page asks quietly for one when it has been more than a month (or there is none yet and you have added words) — with a Back up button right there, and Later to be left alone for a week.',
            'Importing a backup now offers <strong>Add missing</strong> next to Replace: only the words that are not on this device are added, and a word that is on both keeps whichever version was changed last — so the iPhone and the Mac can finally be combined.'
        ]
    },
    {
        v: '1.26', date: '13 Oct 2026',
        items: [
            'Two more helpers next to Listen on a word’s page: <strong>Copy</strong> puts the word and its definition on the clipboard, ready to paste anywhere; <strong>Look up</strong> opens a web search for the word in Safari, for when your own note is not enough.'
        ]
    },
    {
        v: '1.25', date: '13 Oct 2026',
        items: [
            'Categories can be renamed: Settings lists them with their word counts and a Rename button. Renaming a category to one that already exists merges the two (it asks first). And a new category typed in the edit form that only differs in capitals from an existing one — “ai” next to “AI” — now joins the existing one instead of becoming a second category.'
        ]
    },
    {
        v: '1.24', date: '13 Oct 2026',
        items: [
            'Word of the day: a small card at the top of the Words page shows one of your own words each day, with the first line of its definition — tap it to open the word. It changes once a day, never in the middle of one. Settings has a switch to hide it.'
        ]
    },
    {
        v: '1.23', date: '13 Oct 2026',
        items: [
            'See also: under a word’s definition, a row of related words — the ones this definition mentions by name, and the ones whose definitions mention this word. Toggle leads to Switch, Switch back to Toggle. It comes from the text itself; nothing to set up.'
        ]
    },
    {
        v: '1.22', date: '13 Oct 2026',
        items: [
            'Search forgives spelling: when nothing is found, the page offers the closest-spelled words — “tooggle” suggests Toggle — one tap away. And accents no longer matter when searching: “lagg” finds “Lägg till”, “cache” finds “Cache”.'
        ]
    },
    {
        v: '1.21', date: '13 Oct 2026',
        items: [
            'Recent: the last eight words you opened now sit in a row under the filters on the Words page, newest first, one tap from opening again — the words you keep going back to, without typing. A small “clear” empties the row.'
        ]
    },
    {
        v: '1.20', date: '13 Oct 2026',
        items: [
            'No more doubles: while you type a word’s name, the form says when a word with that name is already in the dictionary and offers to open it. Saving under an existing name asks the same — open the existing word, or go back and change the name.'
        ]
    },
    {
        v: '1.19', date: '13 Oct 2026',
        items: [
            'Cancel and Save now also sit at the top of the Add / Edit form, Apple-style, and that bar stays put while the form scrolls — so Save is at hand even with the keyboard up, instead of somewhere below the photos. The Cancel / Save pair at the bottom is still there.'
        ]
    },
    {
        v: '1.18', date: '13 Oct 2026',
        items: [
            'Delete is now the last button on a word’s page, in quiet red, and it no longer asks first: the word goes straight to <strong>Recently deleted</strong> and a “Deleted — Undo” note shows for a few seconds. Settings lists the recently deleted words with a Put back button; after 30 days a deleted word is gone for good.'
        ]
    },
    {
        v: '1.17', date: '13 Oct 2026',
        items: [
            'When a search finds nothing, the page now offers <strong>Add “…” as a new word</strong> — one tap opens the form with the word already filled in, so a word you looked for and did not have is one tap from being added.'
        ]
    },
    {
        v: '1.16', date: '13 Oct 2026',
        items: [
            'A word’s page now follows the EN / DE / SV switch: the chosen language comes first and large, the other two sit smaller under it, and the same switch is right there on the page. If the word has no definition in the chosen language yet, the page says so and still shows the others.'
        ]
    },
    {
        v: '1.15', date: '13 Oct 2026',
        items: [
            'Paste: one tap puts whatever you last copied — a word from Mail or Safari — into the word field when adding a word, and into the search box on the Words page. The iPhone asks once with its small Paste bubble; nothing to set up.'
        ]
    },
    {
        v: '1.14', date: '13 Oct 2026',
        items: [
            'Listen: a new button under the definition reads the word and its definition aloud with the iPhone’s own voice, in the language the switch is on (or the one the word has). Tap again to stop. For nicer Swedish or German voices, the phone can download them under Settings › Accessibility › Spoken Content › Voices.'
        ]
    },
    {
        v: '1.13', date: '13 Oct 2026',
        items: [
            'The app now follows the iPhone’s own text-size setting (Settings › Display &amp; Brightness › Text Size), like a native app: make the text larger or smaller there and every word, definition and button in TechLingo follows. On the Mac nothing changes.'
        ]
    },
    {
        v: '1.12', date: '13 Oct 2026',
        items: [
            'The top of every screen is back right under the clock, where it was before 1.10 — you preferred it that way.'
        ]
    },
    {
        v: '1.11', date: '13 Oct 2026',
        items: [
            'Six small things put right after a sweep of the app. A new version arriving while you are typing a word no longer reloads the app under your fingers — it waits until the form is closed.',
            'Cancel now asks before throwing away what you typed, and the keyboard’s Return key in the word field moves on to the definition instead of saving a half-written word.',
            'Coming back from a word lands where you were in the list, not at the top.',
            'The + button no longer covers the last word’s star.',
            'Restoring a backup is all-or-nothing: if it cannot finish, your words stay exactly as they were.',
            'Photos shown on a word’s page and in the edit form are let go of again afterwards, so the app no longer grows heavier with every word you open.'
        ]
    },
    {
        v: '1.10', date: '13 Oct 2026',
        items: [
            'The title and the buttons at the top of every screen sit a little lower on the iPhone, out of the soft blur iOS draws under the clock, so they look sharp again. A photo opened full-screen keeps clear of the clock in the same way. On the Mac nothing moves.'
        ]
    },
    {
        v: '1.9', date: '2 Oct 2026',
        items: [
            'Search now puts the word itself first. Searching “switch” used to list Checkbox, Control Center and Dock above Switch, simply because the list stayed alphabetical. Now a word whose <strong>name</strong> matches comes first (an exact name, then names starting with what you typed, then names containing it), then words whose definition uses it as a whole word, and only then words that merely mention something like it (“switching”) or have it in their notes or category. Within each group your chosen sort still applies.'
        ]
    },
    {
        v: '1.8', date: '2 Oct 2026',
        items: [
            'On a word’s page the photos now sit in a <strong>strip you swipe sideways</strong>, one photo at a time, with small dots under it showing where you are — and the definition sits right under that, instead of below a tall stack of pictures. Tap a photo to see it full-screen as before.'
        ]
    },
    {
        v: '1.7', date: '2 Oct 2026',
        items: [
            'A word can now carry <strong>as many photos or screenshots as you like</strong>, not just one. In the edit screen, Add photo lets you pick several at once; each shows as a small thumbnail with a red × to take it away again. The word’s page shows them one under the other — tap any to see it full-screen.',
            'Words that already had a photo keep it: it simply becomes the first of the list. The list badge now counts them (“3 photos”), Share attaches every photo, and backup files hold all of them — older backup files still import fine.',
            'Two new UI tests: one adds two photos, takes one away, adds another, saves, and checks they are still there after a restart and travel with a share; the other proves a word from an older version keeps its photo when the app updates.'
        ]
    },
    {
        v: '1.6', date: '2 Oct 2026',
        items: [
            'A shared word now starts with a greeting: “Hello, this is Martin who wants to share Tech Lingo with you.” — so the person receiving it knows what it is before the word itself. The “— AMS TechLingo” sign-off at the end is gone, since the greeting already says it.'
        ]
    },
    {
        v: '1.5', date: '2 Oct 2026',
        items: [
            'Share a word: every word now has a <strong>Share</strong> button next to Edit. It opens the iPhone share sheet with the word, its definition (in the language the EN / DE / SV switch is on), your notes and the photo — ready for Messages, Mail, WhatsApp or AirDrop.',
            'A word you have just added now opens on its own page straight after saving, so it can be shared (or checked) right away instead of the app returning to the list.',
            'On a Mac or in a browser without a share sheet, Share copies the text so it can be pasted into a message.',
            'Automated UI tests now run on GitHub with every published change: one checks that the app starts and names its version, one adds a word with a photo and shares it.'
        ]
    },
    {
        v: '1.4', date: '10 Sep 2026',
        items: [
            'Backup export really saves. Inside an app opened from the Home Screen a plain download does nothing, so the export could save no file and still announce success. Export now goes through the share sheet (Save to Files, AirDrop, Mail…) and only reports a backup once one has actually been saved; a cancelled export says so.'
        ]
    },
    {
        v: '1.3', date: '5 Sep 2026',
        items: [
            'Offline-store housekeeping: when a new version arrives, only this app’s own old copies are removed — never those of the other AMS apps sharing the same web address.'
        ]
    },
    {
        v: '1.2', date: '4 Sep 2026',
        items: [
            'The offline store is now named after the app version, so a new version can never be mistaken for an old one.'
        ]
    },
    {
        v: '1.1', date: '31 Aug 2026',
        items: [
            'The Guide tab is now two foldable sections: “How to use this app” and “Version history”. Both start closed — tap a heading to open or close it.',
            'Version history rebuilt: every release now lists in detail what changed.'
        ]
    },
    {
        v: '1.0', date: '31 Aug 2026',
        items: [
            'First release of AMS TechLingo — a personal tech dictionary that works fully offline.',
            'Starter library of ~205 tech terms in 9 areas (AI, Web & Internet, Software & Apps, Hardware & Devices, Cloud & Data, Security & Privacy, Networking, Mac & iPhone, Development & Code).',
            'Every term has definitions in English, Deutsch and Svenska; the EN / DE / SV switch chooses the reading language, with fallback to English.',
            'First own word: “Panel” — marked with the “mine” badge and pre-starred.',
            'Search across terms, all three definitions, notes and categories.',
            'Category chips plus “My words” and “With photo” filters; sorting by A–Z, newest first, or last updated.',
            'Favorites: star any word, collected in the Favorites tab.',
            'Everything is editable — including the library words — and new categories can be created while adding a word.',
            'One photo or screenshot per word, added from camera or photo library, automatically shrunk to keep the app small, tap to view full-screen.',
            'Date stamps: every word shows when it was added and, if changed later, when it was last updated. Starring does not count as a change.',
            'Backup: export writes one file with all words, photos, favorites and dates; import first shows what is inside the file and asks before replacing anything.',
            'Hand-drawn icon set, amber theme, installable on the iPhone home screen as a PWA.'
        ]
    }
];

const $ = (sel) => document.querySelector(sel);

const state = {
    entries: [],
    tab: 'words',            // words | favorites | guide | settings
    lang: localStorage.getItem('tl-lang') || 'en',
    search: '',
    category: null,          // null = all
    onlyMine: false,
    onlyPhotos: false,
    sort: localStorage.getItem('tl-sort') || 'az',
    detailId: null,
    editId: null,            // null = adding new
    updateWaiting: false,    // a new version arrived while the edit form was open
    editSnapshot: '',        // the form as it was opened, to know whether Cancel throws anything away
    editSnapshotRest: '',    // the same without the name — "Open it" under a typed name asks only if more was typed
    editPhotos: [],          // the photos as they stand in the edit form
    photosTouched: false     // did he add or remove one? (only then does it count as a change)
};

/* ---------- helpers ---------- */

function uid() {
    return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
}

function esc(s) {
    return String(s || '').replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

function fmtDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function defFor(entry, lang) {
    return entry[lang] || entry.en || entry.de || entry.sv || '';
}

function toast(msg, { action = '', onAction = null, ms = 2600 } = {}) {
    const el = $('#toast');
    el.innerHTML = '';
    el.appendChild(document.createTextNode(msg));
    if (action) {                       // e.g. "Undo" — one tap, then the note goes
        const b = document.createElement('button');
        b.className = 'toast-action';
        b.dataset.testid = 'toast-action';
        b.textContent = action;
        b.onclick = () => { clearTimeout(toast._t); el.classList.add('hidden'); if (onAction) onAction(); };
        el.appendChild(b);
    }
    el.classList.remove('hidden');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.add('hidden'), ms);
}

/* A deleted word is kept, marked, for 30 days — so Delete is never final at once. */
const alive = (e) => !e.deletedAt;

/* A question with OK / Cancel — or, with `input`, a question that wants a typed
   answer (resolves with the text, or null on Cancel). */
function confirmDialog(title, text, { danger = false, okLabel = 'OK', kind = '', input, altLabel = '' } = {}) {
    return new Promise((resolve) => {
        $('#confirm-overlay').dataset.kind = kind;   // which question this is — the tests read it
        $('#confirm-title').textContent = title;
        $('#confirm-text').textContent = text;
        $('#confirm-yes').textContent = okLabel;
        const alt = $('#confirm-alt');
        alt.classList.toggle('hidden', !altLabel);
        alt.textContent = altLabel || '';
        const field = $('#confirm-input');
        const asks = input !== undefined;
        field.classList.toggle('hidden', !asks);
        if (asks) field.value = input;
        const box = document.querySelector('.confirm-box');
        box.classList.toggle('danger', danger);
        $('#confirm-overlay').classList.remove('hidden');
        if (asks) { field.focus(); field.select(); }
        const done = (val) => {
            $('#confirm-overlay').classList.add('hidden');
            $('#confirm-yes').onclick = null;
            $('#confirm-no').onclick = null;
            alt.onclick = null;
            field.onkeydown = null;
            resolve(val);
        };
        $('#confirm-yes').onclick = () => done(asks ? field.value : true);
        $('#confirm-no').onclick = () => done(asks ? null : false);
        alt.onclick = () => done('alt');
        if (asks) field.onkeydown = (ev) => { if (ev.key === 'Enter') { ev.preventDefault(); done(field.value); } };
    });
}

/* The categories in use, with the spelling they have. */
function categoryNames() {
    return [...new Set(state.entries.filter(alive).map((e) => e.category).filter(Boolean))].sort();
}
/* The existing spelling of a category typed in any capitals — or the text as typed. */
function matchCategory(name) {
    const n = name.trim().toLowerCase();
    return categoryNames().find((c) => c.toLowerCase() === n) || name.trim();
}

/* Rename a category for every word in it; renaming onto an existing one merges them. */
async function renameCategory(from) {
    const typed = await confirmDialog('Rename “' + from + '”', 'The new name for this category:', { okLabel: 'Rename', kind: 'rename-category', input: from });
    if (typed === null) return;
    const to = typed.trim();
    if (!to) { toast('A category needs a name'); return; }
    if (to === from) return;
    const target = matchCategory(to);
    const words = state.entries.filter((e) => e.category === from);
    if (target !== from && categoryNames().includes(target)) {
        const ok = await confirmDialog('Merge into “' + target + '”?',
            words.length + (words.length === 1 ? ' word moves' : ' words move') + ' from “' + from + '” into “' + target + '”.',
            { okLabel: 'Merge', kind: 'merge-category' });
        if (!ok) return;
    }
    words.forEach((e) => { e.category = target; });
    await TL_DB.putEntries(words);
    if (state.category === from) state.category = target;
    renderSettings();
    toast('“' + from + '” is now “' + target + '”');
}

/* ---------- seeding ---------- */

async function seedIfNeeded() {
    const seeded = await TL_DB.getMeta('seeded');
    const existing = await TL_DB.getAllEntries();
    if (existing.length > 0) {
        // Data already present (earlier seed or an import) — never seed on top of it.
        if (!seeded) await TL_DB.setMeta('seeded', true);
        return existing;
    }
    if (seeded) return existing; // seeded before, user deleted things — respect that
    const now = new Date().toISOString();
    const lib = TL_LIBRARY.map((e) => ({
        id: uid(), term: e.t, category: e.c,
        en: e.en, de: e.de, sv: e.sv, notes: '',
        favorite: false, source: 'library',
        createdAt: now, updatedAt: now, photos: []
    }));
    // Martin's own first word.
    lib.push({
        id: uid(), term: 'Panel', category: 'Software & Apps',
        en: 'A distinct section of an app’s window or screen that groups related controls or information — for example a side panel, a settings panel, or a preview panel.',
        de: 'Ein abgegrenzter Bereich eines App-Fensters oder Bildschirms, der zusammengehörige Bedienelemente oder Informationen bündelt — z. B. ein Seitenpanel oder ein Einstellungs-Panel.',
        sv: 'En avgränsad del av ett appfönster eller en skärm som samlar tillhörande kontroller eller information — t.ex. en sidopanel eller en inställningspanel.',
        notes: '', favorite: true, source: 'own',
        createdAt: now, updatedAt: now, photos: []
    });
    await TL_DB.putEntries(lib);
    await TL_DB.setMeta('seeded', true);
    return TL_DB.getAllEntries();
}

/* ---------- list rendering ---------- */

function visibleEntries() {
    let list = state.entries.filter(alive);
    if (state.tab === 'favorites') list = list.filter((e) => e.favorite);
    if (state.category) list = list.filter((e) => e.category === state.category);
    if (state.onlyMine) list = list.filter((e) => e.source === 'own');
    if (state.onlyPhotos) list = list.filter((e) => e.photos.length > 0);
    const q = fold(state.search);
    if (q) {
        list = list.filter((e) =>
            fold(e.term).includes(q) || fold(e.en).includes(q) || fold(e.de).includes(q) ||
            fold(e.sv).includes(q) || fold(e.notes).includes(q) || fold(e.category).includes(q));
    }
    list = [...list];
    const bySort = (a, b) => {
        if (state.sort === 'az') return a.term.localeCompare(b.term, undefined, { sensitivity: 'base' });
        if (state.sort === 'added') return (b.createdAt || '').localeCompare(a.createdAt || '');
        return (b.updatedAt || '').localeCompare(a.updatedAt || '');
    };
    if (q) {
        /* The word itself first, then the words that use it — never the alphabet
           deciding that “Checkbox” beats “Switch” for the search “switch”. */
        const rank = new Map(list.map((e) => [e.id, searchRank(e, q)]));
        list.sort((a, b) => (rank.get(a.id) - rank.get(b.id)) || bySort(a, b));
    } else {
        list.sort(bySort);
    }
    return list;
}

/* 0 the name is what was typed · 1 the name starts with it · 2 the name contains it
   · 3 a definition uses it as a whole word · 4 it merely appears somewhere
   (inside another word, in the notes, in the category). */
function searchRank(e, q) {
    const term = fold(e.term);
    if (term === q) return 0;
    if (term.startsWith(q)) return 1;
    if (term.includes(q)) return 2;
    const whole = new RegExp('(^|[^\\p{L}\\p{N}])' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^\\p{L}\\p{N}]|$)', 'iu');
    if ([e.en, e.de, e.sv].some((d) => d && whole.test(fold(d)))) return 3;
    return 4;
}

/* Lower-case with the accents taken off, so “lagg” finds “Lägg till”. */
function fold(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
}

/* How many letter changes apart two words are. */
function editDistance(a, b) {
    const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
        let diag = prev[0];
        prev[0] = i;
        for (let j = 1; j <= b.length; j++) {
            const tmp = prev[j];
            prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
            diag = tmp;
        }
    }
    return prev[b.length];
}

/* The closest-spelled names to what was typed — for the “Did you mean” offer. */
function closestNames(query) {
    const q = fold(query);
    if (q.length < 3) return [];
    const allow = Math.max(2, Math.floor(q.length / 3));
    return state.entries.filter(alive)
        .map((e) => ({ e, d: editDistance(q, fold(e.term)) }))
        .filter((x) => x.d <= allow)
        .sort((a, b) => a.d - b.d || a.e.term.localeCompare(b.e.term, undefined, { sensitivity: 'base' }))
        .slice(0, 3)
        .map((x) => x.e);
}

function renderCategoryChips() {
    const cats = [...new Set(state.entries.filter(alive).map((e) => e.category).filter(Boolean))].sort();
    const wrap = $('#category-chips');
    wrap.innerHTML = '';
    const all = document.createElement('button');
    all.className = 'chip' + (state.category === null ? ' active' : '');
    all.textContent = 'All';
    all.onclick = () => { state.category = null; renderList(); };
    wrap.appendChild(all);
    cats.forEach((c) => {
        const b = document.createElement('button');
        b.className = 'chip' + (state.category === c ? ' active' : '');
        b.textContent = c;
        b.onclick = () => { state.category = (state.category === c ? null : c); renderList(); };
        wrap.appendChild(b);
    });
}

/* When the last backup was made — shown in Settings, and asked for quietly after a month. */
async function noteBackup() {
    state.lastBackupAt = new Date().toISOString();
    await TL_DB.setMeta('lastBackupAt', state.lastBackupAt);
    renderBackupWhen();
}
function renderBackupWhen() {
    const el = $('#backup-when');
    const at = state.lastBackupAt;
    el.dataset.at = at || '';
    el.textContent = at ? 'Last backup: ' + fmtDate(at) + ' (' + daysAgo(at) + ')' : 'No backup made yet.';
}
function backupDue() {
    const at = state.lastBackupAt;
    const own = state.entries.filter((e) => alive(e) && e.source === 'own').length;
    if (!at) return own >= 5;
    return Date.now() - new Date(at).getTime() > 30 * 86400000;
}
function renderNudge() {
    const box = $('#backup-nudge');
    const snoozed = Number(localStorage.getItem('tl-backup-later') || 0) > Date.now();
    const show = state.tab === 'words' && !state.search && backupDue() && !snoozed;
    box.classList.toggle('hidden', !show);
    if (!show) return;
    $('#backup-nudge-text').textContent = state.lastBackupAt
        ? 'It has been ' + daysAgo(state.lastBackupAt).replace(' ago', '') + ' since your last backup.'
        : 'Your own words have no backup yet.';
}

/* One of his own words, chosen by the date — the same all day, a new one tomorrow.
   (With no own words yet, one of the starter words.) */
function wordOfTheDay() {
    const live = state.entries.filter(alive);
    let pool = live.filter((e) => e.source === 'own');
    if (!pool.length) pool = live;
    if (!pool.length) return null;
    pool = [...pool].sort((a, b) => a.id.localeCompare(b.id));
    const day = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
    return pool[day % pool.length];
}
function wotdWanted() { return localStorage.getItem('tl-wotd') !== 'off'; }
function renderWotd() {
    const box = $('#wotd');
    const plain = state.tab === 'words' && !state.search && !state.category && !state.onlyMine && !state.onlyPhotos;
    const e = plain && wotdWanted() ? wordOfTheDay() : null;
    box.classList.toggle('hidden', !e);
    box.innerHTML = '';
    if (!e) { delete box.dataset.id; return; }
    box.dataset.id = e.id;
    box.innerHTML = '<div class="wotd-label">Word of the day</div>' +
        '<div class="wotd-term">' + esc(e.term) + '</div>' +
        '<div class="wotd-def">' + esc(defFor(e, state.lang) || '—') + '</div>';
    box.onclick = () => openDetail(e.id);
}

/* The last eight words opened, newest first. Kept on this device only. */
const RECENT_MAX = 8;
function recentIds() {
    try { return JSON.parse(localStorage.getItem('tl-recent') || '[]'); } catch { return []; }
}
function noteRecent(id) {
    const ids = [id, ...recentIds().filter((x) => x !== id)].slice(0, RECENT_MAX);
    localStorage.setItem('tl-recent', JSON.stringify(ids));
}
function renderRecent() {
    const row = $('#recent-row');
    const wrap = $('#recent-chips');
    const words = recentIds().map((id) => state.entries.find((e) => e.id === id)).filter((e) => e && alive(e));
    const show = state.tab === 'words' && !state.search && words.length > 0;
    row.classList.toggle('hidden', !show);
    wrap.innerHTML = '';
    if (!show) return;
    words.forEach((e) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'chip';
        b.dataset.testid = 'recent-chip';
        b.dataset.id = e.id;
        b.textContent = e.term;
        b.onclick = () => openDetail(e.id);
        wrap.appendChild(b);
    });
}

function renderList() {
    renderCategoryChips();
    renderRecent();
    renderWotd();
    renderNudge();
    $('#chip-mine').classList.toggle('active', state.onlyMine);
    $('#chip-photos').classList.toggle('active', state.onlyPhotos);
    $('#list-title').textContent = state.tab === 'favorites' ? 'Favorites' : 'TechLingo';
    document.querySelectorAll('#lang-switch button').forEach((b) =>
        b.classList.toggle('active', b.dataset.lang === state.lang));
    $('#sort-select').value = state.sort;

    const list = visibleEntries();
    const wrap = $('#entry-list');
    wrap.innerHTML = '';
    const empty = $('#empty-state');
    if (list.length === 0) {
        empty.classList.remove('hidden');
        empty.innerHTML = '';
        if (state.search) {
            // The word he looked for and does not have: one tap from being added.
            const p = document.createElement('p');
            p.textContent = 'Nothing found for “' + state.search + '”.';
            const close = closestNames(state.search);
            if (close.length) {                        // ...unless it is just spelt differently
                const row = document.createElement('div');
                row.className = 'suggest-row';
                row.dataset.testid = 'suggest-row';
                const lab = document.createElement('span');
                lab.textContent = 'Did you mean';
                row.appendChild(lab);
                close.forEach((e) => {
                    const b = document.createElement('button');
                    b.type = 'button';
                    b.className = 'chip';
                    b.dataset.testid = 'suggest-chip';
                    b.dataset.id = e.id;
                    b.textContent = e.term;
                    b.onclick = () => {
                        $('#search-input').value = e.term;
                        state.search = e.term;
                        $('#search-clear').classList.remove('hidden');
                        $('#search-paste').classList.add('hidden');
                        renderList();
                    };
                    row.appendChild(b);
                });
                empty.appendChild(p);
                empty.appendChild(row);
                p.textContent = 'Nothing found for “' + state.search + '”.';
            } else {
                empty.appendChild(p);
            }
            const add = document.createElement('button');
            add.className = 'btn primary';
            add.dataset.testid = 'empty-add';
            add.innerHTML = '<svg class="icon"><use href="#icon-plus"/></svg> Add “' + esc(state.search) + '” as a new word';
            add.onclick = () => openEdit(null, { term: state.search });
            empty.appendChild(add);
        } else {
            empty.textContent = state.tab === 'favorites'
                ? 'No favorites yet. Tap the star on any word to collect it here.'
                : 'Nothing here yet — add the first word with the + button.';
        }
    } else {
        empty.classList.add('hidden');
        empty.innerHTML = '';          // no stale offer lingering out of sight
    }

    const frag = document.createDocumentFragment();
    const counter = document.createElement('div');
    counter.className = 'count-line';
    counter.dataset.testid = 'count-line';
    counter.dataset.count = String(list.length);
    counter.textContent = list.length + (list.length === 1 ? ' word' : ' words');
    frag.appendChild(counter);

    list.forEach((e) => {
        const card = document.createElement('div');
        card.className = 'entry-card';
        card.dataset.testid = 'entry-card';
        card.dataset.id = e.id;
        card.innerHTML =
            '<div class="entry-main">' +
                '<div class="entry-term">' + esc(e.term) +
                    (e.source === 'own' ? '<span class="badge">mine</span>' : '') +
                    (e.photos.length ? '<span class="badge photo">' + (e.photos.length === 1 ? 'photo' : e.photos.length + ' photos') + '</span>' : '') +
                '</div>' +
                '<div class="entry-def">' + esc(defFor(e, state.lang)) + '</div>' +
                '<div class="entry-cat">' + esc(e.category || '') + '</div>' +
            '</div>' +
            '<button class="ghost-btn star-btn' + (e.favorite ? ' faved' : '') + '" aria-label="Favorite">' +
                '<svg class="icon"><use href="#icon-star"/></svg></button>';
        card.querySelector('.star-btn').onclick = (ev) => {
            ev.stopPropagation();
            toggleFavorite(e.id);
        };
        card.onclick = () => openDetail(e.id);
        frag.appendChild(card);
    });
    wrap.appendChild(frag);
}

async function toggleFavorite(id) {
    const e = state.entries.find((x) => x.id === id);
    if (!e) return;
    e.favorite = !e.favorite;
    // Favoriting is not a content edit — it must not bump updatedAt.
    await TL_DB.putEntry(e);
    if (!$('#view-detail').classList.contains('hidden') && state.detailId === id) {
        $('#detail-star').classList.toggle('faved', e.favorite);
        $('#detail-star svg').style.fill = e.favorite ? 'currentColor' : 'none';
    }
    if (!$('#view-list').classList.contains('hidden')) renderList();
}

/* ---------- navigation ---------- */

/* Where the list was scrolled to when a word was opened — so Back lands there. */
const scrollMemory = { list: 0, listTab: null };

/* Which way a screen change moves: a word opens to the right, Back comes from the left. */
function navDirection(from, to) {
    if (!from || from === to) return 'none';
    const forward = { list: ['detail', 'edit'], detail: ['edit'] };
    if ((forward[from] || []).includes(to)) return 'forward';
    const back = { detail: ['list'], edit: ['detail', 'list'] };
    if ((back[from] || []).includes(to)) return 'back';
    return 'fade';
}

function showView(name, after) {
    const leaving = document.body.dataset.screen;
    if (leaving === 'list') { scrollMemory.list = window.scrollY; scrollMemory.listTab = state.tab; }
    if (leaving === 'detail' && name !== 'detail') { freePictures('detail'); stopReading(); closeLightbox(); }
    if (leaving === 'edit') freePictures('thumbs');
    const swap = () => {
        ['list', 'detail', 'edit', 'guide', 'settings'].forEach((v) =>
            $('#view-' + v).classList.toggle('hidden', v !== name));
        $('#tab-bar').classList.toggle('hidden', name === 'edit');
        $('#search-dock').classList.toggle('hidden', name !== 'list');
        document.body.dataset.screen = name;   // the tests read this, after the swap
        window.scrollTo(0, 0);
        if (after) after();
        if (state.updateWaiting && name !== 'edit') {
            // A new version arrived while he was typing; the form is closed now.
            state.updateWaiting = false;
            window.location.reload();
        }
    };
    const dir = navDirection(leaving, name);
    document.documentElement.dataset.nav = dir;
    const animate = dir !== 'none' && typeof document.startViewTransition === 'function' &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches && !document.hidden;
    if (animate) document.startViewTransition(swap);   // the swap happens inside the slide
    else swap();
}

/* Full screen: all of the word's photos in a strip, opened at the one tapped. */
function openLightbox(e, index) {
    const strip = $('#lightbox-strip');
    freePictures('lightbox');
    strip.innerHTML = '';
    e.photos.forEach((blob, i) => {
        const slide = document.createElement('div');
        slide.className = 'lightbox-slide';
        const img = document.createElement('img');
        img.alt = 'Photo ' + (i + 1) + ' of ' + e.photos.length + ' for ' + e.term;
        img.src = pictureURL('lightbox', blob);
        slide.appendChild(img);
        strip.appendChild(slide);
    });
    const counter = $('#lightbox-counter');
    counter.dataset.count = String(e.photos.length);
    const setIndex = (i) => {
        strip.dataset.index = String(i);
        counter.dataset.index = String(i);
        counter.textContent = e.photos.length > 1 ? (i + 1) + ' of ' + e.photos.length : '';
    };
    strip.onscroll = () => setIndex(Math.round(strip.scrollLeft / strip.clientWidth));
    $('#lightbox').classList.remove('hidden');
    strip.scrollLeft = index * strip.clientWidth;      // open at the photo that was tapped
    setIndex(index);
    document.body.dataset.lightbox = 'open';
}
function closeLightbox() {
    $('#lightbox').classList.add('hidden');
    freePictures('lightbox');
    $('#lightbox-strip').innerHTML = '';
    document.body.dataset.lightbox = 'closed';
}

/* Picture addresses handed to <img> tags are freed again when the screen that
   used them is left — otherwise every opened word keeps its photos in memory. */
const liveURLs = { detail: [], thumbs: [], lightbox: [] };
function pictureURL(group, blob) {
    const url = URL.createObjectURL(blob);
    liveURLs[group].push(url);
    return url;
}
function freePictures(group) {
    liveURLs[group].forEach((u) => URL.revokeObjectURL(u));
    liveURLs[group] = [];
}

function switchTab(tab) {
    state.tab = tab;
    document.querySelectorAll('#tab-bar button').forEach((b) =>
        b.classList.toggle('active', b.dataset.tab === tab));
    const cameFrom = document.body.dataset.screen;
    if (tab === 'words' || tab === 'favorites') {
        showView('list', () => {
            renderList();
            // Back from a word lands where the list was, not at the top.
            if ((cameFrom === 'detail' || cameFrom === 'edit') && scrollMemory.listTab === tab) {
                window.scrollTo(0, scrollMemory.list);
            }
        });
    } else if (tab === 'guide') {
        showView('guide');
    } else {
        renderSettings();
        showView('settings');
    }
}

/* ---------- detail ---------- */

function openDetail(id) {
    const e = state.entries.find((x) => x.id === id);
    if (!e) return;
    state.detailId = id;
    noteRecent(id);
    freePictures('detail');
    $('#view-detail').dataset.id = id;
    delete document.body.dataset.share;    // a fresh page, no verdict yet
    $('#detail-term').textContent = e.term;
    const star = $('#detail-star');
    star.classList.toggle('faved', e.favorite);
    star.querySelector('svg').style.fill = e.favorite ? 'currentColor' : 'none';

    const body = $('#detail-body');
    body.innerHTML = '';

    if (e.photos.length) {
        /* A strip you swipe sideways, one photo per page, so the definition is
           always right under it — however many photos, however tall. */
        const wrap = document.createElement('div');
        wrap.className = 'photo-strip-wrap';
        const strip = document.createElement('div');
        strip.className = 'photo-strip';
        strip.dataset.testid = 'detail-photos';
        strip.dataset.index = '0';
        e.photos.forEach((blob, i) => {
            const slide = document.createElement('div');
            slide.className = 'photo-slide';
            const img = document.createElement('img');
            img.className = 'detail-photo';
            img.dataset.testid = 'detail-photo';
            img.alt = 'Photo ' + (i + 1) + ' for ' + e.term;
            img.src = pictureURL('detail', blob);
            img.onclick = () => openLightbox(e, i);
            slide.appendChild(img);
            strip.appendChild(slide);
        });
        wrap.appendChild(strip);
        if (e.photos.length > 1) {
            const dots = document.createElement('div');
            dots.className = 'photo-dots';
            e.photos.forEach((_, i) => {
                const d = document.createElement('span');
                d.className = 'photo-dot' + (i === 0 ? ' on' : '');
                d.dataset.testid = 'photo-dot';
                d.dataset.on = i === 0 ? '1' : '0';
                dots.appendChild(d);
            });
            strip.addEventListener('scroll', () => {
                const i = Math.round(strip.scrollLeft / strip.clientWidth);
                strip.dataset.index = String(i);
                dots.querySelectorAll('.photo-dot').forEach((d, k) => {
                    d.classList.toggle('on', k === i);
                    d.dataset.on = k === i ? '1' : '0';
                });
            }, { passive: true });
            wrap.appendChild(dots);
        }
        body.appendChild(wrap);
    }

    body.appendChild(definitionCard(e));

    const related = relatedWords(e);
    if (related.length) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.testid = 'see-also';
        card.innerHTML = '<h2>See also</h2>';
        const row = document.createElement('div');
        row.className = 'see-also-row';
        related.forEach((r) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'chip';
            b.dataset.testid = 'see-also-chip';
            b.dataset.id = r.id;
            b.textContent = r.term;
            b.onclick = () => openDetail(r.id);
            row.appendChild(b);
        });
        card.appendChild(row);
        body.appendChild(card);
    }

    if (e.notes) {
        const n = document.createElement('div');
        n.className = 'card';
        n.innerHTML = '<h2>Notes</h2><p>' + esc(e.notes) + '</p>';
        body.appendChild(n);
    }

    const info = document.createElement('div');
    info.className = 'card';
    const updatedDiffers = e.updatedAt && e.createdAt &&
        (new Date(e.updatedAt) - new Date(e.createdAt)) > 60000;
    info.innerHTML = '<h2>Info</h2>' +
        '<p class="date-line">Category: ' + esc(e.category || '—') + '</p>' +
        '<p class="date-line">Source: ' + (e.source === 'own' ? 'my own word' : 'starter library') + '</p>' +
        '<p class="date-line">Added: ' + fmtDate(e.createdAt) + '</p>' +
        (updatedDiffers ? '<p class="date-line">Updated: ' + fmtDate(e.updatedAt) + '</p>' : '');
    body.appendChild(info);

    showView('detail');
}

/* Related words, from the text itself: the ones this word's text names, then
   the ones whose text names this word. Names under three letters are too
   common to be a link. At most eight. */
const allText = (e) => fold([e.en, e.de, e.sv, e.notes].join(' '));
function mentions(text, name) {
    const n = fold(name);
    if (n.length < 3) return false;
    const re = new RegExp('(^|[^\\p{L}\\p{N}])' + n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^\\p{L}\\p{N}]|$)', 'u');
    return re.test(text);
}
function relatedWords(e) {
    const mine = allText(e);
    const others = state.entries.filter((x) => alive(x) && x.id !== e.id);
    const byName = (a, b) => a.term.localeCompare(b.term, undefined, { sensitivity: 'base' });
    const named = others.filter((x) => mentions(mine, x.term)).sort(byName);
    const naming = others.filter((x) => !named.includes(x) && mentions(allText(x), e.term)).sort(byName);
    return [...named, ...naming].slice(0, 8);
}

const LANG_LABEL = { en: 'English', de: 'Deutsch', sv: 'Svenska' };

/* The definition card: the chosen language first and large, the other two
   smaller under it, and the EN / DE / SV switch right there on the page. */
function definitionCard(e) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.testid = 'detail-definition';
    const chosen = state.lang;
    const any = ['en', 'de', 'sv'].some((l) => e[l]);
    const others = ['en', 'de', 'sv'].filter((l) => l !== chosen && e[l]);
    let html = '<div class="card-head"><h2>Definition</h2>' +
        '<div class="lang-switch small" id="detail-lang-switch" role="group" aria-label="Language">' +
        ['en', 'de', 'sv'].map((l) =>
            '<button type="button" data-lang="' + l + '" data-testid="detail-lang-' + l + '"' +
            (l === chosen ? ' class="active"' : '') + '>' + l.toUpperCase() + '</button>').join('') +
        '</div></div>';
    if (e[chosen]) {
        html += '<div class="def-block def-main" data-testid="def-main" data-lang="' + chosen + '">' +
            '<div class="def-lang">' + LANG_LABEL[chosen] + '</div><p>' + esc(e[chosen]) + '</p></div>';
    } else {
        html += '<div class="def-block def-main" data-testid="def-main" data-lang="' + chosen + '" data-missing="1">' +
            '<div class="def-lang">' + LANG_LABEL[chosen] + '</div><p class="muted">' +
            (any ? 'No ' + LANG_LABEL[chosen] + ' definition yet — tap Edit to add one.'
                 : 'No definition yet — tap Edit to write one.') + '</p></div>';
    }
    html += '<div class="def-tools">';
    if (any) {
        html += '<button type="button" class="btn secondary listen-btn" id="detail-listen" data-testid="detail-listen">' +
            '<svg class="icon"><use href="#icon-speaker"/></svg> <span>Listen</span></button>';
        html += '<button type="button" class="btn secondary" id="detail-copy" data-testid="detail-copy">' +
            '<svg class="icon"><use href="#icon-copy"/></svg> Copy</button>';
    }
    html += '<a class="btn secondary" id="detail-web" data-testid="detail-web" target="_blank" rel="noopener" href="' +
        'https://www.google.com/search?q=' + encodeURIComponent('define ' + e.term) + '">' +
        '<svg class="icon"><use href="#icon-globe"/></svg> Look up</a>';
    html += '</div>';
    if (others.length) {
        html += '<div class="def-others">' + others.map((l) =>
            '<div class="def-block def-other" data-testid="def-other" data-lang="' + l + '">' +
            '<div class="def-lang">' + LANG_LABEL[l] + '</div><p>' + esc(e[l]) + '</p></div>').join('') + '</div>';
    }
    card.innerHTML = html;
    const listen = card.querySelector('#detail-listen');
    if (listen) listen.onclick = readAloud;
    const copy = card.querySelector('#detail-copy');
    if (copy) copy.onclick = () => copyDefinition(e);
    card.querySelectorAll('#detail-lang-switch button').forEach((b) => {
        b.onclick = () => {
            state.lang = b.dataset.lang;
            localStorage.setItem('tl-lang', state.lang);
            stopReading();
            card.replaceWith(definitionCard(e));   // the same choice the list uses
        };
    });
    return card;
}

/* ---------- add / edit ---------- */

function categoryOptions(selected) {
    const cats = [...new Set([
        ...state.entries.filter(alive).map((e) => e.category).filter(Boolean)
    ])].sort();
    const sel = $('#f-category');
    sel.innerHTML = '';
    cats.forEach((c) => {
        const o = document.createElement('option');
        o.value = c; o.textContent = c;
        if (c === selected) o.selected = true;
        sel.appendChild(o);
    });
    const o = document.createElement('option');
    o.value = '__new__'; o.textContent = '+ New category…';
    sel.appendChild(o);
    $('#f-newcat-wrap').classList.add('hidden');
    $('#f-newcat').value = '';
}

function openEdit(id, { term = '' } = {}) {
    state.editId = id;
    const e = id ? state.entries.find((x) => x.id === id) : null;
    $('#edit-title').textContent = e ? 'Edit word' : 'Add word';
    $('#f-term').value = e ? e.term : term;   // a new word may arrive pre-filled from an empty search
    $('#dup-hint').classList.add('hidden');
    categoryOptions(e ? e.category : 'Software & Apps');
    $('#f-en').value = e ? (e.en || '') : '';
    $('#f-de').value = e ? (e.de || '') : '';
    $('#f-sv').value = e ? (e.sv || '') : '';
    $('#f-notes').value = e ? (e.notes || '') : '';
    state.editPhotos = e ? [...e.photos] : [];
    state.photosTouched = false;
    renderPhotoThumbs();
    $('#f-photo').value = '';
    state.editSnapshot = formSnapshot();   // what the form looked like before he touched it
    state.editSnapshotRest = formSnapshot(false);   // the same, name left out
    updateDupHint();
    showView('edit');
}

/* Names compared the way a person reads them: case and stray spaces do not count. */
function sameName(term, exceptId) {
    const norm = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');
    const t = norm(term);
    if (!t) return null;
    return state.entries.filter(alive).find((e) => e.id !== exceptId && norm(e.term) === t) || null;
}

/* Under the word field: "already in your dictionary — Open it", live as he types. */
function updateDupHint() {
    const dup = sameName($('#f-term').value, state.editId);
    const hint = $('#dup-hint');
    hint.classList.toggle('hidden', !dup);
    hint.dataset.id = dup ? dup.id : '';
    if (dup) $('#dup-text').textContent = '“' + dup.term + '” is already in your dictionary.';
}

/* The form's text as one string — compared on Cancel to know whether anything was typed. */
function formSnapshot(withName = true) {
    return JSON.stringify([withName ? $('#f-term').value : '', $('#f-category').value, $('#f-newcat').value,
        $('#f-en').value, $('#f-de').value, $('#f-sv').value, $('#f-notes').value]);
}

/* The thumbnails in the edit form: one per photo, each with its own ×. */
function renderPhotoThumbs() {
    const wrap = $('#f-photo-list');
    wrap.innerHTML = '';
    freePictures('thumbs');
    state.editPhotos.forEach((blob, i) => {
        const t = document.createElement('div');
        t.className = 'photo-thumb';
        t.dataset.testid = 'f-photo-thumb';
        const img = document.createElement('img');
        img.alt = 'Photo ' + (i + 1);
        img.src = pictureURL('thumbs', blob);
        const x = document.createElement('button');
        x.type = 'button';
        x.className = 'thumb-x';
        x.dataset.testid = 'f-photo-remove';
        x.setAttribute('aria-label', 'Remove photo ' + (i + 1));
        x.innerHTML = '<svg class="icon"><use href="#icon-close"/></svg>';
        x.onclick = () => {
            state.editPhotos.splice(i, 1);
            state.photosTouched = true;
            renderPhotoThumbs();
        };
        t.appendChild(img);
        t.appendChild(x);
        wrap.appendChild(t);
    });
    wrap.classList.toggle('hidden', state.editPhotos.length === 0);
    $('#f-photo-label').textContent = state.editPhotos.length ? 'Add another photo' : 'Add photo';
}

/* Downscale a picked image so the database stays small. */
function processPhoto(file) {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            const MAX = 1400;
            let { width, height } = img;
            if (width > MAX || height > MAX) {
                const s = Math.min(MAX / width, MAX / height);
                width = Math.round(width * s);
                height = Math.round(height * s);
            }
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').drawImage(img, 0, 0, width, height);
            canvas.toBlob((blob) => {
                URL.revokeObjectURL(url);
                blob ? resolve(blob) : reject(new Error('Could not process image'));
            }, 'image/jpeg', 0.82);
        };
        img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not read image')); };
        img.src = url;
    });
}

async function saveEdit(ev) {
    ev.preventDefault();
    const term = $('#f-term').value.trim();
    if (!term) { toast('Please enter the word itself'); $('#f-term').focus(); return; }
    let category = $('#f-category').value;
    if (category === '__new__') {
        category = $('#f-newcat').value.trim();
        if (!category) { toast('Please name the new category'); $('#f-newcat').focus(); return; }
        category = matchCategory(category);        // "ai" joins "AI" rather than becoming a second category
    }
    const dup = sameName(term, state.editId);
    if (dup) {
        const open = await confirmDialog('“' + dup.term + '” is already here',
            'You already have a word called ' + dup.term + '. Open it instead, or go back and change the name.',
            { okLabel: 'Open it', kind: 'duplicate' });
        if (open) openDetail(dup.id);
        return;
    }
    const now = new Date().toISOString();
    const existing = state.editId ? state.entries.find((x) => x.id === state.editId) : null;
    const entry = existing ? { ...existing } : {
        id: uid(), favorite: false, source: 'own', createdAt: now, photos: []
    };
    const before = existing
        ? JSON.stringify([existing.term, existing.category, existing.en, existing.de, existing.sv, existing.notes])
        : null;
    entry.term = term;
    entry.category = category;
    entry.en = $('#f-en').value.trim();
    entry.de = $('#f-de').value.trim();
    entry.sv = $('#f-sv').value.trim();
    entry.notes = $('#f-notes').value.trim();
    entry.photos = state.editPhotos;
    const after = JSON.stringify([entry.term, entry.category, entry.en, entry.de, entry.sv, entry.notes]);
    if (!existing || before !== after || state.photosTouched) {
        entry.updatedAt = now;
    }
    await TL_DB.putEntry(entry);
    const idx = state.entries.findIndex((x) => x.id === entry.id);
    if (idx >= 0) state.entries[idx] = entry; else state.entries.push(entry);
    toast(existing ? 'Saved' : 'Added "' + term + '"');
    if (!existing || state.detailId === entry.id) {
        // A word written just now lands on its own page — where Share and Edit
        // are — rather than back in the list it would then have to be found in.
        openDetail(entry.id);
    } else {
        switchTab(state.tab === 'favorites' ? 'favorites' : 'words');
    }
}

async function deleteCurrent() {
    const e = state.entries.find((x) => x.id === state.detailId);
    if (!e) return;
    e.deletedAt = new Date().toISOString();      // kept, marked — see Recently deleted in Settings
    await TL_DB.putEntry(e);
    switchTab(state.tab === 'favorites' ? 'favorites' : 'words');
    toast('Deleted “' + e.term + '”', { action: 'Undo', onAction: () => restoreDeleted(e.id), ms: 6000 });
}

async function restoreDeleted(id) {
    const e = state.entries.find((x) => x.id === id);
    if (!e || !e.deletedAt) return;
    delete e.deletedAt;
    await TL_DB.putEntry(e);
    if (!$('#view-list').classList.contains('hidden')) renderList();
    if (!$('#view-settings').classList.contains('hidden')) renderSettings();
    toast('“' + e.term + '” is back');
}

/* At start: whatever has sat in Recently deleted for 30 days is removed for good. */
async function purgeOldDeleted() {
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const gone = state.entries.filter((e) => e.deletedAt && new Date(e.deletedAt).getTime() < cutoff);
    for (const e of gone) await TL_DB.deleteEntry(e.id);
    if (gone.length) state.entries = state.entries.filter((e) => !gone.includes(e));
}

function daysAgo(iso) {
    const d = Math.round((Date.now() - new Date(iso).getTime()) / 86400000);
    return d <= 0 ? 'today' : d === 1 ? 'yesterday' : d + ' days ago';
}

/* ---------- paste ---------- */

/* The first line of what was last copied, or null when the phone did not allow it. */
async function readClipboard() {
    if (!navigator.clipboard || !navigator.clipboard.readText) return null;
    try {
        return (await navigator.clipboard.readText()).split('\n')[0].trim();
    } catch {
        return null;
    }
}

async function pasteInto(target) {
    const text = await readClipboard();
    if (text === null) { toast('Paste wasn’t allowed'); return; }
    if (!text) { toast('Nothing to paste'); return; }
    if (target === 'term') {
        $('#f-term').value = text;
        $('#f-en').focus();
        document.body.dataset.paste = 'term';
    } else {
        $('#search-input').value = text;
        state.search = text;
        $('#search-clear').classList.remove('hidden');
        $('#search-paste').classList.add('hidden');
        renderList();
        document.body.dataset.paste = 'search';
    }
}

/* The word and its definition (in the language shown first), onto the clipboard. */
async function copyDefinition(e) {
    const lang = e[state.lang] ? state.lang : (['en', 'de', 'sv'].find((l) => e[l]) || 'en');
    const text = e.term + ' — ' + (e[lang] || '');
    try {
        await navigator.clipboard.writeText(text);
        toast('Copied');
        document.body.dataset.copied = 'definition';
    } catch {
        toast('Copy wasn’t allowed');
    }
}

/* ---------- read aloud ---------- */

const SPEECH_LANG = { en: 'en-US', de: 'de-DE', sv: 'sv-SE' };
let speakingNow = null;   // kept in a variable on purpose: iOS drops an utterance it no longer holds

function canSpeak() {
    return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

/* The phone's voice for a language, if it has one; otherwise the phone picks. */
function voiceFor(tag) {
    const voices = speechSynthesis.getVoices() || [];
    const lang = tag.toLowerCase();
    return voices.find((v) => v.lang.toLowerCase() === lang) ||
           voices.find((v) => v.lang.toLowerCase().startsWith(lang.slice(0, 2))) || null;
}

function setSpeechState(s) {
    document.body.dataset.speech = s;
    const btn = $('#detail-listen');
    if (btn) btn.querySelector('span').textContent = s === 'speaking' ? 'Stop' : 'Listen';
}

function stopReading() {
    if (canSpeak() && (speechSynthesis.speaking || speechSynthesis.pending)) speechSynthesis.cancel();
    if (document.body.dataset.speech === 'speaking') setSpeechState('stopped');
}

/* Reads the word and its definition in the language the switch is on — or, if the
   word has no definition in that language, in the first one it does have. */
function readAloud() {
    const e = state.entries.find((x) => x.id === state.detailId);
    if (!e) return;
    if (!canSpeak()) { toast('Reading aloud is not available in this browser'); return; }
    if (document.body.dataset.speech === 'speaking') { stopReading(); return; }   // tapped again: stop
    const lang = e[state.lang] ? state.lang : (['en', 'de', 'sv'].find((l) => e[l]) || 'en');
    const u = new SpeechSynthesisUtterance(e.term + '. ' + (e[lang] || ''));
    u.lang = SPEECH_LANG[lang];
    const voice = voiceFor(u.lang);
    if (voice) u.voice = voice;
    u.rate = 0.95;
    u.onend = () => setSpeechState('done');
    u.onerror = () => setSpeechState('failed');
    speakingNow = u;
    speechSynthesis.cancel();
    setSpeechState('speaking');
    speechSynthesis.speak(u);
}

/* ---------- share ---------- */

/* The message itself: a greeting (his words), then the word, its definition in
   the reading language, the notes. Plain text on purpose — it is going into an SMS. */
const SHARE_GREETING = 'Hello, this is Martin who wants to share Tech Lingo with you.';

function shareTextFor(e, lang) {
    const lines = [SHARE_GREETING, '', e.term + (e.category ? ' · ' + e.category : '')];
    const def = defFor(e, lang);
    if (def) lines.push('', def);
    if (e.notes) lines.push('', 'Notes: ' + e.notes);
    return lines.join('\n');
}

/* The photos as files the share sheet can attach, named after the word. */
function shareFilesFor(e) {
    const safe = String(e.term || '').replace(/[\\/:*?"<>|]+/g, '-').trim() || 'word';
    return e.photos.map((blob, i) => {
        const type = blob.type || 'image/jpeg';
        const ext = type === 'image/png' ? 'png' : 'jpg';
        const n = e.photos.length > 1 ? '-' + (i + 1) : '';
        return new File([blob], safe + n + '.' + ext, { type });
    });
}

async function shareCurrent() {
    const e = state.entries.find((x) => x.id === state.detailId);
    if (!e) return;
    const text = shareTextFor(e, state.lang);
    const files = shareFilesFor(e);
    /* Everything above is synchronous on purpose: the share sheet may only open
       straight from the tap, and an await in between loses that permission. */
    if (navigator.share) {
        const data = { title: e.term, text };
        if (files.length && navigator.canShare && navigator.canShare({ files })) data.files = files;
        try {
            await navigator.share(data);
            document.body.dataset.share = 'shared';
            return;
        } catch (err) {
            if (err && err.name === 'AbortError') {
                document.body.dataset.share = 'cancelled';
                return;
            }
            // Anything else: fall through and at least hand over the text.
        }
    }
    try {                                // no share sheet here (older Mac browsers)
        await navigator.clipboard.writeText(text);
        toast(files.length ? 'Text copied (without the photos) — paste it into a message'
                           : 'Text copied — paste it into a message');
        document.body.dataset.share = 'copied';
    } catch {
        toast('Sharing is not available in this browser');
        document.body.dataset.share = 'failed';
    }
}

/* ---------- photos: 1.6 → 1.7 ---------- */

/* Up to 1.6 a word carried ONE photo (`photo`); from 1.7 it carries a list
   (`photos`). Older words are moved over once, here, before anything reads
   them — nothing is dropped, and a word is only written back when its shape
   actually changed. */
async function migratePhotos(entries) {
    const changed = [];
    entries.forEach((e) => {
        if (Array.isArray(e.photos)) return;
        e.photos = e.photo ? [e.photo] : [];
        delete e.photo;
        changed.push(e);
    });
    if (changed.length) await TL_DB.putEntries(changed);
    return changed.length;
}

/* ---------- backup ---------- */

function blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result);
        r.onerror = () => reject(r.error);
        r.readAsDataURL(blob);
    });
}

function dataURLToBlob(dataURL) {
    const [head, data] = dataURL.split(',');
    const mime = (head.match(/data:(.*?);/) || [])[1] || 'image/jpeg';
    const bin = atob(data);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new Blob([arr], { type: mime });
}

async function exportBackup() {
    const entries = await TL_DB.getAllEntries();
    if (entries.length === 0) {
        toast('Nothing to export yet');
        return;
    }
    const out = [];
    for (const e of entries) {
        if (e.deletedAt) continue;                 // the bin is not part of a backup
        const copy = { ...e };
        copy.photos = [];
        for (const blob of e.photos) copy.photos.push(await blobToDataURL(blob));
        delete copy.photo;
        out.push(copy);
    }
    const payload = {
        app: 'AMS TechLingo',
        formatVersion: 2,              // 2 = a list of photos per word (1 had one)
        appVersion: APP_VERSION,
        exportedAt: new Date().toISOString(),
        entryCount: out.length,
        entries: out
    };
    /* A plain download link does nothing inside an app opened from the Home Screen,
       so this used to be able to save no file at all and still announce success.
       Share sheet first, and only claim a backup once a save has really happened. */
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    const stamp = new Date().toISOString().slice(0, 10);
    const name = 'AMS-TechLingo-backup-' + stamp + '.json';
    const file = new File([blob], name, { type: 'application/json' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
            await navigator.share({ files: [file], title: 'AMS TechLingo backup' });
            await noteBackup();
            toast('Backup saved — ' + out.length + ' words');
        } catch (err) {
            toast(err && err.name === 'AbortError'
                ? 'Backup cancelled — nothing was saved'
                : 'Could not save the backup');
        }
        return;
    }
    try {                                // desktop browsers, where a download works
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
        await noteBackup();
        toast('Backup saved — ' + out.length + ' words');
    } catch (err) {
        toast('Could not save the backup');
    }
}

async function importBackup(file) {
    let payload;
    try {
        payload = JSON.parse(await file.text());
    } catch {
        await confirmDialog('Not a backup file', 'This file could not be read as an AMS TechLingo backup.', { okLabel: 'OK', kind: 'import-invalid' });
        return;
    }
    if (!payload || payload.app !== 'AMS TechLingo' || !Array.isArray(payload.entries)) {
        await confirmDialog('Not a TechLingo backup', 'The file exists but is not an AMS TechLingo backup file.', { okLabel: 'OK', kind: 'import-invalid' });
        return;
    }
    const n = payload.entries.length;
    /* Backups from 1.6 and before carry one `photo`; from 1.7 a `photos` list. Both import. */
    const photoList = (e) => (Array.isArray(e.photos) ? e.photos : (e.photo ? [e.photo] : []));
    const withPhotos = payload.entries.filter((e) => photoList(e).length).length;
    const photoCount = payload.entries.reduce((s, e) => s + photoList(e).length, 0);
    const current = state.entries.filter(alive).length;
    const choice = await confirmDialog('Restore this backup?',
        'The backup contains ' + n + ' words (' + photoCount + ' photos on ' + withPhotos + ' of them), exported on ' +
        fmtDate(payload.exportedAt) + '.\n\nAdd missing keeps the ' + current +
        ' words on this device and adds the ones that are not here. Replace throws the ' + current + ' away for the backup.',
        { danger: true, okLabel: 'Replace', altLabel: 'Add missing', kind: 'import-preview' });
    if (!choice) return;
    const entries = payload.entries.map((e) => {
        const out = { ...e, photos: photoList(e).map(dataURLToBlob) };
        delete out.photo;
        return out;
    });
    try {
        if (choice === 'alt') {
            // Only what is missing — and where a word is on both, whichever was changed last.
            const here = new Map(state.entries.map((e) => [e.id, e]));
            const add = entries.filter((e) => {
                const mine = here.get(e.id);
                if (!mine) return true;
                if (mine.deletedAt) return false;                     // the bin stays the bin
                return (e.updatedAt || '') > (mine.updatedAt || '');
            });
            await TL_DB.putEntries(add);
            state.entries = await TL_DB.getAllEntries();
            toast('Added ' + add.length + (add.length === 1 ? ' word' : ' words'));
            switchTab('words');
            return;
        }
        await TL_DB.replaceEntries(entries);      // one step: all of it, or none of it
        await TL_DB.setMeta('seeded', true);
    } catch (err) {
        await confirmDialog('The backup could not be restored',
            'Nothing was changed — your words are still exactly as they were.', { okLabel: 'OK', kind: 'import-failed' });
        return;
    }
    state.entries = await TL_DB.getAllEntries();
    toast('Imported ' + n + ' words');
    switchTab('words');
}

/* ---------- settings & guide ---------- */

function renderSettings() {
    const live = state.entries.filter(alive);
    const total = live.length;
    const own = live.filter((e) => e.source === 'own').length;
    const favs = live.filter((e) => e.favorite).length;
    const photos = live.reduce((s, e) => s + e.photos.length, 0);
    const bin = state.entries.filter((e) => e.deletedAt)
        .sort((a, b) => b.deletedAt.localeCompare(a.deletedAt));
    const binList = $('#bin-list');
    binList.innerHTML = '';
    bin.forEach((e) => {
        const row = document.createElement('div');
        row.className = 'bin-row';
        row.dataset.testid = 'bin-row';
        row.dataset.id = e.id;
        row.innerHTML = '<div class="grow">' + esc(e.term) +
            '<div class="bin-when">deleted ' + daysAgo(e.deletedAt) + '</div></div>' +
            '<button type="button" class="btn secondary small" data-testid="bin-restore">Put back</button>';
        row.querySelector('button').onclick = () => restoreDeleted(e.id);
        binList.appendChild(row);
    });
    $('#bin-card').classList.toggle('hidden', bin.length === 0);
    $('#wotd-toggle').checked = wotdWanted();
    renderBackupWhen();
    const catList = $('#cat-list');
    catList.innerHTML = '';
    categoryNames().forEach((c) => {
        const n = live.filter((e) => e.category === c).length;
        const row = document.createElement('div');
        row.className = 'cat-row';
        row.dataset.testid = 'cat-row';
        row.dataset.cat = c;
        row.dataset.count = String(n);
        row.innerHTML = '<div class="grow">' + esc(c) + '<div class="cat-count">' + n + (n === 1 ? ' word' : ' words') + '</div></div>' +
            '<button type="button" class="btn secondary small" data-testid="cat-rename">Rename</button>';
        row.querySelector('button').onclick = () => renameCategory(c);
        catList.appendChild(row);
    });
    $('#stats-line').textContent =
        total + ' words · ' + own + ' of your own · ' + favs + ' favorites · ' + photos + ' photos';
    $('#version-label').textContent = APP_VERSION;
}

function renderGuide() {
    const howTo = `
        <div class="guide-section">
            <h2>What this app is</h2>
            <p>Your personal tech dictionary. It starts with a library of ~200 common tech terms and grows with every word you add or adjust yourself. Everything lives on this device and works fully offline.</p>
        </div>
        <div class="guide-section">
            <h2>Languages</h2>
            <p>Every word can have a definition in <strong>English, Deutsch and Svenska</strong>. The EN / DE / SV switch at the top chooses which language the list shows; if a word has no definition in that language, the list falls back to English. On a word’s page the chosen language comes first and large, the other two sit smaller under it, and the same switch is right there on the page.</p>
        </div>
        <div class="guide-section">
            <h2>Text size</h2>
            <p>The app follows the iPhone’s own text-size setting: Settings › Display &amp; Brightness › Text Size. Make the text larger there and every word, definition and button here grows with it.</p>
        </div>
        <div class="guide-section">
            <h2>Finding words</h2>
            <ul>
                <li><strong>Search</strong> sits in the bar at the bottom of the page, under your thumb, with the + button beside it; it looks through terms, all three definitions, notes and categories. A word whose <strong>name</strong> matches comes first, then words whose definition uses what you typed, then the rest. Accents do not matter (“lagg” finds “Lägg till”), and when nothing is found the page offers the closest-spelled words.</li>
                <li><strong>Category chips</strong> narrow the list to one area; tap again to clear. Categories can be renamed in Settings; renaming one onto an existing name merges them.</li>
                <li><strong>My words</strong> shows only entries you created; <strong>With photo</strong> only entries that have a picture.</li>
                <li><strong>Sort</strong>: A–Z, newest first, or last updated.</li>
                <li><strong>Recent</strong>: the last eight words you opened, newest first, one tap from opening again; “clear” empties the row.</li>
            </ul>
        </div>
        <div class="guide-section">
            <h2>Adding & editing</h2>
            <p>The orange <strong>+</strong> button, beside the search at the bottom, adds a word. Cancel and Save sit at the top of the form (and at the bottom), and the top bar stays put while you scroll, so Save is always within reach. If a word with the name you type is already in the dictionary, the form says so and offers to open it. When a search finds nothing, the page offers to add that word with the name already filled in. <strong>Paste</strong> next to the word field puts in whatever you last copied — a word from Mail or Safari; the search box has the same button. Cancel asks first if you have typed something. Tapping any word opens it; <strong>Edit</strong> lets you change everything — including the words from the starter library. <strong>Delete</strong> does not ask: the word goes to Recently deleted (in Settings) and an Undo shows for a few seconds; after 30 days it is gone for good. Every entry shows when it was <strong>added</strong> and, if changed later, when it was last <strong>updated</strong>. Starring a favorite does not count as a change.</p>
        </div>
        <div class="guide-section">
            <h2>Photos</h2>
            <p>Each word can carry <strong>any number of photos or screenshots</strong> — added from the camera or photo library in the edit screen, several at once if you like. Each one shows there as a small thumbnail with a red × to take it away again. Photos are shrunk automatically so the app stays small. On the word’s page they sit in a strip you swipe sideways, one at a time, with dots under it showing where you are — and the definition right under that. Tapping a photo shows it full-screen, where you can swipe through all of the word’s photos, see “2 of 3” at the top, and close with the ✕. Press and hold a full-screen photo to select and copy the text in it.</p>
        </div>
        <div class="guide-section">
            <h2>Word of the day</h2>
            <p>At the top of the Words page a small card shows one of your own words each day with the first line of its definition; tap it to open the word. It changes once a day. Settings has a switch to hide the card.</p>
        </div>
        <div class="guide-section">
            <h2>See also</h2>
            <p>Under a word’s definition, <strong>See also</strong> lists related words: the ones this definition mentions by name, and the ones whose definitions mention this word. It comes from the text itself — nothing to set up.</p>
        </div>
        <div class="guide-section">
            <h2>Listening, copying, looking up</h2>
            <p>Under a definition, <strong>Copy</strong> puts the word and its definition on the clipboard, and <strong>Look up</strong> opens a web search for the word in Safari. Tap <strong>Listen</strong> and the iPhone reads the word and its definition aloud, in the language the switch is on (or the one the word has). Tap again to stop. The voices are the phone’s own; nicer Swedish or German voices can be downloaded under Settings › Accessibility › Spoken Content › Voices.</p>
        </div>
        <div class="guide-section">
            <h2>Sharing a word</h2>
            <p>Open a word and tap <strong>Share</strong>. The iPhone share sheet opens with a short greeting (“Hello, this is Martin who wants to share Tech Lingo with you.”), the word, its definition in the language the switch is on, your notes and the photos — choose Messages to send it as a text, or Mail, WhatsApp, AirDrop… A word you have just added opens by itself after saving, so it can be shared straight away. On a Mac without a share sheet, Share copies the text instead, ready to paste.</p>
        </div>
        <div class="guide-section">
            <h2>Favorites</h2>
            <p>Tap the star on any word. The Favorites tab collects them all.</p>
        </div>
        <div class="guide-section">
            <h2>Backup</h2>
            <p>Settings → <strong>Export backup file</strong> writes one file containing every word, photo, favorite and date. Keep it in iCloud Drive. Settings shows when the last backup was made, and the Words page asks quietly for one after a month. <strong>Import</strong> reads such a file back — it first shows what is inside, then <strong>Add missing</strong> adds only the words that are not on this device (a word on both keeps whichever was changed last), or <strong>Replace</strong> swaps everything for the backup. The app never overwrites your data on its own.</p>
        </div>`;

    const history = VERSION_LOG.map((rel) =>
        `<div class="guide-section">
            <h2>Version ${esc(rel.v)} · ${esc(rel.date)}</h2>
            <ul>${rel.items.map((i) => '<li>' + i + '</li>').join('')}</ul>
        </div>`).join('');

    $('#guide-body').innerHTML = `
        <details class="card fold">
            <summary><span class="fold-arrow"></span>How to use this app</summary>
            <div class="fold-body">${howTo}</div>
        </details>
        <details class="card fold">
            <summary><span class="fold-arrow"></span>Version history</summary>
            <div class="fold-body">${history}</div>
        </details>`;
}

/* ---------- wiring ---------- */

function wire() {
    document.querySelectorAll('#tab-bar button').forEach((b) =>
        b.onclick = () => switchTab(b.dataset.tab));

    document.querySelectorAll('#lang-switch button').forEach((b) =>
        b.onclick = () => {
            state.lang = b.dataset.lang;
            localStorage.setItem('tl-lang', state.lang);
            renderList();
        });

    $('#search-input').oninput = (e) => {
        state.search = e.target.value.trim();
        $('#search-clear').classList.toggle('hidden', !state.search);
        $('#search-paste').classList.toggle('hidden', !!state.search);
        renderList();
    };
    $('#search-clear').onclick = () => {
        $('#search-input').value = '';
        state.search = '';
        $('#search-clear').classList.add('hidden');
        $('#search-paste').classList.remove('hidden');
        renderList();
    };
    $('#search-paste').onclick = () => pasteInto('search');
    $('#recent-clear').onclick = () => { localStorage.removeItem('tl-recent'); renderRecent(); };
    $('#wotd-toggle').onchange = (ev) => { localStorage.setItem('tl-wotd', ev.target.checked ? 'on' : 'off'); };
    $('#backup-nudge-go').onclick = exportBackup;

    // The search bar rises with the keyboard (the visible part of the screen shrinks; the bar follows its bottom edge).
    const vv = window.visualViewport;
    if (vv) {
        const placeDock = () => {
            const lift = Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop));
            const dock = $('#search-dock');
            dock.style.bottom = lift > 80 ? lift + 'px' : '';
            dock.dataset.lifted = lift > 80 ? '1' : '0';
        };
        vv.addEventListener('resize', placeDock);
        vv.addEventListener('scroll', placeDock);
    }
    $('#backup-nudge-later').onclick = () => {
        localStorage.setItem('tl-backup-later', String(Date.now() + 7 * 86400000));
        renderNudge();
    };
    $('#f-term-paste').onclick = () => pasteInto('term');
    $('#f-term').oninput = updateDupHint;
    $('#dup-open').onclick = async () => {
        const id = $('#dup-hint').dataset.id;
        if (!id) return;
        // Only the name has been typed so far? Then just go. Otherwise ask, as Cancel would.
        const onlyName = formSnapshot(false) === state.editSnapshotRest && !state.photosTouched;
        if (!onlyName) {
            const ok = await confirmDialog('Throw away what you typed?', 'The changes to this word will be lost.', { danger: true, okLabel: 'Throw away' });
            if (!ok) return;
        }
        openDetail(id);
    };
    $('#sort-select').onchange = (e) => {
        state.sort = e.target.value;
        localStorage.setItem('tl-sort', state.sort);
        renderList();
    };
    $('#chip-mine').onclick = () => { state.onlyMine = !state.onlyMine; renderList(); };
    $('#chip-photos').onclick = () => { state.onlyPhotos = !state.onlyPhotos; renderList(); };

    $('#fab-add').onclick = () => openEdit(null);
    $('#detail-back').onclick = () => switchTab(state.tab);
    $('#detail-star').onclick = () => toggleFavorite(state.detailId);
    $('#detail-edit').onclick = () => openEdit(state.detailId);
    $('#detail-delete').onclick = deleteCurrent;
    $('#detail-share').onclick = shareCurrent;

    $('#edit-form').onsubmit = saveEdit;
    const cancelEdit = async () => {
        if (formSnapshot() !== state.editSnapshot || state.photosTouched) {
            const ok = await confirmDialog('Throw away what you typed?',
                'The changes to this word will be lost.', { danger: true, okLabel: 'Throw away' });
            if (!ok) return;
        }
        if (state.editId) openDetail(state.editId);
        else switchTab(state.tab);
    };
    $('#edit-cancel').onclick = cancelEdit;
    $('#edit-cancel2').onclick = cancelEdit;
    // Return in the one-line fields moves on to the definition; it must not save a half-written word.
    const moveOn = (ev) => { if (ev.key === 'Enter') { ev.preventDefault(); $('#f-en').focus(); } };
    $('#f-term').onkeydown = moveOn;
    $('#f-newcat').onkeydown = moveOn;

    $('#f-category').onchange = (e) => {
        $('#f-newcat-wrap').classList.toggle('hidden', e.target.value !== '__new__');
        if (e.target.value === '__new__') $('#f-newcat').focus();
    };

    $('#f-photo').onchange = async (e) => {
        const files = Array.from(e.target.files || []);   // copy first — the reset below empties the list
        e.target.value = '';
        if (!files.length) return;
        let failed = 0;
        for (const file of files) {
            try {
                state.editPhotos.push(await processPhoto(file));
                state.photosTouched = true;
            } catch {
                failed++;
            }
        }
        renderPhotoThumbs();
        if (failed) toast(failed === files.length ? 'Could not read that image' : 'Could not read ' + failed + ' of the images');
    };

    $('#lightbox-close').onclick = closeLightbox;

    $('#btn-export').onclick = exportBackup;
    $('#btn-import').onchange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) importBackup(file);
        e.target.value = '';
    };
}

/* ---------- service worker ---------- */

function registerSW() {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('sw.js').then(() => {
        $('#sw-status').textContent = 'Offline mode ready.';
    }).catch(() => {
        $('#sw-status').textContent = 'Offline mode unavailable in this browser.';
    });
    let reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (reloaded) return;
        if (document.body.dataset.screen === 'edit') {
            // Never under his fingers: the new version waits until the form is closed.
            state.updateWaiting = true;
            document.body.dataset.updateWaiting = '1';
            return;
        }
        reloaded = true;
        window.location.reload();
    });
}

/* ---------- boot ---------- */

(async function boot() {
    wire();
    renderGuide();
    try {
        state.entries = await seedIfNeeded();
        await migratePhotos(state.entries);
        await purgeOldDeleted();
        state.lastBackupAt = (await TL_DB.getMeta('lastBackupAt')) || null;
    } catch (err) {
        console.error('DB error', err);
        $('#empty-state').classList.remove('hidden');
        $('#empty-state').textContent = 'Storage could not be opened. Please close and reopen the app.';
        return;
    }
    switchTab('words');          // the same path as a tap: draws the list and records the screen
    renderSettings();
    document.documentElement.dataset.ready = '1';   // booted: data read, list drawn
    registerSW();
})();
