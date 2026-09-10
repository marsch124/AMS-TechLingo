/* AMS TechLingo — main app logic. */

const APP_VERSION = '1.4';

/* Thorough per-version history, newest first — shown collapsed in the Guide. */
const VERSION_LOG = [
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
    editPhoto: undefined     // undefined = untouched, null = removed, Blob = new photo
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
        createdAt: now, updatedAt: now, photo: null
    }));
    // Martin's own first word.
    lib.push({
        id: uid(), term: 'Panel', category: 'Software & Apps',
        en: 'A distinct section of an app’s window or screen that groups related controls or information — for example a side panel, a settings panel, or a preview panel.',
        de: 'Ein abgegrenzter Bereich eines App-Fensters oder Bildschirms, der zusammengehörige Bedienelemente oder Informationen bündelt — z. B. ein Seitenpanel oder ein Einstellungs-Panel.',
        sv: 'En avgränsad del av ett appfönster eller en skärm som samlar tillhörande kontroller eller information — t.ex. en sidopanel eller en inställningspanel.',
        notes: '', favorite: true, source: 'own',
        createdAt: now, updatedAt: now, photo: null
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
    if (state.onlyPhotos) list = list.filter((e) => !!e.photo);
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
        card.innerHTML =
            '<div class="entry-main">' +
                '<div class="entry-term">' + esc(e.term) +
                    (e.source === 'own' ? '<span class="badge">mine</span>' : '') +
                    (e.photo ? '<span class="badge photo">photo</span>' : '') +
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
    $('#detail-term').textContent = e.term;
    const star = $('#detail-star');
    star.classList.toggle('faved', e.favorite);
    star.querySelector('svg').style.fill = e.favorite ? 'currentColor' : 'none';

    const body = $('#detail-body');
    body.innerHTML = '';

    if (e.photo) {
        const img = document.createElement('img');
        img.className = 'detail-photo';
        img.alt = 'Photo for ' + e.term;
        img.src = URL.createObjectURL(e.photo);
        img.onclick = () => {
            $('#lightbox-img').src = img.src;
            $('#lightbox').classList.remove('hidden');
        };
        body.appendChild(img);
    }

    const defs = document.createElement('div');
    defs.className = 'card';
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
    state.editPhoto = undefined;
    const e = id ? state.entries.find((x) => x.id === id) : null;
    $('#edit-title').textContent = e ? 'Edit word' : 'Add word';
    $('#f-term').value = e ? e.term : '';
    categoryOptions(e ? e.category : 'Software & Apps');
    $('#f-en').value = e ? (e.en || '') : '';
    $('#f-de').value = e ? (e.de || '') : '';
    $('#f-sv').value = e ? (e.sv || '') : '';
    $('#f-notes').value = e ? (e.notes || '') : '';
    const preview = $('#f-photo-preview');
    if (e && e.photo) {
        preview.src = URL.createObjectURL(e.photo);
        preview.classList.remove('hidden');
        $('#f-photo-remove').classList.remove('hidden');
        $('#f-photo-label').textContent = 'Replace photo';
    } else {
        preview.classList.add('hidden');
        $('#f-photo-remove').classList.add('hidden');
        $('#f-photo-label').textContent = 'Add photo';
    }
    $('#f-photo').value = '';
    showView('edit');
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
        id: uid(), favorite: false, source: 'own', createdAt: now, photo: null
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
    if (state.editPhoto !== undefined) entry.photo = state.editPhoto;
    const after = JSON.stringify([entry.term, entry.category, entry.en, entry.de, entry.sv, entry.notes]);
    if (!existing || before !== after || state.editPhoto !== undefined) {
        entry.updatedAt = now;
    }
    await TL_DB.putEntry(entry);
    const idx = state.entries.findIndex((x) => x.id === entry.id);
    if (idx >= 0) state.entries[idx] = entry; else state.entries.push(entry);
    toast(existing ? 'Saved' : 'Added "' + term + '"');
    if (existing && state.detailId === entry.id) {
        openDetail(entry.id);
    } else {
        switchTab(state.tab === 'favorites' ? 'favorites' : 'words');
    }
}

async function deleteCurrent() {
    const e = state.entries.find((x) => x.id === state.detailId);
    if (!e) return;
    const ok = await confirmDialog('Delete "' + e.term + '"?',
        'This removes the word and its photo from this device. There is no undo (except restoring a backup).',
        { danger: true, okLabel: 'Delete' });
    if (!ok) return;
    await TL_DB.deleteEntry(e.id);
    state.entries = state.entries.filter((x) => x.id !== e.id);
    toast('Deleted "' + e.term + '"');
    switchTab(state.tab === 'favorites' ? 'favorites' : 'words');
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
        copy.photo = e.photo ? await blobToDataURL(e.photo) : null;
        out.push(copy);
    }
    const payload = {
        app: 'AMS TechLingo',
        formatVersion: 1,
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
    const photos = payload.entries.filter((e) => e.photo).length;
    const current = state.entries.length;
    const ok = await confirmDialog('Replace everything?',
        'The backup contains ' + n + ' words (' + photos + ' with photos), exported on ' +
        fmtDate(payload.exportedAt) + '.\n\nImporting REPLACES the ' + current +
        ' words currently on this device.',
        { danger: true, okLabel: 'Replace' });
    if (!ok) return;
    const entries = payload.entries.map((e) => ({
        ...e,
        photo: e.photo ? dataURLToBlob(e.photo) : null
    }));
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
    const photos = state.entries.filter((e) => e.photo).length;
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
            <p>Each word can carry one photo or screenshot — added from the camera or photo library in the edit screen. Photos are shrunk automatically so the app stays small, and tapping a photo shows it full-screen.</p>
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
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        try {
            const blob = await processPhoto(file);
            state.editPhoto = blob;
            const preview = $('#f-photo-preview');
            preview.src = URL.createObjectURL(blob);
            preview.classList.remove('hidden');
            $('#f-photo-remove').classList.remove('hidden');
            $('#f-photo-label').textContent = 'Replace photo';
        } catch {
            toast('Could not read that image');
        }
    };
    $('#f-photo-remove').onclick = () => {
        state.editPhoto = null;
        $('#f-photo-preview').classList.add('hidden');
        $('#f-photo-remove').classList.add('hidden');
        $('#f-photo-label').textContent = 'Add photo';
        $('#f-photo').value = '';
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
    } catch (err) {
        console.error('DB error', err);
        $('#empty-state').classList.remove('hidden');
        $('#empty-state').textContent = 'Storage could not be opened. Please close and reopen the app.';
        return;
    }
    renderList();
    renderSettings();
    registerSW();
})();
