# Template 4 — ชุด UI แบบ "สตูดิโอ" อบอุ่น (t4-ui v1.0)

> **สรุป 3 บรรทัด**
> 1. หน้าตาได้แรงบันดาลใจจาก https://tubhool.com/ (หน้าแรก และหน้า /live-stage/) เมื่อ 15 พ.ย. 2569 — พื้นครีมอุ่น/ดำอมน้ำตาล สีแดงคอรัล กล่องแดงเน้นคำสำคัญ แถบตัวเลขสีเหลือง การ์ดพื้นสีอ่อน ปุ่มที่เลือกอยู่เป็นสีดำ
> 2. แยกจาก Template 1–3 ทั้งหมด: คลาสขึ้นต้น `t4-` ไฟล์หลักคือ `assets/t4-ui.css` + `assets/t4-ui.js` (`window.T4`) ไม่ต้อง build ไม่พึ่ง framework
> 3. ชื่อระบบ (SMMS) ชื่อคน เลขที่ใบแจ้ง และตัวเลขทั้งหมดเป็น **ข้อมูลสมมติ** ชุดเดียวกับ Template 1 และ 3 เพื่อเปิดเทียบกันได้ — ต้องแทนที่ทั้งหมดก่อนใช้งานจริง

---

## 1. ที่มา และสิ่งที่ต่างจากต้นฉบับ

| เรื่อง | ทำอย่างไร |
|---|---|
| สี มุมโค้ง โทนพื้น | อ้างอิงโทนของต้นฉบับ (คอรัล `#e8453c`, ครีม `#f6f5f2`, ดำ `#0b0b0c`, เหลือง `#ffd166`, มุม 18/12px) แล้วปรับให้ผ่าน WCAG AA เช่น ตัวอักษรขาวบนแดงใช้ `--t4-accent-strong` (`#c9372f`) |
| องค์ประกอบเด่น | กล่องแดงเน้นคำที่สลับคำได้, การ์ดขอบเรืองแสงไล่สี, แถบตัวเลขสีเหลือง, การ์ด bento พื้นสีอ่อน, ปุ่มกรองแบบเม็ดยา (ตัวที่เลือกเป็นสีดำ), การ์ดขั้นตอนเลขจางตัวใหญ่ — เขียน CSS ใหม่ทั้งหมด |
| ฟอนต์ | **Anuphan** จาก Google Fonts (ต้นฉบับใช้ฟอนต์เฉพาะของเว็บนั้น จึงไม่นำมาใช้) |
| โลโก้ / ข้อความ / รูป | **ไม่ได้คัดลอก** — โลโก้เป็นรูปเฟืองตัวอย่าง ข้อความเขียนใหม่ทั้งหมดเป็นระบบแจ้งซ่อมสมมติ |
| เพิ่มจากต้นฉบับ | เมนูซ้าย (ต้นฉบับไม่มี) ทำในสไตล์เดียวกัน: ไอคอนในกรอบสี เมนูที่เลือกอยู่เป็นแถบดำ · เมนูย่อย · ตาราง ฟอร์ม ปฏิทินไทย select แบบพิมพ์ค้นหา หน้าต่างยืนยัน · หน้า login/error · เอกสารพิมพ์ A4 · โหมดมืด/สว่าง · รองรับมือถือ |

## 2. ไฟล์

```
template4/
├─ README.md            คู่มือนี้
├─ assets/
│  ├─ t4-ui.css         token + โครงหน้า + คอมโพเนนต์ทั้งหมด (คลาส t4-)
│  └─ t4-ui.js          ไอคอน + พฤติกรรมทั้งหมด (window.T4)
└─ pages/
   ├─ dashboard.html    ภาพรวม: hero + แถบเหลือง + bento + รายการงาน  ← ต้นแบบ app shell
   ├─ list.html         รายการ: สรุปสถานะ + ปุ่มกรอง + ค้นหา + ตาราง + เลือกหลายแถว + เลขหน้า
   ├─ form.html         ฟอร์ม: 3 ส่วนมีเลขกำกับ + ตรวจช่องบังคับ + ปฏิทินไทย + แนบไฟล์
   ├─ detail.html       รายละเอียด: แถบความคืบหน้า + ข้อมูล + ประวัติ + บันทึก + หน้าต่างยืนยัน
   ├─ login.html        เข้าสู่ระบบ (ไม่มีเมนูซ้าย)
   ├─ error.html        404 (ใช้แบบเดียวกันกับ 403 / 500 / 503)
   ├─ print.html        เอกสารพิมพ์ A4 (ใบแจ้งซ่อม / ใบสั่งงาน) พร้อมแถบ "พิมพ์" บนจอ
   └─ starter.html      หน้าเปล่าสำหรับเริ่มหน้าใหม่ (ตัวอย่างเมนูย่อยที่ถูกเลือก)
```

เปิดดูบน IIS เครื่องนี้: `http://localhost/template/template4/pages/dashboard.html`

## 3. การติดตั้งใน `<head>`

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anuphan:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="/template/template4/assets/t4-ui.css">
<script src="/template/template4/assets/t4-ui.js"></script>   <!-- ไม่ใส่ defer: ตั้งโหมดสีก่อนวาดหน้า -->
```

`<body class="t4-body">` เสมอ — สไตล์พื้นฐานทั้งหมดผูกกับคลาสนี้ จึงไม่ไปชนกับ CSS อื่นในระบบเดิม

## 4. โครงหน้า

### 4.1 หน้าหลัง login (ทุกหน้า ยกเว้น login / error)

```html
<body class="t4-body">
<a class="t4-skip" href="#t4-main">ข้ามไปยังเนื้อหา</a>
<header class="t4-header"> … ปุ่มเมนู · แบรนด์ · ค้นหา · ปุ่มหลัก · โหมดสี · แจ้งเตือน · เมนูผู้ใช้ … </header>
<div class="t4-app">
  <aside class="t4-side" id="t4-side" aria-label="เมนูหลัก"> … .t4-nav-item … </aside>
  <main class="t4-main" id="t4-main" tabindex="-1">
    <div class="t4-container"> …เนื้อหา… </div>
    <footer class="t4-footer"> … </footer>
  </main>
</div>
</body>
```

- **ลอก header + sidebar + footer จาก `starter.html` ทั้งก้อน** แล้วทำเป็น layout กลางครั้งเดียว
- เมนูของหน้าปัจจุบันใส่ `aria-current="page"` (หน้าลูก เช่น รายละเอียด ให้ไฮไลต์เมนูแม่)
- เมนูแต่ละอันมีสีกรอบไอคอนของตัวเอง: `t4-tile--rose | gold | green | blue | violet | grey`
- **เมนูย่อย**: เมนูแม่เป็น `<button class="t4-nav-item" data-t4-sub aria-controls="…">` ตามด้วย `<div class="t4-nav-sub" id="…" hidden>` ที่มี `<a class="t4-nav-sub__item">` — ใส่ `aria-current="page"` ที่เมนูย่อยของหน้านั้น แล้วกลุ่มจะเปิดเองและเมนูแม่เป็นตัวหนา (ดู `starter.html`) · เมนูแม่ไม่ใช่ลิงก์ ใช้เปิด/ปิดอย่างเดียว · กลุ่มที่ผู้ใช้เปิดไว้จะจำไว้ข้ามหน้า (localStorage `t4-nav`)
- จอ ≤ 900px เมนูซ้ายกลายเป็นลิ้นชัก เปิดด้วยปุ่ม `data-t4-menu` (Esc หรือคลิกนอกเมนูเพื่อปิด)
- เนื้อหาเริ่มด้วย **หัวหน้า** `.t4-page-head` (breadcrumb + `h1.t4-page-title` + `.t4-page-sub` + `.t4-page-actions`) ยกเว้นแดชบอร์ดใช้ `.t4-hero`
- เน้นคำสำคัญ 1–3 คำในหัวข้อด้วย `<span class="t4-hl">…</span>` (ไม่เกิน 1 ที่ต่อหน้า)

### 4.2 หน้า login — `.t4-auth`
ครึ่งฟอร์มอยู่ก่อนใน HTML (มี `h1` และขึ้นก่อนบนมือถือ) ครึ่งแนะนำระบบถูกย้ายไปซ้ายด้วย CSS บนจอกว้าง

### 4.3 หน้า error — `.t4-error`
header แบบย่อ (แบรนด์ + โหมดสี) + `.t4-error__code` ที่เลขกลางอยู่ในกล่องแดง เปลี่ยนรหัส/ข้อความตามตารางใน comment หัวไฟล์

### 4.4 เอกสารพิมพ์ A4 — `print.html`
`<body class="t4-body t4-print-body">` → `.t4-print-bar` (แสดงบนจอเท่านั้น: กลับ · ชื่อเอกสาร · ปุ่ม `data-t4-print`) → `.t4-sheet-wrap > article.t4-sheet[data-t4-fit]` = กระดาษ 1 แผ่น
- กระดาษเป็นพื้นขาวตัวดำเสมอ แม้ผู้ใช้เปิดโหมดมืด · `@page` = A4 แนวตั้ง ขอบ 12 มม. · สีพิมพ์ออกตามจอ (`print-color-adjust:exact`)
- บนจอเล็ก `data-t4-fit` ย่อกระดาษให้พอดีจอ ตอนพิมพ์ใช้ขนาดจริงเสมอ
- เปิดจากปุ่ม "พิมพ์ใบแจ้งซ่อม" ในหน้ารายละเอียด และปุ่ม "พิมพ์" ในแถบเลือกหลายแถวของหน้ารายการ
- ทดสอบแล้ว: สั่งพิมพ์เป็น PDF ได้ 1 หน้าพอดี ถ้าเพิ่มเนื้อหา ให้สั่งพิมพ์ดูว่ายังไม่ล้นไปหน้า 2 (ส่วน `.t4-doc-sec` จะไม่ถูกตัดกลางหน้า)

## 5. Design tokens (สรุป — ค่าเต็มอยู่ต้น `t4-ui.css`)

| token | สว่าง | มืด | ใช้กับ |
|---|---|---|---|
| `--t4-bg` | `#f6f5f2` | `#0b0b0c` | พื้นหน้า |
| `--t4-surface` / `--t4-surface-2` | `#fff` / `#faf9f7` | `#161413` / `#1d1a19` | การ์ด / ช่องกรอก แถวสลับ |
| `--t4-text` / `--t4-muted` | `#1d1b19` / `#6b665f` | `#f4f1ec` / `#aaa49c` | ตัวอักษร / ตัวอักษรรอง |
| `--t4-accent` | `#e8453c` | เดิม | กล่องเน้นคำ ไอคอน เส้นกราฟ |
| `--t4-accent-strong` | `#c9372f` | เดิม | **พื้นปุ่มหลัก** (ตัวอักษรขาวผ่าน AA) |
| `--t4-accent-ink` | `#b02d25` | `#ff8f87` | ลิงก์ / ตัวอักษรสีแดงบนพื้นอ่อน |
| `--t4-yellow` | `#ffd166` | เดิม | แถบตัวเลข อวาตาร์ ไอคอนว่าง (ตัวอักษรบนเหลืองใช้ `--t4-yellow-ink`) |
| `--t4-pill-active-bg` | `#1d1b19` | `#f4f1ec` | ปุ่มกรองที่เลือก เมนูที่เลือก แถบเลือกหลายแถว |
| `--t4-tint-rose/mint/lav/cream/sky` | พื้นการ์ด bento | | `t4-card--rose` ฯลฯ |
| `--t4-r` / `--t4-r-sm` | 18px / 12px | | มุมการ์ด / มุมปุ่ม ช่องกรอก |

**สีสถานะ (ห้ามใช้ผิดความหมาย)**: รอดำเนินการ = ทอง `--t4-gold` · กำลังดำเนินการ = น้ำเงิน `--t4-info` · เสร็จสิ้น = เขียว `--t4-ok` · ยกเลิก = เทา `--t4-grey` · เกินกำหนด/ด่วน = แดง (accent)
→ ป้าย: `t4-tag--pending | progress | done | cancel | late` (`t4-tag--flat` = ไม่มีจุดหน้า)

## 6. คอมโพเนนต์

| คลาส | ใช้ทำอะไร | ดูตัวอย่างที่ |
|---|---|---|
| `t4-btn` (+ `--ghost` `--yellow` `--sm` `--block`) | ปุ่ม (หลัก = แดง, รอง = ghost) ไม่เกิน 1 ปุ่มหลักต่อกลุ่ม | ทุกหน้า |
| `t4-icon-btn` (+ `--sm`, `__dot`) | ปุ่มไอคอน ต้องมี `aria-label` | header |
| `t4-pop-wrap` > `t4-pop` (+ `--wide`) | เมนูผู้ใช้ / กล่องแจ้งเตือน | header ทุกหน้า |
| `t4-crumbs` · `t4-page-head` · `t4-page-title` · `t4-page-sub` · `t4-page-actions` · `t4-meta` | หัวหน้า | list, form, detail |
| `t4-hl` (+ `data-t4-rotate`) | กล่องแดงเน้นคำ (สลับคำได้) | dashboard, login |
| `t4-hero` · `t4-glow` · `t4-ring` · `t4-legend` · `t4-flow` | ส่วนต้อนรับ การ์ดเรืองแสง วงแหวน ขั้นตอน | dashboard |
| `t4-stats` (+ `--sm` `--4`) · `t4-stat` | แถบตัวเลขสีเหลือง (5 หรือ 4 ช่อง) | dashboard, list |
| `t4-sec` · `t4-sec__title` (`<em>` = คำสีทอง) | หัวข้อส่วนในหน้า | dashboard |
| `t4-bento` · `t4-card` (+ `--2` `--rose` `--mint` `--lav` `--cream` `--sky` `--accent` `--link`) | การ์ดสรุป | dashboard, detail |
| `t4-chart` (+ `T4.chart.line`) · `t4-meter` · `t4-bars` · `t4-stack` · `t4-keys` · `t4-clock` | กราฟ แถบความคืบหน้า สัดส่วน | dashboard |
| `t4-pills` · `t4-pill` (`aria-pressed`) | ปุ่มกรองแบบเม็ดยา | dashboard, list |
| `t4-rows` · `t4-row` | รายการแบบ 2 คอลัมน์ (มีไอคอน) | dashboard |
| `t4-steps` · `t4-step` | การ์ดขั้นตอนเลขจาง | dashboard |
| `t4-panel` (`__head` `__body` `__foot`) | กล่องเนื้อหาทั่วไป | list, detail, starter |
| `t4-toolbar` · `t4-search` · `t4-select` | แถบค้นหา/ตัวกรอง | list |
| `t4-table` · `t4-table-wrap` | ตาราง — มือถือ (≤760px) กลายเป็นการ์ด ใส่ `data-label` ทุก `td` · คอลัมน์ไม่จำเป็นใส่ `t4-col-opt` (ซ่อนที่ 761–1200px) | list |
| `t4-bulk` · `t4-pager` · `t4-empty` | แถบเมื่อเลือกหลายแถว · เลขหน้า · ไม่พบข้อมูล | list |
| `t4-form` · `t4-grid` (`--3`) · `t4-col-full` · `t4-fsec` | โครงฟอร์ม ส่วนของฟอร์มมีเลขกำกับ | form |
| `t4-field` · `t4-label` · `t4-req` · `t4-opt` · `t4-hint` · `t4-field__count` | ช่องกรอก 1 ช่อง (radio/checkbox หลายตัวใช้ `<fieldset class="t4-field">` + `<legend class="t4-label">`) | form |
| `t4-input` · `t4-select` · `t4-textarea` · `t4-input-group` · `t4-check` | ตัวกรอก | form |
| `t4-choices` · `t4-choice` | ตัวเลือกแบบการ์ดมีไอคอน (radio) | form |
| `t4-seg` | ตัวเลือกแบบเม็ดยา (radio) เช่น ความเร่งด่วน | form, detail |
| `t4-upload` · `t4-files` | แนบไฟล์ (ลากวางได้) | form |
| `t4-date` | วันที่ **พ.ศ.** พร้อมปฏิทินไทย | form |
| `<select data-t4-combo>` → `t4-combo` | ช่องเลือกที่ **พิมพ์ค้นหาได้** — ใช้เมื่อตัวเลือกเกิน ~10 รายการ (`<optgroup>` = หัวกลุ่ม, คำที่ตรงจะถูกไฮไลต์สีเหลือง) select ตัวจริงยังอยู่ในฟอร์ม `name` `value` `required` ใช้ได้ตามปกติ · ถ้าไม่ `required` ตัวเลือกค่าว่าง (เช่น "ทุกหน่วยงาน") เลือกได้ | form (สถานที่, หน่วยงาน), list (ตัวกรองหน่วยงาน) |
| `t4-pass` · `t4-pass__btn` | รหัสผ่าน + ปุ่มแสดง/ซ่อน | login |
| `t4-actions` | แถบปุ่มท้ายฟอร์มที่ติดขอบล่างจอ | form |
| `t4-alert` (+ `--danger` `--ok` `--info` `--gold`) | ข้อความแจ้ง / สรุปข้อผิดพลาด | form, login |
| `t4-layout` · `__main` · `__aside` | 2 คอลัมน์ (เนื้อหา + ข้อมูลข้าง 340px) | form, detail |
| `t4-track` · `t4-track__step` (`is-done` `is-current`) | แถบความคืบหน้าของงาน | detail |
| `t4-dl` · `t4-quote` · `t4-thumbs` · `t4-list-kv` | ข้อมูลแบบหัวข้อ–ค่า · คำพูดผู้แจ้ง · รูป · รายการสั้น | detail |
| `t4-timeline` · `t4-tl` | ประวัติการดำเนินงาน | detail |
| `t4-person` · `t4-avatar` | ผู้รับผิดชอบ | detail |
| `t4-dialog` (`<dialog>`) | หน้าต่างยืนยัน | detail |
| `t4-callout` · `t4-toast` | ประกาศ · ข้อความลอยชั่วคราว | dashboard |
| `t4-placeholder` | กรอบว่างสำหรับหน้าใหม่ | starter |
| `t4-nav-group` · `t4-nav-sub` · `t4-nav-sub__item` · `t4-nav-sub__count` · `t4-nav-item__chev` | เมนูย่อยในแถบซ้าย (§4.1) | ทุกหน้าที่มีเมนูซ้าย |
| `t4-print-bar` · `t4-sheet` · `t4-doc-head` · `t4-doc-meta` · `t4-doc-sec` (`__title` มีเลขในกล่องแดง) · `t4-doc-grid` · `t4-doc-box` (`--quote`) · `t4-doc-checks` / `t4-doc-check` (`.is-on` = ติ๊กแล้ว) · `t4-doc-table` · `t4-doc-line` (บรรทัดให้เขียนมือ) · `t4-doc-sign` · `t4-doc-foot` | เอกสารพิมพ์ A4 (§4.4) | print |
| `t4-vstack` · `t4-mt` · `t4-num` · `t4-sr-only` | ตัวช่วย: เรียงแนวตั้ง · เว้นบน · ตัวเลขกว้างเท่ากัน · ซ่อนแต่ screen reader อ่าน | ทุกหน้า |

ไอคอน: `<svg class="t4-ic" aria-hidden="true"><use href="#t4-i-NAME"></use></svg>` (`t4-ic--sm` 16px, `--lg` 24px) ดูรายชื่อด้วย `T4.icons` ในคอนโซล — ห้ามใช้ emoji แทนไอคอน

## 7. JavaScript (`window.T4`)

ใส่ attribute แล้วทำงานเอง ไม่ต้องเขียน JS ในหน้า:

| attribute | ทำอะไร |
|---|---|
| `data-t4-theme-toggle` | สลับโหมดสว่าง/มืด (จำใน localStorage `t4-theme`) |
| `data-t4-menu` | เปิด/ปิดลิ้นชักเมนูบนจอเล็ก |
| `data-t4-sub` (+ `aria-controls`) | เปิด/ปิดเมนูย่อยในแถบซ้าย (จำกลุ่มที่เปิดไว้ใน localStorage `t4-nav`) |
| `data-t4-combo` บน `<select>` | เปลี่ยนเป็นช่องพิมพ์ค้นหา · ↓ เปิดรายการ · ↑↓ เลื่อน · Enter เลือก · Esc ปิด · ลบข้อความทั้งหมด = ล้างค่า |
| `data-t4-fit` บน `.t4-sheet` | ย่อกระดาษ A4 ให้พอดีจอเล็ก |
| `data-t4-pop="id"` | เปิด/ปิด `.t4-pop#id` (คลิกนอก หรือ Esc เพื่อปิด) |
| `data-t4-filters="listId"` + ปุ่ม `data-t4-filter="key"` | กรองแถวใน `#listId` ที่ `data-t4-kind` มีคำนั้น (`all` = ทั้งหมด) |
| `data-t4-search="listId"` | ช่องค้นหาข้อความในแถว |
| `data-t4-match="listId"` | `<select>` กรองตามค่า (ค่า option = คำใน `data-t4-kind`) |
| `data-t4-clear="listId"` | ล้างตัวกรองทั้งหมดของรายการนั้น |
| `data-t4-filter-count="listId"` · `data-t4-empty="listId"` | แสดงจำนวนแถวที่เห็น · แสดงกล่อง "ไม่พบ" เมื่อเป็น 0 |
| `data-t4-check-all="tableId"` · `data-t4-check` · `data-t4-bulk="tableId"` · `data-t4-bulk-count` · `data-t4-bulk-clear="tableId"` | เลือกหลายแถว + แถบคำสั่ง |
| `<form novalidate data-t4-validate>` | ตรวจ `required` `pattern` `type=email` แสดงข้อผิดพลาดใต้ช่อง และใน `[data-t4-summary]` |
| `data-t4-msg` · `data-t4-msg-format` | ข้อความเมื่อว่าง · เมื่อรูปแบบผิด (ไม่ใส่ = ระบบสร้างจากชื่อช่อง) |
| `data-t4-ok="ข้อความ"` · `data-t4-next="url"` · `data-t4-reset` | หลังผ่าน: แสดง toast · ไปหน้าถัดไป · ล้างฟอร์ม (**ต้นแบบเท่านั้น** ระบบจริงให้ submit ไป server) |
| `data-t4-counter` (+ `maxlength`) | ตัวนับตัวอักษรใน `.t4-field__count` |
| `data-t4-files` | แสดงชื่อไฟล์ที่เลือกใน `.t4-files` |
| `data-t4-date="YYYY-MM-DD"` บน `.t4-date` | ปฏิทินไทย ค่าเป็น `วว/ดด/ปปปป` (พ.ศ.) · ค่าใน attribute = "วันนี้" สำหรับตัวอย่าง (ระบบจริงปล่อยว่าง) · ปุ่มลูกศร/PageUp/PageDown/Esc ใช้ได้ |
| `data-t4-reveal="inputId"` | แสดง/ซ่อนรหัสผ่าน |
| `data-t4-open="dialogId"` · `data-t4-close` | เปิด/ปิด `<dialog class="t4-dialog">` |
| `data-t4-print` | สั่งพิมพ์ (ซ่อน header เมนู ปุ่ม อัตโนมัติ) |
| `data-t4-rotate='["คำ1","คำ2"]'` บน `.t4-hl` | สลับคำในกล่องแดง (หยุดเองเมื่อผู้ใช้ตั้งลดการเคลื่อนไหว) |
| `data-t4-demo="ข้อความ"` | แสดง toast แทนการทำงานจริง — **ลบทิ้งในระบบจริง** |

ฟังก์ชัน: `T4.theme.get()` / `T4.theme.set('dark')` · `T4.toast(msg)` · `T4.chart.line(svg, {labels, every, series:[{values, color, area}]})` · `T4.chart.ring(svg, [{value, color}])` · `T4.filter(listId)` (เรียกหลังเติมแถวด้วย AJAX) · `T4.validate(form)` · `T4.date.format(date)` / `T4.date.parse('16/05/2568')` · `T4.drawer(true|false)` · `T4.combo.init(selectEl)` (select ที่เพิ่มทีหลังด้วย AJAX) / `T4.combo.sync()` (เรียกหลังตั้ง `select.value` ด้วยโค้ด)

## 8. เลือกหน้าต้นแบบให้ตรงงาน

| งาน | ลอกจาก |
|---|---|
| หน้าแรกหลัง login / ภาพรวม ตัวชี้วัด กราฟ | `dashboard.html` |
| รายการ + ค้นหา + ตัวกรอง + ตาราง | `list.html` |
| เพิ่ม/แก้ไขข้อมูล | `form.html` |
| ดูรายละเอียด 1 รายการ + ประวัติ + อนุมัติ/ปิดงาน | `detail.html` |
| เข้าสู่ระบบ | `login.html` |
| ไม่พบหน้า / ไม่มีสิทธิ์ / ระบบขัดข้อง | `error.html` |
| เอกสารสำหรับพิมพ์ / บันทึก PDF (ใบคำขอ ใบสั่งงาน แบบฟอร์มที่ต้องเซ็น) | `print.html` |
| หน้าอื่น ๆ | `starter.html` แล้วหยิบส่วนประกอบจากหน้าข้างบน |

## 9. ข้อควรรู้

- **อย่าใช้สีแดงพร่ำเพรื่อ**: แดงคือปุ่มหลัก กล่องเน้นคำ และ "เกินกำหนด/ด่วน" เท่านั้น — หน้าหนึ่งมีกล่องเน้นคำ `t4-hl` ได้ที่เดียว และการ์ดแดงทึบ (`t4-card--accent`) ไม่เกิน 1 ใบ
- **วันที่แสดงเป็น พ.ศ.** (`15/05/2568`, `15 พ.ค. 2568`) เสมอ ส่งเข้า server ให้แปลงเป็น ค.ศ. (`T4.date.parse`)
- ใช้ `:has()` กับตัวเลือก `t4-choice` / `t4-seg` (Chrome/Edge 105+, Safari 15.4+, Firefox 121+) และ `<dialog>`
- ข้อมูลตัวอย่าง (SMMS, บริษัท ตัวอย่าง จำกัด, ชื่อคน, เบอร์ 1150, อีเมล example.com) ห้ามหลุดเข้าระบบจริง
- ฟอร์มทุกฟอร์มต้องตรวจซ้ำที่ server และส่งด้วย POST + CSRF token; ออกจากระบบด้วย POST; อย่าใส่ข้อมูลส่วนบุคคลใน URL
- localStorage ที่ชุดนี้ใช้: `t4-theme` (โหมดสี) และ `t4-nav` (เมนูย่อยที่เปิดไว้) — เป็นค่าความสะดวกของผู้ใช้แต่ละเครื่องเท่านั้น
- ถ้าต้องการส่วนที่ชุดนี้ยังไม่มี ให้ยืม "แนวคิด" จาก Template 1 แล้วเขียนเป็นคลาส `t4-` ใหม่ใน `t4-ui.css` (ห้าม copy คลาส `ds-` มาใช้)

## 10. Prompt สำเร็จรูป (สั่ง AI ให้ทำระบบด้วย Template 4)

```text
พัฒนาระบบ "{system_name}" ({คำอธิบายสั้น ๆ})
UI ทั้งหมดใช้ Template 4 ที่ C:\inetpub\wwwroot\template\template4\ เท่านั้น

ก่อนเริ่ม อ่านให้ครบ:
- C:\inetpub\wwwroot\template\template4\README.md
- หน้าต้นแบบใน C:\inetpub\wwwroot\template\template4\pages\ : dashboard, list, form, detail, login, error, print, starter
- comment หัวไฟล์ assets\t4-ui.css และ assets\t4-ui.js

ข้อกำหนด UI:
- โหลด /template/template4/assets/t4-ui.css และ t4-ui.js ตาม README §3 และ <body class="t4-body">
- ทำ layout กลางจาก header + sidebar + footer ของ starter.html ครั้งเดียว แล้วทุกหน้าหลัง login ใช้ layout นี้
- แต่ละหน้าลอกโครง markup จากหน้าต้นแบบที่ตรงที่สุด (README §8) ห้ามออกแบบ UI เอง
- ใช้เฉพาะคลาส t4- ที่มีใน t4-ui.css, สีจาก token --t4-* เท่านั้น, ห้ามปนคลาสของ template อื่น (ds-, t2-, t3-)
- สีสถานะตาม README §5, กล่องเน้นคำ t4-hl ได้หน้าละ 1 ที่
- ภาษาไทย, วันที่ พ.ศ. ด้วย .t4-date, รองรับมือถือ (ตารางใส่ data-label ทุกช่อง)
- select ที่มีตัวเลือกเกิน ~10 รายการใส่ data-t4-combo; เมนูซ้ายที่มีหน้าย่อยใช้เมนูย่อย (README §4.1)
- เอกสารที่ต้องพิมพ์/เซ็นทำตาม print.html (A4 หน้าเดียว ทดสอบด้วยการสั่งพิมพ์จริง)
- ลบ data-t4-demo / data-t4-ok / data-t4-next ออกจากระบบจริง; ข้อความตัวอย่างห้ามหลุดเข้าระบบ

ข้อมูลระบบ:
- stack: {Laravel + Blade / PHP + MySQL / ASP.NET / ...}
- ชื่อบนแถบบน: "{short_name}" / "{full_name}"   หน่วยงาน: "{agency}"
- เมนูซ้าย (กลุ่ม > รายการ > เมนูย่อย): {เช่น งานของฉัน > แดชบอร์ด, รายการคำขอ ; ข้อมูล > รายงาน > สรุปรายเดือน, แยกตามหน่วยงาน}
- เอกสารที่ต้องพิมพ์: {เช่น ใบคำขอ, ใบสั่งงาน — หัวกระดาษ ช่องลงนาม}
- หน้าและข้อมูล: {ชื่อหน้า, แบบหน้า (dashboard/list/form/detail), ฟิลด์/คอลัมน์, สถานะ, ปุ่ม}
- ผู้ใช้/สิทธิ์: {บทบาท และสิ่งที่แต่ละบทบาททำได้}

ขั้นตอน: เสนอแผน (โครงไฟล์ + รายการหน้า) ให้ฉันอนุมัติก่อน แล้วทำ layout → ทีละหน้า
```
