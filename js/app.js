/* AMS TechLingo — main app logic. */

const APP_VERSION = '1.8';

/* Thorough per-version history, newest first — shown collapsed in the Guide. */
const VERSION_LOG = [
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

function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.remove('hidden');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.add('hidden'), 2600);
}

function confirmDialog(title, text, { danger = false, okLabel = 'OK' } = {}) {
    return new Promise((resolve) => {
        $('#confirm-title').textContent = title;
        $('#confirm-text').textContent = text;
        $('#confirm-yes').textContent = okLabel;
        const box = document.querySelector('.confirm-box');
        box.classList.toggle('danger', danger);
        $('#confirm-overlay').classList.remove('hidden');
        const done = (val) => {
            $('#confirm-overlay').classList.add('hidden');
            $('#confirm-yes').onclick = null;
            $('#confirm-no').onclick = null;
            resolve(val);
        };
        $('#confirm-yes').onclick = () => done(true);
        $('#confirm-no').onclick = () => done(false);
    });
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
    let list = state.entries;
    if (state.tab === 'favorites') list = list.filter((e) => e.favorite);
    if (state.category) list = list.filter((e) => e.category === state.category);
    if (state.onlyMine) list = list.filter((e) => e.source === 'own');
    if (state.onlyPhotos) list = list.filter((e) => e.photos.length > 0);
    if (state.search) {
        const q = state.search.toLowerCase();
        list = list.filter((e) =>
            (e.term || '').toLowerCase().includes(q) ||
            (e.en || '').toLowerCase().includes(q) ||
            (e.de || '').toLowerCase().includes(q) ||
            (e.sv || '').toLowerCase().includes(q) ||
            (e.notes || '').toLowerCase().includes(q) ||
            (e.category || '').toLowerCase().includes(q));
    }
    list = [...list];
    if (state.sort === 'az') {
        list.sort((a, b) => a.term.localeCompare(b.term, undefined, { sensitivity: 'base' }));
    } else if (state.sort === 'added') {
        list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    } else {
        list.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
    }
    return list;
}

function renderCategoryChips() {
    const cats = [...new Set(state.entries.map((e) => e.category).filter(Boolean))].sort();
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

function renderList() {
    renderCategoryChips();
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
        empty.textContent = state.tab === 'favorites' && !state.search
            ? 'No favorites yet. Tap the star on any word to collect it here.'
            : 'Nothing found. Try a different search or filter — or add the word yourself with the + button.';
    } else {
        empty.classList.add('hidden');
    }

    const frag = document.createDocumentFragment();
    const counter = document.createElement('div');
    counter.className = 'count-line';
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

function showView(name) {
    ['list', 'detail', 'edit', 'guide', 'settings'].forEach((v) =>
        $('#view-' + v).classList.toggle('hidden', v !== name));
    $('#tab-bar').classList.toggle('hidden', name === 'edit');
    $('#fab-add').classList.toggle('hidden', name !== 'list');
    document.body.dataset.screen = name;   // the tests read this, after the swap
    window.scrollTo(0, 0);
}

function switchTab(tab) {
    state.tab = tab;
    document.querySelectorAll('#tab-bar button').forEach((b) =>
        b.classList.toggle('active', b.dataset.tab === tab));
    if (tab === 'words' || tab === 'favorites') {
        showView('list');
        renderList();
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
            img.src = URL.createObjectURL(blob);
            img.onclick = () => {
                $('#lightbox-img').src = img.src;
                $('#lightbox').classList.remove('hidden');
            };
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

    const defs = document.createElement('div');
    defs.className = 'card';
    defs.dataset.testid = 'detail-definition';
    let defsHtml = '<h2>Definition</h2>';
    const langs = [['en', 'English'], ['de', 'Deutsch'], ['sv', 'Svenska']];
    let any = false;
    langs.forEach(([code, label]) => {
        if (e[code]) {
            any = true;
            defsHtml += '<div class="def-block"><div class="def-lang">' + label + '</div><p>' + esc(e[code]) + '</p></div>';
        }
    });
    if (!any) defsHtml += '<p class="muted">No definition yet — tap Edit to write one.</p>';
    defs.innerHTML = defsHtml;
    body.appendChild(defs);

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

/* ---------- add / edit ---------- */

function categoryOptions(selected) {
    const cats = [...new Set([
        ...state.entries.map((e) => e.category).filter(Boolean)
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

function openEdit(id) {
    state.editId = id;
    const e = id ? state.entries.find((x) => x.id === id) : null;
    $('#edit-title').textContent = e ? 'Edit word' : 'Add word';
    $('#f-term').value = e ? e.term : '';
    categoryOptions(e ? e.category : 'Software & Apps');
    $('#f-en').value = e ? (e.en || '') : '';
    $('#f-de').value = e ? (e.de || '') : '';
    $('#f-sv').value = e ? (e.sv || '') : '';
    $('#f-notes').value = e ? (e.notes || '') : '';
    state.editPhotos = e ? [...e.photos] : [];
    state.photosTouched = false;
    renderPhotoThumbs();
    $('#f-photo').value = '';
    showView('edit');
}

/* The thumbnails in the edit form: one per photo, each with its own ×. */
function renderPhotoThumbs() {
    const wrap = $('#f-photo-list');
    wrap.innerHTML = '';
    state.editPhotos.forEach((blob, i) => {
        const t = document.createElement('div');
        t.className = 'photo-thumb';
        t.dataset.testid = 'f-photo-thumb';
        const img = document.createElement('img');
        img.alt = 'Photo ' + (i + 1);
        img.src = URL.createObjectURL(blob);
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
    const ok = await confirmDialog('Delete "' + e.term + '"?',
        'This removes the word and its photos from this device. There is no undo (except restoring a backup).',
        { danger: true, okLabel: 'Delete' });
    if (!ok) return;
    await TL_DB.deleteEntry(e.id);
    state.entries = state.entries.filter((x) => x.id !== e.id);
    toast('Deleted "' + e.term + '"');
    switchTab(state.tab === 'favorites' ? 'favorites' : 'words');
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
        await confirmDialog('Not a backup file', 'This file could not be read as an AMS TechLingo backup.', { okLabel: 'OK' });
        return;
    }
    if (!payload || payload.app !== 'AMS TechLingo' || !Array.isArray(payload.entries)) {
        await confirmDialog('Not a TechLingo backup', 'The file exists but is not an AMS TechLingo backup file.', { okLabel: 'OK' });
        return;
    }
    const n = payload.entries.length;
    /* Backups from 1.6 and before carry one `photo`; from 1.7 a `photos` list. Both import. */
    const photoList = (e) => (Array.isArray(e.photos) ? e.photos : (e.photo ? [e.photo] : []));
    const withPhotos = payload.entries.filter((e) => photoList(e).length).length;
    const photoCount = payload.entries.reduce((s, e) => s + photoList(e).length, 0);
    const current = state.entries.length;
    const ok = await confirmDialog('Replace everything?',
        'The backup contains ' + n + ' words (' + photoCount + ' photos on ' + withPhotos + ' of them), exported on ' +
        fmtDate(payload.exportedAt) + '.\n\nImporting REPLACES the ' + current +
        ' words currently on this device.',
        { danger: true, okLabel: 'Replace' });
    if (!ok) return;
    const entries = payload.entries.map((e) => {
        const out = { ...e, photos: photoList(e).map(dataURLToBlob) };
        delete out.photo;
        return out;
    });
    await TL_DB.clearEntries();
    await TL_DB.putEntries(entries);
    await TL_DB.setMeta('seeded', true);
    state.entries = await TL_DB.getAllEntries();
    toast('Imported ' + n + ' words');
    switchTab('words');
}

/* ---------- settings & guide ---------- */

function renderSettings() {
    const total = state.entries.length;
    const own = state.entries.filter((e) => e.source === 'own').length;
    const favs = state.entries.filter((e) => e.favorite).length;
    const photos = state.entries.reduce((s, e) => s + e.photos.length, 0);
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
            <p>Every word can have a definition in <strong>English, Deutsch and Svenska</strong>. The EN / DE / SV switch at the top chooses which language the list shows. If a word has no definition in that language, the list falls back to English.</p>
        </div>
        <div class="guide-section">
            <h2>Finding words</h2>
            <ul>
                <li><strong>Search</strong> looks through terms, all three definitions, notes and categories.</li>
                <li><strong>Category chips</strong> narrow the list to one area; tap again to clear.</li>
                <li><strong>My words</strong> shows only entries you created; <strong>With photo</strong> only entries that have a picture.</li>
                <li><strong>Sort</strong>: A–Z, newest first, or last updated.</li>
            </ul>
        </div>
        <div class="guide-section">
            <h2>Adding & editing</h2>
            <p>The orange <strong>+</strong> button adds a word. Tapping any word opens it; <strong>Edit</strong> lets you change everything — including the words from the starter library. Every entry shows when it was <strong>added</strong> and, if changed later, when it was last <strong>updated</strong>. Starring a favorite does not count as a change.</p>
        </div>
        <div class="guide-section">
            <h2>Photos</h2>
            <p>Each word can carry <strong>any number of photos or screenshots</strong> — added from the camera or photo library in the edit screen, several at once if you like. Each one shows there as a small thumbnail with a red × to take it away again. Photos are shrunk automatically so the app stays small. On the word’s page they sit in a strip you swipe sideways, one at a time, with dots under it showing where you are — and the definition right under that. Tapping a photo shows it full-screen.</p>
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
            <p>Settings → <strong>Export backup file</strong> writes one file containing every word, photo, favorite and date. Keep it in iCloud Drive. <strong>Import</strong> reads such a file back — it first shows what is inside and asks before replacing anything. The app never overwrites your data on its own.</p>
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
        renderList();
    };
    $('#search-clear').onclick = () => {
        $('#search-input').value = '';
        state.search = '';
        $('#search-clear').classList.add('hidden');
        renderList();
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
    const cancelEdit = () => {
        if (state.editId) openDetail(state.editId);
        else switchTab(state.tab);
    };
    $('#edit-cancel').onclick = cancelEdit;
    $('#edit-cancel2').onclick = cancelEdit;

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

    $('#lightbox').onclick = () => $('#lightbox').classList.add('hidden');

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
