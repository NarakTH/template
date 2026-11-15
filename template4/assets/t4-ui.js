/* =============================================================================
   Template 4 : t4-ui.js  (t4-ui v1.0)  -> window.T4
   Load in <head> WITHOUT defer: the saved theme is applied before first paint.
   -----------------------------------------------------------------------------
   Hooks (no page JS needed):
     data-t4-theme-toggle        button: light <-> dark (localStorage 't4-theme')
     data-t4-menu                button: opens/closes the sidebar drawer (<=900px)
     data-t4-sub                 sidebar button: opens/closes the sub-menu named by aria-controls
                                 (the one holding aria-current="page" opens by itself; open ones
                                 are remembered in localStorage 't4-nav')
     data-t4-combo               on <select>: adds a box to type and search the options
                                 (optgroup = heading; the real select keeps name/value/required)
     data-t4-fit                 on .t4-sheet (A4 paper): shrinks it to fit narrow screens
     data-t4-pop="id"            button: opens/closes pop-over #id (.t4-pop: user menu, notifications)
     data-t4-filters="listId"    group of pills; each pill data-t4-filter="key" ("all" = every row)
     data-t4-search="listId"     input: text search inside the rows of #listId
     data-t4-match="listId"      select: keeps rows whose data-t4-kind contains the selected value
     data-t4-clear="listId"      button: resets pills, search and selects of that list
       rows = elements with data-t4-kind="token token …" inside #listId
       [data-t4-filter-count="listId"] shows the number of visible rows
       [data-t4-empty="listId"] is shown when nothing matches
     data-t4-check-all="tableId" header checkbox; row checkboxes carry data-t4-check
       [data-t4-bulk="tableId"] bar is shown while rows are ticked ([data-t4-bulk-count] inside)
       data-t4-bulk-clear="tableId" unticks every row
     data-t4-validate            <form novalidate>: checks [required], [pattern], type=email
       data-t4-ok="msg"  toast on success   data-t4-next="url"  go there on success
       data-t4-reset     clear the form after success
       [data-t4-summary] (inside the form) lists the errors as links
     data-t4-counter             input/textarea with maxlength: fills .t4-field__count "n/max"
     data-t4-files               input type=file: lists chosen files in .t4-files of the same field
     data-t4-date="YYYY-MM-DD"   .t4-date box: Thai (Buddhist-era) calendar; value = demo "today" (empty = real today)
     data-t4-reveal="inputId"    button: show / hide a password
     data-t4-open="dialogId"     button: opens <dialog class="t4-dialog">; [data-t4-close] closes it
     data-t4-print               button: window.print()
     data-t4-rotate='["a","b"]'  on .t4-hl: rotates the highlighted words
     data-t4-demo="message"      click shows a toast (prototype pages only)
     Ctrl/Cmd + K                focuses the header search
   Icons: <svg class="t4-ic"><use href="#t4-i-NAME"></use></svg>  (T4.icons lists names)
   Charts: T4.chart.line(svg, {labels, series:[{values, color, area}]})
           T4.chart.ring(svg, [{value, color}], {width})
   ========================================================================== */
(function (window, document) {
  'use strict';
  if (window.T4) return;
  var root = document.documentElement;
  var KEY = 't4-theme';
  function each(sel, fn, ctx) { [].forEach.call((ctx || document).querySelectorAll(sel), fn); }
  function byId(id) { return id ? document.getElementById(id) : null; }
  function inside(e, el) { var p = e.composedPath ? e.composedPath() : []; return p.indexOf(el) > -1 || el.contains(e.target); }
  function fire(el, type) { el.dispatchEvent(new Event(type, { bubbles: true })); }

  /* ---------- theme (runs now, in <head>) ---------- */
  try { var saved = localStorage.getItem(KEY); if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved); } catch (e) {}
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function theme() { var a = root.getAttribute('data-theme'); return a || (mq && mq.matches ? 'dark' : 'light'); }
  function setTheme(v) {
    root.setAttribute('data-theme', v);
    try { localStorage.setItem(KEY, v); } catch (e) {}
    syncThemeButtons();
  }
  function syncThemeButtons() {
    var dark = theme() === 'dark';
    each('[data-t4-theme-toggle]', function (b) {
      var u = b.querySelector('use'); if (u) u.setAttribute('href', '#t4-i-' + (dark ? 'moon' : 'sun'));
      b.setAttribute('aria-label', dark ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด');
      b.setAttribute('title', dark ? 'โหมดมืด' : 'โหมดสว่าง');
    });
  }

  /* ---------- icons (single source; injected as a sprite) ---------- */
  var COG = 'M10.03 4.66L10.78 2.07L13.22 2.07L13.97 4.66A7.6 7.6 0 0 1 15.8 5.42L18.16 4.12L19.88 5.84L18.58 8.2A7.6 7.6 0 0 1 19.34 10.03L21.93 10.78L21.93 13.22L19.34 13.97A7.6 7.6 0 0 1 18.58 15.8L19.88 18.16L18.16 19.88L15.8 18.58A7.6 7.6 0 0 1 13.97 19.34L13.22 21.93L10.78 21.93L10.03 19.34A7.6 7.6 0 0 1 8.2 18.58L5.84 19.88L4.12 18.16L5.42 15.8A7.6 7.6 0 0 1 4.66 13.97L2.07 13.22L2.07 10.78L4.66 10.03A7.6 7.6 0 0 1 5.42 8.2L4.12 5.84L5.84 4.12L8.2 5.42A7.6 7.6 0 0 1 10.03 4.66z';
  var DOT = function (x) { return 'M' + x + ' 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2z'; };
  var ICONS = {
    home: 'M3 11.5 12 4l9 7.5M5.5 10v10h13V10M9.5 20v-6h5v6',
    plus: 'M12 5v14M5 12h14',
    search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4',
    list: 'M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01',
    file: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6',
    box: 'M12 3 4 7v10l8 4 8-4V7zM4 7l8 4 8-4M12 11v10',
    task: 'M9 3.5h6v3H9zM15 5h3v16H6V5h3M9 14l2 2 4-4',
    cal: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
    chart: 'M4 20h16M7 16v-5M12 16V7M17 16v-8',
    users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c0-3.5 3-5.5 6.5-5.5s6.5 2 6.5 5.5M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14.6c2.2.6 3.5 2.4 3.5 5.4',
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5',
    gear: COG + 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
    bell: 'M6 16v-5a6 6 0 1 1 12 0v5l2 2H4zM10 21h4',
    sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
    moon: 'M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z',
    menu: 'M4 7h16M4 12h16M4 17h16',
    x: 'M6 6l12 12M18 6 6 18',
    'arrow-right': 'M5 12h14M13 6l6 6-6 6',
    'arrow-left': 'M19 12H5M11 6l-6 6 6 6',
    'chev-down': 'M6 9l6 6 6-6',
    wrench: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z',
    check: 'M5 12.5l4.5 4.5L19 7.5',
    clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2',
    alert: 'M12 3 2 20h20zM12 10v4M12 17v.5',
    printer: 'M7 8V3h10v5M5 8h14a2 2 0 0 1 2 2v7h-4v4H7v-4H3v-7a2 2 0 0 1 2-2zM7 14h10',
    scan: 'M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M8 12h8',
    snow: 'M12 2v20M3.5 7l17 10M20.5 7l-17 10M9 3.5l3 2 3-2M9 20.5l3-2 3 2',
    monitor: 'M3 5h18v11H3zM8 21h8M12 16v5',
    laptop: 'M5 6h14v9H5zM2.5 19h19l-2-4h-15z',
    chair: 'M7 3h10v8H7zM5 11h14v3H5zM7 14v7M17 14v7',
    bulb: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z',
    book: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5M8 7h7',
    megaphone: 'M3 10v4h3l7 4V6l-7 4zM16 9a3 3 0 0 1 0 6M18.5 6.5a6.5 6.5 0 0 1 0 11',
    inbox: 'M3 13l3-8h12l3 8v6H3zM3 13h5l1 3h6l1-3h5',
    logout: 'M15 4h4v16h-4M10 8l-4 4 4 4M6 12h11',
    upload: 'M12 16V4M7 9l5-5 5 5M4 16v4h16v-4',
    download: 'M12 4v12M7 11l5 5 5-5M4 20h16',
    eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
    'eye-off': 'M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a9.6 9.6 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2',
    phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
    pin: 'M12 21s-7-6.2-7-12a7 7 0 1 1 14 0c0 5.8-7 12-7 12zM12 6.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z',
    edit: 'M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4',
    trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6',
    filter: 'M3 5h18l-7 8v6l-4 2v-8z',
    image: 'M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6M15.5 8.5h.01',
    message: 'M4 5h16v11H9l-5 4z',
    send: 'M21 3 10 14M21 3l-7 18-4-7-7-4z',
    lock: 'M6 11h12v10H6zM8.5 11V7.5a3.5 3.5 0 0 1 7 0V11',
    mail: 'M3 5h18v14H3zM3 6l9 7 9-7',
    shield: 'M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6zM8.5 12l2.5 2.5 4.5-5',
    help: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.7M12 17v.5',
    refresh: 'M20 11a8 8 0 0 0-14.6-4.5L4 8M4 4v4h4M4 13a8 8 0 0 0 14.6 4.5L20 16M20 20v-4h-4',
    more: DOT(5) + DOT(12) + DOT(19)
  };
  function sprite() {
    if (document.getElementById('t4-sprite') || !document.body) return;
    var s = '<svg xmlns="http://www.w3.org/2000/svg" id="t4-sprite" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">';
    Object.keys(ICONS).forEach(function (n) { s += '<symbol id="t4-i-' + n + '" viewBox="0 0 24 24"><path d="' + ICONS[n] + '"/></symbol>'; });
    document.body.insertAdjacentHTML('afterbegin', s + '</svg>');
  }

  /* ---------- toast ---------- */
  var toastEl, toastT;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 't4-toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.hidden = false;
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.hidden = true; }, 2600);
  }

  /* ---------- sidebar drawer (<=900px) ---------- */
  function side() { return document.querySelector('.t4-side'); }
  function setDrawer(open) {
    var s = side(); if (!s) return;
    s.classList.toggle('is-open', open);
    each('[data-t4-menu]', function (b) { b.setAttribute('aria-expanded', open ? 'true' : 'false'); });
    if (open) { var f = s.querySelector('[aria-current="page"]') || s.querySelector('a,button'); if (f) f.focus(); }
  }

  /* ---------- pop-overs (user menu, notifications) ---------- */
  function closePops(except, back) {
    each('[data-t4-pop][aria-expanded="true"]', function (b) {
      if (b === except) return;
      var p = byId(b.getAttribute('data-t4-pop')); if (p) p.hidden = true;
      b.setAttribute('aria-expanded', 'false'); if (back) b.focus();
    });
  }
  function togglePop(b) {
    var p = byId(b.getAttribute('data-t4-pop')); if (!p) return;
    var open = p.hidden; closePops(b);
    p.hidden = !open; b.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) { var f = p.querySelector('a,button'); if (f) f.focus(); }
  }

  /* ---------- list filters: pills + search + selects ---------- */
  function filterList(id) {
    var list = byId(id); if (!list) return 0;
    var pill = document.querySelector('[data-t4-filters="' + id + '"] [data-t4-filter][aria-pressed="true"]');
    var key = pill ? pill.getAttribute('data-t4-filter') : 'all';
    var qEl = document.querySelector('[data-t4-search="' + id + '"]');
    var q = qEl ? qEl.value.trim().toLowerCase() : '';
    var need = [];
    each('[data-t4-match="' + id + '"]', function (s) { if (s.value) need.push(s.value); });
    if (key !== 'all') need.push(key);
    var shown = 0;
    each('[data-t4-kind]', function (r) {
      var kinds = ' ' + r.getAttribute('data-t4-kind') + ' ';
      var ok = need.every(function (k) { return kinds.indexOf(' ' + k + ' ') > -1; }) &&
        (!q || r.textContent.replace(/\s+/g, ' ').toLowerCase().indexOf(q) > -1);
      r.hidden = !ok; if (ok) shown++;
    }, list);
    each('[data-t4-filter-count="' + id + '"]', function (o) { o.textContent = shown; });
    var empty = document.querySelector('[data-t4-empty="' + id + '"]'); if (empty) empty.hidden = shown > 0;
    return shown;
  }
  function pickPill(pill) {
    var group = pill.closest('[data-t4-filters]'); if (!group) return;
    each('[data-t4-filter]', function (p) { p.setAttribute('aria-pressed', p === pill ? 'true' : 'false'); }, group);
    filterList(group.getAttribute('data-t4-filters'));
  }
  function clearList(id) {
    var all = document.querySelector('[data-t4-filters="' + id + '"] [data-t4-filter="all"]');
    if (all) each('[data-t4-filter]', function (p) { p.setAttribute('aria-pressed', p === all ? 'true' : 'false'); }, all.closest('[data-t4-filters]'));
    each('[data-t4-search="' + id + '"],[data-t4-match="' + id + '"]', function (i) { i.value = ''; if (i.t4combo) i.t4combo.sync(); });
    filterList(id);
  }

  /* ---------- row selection + bulk bar ---------- */
  function syncChecks(id) {
    var t = byId(id); if (!t) return;
    var boxes = [].slice.call(t.querySelectorAll('[data-t4-check]'));
    var on = boxes.filter(function (b) { return b.checked; }).length;
    boxes.forEach(function (b) { var tr = b.closest('tr'); if (tr) tr.classList.toggle('is-selected', b.checked); });
    var all = document.querySelector('[data-t4-check-all="' + id + '"]');
    if (all) { all.checked = on > 0 && on === boxes.length; all.indeterminate = on > 0 && on < boxes.length; }
    var bar = document.querySelector('[data-t4-bulk="' + id + '"]');
    if (bar) { bar.hidden = !on; each('[data-t4-bulk-count]', function (c) { c.textContent = on; }, bar); }
  }

  /* ---------- form validation ---------- */
  function fieldOf(c) { return c.closest('.t4-field') || c.parentNode; }
  function labelOf(f) {
    var l = f.querySelector('.t4-label'); if (!l) return '';
    var c = l.cloneNode(true); each('.t4-req,.t4-opt', function (x) { x.remove(); }, c);
    return c.textContent.trim();
  }
  function msgFor(c, form) {
    var pick = c.tagName === 'SELECT' || c.type === 'radio' || c.type === 'checkbox';
    var empty = c.type === 'radio' ? !form.querySelector('input[name="' + c.name + '"]:checked')
      : c.type === 'checkbox' ? !c.checked : !c.value.trim();
    if (empty) return c.required ? (c.getAttribute('data-t4-msg') || (pick ? 'กรุณาเลือก' : 'กรุณากรอก') + labelOf(fieldOf(c))) : '';
    if (c.checkValidity && !c.checkValidity()) return c.getAttribute('data-t4-msg-format') || 'รูปแบบ' + labelOf(fieldOf(c)) + 'ไม่ถูกต้อง';
    return '';
  }
  function setErr(f, msg, ctrls) {
    var e = f.querySelector('.t4-field__err');
    if (!e && msg) {
      e = document.createElement('p'); e.className = 't4-field__err';
      e.id = (ctrls[0].id || ctrls[0].name || 't4f' + Date.now()) + '-err'; f.appendChild(e);
    }
    if (e) { e.textContent = msg; e.hidden = !msg; }
    ctrls.forEach(function (c) {
      if (c.t4combo) {
        var ci = c.t4combo.input;
        if (msg) {
          ci.setAttribute('aria-invalid', 'true');
          var cd = (ci.getAttribute('aria-describedby') || '').split(' ');
          if (cd.indexOf(e.id) < 0) ci.setAttribute('aria-describedby', cd.concat(e.id).join(' ').trim());
        } else ci.removeAttribute('aria-invalid');
      }
      if (msg) {
        c.setAttribute('aria-invalid', 'true');
        var d = (c.getAttribute('aria-describedby') || '').split(' ');
        if (d.indexOf(e.id) < 0) c.setAttribute('aria-describedby', d.concat(e.id).join(' ').trim());
      } else c.removeAttribute('aria-invalid');
    });
    var g = f.querySelector('.t4-choices,.t4-seg');
    if (g) { if (msg) g.setAttribute('aria-invalid', 'true'); else g.removeAttribute('aria-invalid'); }
  }
  function validate(form, only) {
    var seen = {}, errs = [];
    each('[required],[pattern],input[type="email"]', function (c) {
      if (c.disabled) return;
      var key = c.type === 'radio' ? 'r:' + c.name : (c.id || c.name);
      if (seen[key]) return; seen[key] = 1;
      var f = fieldOf(c); if (only && f !== fieldOf(only)) return;
      var ctrls = c.type === 'radio' ? [].slice.call(form.querySelectorAll('input[name="' + c.name + '"]')) : [c];
      var m = msgFor(c, form); setErr(f, m, ctrls);
      if (m) errs.push({ el: ctrls[0], msg: m });
    }, form);
    return errs;
  }
  function submitForm(form, e) {
    e.preventDefault();
    form.setAttribute('data-t4-checked', '');
    var errs = validate(form), sum = form.querySelector('[data-t4-summary]');
    if (errs.length) {
      if (sum) {
        sum.innerHTML = '<svg class="t4-ic" aria-hidden="true"><use href="#t4-i-alert"></use></svg><div><b>กรุณาตรวจสอบ ' + errs.length + ' รายการ</b><ul>' +
          errs.map(function (x) { return '<li><a href="#' + x.el.id + '" data-t4-goto="' + x.el.id + '">' + x.msg + '</a></li>'; }).join('') + '</ul></div>';
        sum.hidden = false; sum.setAttribute('tabindex', '-1'); sum.focus();
      } else focusable(errs[0].el).focus();
      return;
    }
    if (sum) sum.hidden = true;
    var dlg = form.closest('dialog'); if (dlg && dlg.open) dlg.close();
    var ok = form.getAttribute('data-t4-ok'), next = form.getAttribute('data-t4-next');
    if (form.hasAttribute('data-t4-reset')) {
      form.reset(); form.removeAttribute('data-t4-checked'); syncCombos(form);
      each('[data-t4-counter]', count, form); each('.t4-files', function (l) { l.innerHTML = ''; }, form);
    }
    if (ok) toast(ok);
    if (next) setTimeout(function () { window.location.href = next; }, ok ? 900 : 0);
  }

  /* ---------- counters, file lists ---------- */
  function count(c) {
    var o = fieldOf(c).querySelector('.t4-field__count'); if (!o) return;
    o.textContent = c.value.length + '/' + (c.maxLength > 0 ? c.maxLength : '–');
  }
  function listFiles(inp) {
    var out = fieldOf(inp).querySelector('.t4-files'); if (!out) return;
    out.innerHTML = [].map.call(inp.files || [], function (f) {
      var n = String(f.name).replace(/[<>&"]/g, '');
      return '<li class="t4-file"><svg class="t4-ic t4-ic--sm" aria-hidden="true"><use href="#t4-i-image"></use></svg><span>' + n +
        '</span><small>' + Math.max(1, Math.round(f.size / 1024)) + ' KB</small></li>';
    }).join('');
  }

  /* ---------- Thai (Buddhist-era) date picker ---------- */
  var TH_M = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  var TH_D = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function fmtTh(d) { return pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + (d.getFullYear() + 543); }
  function parseTh(s) {
    var m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec((s || '').trim()); if (!m) return null;
    var y = +m[3]; if (y > 2400) y -= 543;
    var d = new Date(y, +m[2] - 1, +m[1]); return d.getMonth() === +m[2] - 1 ? d : null;
  }
  function same(a, b) { return !!(a && b) && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
  function daysIn(d) { return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); }
  function datePicker(box) {
    var input = box.querySelector('input'), btn = box.querySelector('.t4-date__btn'); if (!input || !btn || box.t4cal) return;
    var iso = box.getAttribute('data-t4-date'), today = iso ? new Date(iso + 'T00:00:00') : new Date();
    if (isNaN(today)) today = new Date(); today.setHours(0, 0, 0, 0);
    var cal = document.createElement('div'); cal.className = 't4-cal'; cal.hidden = true;
    cal.setAttribute('role', 'dialog'); cal.setAttribute('aria-label', 'ปฏิทินเลือกวันที่');
    box.appendChild(cal); box.t4cal = cal;
    var view, focus;
    btn.setAttribute('aria-haspopup', 'dialog'); btn.setAttribute('aria-expanded', 'false');
    function render() {
      var y = view.getFullYear(), m = view.getMonth(), sel = parseTh(input.value);
      var start = new Date(y, m, 1 - new Date(y, m, 1).getDay());
      var h = '<div class="t4-cal__head"><button type="button" class="t4-cal__nav" data-nav="-1" aria-label="เดือนก่อนหน้า">‹</button>' +
        '<span class="t4-cal__title" aria-live="polite">' + TH_M[m] + ' ' + (y + 543) + '</span>' +
        '<button type="button" class="t4-cal__nav" data-nav="1" aria-label="เดือนถัดไป">›</button></div><div class="t4-cal__grid">';
      TH_D.forEach(function (d) { h += '<span class="t4-cal__dow" aria-hidden="true">' + d + '</span>'; });
      for (var i = 0; i < 42; i++) {
        var d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
        h += '<button type="button" class="t4-cal__day' + (d.getMonth() !== m ? ' is-other' : '') + (same(d, today) ? ' is-today' : '') +
          '" data-day="' + d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + '" aria-label="' + d.getDate() + ' ' + TH_M[d.getMonth()] + ' ' + (d.getFullYear() + 543) +
          '" aria-pressed="' + same(d, sel) + '" tabindex="' + (same(d, focus) ? 0 : -1) + '">' + d.getDate() + '</button>';
      }
      cal.innerHTML = h + '</div><div class="t4-cal__foot"><button type="button" data-today>วันนี้</button><button type="button" data-clear>ล้างค่า</button></div>';
    }
    function focusDay() { var b = cal.querySelector('.t4-cal__day[tabindex="0"]'); if (b) b.focus(); }
    function open() {
      focus = parseTh(input.value) || today; view = new Date(focus.getFullYear(), focus.getMonth(), 1);
      render(); cal.hidden = false; btn.setAttribute('aria-expanded', 'true'); focusDay();
    }
    function close(back) { if (cal.hidden) return; cal.hidden = true; btn.setAttribute('aria-expanded', 'false'); if (back) btn.focus(); }
    function moveTo(d) { focus = d; view = new Date(d.getFullYear(), d.getMonth(), 1); render(); focusDay(); }
    function set(v) { input.value = v; close(false); input.focus(); fire(input, 'input'); fire(input, 'change'); }
    btn.addEventListener('click', function () { if (cal.hidden) open(); else close(true); });
    input.addEventListener('keydown', function (e) { if (e.altKey && e.key === 'ArrowDown') { e.preventDefault(); open(); } });
    cal.addEventListener('click', function (e) {
      var t = e.target.closest('button'); if (!t) return;
      if (t.hasAttribute('data-nav')) {
        var n = +t.getAttribute('data-nav'); view = new Date(view.getFullYear(), view.getMonth() + n, 1);
        focus = new Date(view.getFullYear(), view.getMonth(), Math.min(focus.getDate(), daysIn(view)));
        render(); cal.querySelector('[data-nav="' + n + '"]').focus(); return;
      }
      if (t.hasAttribute('data-today')) { set(fmtTh(today)); return; }
      if (t.hasAttribute('data-clear')) { set(''); return; }
      var p = (t.getAttribute('data-day') || '').split('-'); if (p.length === 3) set(fmtTh(new Date(+p[0], +p[1] - 1, +p[2])));
    });
    cal.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(true); return; }
      if (!e.target.classList.contains('t4-cal__day')) return;
      var k = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
      if (k) { e.preventDefault(); moveTo(new Date(focus.getFullYear(), focus.getMonth(), focus.getDate() + k)); return; }
      if (e.key === 'PageUp' || e.key === 'PageDown') {
        e.preventDefault(); var nd = new Date(focus.getFullYear(), focus.getMonth() + (e.key === 'PageUp' ? -1 : 1), 1);
        nd.setDate(Math.min(focus.getDate(), daysIn(nd))); moveTo(nd);
      }
    });
    document.addEventListener('click', function (e) { if (!cal.hidden && !inside(e, box)) close(false); });
  }

  /* ---------- sidebar sub-menus ---------- */
  var NAVKEY = 't4-nav';
  function navSaved() { try { return JSON.parse(localStorage.getItem(NAVKEY)) || []; } catch (e) { return []; } }
  function setSub(btn, open, save) {
    var sub = byId(btn.getAttribute('aria-controls')); if (!sub) return;
    sub.hidden = !open; btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (!save) return;
    var list = navSaved().filter(function (id) { return id !== sub.id; });
    if (open) list.push(sub.id);
    try { localStorage.setItem(NAVKEY, JSON.stringify(list)); } catch (e) {}
  }
  function initSubs() {
    var saved = navSaved();
    each('[data-t4-sub]', function (b) {
      var sub = byId(b.getAttribute('aria-controls')); if (!sub) return;
      setSub(b, !!sub.querySelector('[aria-current="page"]') || saved.indexOf(sub.id) > -1, false);
    });
  }

  /* ---------- searchable select (combobox) ---------- */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]; }); }
  function hit(text, q) {
    var i = q ? text.toLowerCase().indexOf(q) : -1;
    return i < 0 ? esc(text) : esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + q.length)) + '</mark>' + esc(text.slice(i + q.length));
  }
  var comboN = 0;
  function combo(sel) {
    if (sel.t4combo || sel.tagName !== 'SELECT') return;
    var id = sel.id || (sel.id = 't4-combo-' + (++comboN));
    var first = sel.options[0], blank = first && first.value === '' ? first.text : '';
    var wrap = document.createElement('div'); wrap.className = 't4-combo';
    var inp = document.createElement('input');
    inp.type = 'text'; inp.className = 't4-input t4-combo__input'; inp.id = id + '-input'; inp.autocomplete = 'off';
    inp.setAttribute('role', 'combobox'); inp.setAttribute('aria-autocomplete', 'list');
    inp.setAttribute('aria-expanded', 'false'); inp.setAttribute('aria-controls', id + '-list');
    inp.placeholder = blank || 'พิมพ์เพื่อค้นหา…';
    if (sel.disabled) inp.disabled = true;
    if (sel.getAttribute('aria-describedby')) inp.setAttribute('aria-describedby', sel.getAttribute('aria-describedby'));
    var btn = document.createElement('button');
    btn.type = 'button'; btn.className = 't4-combo__btn'; btn.tabIndex = -1; btn.setAttribute('aria-label', 'แสดงตัวเลือกทั้งหมด');
    btn.innerHTML = '<svg class="t4-ic t4-ic--sm" aria-hidden="true"><use href="#t4-i-chev-down"></use></svg>';
    var list = document.createElement('ul');
    list.className = 't4-combo__list'; list.id = id + '-list'; list.setAttribute('role', 'listbox'); list.hidden = true;
    var lab = document.querySelector('label[for="' + id + '"]');
    if (lab) { lab.htmlFor = inp.id; if (!lab.id) lab.id = id + '-label'; list.setAttribute('aria-labelledby', lab.id); }
    else if (sel.getAttribute('aria-label')) inp.setAttribute('aria-label', sel.getAttribute('aria-label'));
    sel.parentNode.insertBefore(wrap, sel);
    wrap.appendChild(sel); wrap.appendChild(inp); wrap.appendChild(btn); wrap.appendChild(list);
    sel.classList.add('t4-combo__native'); sel.tabIndex = -1; sel.setAttribute('aria-hidden', 'true');

    var items = [], shown = [], active = -1;
    function build() {
      items = [];
      [].forEach.call(sel.children, function (ch) {
        if (ch.tagName === 'OPTGROUP') [].forEach.call(ch.children, function (o) { items.push({ o: o, g: ch.label }); });
        else if (ch.value !== '' || !sel.required) items.push({ o: ch, g: '' });
      });
    }
    function sync() { var o = sel.options[sel.selectedIndex]; inp.value = o && o.value !== '' ? o.text : ''; }
    function setActive(i) {
      var old = list.querySelector('.is-active'); if (old) old.classList.remove('is-active');
      active = i; if (i < 0) { inp.removeAttribute('aria-activedescendant'); return; }
      var li = byId(id + '-o' + i); if (!li) return;
      li.classList.add('is-active'); inp.setAttribute('aria-activedescendant', li.id);
      if (!list.hidden) li.scrollIntoView({ block: 'nearest' });
    }
    function render(q) {
      q = (q || '').trim().toLowerCase();
      shown = items.filter(function (it) { return !q || (it.o.text + ' ' + it.g).toLowerCase().indexOf(q) > -1; });
      var h = '', g = null, cur = -1;
      shown.forEach(function (it, i) {
        if (it.g && it.g !== g) { g = it.g; h += '<li class="t4-combo__group" role="presentation">' + esc(g) + '</li>'; }
        var on = it.o.selected && (it.o.value !== '' || !sel.required);
        if (on) cur = i;
        h += '<li class="t4-combo__opt" role="option" id="' + id + '-o' + i + '" data-i="' + i + '" aria-selected="' + on + '"><span>' + hit(it.o.text, q) + '</span></li>';
      });
      list.innerHTML = h || '<li class="t4-combo__none" role="presentation">ไม่พบ “' + esc(q) + '”</li>';
      return shown.length ? (q ? 0 : Math.max(cur, 0)) : -1;
    }
    function open(q) {
      var a = render(q); list.hidden = false; wrap.classList.add('is-open'); inp.setAttribute('aria-expanded', 'true'); setActive(a);
    }
    function close() { list.hidden = true; wrap.classList.remove('is-open'); inp.setAttribute('aria-expanded', 'false'); setActive(-1); }
    function choose(i) {
      var it = shown[i]; if (!it) return;
      var changed = !it.o.selected || sel.value !== it.o.value;
      it.o.selected = true; sync(); close();
      if (changed) fire(sel, 'change');
    }
    function commit() {
      var t = inp.value.trim().toLowerCase();
      if (!t) { if (sel.value !== '') { sel.value = ''; fire(sel, 'change'); } sync(); return; }
      var m = items.filter(function (it) { return it.o.text.toLowerCase() === t; })[0];
      if (m && !m.o.selected) { m.o.selected = true; fire(sel, 'change'); }
      sync();
    }
    inp.addEventListener('input', function () { open(inp.value); });
    inp.addEventListener('click', function () { if (list.hidden) open(''); });
    inp.addEventListener('keydown', function (e) {
      var n = shown.length;
      if (e.key === 'ArrowDown') { e.preventDefault(); if (list.hidden) open(''); else if (n) setActive(Math.min(active + 1, n - 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (!list.hidden && n) setActive(Math.max(active - 1, 0)); }
      else if (e.key === 'Enter') { if (!list.hidden && active > -1) { e.preventDefault(); choose(active); } }
      else if (e.key === 'Escape') { if (!list.hidden) { e.preventDefault(); e.stopPropagation(); close(); sync(); } }
      else if (e.key === 'Tab') { if (!list.hidden) close(); }
    });
    inp.addEventListener('blur', function () { setTimeout(function () { if (document.activeElement !== inp) { close(); commit(); } }, 120); });
    btn.addEventListener('click', function () { if (list.hidden) open(''); else close(); inp.focus(); });
    list.addEventListener('mousedown', function (e) { e.preventDefault(); });
    list.addEventListener('click', function (e) { var li = e.target.closest('[data-i]'); if (li) { choose(+li.getAttribute('data-i')); inp.focus(); } });
    build(); sync();
    sel.t4combo = { input: inp, sync: sync, rebuild: function () { build(); sync(); } };
  }
  function syncCombos(ctx) { each('select.t4-combo__native', function (s) { if (s.t4combo) s.t4combo.sync(); }, ctx); }
  function focusable(el) { return el && el.t4combo ? el.t4combo.input : el; }

  /* ---------- A4 sheet: shrink to fit narrow screens ---------- */
  function fit() {
    each('[data-t4-fit]', function (s) {
      s.style.zoom = '';
      var avail = s.parentNode.clientWidth - 24, w = s.offsetWidth;
      if (w > avail && avail > 0) s.style.zoom = (avail / w).toFixed(3);
    });
  }

  /* ---------- rotating highlight words ---------- */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function rotate(hl) {
    var words; try { words = JSON.parse(hl.getAttribute('data-t4-rotate')); } catch (e) { return; }
    var w = hl.querySelector('.t4-hl__word'); if (!w || !words || words.length < 2 || reduce) return;
    var i = 0;
    setInterval(function () {
      if (document.hidden) return;
      w.classList.add('is-out');
      setTimeout(function () {
        i = (i + 1) % words.length; w.textContent = words[i];
        w.classList.remove('is-out'); w.classList.add('is-in');
        setTimeout(function () { w.classList.remove('is-in'); }, 340);
      }, 220);
    }, 2800);
  }

  /* ---------- charts ---------- */
  var NS = 'http://www.w3.org/2000/svg';
  function el(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function $(x) { return typeof x === 'string' ? document.querySelector(x) : x; }
  // line chart: labels[], series[{values[], color, area}] ; viewBox 600 x 200
  function line(svg, o) {
    svg = $(svg); if (!svg) return;
    var W = 600, H = 200, L = 30, R = 8, T = 10, B = 26, n = o.labels.length;
    var max = o.max || Math.max.apply(null, o.series.reduce(function (a, s) { return a.concat(s.values); }, []));
    max = Math.ceil(max / 4) * 4 || 4;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.setAttribute('preserveAspectRatio', 'none');
    svg.innerHTML = '';
    var x = function (i) { return L + (W - L - R) * i / (n - 1); }, y = function (v) { return T + (H - T - B) * (1 - v / max); };
    for (var g = 0; g <= 4; g++) {
      var gy = y(max * g / 4);
      el('line', { x1: L, x2: W - R, y1: gy, y2: gy, 'class': 't4-chart__grid' }, svg);
      el('text', { x: L - 8, y: gy + 4, 'text-anchor': 'end', 'class': 't4-chart__axis' }, svg).textContent = max * g / 4;
    }
    o.labels.forEach(function (lb, i) {
      if (i % (o.every || 2)) return;
      el('text', { x: x(i), y: H - 6, 'text-anchor': 'middle', 'class': 't4-chart__axis' }, svg).textContent = lb;
    });
    o.series.forEach(function (s) {
      var d = s.values.map(function (v, i) { return (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1); }).join('');
      if (s.area) el('path', { d: d + 'L' + x(n - 1) + ' ' + y(0) + 'L' + x(0) + ' ' + y(0) + 'Z', fill: s.color, 'class': 't4-chart__area' }, svg);
      el('path', { d: d, stroke: s.color, 'class': 't4-chart__line', 'vector-effect': 'non-scaling-stroke' }, svg);
    });
  }
  // ring/donut: items[{value, color}] ; viewBox 150 x 150
  function ring(svg, items, o) {
    svg = $(svg); if (!svg) return;
    o = o || {};
    var r = 60, c = 2 * Math.PI * r, total = items.reduce(function (a, it) { return a + it.value; }, 0) || 1, off = 0;
    svg.setAttribute('viewBox', '0 0 150 150'); svg.innerHTML = '';
    el('circle', { cx: 75, cy: 75, r: r, fill: 'none', stroke: 'var(--t4-grey-soft)', 'stroke-width': o.width || 16 }, svg);
    items.forEach(function (it) {
      var len = it.value / total * c;
      if (len <= 0) return;
      el('circle', { cx: 75, cy: 75, r: r, fill: 'none', stroke: it.color, 'stroke-width': o.width || 16,
        'stroke-dasharray': Math.max(len - 3, .5) + ' ' + c, 'stroke-dashoffset': -off, 'stroke-linecap': 'butt' }, svg);
      off += len;
    });
  }

  /* ---------- events ---------- */
  var HOOKS = '[data-t4-theme-toggle],[data-t4-menu],[data-t4-sub],[data-t4-pop],[data-t4-filter],[data-t4-clear],[data-t4-bulk-clear],' +
    '[data-t4-open],[data-t4-close],[data-t4-reveal],[data-t4-print],[data-t4-goto],[data-t4-demo]';
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest(HOOKS) : null;
    var openPop = document.querySelector('.t4-pop:not([hidden])');
    if (openPop && !inside(e, openPop) && !(t && t.hasAttribute('data-t4-pop'))) closePops();
    if (t) {
      if (t.hasAttribute('data-t4-theme-toggle')) { setTheme(theme() === 'dark' ? 'light' : 'dark'); return; }
      if (t.hasAttribute('data-t4-menu')) { var s = side(); setDrawer(!(s && s.classList.contains('is-open'))); return; }
      if (t.hasAttribute('data-t4-sub')) { setSub(t, t.getAttribute('aria-expanded') !== 'true', true); return; }
      if (t.hasAttribute('data-t4-pop')) { togglePop(t); return; }
      if (t.hasAttribute('data-t4-filter')) { pickPill(t); return; }
      if (t.hasAttribute('data-t4-clear')) { clearList(t.getAttribute('data-t4-clear')); return; }
      if (t.hasAttribute('data-t4-bulk-clear')) {
        var id = t.getAttribute('data-t4-bulk-clear'), tb = byId(id);
        if (tb) each('[data-t4-check]', function (b) { b.checked = false; }, tb); syncChecks(id); return;
      }
      if (t.hasAttribute('data-t4-open')) { var d = byId(t.getAttribute('data-t4-open')); if (d && d.showModal) { e.preventDefault(); d.showModal(); } return; }
      if (t.hasAttribute('data-t4-close')) { var dl = t.closest('dialog'); if (dl) { e.preventDefault(); dl.close(); } return; }
      if (t.hasAttribute('data-t4-reveal')) {
        var inp = byId(t.getAttribute('data-t4-reveal')); if (!inp) return;
        var show = inp.type === 'password'; inp.type = show ? 'text' : 'password';
        t.setAttribute('aria-pressed', show ? 'true' : 'false');
        t.setAttribute('aria-label', show ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน');
        var u = t.querySelector('use'); if (u) u.setAttribute('href', '#t4-i-' + (show ? 'eye-off' : 'eye')); return;
      }
      if (t.hasAttribute('data-t4-print')) { window.print(); return; }
      if (t.hasAttribute('data-t4-goto')) {
        var g = focusable(byId(t.getAttribute('data-t4-goto'))); if (g) { e.preventDefault(); g.focus(); g.scrollIntoView({ block: 'center' }); } return;
      }
      if (t.hasAttribute('data-t4-demo')) { e.preventDefault(); toast(t.getAttribute('data-t4-demo') || 'ตัวอย่างเท่านั้น'); return; }
    }
    var s2 = side();
    if (s2 && s2.classList.contains('is-open') && !inside(e, s2)) setDrawer(false);
  });
  document.addEventListener('input', function (e) {
    var t = e.target;
    if (t.hasAttribute('data-t4-search')) filterList(t.getAttribute('data-t4-search'));
    if (t.hasAttribute('data-t4-counter')) count(t);
    var f = t.form || t.closest('form');
    if (f && f.hasAttribute('data-t4-validate') && f.hasAttribute('data-t4-checked')) validate(f, t);
  });
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.hasAttribute('data-t4-match')) filterList(t.getAttribute('data-t4-match'));
    if (t.hasAttribute('data-t4-check-all')) {
      var id = t.getAttribute('data-t4-check-all'), tb = byId(id);
      if (tb) each('[data-t4-check]', function (b) { if (!b.closest('[hidden]')) b.checked = t.checked; }, tb);
      syncChecks(id);
    }
    if (t.hasAttribute('data-t4-check')) { var tbl = t.closest('table'); if (tbl && tbl.id) syncChecks(tbl.id); }
    if (t.hasAttribute('data-t4-files')) listFiles(t);
    var f = t.form || t.closest('form');
    if (f && f.hasAttribute('data-t4-validate') && f.hasAttribute('data-t4-checked')) validate(f, t);
  });
  document.addEventListener('reset', function (e) { setTimeout(function () { syncCombos(e.target); }, 0); });
  document.addEventListener('submit', function (e) { if (e.target.hasAttribute('data-t4-validate')) submitForm(e.target, e); });
  ['dragenter', 'dragover'].forEach(function (n) {
    document.addEventListener(n, function (e) { var u = e.target.closest && e.target.closest('.t4-upload'); if (u) u.classList.add('is-drag'); });
  });
  ['dragleave', 'drop'].forEach(function (n) {
    document.addEventListener(n, function (e) { var u = e.target.closest && e.target.closest('.t4-upload'); if (u) u.classList.remove('is-drag'); });
  });
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      var q = document.querySelector('.t4-search input');
      if (q && q.offsetParent) { e.preventDefault(); q.focus(); q.select(); }
    }
    if (e.key === 'Escape') {
      if (document.querySelector('.t4-pop:not([hidden])')) { closePops(null, true); return; }
      var s = side(); if (s && s.classList.contains('is-open')) { setDrawer(false); var b = document.querySelector('[data-t4-menu]'); if (b) b.focus(); }
    }
  });
  if (mq && mq.addEventListener) mq.addEventListener('change', syncThemeButtons);

  function init() {
    sprite(); syncThemeButtons();
    each('.t4-hl[data-t4-rotate]', rotate);
    each('[data-t4-date]', datePicker);
    each('select[data-t4-combo]', combo);
    initSubs(); fit();
    window.addEventListener('resize', fit);
    each('[data-t4-counter]', count);
    each('.t4-dialog', function (d) { d.addEventListener('click', function (e) { if (e.target === d) d.close(); }); });
    window.addEventListener('load', function () { setTimeout(function () { root.classList.add('t4-ready'); }, 1400); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  window.T4 = {
    theme: { get: theme, set: setTheme }, toast: toast, chart: { line: line, ring: ring },
    icons: Object.keys(ICONS), drawer: setDrawer, filter: filterList, validate: validate,
    date: { format: fmtTh, parse: parseTh },
    combo: { init: combo, sync: syncCombos }
  };
})(window, document);
