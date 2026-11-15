/*!
 * t2-ui.js v1.0.0 - Template 2 runtime (vanilla JS, ES2018, no dependencies). Pair with assets/t2-ui.css.
 * Owns the icon sprite and every interactive behaviour of the kit. Public API: window.T2 only.
 *
 * ---------------------------------------------------------------------------------------------------------
 * INCLUDE - in <head>, NOT defer/async (the saved theme is applied before first paint):
 *   <link rel="stylesheet" href="/template/template2/assets/t2-ui.css?v=1.0.0">
 *   <script src="/template/template2/assets/t2-ui.js?v=1.0.0"></script>
 * Included twice? The second copy is ignored. A data-theme written by the server on <html> wins over the
 * saved choice (localStorage "t2-theme").
 *
 * HOW IT WIRES - delegated listeners on `document` that react only to data-t2-* hooks and t2- component
 * markup, so content injected later (AJAX, Livewire, Alpine) works without re-init. After injecting charts
 * or screenshot frames, call T2.refresh().
 *
 * ---------------------------------------------------------------------------------------------------------
 * DATA ATTRIBUTES
 *   data-t2-theme-toggle        Toggle light/dark; aria-pressed="true" while dark. Icons: put both
 *                               <use href="#t2-i-sun"> (class t2-ic--sun) and #t2-i-moon (t2-ic--moon) inside.
 *   data-t2-accordion           Accordion root. Triggers: button.t2-acc__trigger[aria-controls=<panel id>]
 *                               inside li.t2-acc__item; the panel carries [hidden] while closed.
 *     data-t2-accordion-search  <input> in the root: hides items whose title and sub-items do not match;
 *                               items that match only by sub-item open and show just those sub-items.
 *     data-t2-accordion-all     Button: open all / close all. Labels: data-label-open, data-label-close.
 *     data-t2-accordion-count   Element whose text becomes "พบ N หัวข้อ" while searching.
 *     data-t2-accordion-empty   Element shown when nothing matches.
 *   data-t2-password-toggle     Button in .t2-input-group: shows/hides the password (aria-pressed).
 *   data-t2-shot                .t2-shot__viewport with an <iframe> of a 1280x896 page: scaled to fit.
 *   data-t2-donut               figure.t2-donut: draws the ring from its .t2-legend items:
 *                                 <li data-value="944" style="--c:var(--t2-chart-1)">เชื่อมโยงแล้ว (944)</li>
 *                               Optional: data-t2-total="4,169" (centre number), data-t2-caption="ผลรวม".
 *   data-t2-pressed-group       Container: clicking one [aria-pressed] button presses it and releases the
 *                               others (KPI filters, segment tabs). Fires "t2:change" on the container.
 *   data-t2-toggle              Single on/off button: flips its aria-pressed and fires "t2:change"
 *                               (detail.pressed). E.g. the "ข้อมูลยังไม่ครบ" filter on list.html.
 *   data-t2-dialog-open="id"    Opens <dialog id="id" class="t2-dialog">. data-t2-dialog-close closes the
 *                               nearest dialog; a click on the backdrop closes it too.
 *   data-t2-dropzone            .t2-dropzone with input[type=file]: lists chosen files in
 *                               [data-t2-file-list] (inside the same .t2-field) and highlights on drag.
 *   data-t2-validate            <form novalidate>: on submit, every [required] control that is empty and
 *                               every filled control whose value is invalid (type=email/url, pattern, min/max)
 *                               gets aria-invalid="true" and its field's .t2-error is shown; the first one is
 *                               focused and the submit is cancelled. Fixing a control clears its error.
 *                               Required checkboxes are not covered. DEMO ONLY (remove in a real system):
 *                                 data-t2-demo-redirect="dashboard.html"  valid -> busy button, then go there
 *                                 data-t2-demo-success="alert-id"         valid -> show that element
 *                               Never put credentials in the redirect URL; the demo never reads values.
 *
 * FUNCTIONS
 *   T2.setTheme('light'|'dark')   T2.theme()   T2.refresh(root?)   T2.renderDonut(figure)
 *   T2.openDialog(id)             T2.icons (name -> SVG inner markup, extend before DOMContentLoaded)
 */
(function () {
  'use strict';
  if (window.T2 && window.T2.version) return;

  var doc = document;
  var root = doc.documentElement;
  var THEME_KEY = 't2-theme';

  /* ---- 1. Theme (runs immediately, before first paint) ---- */
  try {
    var saved = localStorage.getItem(THEME_KEY);
    if ((saved === 'light' || saved === 'dark') && !root.hasAttribute('data-theme')) root.setAttribute('data-theme', saved);
  } catch (e) { /* storage blocked: follow the OS */ }

  function theme() {
    var t = root.getAttribute('data-theme');
    if (t === 'light' || t === 'dark') return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function setTheme(t) {
    root.setAttribute('data-theme', t === 'dark' ? 'dark' : 'light');
    try { localStorage.setItem(THEME_KEY, t); } catch (e) { /* not saved */ }
    syncThemeButtons();
  }
  function syncThemeButtons() {
    var dark = theme() === 'dark';
    doc.querySelectorAll('[data-t2-theme-toggle]').forEach(function (b) { b.setAttribute('aria-pressed', dark ? 'true' : 'false'); });
  }

  /* ---- 2. Icons (lucide-style 24x24 strokes; ISC licence) ---- */
  var ICONS = {
    'arrow-left': '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    'ban': '<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>',
    'bell': '<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>',
    'book-open': '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    'building': '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
    'calendar': '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
    'chart-column': '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
    'chart-pie': '<path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z"/><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>',
    'check': '<path d="M20 6 9 17l-5-5"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    'chevron-left': '<path d="m15 18-6-6 6-6"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    'circle-alert': '<circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
    'circle-check': '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    'clipboard-check': '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
    'clock': '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    'download': '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    'ellipsis': '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
    'eye': '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
    'eye-off': '<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>',
    'file-pen': '<path d="M12.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v9.5"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M13.378 15.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/>',
    'file-text': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    'filter': '<path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"/>',
    'history': '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>',
    'hourglass': '<path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/>',
    'house': '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    'info': '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    'layers': '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>',
    'layout-dashboard': '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
    'layout-grid': '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
    'link': '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    'list-tree': '<path d="M21 12h-8"/><path d="M21 6H8"/><path d="M21 18h-8"/><path d="M3 6v4c0 1.1.9 2 2 2h3"/><path d="M3 10v6c0 1.1.9 2 2 2h3"/>',
    'lock': '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    'log-in': '<path d="m10 17 5-5-5-5"/><path d="M15 12H3"/><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>',
    'log-out': '<path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>',
    'mail': '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    'moon': '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    'pencil': '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
    'phone': '<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>',
    'plus': '<path d="M5 12h14"/><path d="M12 5v14"/>',
    'rotate-ccw': '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    'save': '<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/>',
    'search': '<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>',
    'send': '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
    'shield-check': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    'sparkles': '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
    'square-check': '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 12 2 2 4-4"/>',
    'sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    'trash': '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><path d="M10 11v6"/><path d="M14 11v6"/>',
    'trending-up': '<path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>',
    'triangle-alert': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    'upload': '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',
    'user': '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    'users': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/>',
    'x': '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'
  };

  function injectSprite() {
    if (doc.getElementById('t2-sprite')) return;
    var s = '<svg xmlns="http://www.w3.org/2000/svg" id="t2-sprite" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden">';
    Object.keys(ICONS).forEach(function (k) { s += '<symbol id="t2-i-' + k + '" viewBox="0 0 24 24">' + ICONS[k] + '</symbol>'; });
    doc.body.insertAdjacentHTML('afterbegin', s + '</svg>');
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }
  function fmt(n) { return Number(n).toLocaleString('th-TH'); }
  function swapIcon(el, name) {
    var use = el && el.querySelector('use');
    if (use) use.setAttribute('href', '#t2-i-' + name);
  }

  /* ---- 3. Accordion + search ---- */
  function accSet(btn, open) {
    var panel = doc.getElementById(btn.getAttribute('aria-controls'));
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (panel) panel.hidden = !open;
  }
  function accSyncAllButton(acc) {
    var all = acc.querySelector('[data-t2-accordion-all]');
    if (!all) return;
    var shown = Array.prototype.filter.call(acc.querySelectorAll('.t2-acc__trigger'), function (b) { return !b.closest('.t2-acc__item').hidden; });
    var anyClosed = shown.some(function (b) { return b.getAttribute('aria-expanded') !== 'true'; });
    all.textContent = anyClosed ? (all.getAttribute('data-label-open') || 'เปิดทั้งหมด') : (all.getAttribute('data-label-close') || 'ปิดทั้งหมด');
  }
  function accFilter(acc, raw) {
    var q = raw.trim().toLowerCase();
    var visible = 0;
    acc.querySelectorAll('.t2-acc__item').forEach(function (item) {
      var btn = item.querySelector('.t2-acc__trigger');
      var title = (item.querySelector('.t2-acc__title') || item).textContent.toLowerCase();
      var subs = item.querySelectorAll('.t2-acc__panel > li');
      if (!q) {
        item.hidden = false;
        subs.forEach(function (li) { li.hidden = false; });
        if (item.hasAttribute('data-t2-auto')) { item.removeAttribute('data-t2-auto'); if (btn) accSet(btn, false); }
        visible++;
        return;
      }
      var titleHit = title.indexOf(q) !== -1;
      var subHits = 0;
      subs.forEach(function (li) {
        var hit = titleHit || li.textContent.toLowerCase().indexOf(q) !== -1;
        li.hidden = !hit;
        if (hit) subHits++;
      });
      item.hidden = !titleHit && !subHits;
      if (item.hidden) return;
      visible++;
      if (!titleHit && btn && btn.getAttribute('aria-expanded') !== 'true') { item.setAttribute('data-t2-auto', ''); accSet(btn, true); }
    });
    var count = acc.querySelector('[data-t2-accordion-count]');
    if (count) {
      if (!count.hasAttribute('data-t2-original')) count.setAttribute('data-t2-original', count.textContent);
      count.textContent = q ? 'พบ ' + fmt(visible) + ' หัวข้อ' : count.getAttribute('data-t2-original');
    }
    var empty = acc.querySelector('[data-t2-accordion-empty]');
    if (empty) empty.hidden = visible > 0;
    accSyncAllButton(acc);
  }

  /* ---- 4. Screenshot frames (iframe of a 1280px page scaled to fit) ---- */
  var shotObserver = null;
  function fitShot(el) {
    var w = el.clientWidth;
    if (w) el.style.setProperty('--t2-shot-scale', (w / 1280).toFixed(4));
  }
  function initShots(scope) {
    (scope || doc).querySelectorAll('[data-t2-shot]').forEach(function (el) {
      fitShot(el);
      if (shotObserver) shotObserver.observe(el);
    });
  }

  /* ---- 5. Donut charts ---- */
  function renderDonut(fig) {
    var items = fig.querySelectorAll('[data-value]');
    var data = [];
    var total = 0;
    items.forEach(function (li, i) {
      var v = parseFloat(String(li.getAttribute('data-value')).replace(/,/g, '')) || 0;
      var c = li.style.getPropertyValue('--c').trim() || 'var(--t2-chart-' + ((i % 5) + 1) + ')';
      data.push({ v: v, c: c, label: li.textContent.trim() });
      total += v;
    });
    var r = 70, w = 28, C = 2 * Math.PI * r, gap = data.filter(function (d) { return d.v > 0; }).length > 1 ? 1.5 : 0;
    var svg = '<svg viewBox="0 0 180 180" aria-hidden="true" focusable="false"><circle class="t2-donut__track" cx="90" cy="90" r="' + r + '" stroke-width="' + w + '"/>';
    var offset = 0;
    data.forEach(function (d) {
      if (!d.v || !total) return;
      var len = d.v / total * C;
      var dash = Math.max(len - gap, 0.5);
      svg += '<circle class="t2-donut__seg" cx="90" cy="90" r="' + r + '" stroke-width="' + w + '" style="stroke:' + esc(d.c) + '" stroke-dasharray="' + dash.toFixed(2) + ' ' + (C - dash).toFixed(2) + '" stroke-dashoffset="' + (-offset).toFixed(2) + '"><title>' + esc(d.label) + '</title></circle>';
      offset += len;
    });
    svg += '</svg>';
    var caption = fig.getAttribute('data-t2-caption');
    var shown = fig.getAttribute('data-t2-total') || fmt(total);
    var html = svg + '<span class="t2-donut__center">' + (caption ? '<span class="t2-donut__caption">' + esc(caption) + '</span>' : '') + '<span class="t2-donut__total">' + esc(shown) + '</span></span>';
    var chart = fig.querySelector('.t2-donut__chart');
    if (!chart) {
      chart = doc.createElement('div');
      chart.className = 't2-donut__chart';
      fig.insertBefore(chart, fig.firstChild);
    }
    chart.innerHTML = html;
  }

  /* ---- 6. Dialogs ---- */
  function openDialog(id) {
    var dlg = doc.getElementById(id);
    if (dlg && typeof dlg.showModal === 'function' && !dlg.open) dlg.showModal();
    return dlg;
  }

  /* ---- 7. Form validation (+ demo submit) ---- */
  function fieldOf(control) { return control.closest('.t2-field') || control.parentNode; }
  function isEmptyInvalid(control) { return control.willValidate && !control.checkValidity(); }
  function setInvalid(control, invalid) {
    var name = control.name && window.CSS && CSS.escape ? CSS.escape(control.name) : control.name;
    var group = control.type === 'radio' && control.form && name ? control.form.querySelectorAll('input[type="radio"][name="' + name + '"]') : [control];
    Array.prototype.forEach.call(group, function (c) { if (invalid) c.setAttribute('aria-invalid', 'true'); else c.removeAttribute('aria-invalid'); });
    var err = fieldOf(control).querySelector('.t2-error');
    if (err) err.hidden = !invalid;
  }
  function validate(form) {
    var first = null;
    var seen = {};
    form.querySelectorAll('input, select, textarea').forEach(function (c) {
      if (!c.willValidate || (!c.required && !c.value) || c.type === 'checkbox') return;
      if (c.type === 'radio') { if (seen[c.name]) return; seen[c.name] = true; }
      var bad = isEmptyInvalid(c);
      setInvalid(c, bad);
      if (bad && !first) first = c;
    });
    if (first) first.focus();
    return !first;
  }

  /* ---- 8. Delegated events ---- */
  doc.addEventListener('click', function (e) {
    var t = e.target;
    if (!(t instanceof Element)) return;

    var tt = t.closest('[data-t2-theme-toggle]');
    if (tt) { setTheme(theme() === 'dark' ? 'light' : 'dark'); return; }

    var trig = t.closest('[data-t2-accordion] .t2-acc__trigger');
    if (trig) {
      var item = trig.closest('.t2-acc__item');
      if (item) item.removeAttribute('data-t2-auto');
      accSet(trig, trig.getAttribute('aria-expanded') !== 'true');
      accSyncAllButton(trig.closest('[data-t2-accordion]'));
      return;
    }

    var all = t.closest('[data-t2-accordion-all]');
    if (all) {
      var acc = all.closest('[data-t2-accordion]');
      var btns = Array.prototype.filter.call(acc.querySelectorAll('.t2-acc__trigger'), function (b) { return !b.closest('.t2-acc__item').hidden; });
      var open = btns.some(function (b) { return b.getAttribute('aria-expanded') !== 'true'; });
      btns.forEach(function (b) { accSet(b, open); });
      accSyncAllButton(acc);
      return;
    }

    var pw = t.closest('[data-t2-password-toggle]');
    if (pw) {
      var input = pw.closest('.t2-input-group').querySelector('input');
      var show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      pw.setAttribute('aria-pressed', show ? 'true' : 'false');
      swapIcon(pw, show ? 'eye-off' : 'eye');
      return;
    }

    var toggle = t.closest('[data-t2-toggle]');
    if (toggle) {
      var on = toggle.getAttribute('aria-pressed') !== 'true';
      toggle.setAttribute('aria-pressed', on ? 'true' : 'false');
      toggle.dispatchEvent(new CustomEvent('t2:change', { bubbles: true, detail: { button: toggle, pressed: on } }));
      return;
    }

    var pressed = t.closest('[data-t2-pressed-group] [aria-pressed]');
    if (pressed) {
      var group = pressed.closest('[data-t2-pressed-group]');
      group.querySelectorAll('[aria-pressed]').forEach(function (b) { if (b.closest('[data-t2-pressed-group]') === group) b.setAttribute('aria-pressed', b === pressed ? 'true' : 'false'); });
      group.dispatchEvent(new CustomEvent('t2:change', { bubbles: true, detail: { button: pressed } }));
      return;
    }

    var opener = t.closest('[data-t2-dialog-open]');
    if (opener) { openDialog(opener.getAttribute('data-t2-dialog-open')); return; }

    var closer = t.closest('[data-t2-dialog-close]');
    if (closer) { var d = closer.closest('dialog'); if (d) d.close(closer.value || ''); return; }

    if (t.matches('dialog.t2-dialog')) {
      var rect = t.getBoundingClientRect();
      var inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (!inside) t.close('');
    }
  });

  doc.addEventListener('input', function (e) {
    var t = e.target;
    if (!(t instanceof Element)) return;
    if (t.matches('[data-t2-accordion-search]')) { accFilter(t.closest('[data-t2-accordion]'), t.value); return; }
    if (t.getAttribute('aria-invalid') === 'true' && !isEmptyInvalid(t)) setInvalid(t, false);
  });

  doc.addEventListener('change', function (e) {
    var t = e.target;
    if (!(t instanceof Element)) return;
    if (t.getAttribute('aria-invalid') === 'true' && !isEmptyInvalid(t)) setInvalid(t, false);
    if (t.matches('[data-t2-dropzone] input[type="file"]')) {
      var list = fieldOf(t.closest('[data-t2-dropzone]')).querySelector('[data-t2-file-list]');
      if (!list) return;
      list.innerHTML = Array.prototype.map.call(t.files, function (f) {
        var kb = f.size / 1024;
        var size = kb >= 1024 ? (kb / 1024).toFixed(1) + ' MB' : Math.max(1, Math.round(kb)) + ' KB';
        return '<li><svg class="t2-ic" aria-hidden="true"><use href="#t2-i-file-text"></use></svg><span class="t2-files__name">' + esc(f.name) + '</span><span class="t2-files__size">' + size + '</span></li>';
      }).join('');
    }
  });

  ['dragenter', 'dragover'].forEach(function (type) {
    doc.addEventListener(type, function (e) {
      var dz = e.target instanceof Element && e.target.closest('[data-t2-dropzone]');
      if (dz) dz.classList.add('is-dragover');
    });
  });
  ['dragleave', 'drop'].forEach(function (type) {
    doc.addEventListener(type, function (e) {
      var dz = e.target instanceof Element && e.target.closest('[data-t2-dropzone]');
      if (dz) dz.classList.remove('is-dragover');
    });
  });

  doc.addEventListener('submit', function (e) {
    var form = e.target;
    if (!(form instanceof HTMLFormElement) || !form.hasAttribute('data-t2-validate')) return;
    if (!validate(form)) { e.preventDefault(); return; }
    var redirect = form.getAttribute('data-t2-demo-redirect');
    var success = form.getAttribute('data-t2-demo-success');
    if (!redirect && !success) return;
    e.preventDefault();
    if (success) {
      var box = doc.getElementById(success);
      if (box) { box.hidden = false; box.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
    }
    if (redirect) {
      var btn = form.querySelector('[type="submit"]');
      if (btn) { btn.setAttribute('aria-busy', 'true'); btn.disabled = true; if (btn.hasAttribute('data-busy-label')) btn.textContent = btn.getAttribute('data-busy-label'); }
      setTimeout(function () { window.location.href = redirect; }, 600);
    }
  });

  /* ---- 9. Init ---- */
  function refresh(scope) {
    var s = scope || doc;
    s.querySelectorAll('[data-t2-donut]').forEach(renderDonut);
    initShots(s);
    s.querySelectorAll('[data-t2-accordion]').forEach(accSyncAllButton);
    syncThemeButtons();
  }

  function init() {
    injectSprite();
    if ('ResizeObserver' in window) shotObserver = new ResizeObserver(function (entries) { entries.forEach(function (en) { fitShot(en.target); }); });
    else window.addEventListener('resize', function () { doc.querySelectorAll('[data-t2-shot]').forEach(fitShot); });
    refresh(doc);
    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      if (mq.addEventListener) mq.addEventListener('change', syncThemeButtons);
    }
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init);
  else init();

  window.T2 = {
    version: '1.0.0',
    icons: ICONS,
    theme: theme,
    setTheme: setTheme,
    refresh: refresh,
    renderDonut: renderDonut,
    openDialog: openDialog
  };
})();
