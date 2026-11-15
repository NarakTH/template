/*!
 * ds-ui.js v1.0.2 - DS UI Kit runtime (vanilla JS, ES2018, no dependencies). Pair with assets/ds-ui.css.
 * Single source of truth for the kit icons and every interactive behaviour. Public API: window.DS only.
 *
 * ---------------------------------------------------------------------------------------------------------
 * INCLUDE - in <head>, NOT defer/async (the saved theme is applied before first paint):
 *   <link rel="stylesheet" href="/template/assets/ds-ui.css?v=1.0.2">
 *   <script src="/template/assets/ds-ui.js?v=1.0.2"></script>
 * - Included twice (layout + page)? The second copy is ignored (guard on window.DS.version).
 * - Included at the end of <body>? Everything still works, but a saved dark theme may flash. Then add this
 *   one-liner to <head>:
 *   <script>try{var t=localStorage.getItem('ds-theme');if(t&&!document.documentElement.hasAttribute('data-theme'))document.documentElement.setAttribute('data-theme',t)}catch(e){}</script>
 * - A data-theme written by the server on <html> wins over the saved choice (use it to force a theme).
 *
 * HOW IT WIRES - delegated listeners on `document` that react ONLY to data-ds-* hooks (plus
 * .ds-tabs[role=tablist], .ds-nav__toggle, .ds-menu__item inside an open dropdown). Content injected later (AJAX,
 * DataTables redraw, Alpine x-html, Livewire, Turbo) works without re-init; a MutationObserver also normalises
 * ARIA of new tabs/dialogs/clocks/dropdowns/nav groups and enhances new date pickers and comboboxes. The script never
 * calls preventDefault/stopPropagation on elements without a data-ds-* hook. Single exception: while the
 * off-canvas sidebar is open (<=900px), the click on the dimmed page only closes the sidebar (no tap-through).
 * jQuery, Alpine.js, Bootstrap JS and SweetAlert2 can run side by side.
 *
 * ---------------------------------------------------------------------------------------------------------
 * DATA ATTRIBUTES
 *   data-ds-theme-toggle          Toggle light/dark. Icon swaps sun (light) / moon (dark); aria-label swaps.
 *                                 Optional labels: data-ds-label-light="..." data-ds-label-dark="...".
 *       <button type="button" class="ds-icon-btn" data-ds-theme-toggle data-ds-tip="สลับโหมดสว่าง / มืด">
 *         <svg class="ds-ic" aria-hidden="true"><use href="#ds-i-sun"></use></svg></button>
 *   data-ds-sidebar-toggle        DESKTOP (>900px): the same button collapses the sidebar to an icon rail
 *                                 (html[data-ds-sidebar="collapsed"], nav labels become tooltips) or hides it
 *                                 (DS.config.sidebarCollapse = 'hide' -> "hidden"); remembered in localStorage
 *                                 'ds-sidebar' and applied in <head>. DS.sidebar.collapse()/expand()/toggleCollapse().
 *                                 PHONE/TABLET (<=900px) it opens the off-canvas drawer as described below:
 *   data-ds-sidebar-toggle[="id"] Toggle .ds-sidebar.is-open (target = value or aria-controls id, else the
 *                                 first .ds-sidebar). Keeps aria-expanded; outside click and Esc close it;
 *                                 focus moves into the menu (the aria-current item first) and returns to the
 *                                 toggle. A closed off-canvas sidebar gets `inert` (not focusable); while it
 *                                 is open the page behind it (the sidebar's siblings) is inert and page scroll
 *                                 is locked (scrollbar width compensated, so nothing shifts).
 *       <button type="button" class="ds-icon-btn ds-menu-btn" data-ds-sidebar-toggle="ds-sidebar"
 *         aria-label="เปิดเมนู"><svg class="ds-ic" aria-hidden="true"><use href="#ds-i-menu"></use></svg></button>
 *       <aside class="ds-sidebar" id="ds-sidebar"> ... <nav class="ds-nav" aria-label="เมนูหลัก">...</nav></aside>
 *   data-ds-sidebar-close         Close the open sidebar (e.g. an x button inside it).
 *   data-ds-filters-toggle        "ตัวกรอง" button inside .ds-filters--collapsible (shown at <=620px only).
 *                                 Toggles .is-open on the form named by aria-controls (or the closest
 *                                 .ds-filters) + aria-expanded, revealing its .ds-filters__more children.
 *   data-ds-search-toggle         Topbar search button, shown at <=620px only (CSS). Toggles .is-open on the
 *                                 .ds-search named by aria-controls (it then shows as a full-width row under
 *                                 the topbar), keeps aria-expanded, focuses the input; Esc closes it again.
 *       <button type="button" class="ds-icon-btn ds-search-btn" data-ds-search-toggle aria-controls="ds-search"
 *         aria-expanded="false" aria-label="ค้นหา"><svg class="ds-ic" aria-hidden="true"><use href="#ds-i-search"></use></svg></button>
 *       <label class="ds-search" id="ds-search"><input type="search" name="q" aria-label="ค้นหา"> ...</label>
 *   data-ds-open="dialogId"       Open <dialog id="dialogId" class="ds-dialog"> with showModal(). The dialog
 *                                 gets aria-labelledby -> its .ds-dialog__title automatically. Use `autofocus`
 *                                 on the first field. Focus returns to the opener on close.
 *   data-ds-close[="value"]       Close the closest <dialog> (returnValue = value).
 *   data-ds-backdrop-close        On a <dialog>: a click on the backdrop closes it.
 *       <button type="button" class="ds-btn" data-ds-open="dlgNew">แจ้งซ่อมใหม่</button>
 *       <dialog class="ds-dialog" id="dlgNew"><form class="ds-dialog__body" method="dialog">
 *         <h2 class="ds-dialog__title">แจ้งซ่อมใหม่</h2> ... <input class="ds-input" autofocus>
 *         <div class="ds-dialog__actions">
 *           <button type="button" class="ds-btn ds-btn--ghost" data-ds-close>ยกเลิก</button>
 *           <button class="ds-btn" value="ok">บันทึกใบแจ้งซ่อม</button></div></form></dialog>
 *   data-ds-tip="text"            Tooltip on mouse move AND keyboard focus (works on SVG shapes too).
 *   data-ds-confirm="question"    On a link/button: ask DS.confirm() first; the click continues only on OK.
 *                                 Options: data-ds-confirm-title, data-ds-confirm-ok, data-ds-confirm-cancel,
 *                                 data-ds-confirm-danger (red OK button, Cancel focused).
 *       <button type="submit" class="ds-btn ds-btn--danger" data-ds-confirm="ลบใบแจ้งซ่อม SR-202505-0001 ?"
 *         data-ds-confirm-ok="ลบ" data-ds-confirm-danger>ลบ</button>
 *   data-ds-clock="time|date|date-short|year"   Live text, all from one clock (DS.now()):
 *                                 time "10:24 น." | date "วันพฤหัสบดีที่ <b>15 พฤษภาคม 2025</b>" |
 *                                 date-short "15/05/2025" | year "2025". Add data-ds-clock-be for พ.ศ.
 *                                 Refreshes on the minute boundary; paused while the tab is hidden.
 *   Tabs - every .ds-tabs[role=tablist] is wired: click, ArrowLeft/ArrowRight/Home/End, aria-selected,
 *   roving tabindex, panels (aria-controls) hidden/shown. Fires 'ds:tabchange' {tab, panel} on the tablist.
 *   Filter tabs: several tabs may share ONE aria-controls region (it stays visible; read ds:tabchange).
 *       <div class="ds-tabs" role="tablist" aria-label="ข้อมูลใบแจ้งซ่อม">
 *         <button type="button" class="ds-tabs__tab" role="tab" aria-selected="true" aria-controls="tab-info">ข้อมูล</button>
 *         <button type="button" class="ds-tabs__tab" role="tab" aria-controls="tab-log">ประวัติ
 *           <span class="ds-tabs__count">3</span></button></div>
 *       <section class="ds-tabs__panel" id="tab-info" role="tabpanel">...</section>
 *       <section class="ds-tabs__panel" id="tab-log" role="tabpanel" hidden>...</section>
 *   data-ds-dropdown              Dropdown trigger (topbar user menu, notifications). Toggles the panel named by its
 *                                 aria-controls (.ds-menu[role=menu] or .ds-popover; `hidden` attribute) + aria-expanded.
 *                                 One open at a time. Closes on outside pointerdown, Esc (focus back to the trigger),
 *                                 Tab out, and after a .ds-menu__item is activated (its own hook, e.g. data-ds-open,
 *                                 still runs). role="menu": items get tabindex=-1; ArrowDown/ArrowUp/Home/End move
 *                                 between them, Tab leaves the menu (from the trigger), Space activates a link item.
 *                                 Keyboard opening (Enter/Space/ArrowDown) focuses the first item (ArrowUp: the last);
 *                                 a mouse click keeps focus on the trigger. Opening a dropdown closes the off-canvas
 *                                 drawer and opening the drawer closes dropdowns. Fires 'ds:dropdown' {open, panel}.
 *       <div class="ds-dropdown">
 *         <button type="button" class="ds-user" data-ds-dropdown aria-controls="ds-user-menu" aria-expanded="false"
 *           aria-haspopup="menu"> ... </button>
 *         <div class="ds-menu" id="ds-user-menu" role="menu" aria-label="เมนูผู้ใช้" hidden>
 *           <a class="ds-menu__item" role="menuitem" href="profile">ข้อมูลส่วนตัว</a> ... </div></div>
 *   data-ds-notif-readall         Button in a .ds-popover: removes .is-unread from the popover items, empties + hides
 *                                 the trigger's .ds-icon-btn__dot, sets the trigger aria-label to "การแจ้งเตือน"
 *                                 (or its data-ds-label-read) and fires 'ds:notif-readall' {count, panel, trigger}
 *                                 (mark them read on the server there).
 *   .ds-nav__toggle               Sidebar sub-menu (class hook): button.ds-nav__item.ds-nav__toggle[aria-controls]
 *                                 + div.ds-nav__sub[hidden] inside a .ds-nav__group. Click toggles aria-expanded +
 *                                 hidden (fires 'ds:navgroup' {open, sub}). A group holding the aria-current="page"
 *                                 item opens on load and its toggle gets .has-current; groups the user opened stay
 *                                 open for the browser tab (sessionStorage 'ds-nav-open' = sub ids). In the desktop
 *                                 icon rail a click first expands the sidebar (DS.sidebar.expand()), then opens the
 *                                 group. Rail tooltips use the toggle label only (no caret, no sub items).
 *   select[data-ds-combobox]      Searchable single select (replaces Select2), see DS.combobox below.
 *       <label class="ds-field__label" for="fDept">หน่วยงาน</label>
 *       <select class="ds-select" id="fDept" name="dept" data-ds-combobox>
 *         <option value="">— เลือกหน่วยงาน —</option><optgroup label="สำนักงาน"><option>ฝ่ายไอที</option>...</select>
 *   data-ds-back[="url"]          history.back(); a tab without history (opened in a new tab) goes to the fallback:
 *                                 the attribute value, else the link's href, else "dashboard.html". Ctrl/Shift/middle
 *                                 click on a link keeps the browser default. An <a data-ds-back> without href gets one.
 *   data-ds-print                 window.print() (A4 print page toolbar). Hidden when the browser cannot print.
 *       <button type="button" class="ds-btn ds-btn--ghost" data-ds-back>ย้อนกลับ</button>
 *       <button type="button" class="ds-btn" data-ds-print>พิมพ์ / บันทึก PDF</button>
 *
 * ---------------------------------------------------------------------------------------------------------
 * JS API (window.DS)
 *   DS.version                        '1.0.2'
 *   DS.init(root?)                    Re-scan a container (tabs ARIA, dialog labels, clocks, theme toggles,
 *                                     dropdowns, nav groups, date pickers, comboboxes, back/print buttons,
 *                                     sprite). Rarely needed - added nodes are picked up automatically.
 *   DS.theme.get()                    -> 'light' | 'dark' (effective, follows the OS when nothing is saved)
 *   DS.theme.set('light'|'dark'|'system')   'system' clears the saved choice.   DS.theme.toggle()
 *                                     localStorage key 'ds-theme'; fires 'ds:themechange' {theme, source} on document
 *                                     (source 'toggle' | 'api' | 'os': skip feedback for 'os');
 *                                     mirrors data-bs-theme when <html> already carries it (Bootstrap 5.3).
 *   DS.icon(name, extraClass?)        -> '<svg class="ds-ic extraClass" aria-hidden="true"><use href="#ds-i-name"></use></svg>'
 *                                     Unknown name -> empty .ds-ic + one console warning.
 *   DS.iconNames                      Array of every icon name (sprite ids are "ds-i-" + name).
 *       el.insertAdjacentHTML('beforeend', DS.icon('trash', 'ds-ic--sm'));
 *   DS.sidebar.open(id?) / .close(id?) / .toggle(id?) / .isOpen(id?)
 *   DS.dialog.open(idOrEl) / DS.dialog.close(idOrEl, value?)
 *   DS.tabs.select(tabElOrSelector, {focus, silent})   Select a tab from code (silent = no ds:tabchange).
 *   DS.toast(message, {type:'info'|'success'|'danger', timeout:2600}) -> {close()}
 *                                     One toast at a time: a new call replaces the current one (as in the
 *                                     original). timeout 0 = stays until clicked or Esc. Hover pauses.
 *                                     Announced to screen readers (danger = assertive). Shown above an open
 *                                     modal dialog. Server flash: <script>DS.toast('บันทึกแล้ว',{type:'success'})</script>
 *                                     at the end of <body>.
 *       DS.toast('บันทึกใบแจ้งซ่อม SR-202505-0153 แล้ว', {type:'success'});
 *   DS.confirm({title, text, okText, cancelText, danger}) -> Promise<boolean>   (Esc / backdrop / cancel -> false)
 *       DS.confirm({title:'ลบรายการนี้?', text:'ไม่สามารถย้อนกลับได้', okText:'ลบ', danger:true})
 *         .then(function (ok) { if (ok) form.submit(); });
 *   DS.charts.donut(svg, items, {center, centerLabel, unit, legend, legendFormat})
 *   DS.charts.pie(svg, items, {unit, legend, legendFormat})
 *   DS.charts.bars(el, items, {unit, total, emptyText})
 *   DS.charts.legend(ul, items, {format:'count-pct'|'pct'|'count'|fn(value,total,item,i), total, chart})
 *       items = [{label:'รอดำเนินการ', value:18, color:'--ds-blue'}, ...]  color = a CSS custom property
 *       name (default palette: blue, sky, green, yellow, orange, red, purple, gray). Labels are escaped.
 *       Segments/bars carry data-ds-tip "label: n รายการ|ใบ (x.x%)". svg/el may be an element or a selector.
 *       <div class="ds-chart">
 *         <svg class="ds-chart__svg" id="stChart" viewBox="0 0 180 180" role="img" aria-label="สัดส่วนสถานะ"></svg>
 *         <ul class="ds-legend" id="stLegend"></ul></div>
 *       DS.charts.donut('#stChart', items, {legend:'#stLegend'});      // legend "18 (14.1%)"
 *       DS.charts.pie('#deptChart', items, {legend:'#deptLegend'});    // legend "28%" (.ds-legend--tight)
 *       DS.charts.bars('#catBars', items);                             // <div class="ds-bars" id="catBars">
 *   DS.config.era = 'be'              Thai calendar is the DEFAULT: every formatter and the date picker show
 *                                     Buddhist-Era years (พ.ศ. = ค.ศ. + 543). Set DS.config.era = 'ce' once per
 *                                     page (before DOMContentLoaded) for ค.ศ., or pass {be:false} per call.
 *   DS.fmtDate(date, {be})            -> 'dd/mm/yyyy' e.g. '15/05/2568' (be:false -> '15/05/2025'). Accepts Date,
 *                                     timestamp, 'YYYY-MM-DD' (read as a local date) or any Date-parsable string.
 *   DS.fmtDateLong(date, {be, weekday}) -> '15 พฤษภาคม 2568' / 'วันพฤหัสบดีที่ 15 พฤษภาคม 2568'
 *   DS.parseDate('15/05/2568')        -> Date (years > 2400 are read as พ.ศ.) · also 'YYYY-MM-DD'; null if invalid
 *   DS.datepicker.enhance(input) / .open(input) / .close()
 *                                     Thai calendar picker. AUTOMATIC for every <input type="date" class="ds-input">
 *                                     (add data-ds-native to keep the browser picker). The original input keeps its
 *                                     id/name/value (ISO 'YYYY-MM-DD', ค.ศ.) and still fires input/change events, so
 *                                     servers and page scripts need no change; the visible field shows dd/mm/พ.ศ.
 *                                     min/max/required/disabled/readonly are honoured. data-ds-era="ce" per input.
 *   DS.dropdown.open(elOrId) / .close() / .toggle(elOrId)   elOrId = the trigger, the panel, or either id
 *                                     (DS.dropdown.open('ds-user-menu')). close() closes whichever one is open.
 *   DS.combobox.enhance(select) / .open(select) / .close() / .sync(select)
 *                                     Searchable single select. AUTOMATIC for every select[data-ds-combobox] (optgroups
 *                                     ok, multiple not supported). The <select> stays the source of truth: same id/name/
 *                                     value, input + change events fire on it, label[for] and select.focus() move to the
 *                                     visible input, required/disabled/aria-invalid/aria-describedby are mirrored, and
 *                                     select.value = x, select.selectedIndex = n, $(select).val(x) or a 'change' event
 *                                     re-sync the text (code that sets option.selected directly: DS.combobox.sync(el)).
 *                                     Typing filters (case-insensitive substring, match in <mark>), ArrowDown/ArrowUp/
 *                                     PageDown/PageUp move, Enter selects, Esc closes and restores the selected label;
 *                                     leaving the field with unmatched text restores it (no free text), an exact label
 *                                     selects that option and an empty text selects the value="" option if there is
 *                                     one. Disabled options are listed but not selectable. The list is appended to
 *                                     <body> (or the open <dialog>) and follows the field on scroll/resize.
 *                                     data-ds-placeholder="..." on the select overrides "พิมพ์เพื่อค้นหา…".
 *   DS.fmtTime(date) -> 'HH:MM'       DS.fmtNum(n, {decimals}) -> '1,234'   DS.fmtPct(n, total, {decimals:1}) -> '14.1%'
 *   DS.esc(str)                       HTML-escape & < > " '  (use for every value you interpolate into HTML)
 *   DS.now()                          Clock source for data-ds-clock; override to pin a demo page:
 *                                     DS.now = function () { return new Date(2025, 4, 15, 10, 24); };
 *
 * ALPINE.JS / JQUERY
 *   Alpine: @click="DS.sidebar.toggle()", @click="DS.toast('...')" - or simply keep the data-ds-* hooks.
 *   If Alpine should own the sidebar state instead, bind :class="{'is-open': open}" and omit
 *   data-ds-sidebar-toggle. jQuery: $(document).on('ds:themechange', function (e) { e.originalEvent.detail.theme });
 *
 * EVENTS        'ds:themechange' {theme, source} (document) · 'ds:tabchange' (tablist) · 'ds:sidebar' {open} (sidebar)
 *               'ds:dropdown' {open, panel} (trigger) · 'ds:notif-readall' {count, panel, trigger} (read-all button)
 *               'ds:navgroup' {open, sub} (nav toggle, user clicks only)
 * GENERATED IDS ds-sprite, ds-tip, ds-toast, ds-live, ds-live-alert, ds-dlg-title-N, ds-dlg-text-N,
 *               ds-tab-N, ds-legend-N, ds-nav-sub-N, ds-combo-N, <selectId>-ds, <selectId>-ds-list,
 *               <selectId>-ds-oN  (never use these ids for your own elements)
 * ICON NOTE     Symbols set fill/stroke/linecap/linejoin; stroke-width is inherited from .ds-ic (1.8) so that
 *               contexts such as .ds-kpi__icon (2) or .ds-notes__icon (2.4) can thicken it via CSS.
 */
(function (window, document) {
  'use strict';
  if (window.DS && window.DS.version) return; // double include: keep the first copy

  var VERSION = '1.0.2';
  var root = document.documentElement;
  var XLINK = 'http://www.w3.org/1999/xlink';
  var uid = 0;
  var warned = {};

  /* ---------- small helpers ---------- */
  var ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ESC[c]; }); }
  function warnOnce(key, msg) {
    if (warned[key]) return;
    warned[key] = 1;
    if (window.console && console.warn) console.warn('[ds-ui] ' + msg);
  }
  function $el(x) { return typeof x === 'string' ? document.querySelector(x) : (x || null); }
  function closest(t, sel) {
    if (t && t.nodeType !== 1) t = t.parentElement;
    return t && t.closest ? t.closest(sel) : null;
  }
  function qsa(scope, sel) {
    var out = scope && scope.querySelectorAll ? [].slice.call(scope.querySelectorAll(sel)) : [];
    if (scope && scope.nodeType === 1 && scope.matches(sel)) out.unshift(scope);
    return out;
  }
  function mk(tag, cls, attrs) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    return n;
  }
  function emit(target, name, detail) {
    try { target.dispatchEvent(new CustomEvent(name, { bubbles: true, detail: detail })); } catch (e) { /* old browser */ }
  }
  function isShown(el) { return !!(el && el.getClientRects && el.getClientRects().length); }
  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  /* =========================================================================================================
   * THEME - runs synchronously while the script is parsed in <head> (no flash of the wrong theme)
   * ======================================================================================================= */
  var THEME_KEY = 'ds-theme';
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  var mirrorBs = root.hasAttribute('data-bs-theme'); // Bootstrap 5.3 colour modes, only if the host uses them

  function readTheme() {
    try {
      var v = window.localStorage.getItem(THEME_KEY);
      return v === 'dark' || v === 'light' ? v : null;
    } catch (e) { return null; }
  }
  function themeGet() {
    var a = root.getAttribute('data-theme');
    if (a === 'dark' || a === 'light') return a;
    return mq && mq.matches ? 'dark' : 'light';
  }
  // source (event detail): 'toggle' (button / DS.theme.toggle) | 'api' (DS.theme.set) | 'os' (OS switch)
  function themeSet(v, source) {
    var explicit = v === 'dark' || v === 'light';
    if (explicit) root.setAttribute('data-theme', v); else root.removeAttribute('data-theme');
    try {
      if (explicit) window.localStorage.setItem(THEME_KEY, v); else window.localStorage.removeItem(THEME_KEY);
    } catch (e) { /* storage blocked: the theme still applies for this page view */ }
    themeChanged(typeof source === 'string' ? source : 'api');
  }
  var themeAnimTimer = 0;
  function themeToggle() {
    // colours cross-fade for .3s while the theme flips (CSS: .ds-theme-anim; off under reduced motion)
    root.classList.add('ds-theme-anim');
    clearTimeout(themeAnimTimer);
    themeAnimTimer = setTimeout(function () { root.classList.remove('ds-theme-anim'); }, 350);
    themeSet(themeGet() === 'dark' ? 'light' : 'dark', 'toggle');
  }
  function themeChanged(source) {
    var t = themeGet();
    if (mirrorBs) root.setAttribute('data-bs-theme', t);
    syncThemeToggles(root);
    emit(document, 'ds:themechange', { theme: t, source: source || 'api' });
  }
  // The icon shows the CURRENT mode (sun = light, moon = dark); the label says what a click will do.
  function syncThemeToggles(scope) {
    var dark = themeGet() === 'dark', name = dark ? 'moon' : 'sun', href = '#ds-i-' + name;
    qsa(scope, '[data-ds-theme-toggle]').forEach(function (btn) {
      var use = btn.querySelector('use');
      if (use) {
        if (use.getAttribute('href') !== href) use.setAttribute('href', href);
        if (use.hasAttributeNS(XLINK, 'href')) use.setAttributeNS(XLINK, 'xlink:href', href);
      } else if (!btn.firstElementChild) {
        btn.insertAdjacentHTML('afterbegin', icon(name));
      }
      btn.setAttribute('aria-label', dark
        ? (btn.getAttribute('data-ds-label-dark') || 'เปลี่ยนเป็นโหมดสว่าง')
        : (btn.getAttribute('data-ds-label-light') || 'เปลี่ยนเป็นโหมดมืด'));
    });
  }
  (function applySavedTheme() {
    var saved = readTheme();
    if (saved && !root.hasAttribute('data-theme')) root.setAttribute('data-theme', saved);
    if (mirrorBs) root.setAttribute('data-bs-theme', themeGet());
    if (saved && document.body) {
      warnOnce('late', 'ds-ui.js ran after <body> started; include it in <head> (not deferred) to avoid a theme flash.');
    }
  })();
  // desktop sidebar collapsed/hidden state (html[data-ds-sidebar]) - also before first paint
  var SB_KEY = 'ds-sidebar';
  (function applySavedSidebar() {
    try {
      var s = window.localStorage.getItem(SB_KEY);
      if ((s === 'collapsed' || s === 'hidden') && !root.hasAttribute('data-ds-sidebar')) root.setAttribute('data-ds-sidebar', s);
    } catch (e) { /* storage blocked */ }
  })();
  if (mq) {
    var onOsTheme = function () { if (!root.hasAttribute('data-theme')) themeChanged('os'); };
    if (mq.addEventListener) mq.addEventListener('change', onOsTheme);
    else if (mq.addListener) mq.addListener(onOsTheme);
  }

  /* =========================================================================================================
   * ICONS - the single source. 24x24 outline, round caps/joins, no fills, stroke-width from .ds-ic (1.8).
   * Server markup: <svg class="ds-ic" aria-hidden="true"><use href="#ds-i-home"></use></svg>
   * ======================================================================================================= */
  var ICONS = {
    // --- original dashboard set (same shapes; "8.500"-style number artefacts cleaned) ---
    home: 'M3 11.5 12 3l9 8.5M5 10v10h5v-6h4v6h5V10',
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 4-6 8-6s8 2 8 6',
    doc: 'M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h7',
    printer: 'M7 8V3h10v5M5 8h14a2 2 0 0 1 2 2v7h-4v4H7v-4H3v-7a2 2 0 0 1 2-2zM7 14h10',
    task: 'M5 5h14v16H5zM9 3h6v4H9zM9 14l2 2 4-4',
    cal: 'M4 6h16v15H4zM4 10h16M8 3v5M16 3v5M8 14h2M14 14h2',
    db: 'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6',
    // a real cog (8 teeth + hub) - the original gear was a circle with rays and read as a 'sun'
    gear: 'M10.03 4.66L10.78 2.07L13.22 2.07L13.97 4.66A7.6 7.6 0 0 1 15.8 5.42L18.16 4.12L19.88 5.84L18.58 8.2A7.6 7.6 0 0 1 19.34 10.03L21.93 10.78L21.93 13.22L19.34 13.97A7.6 7.6 0 0 1 18.58 15.8L19.88 18.16L18.16 19.88L15.8 18.58A7.6 7.6 0 0 1 13.97 19.34L13.22 21.93L10.78 21.93L10.03 19.34A7.6 7.6 0 0 1 8.2 18.58L5.84 19.88L4.12 18.16L5.42 15.8A7.6 7.6 0 0 1 4.66 13.97L2.07 13.22L2.07 10.78L4.66 10.03A7.6 7.6 0 0 1 5.42 8.2L4.12 5.84L5.84 4.12L8.2 5.42A7.6 7.6 0 0 1 10.03 4.66zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
    search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-5-5',
    bell: 'M6 17v-6a6 6 0 1 1 12 0v6l2 2H4zM10 21.5h4',
    menu: 'M4 6h16M4 12h16M4 18h16',
    wrench: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z',
    check: 'M8 12.5l3 3 5.5-6M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z',
    clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2',
    alert: 'M12 5v9M12 18v.5',
    plus: 'M12 4v16M4 12h16',
    chart: 'M5 20V11M12 20V4M19 20v-7',
    info: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v5M12 7.5v.5',   // 1.0.1: circled (bare 'i' blended into ds-alert--info)
    sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5',
    scan: 'M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
    // --- kit additions (same grid and style) ---
    moon: 'M20.5 12.7A8.5 8.5 0 1 1 11.3 3.5a6.6 6.6 0 0 0 9.2 9.2z',
    edit: 'M4 20h4L18.5 9.5a2.8 2.8 0 0 0-4-4L4 16zM13 7l4 4',
    trash: 'M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6',
    eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
    'eye-off': 'M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6C3.9 8.4 2 12 2 12s3.5 7 10 7c1.9 0 3.6-.6 5-1.4M9.9 9.9a3 3 0 0 0 4.2 4.2',
    login: 'M15 4h4v16h-4M10 8l4 4-4 4M14 12H4',
    download: 'M12 4v11M7 10l5 5 5-5M4 20h16',
    upload: 'M12 16V5M7 10l5-5 5 5M4 20h16',
    filter: 'M4 5h16l-6 7.5V19l-4 2v-8.5z',
    x: 'M6 6l12 12M18 6 6 18',
    'chevron-left': 'M15 5l-7 7 7 7',
    'chevron-right': 'M9 5l7 7-7 7',
    'chevron-down': 'M5 9l7 7 7-7',
    'chevron-up': 'M5 15l7-7 7 7',
    'arrow-left': 'M20 12H4M10 6l-6 6 6 6',
    'arrow-right': 'M4 12h16M14 6l6 6-6 6',
    logout: 'M9 4H5v16h4M15 8l4 4-4 4M19 12H9',
    lock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4M12 15v2',
    mail: 'M3 5h18v14H3zM3 6l9 7 9-7',
    phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z',
    paperclip: 'M20 11.5l-8.5 8.5a5.5 5.5 0 0 1-7.8-7.8l9-9a3.7 3.7 0 0 1 5.2 5.2l-9 9a1.8 1.8 0 0 1-2.6-2.6l8.3-8.3',
    refresh: 'M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5',
    sort: 'M8 20V4M4 8l4-4 4 4M16 4v16M12 16l4 4 4-4',
    more: 'M5 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM12 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM19 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
    external: 'M14 4h6v6M20 4l-9 9M18 14v6H4V6h6',
    save: 'M4 4h12l4 4v12H4zM8 4v5h7V4M8 20v-6h8v6',
    send: 'M21 3 10 14M21 3l-7 18-4-7-7-4z',
    'map-pin': 'M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 7a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z',
    building: 'M3 21h18M5 21V4h10v17M15 9h4v12M8 8h4M8 12h4M8 16h4',
    users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2 20c0-3.5 3.2-5.5 7-5.5s7 2 7 5.5M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14.8c2.4.6 4 2.4 4 5.2',
    'check-circle': 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM8 12.5l3 3 5-6',
    'x-circle': 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM9 9l6 6M15 9l-6 6',
    'alert-triangle': 'M12 3 2 20h20zM12 10v4M12 17v.5',
    'file-text': 'M6 3h9l4 4v14H6zM14 3v5h5M9 12h6M9 15h6M9 18h4',
    image: 'M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6M15.5 8a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z',
    minus: 'M4 12h16',
    copy: 'M8 8h12v12H8zM16 8V4H4v12h4',
    // sidebar toggle on desktop: panel with arrow (collapse = arrow left, expand = arrow right)
    'sidebar-collapse': 'M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM9 4v16M16 9l-3 3 3 3',
    'sidebar-expand': 'M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM9 4v16M13 9l3 3-3 3'
  };
  var ICON_NAMES = Object.keys(ICONS);

  function icon(name, extraClass) {
    if (document.body) injectSprite(); // the <use> in the returned markup resolves at once
    var cls = 'ds-ic' + (extraClass ? ' ' + esc(extraClass) : '');
    if (!Object.prototype.hasOwnProperty.call(ICONS, name)) {
      warnOnce('icon:' + name, 'unknown icon "' + name + '" (see DS.iconNames)');
      return '<svg class="' + cls + '" aria-hidden="true"></svg>';
    }
    return '<svg class="' + cls + '" aria-hidden="true"><use href="#ds-i-' + name + '"></use></svg>';
  }
  function injectSprite() {
    if (!document.body || document.getElementById('ds-sprite')) return;
    var s = '<svg xmlns="http://www.w3.org/2000/svg" id="ds-sprite" hidden aria-hidden="true" focusable="false"' +
      ' style="position:absolute;width:0;height:0;overflow:hidden">';
    ICON_NAMES.forEach(function (n) {
      s += '<symbol id="ds-i-' + n + '" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
        ' stroke-linecap="round" stroke-linejoin="round"><path d="' + ICONS[n] + '"/></symbol>';
    });
    var box = document.createElement('div');
    box.innerHTML = s + '</svg>';
    document.body.insertBefore(box.firstChild, document.body.firstChild);
  }
  // Script parsed in <head>: inject the sprite as soon as <body> exists (not at DOMContentLoaded), so long
  // pages that paint early never show blank icons.
  if (!document.body && window.MutationObserver) {
    var bodyWatch = new MutationObserver(function () {
      if (!document.body) return;
      bodyWatch.disconnect();
      injectSprite();
    });
    bodyWatch.observe(root, { childList: true });
  }

  /* =========================================================================================================
   * FORMATTERS
   * ======================================================================================================= */
  var TH_MONTHS = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
    'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  var TH_DAYS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
  var numFmt = {};

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function toDate(x) {
    if (x == null || x === '') return null;
    if (x instanceof Date) return isNaN(x.getTime()) ? null : x;
    if (typeof x === 'string') {
      var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(x.trim()); // date-only ISO = local date (not UTC)
      if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
    }
    var d = new Date(x);
    return isNaN(d.getTime()) ? null : d;
  }
  // Thai calendar by default: years are Buddhist Era (พ.ศ. = ค.ศ. + 543) unless {be:false} or DS.config.era = 'ce'
  var CONFIG = { era: 'be', sidebarCollapse: 'rail' }; // sidebarCollapse: 'rail' (icon rail) | 'hide' (fully hidden)
  function isBE(o) { return o && o.be != null ? !!o.be : CONFIG.era !== 'ce'; }
  function yearOf(d, o) { return d.getFullYear() + (isBE(o) ? 543 : 0); }
  function fmtDate(date, o) {
    var d = toDate(date);
    return d ? pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + yearOf(d, o) : '';
  }
  function fmtDateLong(date, o) {
    var d = toDate(date);
    if (!d) return '';
    return (o && o.weekday ? 'วัน' + TH_DAYS[d.getDay()] + 'ที่ ' : '') +
      d.getDate() + ' ' + TH_MONTHS[d.getMonth()] + ' ' + yearOf(d, o);
  }
  function fmtTime(date) {
    var d = toDate(date);
    return d ? pad(d.getHours()) + ':' + pad(d.getMinutes()) : '';
  }
  function fmtNum(n, o) {
    var v = +n, dec = o && o.decimals != null ? +o.decimals : null;
    if (!isFinite(v)) return '';
    var key = dec == null ? 'x' : String(dec);
    try {
      if (!numFmt[key]) {
        numFmt[key] = new Intl.NumberFormat('th-TH-u-nu-latn',
          dec == null ? { maximumFractionDigits: 3 } : { minimumFractionDigits: dec, maximumFractionDigits: dec });
      }
      return numFmt[key].format(v);
    } catch (e) { return dec == null ? String(v) : v.toFixed(dec); }
  }
  // Same rule as the original dashboard: 1 decimal, "0%" when the total is 0.
  function fmtPct(n, total, o) {
    var dec = o && o.decimals != null ? +o.decimals : 1;
    return +total ? (n * 100 / total).toFixed(dec) + '%' : '0%';
  }

  /* =========================================================================================================
   * FLOATING LAYERS - toast, tooltip, screen-reader live regions.
   * While a modal <dialog> is open they are moved inside it (top layer), otherwise they live in <body>.
   * ======================================================================================================= */
  var toastEl = null, toastTimer = 0, toastMs = 0;
  var tipEl = null, tipOwner = null, tipMode = '', tipRaf = 0, tipX = 0, tipY = 0;
  var liveEl = null, liveAlertEl = null;
  // Modal dialogs opened through DS, in showModal() order (= top-layer order, which is NOT DOM order).
  var modalStack = [];

  function stackModal(d) { unstackModal(d); modalStack.push(d); }
  function unstackModal(d) { var i = modalStack.indexOf(d); if (i >= 0) modalStack.splice(i, 1); }
  function modalOpen() {
    for (var k = modalStack.length - 1; k >= 0; k--) {
      if (modalStack[k].open && modalStack[k].isConnected) return modalStack[k];
      modalStack.splice(k, 1); // closed or removed without a 'close' event
    }
    // modals opened by other code: last one in DOM order (best effort)
    var ds = document.querySelectorAll('dialog[open]');
    for (var i = ds.length - 1; i >= 0; i--) {
      try { if (ds[i].matches(':modal')) return ds[i]; } catch (e) { return ds[i]; }
    }
    return null;
  }
  function mount(node) {
    var host = modalOpen() || document.body;
    if (host && node.parentNode !== host) host.appendChild(node);
    return node;
  }
  function rescueLayers(dlg) { // call after dlg closed: move our layers out of it
    [toastEl, tipEl, liveEl, liveAlertEl].forEach(function (n) { if (n && dlg.contains(n)) mount(n); });
  }
  function ensureLive() {
    if (!document.body) return;
    if (!liveEl) {
      liveEl = mk('div', 'ds-sr-only', { id: 'ds-live', role: 'status', 'aria-live': 'polite', 'aria-atomic': 'true' });
      liveAlertEl = mk('div', 'ds-sr-only', { id: 'ds-live-alert', role: 'alert', 'aria-atomic': 'true' });
    }
    if (!liveEl.isConnected) document.body.appendChild(liveEl);
    if (!liveAlertEl.isConnected) document.body.appendChild(liveAlertEl);
  }
  function announce(msg, urgent) {
    ensureLive();
    var r = mount(urgent ? liveAlertEl : liveEl);
    r.textContent = '';
    setTimeout(function () { r.textContent = String(msg); }, 60); // re-announces identical messages too
  }

  /* ---------- toast ---------- */
  function toast(message, opts) {
    opts = opts || {};
    if (!document.body) {
      ready(function () { toast(message, opts); });
      return { close: hideToast };
    }
    var type = opts.type === 'error' ? 'danger' : opts.type;
    if (!toastEl) {
      toastEl = mk('div', 'ds-toast', { id: 'ds-toast', 'aria-hidden': 'true' }); // text is announced via #ds-live
      toastEl.hidden = true;
      toastEl.addEventListener('mouseenter', function () { clearTimeout(toastTimer); });
      toastEl.addEventListener('mouseleave', armToast);
      toastEl.addEventListener('click', hideToast);
    }
    toastEl.className = 'ds-toast' + (type === 'success' || type === 'danger' ? ' ds-toast--' + type : '');
    toastEl.textContent = String(message == null ? '' : message);
    mount(toastEl).hidden = false;
    announce(toastEl.textContent, type === 'danger');
    toastMs = opts.timeout == null ? 2600 : Math.max(0, +opts.timeout || 0);
    armToast();
    return { close: hideToast };
  }
  function armToast() {
    clearTimeout(toastTimer);
    if (toastMs > 0) toastTimer = setTimeout(hideToast, toastMs);
  }
  function hideToast() {
    clearTimeout(toastTimer);
    if (toastEl) toastEl.hidden = true;
  }
  function toastShown() { return !!(toastEl && !toastEl.hidden); }

  /* ---------- tooltip: [data-ds-tip] on mouse move and on keyboard focus ---------- */
  function showTip(owner, mode) {
    var text = owner.getAttribute('data-ds-tip');
    if (!text) { hideTip(); return; }
    if (!tipEl) {
      tipEl = mk('div', 'ds-tip', { id: 'ds-tip', role: 'tooltip' });
      tipEl.hidden = true;
    }
    mount(tipEl);
    if (tipOwner && tipOwner !== owner) undescribe();
    if (tipEl.textContent !== text) tipEl.textContent = text;
    tipOwner = owner;
    tipMode = mode;
    tipEl.hidden = false;
    if (mode === 'focus') describe(owner);
    placeTip();
  }
  function hideTip() {
    if (tipRaf) { cancelAnimationFrame(tipRaf); tipRaf = 0; }
    if (tipEl) tipEl.hidden = true;
    undescribe();
    tipOwner = null;
    tipMode = '';
  }
  function describe(el) {
    var v = el.getAttribute('aria-describedby') || '';
    if ((' ' + v + ' ').indexOf(' ds-tip ') < 0) {
      el.setAttribute('aria-describedby', (v + ' ds-tip').trim());
      el.__dsDescribed = true;
    }
  }
  function undescribe() {
    var el = tipOwner;
    if (!el || !el.__dsDescribed) return;
    var v = (el.getAttribute('aria-describedby') || '').replace(/(^|\s)ds-tip(?=\s|$)/g, ' ').trim();
    if (v) el.setAttribute('aria-describedby', v); else el.removeAttribute('aria-describedby');
    el.__dsDescribed = false;
  }
  function placeTip() { if (!tipRaf) tipRaf = requestAnimationFrame(positionTip); }
  // Mouse: 12px right / 16px below the pointer (original), flipped above near the bottom; clamped to the viewport.
  function positionTip() {
    tipRaf = 0;
    if (!tipEl || tipEl.hidden || !tipOwner) return;
    tipEl.style.left = '0px'; // measure at full available width (a wrapping tip must not re-wrap after placing)
    tipEl.style.top = '0px';
    var w = tipEl.offsetWidth, h = tipEl.offsetHeight, x, y;
    var vw = root.clientWidth || window.innerWidth, vh = root.clientHeight || window.innerHeight; // minus scrollbars
    if (tipMode === 'focus') {
      var r = tipOwner.getBoundingClientRect();
      x = r.left;
      y = r.bottom + 8;
      if (y + h + 8 > vh) y = r.top - h - 8;
    } else {
      x = tipX + 12;
      y = tipY + 16;
      if (y + h + 8 > vh) y = tipY - h - 12;
    }
    tipEl.style.left = Math.max(8, Math.min(x, vw - w - 8)) + 'px';
    tipEl.style.top = Math.max(8, Math.min(y, vh - h - 8)) + 'px';
  }
  function onMouseMove(e) {
    var el = closest(e.target, '[data-ds-tip]');
    if (!el) { if (tipMode === 'mouse') hideTip(); return; }
    tipX = e.clientX;
    tipY = e.clientY;
    if (el !== tipOwner || tipMode !== 'mouse') showTip(el, 'mouse'); else placeTip();
  }
  function onMouseOut(e) { if (!e.relatedTarget && tipMode === 'mouse') hideTip(); } // pointer left the window
  function onFocusIn(e) {
    var el = closest(e.target, '[data-ds-tip]');
    if (!el) return;
    var visible = true;
    try { visible = e.target.matches(':focus-visible'); } catch (x) { /* old browser: always show */ }
    if (visible) showTip(el, 'focus');
  }
  function onFocusOut(e) {
    if (tipMode === 'focus' && tipOwner && tipOwner.contains(e.target)) hideTip();
  }

  /* =========================================================================================================
   * SIDEBAR - .ds-sidebar(.is-open), off-canvas when its toggle is visible and the sidebar is position:fixed
   * ======================================================================================================= */
  var sbOpener = null, sbPrevRoot = null; // sbPrevRoot = <html> inline styles saved while the page is locked

  function sidebarById(x) {
    if (x && typeof x !== 'string') return x;
    return (x && document.getElementById(x)) || document.querySelector('.ds-sidebar');
  }
  function sidebarFor(toggle) {
    var id = toggle && (toggle.getAttribute('aria-controls') || toggle.getAttribute('data-ds-sidebar-toggle'));
    return sidebarById(id || null);
  }
  function togglesOf(sb) {
    return [].filter.call(document.querySelectorAll('[data-ds-sidebar-toggle]'), function (t) { return sidebarFor(t) === sb; });
  }
  // Off-canvas mode = a toggle (hamburger) is rendered AND the sidebar is fixed. Desktop layouts are never inert.
  function isOverlay(sb) {
    if (!sb || !togglesOf(sb).some(isShown)) return false;
    try { return getComputedStyle(sb).position === 'fixed'; } catch (e) { return false; }
  }
  function syncSidebar(sb) {
    if (!sb) return;
    var open = sb.classList.contains('is-open'), ov = isOverlay(sb), col = collapsedState();
    togglesOf(sb).forEach(function (t) {
      // drawer (<=900px): expanded = drawer open · desktop: expanded = sidebar not collapsed
      var exp = ov ? open : !col;
      t.setAttribute('aria-expanded', exp ? 'true' : 'false');
      if (sb.id && !t.hasAttribute('aria-controls')) t.setAttribute('aria-controls', sb.id);
      if (!t.hasAttribute('data-ds-keep-label')) {
        var lbl = ov ? (open ? 'ปิดเมนู' : 'เปิดเมนู') : (col ? 'ขยายเมนู' : 'ย่อเมนู');
        t.setAttribute('aria-label', lbl);
        if (!ov) t.setAttribute('data-ds-tip', lbl); else t.removeAttribute('data-ds-tip');
        // icon says what a click does: hamburger = open drawer (phone) · panel+arrow = collapse/expand (desktop)
        var use = t.querySelector('use');
        if (use) {
          // desktop edge button: ‹ collapse / › expand (CSS draws the circle and animates the turn) · phone: hamburger
          var ic = '#ds-i-' + (ov ? 'menu' : 'chevron-left'); // CSS turns the chevron 180deg when collapsed
          if (use.getAttribute('href') !== ic) use.setAttribute('href', ic);
        }
      }
    });
    syncNavTips(sb, !ov && col === 'collapsed');
    // fully hidden desktop sidebar must not be reachable by Tab
    if (!ov && col === 'hidden') {
      if (!sb.hasAttribute('inert')) { sb.setAttribute('inert', ''); sb.__dsInertHidden = true; }
    } else if (sb.__dsInertHidden) {
      sb.__dsInertHidden = false;
      if (!(ov && !open)) sb.removeAttribute('inert');
    }
    if (ov && !open) {
      if (!sb.hasAttribute('inert')) { sb.setAttribute('inert', ''); sb.__dsInert = true; }
    } else if (sb.__dsInert) {
      sb.removeAttribute('inert');
      sb.__dsInert = false;
    }
    var lock = ov && open; // lock page scroll behind the open off-canvas menu
    if (lock && !sbPrevRoot) {
      // pad by the scrollbar width first, so the page behind the scrim does not reflow wider
      var sw = window.innerWidth - (root.getBoundingClientRect().width || root.clientWidth), pr = 0; // fractional
      sbPrevRoot = { overflow: root.style.overflow, paddingRight: root.style.paddingRight };
      try { pr = parseFloat(getComputedStyle(root).paddingRight) || 0; } catch (e) { /* keep 0 */ }
      if (sw > 0) root.style.paddingRight = (pr + sw) + 'px';
      root.style.overflow = 'hidden';
    } else if (!lock && sbPrevRoot) {
      root.style.overflow = sbPrevRoot.overflow;
      root.style.paddingRight = sbPrevRoot.paddingRight;
      sbPrevRoot = null;
    }
    // the page behind the open drawer is inert: Tab and the screen-reader cursor stay in the menu.
    // Taps on it then target the parent (.ds-app), which the capture listener still sees.
    var par = sb.parentElement;
    if (par) {
      [].forEach.call(par.children, function (c) {
        if (lock) {
          if (c === sb || c.hasAttribute('inert') || !inertable(c)) return;
          c.setAttribute('inert', '');
          c.__dsInert = true;
        } else if (c !== sb && c.__dsInert) {
          c.removeAttribute('inert');
          c.__dsInert = false;
        }
      });
    }
  }
  // never make our own floating layers, dialogs or scripts inert (matters when the sidebar is a <body> child)
  function inertable(c) {
    return c.tagName !== 'SCRIPT' && c.tagName !== 'DIALOG' && c.id !== 'ds-sprite' &&
      [toastEl, tipEl, liveEl, liveAlertEl].indexOf(c) < 0;
  }
  function openSidebar(sb, opener) {
    if (!sb || sb.classList.contains('is-open')) return;
    closeDropdown(false); // the drawer and a topbar dropdown never show together
    sb.classList.add('is-open');
    sbOpener = opener || document.activeElement;
    syncSidebar(sb);
    if (isOverlay(sb)) {
      var f = sb.querySelector('[aria-current="page"]') ||
        sb.querySelector('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])');
      if (f) { try { f.focus({ preventScroll: true }); } catch (e) { f.focus(); } }
    }
    emit(sb, 'ds:sidebar', { open: true });
  }
  function closeSidebar(sb, restoreFocus) {
    if (!sb || !sb.classList.contains('is-open')) return;
    var hadFocus = sb.contains(document.activeElement);
    sb.classList.remove('is-open');
    syncSidebar(sb);
    if ((restoreFocus || hadFocus) && sbOpener && sbOpener.isConnected && isShown(sbOpener)) sbOpener.focus();
    sbOpener = null;
    emit(sb, 'ds:sidebar', { open: false });
  }
  /* desktop collapse: html[data-ds-sidebar] = 'collapsed' (icon rail) | 'hidden' | absent (full sidebar) */
  function collapsedState() {
    var v = root.getAttribute('data-ds-sidebar');
    return v === 'collapsed' || v === 'hidden' ? v : null;
  }
  function setCollapsed(on) {
    var v = on ? (CONFIG.sidebarCollapse === 'hide' ? 'hidden' : 'collapsed') : null;
    if (v) root.setAttribute('data-ds-sidebar', v); else root.removeAttribute('data-ds-sidebar');
    try { if (v) window.localStorage.setItem(SB_KEY, v); else window.localStorage.removeItem(SB_KEY); } catch (e) { /* blocked */ }
    hideTip();
    [].forEach.call(document.querySelectorAll('.ds-sidebar'), function (sb) {
      syncSidebar(sb);
      emit(sb, 'ds:sidebar', { open: sb.classList.contains('is-open'), collapsed: v });
    });
  }
  // icon rail: each nav item shows its label as a tooltip (only tips we added ourselves are removed again).
  // Sub-menu items (.ds-nav__sub, hidden in the rail) get none; a group toggle shows its label without the caret.
  function syncNavTips(sb, on) {
    [].forEach.call(sb.querySelectorAll('.ds-nav__item'), function (a) {
      var subItem = a.classList.contains('ds-nav__subitem') || !!a.closest('.ds-nav__sub');
      if (on && !subItem && !a.hasAttribute('data-ds-tip')) {
        var c = a.cloneNode(true);
        [].forEach.call(c.querySelectorAll('.ds-nav__count,.ds-nav__caret'), function (n) { n.parentNode.removeChild(n); });
        var label = c.textContent.replace(/\s+/g, ' ').trim();
        if (label) { a.setAttribute('data-ds-tip', label); a.__dsAutoTip = true; }
      } else if ((!on || subItem) && a.__dsAutoTip) {
        a.removeAttribute('data-ds-tip');
        a.__dsAutoTip = false;
      }
    });
  }
  function toggleSidebar(sb, opener) {
    if (!sb) return;
    if (!isOverlay(sb) && isShown(opener || togglesOf(sb)[0])) { setCollapsed(!collapsedState()); return; } // desktop
    if (sb.classList.contains('is-open')) closeSidebar(sb, true); else openSidebar(sb, opener);
  }
  function syncAllSidebars() {
    [].forEach.call(document.querySelectorAll('.ds-sidebar'), function (sb) {
      if (sb.classList.contains('is-open') && !isOverlay(sb)) sb.classList.remove('is-open'); // crossed to desktop
      syncSidebar(sb);
    });
  }

  /* ---------- nav groups: .ds-nav__group > button.ds-nav__toggle[aria-controls] + .ds-nav__sub[hidden] ---------- */
  var NAV_KEY = 'ds-nav-open'; // sessionStorage: ids of the sub-menus the user opened (this browser tab only)
  function navStored() {
    try {
      var v = JSON.parse(window.sessionStorage.getItem(NAV_KEY) || '[]');
      return Array.isArray(v) ? v : [];
    } catch (e) { return []; }
  }
  function navRemember(id, open) {
    if (!id) return;
    var a = navStored().filter(function (x) { return x !== id; });
    if (open) a.push(id);
    try { window.sessionStorage.setItem(NAV_KEY, JSON.stringify(a)); } catch (e) { /* storage blocked */ }
  }
  function navSub(tg) {
    var id = tg.getAttribute('aria-controls'), g = tg.closest('.ds-nav__group');
    return (id && document.getElementById(id)) || (g && g.querySelector('.ds-nav__sub')) || null;
  }
  function setNavGroup(tg, open, byUser) {
    var sub = navSub(tg);
    if (!sub) return;
    tg.setAttribute('aria-expanded', open ? 'true' : 'false');
    sub.hidden = !open;
    if (!byUser) return;
    navRemember(sub.id, open);
    emit(tg, 'ds:navgroup', { open: open, sub: sub });
  }
  // once per toggle: open when it holds the current page, was left open in this tab, or the markup says so
  function initNavGroup(tg) {
    var sub = navSub(tg);
    if (!sub || tg.__dsNav) return;
    tg.__dsNav = true;
    if (!sub.id) sub.id = 'ds-nav-sub-' + (++uid);
    if (!tg.hasAttribute('aria-controls')) tg.setAttribute('aria-controls', sub.id);
    var cur = !!sub.querySelector('[aria-current="page"]');
    tg.classList.toggle('has-current', cur);
    setNavGroup(tg, cur || navStored().indexOf(sub.id) >= 0 || tg.getAttribute('aria-expanded') === 'true', false);
  }
  function onNavToggle(tg) {
    var sb = tg.closest('.ds-sidebar');
    if (collapsedState() === 'collapsed' && sb && !isOverlay(sb)) { // icon rail: expand the sidebar, then open
      setCollapsed(false);
      setNavGroup(tg, true, true);
      return;
    }
    setNavGroup(tg, tg.getAttribute('aria-expanded') !== 'true', true);
  }

  /* =========================================================================================================
   * DROPDOWNS - [data-ds-dropdown] trigger + the panel its aria-controls names (.ds-menu[role=menu] | .ds-popover)
   * ======================================================================================================= */
  var dd = null; // the open dropdown: {btn, panel}

  function ddPanel(btn) {
    var id = btn && btn.getAttribute('aria-controls');
    return (id && document.getElementById(id)) || null;
  }
  // trigger from: the trigger, the panel, either id, or anything inside the .ds-dropdown wrapper
  function ddTrigger(x) {
    var el = typeof x === 'string' ? document.getElementById(x) : x, t;
    if (!el || el.nodeType !== 1) return null;
    if (el.hasAttribute('data-ds-dropdown')) return el;
    if (el.id && (t = document.querySelector('[data-ds-dropdown][aria-controls="' + el.id + '"]'))) return t;
    t = el.closest('.ds-dropdown');
    return t ? t.querySelector('[data-ds-dropdown]') : null;
  }
  function isMenu(p) { return p.getAttribute('role') === 'menu'; }
  function menuItems(p) {
    return [].filter.call(p.querySelectorAll('[role^="menuitem"]'), function (i) {
      return !i.disabled && i.getAttribute('aria-disabled') !== 'true' && isShown(i);
    });
  }
  function focusQuiet(el) { try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); } }
  function initDropdown(btn) {
    var p = ddPanel(btn), open = !!(dd && dd.btn === btn);
    if (!p) return;
    if (!btn.hasAttribute('aria-haspopup')) btn.setAttribute('aria-haspopup', isMenu(p) ? 'menu' : 'true');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (!open) p.hidden = true;
    // menu pattern: the arrow keys move between items, Tab leaves the menu
    if (isMenu(p)) {
      [].forEach.call(p.querySelectorAll('[role^="menuitem"]'), function (i) { if (!i.hasAttribute('tabindex')) i.tabIndex = -1; });
    }
  }
  // where: 'first' | 'last' = focus that menu item (keyboard) · falsy = focus stays on the trigger (mouse, API)
  function openDropdown(x, where) {
    var btn = ddTrigger(x), p = btn && ddPanel(btn);
    if (!p || btn.disabled) return;
    if (!dd || dd.btn !== btn) {
      closeDropdown(false);
      var sb = document.querySelector('.ds-sidebar.is-open');
      if (sb && !sb.contains(btn)) closeSidebar(sb, false);
      hideTip();
      initDropdown(btn);
      p.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      dd = { btn: btn, panel: p };
      document.addEventListener('pointerdown', onDDOutside, true);
      document.addEventListener('focusin', onDDFocus);
      emit(btn, 'ds:dropdown', { open: true, panel: p });
    }
    if (where && isMenu(p)) {
      var it = menuItems(p);
      if (it.length) focusQuiet(where === 'last' ? it[it.length - 1] : it[0]);
    }
  }
  function closeDropdown(focusTrigger) {
    if (!dd) return;
    var btn = dd.btn, p = dd.panel;
    dd = null;
    document.removeEventListener('pointerdown', onDDOutside, true);
    document.removeEventListener('focusin', onDDFocus);
    p.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    if (focusTrigger && btn.isConnected && isShown(btn)) focusQuiet(btn);
    emit(btn, 'ds:dropdown', { open: false, panel: p });
  }
  function toggleDropdown(x, where) {
    var btn = ddTrigger(x);
    if (btn && dd && dd.btn === btn) closeDropdown(false); else openDropdown(btn, where);
  }
  function onDDOutside(e) {
    if (dd && !dd.btn.contains(e.target) && !dd.panel.contains(e.target)) closeDropdown(false);
  }
  function onDDFocus(e) { // focus moved elsewhere (Tab out, a dialog opened, ...)
    var t = e.target;
    if (dd && t && t.nodeType === 1 && !dd.btn.contains(t) && !dd.panel.contains(t)) closeDropdown(false);
  }
  // the dropdown trigger that owns el (el inside a .ds-menu / .ds-popover), for focus return
  function ddOwner(el) {
    var p = closest(el, '.ds-menu,.ds-popover');
    return p ? ddTrigger(p) : null;
  }
  // ArrowDown/ArrowUp on a trigger open it (menu: first/last item focused). In an open menu: arrows, Home/End,
  // PageUp/PageDown move; Space activates a link item; Tab closes it and continues from the trigger.
  function onDropdownKey(e) {
    var k = e.key, t = e.target, trig = closest(t, '[data-ds-dropdown]');
    if (trig && (k === 'ArrowDown' || k === 'ArrowUp' || k === 'Down' || k === 'Up')) {
      e.preventDefault();
      openDropdown(trig, k === 'ArrowUp' || k === 'Up' ? 'last' : 'first');
      return true;
    }
    if (!dd || !isMenu(dd.panel) || !dd.panel.contains(t)) return false;
    if (k === 'Tab') { var b = dd.btn; focusQuiet(b); closeDropdown(false); return true; } // default Tab moves on from b
    var it = menuItems(dd.panel), n = it.length, i = it.indexOf(closest(t, '[role^="menuitem"]')), j;
    if (!n) return false;
    if (k === 'ArrowDown' || k === 'Down') j = (i + 1) % n;
    else if (k === 'ArrowUp' || k === 'Up') j = i <= 0 ? n - 1 : i - 1;
    else if (k === 'Home' || k === 'PageUp') j = 0;
    else if (k === 'End' || k === 'PageDown') j = n - 1;
    else if ((k === ' ' || k === 'Spacebar') && i >= 0 && it[i].tagName === 'A') { e.preventDefault(); it[i].click(); return true; }
    else return false;
    e.preventDefault();
    focusQuiet(it[j]);
    return true;
  }
  // [data-ds-notif-readall]: everything in its popover is read; the trigger loses its count
  function notifReadAll(b) {
    var p = b.closest('.ds-popover') || b.closest('.ds-dropdown'), btn = ddTrigger(p || b);
    var items = qsa(p || document, '.is-unread');
    items.forEach(function (n) { n.classList.remove('is-unread'); });
    if (btn) {
      [].forEach.call(btn.querySelectorAll('.ds-icon-btn__dot'), function (d) { d.textContent = ''; d.hidden = true; });
      btn.setAttribute('aria-label', btn.getAttribute('data-ds-label-read') || 'การแจ้งเตือน');
    }
    announce('อ่านการแจ้งเตือนทั้งหมดแล้ว');
    emit(b, 'ds:notif-readall', { count: items.length, panel: p, trigger: btn });
  }

  /* ---------- [data-ds-back] / [data-ds-print] ---------- */
  function backFallback(el) {
    var v = el.getAttribute('data-ds-back'), h = el.tagName === 'A' ? el.getAttribute('href') : '';
    return v || (h && h !== '#' ? h : 'dashboard.html');
  }
  function initBack(el) {
    if (el.tagName === 'A' && !el.hasAttribute('href')) el.setAttribute('href', backFallback(el));
  }
  function goBack(el) {
    if (window.history.length > 1) window.history.back(); else window.location.href = backFallback(el);
  }

  /* =========================================================================================================
   * DIALOGS - [data-ds-open] / [data-ds-close] on native <dialog class="ds-dialog">
   * ======================================================================================================= */
  function dialogEl(x) { return typeof x === 'string' ? document.getElementById(x) : x; }
  function labelDialog(d) {
    if (d.hasAttribute('aria-labelledby') || d.hasAttribute('aria-label')) return;
    var h = d.querySelector('.ds-dialog__title');
    if (!h) return;
    if (!h.id) h.id = 'ds-dlg-title-' + (++uid);
    d.setAttribute('aria-labelledby', h.id);
  }
  function openDialog(x, opener) {
    var d = dialogEl(x);
    if (!d || d.tagName !== 'DIALOG') { warnOnce('dlg:' + x, 'dialog "' + x + '" not found'); return null; }
    labelDialog(d);
    if (!d.open) {
      var sb = document.querySelector('.ds-sidebar.is-open');
      if (sb && !sb.contains(d) && isOverlay(sb)) { // the page behind an open drawer is inert: close it first
        closeSidebar(sb, true);
        if (!opener || sb.contains(opener)) opener = document.activeElement; // = the menu toggle
      }
      d.__dsOpener = opener || document.activeElement;
      if (typeof d.showModal === 'function') { d.showModal(); stackModal(d); } else d.setAttribute('open', '');
    }
    return d;
  }
  function closeDialog(x, value) {
    var d = dialogEl(x);
    if (!d || !d.open) return;
    if (typeof d.close === 'function') {
      if (value == null) d.close(); else d.close(String(value));
    } else {
      d.removeAttribute('open');
    }
    onDialogClose({ target: d }); // sync; the native (async) 'close' event then finds nothing left to do
  }
  // 'close' does not bubble; it is caught in the capture phase on document.
  function onDialogClose(e) {
    var d = e.target;
    if (!d || d.tagName !== 'DIALOG') return;
    unstackModal(d);
    rescueLayers(d);
    if (tipOwner && d.contains(tipOwner)) hideTip();
    var op = d.__dsOpener;
    d.__dsOpener = null;
    if (!op) return;
    setTimeout(function () { // return focus when the browser did not (opener re-rendered, etc.)
      var a = document.activeElement;
      if (a && a !== document.body && a !== root) return;
      if (!op.isConnected && op.id) op = document.getElementById(op.id);
      if (op && op.isConnected && op.focus) op.focus();
    }, 0);
  }

  /* ---------- DS.confirm: SweetAlert-style confirm on a generated <dialog class="ds-dialog"> ---------- */
  function confirmDialog(o) {
    o = typeof o === 'string' ? { text: o } : (o || {});
    var title = o.title != null ? o.title : 'ยืนยันการดำเนินการ';
    var okText = o.okText || 'ตกลง', cancelText = o.cancelText || 'ยกเลิก';
    return new Promise(function (resolve) {
      var d = document.createElement('dialog');
      if (typeof d.showModal !== 'function' || !document.body) {
        resolve(window.confirm((o.title ? o.title + '\n' : '') + (o.text || title)));
        return;
      }
      var n = ++uid, tid = 'ds-dlg-title-' + n, xid = 'ds-dlg-text-' + n, opener = document.activeElement, done = false;
      d.className = 'ds-dialog';
      d.setAttribute('data-ds-backdrop-close', ''); // SweetAlert-style: a click outside = cancel (via 'close')
      d.setAttribute('aria-labelledby', tid);
      if (o.text) d.setAttribute('aria-describedby', xid);
      d.innerHTML = '<div class="ds-dialog__body"><h2 class="ds-dialog__title" id="' + tid + '">' + esc(title) + '</h2>' +
        (o.text ? '<p class="ds-dialog__text" id="' + xid + '">' + esc(o.text) + '</p>' : '') +
        '<div class="ds-dialog__actions">' +
        '<button type="button" class="ds-btn ds-btn--ghost" data-ds-act="cancel">' + esc(cancelText) + '</button>' +
        '<button type="button" class="ds-btn' + (o.danger ? ' ds-btn--danger' : '') + '" data-ds-act="ok">' + esc(okText) + '</button>' +
        '</div></div>';
      function finish(ok) {
        if (done) return;
        done = true;
        if (d.open) d.close();
        unstackModal(d);
        rescueLayers(d);
        if (d.parentNode) d.parentNode.removeChild(d);
        if (opener && opener.isConnected && opener.focus) opener.focus();
        resolve(ok);
      }
      d.addEventListener('click', function (e) {
        var b = closest(e.target, '[data-ds-act]');
        if (b && d.contains(b)) { finish(b.getAttribute('data-ds-act') === 'ok'); return; }
        // backdrop click = cancel, resolved here at once (not via the async 'close' event)
        if (e.target === d && e.clientX + e.clientY > 0) {
          var r = d.getBoundingClientRect();
          if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) finish(false);
        }
      });
      d.addEventListener('cancel', function (e) { e.preventDefault(); finish(false); }); // Esc
      d.addEventListener('close', function () { finish(false); });
      document.body.appendChild(d);
      d.showModal();
      stackModal(d);
      var f = d.querySelector(o.danger ? '[data-ds-act="cancel"]' : '[data-ds-act="ok"]');
      if (f) f.focus();
    });
  }
  // [data-ds-confirm] gate: hold the click, ask, then replay it (host handlers + default action run on OK only).
  function confirmFrom(el) {
    confirmDialog({
      title: el.getAttribute('data-ds-confirm-title') || undefined,
      text: el.getAttribute('data-ds-confirm'),
      okText: el.getAttribute('data-ds-confirm-ok') || undefined,
      cancelText: el.getAttribute('data-ds-confirm-cancel') || undefined,
      danger: el.hasAttribute('data-ds-confirm-danger')
    }).then(function (ok) {
      if (!ok || !el.isConnected) return;
      el.__dsPass = true;
      try { el.click(); } finally { el.__dsPass = false; }
    });
  }

  /* =========================================================================================================
   * TABS - .ds-tabs[role=tablist] > [role=tab][aria-controls=panelId]
   * ======================================================================================================= */
  function tabsOf(list) {
    return [].filter.call(list.querySelectorAll('[role="tab"]'), function (t) { return t.closest('[role="tablist"]') === list; });
  }
  function tabEnabled(t) { return !t.disabled && t.getAttribute('aria-disabled') !== 'true'; }
  function panelOf(tab) {
    var id = tab.getAttribute('aria-controls');
    return id ? document.getElementById(id) : null;
  }
  function selectTab(list, tab, focus, silent) {
    if (!tab) return;
    var shown = panelOf(tab); // filter tabs may all point at ONE shared region: never hide the selected panel
    tabsOf(list).forEach(function (t) {
      var on = t === tab, p = panelOf(t);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.setAttribute('tabindex', on ? '0' : '-1');
      if (p) p.hidden = p !== shown;
    });
    if (focus) tab.focus();
    if (!silent) emit(list, 'ds:tabchange', { tab: tab, panel: panelOf(tab) });
  }
  function initTabs(list) {
    var tabs = tabsOf(list);
    if (!tabs.length) return;
    tabs.forEach(function (t) {
      if (!t.id) t.id = 'ds-tab-' + (++uid);
      if (!t.hasAttribute('aria-controls') && t.tagName === 'A') { // <a href="#panel"> -> aria-controls
        var h = (t.getAttribute('href') || '').replace(/^#/, '');
        if (h && document.getElementById(h)) t.setAttribute('aria-controls', h);
      }
      var p = panelOf(t);
      if (p) {
        if (!p.hasAttribute('role')) p.setAttribute('role', 'tabpanel');
        if (!p.hasAttribute('aria-labelledby')) p.setAttribute('aria-labelledby', t.id);
        if (!p.hasAttribute('tabindex')) p.setAttribute('tabindex', '0');
      }
    });
    var sel = tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] ||
      tabs.filter(tabEnabled)[0] || tabs[0];
    selectTab(list, sel, false, true);
  }
  function onTabKey(e, tab) {
    var list = tab.closest('.ds-tabs[role="tablist"]');
    if (!list) return;
    var tabs = tabsOf(list).filter(tabEnabled), n = tabs.length, i = tabs.indexOf(tab), j;
    if (!n) return;
    switch (e.key) {
      case 'ArrowRight': j = (i + 1) % n; break;
      case 'ArrowLeft': j = (i - 1 + n) % n; break;
      case 'Home': j = 0; break;
      case 'End': j = n - 1; break;
      default: return;
    }
    e.preventDefault();
    selectTab(list, tabs[j], true);
  }

  /* =========================================================================================================
   * CLOCK - [data-ds-clock]; date and time always come from the same DS.now() value (original fix #10)
   * ======================================================================================================= */
  var clockTimer = 0;
  function renderClock(el, d) {
    // era: kit default (DS.config.era, 'be' = พ.ศ.); data-ds-clock-ce forces ค.ศ., data-ds-clock-be forces พ.ศ.
    var kind = el.getAttribute('data-ds-clock') || 'time', txt,
      o = el.hasAttribute('data-ds-clock-ce') ? { be: false } : el.hasAttribute('data-ds-clock-be') ? { be: true } : null;
    if (kind === 'date') {
      var head = 'วัน' + TH_DAYS[d.getDay()] + 'ที่ ', body = fmtDateLong(d, o);
      if (el.__dsClock !== head + body) {
        el.__dsClock = head + body;
        el.textContent = head;
        el.appendChild(document.createElement('b')).textContent = body;
      }
    } else {
      txt = kind === 'date-short' ? fmtDate(d, o) : kind === 'year' ? String(yearOf(d, o)) : fmtTime(d) + ' น.';
      if (el.textContent !== txt) el.textContent = txt;
    }
    if (el.tagName === 'TIME') {
      el.setAttribute('datetime', d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
        (kind === 'time' ? 'T' + fmtTime(d) : ''));
    }
  }
  function tickClocks() {
    var list = document.querySelectorAll('[data-ds-clock]');
    if (!list.length) return;
    var d = toDate(DS.now()) || new Date();
    [].forEach.call(list, function (el) { renderClock(el, d); });
  }
  function scheduleClock() { // aligned to the next minute boundary, paused while the tab is hidden
    clearTimeout(clockTimer);
    if (document.hidden) return;
    clockTimer = setTimeout(function () { tickClocks(); scheduleClock(); }, 60050 - Date.now() % 60000);
  }

  /* =========================================================================================================
   * CHARTS - extracted from the original dashboard; identical SVG/HTML output (viewBox 0 0 180 180)
   * ======================================================================================================= */
  var PALETTE = ['--ds-blue', '--ds-sky', '--ds-green', '--ds-yellow', '--ds-orange', '--ds-red', '--ds-purple', '--ds-gray'];

  function colorOf(it, i) {
    var c = it && it.color ? String(it.color).trim() : PALETTE[i % PALETTE.length];
    var m = /^var\(\s*(--[\w-]+)\s*\)$/.exec(c);
    if (m) c = m[1];
    if (!/^--[\w-]+$/.test(c)) { // only custom properties may reach the style/fill attributes
      warnOnce('color:' + c, 'chart color must be a custom property name such as "--ds-blue" (got "' + c + '")');
      c = '--ds-gray';
    }
    return 'var(' + c + ')';
  }
  function normItems(items) {
    return (items || []).map(function (it, i) {
      var v = +(it && it.value);
      return {
        label: it && it.label != null ? String(it.label) : '',
        value: isFinite(v) && v > 0 ? v : 0,
        color: colorOf(it, i),
        tip: it && it.tip != null ? String(it.tip) : null,
        raw: it
      };
    });
  }
  function sumOf(its) { return its.reduce(function (s, it) { return s + it.value; }, 0); }
  function tipOf(it, total, unit) {
    return it.tip != null ? it.tip : it.label + ': ' + fmtNum(it.value) + ' ' + unit + ' (' + fmtPct(it.value, total) + ')';
  }
  function arc(cx, cy, r, a0, a1) { // clockwise from 12 o'clock, same maths as the original
    var p = function (a) { return [cx + r * Math.sin(a), cy - r * Math.cos(a)]; }, s = p(a0), e = p(a1);
    return 'M' + cx + ' ' + cy + 'L' + s[0].toFixed(2) + ' ' + s[1].toFixed(2) + 'A' + r + ' ' + r + ' 0 ' +
      (a1 - a0 > Math.PI ? 1 : 0) + ' 1 ' + e[0].toFixed(2) + ' ' + e[1].toFixed(2) + 'Z';
  }
  function prepSvg(svg) {
    if (svg && !svg.getAttribute('viewBox')) svg.setAttribute('viewBox', '0 0 180 180');
    return svg;
  }

  // Donut ring: R=66, width 30, 2-unit gaps, starts at 12 o'clock; centre = total + label.
  function donut(svgEl, items, o) {
    o = o || {};
    var svg = prepSvg($el(svgEl));
    if (!svg) return;
    var its = normItems(items), n = sumOf(its), R = 66, C = 2 * Math.PI * R, off = 0, s = '';
    var unit = o.unit || 'รายการ';
    if (!n) s = '<circle cx="90" cy="90" r="66" fill="none" stroke="var(--ds-track)" stroke-width="30"/>';
    its.forEach(function (it) {
      var c = it.value;
      if (!c || !n) return;
      var len = c / n * C;
      s += '<circle class="ds-seg" data-ds-tip="' + esc(tipOf(it, n, unit)) + '" cx="90" cy="90" r="' + R +
        '" fill="none" stroke="' + it.color + '" stroke-width="30" stroke-dasharray="' + Math.max(len - 2, 0.5) +
        ' ' + C + '" stroke-dashoffset="' + (-off) + '" transform="rotate(-90 90 90)"/>';
      off += len;
    });
    s += '<text x="90" y="90" text-anchor="middle" font-size="27" font-weight="500" fill="var(--ds-ink)">' +
      esc(o.center != null ? o.center : fmtNum(n)) + '</text>' +
      '<text x="90" y="110" text-anchor="middle" font-size="13" fill="var(--ds-ink-2)">' +
      esc(o.centerLabel != null ? o.centerLabel : 'รายการ') + '</text>';
    svg.innerHTML = s;
    if (o.legend) legend(o.legend, items, { format: o.legendFormat || 'count-pct', chart: svg });
    return svg;
  }

  // Pie: r=84, slices separated by a 2px surface-coloured stroke. One non-zero slice -> full circle.
  function pie(svgEl, items, o) {
    o = o || {};
    var svg = prepSvg($el(svgEl));
    if (!svg) return;
    var its = normItems(items), n = sumOf(its), a = 0, s = '', unit = o.unit || 'ใบ';
    var nz = its.filter(function (it) { return it.value > 0; });
    if (!n) {
      s = '<circle cx="90" cy="90" r="84" fill="var(--ds-track)"/>';
    } else if (nz.length === 1) {
      s = '<circle class="ds-seg" data-ds-tip="' + esc(tipOf(nz[0], n, unit)) + '" cx="90" cy="90" r="84" fill="' +
        nz[0].color + '" stroke="var(--ds-surface)" stroke-width="2"/>';
    } else {
      its.forEach(function (it) {
        if (!it.value) return;
        var a1 = a + it.value / n * 2 * Math.PI;
        s += '<path class="ds-seg" data-ds-tip="' + esc(tipOf(it, n, unit)) + '" d="' + arc(90, 90, 84, a, a1) +
          '" fill="' + it.color + '" stroke="var(--ds-surface)" stroke-width="2" stroke-linejoin="round"/>';
        a = a1;
      });
    }
    svg.innerHTML = s;
    if (o.legend) legend(o.legend, items, { format: o.legendFormat || 'pct', chart: svg });
    return svg;
  }

  // Horizontal bars (el should be .ds-bars): widths are relative to the largest value, % to the total.
  function bars(el, items, o) {
    o = o || {};
    el = $el(el);
    if (!el) return;
    var its = normItems(items), n = o.total != null ? +o.total : sumOf(its), unit = o.unit || 'ใบ';
    var mx = Math.max.apply(null, its.map(function (it) { return it.value; }).concat([1]));
    if (!its.length) {
      el.innerHTML = '<div class="ds-empty"><div class="ds-empty__text">' + esc(o.emptyText || 'ไม่มีข้อมูล') + '</div></div>';
      return el;
    }
    el.innerHTML = its.map(function (it) {
      return '<div class="ds-bar" data-ds-tip="' + esc(tipOf(it, n, unit)) + '"><span class="ds-bar__label">' + esc(it.label) +
        '</span><div class="ds-bar__track"><i class="ds-bar__fill" style="width:' + (it.value / mx * 100) + '%;background:' +
        it.color + '"></i></div><b class="ds-bar__value ds-num">' + esc(fmtNum(it.value)) + '</b></div>';
    }).join('');
    return el;
  }

  // Legend rows. format: 'count-pct' -> "18 (14.1%)" (donut), 'pct' -> "28%" (pie), 'count' -> "18", or a function.
  function legend(ulEl, items, o) {
    o = o || {};
    var ul = $el(ulEl);
    if (!ul) return;
    var its = normItems(items), n = o.total != null ? +o.total : sumOf(its), fmt = o.format || 'count-pct';
    ul.innerHTML = its.map(function (it, i) {
      var v = typeof fmt === 'function' ? fmt(it.value, n, it.raw, i)
        : fmt === 'pct' ? (n ? Math.round(it.value * 100 / n) : 0) + '%'
          : fmt === 'count' ? fmtNum(it.value)
            : fmtNum(it.value) + ' (' + fmtPct(it.value, n) + ')';
      return '<li><i class="ds-legend__dot" style="background:' + it.color + '" aria-hidden="true"></i>' +
        '<span class="ds-legend__label">' + esc(it.label) + '</span><b class="ds-legend__value ds-num">' + esc(v) + '</b></li>';
    }).join('');
    var chart = $el(o.chart);
    if (chart) {
      if (!ul.id) ul.id = 'ds-legend-' + (++uid);
      chart.setAttribute('aria-describedby', ul.id);
    }
    return ul;
  }

  /* =========================================================================================================
   * DELEGATED EVENTS - attached once, immediately; each branch reacts only to its own data-ds-* hook
   * ======================================================================================================= */
  function onCaptureClick(e) {
    var t = e.target;
    // 1) [data-ds-confirm]: hold the click until the user confirms (replayed with __dsPass).
    var c = closest(t, '[data-ds-confirm]');
    if (c && !c.__dsPass && !c.disabled) {
      e.preventDefault();
      e.stopImmediatePropagation();
      confirmFrom(c);
      return;
    }
    // 2) Click outside the open sidebar closes it; on the off-canvas overlay the click stops here (no tap-through).
    var sb = document.querySelector('.ds-sidebar.is-open');
    if (!sb || sb.contains(t) || closest(t, '[data-ds-sidebar-toggle],dialog') || (toastEl && toastEl.contains(t))) return;
    var overlay = isOverlay(sb);
    closeSidebar(sb, overlay);
    if (overlay) { e.preventDefault(); e.stopPropagation(); }
  }

  /* SEARCH TOGGLE - [data-ds-search-toggle] (topbar, <=620px): shows the .ds-search as a full-width row */
  function searchFor(btn) {
    var id = btn.getAttribute('aria-controls');
    return (id && document.getElementById(id)) || (btn.closest('.ds-topbar') || document).querySelector('.ds-search');
  }
  function toggleSearch(btn, open) {
    var s = searchFor(btn);
    if (!s) return;
    if (open == null) open = !s.classList.contains('is-open');
    s.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    var input = s.querySelector('input,select,textarea');
    if (open && input) input.focus();
    else if (!open && s.contains(document.activeElement)) btn.focus();
  }

  /* FILTERS TOGGLE - [data-ds-filters-toggle] (<=620px): opens the .ds-filters__more fields
     of the .ds-filters--collapsible named by aria-controls (or the closest one) */
  function toggleFilters(btn) {
    var id = btn.getAttribute('aria-controls');
    var f = (id && document.getElementById(id)) || btn.closest('.ds-filters');
    if (!f) return;
    var open = !f.classList.contains('is-open');
    f.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function onClick(e) {
    var t = e.target, el;
    // an activated .ds-menu__item closes its dropdown; the item's own hook (data-ds-open, ...) still runs below
    if (dd && (el = closest(t, '.ds-menu__item')) && dd.panel.contains(el) && !el.disabled &&
      el.getAttribute('aria-disabled') !== 'true') {
      closeDropdown(dd.panel.contains(document.activeElement) || e.detail === 0);
    }
    if ((el = closest(t, '[data-ds-dropdown]'))) {
      if (el.tagName === 'A') e.preventDefault();
      toggleDropdown(el, e.detail === 0 ? 'first' : null); // detail 0 = Enter/Space (keyboard)
      return;
    }
    if ((el = closest(t, '[data-ds-notif-readall]'))) { notifReadAll(el); return; }
    if ((el = closest(t, '[data-ds-back]'))) {
      if (el.tagName === 'A' && (e.ctrlKey || e.metaKey || e.shiftKey || e.button)) return; // new tab / window
      e.preventDefault();
      goBack(el);
      return;
    }
    if ((el = closest(t, '[data-ds-print]'))) { e.preventDefault(); hideTip(); window.print(); return; }
    if ((el = closest(t, '.ds-nav__toggle'))) {
      if (el.tagName === 'A') e.preventDefault();
      onNavToggle(el);
      return;
    }
    if ((el = closest(t, '[data-ds-theme-toggle]'))) { themeToggle(); return; }
    if ((el = closest(t, '[data-ds-search-toggle]'))) { toggleSearch(el); return; }
    if ((el = closest(t, '[data-ds-filters-toggle]'))) { toggleFilters(el); return; }
    if ((el = closest(t, '[data-ds-sidebar-toggle]'))) {
      if (el.tagName === 'A') e.preventDefault();
      toggleSidebar(sidebarFor(el), el);
      return;
    }
    if ((el = closest(t, '[data-ds-sidebar-close]'))) {
      if (el.tagName === 'A') e.preventDefault();
      closeSidebar(el.closest('.ds-sidebar') || document.querySelector('.ds-sidebar.is-open'), true);
      return;
    }
    if ((el = closest(t, '[data-ds-open]'))) {
      e.preventDefault();
      openDialog(el.getAttribute('data-ds-open'), ddOwner(el) || el); // from a dropdown: focus returns to its trigger
      return;
    }
    if ((el = closest(t, '[data-ds-close]'))) {
      var d = el.closest('dialog');
      if (d) { e.preventDefault(); closeDialog(d, el.getAttribute('data-ds-close') || undefined); }
      return;
    }
    if ((el = closest(t, '[role="tab"]'))) {
      var list = el.closest('.ds-tabs[role="tablist"]');
      if (list && tabEnabled(el)) {
        if (el.tagName === 'A' && el.getAttribute('aria-controls')) e.preventDefault();
        selectTab(list, el, false);
      }
      return;
    }
    if (t && t.tagName === 'DIALOG' && t.open && t.hasAttribute('data-ds-backdrop-close') && e.clientX + e.clientY > 0) {
      var r = t.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeDialog(t);
      return;
    }
    // A link inside the open off-canvas sidebar closes it (keeps SPA / Livewire / Turbo navigation tidy).
    var sb = closest(t, '.ds-sidebar.is-open');
    if (sb && closest(t, 'a[href]') && isOverlay(sb)) closeSidebar(sb, false);
  }

  function onKeydown(e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      if (dd) { // an open dropdown closes first (focus back to its trigger), not the dialog around it
        if (dd.btn.closest('dialog')) e.preventDefault();
        closeDropdown(true);
      }
      hideTip();
      if (toastShown()) hideToast(); // the only keyboard way to dismiss a timeout:0 toast
      var so = closest(e.target, '.ds-search.is-open'), sbtn = so && so.id &&
        document.querySelector('[data-ds-search-toggle][aria-controls="' + so.id + '"]');
      if (sbtn && sbtn.offsetParent) toggleSearch(sbtn, false); // compact (<=620px) search row closes on Esc
      var sb = document.querySelector('.ds-sidebar.is-open');
      if (sb && isOverlay(sb) && !modalOpen()) closeSidebar(sb, true);
      return;
    }
    if (onDropdownKey(e)) return;
    var tab = closest(e.target, '[role="tab"]');
    if (tab) onTabKey(e, tab);
  }

  var resizeRaf = 0;
  function onResize() {
    if (resizeRaf) return;
    resizeRaf = requestAnimationFrame(function () { resizeRaf = 0; hideTip(); syncAllSidebars(); });
  }

  document.addEventListener('click', onCaptureClick, true);
  document.addEventListener('click', onClick);
  document.addEventListener('keydown', onKeydown);
  document.addEventListener('mousemove', onMouseMove, { passive: true });
  document.addEventListener('mouseout', onMouseOut, { passive: true });
  document.addEventListener('focusin', onFocusIn);
  document.addEventListener('focusout', onFocusOut);
  document.addEventListener('scroll', hideTip, { capture: true, passive: true });
  document.addEventListener('close', onDialogClose, true);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) tickClocks();
    scheduleClock();
  });
  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('load', syncAllSidebars);
  // first-load animations (charts, KPI cascade) only run while html lacks .ds-ready
  window.addEventListener('load', function () { setTimeout(function () { root.classList.add('ds-ready'); }, 1200); });

  /* =========================================================================================================
   * THAI DATE PICKER - automatic for input[type=date].ds-input (opt-out: data-ds-native) and input[data-ds-datepicker]
   * The original input stays in the form, visually hidden, with its id/name/ISO value (ค.ศ. 'YYYY-MM-DD'): it is
   * the single source of truth for servers and page scripts. A text field shows dd/mm/พ.ศ.; a popup calendar
   * shows Thai month names, weekdays อา–ส and Buddhist-Era years.
   * ======================================================================================================= */
  var TH_DOW = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
  var DATE_SEL = 'input[type="date"].ds-input:not([data-ds-native]),input[data-ds-datepicker]:not([data-ds-native])';
  var valueDesc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
  var dp = null; // open picker: {panel, input, sel, focus, today}

  function rawVal(inp) { return valueDesc.get.call(inp); }
  function isoDate(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function dayOnly(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function sameDay(a, b) {
    return !!(a && b) && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }
  // 'YYYY-MM-DD' or 'd/m/yyyy' (also '.' or '-'); years > 2400 are พ.ศ.; 2-digit years follow the era (68 -> 2568)
  function parseDate(s, o) {
    if (s instanceof Date) return toDate(s);
    s = String(s == null ? '' : s).trim();
    if (!s) return null;
    var m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s), y, mo, d;
    if (m) { y = +m[1]; mo = +m[2]; d = +m[3]; } else {
      m = /^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2}|\d{4})$/.exec(s);
      if (!m) return null;
      d = +m[1]; mo = +m[2]; y = +m[3];
      if (y < 100) y += isBE(o) ? 2500 : 2000;
    }
    if (y > 2400) y -= 543;
    var r = new Date(y, mo - 1, d);
    return r.getFullYear() === y && r.getMonth() === mo - 1 && r.getDate() === d ? r : null;
  }
  function eraOf(inp) { var e = inp.getAttribute('data-ds-era'); return e ? e !== 'ce' : isBE(null); }
  function limits(inp) { return { min: parseDate(inp.getAttribute('min')), max: parseDate(inp.getAttribute('max')) }; }
  function inRange(d, lim) { return !((lim.min && d < lim.min) || (lim.max && d > lim.max)); }

  function syncDate(inp) {
    var st = inp.__dsDate;
    if (!st) return;
    var d = parseDate(rawVal(inp));
    st.vis.value = d ? fmtDate(d, { be: eraOf(inp) }) : '';
    st.vis.disabled = inp.disabled;
    st.vis.readOnly = inp.readOnly;
    st.vis.required = inp.required;
    st.btn.disabled = inp.disabled || inp.readOnly;
    ['aria-invalid', 'aria-describedby', 'aria-required'].forEach(function (a) {
      var v = inp.getAttribute(a);
      if (a === 'aria-invalid' && st.bad) v = 'true';
      if (v == null) st.vis.removeAttribute(a); else st.vis.setAttribute(a, v);
    });
  }
  function commitDate(inp, d) {
    var st = inp.__dsDate, v = d ? isoDate(d) : '';
    if (st) st.bad = false;
    if (rawVal(inp) !== v) {
      valueDesc.set.call(inp, v);
      syncDate(inp);
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      inp.dispatchEvent(new Event('change', { bubbles: true }));
    } else syncDate(inp);
  }
  // typed text -> value; invalid / out of range text stays visible and is flagged aria-invalid
  function commitTyped(inp) {
    var st = inp.__dsDate, txt = st.vis.value.trim();
    if (!txt) { commitDate(inp, null); return true; }
    var d = parseDate(txt, { be: eraOf(inp) });
    if (d && inRange(d, limits(inp))) { commitDate(inp, d); return true; }
    st.bad = true;
    st.vis.setAttribute('aria-invalid', 'true');
    return false;
  }

  function enhanceDate(inp) {
    if (inp.__dsDate || inp.type === 'hidden' || !inp.parentNode) return;
    var be = eraOf(inp);
    var wrap = mk('div', 'ds-date');
    var vis = mk('input', 'ds-input ds-date__input', {
      type: 'text', inputmode: 'numeric', autocomplete: 'off', spellcheck: 'false',
      placeholder: inp.getAttribute('placeholder') || (be ? 'วว/ดด/ปปปป (พ.ศ.)' : 'dd/mm/yyyy')
    });
    vis.id = inp.id ? inp.id + '-ds' : 'ds-date-' + (++uid);
    [].forEach.call(inp.classList, function (c) { if (c !== 'ds-input') vis.classList.add(c); });
    var btn = mk('button', 'ds-date__btn', { type: 'button', 'aria-haspopup': 'dialog', 'aria-expanded': 'false', 'aria-label': 'เปิดปฏิทิน' });
    btn.innerHTML = icon('cal');
    inp.parentNode.insertBefore(wrap, inp);
    wrap.appendChild(vis);
    wrap.appendChild(btn);
    wrap.appendChild(inp);
    inp.classList.add('ds-date__native');
    inp.tabIndex = -1;
    inp.setAttribute('aria-hidden', 'true');
    if (inp.id) {
      qsa(document, 'label[for]').forEach(function (l) { if (l.htmlFor === inp.id) l.htmlFor = vis.id; });
    }
    inp.__dsDate = { vis: vis, btn: btn, wrap: wrap, bad: false };
    // page scripts / jQuery that set input.value keep the visible field in sync
    try {
      Object.defineProperty(inp, 'value', {
        configurable: true,
        get: function () { return rawVal(this); },
        set: function (v) { valueDesc.set.call(this, v); if (this.__dsDate) this.__dsDate.bad = false; syncDate(this); }
      });
    } catch (e) { /* very old browser: display syncs on the next change */ }
    if (window.MutationObserver) {
      new MutationObserver(function () { syncDate(inp); }).observe(inp, {
        attributes: true, attributeFilter: ['aria-invalid', 'aria-describedby', 'aria-required', 'disabled', 'readonly', 'required', 'min', 'max', 'value']
      });
    }
    // validation scripts / error-summary links that focus the original id land on the visible field
    inp.focus = function (o) { vis.focus(o); };
    inp.addEventListener('focus', function () { setTimeout(function () { vis.focus(); }, 0); });
    vis.addEventListener('click', function () { if (!dp || dp.input !== inp) openDate(inp, false); });
    vis.addEventListener('input', function () {
      if (!dp || dp.input !== inp) return;
      var d = parseDate(vis.value, { be: eraOf(inp) });
      if (d) { dp.focus = d; renderDP(); }
    });
    vis.addEventListener('change', function () { commitTyped(inp); });
    vis.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || (e.altKey && e.key === 'ArrowDown')) { e.preventDefault(); openDate(inp, true); }
      else if (e.key === 'Escape' && dp && dp.input === inp) { e.stopPropagation(); closeDate(); }
      else if (e.key === 'Enter') { commitTyped(inp); closeDate(); } // commit before an implicit form submit
      else if (e.key === 'Tab') closeDate();
    });
    btn.addEventListener('click', function () {
      if (dp && dp.input === inp) { closeDate(); vis.focus(); } else openDate(inp, true);
    });
    syncDate(inp);
  }

  function dpButton(cls, act, label, ic) {
    return '<button type="button" class="ds-icon-btn ' + cls + '" data-dp="' + act + '" aria-label="' + label + '">' + icon(ic) + '</button>';
  }
  function buildPanel() {
    var p = mk('div', 'ds-datepicker', { role: 'dialog', 'aria-modal': 'false', 'aria-label': 'เลือกวันที่' });
    p.id = 'ds-datepicker';
    p.innerHTML =
      '<div class="ds-datepicker__head">' +
        dpButton('ds-datepicker__nav', 'prev', 'เดือนก่อนหน้า', 'chevron-left') +
        '<select class="ds-select ds-select--sm ds-datepicker__month" aria-label="เดือน"></select>' +
        '<select class="ds-select ds-select--sm ds-datepicker__year ds-num" aria-label="ปี"></select>' +
        dpButton('ds-datepicker__nav', 'next', 'เดือนถัดไป', 'chevron-right') +
      '</div>' +
      '<table class="ds-datepicker__grid"><thead><tr>' +
        TH_DOW.map(function (x, i) { return '<th scope="col" abbr="' + TH_DAYS[i] + '">' + x + '</th>'; }).join('') +
      '</tr></thead><tbody></tbody></table>' +
      '<div class="ds-datepicker__foot">' +
        '<button type="button" class="ds-link-btn" data-dp="today">วันนี้</button>' +
        '<button type="button" class="ds-link-btn" data-dp="clear">ล้างค่า</button>' +
      '</div>';
    p.addEventListener('click', onDPClick);
    p.addEventListener('keydown', onDPKey);
    p.addEventListener('change', onDPSelect);
    p.addEventListener('focusout', function (e) {
      var to = e.relatedTarget;
      if (dp && to && !dp.panel.contains(to) && !dp.input.__dsDate.wrap.contains(to)) closeDate();
    });
    return p;
  }
  function renderDP() {
    if (!dp) return;
    var p = dp.panel, inp = dp.input, be = eraOf(inp), f = dp.focus, lim = limits(inp);
    var y = f.getFullYear(), mth = f.getMonth();
    var ms = p.querySelector('.ds-datepicker__month'), ys = p.querySelector('.ds-datepicker__year');
    ms.innerHTML = TH_MONTHS.map(function (n, i) {
      return '<option value="' + i + '"' + (i === mth ? ' selected' : '') + '>' + n + '</option>';
    }).join('');
    var y0 = lim.min ? lim.min.getFullYear() : Math.min(y, dp.today.getFullYear()) - 100;
    var y1 = lim.max ? lim.max.getFullYear() : Math.max(y, dp.today.getFullYear()) + 10;
    var yo = '';
    for (var yy = y1; yy >= y0; yy--) {
      yo += '<option value="' + yy + '"' + (yy === y ? ' selected' : '') + '>' + (be ? yy + 543 : yy) + '</option>';
    }
    ys.innerHTML = yo;
    var first = new Date(y, mth, 1), start = new Date(y, mth, 1 - first.getDay()), rows = '';
    for (var r = 0; r < 6; r++) {
      rows += '<tr>';
      for (var c = 0; c < 7; c++) {
        var d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + r * 7 + c);
        var cls = 'ds-datepicker__day' + (d.getMonth() !== mth ? ' is-outside' : '');
        rows += '<td><button type="button" class="' + cls + '" data-date="' + isoDate(d) + '" tabindex="' +
          (sameDay(d, f) ? '0' : '-1') + '" aria-label="' + esc(fmtDateLong(d, { be: be, weekday: true })) + '"' +
          ' aria-pressed="' + (sameDay(d, dp.sel) ? 'true' : 'false') + '"' +
          (sameDay(d, dp.today) ? ' aria-current="date"' : '') + (inRange(d, lim) ? '' : ' disabled') + '>' +
          d.getDate() + '</button></td>';
      }
      rows += '</tr>';
    }
    p.querySelector('tbody').innerHTML = rows;
    p.querySelector('[data-dp="prev"]').disabled = !!(lim.min && new Date(y, mth, 0) < lim.min);
    p.querySelector('[data-dp="next"]').disabled = !!(lim.max && new Date(y, mth + 1, 1) > lim.max);
    p.querySelector('[data-dp="today"]').disabled = !inRange(dp.today, lim);
  }
  function focusDay() {
    var b = dp && dp.panel.querySelector('.ds-datepicker__day[tabindex="0"]');
    if (b) b.focus();
  }
  function positionDP() {
    if (!dp) return;
    var p = dp.panel, rc = dp.input.__dsDate.wrap.getBoundingClientRect();
    var pw = p.offsetWidth, ph = p.offsetHeight, vw = document.documentElement.clientWidth, vh = window.innerHeight;
    var top = rc.bottom + 4;
    if (top + ph > vh - 8 && rc.top - ph - 4 >= 8) top = rc.top - ph - 4;
    top = Math.max(8, Math.min(top, vh - ph - 8));
    p.style.top = Math.round(top) + 'px';
    p.style.left = Math.round(Math.max(8, Math.min(rc.left, vw - pw - 8))) + 'px';
  }
  function openDate(inp, focusGrid) {
    inp = $el(inp);
    if (inp && !inp.__dsDate && inp.matches && inp.matches('input')) enhanceDate(inp);
    var st = inp && inp.__dsDate;
    if (!st || st.vis.disabled || st.vis.readOnly) return;
    closeDate();
    var today = dayOnly(toDate(DS.now()) || new Date()), lim = limits(inp);
    var sel = parseDate(rawVal(inp));
    var focus = sel || (inRange(today, lim) ? today : (lim.min && today < lim.min ? lim.min : lim.max || today));
    var host = inp.closest('dialog[open]') || document.body; // stay inside a modal's top layer
    dp = { panel: buildPanel(), input: inp, sel: sel, focus: focus, today: today };
    host.appendChild(dp.panel);
    renderDP();
    positionDP();
    st.btn.setAttribute('aria-expanded', 'true');
    st.btn.setAttribute('aria-controls', dp.panel.id);
    document.addEventListener('pointerdown', onDPOutside, true);
    window.addEventListener('resize', positionDP);
    document.addEventListener('scroll', positionDP, true);
    if (focusGrid) focusDay();
  }
  function closeDate() {
    if (!dp) return;
    var st = dp.input.__dsDate;
    if (st) { st.btn.setAttribute('aria-expanded', 'false'); st.btn.removeAttribute('aria-controls'); }
    if (dp.panel.parentNode) dp.panel.parentNode.removeChild(dp.panel);
    document.removeEventListener('pointerdown', onDPOutside, true);
    window.removeEventListener('resize', positionDP);
    document.removeEventListener('scroll', positionDP, true);
    dp = null;
  }
  function pickDay(d) {
    var inp = dp.input;
    commitDate(inp, d);
    closeDate();
    inp.__dsDate.vis.focus();
  }
  function moveFocus(d) {
    var lim = limits(dp.input);
    if (lim.min && d < lim.min) d = lim.min;
    if (lim.max && d > lim.max) d = lim.max;
    dp.focus = d;
    renderDP();
    focusDay();
  }
  function addMonths(d, n) {
    var t = new Date(d.getFullYear(), d.getMonth() + n, 1);
    return new Date(t.getFullYear(), t.getMonth(), Math.min(d.getDate(), new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate()));
  }
  function onDPClick(e) {
    var b = closest(e.target, 'button');
    if (!b || b.disabled || !dp) return;
    if (b.hasAttribute('data-date')) { pickDay(parseDate(b.getAttribute('data-date'))); return; }
    var act = b.getAttribute('data-dp');
    if (act === 'prev' || act === 'next') { dp.focus = addMonths(dp.focus, act === 'prev' ? -1 : 1); renderDP(); }
    else if (act === 'today') pickDay(dp.today);
    else if (act === 'clear') pickDay(null);
  }
  function onDPSelect(e) {
    if (!dp) return;
    var p = dp.panel, m = +p.querySelector('.ds-datepicker__month').value, y = +p.querySelector('.ds-datepicker__year').value;
    var last = new Date(y, m + 1, 0).getDate();
    dp.focus = new Date(y, m, Math.min(dp.focus.getDate(), last));
    renderDP();
    e.target.focus();
  }
  function onDPKey(e) {
    if (!dp) return;
    if (e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault(); e.stopPropagation();
      var vis = dp.input.__dsDate.vis;
      closeDate(); vis.focus();
      return;
    }
    if (!closest(e.target, '.ds-datepicker__day')) return;
    var f = dp.focus, d = null;
    switch (e.key) {
      case 'ArrowLeft': d = new Date(f.getFullYear(), f.getMonth(), f.getDate() - 1); break;
      case 'ArrowRight': d = new Date(f.getFullYear(), f.getMonth(), f.getDate() + 1); break;
      case 'ArrowUp': d = new Date(f.getFullYear(), f.getMonth(), f.getDate() - 7); break;
      case 'ArrowDown': d = new Date(f.getFullYear(), f.getMonth(), f.getDate() + 7); break;
      case 'Home': d = new Date(f.getFullYear(), f.getMonth(), f.getDate() - f.getDay()); break;
      case 'End': d = new Date(f.getFullYear(), f.getMonth(), f.getDate() + 6 - f.getDay()); break;
      case 'PageUp': d = addMonths(f, e.shiftKey ? -12 : -1); break;
      case 'PageDown': d = addMonths(f, e.shiftKey ? 12 : 1); break;
      default: return;
    }
    e.preventDefault();
    moveFocus(d);
  }
  function onDPOutside(e) {
    if (!dp) return;
    var t = e.target;
    if (dp.panel.contains(t) || dp.input.__dsDate.wrap.contains(t)) return;
    closeDate();
  }
  // form.reset() restores the native input; re-sync the visible field afterwards
  document.addEventListener('reset', function (e) {
    var f = e.target;
    setTimeout(function () {
      qsa(f, '.ds-date__native').forEach(function (inp) { if (inp.__dsDate) inp.__dsDate.bad = false; syncDate(inp); });
    }, 0);
    closeDate();
  }, true);

  /* =========================================================================================================
   * COMBOBOX - searchable single select for select[data-ds-combobox] (replaces Select2). Same model as the date
   * picker: the native <select> stays in the form, visually hidden, with its id/name/value and fires input/change;
   * a text input (role=combobox) filters a listbox appended to <body> (or the open <dialog>), fixed under the field.
   * ======================================================================================================= */
  var COMBO_SEL = 'select[data-ds-combobox]';
  var selValueDesc = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
  var selIndexDesc = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'selectedIndex');
  var cb = null; // open list: {sel, list, q (typed text, null = not typed since opening), active (option index), shown}
  var cbSayTimer = 0;

  function selIdx(sel) { return selIndexDesc.get.call(sel); }
  function optText(o) { return String(o.label || o.textContent || '').replace(/\s+/g, ' ').trim(); }
  function normQ(s) { return String(s == null ? '' : s).replace(/\s+/g, ' ').trim().toLowerCase(); }
  function optOff(o) { return !!(o.disabled || (o.parentNode && o.parentNode.tagName === 'OPTGROUP' && o.parentNode.disabled)); }
  function comboLabel(sel) { var o = sel.options[selIdx(sel)]; return o && o.value !== '' ? optText(o) : ''; }

  function syncCombo(sel) {
    var st = sel && sel.__dsCombo;
    if (!st) return;
    var typing = !!(cb && cb.sel === sel && cb.q != null);
    if (!typing) st.vis.value = comboLabel(sel); // never overwrite what the user is typing
    st.vis.disabled = sel.disabled;
    st.btn.disabled = sel.disabled;
    st.vis.required = sel.required;
    ['aria-invalid', 'aria-describedby', 'aria-required', 'aria-label', 'aria-labelledby'].forEach(function (a) {
      var v = sel.getAttribute(a);
      if (v == null) st.vis.removeAttribute(a); else st.vis.setAttribute(a, v);
    });
    if (cb && cb.sel === sel) { if (sel.disabled) closeCombo(); else renderCombo(true); }
  }
  // selects option i on the native select (events only when it changed)
  function commitCombo(sel, i) {
    if (selIdx(sel) !== i) {
      selIndexDesc.set.call(sel, i);
      syncCombo(sel);
      sel.dispatchEvent(new Event('input', { bubbles: true }));
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    } else syncCombo(sel);
  }
  // leaving the field: exact label -> that option, '' -> the value="" option, anything else -> restore (no free text)
  function commitText(sel) {
    var q = normQ(sel.__dsCombo.vis.value), i = selIdx(sel), o = sel.options[i], hit = -1;
    if (o && normQ(comboLabel(sel)) === q) hit = i;
    else {
      [].some.call(sel.options, function (x, k) {
        if (x.hidden || optOff(x) || (q ? normQ(optText(x)) !== q : x.value !== '')) return false;
        hit = k;
        return true;
      });
    }
    if (hit >= 0) commitCombo(sel, hit); else syncCombo(sel);
  }
  // jQuery $(select).val(x) sets option.selected directly (no 'value' setter, no event): re-sync after it
  function hookJq() {
    var $ = window.jQuery, h = $ && $.valHooks && $.valHooks.select;
    if (!h || typeof h.set !== 'function' || h.set.__ds) return;
    var set0 = h.set;
    h.set = function (elem) {
      var r = set0.apply(this, arguments);
      if (elem && elem.__dsCombo) syncCombo(elem);
      return r;
    };
    h.set.__ds = true;
  }

  function enhanceCombo(sel) {
    if (sel.__dsCombo || !sel.parentNode) return;
    if (sel.multiple) { warnOnce('combo-multi', 'data-ds-combobox supports single selects only'); return; }
    var base = sel.id || 'ds-combo-' + (++uid);
    var wrap = mk('div', 'ds-combo');
    var vis = mk('input', 'ds-input ds-combo__input', {
      type: 'text', role: 'combobox', 'aria-autocomplete': 'list', 'aria-expanded': 'false',
      'aria-controls': base + '-ds-list', autocomplete: 'off', spellcheck: 'false',
      placeholder: sel.getAttribute('data-ds-placeholder') || 'พิมพ์เพื่อค้นหา…'
    });
    vis.id = base + '-ds';
    [].forEach.call(sel.classList, function (c) { // ds-select--sm -> ds-input--sm; host classes (is-invalid, ...) kept
      if (c !== 'ds-select') vis.classList.add(c.indexOf('ds-select--') === 0 ? 'ds-input--' + c.slice(11) : c);
    });
    var btn = mk('button', 'ds-combo__btn', { type: 'button', tabindex: '-1', 'aria-label': 'แสดงตัวเลือก' });
    btn.innerHTML = icon('chevron-down');
    sel.parentNode.insertBefore(wrap, sel);
    wrap.appendChild(vis);
    wrap.appendChild(btn);
    wrap.appendChild(sel);
    sel.classList.add('ds-combo__native');
    sel.tabIndex = -1;
    sel.setAttribute('aria-hidden', 'true');
    if (sel.id) {
      qsa(document, 'label[for]').forEach(function (l) { if (l.htmlFor === sel.id) l.htmlFor = vis.id; });
    }
    sel.__dsCombo = { vis: vis, btn: btn, wrap: wrap, base: base };
    hookJq();
    // page scripts / jQuery that set select.value or selectedIndex keep the visible text in sync
    try {
      Object.defineProperty(sel, 'value', {
        configurable: true,
        get: function () { return selValueDesc.get.call(this); },
        set: function (v) { selValueDesc.set.call(this, v); syncCombo(this); }
      });
      Object.defineProperty(sel, 'selectedIndex', {
        configurable: true,
        get: function () { return selIndexDesc.get.call(this); },
        set: function (v) { selIndexDesc.set.call(this, v); syncCombo(this); }
      });
    } catch (e) { /* very old browser: the 'change' listener still syncs */ }
    sel.addEventListener('change', function () { syncCombo(sel); });
    if (window.MutationObserver) { // options reloaded (AJAX, dependent selects), state attributes changed
      new MutationObserver(function () { syncCombo(sel); }).observe(sel, {
        childList: true, subtree: true, characterData: true, attributes: true,
        attributeFilter: ['disabled', 'required', 'aria-invalid', 'aria-describedby', 'aria-required', 'aria-label',
          'aria-labelledby', 'selected', 'label', 'hidden']
      });
    }
    // validation scripts / error-summary links that focus the original id land on the visible field
    sel.focus = function (o) { vis.focus(o); };
    sel.addEventListener('focus', function () { setTimeout(function () { vis.focus(); }, 0); });
    vis.addEventListener('click', function () { if (!cb || cb.sel !== sel) openCombo(sel); });
    vis.addEventListener('input', function () {
      if (!cb || cb.sel !== sel) { openCombo(sel, vis.value); return; }
      cb.q = vis.value;
      renderCombo(false);
      positionCombo();
    });
    vis.addEventListener('keydown', function (e) { onComboKey(e, sel); });
    vis.addEventListener('blur', function () { if (cb && cb.sel === sel) closeCombo(); commitText(sel); });
    btn.addEventListener('mousedown', function (e) { e.preventDefault(); }); // keep focus in the field
    btn.addEventListener('click', function () {
      if (cb && cb.sel === sel) { closeCombo(); syncCombo(sel); } else { vis.focus(); openCombo(sel); }
    });
    syncCombo(sel);
  }

  // q = typed text (opened by typing) or undefined (click / arrow / button: full list, the label gets selected)
  function openCombo(sel, q) {
    var st = sel && sel.__dsCombo;
    if (!st || sel.disabled || (cb && cb.sel === sel)) return;
    closeCombo();
    hookJq();
    if (q == null) { syncCombo(sel); try { st.vis.select(); } catch (e) { /* not focusable yet */ } }
    var list = mk('ul', 'ds-combo__list', { id: st.base + '-ds-list', role: 'listbox' });
    var lab = st.vis.labels && st.vis.labels[0];
    if (lab && !st.vis.hasAttribute('aria-labelledby')) { // label text without aria-hidden parts (the required "*")
      lab = lab.cloneNode(true);
      qsa(lab, '[aria-hidden="true"]').forEach(function (n) { n.parentNode.removeChild(n); });
      list.setAttribute('aria-label', lab.textContent.replace(/\s+/g, ' ').trim());
    }
    list.addEventListener('mousedown', function (e) { e.preventDefault(); }); // the field keeps focus
    list.addEventListener('click', onComboClick);
    list.addEventListener('mousemove', onComboHover);
    cb = { sel: sel, list: list, q: q == null ? null : String(q), active: -1, shown: [] };
    (sel.closest('dialog[open]') || document.body).appendChild(list); // stay inside a modal's top layer
    renderCombo(false);
    positionCombo();
    st.vis.setAttribute('aria-expanded', 'true');
    document.addEventListener('pointerdown', onComboOutside, true);
    window.addEventListener('resize', positionCombo);
    document.addEventListener('scroll', positionCombo, true);
  }
  // the text is NOT restored here: callers sync (Esc, button) or commitText (blur) afterwards
  function closeCombo() {
    if (!cb) return;
    var c = cb, vis = c.sel.__dsCombo.vis;
    cb = null;
    clearTimeout(cbSayTimer);
    vis.setAttribute('aria-expanded', 'false');
    vis.removeAttribute('aria-activedescendant');
    if (c.list.parentNode) c.list.parentNode.removeChild(c.list);
    document.removeEventListener('pointerdown', onComboOutside, true);
    window.removeEventListener('resize', positionCombo);
    document.removeEventListener('scroll', positionCombo, true);
  }
  // keep = keep the current active option when it is still listed (re-render after an option/attribute change)
  function renderCombo(keep) {
    if (!cb) return;
    var sel = cb.sel, base = esc(sel.__dsCombo.base), q = normQ(cb.q), cur = selIdx(sel), html = '', shown = [], group = null;
    [].forEach.call(sel.options, function (o, i) {
      if (o.hidden) return;
      var txt = optText(o), at = q ? txt.toLowerCase().indexOf(q) : 0;
      if (at < 0) return;
      var g = o.parentNode && o.parentNode.tagName === 'OPTGROUP' ? o.parentNode : null;
      if (g && g !== group) html += '<li class="ds-combo__group" role="presentation">' + esc(g.label) + '</li>';
      group = g;
      html += '<li class="ds-combo__option" role="option" id="' + base + '-ds-o' + i + '" data-index="' + i +
        '" data-value="' + esc(o.value) + '" aria-selected="' + (i === cur ? 'true' : 'false') + '"' +
        (optOff(o) ? ' aria-disabled="true"' : '') + '>' +
        (q ? esc(txt.slice(0, at)) + '<mark>' + esc(txt.slice(at, at + q.length)) + '</mark>' + esc(txt.slice(at + q.length)) : esc(txt)) +
        '</li>';
      shown.push(i);
    });
    cb.list.innerHTML = shown.length ? html : '<li class="ds-combo__empty" role="presentation">ไม่พบข้อมูล</li>';
    cb.shown = shown;
    var usable = shown.filter(function (i) { return !optOff(sel.options[i]); }), act = -1;
    if (keep && usable.indexOf(cb.active) >= 0) act = cb.active;
    else if (cb.q == null) act = usable.indexOf(cur) >= 0 ? cur : -1; // opened: the selected option
    else if (q) act = usable.length ? usable[0] : -1;                  // typing: the first match
    setComboActive(act, true);
    if (cb.q != null && !keep) { // screen readers: result count once typing pauses
      clearTimeout(cbSayTimer);
      cbSayTimer = setTimeout(function () { if (cb) announce(usable.length ? 'พบ ' + usable.length + ' รายการ' : 'ไม่พบข้อมูล'); }, 700);
    }
  }
  function setComboActive(i, scroll) {
    if (!cb) return;
    var vis = cb.sel.__dsCombo.vis, L = cb.list, li = i >= 0 ? L.querySelector('[data-index="' + i + '"]') : null;
    cb.active = li ? i : -1;
    [].forEach.call(L.querySelectorAll('.is-active'), function (n) { n.classList.remove('is-active'); });
    if (!li) { vis.removeAttribute('aria-activedescendant'); return; }
    li.classList.add('is-active');
    vis.setAttribute('aria-activedescendant', li.id);
    if (!scroll) return;
    if (li.offsetTop < L.scrollTop) L.scrollTop = li.offsetTop - 4;
    else if (li.offsetTop + li.offsetHeight > L.scrollTop + L.clientHeight) L.scrollTop = li.offsetTop + li.offsetHeight - L.clientHeight + 4;
  }
  // step: +1/-1 (next/previous), +8/-8 (page); disabled options are skipped; stops at both ends
  function moveCombo(step) {
    var sel = cb.sel, us = cb.shown.filter(function (i) { return !optOff(sel.options[i]); });
    if (!us.length) return;
    var k = us.indexOf(cb.active);
    k = k < 0 ? (step > 0 ? 0 : us.length - 1) : Math.max(0, Math.min(us.length - 1, k + step));
    setComboActive(us[k], true);
  }
  function pickCombo(i) {
    var sel = cb.sel;
    closeCombo();
    commitCombo(sel, i);
    if (document.activeElement !== sel.__dsCombo.vis) sel.__dsCombo.vis.focus();
  }
  function onComboKey(e, sel) {
    var open = !!(cb && cb.sel === sel), k = e.key;
    if (k === 'ArrowDown' || k === 'ArrowUp' || k === 'Down' || k === 'Up') {
      var down = k === 'ArrowDown' || k === 'Down';
      e.preventDefault();
      if (open && e.altKey && !down) { closeCombo(); syncCombo(sel); return; }
      if (!open) { openCombo(sel); if (cb && !e.altKey && cb.active < 0) moveCombo(down ? 1 : -1); return; }
      if (!e.altKey) moveCombo(down ? 1 : -1);
    } else if ((k === 'PageDown' || k === 'PageUp') && open) {
      e.preventDefault();
      moveCombo(k === 'PageDown' ? 8 : -8);
    } else if (k === 'Enter') {
      if (!open) return; // closed: Enter submits the form as usual
      e.preventDefault();
      if (cb.active >= 0) pickCombo(cb.active); else { closeCombo(); commitText(sel); }
    } else if (k === 'Escape' || k === 'Esc') {
      if (!open) return; // closed: Esc reaches the dialog / page as usual
      e.preventDefault();
      e.stopPropagation();
      closeCombo();
      syncCombo(sel);
    } else if (k === 'Tab') {
      if (open) closeCombo(); // the blur that follows commits the text
    }
  }
  function onComboClick(e) {
    var li = closest(e.target, '.ds-combo__option');
    if (li && cb && li.getAttribute('aria-disabled') !== 'true') pickCombo(+li.getAttribute('data-index'));
  }
  function onComboHover(e) {
    var li = closest(e.target, '.ds-combo__option');
    if (li && cb && li.getAttribute('aria-disabled') !== 'true' && +li.getAttribute('data-index') !== cb.active) {
      setComboActive(+li.getAttribute('data-index'), false);
    }
  }
  // under the field (above it when there is more room there), as wide as the field, height fitted to the viewport
  function positionCombo() {
    if (!cb) return;
    var L = cb.list, rc = cb.sel.__dsCombo.wrap.getBoundingClientRect();
    var vw = document.documentElement.clientWidth, vh = window.innerHeight;
    var below = vh - rc.bottom - 12, above = rc.top - 12;
    L.style.width = Math.round(Math.min(vw - 16, Math.max(rc.width, 200))) + 'px';
    L.style.maxHeight = '';
    var need = Math.min(L.scrollHeight + 2, 280), up = need > below && above > below;
    if (need > (up ? above : below)) L.style.maxHeight = Math.max(120, Math.floor(up ? above : below)) + 'px';
    var lw = L.offsetWidth, lh = L.offsetHeight;
    L.style.top = Math.round(up ? rc.top - lh - 4 : rc.bottom + 4) + 'px';
    L.style.left = Math.round(Math.max(8, Math.min(rc.left, vw - lw - 8))) + 'px';
  }
  function onComboOutside(e) {
    if (!cb) return;
    var t = e.target;
    if (cb.list.contains(t) || cb.sel.__dsCombo.wrap.contains(t)) return;
    closeCombo(); // the blur that follows commits the text
  }
  // form.reset() restores the native select; re-sync the visible text afterwards
  document.addEventListener('reset', function (e) {
    var f = e.target;
    closeCombo();
    setTimeout(function () { qsa(f, '.ds-combo__native').forEach(function (s) { syncCombo(s); }); }, 0);
  }, true);

  /* =========================================================================================================
   * INIT - idempotent; runs on DOMContentLoaded (or at once when included late) and for added nodes
   * ======================================================================================================= */
  var INIT_SEL = '.ds-tabs[role="tablist"],dialog,[data-ds-clock],[data-ds-theme-toggle],.ds-sidebar,' + DATE_SEL +
    ',[data-ds-dropdown],.ds-nav__toggle,[data-ds-back],[data-ds-print],' + COMBO_SEL;
  var started = false;

  function initIn(scope) {
    var now = null;
    qsa(scope, INIT_SEL).forEach(function (el) {
      try {
        if (el.matches('.ds-tabs[role="tablist"]')) initTabs(el);
        if (el.tagName === 'DIALOG') labelDialog(el);
        if (el.hasAttribute('data-ds-clock')) renderClock(el, now || (now = toDate(DS.now()) || new Date()));
        if (el.hasAttribute('data-ds-theme-toggle')) syncThemeToggles(el);
        if (el.classList.contains('ds-sidebar')) syncSidebar(el);
        if (el.tagName === 'INPUT' && el.matches(DATE_SEL)) enhanceDate(el);
        if (el.hasAttribute('data-ds-dropdown')) initDropdown(el);
        if (el.classList.contains('ds-nav__toggle')) initNavGroup(el);
        if (el.hasAttribute('data-ds-back')) initBack(el);
        if (el.hasAttribute('data-ds-print') && typeof window.print !== 'function') el.hidden = true;
        if (el.tagName === 'SELECT' && el.matches(COMBO_SEL)) enhanceCombo(el);
      } catch (err) { warnOnce('init:' + err.message, 'init failed: ' + err.message); }
    });
  }
  function init(scope) {
    if (!document.body) { ready(function () { init(scope); }); return; }
    injectSprite();
    ensureLive();
    var s = !scope || scope === document ? root : $el(scope);
    if (s) initIn(s);
    if (!started) {
      started = true;
      scheduleClock();
      observe();
    }
  }
  // Content added later (AJAX, DataTables, Alpine, Livewire, Turbo): normalised in the observer microtask,
  // i.e. after the script that inserted it and before the next paint (also in background tabs).
  function observe() {
    if (!window.MutationObserver) return;
    new MutationObserver(function (recs) {
      var q = [];
      for (var i = 0; i < recs.length; i++) {
        var added = recs[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          if (added[j].nodeType === 1 && added[j] !== toastEl && added[j] !== tipEl) q.push(added[j]);
        }
      }
      if (!q.length) return;
      if (!document.getElementById('ds-sprite')) injectSprite(); // e.g. Turbo swapped <body>
      ensureLive();
      q.forEach(function (n) {
        if (!n.isConnected) return;
        initIn(n);
        var tl = closest(n.parentElement, '.ds-tabs[role="tablist"]'); // a tab added to an existing tablist
        if (tl) initTabs(tl);
      });
    }).observe(root, { childList: true, subtree: true });
  }

  /* =========================================================================================================
   * PUBLIC API
   * ======================================================================================================= */
  var DS = {
    version: VERSION,
    init: init,
    theme: { get: themeGet, set: themeSet, toggle: themeToggle },
    icon: icon,
    iconNames: Object.freeze(ICON_NAMES.slice()),
    sidebar: {
      open: function (id) { openSidebar(sidebarById(id)); },
      close: function (id) { closeSidebar(sidebarById(id), true); },
      toggle: function (id) { toggleSidebar(sidebarById(id)); },
      isOpen: function (id) { var sb = sidebarById(id); return !!(sb && sb.classList.contains('is-open')); },
      // desktop (>900px): collapse to the icon rail (or hide, DS.config.sidebarCollapse = 'hide'), remembered per browser
      collapse: function () { setCollapsed(true); },
      expand: function () { setCollapsed(false); },
      toggleCollapse: function () { setCollapsed(!collapsedState()); },
      isCollapsed: function () { return !!collapsedState(); }
    },
    dialog: {
      open: function (x) { return openDialog(x); },
      close: function (x, value) { closeDialog(x, value); }
    },
    tabs: {
      // Select a tab from code: DS.tabs.select(tabEl, {focus:false, silent:false}) (silent = no ds:tabchange)
      select: function (tab, o) {
        tab = typeof tab === 'string' ? document.querySelector(tab) : tab;
        var list = tab && tab.closest('.ds-tabs[role="tablist"]');
        if (list) selectTab(list, tab, !!(o && o.focus), !!(o && o.silent));
      }
    },
    toast: toast,
    confirm: confirmDialog,
    charts: { donut: donut, pie: pie, bars: bars, legend: legend },
    config: CONFIG,
    datepicker: {
      enhance: function (x) { var i = $el(x); if (i) enhanceDate(i); },
      open: function (x) { openDate(x, true); },
      close: closeDate
    },
    dropdown: {
      open: function (x) { openDropdown(x, null); },
      close: function () { closeDropdown(!!(dd && dd.panel.contains(document.activeElement))); },
      toggle: function (x) { toggleDropdown(x, null); }
    },
    combobox: {
      enhance: function (x) {
        var s = $el(x);
        if (!s || s.tagName !== 'SELECT') return;
        if (!s.hasAttribute('data-ds-combobox')) s.setAttribute('data-ds-combobox', '');
        enhanceCombo(s);
      },
      open: function (x) {
        var s = $el(x);
        if (s && s.tagName === 'SELECT' && !s.__dsCombo) DS.combobox.enhance(s);
        if (!s || !s.__dsCombo) return;
        s.__dsCombo.vis.focus();
        openCombo(s);
      },
      close: function () { var s = cb && cb.sel; closeCombo(); if (s) syncCombo(s); },
      sync: function (x) { var s = $el(x); if (s) syncCombo(s); }
    },
    parseDate: parseDate,
    fmtDate: fmtDate,
    fmtDateLong: fmtDateLong,
    fmtTime: fmtTime,
    fmtNum: fmtNum,
    fmtPct: fmtPct,
    esc: esc,
    now: function () { return new Date(); }
  };
  window.DS = DS;

  ready(function () { init(document); });
})(window, document);
