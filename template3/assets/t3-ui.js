/*!
 * t3-ui.js v0.1 (preview) - Template 3 runtime (vanilla JS, ES2018, no dependencies). Pair with assets/t3-ui.css.
 * Owns the icon sprite, the small charts and every interactive behaviour. Public API: window.T3 only.
 *
 * INCLUDE - in <head>, NOT defer/async (the saved theme and sidebar state are applied before first paint):
 *   <link rel="stylesheet" href="/template/template3/assets/t3-ui.css?v=0.1">
 *   <script src="/template/template3/assets/t3-ui.js?v=0.1"></script>
 *
 * DATA ATTRIBUTES
 *   data-t3-theme-toggle        Light/dark switch (aria-pressed="true" while dark). Saved in localStorage "t3-theme".
 *   data-t3-sidebar-toggle      >=1024px: collapse the sidebar to an icon rail (saved in "t3-sidebar").
 *                               <1024px: open/close the off-canvas sidebar. data-t3-sidebar-close closes it.
 *   .t3-nav__toggle             Sidebar group: aria-controls=<sub id>, the sub carries [hidden] while closed.
 *   data-t3-popover="id"        Opens/closes the .t3-popover with that id (click outside or Esc closes).
 *   data-t3-pressed-group       Container: one [aria-pressed] button pressed at a time. Fires "t3:change".
 *   data-t3-clock               <time>: live HH:MM.
 *   data-t3-spark="7,9,8,..."   <svg class="t3-spark">: sparkline with a soft fill (colour = currentColor).
 *   data-t3-area                div.t3-chart: smooth area/line chart with hover tooltip.
 *                                 data-labels="1|2|3"   data-unit="งาน"   data-label-prefix="วันที่ "
 *                                 data-series='[{"name":"แจ้งใหม่","color":"var(--t3-c1)","values":[7,9,8]}]'
 *                                 A series with "fill":false is drawn as a line only.
 *   data-t3-donut               div.t3-donut: draws the ring from its .t3-statlist items
 *                                 <li data-value="96" style="--c:var(--t3-success)">...</li>
 *                               Optional data-t3-caption="รายการ" (text under the total).
 *   data-t3-demo="ข้อความ"       PREVIEW ONLY: shows a toast instead of doing anything (remove in a real system).
 *
 * FUNCTIONS  T3.setTheme('light'|'dark')  T3.theme()  T3.toast(text)  T3.refresh(root?)  T3.icons
 * Ctrl+K (or /) focuses the topbar search.
 */
(function () {
  'use strict';
  if (window.T3 && window.T3.version) return;

  var doc = document;
  var root = doc.documentElement;
  var THEME_KEY = 't3-theme';
  var SIDEBAR_KEY = 't3-sidebar';
  var seq = 0;

  /* ---- 1. State applied before first paint ---- */
  try {
    var savedTheme = localStorage.getItem(THEME_KEY);
    if ((savedTheme === 'light' || savedTheme === 'dark') && !root.hasAttribute('data-theme')) root.setAttribute('data-theme', savedTheme);
    if (localStorage.getItem(SIDEBAR_KEY) === 'collapsed') root.setAttribute('data-t3-sidebar', 'collapsed');
  } catch (e) { /* storage blocked: defaults */ }

  function theme() {
    var t = root.getAttribute('data-theme');
    if (t === 'light' || t === 'dark') return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function setTheme(t) {
    root.setAttribute('data-theme', t === 'dark' ? 'dark' : 'light');
    try { localStorage.setItem(THEME_KEY, t); } catch (e) { /* not saved */ }
    syncButtons();
  }
  function isDesktop() { return window.matchMedia('(min-width: 1024px)').matches; }
  function syncButtons() {
    var dark = theme() === 'dark';
    doc.querySelectorAll('[data-t3-theme-toggle]').forEach(function (b) { b.setAttribute('aria-pressed', dark ? 'true' : 'false'); });
    var app = doc.querySelector('.t3-app');
    var open = isDesktop() ? root.getAttribute('data-t3-sidebar') !== 'collapsed' : !!(app && app.classList.contains('is-nav-open'));
    doc.querySelectorAll('[data-t3-sidebar-toggle]').forEach(function (b) { b.setAttribute('aria-expanded', open ? 'true' : 'false'); });
  }

  /* ---- 2. Icons (lucide-style 24x24 strokes; ISC licence) ---- */
  var ICONS = {
    'armchair': '<path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/><path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z"/><path d="M5 18v2"/><path d="M19 18v2"/>',
    'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    'bell': '<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>',
    'calendar-days': '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>',
    'chart-column': '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    'circle-check': '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    'clipboard-list': '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>',
    'cloud-sun': '<path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/>',
    'database': '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>',
    'inbox': '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    'info': '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    'key': '<path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/>',
    'laptop': '<path d="M18 5a2 2 0 0 1 2 2v8.526a2 2 0 0 0 .212.897l1.068 2.127a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45l1.068-2.127A2 2 0 0 0 4 15.526V7a2 2 0 0 1 2-2z"/><path d="M20.054 15.987H3.946"/>',
    'layout-dashboard': '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
    'layout-grid': '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
    'log-out': '<path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>',
    'menu': '<path d="M4 12h16"/><path d="M4 6h16"/><path d="M4 18h16"/>',
    'monitor': '<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>',
    'moon': '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    'package': '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
    'panel-left': '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/>',
    'plus': '<path d="M5 12h14"/><path d="M12 5v14"/>',
    'printer': '<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect x="6" y="14" width="12" height="8" rx="1"/>',
    'projector': '<path d="M5 7 3 5"/><path d="M9 6V3"/><path d="m13 7 2-2"/><circle cx="9" cy="13" r="3"/><path d="M11.83 12H20a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h2.17"/><path d="M16 16h2"/>',
    'quote': '<path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/>',
    'scan-line': '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/>',
    'search': '<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>',
    'settings': '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    'sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    'timer': '<path d="M10 2h4"/><path d="M12 14l3-3"/><circle cx="12" cy="14" r="8"/>',
    'trending-down': '<path d="M16 17h6v-6"/><path d="m22 17-8.5-8.5-5 5L2 7"/>',
    'trending-up': '<path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>',
    'triangle-alert': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    'user': '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    'user-check': '<path d="m16 11 2 2 4-4"/><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>',
    'wind': '<path d="M12.8 19.6A2 2 0 1 0 14 16H2"/><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/><path d="M9.8 4.4A2 2 0 1 1 11 8H2"/>',
    'wrench': '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    'x': '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    'zap': '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>'
  };

  function injectSprite() {
    if (doc.getElementById('t3-sprite')) return;
    var s = '<svg xmlns="http://www.w3.org/2000/svg" id="t3-sprite" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden">';
    Object.keys(ICONS).forEach(function (k) { s += '<symbol id="t3-i-' + k + '" viewBox="0 0 24 24">' + ICONS[k] + '</symbol>'; });
    doc.body.insertAdjacentHTML('afterbegin', s + '</svg>');
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }
  function fmt(n) { return Number(n).toLocaleString('th-TH'); }

  /* ---- 3. Charts ---- */
  // Monotone cubic path through the points (no overshoot below the baseline).
  function smooth(p) {
    var n = p.length, i, d = [], m = [];
    if (n < 3) return 'M' + p.map(function (q) { return q[0].toFixed(2) + ',' + q[1].toFixed(2); }).join('L');
    for (i = 0; i < n - 1; i++) d[i] = (p[i + 1][1] - p[i][1]) / (p[i + 1][0] - p[i][0]);
    m[0] = d[0];
    m[n - 1] = d[n - 2];
    for (i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
    for (i = 0; i < n - 1; i++) {
      if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
      var a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
      if (s > 9) { var t = 3 / Math.sqrt(s); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
    }
    var out = 'M' + p[0][0].toFixed(2) + ',' + p[0][1].toFixed(2);
    for (i = 0; i < n - 1; i++) {
      var h = (p[i + 1][0] - p[i][0]) / 3;
      out += 'C' + (p[i][0] + h).toFixed(2) + ',' + (p[i][1] + m[i] * h).toFixed(2) + ' ' +
        (p[i + 1][0] - h).toFixed(2) + ',' + (p[i + 1][1] - m[i + 1] * h).toFixed(2) + ' ' +
        p[i + 1][0].toFixed(2) + ',' + p[i + 1][1].toFixed(2);
    }
    return out;
  }
  function niceStep(raw) {
    var pow = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10)), f = raw / pow;
    return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * pow;
  }

  function renderSpark(svg) {
    var vals = (svg.getAttribute('data-t3-spark') || '').split(',').map(Number).filter(function (v) { return isFinite(v); });
    if (vals.length < 2) return;
    var min = Math.min.apply(null, vals), max = Math.max.apply(null, vals), span = (max - min) || 1, n = vals.length;
    var id = 't3s' + (++seq);
    var pts = vals.map(function (v, i) { return [i * 100 / (n - 1), 5 + (1 - (v - min) / span) * 20]; });
    var d = smooth(pts);
    svg.setAttribute('viewBox', '0 0 100 32');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.innerHTML = '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="currentColor" stop-opacity=".2"/><stop offset="1" stop-color="currentColor" stop-opacity="0"/></linearGradient></defs>' +
      '<path d="' + d + 'L100,32L0,32Z" fill="url(#' + id + ')"/>' +
      '<path d="' + d + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>';
  }

  function renderArea(el) {
    var labels = (el.getAttribute('data-labels') || '').split('|');
    var series;
    try { series = JSON.parse(el.getAttribute('data-series') || '[]'); } catch (e) { series = []; }
    if (!series.length || !series[0].values || series[0].values.length < 2) return;
    var unit = el.getAttribute('data-unit') || '';
    var prefix = el.getAttribute('data-label-prefix') || '';
    var n = series[0].values.length;
    var W = Math.max(el.clientWidth, 240), H = el.clientHeight || 264;
    var pl = 30, pr = 10, pt = 10, pb = 26, iw = W - pl - pr, ih = H - pt - pb;
    var max = 0;
    series.forEach(function (s) { s.values.forEach(function (v) { if (v > max) max = v; }); });
    var step = niceStep((max || 1) / 4), top = Math.ceil((max || 1) / step) * step;
    function x(i) { return pl + i * iw / (n - 1); }
    function y(v) { return pt + ih - v / top * ih; }
    var uid = 't3a' + (++seq);

    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true" focusable="false"><defs>';
    series.forEach(function (s, k) {
      svg += '<linearGradient id="' + uid + k + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:' + esc(s.color) + ';stop-opacity:.24"/><stop offset="1" style="stop-color:' + esc(s.color) + ';stop-opacity:0"/></linearGradient>';
    });
    svg += '</defs>';
    for (var t = 0; t <= top + 1e-9; t += step) {
      var gy = y(t).toFixed(1);
      svg += '<line class="t3-chart__grid" x1="' + pl + '" x2="' + (W - pr) + '" y1="' + gy + '" y2="' + gy + '"/>' +
        '<text class="t3-chart__axis" x="' + (pl - 8) + '" y="' + (y(t) + 4).toFixed(1) + '" text-anchor="end">' + fmt(t) + '</text>';
    }
    var every = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(iw / 48))));
    for (var i = 0; i < n; i++) {
      if (i % every) continue;
      svg += '<text class="t3-chart__axis" x="' + x(i).toFixed(1) + '" y="' + (H - 6) + '" text-anchor="middle">' + esc(labels[i] || '') + '</text>';
    }
    series.forEach(function (s, k) {
      var d = smooth(s.values.map(function (v, j) { return [x(j), y(v)]; }));
      if (s.fill !== false) svg += '<path d="' + d + 'L' + x(n - 1).toFixed(2) + ',' + y(0).toFixed(2) + 'L' + x(0).toFixed(2) + ',' + y(0).toFixed(2) + 'Z" fill="url(#' + uid + k + ')"/>';
      svg += '<path class="t3-chart__line" d="' + d + '" style="stroke:' + esc(s.color) + '"/>';
    });
    svg += '<g data-hover hidden><line class="t3-chart__guide" y1="' + pt + '" y2="' + (pt + ih) + '"/>';
    series.forEach(function (s) { svg += '<circle class="t3-chart__dot" r="5" style="fill:' + esc(s.color) + '"/>'; });
    svg += '</g></svg><div class="t3-chart__tip" hidden></div>';
    el.innerHTML = svg;

    var hover = el.querySelector('[data-hover]'), guide = hover.querySelector('line'), dots = hover.querySelectorAll('circle'), tip = el.querySelector('.t3-chart__tip');
    function show(idx) {
      var px = x(idx);
      hover.removeAttribute('hidden');
      guide.setAttribute('x1', px); guide.setAttribute('x2', px);
      var html = '<div class="t3-chart__tip-title">' + esc(prefix + (labels[idx] || '')) + '</div>';
      series.forEach(function (s, k) {
        dots[k].setAttribute('cx', px); dots[k].setAttribute('cy', y(s.values[idx]));
        html += '<div class="t3-chart__tip-row" style="--c:' + esc(s.color) + '">' + esc(s.name) + '<b>' + fmt(s.values[idx]) + (unit ? ' ' + esc(unit) : '') + '</b></div>';
      });
      tip.innerHTML = html;
      tip.hidden = false;
      var scale = el.clientWidth / W, half = tip.offsetWidth / 2;
      tip.style.left = Math.min(Math.max(px * scale, half + 4), el.clientWidth - half - 4) + 'px';
    }
    function hide() { hover.setAttribute('hidden', ''); tip.hidden = true; }
    el.onpointermove = function (e) {
      var r = el.getBoundingClientRect(), px = (e.clientX - r.left) * (W / r.width);
      show(Math.max(0, Math.min(n - 1, Math.round((px - pl) / (iw / (n - 1))))));
    };
    el.onpointerleave = hide;
  }

  function renderDonut(box) {
    var items = box.querySelectorAll('[data-value]'), data = [], total = 0;
    items.forEach(function (li, i) {
      var v = parseFloat(String(li.getAttribute('data-value')).replace(/,/g, '')) || 0;
      data.push({ v: v, c: li.style.getPropertyValue('--c').trim() || 'var(--t3-c' + ((i % 6) + 1) + ')', label: li.textContent.replace(/\s+/g, ' ').trim() });
      total += v;
    });
    var r = 66, w = 18, C = 2 * Math.PI * r, parts = data.filter(function (d) { return d.v > 0; }).length, gap = parts > 1 ? 3 : 0;
    var svg = '<svg viewBox="0 0 176 176" aria-hidden="true" focusable="false"><circle class="t3-donut__track" cx="88" cy="88" r="' + r + '" stroke-width="' + w + '"/>';
    var off = 0;
    data.forEach(function (d) {
      if (!d.v || !total) return;
      var len = d.v / total * C, dash = Math.max(len - gap, 1);
      svg += '<circle class="t3-donut__seg" cx="88" cy="88" r="' + r + '" stroke-width="' + w + '" style="stroke:' + esc(d.c) + '" stroke-dasharray="' + dash.toFixed(2) + ' ' + (C - dash).toFixed(2) + '" stroke-dashoffset="' + (-(off + gap / 2)).toFixed(2) + '"><title>' + esc(d.label) + '</title></circle>';
      off += len;
    });
    svg += '</svg>';
    var caption = box.getAttribute('data-t3-caption');
    var chart = box.querySelector('.t3-donut__chart');
    if (!chart) {
      chart = doc.createElement('div');
      chart.className = 't3-donut__chart';
      box.insertBefore(chart, box.firstChild);
    }
    chart.innerHTML = svg + '<div class="t3-donut__center"><span class="t3-donut__total">' + fmt(total) + '</span>' + (caption ? '<span class="t3-donut__caption">' + esc(caption) + '</span>' : '') + '</div>';
  }

  /* ---- 4. Toast ---- */
  function toast(text) {
    var host = doc.querySelector('.t3-toasts');
    if (!host) {
      host = doc.createElement('div');
      host.className = 't3-toasts';
      host.setAttribute('role', 'status');
      host.setAttribute('aria-live', 'polite');
      doc.body.appendChild(host);
    }
    var item = doc.createElement('div');
    item.className = 't3-toast';
    item.textContent = text;
    host.appendChild(item);
    setTimeout(function () { item.remove(); }, 2600);
  }

  /* ---- 5. Popovers + sidebar ---- */
  function closePopovers(except) {
    doc.querySelectorAll('[data-t3-popover][aria-expanded="true"]').forEach(function (b) {
      if (b === except) return;
      var p = doc.getElementById(b.getAttribute('data-t3-popover'));
      if (p) p.hidden = true;
      b.setAttribute('aria-expanded', 'false');
    });
  }
  function closeNav() {
    var app = doc.querySelector('.t3-app');
    if (app) app.classList.remove('is-nav-open');
    syncButtons();
  }

  doc.addEventListener('click', function (e) {
    var t = e.target;
    if (!(t instanceof Element)) return;

    var pop = t.closest('[data-t3-popover]');
    if (pop) {
      var panel = doc.getElementById(pop.getAttribute('data-t3-popover'));
      var open = pop.getAttribute('aria-expanded') !== 'true';
      closePopovers(pop);
      if (panel) panel.hidden = !open;
      pop.setAttribute('aria-expanded', open ? 'true' : 'false');
      return;
    }
    if (!t.closest('.t3-popover')) closePopovers();

    if (t.closest('[data-t3-theme-toggle]')) { setTheme(theme() === 'dark' ? 'light' : 'dark'); return; }

    if (t.closest('[data-t3-sidebar-toggle]')) {
      if (isDesktop()) {
        var collapsed = root.getAttribute('data-t3-sidebar') === 'collapsed';
        if (collapsed) root.removeAttribute('data-t3-sidebar'); else root.setAttribute('data-t3-sidebar', 'collapsed');
        try { localStorage.setItem(SIDEBAR_KEY, collapsed ? 'open' : 'collapsed'); } catch (err) { /* not saved */ }
      } else {
        var app = doc.querySelector('.t3-app');
        if (app) app.classList.toggle('is-nav-open');
      }
      syncButtons();
      return;
    }
    if (t.closest('[data-t3-sidebar-close]')) { closeNav(); return; }

    var group = t.closest('.t3-nav__toggle');
    if (group) {
      var sub = doc.getElementById(group.getAttribute('aria-controls'));
      var show = group.getAttribute('aria-expanded') !== 'true';
      group.setAttribute('aria-expanded', show ? 'true' : 'false');
      if (sub) sub.hidden = !show;
      return;
    }

    var pressed = t.closest('[data-t3-pressed-group] [aria-pressed]');
    if (pressed) {
      var box = pressed.closest('[data-t3-pressed-group]');
      box.querySelectorAll('[aria-pressed]').forEach(function (b) { b.setAttribute('aria-pressed', b === pressed ? 'true' : 'false'); });
      box.dispatchEvent(new CustomEvent('t3:change', { bubbles: true, detail: { button: pressed } }));
      return;
    }

    var demo = t.closest('[data-t3-demo]');
    if (demo) {
      e.preventDefault();
      toast(demo.getAttribute('data-t3-demo') || 'ตัวอย่างหน้าตาเท่านั้น ยังไม่ได้เชื่อมกับระบบจริง');
    }
  });

  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var opener = doc.querySelector('[data-t3-popover][aria-expanded="true"]');
      closePopovers();
      closeNav();
      if (opener) opener.focus();
      return;
    }
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target && e.target.tagName) || '') || (e.target && e.target.isContentEditable);
    if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') || (e.key === '/' && !typing)) {
      var input = doc.querySelector('.t3-search input');
      if (input && input.offsetParent !== null) { e.preventDefault(); input.focus(); input.select(); }
    }
  });

  /* ---- 6. Clock ---- */
  function tick() {
    var now = new Date(), text = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    doc.querySelectorAll('[data-t3-clock]').forEach(function (el) { if (el.textContent !== text) el.textContent = text; });
  }

  /* ---- 7. Init ---- */
  var areaObserver = null;
  function refresh(scope) {
    var s = scope || doc;
    s.querySelectorAll('[data-t3-spark]').forEach(renderSpark);
    s.querySelectorAll('[data-t3-donut]').forEach(renderDonut);
    s.querySelectorAll('[data-t3-area]').forEach(function (el) {
      renderArea(el);
      if (areaObserver && !el.hasAttribute('data-t3-observed')) { el.setAttribute('data-t3-observed', ''); areaObserver.observe(el); }
    });
    syncButtons();
  }
  function init() {
    injectSprite();
    if ('ResizeObserver' in window) {
      var widths = new WeakMap();
      areaObserver = new ResizeObserver(function (entries) {
        entries.forEach(function (en) {
          var w = Math.round(en.contentRect.width);
          if (widths.get(en.target) === w) return;
          widths.set(en.target, w);
          renderArea(en.target);
        });
      });
    }
    refresh(doc);
    tick();
    setInterval(tick, 15000);
    window.addEventListener('resize', function () { if (isDesktop()) closeNav(); });
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init);
  else init();

  window.T3 = { version: '0.1', icons: ICONS, theme: theme, setTheme: setTheme, toast: toast, refresh: refresh };
})();
