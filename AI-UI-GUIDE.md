# คู่มือ UI Template สำหรับ AI (Template 1 · SMMS Design System · ds-ui v1.0)

> ไฟล์ของ kit นี้อยู่ในโฟลเดอร์ `template1/` (`template1/assets/`, `template1/pages/`, `template1/examples/`) ส่วนคู่มือนี้อยู่ที่ root ของโฟลเดอร์ `template/`

> **สรุป 3 บรรทัด**
> 1. หน้าตาทั้งหมดมาจากไฟล์เดียว `template1/assets/ds-ui.css` (tokens + app shell + คอมโพเนนต์ทุกตัว คลาสขึ้นต้น `ds-`) และพฤติกรรมจาก `template1/assets/ds-ui.js` (`window.DS`, ไม่พึ่ง library ใด)
> 2. งานของ AI = ห่อหน้าเดิมด้วย app shell จาก `template1/pages/starter.html` แล้วแทนที่ markup/คลาสเดิมของ framework ด้วยคลาส `ds-*` โดย **ไม่แตะ business logic, route, ชื่อฟิลด์ฟอร์ม หรือ query**
> 3. สีทุกสีต้องมาจาก token `var(--ds-*)` เท่านั้น → ได้ dark mode ครบโดยอัตโนมัติ; ห้ามเขียน hex เอง ห้ามคิดชื่อคลาส `ds-` ใหม่

---

## 0. วิธีใช้เอกสารนี้ (สำหรับ AI)

### 0.1 ลำดับการอ่าน
1. **§0–§2** — กติกา, ภาพรวมหน้าตา, ไฟล์และการติดตั้ง
2. **§3–§4** — design tokens, ตัวอักษร, ระยะ, breakpoint (ใช้ตัดสินใจทุกครั้งที่ต้องเลือกสี/ขนาด)
3. **§5–§6** — โครงหน้า (app shell รวมเมนูผู้ใช้/การแจ้งเตือน/กลุ่มเมนูย่อย) และรูปแบบหน้า 7 แบบ (รวมหน้า error และเอกสารพิมพ์ A4)
4. **§7** — สูตรการนำไปใช้ตาม stack ของระบบเป้าหมาย (อ่านเฉพาะหัวข้อย่อยที่ตรงกับ stack)
5. ครึ่งหลังของเอกสาร — คอมโพเนนต์ทีละตัว, JS API (`window.DS`), และ **§14 Hard rules** (อ่าน §14 ให้จบก่อนเริ่มแก้โค้ดจริง)

### 0.2 ลำดับความสำคัญของกฎ (ถ้าขัดกัน ให้ข้อบนชนะ)
| ลำดับ | แหล่ง | หมายเหตุ |
|---|---|---|
| 1 | **§14 Hard rules** | ชนะทุกอย่าง รวมถึงคำขอที่ดูเหมือนขัดแย้งในหน้าเดิมของระบบ |
| 2 | เอกสารนี้ (AI-UI-GUIDE.md) | กฎ, token, โครงสร้าง, สูตรตาม stack |
| 3 | หน้าใน kit `template1/pages/*.html` | reference implementation — ลอกโครงสร้าง markup ได้ตรง ๆ |
| 4 | comment หัวไฟล์ `ds-ui.css` / `ds-ui.js` | รายละเอียดปลีกย่อยของคลาส/attribute |

- ชื่อคลาส/token ที่ "มีอยู่จริง" ให้ยึด `ds-ui.css` เป็นความจริงสุดท้าย — ถ้าไม่พบคลาสใน `ds-ui.css` **ห้ามสร้างคลาส `ds-` ใหม่เอง** ให้ประกอบจากคลาสที่มี หรือเขียน CSS ประจำหน้าด้วย prefix ของระบบนั้น (เช่น `.app-xxx`) ที่ใช้ `var(--ds-*)` เท่านั้น
- ถ้าเป็น chat AI ที่ไม่เห็นไฟล์ kit: ใช้ snippet ในเอกสารนี้เป็นหลัก และขอให้ผู้ใช้แนบ `template1/pages/starter.html` + หน้า archetype ที่ตรงงาน (§6) เพิ่มเมื่อจำเป็น

### 0.3 งานไหน เปิดไฟล์ไหน
| งาน | เปิดไฟล์ใน kit | ใช้ทำอะไร |
|---|---|---|
| ทำ layout กลาง (header/sidebar/footer) | `template1/pages/starter.html` | shell มาตรฐาน — ลอกทั้งไฟล์ แล้วแยกเป็น partial (§7) |
| หน้าแดชบอร์ด / KPI / กราฟ | `template1/pages/dashboard.html` | hero, date card, KPI, donut/pie/bars, ตารางล่าสุด |
| หน้ารายการ + ค้นหา + ตาราง + แบ่งหน้า | `template1/pages/list.html` | `ds-filters`, `ds-table`, `ds-pill`, `ds-pager` |
| หน้าสร้าง/แก้ไขข้อมูล | `template1/pages/form.html` | `ds-form-section`, `ds-form`, `ds-field`, `ds-form-actions` |
| หน้ารายละเอียด | `template1/pages/detail.html` | `ds-tabs`, `ds-dl`, `ds-timeline`, `ds-grid--aside` |
| หน้าเข้าสู่ระบบ | `template1/pages/login.html` | `ds-auth` (ไม่มี sidebar) |
| หน้า error 403/404/419/500/503 | `template1/pages/error.html` | `ds-error` (ไม่มี sidebar) — เลือกแบบด้วย `?code=` |
| เอกสารพิมพ์ / ใบฟอร์มราชการ A4 | `template1/pages/print.html` | `ds-doc` (แผ่น A4 ขาว-ดำ, ฟอนต์ Sarabun) + `data-ds-print` |
| เมนูผู้ใช้, การแจ้งเตือน, กลุ่มเมนูย่อย | `template1/pages/starter.html` | `ds-dropdown` + `ds-menu` / `ds-popover`, `ds-nav__group` (§5.1, §8.23–8.25) |
| ช่องเลือกแบบพิมพ์ค้นหา (แทน Select2) | `template1/pages/form.html`, `template1/pages/components.html` | `select[data-ds-combobox]` (§8.26) |
| หา snippet ของคอมโพเนนต์ใด ๆ | `template1/pages/components.html` | gallery ทุกคอมโพเนนต์ + HTML ที่คัดลอกได้ + swatch ของ token |
| เช็กชื่อคลาส / ค่า token | `template1/assets/ds-ui.css` | source of truth (อย่าแก้ไฟล์นี้ในระบบเป้าหมาย) |
| เช็ก data attribute / `DS.*` | `template1/assets/ds-ui.js` (comment หัวไฟล์) | API ทั้งหมด |

### 0.4 Definition of done (ตรวจทุกข้อก่อนบอกว่าเสร็จ)
- [ ] ทุกหน้าใช้ shell เดียวกันจาก partial/layout กลาง (ไม่มี shell ซ้ำในแต่ละหน้า)
- [ ] `<head>` โหลด Kanit → CSS ของ framework → `ds-ui.css` → `<script src=ds-ui.js>` (ไม่ `defer`/`async`) ตาม §2.2
- [ ] เมนูที่ตรงกับหน้าปัจจุบันมี `aria-current="page"` **หนึ่งรายการพอดี** (ถ้าอยู่ในกลุ่มเมนูย่อย กลุ่มนั้นถูก render เปิดไว้จาก server — §5.3a)
- [ ] topbar ใช้ `ds-dropdown` ของ kit สำหรับการแจ้งเตือนและเมนูผู้ใช้; ปุ่มออกจากระบบส่งแบบเดียวกับระบบเดิม (Laravel = POST + `@csrf`)
- [ ] ไม่มีสี hex/rgb/ชื่อสีเขียนเองในหน้า/CSS ใหม่ — ใช้ `var(--ds-*)` ทั้งหมด
- [ ] สลับ dark mode (ปุ่ม `data-ds-theme-toggle`) แล้วทุกหน้าอ่านได้ ไม่มีกล่องขาวหลงเหลือ
- [ ] ทดสอบความกว้าง 1280 / 900 / 620 / 400 px: sidebar เป็น off-canvas ที่ ≤900, ไม่มี scroll แนวนอนทั้งหน้า (ตารางเลื่อนใน `ds-table-wrap` เท่านั้น)
- [ ] ข้อความ UI เป็นภาษาไทย, หัวพาเนลรูปแบบ "ไทย (English)" ตาม §1
- [ ] ไม่มี console error, ฟอร์มยัง submit ชื่อฟิลด์เดิม, route/permission เดิมทำงานครบ
- [ ] ไม่มีคลาส framework เดิม (`btn`, `card`, `badge`, `table`, `form-control` …) ค้างบน element ที่ใส่คลาส `ds-` แล้ว

---

## 1. ภาพรวมหน้าตา (Look & feel)

ภาพรวม: ระบบงานองค์กรไทยที่ดู "สะอาด ทางการ แต่ไม่แข็ง" แบ่งเป็นแถบนำทางสีน้ำเงินกรมท่าด้านซ้าย + พื้นที่ทำงานสีอ่อนด้านขวา

| องค์ประกอบ | ลักษณะที่ต้องได้ |
|---|---|
| **Sidebar** | กว้าง 225px, พื้น gradient แนวตั้ง navy (`--ds-grad-sidebar`: #0a1f44 → #0d2a5c → #0a1f44), ตัวอักษรขาวอมฟ้า; มีลายเส้นตาราง (grid-line) จาง ๆ ที่ส่วนล่าง (`.ds-sidebar::after`); โลโก้ + ชื่อระบบตัวใหญ่ 30px/600 ด้านบน; คำคม (quote) ตัวเอียงชิดล่าง (`ds-sidebar__quote`) |
| **เมนูที่เลือก** | แถบ gradient น้ำเงินสด (`--ds-grad-nav-active`) + เส้นขอบซ้าย 4px สีฟ้าอ่อน (`--ds-nav-active-edge`) + ตัวหนา 500 |
| **Topbar** | พื้นขาว (`--ds-surface`) sticky ด้านบน; ลำดับ: ปุ่มเมนู · โลโก้ย่อ · ชื่อระบบ (h1, 15px, มีเส้นคั่นซ้าย) · ช่องค้นหาทรงแคปซูล · ปุ่มสลับธีม · กระดิ่ง (จุดแดงนับจำนวน → กดแล้วเปิดแผงการแจ้งเตือน) · ปุ่มผู้ใช้ (avatar วงกลม gradient + ชื่อ/ตำแหน่ง + ลูกศร ▾ → กดแล้วเปิดเมนูผู้ใช้: ข้อมูลส่วนตัว / เปลี่ยนรหัสผ่าน / ออกจากระบบ) |
| **เมนูลอย / แผงลอย** | กล่องพื้น `--ds-surface` ขอบ 1px `--ds-line` มุม 10px เงา `--ds-shadow-pop` ชิดขวาใต้ปุ่ม; จอ ≤620px กลายเป็นแผ่นเต็มกว้างใต้ topbar |
| **เอกสารพิมพ์ (A4)** | แผ่นกระดาษขาว ตัวอักษรดำ เสมอ (ทั้งสองธีม) ฟอนต์ Sarabun (`--ds-font-doc`) ตารางเส้น 1px ช่อง label เทาอ่อน ช่องลงนาม 3 ช่อง — ไม่ใช้สีแบรนด์/เงา/มุมโค้งในเนื้อเอกสาร |
| **พื้นหลังหน้า** | ฟ้าเทาอ่อน `#eef2f9` (`--ds-bg`) |
| **การ์ด/พาเนล** | พื้นขาว, มุมโค้ง 10px (`--ds-r-lg`), เงานุ่มสองชั้น (`--ds-shadow`), padding 14px 16px, **ไม่มีเส้นขอบ** |
| **ระยะห่าง** | ช่องไฟระหว่างบล็อก 12px ทุกที่ (`--ds-gap`) — แน่นแบบ dashboard ไม่โปร่งแบบ landing page |
| **ตัวอักษร** | Kanit น้ำหนัก 300 ขนาด 14px เป็นเนื้อหาหลัก; หัวข้อ/ตัวหนา/หัวตาราง ใช้ 500; ตัวเลขใช้ tabular-nums (`ds-num`) |
| **สีหลัก** | น้ำเงินสด `#1f6fe5` (`--ds-primary`) สำหรับปุ่มหลัก ลิงก์ โฟกัส |
| **KPI** | การ์ดขาว มีกล่องไอคอนสี่เหลี่ยมมุมโค้งสีสด 54px (น้ำเงิน/ส้ม/เหลือง/เขียว/ม่วง) + ตัวเลขใหญ่ 28px + delta สีเขียว/แดง |
| **สถานะ** | "pill" ทรงแคปซูลพื้นอ่อน-ตัวเข้ม: รอดำเนินการ = เหลืองส้ม, กำลังดำเนินการ = ฟ้า, เสร็จสิ้น = เขียว, ยกเลิก = แดง |
| **หัวพาเนล** | ภาษาไทยตามด้วยภาษาอังกฤษในวงเล็บ เช่น `สถานะงานแจ้งซ่อม (Service Request Status)`, `งานล่าสุด (Recent Requests)`, `เมนูด่วน (Quick Actions)` (หัวสั้น ๆ เช่น "แจ้งเตือน" ไม่ต้องมีวงเล็บก็ได้) |
| **ไอคอน** | เส้น outline 24px stroke 1.8 ปลายมน (sprite `#ds-i-*`) ไม่ใช้ Font Awesome ในหน้าที่ปรับแล้ว |
| **Dark mode** | ครบทุกคอมโพเนนต์: พื้น #0b1220, การ์ด #131c2f, เส้น #26334d, ไม่มีเงา; sidebar/navy คงเดิม; สลับจากปุ่มใน topbar และจำค่าใน `localStorage` (`ds-theme`) |
| **Footer** | แถบขาวบาง ตัวอักษรเทา (`--ds-ink-3`): โลโก้ · เวอร์ชัน · ชื่อระบบ … ลิขสิทธิ์ชิดขวา |

ภาษาในหน้า: label, ปุ่ม, ข้อความแจ้งเตือน เป็นภาษาไทยทั้งหมด (ปุ่มใช้คำกริยาสั้น: "บันทึก", "ยกเลิก", "ส่งออก", "สร้างรายการใหม่"); ป้าย KPI ภาษาอังกฤษได้ (`lang="en"`) โดยมีคำไทยใน `ds-kpi__foot`

---

## 2. ไฟล์ใน kit และการติดตั้ง

### 2.1 แผนผังไฟล์
```
/template/
  AI-UI-GUIDE.md          เอกสารนี้
  PROMPTS.md              prompt สำเร็จรูป
  template1/              ← kit นี้ (template2/ template3/ template4/ เป็นชุดอื่น ห้ามผสม)
    assets/
      ds-ui.css           tokens + base + app shell + ทุกคอมโพเนนต์  ← source of truth
      ds-ui.js            ธีม, icon sprite, sidebar, dialog, toast, tooltip, tabs, confirm, charts,
                          ปฏิทินไทย, dropdown/เมนู, combobox, ปุ่มย้อนกลับ/พิมพ์ (window.DS)
    pages/
      starter.html        shell มาตรฐาน (ทุกหน้าเริ่มจากไฟล์นี้)
      dashboard.html  list.html  form.html  detail.html  login.html  components.html
      error.html          หน้า error 403/404/419/500/503 (ไม่มี shell; ?code=404)
      print.html          เอกสาร A4 สำหรับพิมพ์/บันทึก PDF (ใบแจ้งซ่อม)
    examples/
      intranet.html       ตัวอย่างหน้า intranet ที่ประกอบจากคอมโพเนนต์ของ kit
```
ทั้งหมดเปิดดูได้ที่ `http://<host>/template/template1/pages/<name>.html` · ไม่มี build step, ไม่มี npm, ไม่มี dependency

### 2.2 ลำดับการโหลดใน `<head>` (สำคัญ)
```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ชื่อหน้า | ชื่อระบบ</title>
  <!-- 1) ฟอนต์ Kanit -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap">
  <!-- 2) CSS ของ framework เดิม (Bootstrap / Vite bundle / DataTables / Select2 …) -->
  <!-- 3) ds-ui.css "หลัง" framework เสมอ เพื่อให้คลาส ds- ชนะเมื่อ specificity เท่ากัน -->
  <link rel="stylesheet" href="/template/template1/assets/ds-ui.css?v=1.0.2">
  <!-- 4) ds-ui.js ใน <head> ห้าม defer/async: ตั้งธีมที่บันทึกไว้ก่อน paint (กันจอกระพริบขาว→ดำ) -->
  <script src="/template/template1/assets/ds-ui.js?v=1.0.2"></script>
</head>
<body class="ds-body">
```
- `class="ds-body"` บน `<body>` = margin 0 + พื้นหลัง/ฟอนต์ของ kit (จำเป็นสำหรับ Firefox ESR 115 ที่ไม่มี `:has()`)
- ห้ามใส่ `<meta name="color-scheme">` — kit ตั้งใจให้ native widget (scrollbar, date picker) เป็นสีสว่างทั้งสองธีมเหมือนต้นฉบับ
- ห้ามห่อ `ds-ui.css` ด้วย `@layer` เอง (Bootstrap ที่ไม่อยู่ใน layer จะชนะ kit)
- ถ้าจำเป็นต้องวาง `ds-ui.js` ท้าย `<body>`: ใช้งานได้ แต่ธีมมืดอาจกระพริบ — ให้เพิ่มบรรทัดนี้ใน `<head>`
  ```html
  <script>try{var t=localStorage.getItem('ds-theme');if(t&&!document.documentElement.hasAttribute('data-theme'))document.documentElement.setAttribute('data-theme',t)}catch(e){}</script>
  ```
- โหลดซ้ำสองครั้ง (layout + หน้า) ไม่เป็นไร: สำเนาที่สองถูกข้าม
- script ของหน้าเอง (กราฟ, `DS.toast` จาก flash message) วางท้าย `<body>` ไม่ใช่ใน partial กลาง

### 2.3 ใช้ path กลาง หรือคัดลอกเข้าโปรเจกต์
| วิธี | ข้อดี | ข้อเสีย | ใช้เมื่อ |
|---|---|---|---|
| **path กลาง** `/template/template1/assets/…` | แก้ที่เดียวทุกระบบเปลี่ยนตาม, ไม่ต้องคัดลอก | kit เปลี่ยน = 100 ระบบเปลี่ยนพร้อมกัน (เสี่ยงพังทั้งเซิร์ฟเวอร์), ระบบที่ย้ายเครื่อง/ย้าย host จะหาไฟล์ไม่เจอ, ปักเวอร์ชันไม่ได้ | ต้นแบบ, dev, ระบบภายในที่ยอมรับการอัปเดตอัตโนมัติ |
| **คัดลอกโฟลเดอร์มีเลขเวอร์ชัน** เข้าโปรเจกต์ | ปักเวอร์ชันได้, deploy พร้อมโค้ด, ไม่ขึ้นกับโฟลเดอร์ template | อัปเดตต้องคัดลอกใหม่ทีละระบบ | **แนะนำสำหรับ production** |

แนะนำ: คัดลอก `ds-ui.css` + `ds-ui.js` ไปไว้ใต้โฟลเดอร์ที่มีเลขเวอร์ชัน แล้วอ้าง path นั้น
- Laravel: `public/vendor/ds-ui/1.0.2/ds-ui.css` → `{{ asset('vendor/ds-ui/1.0.2/ds-ui.css') }}`
- plain PHP: `assets/vendor/ds-ui/1.0.2/ds-ui.css` → `<?= $baseUrl ?>/assets/vendor/ds-ui/1.0.2/ds-ui.css`
- ห้ามแก้ไฟล์ที่คัดลอกมา — ปรับแต่งด้วยการ override token ในไฟล์ CSS ของระบบเอง (§3.5); อัปเดต = คัดลอกเวอร์ชันใหม่เป็นโฟลเดอร์ใหม่แล้วเปลี่ยน path
- ใช้ path กลางต่อได้ ให้คง `?v=1.0.2` ไว้เพื่อ cache-busting

**ประวัติเวอร์ชัน kit**
| เวอร์ชัน | วันที่ | เปลี่ยนอะไร | ระบบที่คัดลอกไปแล้วต้องทำ |
|---|---|---|---|
| 1.0.2 | 5 ต.ค. 2569 | `ds-btn--ghost` มีพื้นสี surface (เดิมโปร่งใส กลืนกับพื้นหน้าเมื่อวางบน `ds-page-head__actions` / `ds-filters`), hover เปลี่ยนเป็นพื้น surface-2 — แก้ใน `ds-ui.css` เท่านั้น, `ds-ui.js` เปลี่ยนแค่เลขเวอร์ชัน | คัดลอก `ds-ui.css` + `ds-ui.js` เป็นโฟลเดอร์ `1.0.2` แล้วเปลี่ยน path/`?v=` — markup เดิมไม่ต้องแก้ |
| 1.0.1 | 5 ต.ค. 2569 | ไอคอน `info` เป็นตัว i ในวงกลม (เดิมตัว i เปล่ากลืนกับพื้น `ds-alert--info`) — แก้ใน `ds-ui.js` เท่านั้น, `ds-ui.css` เปลี่ยนแค่เลขเวอร์ชัน | คัดลอก `ds-ui.css` + `ds-ui.js` เป็นโฟลเดอร์ `1.0.1` แล้วเปลี่ยน path/`?v=` — markup เดิม (`#ds-i-info`) ไม่ต้องแก้ |
| 1.0.0 | — | รุ่นแรก | — |

### 2.4 ฟอนต์สำรองเมื่อ Google Fonts ถูกบล็อก
- `--ds-font` = `"Kanit","Noto Sans Thai","Leelawadee UI",Tahoma,sans-serif` → ถ้าโหลด Kanit ไม่ได้ Windows จะใช้ Leelawadee UI/Tahoma อัตโนมัติ (อ่านได้ แต่หน้าตาไม่ตรง)
- เครือข่ายปิด: self-host ไฟล์ Kanit (`.woff2` น้ำหนัก 300/400/500/600 + 300/400 italic) แล้วประกาศ `@font-face` ในไฟล์ของระบบ **แทน** `<link>` ของ Google Fonts (วางก่อน `ds-ui.css`):
  ```css
  @font-face{font-family:"Kanit";font-style:normal;font-weight:300;font-display:swap;src:url("fonts/kanit-300.woff2") format("woff2")}
  @font-face{font-family:"Kanit";font-style:normal;font-weight:400;font-display:swap;src:url("fonts/kanit-400.woff2") format("woff2")}
  @font-face{font-family:"Kanit";font-style:normal;font-weight:500;font-display:swap;src:url("fonts/kanit-500.woff2") format("woff2")}
  @font-face{font-family:"Kanit";font-style:normal;font-weight:600;font-display:swap;src:url("fonts/kanit-600.woff2") format("woff2")}
  @font-face{font-family:"Kanit";font-style:italic;font-weight:300;font-display:swap;src:url("fonts/kanit-300-italic.woff2") format("woff2")}
  @font-face{font-family:"Kanit";font-style:italic;font-weight:400;font-display:swap;src:url("fonts/kanit-400-italic.woff2") format("woff2")}
  ```
- ระบบเดิมที่ใช้ Sarabun/Prompt: **เปลี่ยนเป็น Kanit** (ลบ `<link>` Sarabun/Prompt และ `font-family` ที่ตั้งไว้บน `body`/`*` ใน CSS เดิม ไม่เช่นนั้นจะทับ kit)
- **ข้อยกเว้นเดียว: เอกสารพิมพ์ A4 (`ds-doc`, §6.7)** ใช้ `--ds-font-doc` = `"Sarabun","TH Sarabun New","Kanit",Tahoma,sans-serif` ตามแบบหนังสือราชการ — โหลด Sarabun เฉพาะในหน้าเอกสารนั้น (`family=Sarabun:wght@300;400;600`) ห้ามโหลดใน layout กลาง และห้ามใช้ Sarabun นอก `.ds-doc`

---

## 3. Design tokens

token ทั้งหมดประกาศใน `ds-ui.css` บน `:root` (สว่าง) และบล็อกมืด 2 บล็อก (`html[data-theme="dark"]` และ OS dark เมื่อไม่ได้ปักเป็น light) — **ใช้ผ่าน `var(--ds-…)` เสมอ** ค่าในตารางมีไว้อ้างอิงเท่านั้น ห้ามคัดลอก hex ไปใช้

> **ผ่าน WCAG AA แล้วทั้งสองธีม** (ข้อความ ≥ 4.5:1, ข้อความใหญ่/ไอคอน/ขอบ control ≥ 3:1) — token ข้อความบางตัวถูกปรับให้เข้มขึ้น (สว่าง) หรือสว่างขึ้น (มืด) เล็กน้อยโดยคงโทนสีเดิม และมี token พื้นสีเข้ม `--ds-*-strong` สำหรับตัวอักษรขาวบนพื้นสี รายละเอียดและกฎการเลือกใช้อยู่ใน **§3.6** · ค่าในตารางด้านล่างคือค่าสุดท้ายหลังรอบ AA (ตรงกับ `ds-ui.css` ณ รุ่นนี้; ค่าเดิมก่อนปรับอยู่ในวงเล็บ "เดิม …" และใน comment `AA: was …` ของไฟล์) — ถ้าไม่ตรงกัน `ds-ui.css` คือความจริงสุดท้ายเสมอ

### 3.1 พื้นผิวและตัวอักษร (เปลี่ยนตามธีม)
| Token | Light | Dark | ใช้กับ |
|---|---|---|---|
| `--ds-bg` | `#eef2f9` | `#0b1220` | พื้นหลังหน้า |
| `--ds-surface` | `#ffffff` | `#131c2f` | การ์ด, พาเนล, topbar, footer, dialog |
| `--ds-surface-2` | `#f4f7fc` | `#19243a` | หัวตาราง, ช่องค้นหา/input, hover |
| `--ds-line` | `#e1e7f1` | `#26334d` | เส้นขอบตกแต่ง, เส้นคั่น (ไม่ใช่ขอบ control) |
| `--ds-line-strong` | `#808ca4` (ใหม่) | `#5f6e8c` (ใหม่) | ขอบ input/select/textarea/combobox (≥ 3:1 กับ bg / surface / surface-2 — AA: สว่าง 3.01 / 3.38 / 3.15, มืด 3.65 / 3.32 / 3.02) |
| `--ds-ink` | `#10203d` | `#f0f4fb` | ตัวอักษรหลัก |
| `--ds-ink-2` | `#44526d` | `#b7c3d9` | ตัวอักษรรอง, คำอธิบาย |
| `--ds-ink-3` | `#636f87` (เดิม `#7b879e`) | `#8593ae` | meta, เวลา, placeholder, footer (≥ 4.5:1 บน `--ds-surface`) |
| `--ds-link` | `#1b62d6` | `#6ea8ff` | ลิงก์, `ds-link-btn`, `ds-id-link` |
| `--ds-track` | `#e8edf5` | `#222e46` | รางของ progress/bar |
| `--ds-good` | `#0c8249` (เดิม `#0f9d58`) | `#4fd095` | ตัวเลขเชิงบวก (`ds-text-good`, delta ดีขึ้น) |
| `--ds-bad` | `#d91d1d` (เดิม `#e53e3e`) | `#ff7b7b` | ตัวเลขเชิงลบ, ข้อความ error, `ds-menu__item--danger` |
| `--ds-shadow` | เงา 2 ชั้น `0 1px 2px …, 0 6px 18px …` | `none` | เงาการ์ด/พาเนล |
| `--ds-shadow-up` | เงากลับด้าน (ขึ้นบน) | `none` | แถบปุ่ม sticky `ds-form-actions` |
| `--ds-float-edge` | `transparent` | `rgba(255,255,255,.12)` | ขอบ 1px ของการ์ด login (เห็นเฉพาะธีมมืด) |

### 3.2 คู่สีสถานะ (พื้น/ตัวอักษร เปลี่ยนตามธีม)
| สถานะ (ตัวอย่างข้อความ) | Token คู่ | Light bg / ink | Dark bg / ink | คลาส |
|---|---|---|---|---|
| รอดำเนินการ / รออนุมัติ | `--ds-pending-bg` / `--ds-pending-ink` | `#fff1d6` / `#a25e00` (เดิม `#a35f00`) | `#3b2f10` / `#f5c966` | `ds-pill--pending` |
| กำลังดำเนินการ / ส่งต่อแล้ว | `--ds-progress-bg` / `--ds-progress-ink` | `#dfeafc` / `#1652b5` | `#16315c` / `#9dc4fa` | `ds-pill--progress` |
| เสร็จสิ้น / อนุมัติ / ปิดงาน | `--ds-done-bg` / `--ds-done-ink` | `#d9f4e6` / `#0b7a47` | `#0f3728` / `#7bdcb4` | `ds-pill--done` |
| ยกเลิก / ไม่อนุมัติ / เกินกำหนด | `--ds-cancel-bg` / `--ds-cancel-ink` | `#fde0e0` / `#b42323` | `#451d1d` / `#f5a5a5` | `ds-pill--cancel` |
| ข้อมูล / รออะไหล่ / รอผู้อื่น | `--ds-info-bg` / `--ds-info-ink` | `#dff1fd` / `#0b64a0` | `#0f3348` / `#8fd3fb` | `ds-pill--info` |
| ฉบับร่าง / ไม่ระบุ (ค่าเริ่มต้น) | `--ds-neutral-bg` / `--ds-neutral-ink` | `#eceff5` / `#44526d` | `#222e46` / `#b7c3d9` | `ds-pill--neutral` |

**กฎ mapping สถานะ:** ทุกค่าสถานะของระบบเป้าหมายต้องถูกจัดเข้า 1 ใน 6 กลุ่มนี้ (ทำเป็นฟังก์ชัน/array กลางที่เดียว เช่น `statusPill($status)`) — ห้ามเพิ่มสีสถานะใหม่ ห้ามใช้สีเต็ม (`--ds-green`) เป็นพื้น pill; กลุ่มเดียวกันใช้กับ alert (`ds-alert--info|--success|--warning|--danger`) และสีกราฟของสถานะ (รอ = `--ds-yellow`/`--ds-orange`, กำลังทำ = `--ds-blue`, เสร็จ = `--ds-green`, ยกเลิก = `--ds-red`)

### 3.3 Palette (เหมือนกันทั้งสองธีม)
| Token | ค่า | ใช้กับ |
|---|---|---|
| `--ds-blue` | `#1f6fe5` | สีหลัก, KPI, กราฟชุดแรก |
| `--ds-sky` | `#3d9bf2` | กราฟ, ของตกแต่ง |
| `--ds-green` | `#16a765` | กราฟ/จุด/ไอคอนสถานะดี |
| `--ds-yellow` | `#f5b91f` | กราฟ, KPI รอดำเนินการ |
| `--ds-orange` | `#f58220` | กราฟ, KPI เตือน |
| `--ds-red` | `#e53e3e` | กราฟ, จุด/ไอคอนสถานะแย่ (พื้นที่มีตัวเลขขาว เช่น badge ใช้ `--ds-red-strong`) |
| `--ds-purple` | `#6c4fe0` | กราฟ, KPI |
| `--ds-gray` | `#9aa5b8` | กราฟ "อื่น ๆ" |
| `--ds-blue-strong` | `#1f6fe5` (= `--ds-blue`, ขาว 4.70:1) | พื้นสีน้ำเงินที่มีตัวอักษร/ไอคอนขาว (quick tile, กล่องไอคอน KPI) — §3.6 |
| `--ds-green-strong` | `#0e7f4b` (ขาว 5.05:1) | พื้นปุ่ม `ds-btn--success`, tile/กล่องไอคอนสีเขียว (ตัวขาวผ่าน AA) |
| `--ds-orange-strong` | `#bc5b08` (ขาว 4.53:1) | tile/กล่องไอคอนสีส้มที่มีตัวขาว |
| `--ds-purple-strong` | `#6c4fe0` (= `--ds-purple`, ขาว 5.48:1) | tile/กล่องไอคอนสีม่วงที่มีตัวขาว |
| `--ds-red-strong` | `#c53030` (ขาว 5.47:1) | พื้นปุ่ม `ds-btn--danger`, `ds-badge`, จุดนับ `ds-icon-btn__dot` / `ds-nav__count` (ตัวขาวผ่าน AA) |
| `--ds-primary` | `var(--ds-blue)` | alias: ปุ่มหลัก |
| `--ds-danger` | `var(--ds-red)` | alias: อันตราย |
| `--ds-focus` | `var(--ds-blue)` | alias: เส้นโฟกัส |
| `--ds-on-color` | `#ffffff` | ตัวอักษร/ไอคอนบนพื้นสีเต็มหรือ navy |

ลำดับสีกราฟมาตรฐาน (หลายชุดข้อมูล): blue → sky → green → yellow → orange → red → purple → gray

### 3.4 Brand / navy และค่าคงที่อื่น (เหมือนกันทั้งสองธีม)
| Token | ค่า | ใช้กับ |
|---|---|---|
| `--ds-navy-950` / `-900` / `-800` / `-600` | `#0a1f44` / `#0d2a5c` / `#123a7c` / `#2b6fc7` | sidebar, hero, date card, วงกลมในโลโก้ |
| `--ds-nav-active-a` / `-b` | `#1b62d6` / `#1a52b3` | gradient ของเมนูที่เลือก |
| `--ds-nav-active-edge` | `#7db4ff` | ขอบซ้ายเมนูที่เลือก |
| `--ds-logo` | `#2f7df0` | เฟืองในโลโก้ |
| `--ds-on-navy` / `-2` / `-3` | `#e4ecfa` / `#a9bde0` / `#c9d8f2` | ตัวอักษรบน sidebar / tagline / quote |
| `--ds-on-navy-lead` / `-date` / `-muted` | `#e1ebfb` / `#d5e2f8` / `#c3d3ef` | ข้อความใน hero / date card |
| `--ds-nav-hover` / `--ds-nav-sep` | `rgba(255,255,255,.07)` / `.14` | hover เมนู / เส้นคั่นเมนู |
| `--ds-nav-sub-bg` | `rgba(0,0,0,.16)` (navy เข้มขึ้นเล็กน้อย) | พื้นของกลุ่มเมนูย่อยที่กางอยู่ (`ds-nav__sub`, §5.3a) |
| `--ds-sidebar-grid` | `rgba(140,180,255,.5)` | ลายเส้นตารางใน sidebar |
| `--ds-hero-glow-a` / `-b`, `--ds-sun`, `--ds-cloud` | `#7fb2f5` / `#cfe3ff`, `#ffc83d`, `#f2f6fd` | ภาพประกอบ hero / ไอคอนอากาศ |
| `--ds-grad-sidebar` | navy-950 → navy-900 (55%) → navy-950, 180deg | พื้น sidebar และ `ds-auth__brand` |
| `--ds-grad-nav-active` | nav-active-a → nav-active-b, 90deg | เมนูที่เลือก |
| `--ds-grad-avatar` | blue → navy-900, 135deg | `ds-avatar` |
| `--ds-grad-hero` / `--ds-grad-datecard` | navy-950 → 800 → 600 / navy-900 → 950 | `ds-hero` / `ds-datecard` |
| `--ds-overlay` / `--ds-scrim` | `rgba(8,18,38,.55)` / `.5` | backdrop ของ dialog / ม่านหลัง sidebar มือถือ |
| `--ds-tooltip-bg` | `#10203d` | tooltip และ toast |
| `--ds-shadow-pop` | `0 10px 30px rgba(16,32,61,.18)` · มืด `0 10px 30px rgba(0,0,0,.55)` | ปฏิทิน, `ds-menu`, `ds-popover`, `ds-combo__list`, แผ่น `ds-doc` บนจอ |
| `--ds-font-doc` | `"Sarabun","TH Sarabun New","Kanit",Tahoma,sans-serif` | ฟอนต์ในเอกสาร `ds-doc` เท่านั้น (§6.7) |
| `--ds-doc-paper` / `--ds-doc-ink` / `--ds-doc-line` / `--ds-doc-fill` | `#fff` / `#000` / `#000` / `#f2f2f2` | กระดาษ-ตัวอักษร-เส้นของ `ds-doc` — **เหมือนกันทั้งสองธีมโดยตั้งใจ** (เอกสารเป็นกระดาษขาวเสมอ) ห้ามนำไปใช้นอก `ds-doc` |

ค่าโครงสร้าง (ไม่ใช่สี): `--ds-font`, `--ds-fs-*`, `--ds-fw-*`, `--ds-lh`, `--ds-r-*`, `--ds-gap`, `--ds-sidebar-w` (225px), `--ds-sidebar-w-offcanvas` (240px), `--ds-aside-w` (320px), `--ds-z-topbar` 1020 / `--ds-z-dropdown` 1030 (`ds-menu`, `ds-popover`) / `--ds-z-sidebar` 1045 / `--ds-z-tip` 1080 / `--ds-z-toast` 1090 / `--ds-z-skip` 1100, `--ds-dur-fast` .15s / `--ds-dur` .2s — รายละเอียดใน §4 (z-index ของ modal/dropdown จาก framework เดิมต้องสูงกว่า 1045 ถ้าต้องทับ sidebar มือถือ)

**ตัวแปรระดับคอมโพเนนต์ (knob) ที่ตั้งผ่าน inline style ได้:**
| ตัวแปร | ตั้งบน | ตัวอย่าง |
|---|---|---|
| `--ds-accent` | `ds-kpi__icon`, `ds-legend__dot`, `ds-bar`, `ds-progress`, `ds-quick__btn`, `ds-notes__icon`, `ds-timeline__dot`, `ds-error__icon` | `style="--ds-accent:var(--ds-green)"` |
| `--ds-doc-lines` | `ds-doc__lines` (ค่าเริ่มต้น 3) | `style="--ds-doc-lines:5"` = เส้นบรรทัดว่าง 5 เส้นในเอกสาร A4 |
| `--ds-value` | `ds-progress` | `style="--ds-value:64%"` |
| `--ds-kpi-cols` | `ds-kpis` (ค่าเริ่มต้น 5) | `style="--ds-kpi-cols:4"` |
| `--ds-table-min-w` | `ds-table` (ค่าเริ่มต้น 540px) | `style="--ds-table-min-w:0"` สำหรับตารางแคบ |
| `--ds-btn-bg` / `--ds-btn-ink` | `ds-btn` | ใช้เฉพาะกรณีพิเศษ ปกติใช้ modifier |

### 3.5 กฎการใช้ token
1. **ห้าม hard-code สี** (`#hex`, `rgb()`, `white`, `black`, คลาสสีของ Tailwind/Bootstrap เช่น `text-gray-500`, `bg-white`, `text-danger`) ในหน้าที่ปรับแล้ว → ใช้ token ที่ความหมายตรงที่สุด
2. inline `style` ใช้ได้ **เฉพาะ** ส่ง token ให้ element ที่ขับด้วยข้อมูล: `style="--ds-accent:var(--ds-orange)"`, `style="background:var(--ds-green)"`, `style="--ds-value:42%"`
3. เลือก token ตามความหมาย ไม่ใช่ตามสีที่ "ดูใกล้": ตัวอักษรรอง = `--ds-ink-2` ไม่ใช่ `--ds-gray`; พื้นกล่องรอง = `--ds-surface-2` ไม่ใช่ `--ds-bg`
4. CSS เฉพาะระบบ (ถ้าจำเป็น) ใช้ prefix ของระบบเอง ห้ามใช้ prefix `ds-` และห้ามใช้ `!important` ยกเว้นใน `@media print`
5. **ปรับสีแบรนด์ของระบบ** = override token บน `:root` ในไฟล์ CSS ของระบบที่โหลดหลัง `ds-ui.css` (ห้ามแก้ `ds-ui.css`):
   ```css
   /* my-system.css (โหลดหลัง ds-ui.css) - gradient ตามเองเพราะประกอบจาก token ย่อยบน :root */
   :root{ --ds-navy-950:#1a1446; --ds-navy-900:#241c5e; --ds-logo:#7c5cff; }
   /* ถ้าแก้ token ที่เปลี่ยนตามธีม (§3.1-3.2) ต้องแก้ใน dark ทั้งสองบล็อกด้วย ค่าเท่ากัน: */
   @media screen and (prefers-color-scheme:dark){ :root:not([data-theme="light"]){ /* ... */ } }
   @media screen{ :root[data-theme="dark"]{ /* ... */ } }
   ```
6. **เพิ่ม token ใหม่** (เมื่อไม่มี token ที่ความหมายตรงจริง ๆ): ตั้งชื่อ `--<prefix ระบบ>-…` ในไฟล์ของระบบ (ไม่ใช่ `--ds-`), ถ้าค่าต่างตามธีมให้ประกาศทั้ง light และ **dark ทั้งสองบล็อก** และอ้าง palette เดิมถ้าทำได้ เช่น `--app-overdue: var(--ds-red);`
7. หน้าที่ยังไม่พร้อม dark mode ให้ปักธีมสว่างด้วย `<html lang="th" data-theme="light">` (ค่า `data-theme` ที่ server เขียนมาชนะค่าที่ผู้ใช้บันทึกไว้)

### 3.6 Contrast (WCAG AA) และ token `-strong`
เกณฑ์ที่ kit ผ่านแล้วทั้ง light และ dark: **ข้อความปกติ ≥ 4.5:1**, ข้อความใหญ่ (≥ 24px หรือ ≥ 18.66px ตัวหนา) และ **ไอคอน/กราฟิก/ขอบของ control ≥ 3:1** — อัตราส่วนจริงของแต่ละ token ตรวจจาก `ds-ui.css` (ค่าในไฟล์นั้นชนะตัวเลขใด ๆ ในเอกสารนี้)

| กลุ่ม | สิ่งที่ปรับในรอบ AA | ใช้อย่างไร |
|---|---|---|
| Palette สด `--ds-blue` `--ds-sky` `--ds-green` `--ds-yellow` `--ds-orange` `--ds-red` `--ds-purple` `--ds-gray` | **ไม่เปลี่ยน** (กราฟ/แบรนด์ดูเหมือนเดิม) | ใช้กับกราฟ จุด แถบ ขอบ/เส้นตกแต่ง และพื้นที่ **ไม่มีตัวอักษร** |
| `--ds-*-strong` (blue / green / orange / purple / red) | token ใหม่: โทนเดียวกันแต่เข้มพอให้ตัวขาวผ่าน 4.5:1 (สีที่ผ่านอยู่แล้ว `-strong` มีค่าเท่าสีพื้นฐาน) | พื้นสีเต็มที่มี **ตัวอักษรหรือไอคอนขาว**: `ds-btn` (รวม `--success`/`--danger`), `ds-badge`, จุดนับบนกระดิ่ง/เมนู, `ds-quick__btn`, `ds-kpi__icon`, `ds-notes__icon`, `ds-error__icon` |
| ตัวอักษร `--ds-ink-3`, `--ds-good`, `--ds-bad` | เข้มขึ้นเล็กน้อยในธีมสว่าง (ค่าใน §3.1; ค่าเดิมอยู่ใน comment `AA: was …` ของ `ds-ui.css`) — บน `--ds-surface`: สว่าง ink-3 5.06 (4.50 บน `--ds-bg`), good 4.88, bad 5.07 · มืด ink-3 5.49, good 8.74, bad 6.78; ธีมมืดและ `--ds-link` (5.58 / 7.05) ผ่านอยู่แล้ว | ใช้ตามความหมายเดิม ไม่ต้องแก้ markup |
| placeholder, hover ของปุ่มสีเต็ม | placeholder ของ `ds-input`/`ds-textarea`/ช่องค้นหาใช้ `--ds-ink-3` (≥ 4.5:1); ปุ่มสีเต็มตอน hover **เข้มขึ้น** (เดิมสว่างขึ้นจนตัวขาวไม่ผ่าน) | kit ทำให้ — ห้ามใส่ `opacity` / `filter:brightness(>1)` กับปุ่มหรือข้อความเอง |
| หมึกของ pill `--ds-*-ink` | ทุกคู่ผ่าน 4.5:1 บนพื้น `--ds-*-bg` ของตัวเอง (ปรับเฉพาะ `--ds-pending-ink` ธีมสว่าง ตัวอื่นผ่านอยู่แล้ว) | ใช้คู่ bg/ink ของกลุ่มเดียวกันเท่านั้น |
| ขอบ control (`--ds-line-strong`) | ขอบ input/select/textarea/combobox ≥ 3:1 กับพื้น | kit ใส่ให้ใน `ds-input`/`ds-select`/`ds-textarea` แล้ว — CSS ของระบบที่ทำ control เองใช้ token นี้ |

กฎเวลาเลือกสีเอง (CSS เฉพาะระบบ / inline token):
- ตัวอักษรขาวบนพื้นสี → ใช้ `var(--ds-<สี>-strong)` เสมอ (เช่น `style="background:var(--ds-green-strong)"`); **ห้ามวางตัวขาวบน `--ds-yellow` `--ds-sky` `--ds-gray`** — ใช้พื้นอ่อนคู่หมึก (`--ds-pending-bg` + `--ds-pending-ink`) แทน
- ตัวอักษรบนพื้นอ่อนใช้คู่ `-bg`/`-ink` เดียวกัน; ห้ามเอา palette สด (`--ds-orange`, `--ds-green`) มาเป็นสีตัวอักษรเนื้อหา — ใช้ `--ds-good` / `--ds-bad` / `--ds-*-ink`
- **ภายใน `ds-btn`, `ds-quick__btn`, `ds-kpi__icon`, `ds-notes__icon`, `ds-error__icon` kit แปลงชื่อ palette `--ds-blue/green/orange/purple/red` เป็น `-strong` ให้เอง** (บล็อก `AA FILLS` ใน `ds-ui.css`) → markup เดิม `style="background:var(--ds-green)"`, `style="--ds-accent:var(--ds-orange)"`, `style="--ds-btn-bg:var(--ds-red)"` ผ่าน AA โดยไม่ต้องแก้ (จะเขียน `-strong` ตรง ๆ ก็ได้ผลเท่ากัน); กราฟ จุด legend แถบ bar/progress และจุด timeline ยังใช้ palette สดตามเดิม
- CSS ของระบบเองที่วางตัวขาวบนพื้นสี (นอกคอมโพเนนต์ข้างบน) ต้องเขียน `var(--ds-<สี>-strong)` เอง
- ใช้ได้เฉพาะ `-strong` ที่ **มีอยู่จริง** ใน `ds-ui.css` (`grep -- '-strong:' ds-ui.css`) — ห้ามตั้ง `--ds-*-strong` ใหม่เอง
- ตรวจเอง: DevTools → Inspect ตัวอักษร → ดู "Contrast ratio" (ต้องมีเครื่องหมายผ่าน AA) หรือ Lighthouse → Accessibility ทั้งสองธีม

---

## 4. ตัวอักษร ระยะ มุมโค้ง เงา และ breakpoint

### 4.1 Type scale (ฟอนต์เดียว: Kanit ผ่าน `--ds-font`)
| ขนาด | น้ำหนัก | Token | ใช้กับ |
|---|---|---|---|
| 30px | 600 | — | ชื่อระบบใน sidebar (`ds-sidebar__name`) |
| 28px | 500 | `--ds-fs-3xl` | ตัวเลข KPI (`ds-kpi__value`), หัวข้อ hero |
| 22px | 500 | — | หัวข้อหน้า h2 (`ds-page-head__title`) |
| 19px | 600 | `--ds-fs-2xl` | โลโก้ย่อใน topbar |
| 17px | 500 | `--ds-fs-xl` | หัว dialog |
| 16px | 500 | `--ds-fs-lg` | หัวพาเนล h3 (`ds-panel__title`) |
| 15px | 400 | — | ชื่อระบบใน topbar h1 (`ds-topbar__title`) |
| 14px | 300 | `--ds-fs-md` | **เนื้อหาหลัก**, input, select |
| 13px | 300 | — | คำอธิบายใต้หัวข้อหน้า (`ds-page-head__sub`), toast |
| 12.5px | 400 | `--ds-fs-sm` | ปุ่ม `ds-btn`, pager |
| 12px | 300 | — | เนื้อหาตาราง `ds-table td` |
| 11.5px | 400–500 | `--ds-fs-xs` | หัวตาราง `th` (500), pill (400) |
| 10.5px | 300 / 500 | `--ds-fs-2xs` | tagline ใต้ชื่อระบบใน sidebar (300), ตัวเลขบนจุด `ds-icon-btn__dot` (500) |

- น้ำหนัก: `--ds-fw-light` 300 (เนื้อหา) · `--ds-fw-regular` 400 · `--ds-fw-medium` 500 (`<strong>`, `<b>`, หัวข้อ, `th`) · `--ds-fw-bold` 600 (wordmark แบรนด์เท่านั้น) · line-height `--ds-lh` 1.5
- ห้ามใช้ 700/bold ในเนื้อหา; ห้ามใช้ฟอนต์อื่นปน (ยกเว้น Sarabun ภายใน `ds-doc` — §2.4, §6.7); ตัวเลขในตาราง/KPI ใส่ `ds-num` (tabular-nums)
- ลำดับหัวข้อ: **h1 = ชื่อระบบใน topbar (หน้าละหนึ่ง)**, h2 = หัวข้อหน้า, h3 = หัวพาเนล — ห้ามข้ามลำดับ; หน้าที่ไม่มี topbar: h1 = `ds-auth__title` / `ds-error__title` / ชื่อเอกสารใน `ds-doc__head`; หัวแผงการแจ้งเตือน `ds-popover__title` เป็น h2

### 4.2 ระยะห่าง (spacing)
| ตำแหน่ง | ค่า |
|---|---|
| ช่องไฟระหว่างบล็อก/การ์ด/คอลัมน์ grid (`ds-content`, `ds-grid`, `ds-stack`, `ds-kpis`) | `--ds-gap` = 12px |
| padding ของ `ds-content` | 12px บน · 16px ซ้าย/ขวา · 18px ล่าง |
| padding ของพาเนล (`ds-panel`) | 14px 16px; หัวพาเนลห่างเนื้อหา 12px |
| padding ของ KPI (`ds-kpi`) | 14px 16px 12px |
| topbar / footer | 10px 20px, ช่องไฟใน topbar 14px |
| เมนู sidebar | 12px 22px ต่อรายการ, ไอคอนห่างข้อความ 14px |

กฎ: จัดระยะด้วย container ของ kit (`ds-stack`, `ds-grid`, `ds-content`) ไม่ใช่ margin ของแต่ละ element; ถ้าต้องมีระยะเฉพาะหน้า ใช้พหุคูณของ 4px (4/8/12/16/20/24)

### 4.3 มุมโค้ง (radius) และเงา
| Token | ค่า | ใช้กับ |
|---|---|---|
| `--ds-r-xs` | 3px | แถบตกแต่งเล็ก |
| `--ds-r-sm` | 6px | ปุ่ม `ds-btn`, tooltip |
| `--ds-r-md` | 8px | input/select/textarea, icon button, `ds-btn--lg`, quick action |
| `--ds-r-lg` | 10px | **พาเนล, KPI, hero, กล่องไอคอน KPI** |
| `--ds-r-xl` | 14px | dialog |
| `--ds-r-pill` | 99px | pill, badge, ช่องค้นหา, รางกราฟแท่ง, toast |

เงามีชุดเดียว: `--ds-shadow` บนพื้นผิวลอย (พาเนล, KPI, การ์ด) และ `--ds-shadow-up` สำหรับแถบ sticky ด้านล่าง — ธีมมืดไม่มีเงา (แยกชั้นด้วยสีพื้นแทน) ห้ามสร้างเงาใหม่ ห้ามใส่ border ให้พาเนล

### 4.4 Breakpoint (max-width; ค่าคงที่ ไม่ใช่ token)
| ≤ ความกว้าง | สิ่งที่เปลี่ยน |
|---|---|
| **1280px** | `ds-kpis` 5 → 3 คอลัมน์; `ds-grid--dash-a` / `--dash-b` → 2 คอลัมน์ โดยบล็อกแรกกินเต็มแถว; `ds-grid--4` → 2 คอลัมน์; หน้า login ลด padding ฝั่งแบรนด์ |
| **900px** | sidebar กลายเป็น **off-canvas** กว้าง 240px (เปิดด้วยปุ่ม hamburger `ds-menu-btn` ที่เพิ่งแสดง); `.ds-app` เหลือ 1 คอลัมน์; ชื่อระบบ h1 และชื่อผู้ใช้ใน topbar ถูกซ่อนแบบ visually-hidden; `ds-grid--dash-a\|--dash-b\|--aside\|--3` → 1 คอลัมน์; hero ซ้อนแนวตั้งและซ่อน quote; login ซ้อนเป็นแบนเนอร์ด้านบน |
| **620px** | `ds-menu` / `ds-popover` (เมนูผู้ใช้, แผงแจ้งเตือน) กลายเป็นแผ่นเต็มกว้างใต้ topbar (`position:fixed`, ขอบซ้าย-ขวา 8px); `ds-grid--2` / `--4` → 1 คอลัมน์; `ds-kpis` → 2 คอลัมน์ (ไอคอน 44px, ตัวเลข 24px); `ds-form` → 1 คอลัมน์; `ds-filters` ช่องละแถว; `ds-pager` ซ้อนกึ่งกลาง; ปุ่มใน `ds-form-actions` ขยาย; ปุ่ม `ds-page-head__actions` ชิดซ้ายเมื่อตกลงใต้หัวข้อ |
| **400px** | `ds-kpis` และ `ds-quick` → 1 คอลัมน์; ปุ่ม page-head เต็มความกว้าง; `ds-choice-group` เรียงแนวตั้ง; ปุ่ม `ds-form-actions` ซ้อน (ปุ่มหลักอยู่บน) |

- ตารางไม่ถูกย่อที่ breakpoint ใด — เลื่อนแนวนอนภายใน `ds-table-wrap` เสมอ (ห้ามให้ทั้งหน้ามี scroll แนวนอน)
- CSS เฉพาะหน้าที่ต้องตอบสนองขนาดจอ ใช้ 4 ค่านี้เท่านั้น เช่น `@media (max-width:900px){…}`
- ต้องการ sidebar ติดจอตอนเลื่อนบน desktop: เพิ่ม `ds-sidebar--sticky` ที่ `<aside class="ds-sidebar">` (opt-in, มีผลเฉพาะ >900px)

---

### 4.5 การเคลื่อนไหว (Motion) — kit ทำให้แล้ว ไม่ต้องเขียนเพิ่ม
| จุด | ผล | ระยะเวลา |
|---|---|---|
| ย่อ/ขยาย sidebar (desktop) | คอลัมน์เลื่อนแคบ/กว้าง, ชื่อเมนูจางหาย/ปรากฏ, ลูกศร ‹ ในปุ่มวงกลมหมุนกลับเป็น › | `--ds-dur-slide` .28s |
| เมนูผู้ใช้, แจ้งเตือน, ปฏิทินไทย, รายการ combobox | เลื่อนลงจางเข้า | `--ds-dur-fast` .15s |
| เมนูย่อยใน sidebar, แผงแท็บ | จางเข้า | `--ds-dur` .2s |
| dialog / ม่านหลัง dialog | ลอยขึ้นเล็กน้อย + จางเข้า | .2s |
| toast | ลอยขึ้นจากด้านล่าง | .2s |
| ปุ่ม `ds-btn` / `ds-icon-btn` | กดแล้วยุบลง 1px; `ds-quick__btn` ยกขึ้น 2px ตอน hover | ทันที / .15s |
| **โหลดหน้าครั้งแรกเท่านั้น** | การ์ด KPI ลอยขึ้นทีละใบ, แท่ง `ds-bar`/`ds-progress` ยืดจากซ้าย, donut/pie หมุนเข้า | .35–.7s |
| สลับธีมสว่าง/มืด | สีค่อย ๆ เปลี่ยน | .3s |

- ภาพเคลื่อนไหวตอนโหลดเล่นแค่ครั้งแรก (kit ใส่ `html.ds-ready` หลังโหลด ~1 วินาที) — การ render ซ้ำ เช่น พิมพ์ค้นหา/เปลี่ยนสถานะ จะไม่เล่นซ้ำ
- ผู้ใช้ที่ตั้ง "ลดการเคลื่อนไหว" (prefers-reduced-motion) ในเครื่อง ภาพเคลื่อนไหวทั้งหมดถูกปิดอัตโนมัติ
- ห้าม: ใส่ animation/transition ของตัวเองที่ยาวเกิน .3s สำหรับการโต้ตอบ, animation วนไม่รู้จบ (ยกเว้น `ds-spinner`/`ds-skeleton`), หรือใช้ไลบรารี animation เพิ่ม — ถ้าต้องการ ให้ใช้ token `--ds-dur-fast` / `--ds-dur` / `--ds-dur-slide` และ `--ds-ease-out`
## 5. โครงหน้า (App shell)

### 5.1 Skeleton (ย่อจาก `template1/pages/starter.html` — ลำดับและชื่อคลาสต้องตรงตามนี้)
```html
<!DOCTYPE html>
<html lang="th">
<head> …ตาม §2.2… </head>
<body class="ds-body">
<a class="ds-skip-link" href="#ds-main">ข้ามไปยังเนื้อหาหลัก</a>          <!-- 1) focusable ตัวแรกของหน้า -->
<div class="ds-app">                                                     <!-- 2) grid 225px | 1fr -->

  <aside class="ds-sidebar" id="ds-sidebar" aria-label="แถบด้านข้าง">     <!-- 3) id ต้องเป็น ds-sidebar -->
    <div class="ds-sidebar__brand">
      <svg class="ds-sidebar__logo" width="50" height="50" viewBox="0 0 48 48" aria-hidden="true">…โลโก้ระบบ…</svg>
      <div>
        <b class="ds-sidebar__name">SMMS</b>
        <small class="ds-sidebar__tagline">Smart Maintenance &amp;<br>Asset Service Management</small>
      </div>
    </div>
    <nav class="ds-nav" aria-label="เมนูหลัก">
      <a class="ds-nav__item" href="dashboard.html" aria-current="page"><svg class="ds-ic" aria-hidden="true"><use href="#ds-i-home"></use></svg>แดชบอร์ดภาพรวม</a>
      <a class="ds-nav__item" href="list.html"><svg class="ds-ic" aria-hidden="true"><use href="#ds-i-doc"></use></svg>รายการแจ้งซ่อม <span class="ds-nav__count ds-num">9<span class="ds-sr-only"> รายการเกินกำหนด</span></span></a>
      <hr class="ds-nav__sep">
      <div class="ds-nav__group">                                         <!-- กลุ่มเมนูย่อย (§5.3a) -->
        <button type="button" class="ds-nav__item ds-nav__toggle" aria-expanded="false" aria-controls="ds-nav-settings"><svg class="ds-ic" aria-hidden="true"><use href="#ds-i-gear"></use></svg>ตั้งค่า<svg class="ds-ic ds-ic--sm ds-nav__caret" aria-hidden="true"><use href="#ds-i-chevron-down"></use></svg></button>
        <div class="ds-nav__sub" id="ds-nav-settings" hidden>
          <a class="ds-nav__item ds-nav__subitem" href="#">ตั้งค่าบริษัท</a>
          <a class="ds-nav__item ds-nav__subitem" href="#">ผู้ใช้งานและสิทธิ์</a>
        </div>
      </div>
    </nav>
    <div class="ds-sidebar__quote"><p>“ดูแลทุกสินทรัพย์<br>ให้พร้อมใช้งาน<small>เพื่อองค์กรที่เดินหน้าได้ไกลกว่า”</small></p><em>Maintain Today<br>for a Better Tomorrow</em></div>
  </aside>

  <div class="ds-main">                                                  <!-- 4) คอลัมน์ขวา: topbar + content + footer -->
    <header class="ds-topbar">
      <button type="button" class="ds-icon-btn ds-menu-btn" data-ds-sidebar-toggle aria-controls="ds-sidebar" aria-expanded="false" aria-label="เปิดเมนู"><svg class="ds-ic" aria-hidden="true"><use href="#ds-i-menu"></use></svg></button>
      <span class="ds-topbar__logo"><svg class="ds-ic" aria-hidden="true"><use href="#ds-i-gear"></use></svg>SMMS</span>
      <h1 class="ds-topbar__title">ชื่อเต็มของระบบ</h1>
      <button type="button" class="ds-icon-btn ds-search-btn" data-ds-search-toggle aria-controls="ds-search" aria-expanded="false" aria-label="ค้นหา"><svg class="ds-ic" aria-hidden="true"><use href="#ds-i-search"></use></svg></button>   <!-- แสดงเฉพาะ ≤620px -->
      <label class="ds-search" id="ds-search"><input type="search" name="q" placeholder="ค้นหา..." aria-label="ค้นหา" autocomplete="off"><svg class="ds-ic" aria-hidden="true"><use href="#ds-i-search"></use></svg></label>
      <button type="button" class="ds-icon-btn" data-ds-theme-toggle aria-label="สลับโหมดสว่าง/มืด" data-ds-tip="สลับโหมดสว่าง / มืด"><svg class="ds-ic" aria-hidden="true"><use href="#ds-i-sun"></use></svg></button>
      <div class="ds-dropdown">                                           <!-- การแจ้งเตือน (§5.3b, §8.24) -->
        <button type="button" class="ds-icon-btn" data-ds-dropdown aria-controls="ds-notif-panel" aria-expanded="false"
                aria-haspopup="true" aria-label="การแจ้งเตือน (ยังไม่อ่าน 3 รายการ)">
          <svg class="ds-ic" aria-hidden="true"><use href="#ds-i-bell"></use></svg><span class="ds-icon-btn__dot ds-num" aria-hidden="true">3</span>
        </button>
        <div class="ds-popover" id="ds-notif-panel" hidden>
          <div class="ds-popover__head">
            <h2 class="ds-popover__title">การแจ้งเตือน</h2>
            <button type="button" class="ds-link-btn" data-ds-notif-readall>อ่านทั้งหมดแล้ว</button>
          </div>
          <ul class="ds-notes ds-popover__body">
            <li class="ds-notes__item is-unread">
              <span class="ds-notes__icon" style="background:var(--ds-red)"><svg class="ds-ic" aria-hidden="true"><use href="#ds-i-bell"></use></svg></span>
              <span><a class="ds-notes__link" href="list.html">มีงานค้างเกินกำหนด 9 รายการ</a><small class="ds-notes__time ds-num">15/05/2568 09:00</small></span>
            </li>
            <!-- …รายการอื่น (ยังไม่อ่าน = is-unread) -->
          </ul>
          <div class="ds-popover__foot"><a class="ds-link-btn" href="#">ดูการแจ้งเตือนทั้งหมด →</a></div>
        </div>
      </div>
      <div class="ds-dropdown">                                           <!-- เมนูผู้ใช้ (§5.3b, §8.23) -->
        <button type="button" class="ds-user" data-ds-dropdown aria-controls="ds-user-menu" aria-expanded="false" aria-haspopup="menu">
          <span class="ds-avatar" aria-hidden="true">ส</span>
          <span class="ds-user__meta"><b>สมชาย ใจดี</b><small>ผู้จัดการ (SUPERVISOR)</small></span>
          <svg class="ds-ic ds-ic--sm ds-user__caret" aria-hidden="true"><use href="#ds-i-chevron-down"></use></svg>
        </button>
        <div class="ds-menu" id="ds-user-menu" role="menu" aria-label="เมนูผู้ใช้" hidden>
          <div class="ds-menu__header" role="none"><b>สมชาย ใจดี</b><small>somchai.j@example.go.th</small></div>
          <a class="ds-menu__item" role="menuitem" href="#"><svg class="ds-ic" aria-hidden="true"><use href="#ds-i-user"></use></svg>ข้อมูลส่วนตัว</a>
          <a class="ds-menu__item" role="menuitem" href="#"><svg class="ds-ic" aria-hidden="true"><use href="#ds-i-lock"></use></svg>เปลี่ยนรหัสผ่าน</a>
          <hr class="ds-menu__sep">
          <!-- production: ออกจากระบบต้องส่งแบบ POST + CSRF (§5.3b) — template ใช้ลิงก์ไป login.html -->
          <a class="ds-menu__item ds-menu__item--danger" role="menuitem" href="login.html"><svg class="ds-ic" aria-hidden="true"><use href="#ds-i-logout"></use></svg>ออกจากระบบ</a>
        </div>
      </div>
    </header>

    <main class="ds-content" id="ds-main" tabindex="-1">                <!-- 5) เนื้อหาเฉพาะหน้าเริ่มตรงนี้ -->
      <div class="ds-page-head">
        <div class="ds-page-head__main">
          <nav class="ds-breadcrumb" aria-label="เส้นทางนำทาง"><ol><li><a href="dashboard.html">หน้าหลัก</a></li><li aria-current="page">หน้าใหม่</li></ol></nav>
          <h2 class="ds-page-head__title">หน้าใหม่</h2>
          <p class="ds-page-head__sub">คำอธิบายหน้า 1 บรรทัด</p>
        </div>
        <div class="ds-page-head__actions">
          <button type="button" class="ds-btn ds-btn--ghost"><svg class="ds-ic" aria-hidden="true"><use href="#ds-i-download"></use></svg>ส่งออก</button>
          <button type="button" class="ds-btn"><svg class="ds-ic" aria-hidden="true"><use href="#ds-i-plus"></use></svg>สร้างรายการใหม่</button>
        </div>
      </div>
      <section class="ds-panel" aria-labelledby="p1-title">
        <div class="ds-panel__head">
          <h3 class="ds-panel__title" id="p1-title">หัวข้อพาเนล (Panel Title)</h3>
          <div class="ds-panel__tools"><select class="ds-select ds-select--sm" aria-label="ช่วงเวลา"><option>เดือนนี้</option></select></div>
        </div>
        <p>เนื้อหา</p>
      </section>
    </main>                                                              <!-- 6) เนื้อหาเฉพาะหน้าจบตรงนี้ -->

    <footer class="ds-footer">
      <span class="ds-footer__brand"><svg class="ds-ic" aria-hidden="true"><use href="#ds-i-gear"></use></svg>SMMS</span><span>Version 1.0.0</span><span aria-hidden="true">|</span><span>ชื่อเต็มของระบบ</span>
      <span class="ds-footer__spacer">© 2025 ชื่อหน่วยงาน | All rights reserved.</span>
    </footer>
  </div>
</div>
</body>
</html>
```
หมายเหตุ: ไม่มี `<script>` ใน shell — `ds-ui.js` ใน `<head>` ฉีด icon sprite (`#ds-i-*`) และผูก sidebar/ธีม/tooltip/dialog/tabs/dropdown (เมนูผู้ใช้ + แผงแจ้งเตือน)/กลุ่มเมนูย่อย ให้เอง script เฉพาะหน้าให้วางท้าย `<body>`
- id ของ shell ที่ต้องใช้ตามนี้: `ds-sidebar`, `ds-main`, `ds-search`, `ds-notif-panel`, `ds-user-menu`, `ds-nav-<กลุ่ม>` (ปุ่ม `aria-controls` ต้องชี้ id ที่มีอยู่จริง)
- ลำดับใน topbar: เมนู · โลโก้ย่อ · h1 · ปุ่มค้นหา · ช่องค้นหา · ธีม · การแจ้งเตือน · เมนูผู้ใช้ (ห้ามเพิ่มปุ่มอื่นจนต้องขึ้นแถวใหม่ — เมนูเสริมใส่ใน `ds-menu` ของผู้ใช้)

### 5.2 อะไรเป็น layout กลาง อะไรเป็นของแต่ละหน้า
| ส่วน | อยู่ที่ | แต่ละหน้าเปลี่ยนได้แค่ |
|---|---|---|
| `<head>`, skip link, `ds-app`, sidebar, topbar | layout กลาง (header partial / Blade layout) | `<title>` และเมนูที่มี `aria-current` (ผ่านตัวแปร) |
| `<main class="ds-content" id="ds-main">` (ตัว element) | layout กลาง | — |
| page head (breadcrumb, h2, sub, actions) + พาเนลทั้งหมด | **หน้าแต่ละหน้า** | ทั้งหมด |
| footer + ปิด `ds-main`/`ds-app`/`body` | layout กลาง (footer partial) | — |
| script เฉพาะหน้า (กราฟ, flash toast) | ท้ายหน้า (Blade: `@push('scripts')`) | ทั้งหมด |

- ชื่อ, ตำแหน่ง, อีเมล, ตัวอักษรย่อบน avatar, รายการ/จำนวนแจ้งเตือนที่ยังไม่อ่าน, ตัวเลข `ds-nav__count` มาจาก session/server ใน layout กลาง; ค่าเป็น 0 ให้ **ไม่ต้อง render** `<span>` ตัวนับ และ `aria-label` ของปุ่มกระดิ่งเป็น `การแจ้งเตือน` เฉย ๆ (มีค่า > 0 = `การแจ้งเตือน (ยังไม่อ่าน N รายการ)`) — ดู §5.3b
- `ds-avatar` ใส่รูปได้: `<span class="ds-avatar"><img src="…" alt=""></span>`
- เมนูแบ่งกลุ่มด้วย `<hr class="ds-nav__sep">` และหัวกลุ่มเล็ก (ไม่บังคับ) ด้วย `ds-nav__label`; เมนูที่มีหน้าย่อยหลายหน้า (ตั้งค่า, ข้อมูลหลัก, รายงาน) ใช้กลุ่มพับได้ `ds-nav__group` (§5.3a) แทนการเรียงยาว
- เมนูที่ผู้ใช้ไม่มีสิทธิ์ → ไม่ render (อย่าซ่อนด้วย CSS); ระบบที่ไม่มี quote ลบ `ds-sidebar__quote` ได้
- global search ที่ต้อง submit: เปลี่ยน `<label class="ds-search">` เป็น `<form class="ds-search" role="search" action="…" method="get">` (input คง `name="q"`)

### 5.3 `aria-current` ของเมนู
- ใส่ `aria-current="page"` บน `<a class="ds-nav__item">` ของหน้าปัจจุบัน **หนึ่งรายการพอดี** (เป็นตัวทำให้แถบ active แสดง — ไม่มีคลาส `active`)
- หน้าย่อย (เช่น แก้ไข/รายละเอียดของรายการ) ให้เมนูแม่เป็น current (เช่น `repairs.*` ทั้งหมด → "รายการแจ้งซ่อม")
- breadcrumb: `<li aria-current="page">` คือรายการสุดท้าย (ไม่ใช่ลิงก์)
- เมนูใช้ `<a href>` จริงเสมอ (ไม่ใช้ `<button>` + JS routing) — ยกเว้นปุ่มหัวกลุ่ม `ds-nav__toggle` ซึ่งเป็น `<button>` เพราะแค่พับ/กาง ไม่ได้ไปหน้าใด
- หน้าที่อยู่ในกลุ่มเมนูย่อย: `aria-current="page"` อยู่ที่ **`ds-nav__subitem`** ตัวนั้น (ไม่ใช่ที่ปุ่มหัวกลุ่ม) และ server ต้อง render กลุ่มนั้นให้เปิดอยู่แล้ว — §5.3a

### 5.3a กลุ่มเมนูย่อย (nav group) — ตั้งค่าจาก server
```html
<div class="ds-nav__group">
  <button type="button" class="ds-nav__item ds-nav__toggle has-current" aria-expanded="true" aria-controls="ds-nav-settings"><svg class="ds-ic" aria-hidden="true"><use href="#ds-i-gear"></use></svg>ตั้งค่า<svg class="ds-ic ds-ic--sm ds-nav__caret" aria-hidden="true"><use href="#ds-i-chevron-down"></use></svg></button>
  <div class="ds-nav__sub" id="ds-nav-settings">                <!-- เปิดอยู่ = ไม่มี hidden -->
    <a class="ds-nav__item ds-nav__subitem" href="settings-company.php">ตั้งค่าบริษัท</a>
    <a class="ds-nav__item ds-nav__subitem" href="users.php" aria-current="page">ผู้ใช้งานและสิทธิ์</a>
  </div>
</div>
```
| สถานะกลุ่ม | ปุ่ม `ds-nav__toggle` | `div.ds-nav__sub` |
|---|---|---|
| ปิด (หน้าปัจจุบันไม่อยู่ในกลุ่ม) | `aria-expanded="false"` | มี `hidden` |
| **เปิด เพราะหน้าปัจจุบันอยู่ในกลุ่ม** | `aria-expanded="true"` + คลาส `has-current` (ชื่อกลุ่มหนา 500) | ไม่มี `hidden`; ลูกที่เป็นหน้าปัจจุบันมี `aria-current="page"` |

- **render สถานะเปิดจาก server เสมอ** (PHP §7a / Blade §7b มีตัวอย่าง loop ที่ทำให้แล้ว) — `ds-ui.js` ก็เปิดกลุ่มที่มี `[aria-current="page"]` ให้ตอนโหลดอยู่แล้ว แต่ถ้าพึ่ง JS อย่างเดียว เมนูจะกระตุกตอนโหลดและพังเมื่อ JS ไม่ทำงาน
- กลุ่มที่ผู้ใช้กางเองระหว่างใช้งาน kit จำไว้ให้ใน sessionStorage (`ds-nav-open`, เฉพาะแท็บนั้น) — server ไม่ต้องจำ; server รับผิดชอบแค่กลุ่มของหน้าปัจจุบัน
- id ของ `ds-nav__sub` = `ds-nav-<key กลุ่ม>` ไม่ซ้ำกันในหน้า; `aria-controls` ของปุ่มชี้ id นี้
- ลูกในกลุ่มไม่มีไอคอน (ข้อความเยื้องตรงกับชื่อแม่เอง); กลุ่มซ้อนกลุ่มไม่รองรับ (ลึกได้ 1 ชั้น) — ถ้าระบบเดิมมี 3 ชั้น ให้ชั้นที่ 3 เป็นแท็บ (`ds-tabs` แบบลิงก์) ในหน้านั้นแทน
- ตัวนับ `ds-nav__count` ใส่ได้ทั้งที่ปุ่มกลุ่มและลูก (วางท้ายข้อความ ก่อน `ds-nav__caret`)
- โหมดแถบไอคอน (sidebar ย่อ §5.4a): ลูกถูกซ่อน กดปุ่มกลุ่ม = sidebar ขยายกลับแล้วกางกลุ่มให้ (kit ทำเอง); drawer มือถือทำงานเหมือน desktop
- ผู้ใช้ไม่มีสิทธิ์เห็นลูกทุกตัว → ไม่ render ทั้งกลุ่ม; เหลือลูกตัวเดียว → render เป็น `ds-nav__item` ธรรมดาแทนกลุ่ม

### 5.3b Topbar: การแจ้งเตือน + เมนูผู้ใช้ (ข้อมูลจาก server)
- โครง markup ลอกจาก §5.1 / `starter.html` ตรงตัว (`ds-dropdown` > ปุ่ม `data-ds-dropdown` + `aria-controls` > `ds-popover`/`ds-menu` ที่มี `hidden`) — พฤติกรรมเปิด/ปิด คีย์บอร์ด Esc คลิกนอก kit ทำให้ทั้งหมด ห้ามเขียน JS เปิดเมนูเอง
- **การแจ้งเตือน**: server render `li.ds-notes__item` (ล่าสุดก่อน, ไม่เกิน ~6 รายการ) ใส่ `is-unread` ให้รายการที่ยังไม่อ่าน, ลิงก์ `ds-notes__link` ไปหน้าที่เกี่ยวข้อง, เวลาเป็น พ.ศ.; ไม่มีรายการ → `<li class="ds-notes__item ds-muted">ไม่มีการแจ้งเตือนใหม่</li>` (และไม่ render ปุ่ม "อ่านทั้งหมดแล้ว")
- ปุ่ม `data-ds-notif-readall` เปลี่ยนแค่หน้าจอ (ลบ `is-unread`, ซ่อนจุดนับ, เปลี่ยน `aria-label`) แล้วยิง event `ds:notif-readall` — **ระบบต้องบันทึกสถานะอ่านแล้วเอง** โดยฟัง event นี้แล้วส่ง POST ไป endpoint ของระบบ (ไม่มี endpoint = ไม่ต้องใส่ปุ่มนี้):
  ```js
  document.addEventListener('ds:notif-readall', function () {
    fetch('/notifications/read-all', {method: 'POST', headers: {'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]').content}});
  });
  ```
- **เมนูผู้ใช้**: ชื่อ/ตำแหน่ง/อีเมลจาก session (escape เสมอ); ลิงก์ในเมนูเป็น `a.ds-menu__item[role=menuitem]`; เมนูที่ระบบไม่มี (เช่น เปลี่ยนรหัสผ่านใน SSO) → ไม่ render
- **ออกจากระบบ = POST + CSRF** (route `logout` ของ Laravel/Breeze/Fortify เป็น POST — ลิงก์ GET จะได้ 405/419): วาง `<form>` ซ่อนไว้นอก `ds-menu` แล้วให้ปุ่มในเมนูอ้างด้วย attribute `form` — โครงเมนูจึงยังเป็น menuitem เรียงกันตรง ๆ
  ```blade
  <button type="submit" form="logout-form" class="ds-menu__item ds-menu__item--danger" role="menuitem"><svg class="ds-ic" aria-hidden="true"><use href="#ds-i-logout"></use></svg>ออกจากระบบ</button>
  {{-- …ปิด </div> ของ ds-menu และ ds-dropdown… แล้ววางฟอร์มไว้ท้าย topbar --}}
  <form id="logout-form" method="post" action="{{ route('logout') }}" hidden>@csrf</form>
  ```
  PHP ธรรมดา: `action="logout.php"` + hidden input CSRF เดิมของระบบ (เช่น `<input type="hidden" name="csrf_token" value="<?= h($_SESSION['csrf_token']) ?>">`) — **ถ้าระบบเดิมออกจากระบบด้วยลิงก์ GET และ backend ไม่ได้ตรวจ CSRF ให้คง `<a class="ds-menu__item ds-menu__item--danger" role="menuitem" href="(URL เดิม)">` ไว้** (ห้ามเปลี่ยน backend เอง — §13 ขั้น 6; แจ้งผู้ใช้เป็นข้อเสนอแนะแทน)

### 5.4 Sidebar off-canvas (≤900px)
- ปุ่ม `ds-menu-btn` ต้องมี `data-ds-sidebar-toggle` + `aria-controls="ds-sidebar"` + `aria-expanded="false"`; `ds-ui.js` จะ toggle `.ds-sidebar.is-open`, ซิงก์ `aria-expanded`, ย้ายโฟกัสเข้าเมนู (ไปที่รายการ current ก่อน), ปิดด้วย Esc/คลิกนอก, ล็อก scroll และทำให้หน้าเบื้องหลัง `inert`
- ปุ่มปิดภายใน sidebar (ถ้าต้องการ): `<button type="button" class="ds-icon-btn" data-ds-sidebar-close aria-label="ปิดเมนู"><svg class="ds-ic" aria-hidden="true"><use href="#ds-i-x"></use></svg></button>`
- สั่งจาก JS: `DS.sidebar.open()` / `.close()` / `.toggle()` / `.isOpen()`; ฟัง event `ds:sidebar` (detail `{open}`) บน sidebar
- ห้ามเขียน CSS/JS ของตัวเองเพื่อซ่อน-แสดง sidebar และห้ามเปลี่ยน `id="ds-sidebar"`

### 5.4a ย่อ/ซ่อน sidebar บนจอใหญ่ (>900px)
- ปุ่ม `ds-menu-btn` ตัวเดิมแสดงบน desktop ด้วย และ `ds-ui.js` เปลี่ยนไอคอนให้เอง: บน desktop ปุ่มกลายเป็น **วงกลมเล็กคร่อมเส้นแบ่งระหว่าง sidebar สีกรมท่ากับพื้นที่เนื้อหา** ระดับเดียวกับ topbar มีลูกศร ‹ (ย่อ) / › (ขยาย) พร้อม tooltip "ย่อเมนู"/"ขยายเมนู" (CSS จัดตำแหน่งเอง ปุ่มต้องเป็นลูกตัวแรกของ `.ds-topbar` ตาม starter.html), บนมือถือเป็น ☰ ใน topbar ตามปกติ — ใน markup ใส่ `#ds-i-menu` ตามเดิม; กดแล้ว sidebar **ย่อเหลือแถบไอคอน 72px** (ชื่อเมนูกลายเป็น tooltip, ตัวเลข `ds-nav__count` เกาะมุมไอคอน) กดอีกครั้งขยายกลับ — ไม่ต้องเขียนโค้ดเพิ่ม แค่ใช้ shell จาก starter.html
- สถานะจำไว้ต่อเบราว์เซอร์ (localStorage `ds-sidebar`) และตั้งค่าใน `<head>` ก่อนแสดงผล จึงไม่กระพริบเมื่อเปลี่ยนหน้า; เซิร์ฟเวอร์จะพิมพ์ `<html data-ds-sidebar="collapsed">` เองก็ได้ (เช่นจาก cookie/ค่าผู้ใช้)
- ต้องการซ่อนทั้งแถบแทนแถบไอคอน: ใส่ `<script>DS.config.sidebarCollapse = 'hide';</script>` หลังโหลด ds-ui.js (ได้ `data-ds-sidebar="hidden"`)
- สั่งจาก JS: `DS.sidebar.collapse()` / `.expand()` / `.toggleCollapse()` / `.isCollapsed()`; event `ds:sidebar` มี `detail.collapsed`
- ชื่อเมนูต้องเป็นข้อความใน `<a class="ds-nav__item">` (ตามด้วยไอคอน `ds-ic` ตัวแรก) — ห้ามใส่ข้อความใน `<span>` ที่ตั้งขนาดตัวอักษรเอง เพราะโหมดไอคอนซ่อนข้อความด้วย `font-size:0`
- จอ ≤900px ปุ่มเดิมยังเปิด drawer ตาม §5.4 (สถานะย่อไม่มีผลบนมือถือ)
- กลุ่มเมนูย่อย (§5.3a) ในโหมดแถบไอคอน: ซ่อนลูกและลูกศร ▾; กดไอคอนกลุ่ม = ขยาย sidebar แล้วกางกลุ่มนั้น
- **ชื่อระบบไม่แสดงซ้ำ**: ขณะ sidebar เต็ม (มีโลโก้+ชื่อย่อแล้ว) topbar ซ่อน `ds-topbar__logo` เหลือแค่ชื่อเต็ม `ds-topbar__title` (บรรทัดเดียว ตัด … เมื่อที่ไม่พอ); โลโก้ย่อบน topbar กลับมาเองเมื่อ sidebar ถูกย่อ/ซ่อน และบนมือถือ — ยังต้องใส่ `ds-topbar__logo` ใน markup ตาม starter.html
- topbar เป็นแถวเดียวเสมอตั้งแต่ 621px ขึ้นไป (ช่องค้นหาหดได้, ชื่อระบบตัด …) — ห้ามใส่ element เพิ่มใน topbar จนต้องขึ้นบรรทัดใหม่

### 5.5 Skip link
- `<a class="ds-skip-link" href="#ds-main">ข้ามไปยังเนื้อหาหลัก</a>` เป็นลูกตัวแรกของ `<body>` มองเห็นเฉพาะตอนได้โฟกัส
- เป้าหมายคือ `<main class="ds-content" id="ds-main" tabindex="-1">` (id อยู่บน `main` **ไม่ใช่** `div.ds-main`; ห้ามใช้ id `main` เปล่า ๆ)
- หน้า login ใช้ `id="ds-main"` บน `<main class="ds-auth__card">`

### 5.6 มือถือ (Mobile) — ต้องทำทุกหน้า
ทุกหน้าที่แปลงต้องใช้งานได้ดีบนมือถือ (ทดสอบที่ 375×812 และ 360px) ไม่ใช่แค่ "ไม่พัง" กฎต่อไปนี้ kit รองรับให้แล้ว — AI มีหน้าที่ **ใส่ markup ให้ครบ**:

| จุด | ต้องทำ | ผลบนจอ ≤620px |
|---|---|---|
| Topbar | มีปุ่ม `ds-icon-btn ds-search-btn` + `data-ds-search-toggle` + `aria-controls` ชี้ `.ds-search` (ลอกจาก starter.html) | topbar เหลือแถวเดียว ~59px (เมนู · โลโก้ · ค้นหา · ธีม · กระดิ่ง · avatar); กดแว่นขยายแล้วช่องค้นหาเปิดเต็มกว้างใต้ topbar, Esc ปิด |
| แจ้งเตือน / เมนูผู้ใช้ | ใช้ `ds-dropdown` ตาม §5.1 (ห้ามวางเมนูด้วย `position` ของตัวเอง) | แผงแจ้งเตือนและเมนูผู้ใช้เปิดเป็นแผ่นเต็มกว้างใต้ topbar, เลื่อนภายในได้, แตะนอกแผ่นเพื่อปิด |
| Combobox | `select[data-ds-combobox]` (§8.26) | รายการตัวเลือกสูงแถวละ ≥40px บนจอสัมผัส, ค้นหาด้วยแป้นพิมพ์มือถือได้ |
| Sidebar | ใช้ shell เดิม (§5.4) | ≤900px เป็น drawer เลื่อนจากซ้าย |
| ตาราง | ใส่ `ds-table--stack` + `data-label="ชื่อคอลัมน์"` **ทุก `<td>`** (ยกเว้น checkbox) | ทุกแถวกลายเป็นการ์ด ชื่อคอลัมน์ซ้าย ค่าขวา ปุ่มจัดการเป็นแถวด้านล่าง ไม่ต้อง scroll ข้าง |
| ตัวกรอง | ใช้ `ds-filters--collapsible`: ช่องค้นหาเป็นลูกตัวแรก, ตามด้วยปุ่ม `ds-filters__toggle` (`data-ds-filters-toggle` + `aria-controls`), ช่องอื่น/ปุ่มล้างใส่ `ds-filters__more` | เห็นแค่ช่องค้นหา + ปุ่ม "ตัวกรอง" จึงเห็นผลลัพธ์ทันที; กดปุ่มแล้วช่องอื่นกางออก |
| ฟอร์ม | ปุ่มท้ายฟอร์มอยู่ใน `ds-form-actions` แถบเดียว (ปุ่มหลักไม่ใช่ ghost, ปุ่มรองเป็น `--ghost`) | แถบติดล่าง ~106px: ปุ่มหลักเต็มแถวบน ปุ่มรองแบ่งครึ่งแถวล่าง, ซ่อนข้อความ "* จำเป็นต้องกรอก" (ให้มี `ds-alert--info` บอกไว้ด้านบนฟอร์มแทน) |
| Tabs | ใช้ `ds-tabs` ตามปกติ | แถบแท็บเลื่อนแนวนอน ไม่ตัดขึ้นบรรทัดใหม่ |
| หัวแผง | `ds-panel__head` + `ds-panel__title` + `ds-panel__tools` | ถ้าที่ไม่พอ tools ตกลงบรรทัดใหม่เอง (ไม่ทับชื่อ) |
| Dialog | `ds-dialog` ตามปกติ | กว้างเต็มจอเว้นขอบ 16px, เนื้อหา scroll ภายใน |
| Footer | ตัวคั่น `|` อยู่ใน element ที่ kit ซ่อนได้ (ลอกจาก starter.html) | ซ้อนเป็นบรรทัด ไม่มี `|` ห้อย |
| ปุ่ม/ลิงก์ | ใช้คลาส kit (`ds-btn`, `ds-icon-btn`, `ds-pager__btn`, …) | จุดกดขยายเป็น ≥40–44px บนจอสัมผัสโดยไม่เปลี่ยน layout |

- ห้าม: ซ่อนข้อมูลสำคัญบนมือถือด้วย `display:none` เอง, ใช้ความกว้างคงที่ (`width: 800px`, `min-width` บน container), วางตารางกว้างโดยไม่มี `ds-table--stack` หรือ `ds-table-wrap`, ใช้ `position:fixed` ของตัวเองทับ topbar/แถบปุ่ม
- ทดสอบจริง: DevTools → Toggle device (iPhone 12/SE) → เลื่อนทั้งหน้า ต้องไม่มี scroll แนวนอน (`document.documentElement.scrollWidth === innerWidth`)
- kit กันหน้าล้นจอไว้แล้วด้วย `overflow-x:clip` ที่ `body.ds-body` และ `.ds-app` (ข้อความ/วิดเจ็ตที่กว้างเกินจะถูกตัดแทนการทำให้มือถือจัดหน้ากว้างกว่าจอ) — ห้ามแก้เป็น `overflow-x:hidden` ที่ `html` และ `body` พร้อมกัน เพราะ topbar แบบ sticky จะเลิกติดด้านบน; ข้อความที่ซ่อนไว้ให้ screen reader ต้องใช้ `ds-sr-only` เท่านั้น (อย่าซ่อนด้วยการดันออกนอกจอ เช่น `left:-9999px`)

---

## 6. รูปแบบหน้า (Page archetypes)

ทุกหน้า (ยกเว้น login §6.5, error §6.6, เอกสารพิมพ์ §6.7 ซึ่งไม่มี shell) = shell §5 + เนื้อหาใน `ds-content` ตามโครงด้านล่าง เปิดหน้าใน kit ที่ระบุแล้ว **ลอกโครง markup** แทนการเขียนใหม่

### 6.1 Dashboard — ลอกจาก `template1/pages/dashboard.html`
ใช้เมื่อ: หน้าแรกหลัง login, หน้าสรุปผู้บริหาร, ภาพรวมตัวเลข
```
ds-content
├─ ds-hero-row                     (ไม่บังคับ) แบนเนอร์ navy + date card
│   ├─ ds-hero  (__title, __lead, __points, __quote, __art)
│   └─ ds-datecard (__date, __time, __weather, __temp, __place)  ← เวลา/วันที่ด้วย data-ds-clock
├─ section.ds-kpis                 KPI 5 ใบ (ds-kpi ×5; จำนวนอื่นใช้ --ds-kpi-cols หรือ ds-kpis--auto)
├─ ds-grid ds-grid--dash-a         กราฟ 3 ช่อง: donut สถานะ | bars ประเภท | pie สัดส่วน (ds-panel > ds-chart + ds-legend / ds-bars)
└─ ds-grid ds-grid--dash-b         ตารางงานล่าสุด (ds-table) | ds-recent | ds-stack (ds-quick + ds-notes)
```
กราฟวาดด้วย `DS.charts.donut/pie/bars` ใน script ท้ายหน้า ข้อมูลจาก server (JSON) — ไม่ต้องใช้ Chart.js

### 6.2 List (รายการ/ค้นหา) — ลอกจาก `template1/pages/list.html`
ใช้เมื่อ: หน้ารายการข้อมูลทุกชนิด (ใบคำขอ, ผู้ใช้, ครุภัณฑ์) ที่มีค้นหา/กรอง/แบ่งหน้า
```
ds-content
├─ ds-page-head                    breadcrumb · h2 · sub · actions: [ส่งออก ds-btn--ghost] [สร้างรายการใหม่ ds-btn]
└─ section.ds-panel > ds-stack     พาเนลเดียวครอบทั้งรายการ
    ├─ (ไม่บังคับ) ds-tabs          แท็บตามสถานะ พร้อม ds-tabs__count
    ├─ form.ds-filters.ds-filters--collapsible   ช่องค้นหา + ปุ่ม ds-filters__toggle + ds-field.ds-filters__more ×n + ds-filters__actions.ds-filters__more [ล้างตัวกรอง ghost lg] [ค้นหา lg]  (method=get; พับบนมือถือ §5.6)
    ├─ ds-table-wrap > table.ds-table
    │     th: ds-table__check · th[aria-sort] > button.ds-table__sort · ... · ds-table__actions
    │     td: a.ds-id-link (เลขที่) · ds-pill--* (สถานะ) · ds-num ds-nowrap (ตัวเลข/วันที่) · ปุ่มดู/แก้/ลบ (ลบ + data-ds-confirm)
    │     ไม่มีข้อมูล: td.ds-table__empty colspan=ทั้งหมด หรือแทนตารางด้วย ds-empty
    └─ ds-pager                     __info "แสดง 1–10 จาก 128 รายการ" · __list > __btn (aria-current) · __size
```

### 6.3 Form (สร้าง/แก้ไข) — ลอกจาก `template1/pages/form.html`
ใช้เมื่อ: บันทึก/แก้ไขข้อมูลยาว ๆ; ฟอร์มสั้น 1–4 ช่อง ใช้ `ds-dialog` แทน
```
ds-content
├─ ds-page-head                    breadcrumb (หน้าหลัก › รายการ › สร้างใหม่) · h2 · sub
├─ (ถ้ามี error จาก server) ds-alert ds-alert--danger (__icon, __body, __title) สรุปข้อผิดพลาด
└─ form.ds-stack (method=post, action เดิม, CSRF เดิม)
    ├─ section.ds-form-section     __head (__num, __title h3, __desc) + div.ds-form (2 คอลัมน์)
    │     ds-field: __label (+ __req "*") · ds-input|ds-select|ds-textarea · __hint · __error (aria-invalid="true" บน input)
    │     ds-field--full = กินเต็มแถว · ds-choice-group > ds-check (radio/checkbox) · ds-file (อัปโหลด) · ds-input-group (+ __addon)
    ├─ section.ds-form-section ... (แบ่งหมวดตามความหมาย 2–5 หมวด)
    └─ ds-form-actions             sticky ล่าง: __info "* จำเป็นต้องกรอก" · [ยกเลิก ghost lg] [บันทึก lg]
```

### 6.4 Detail (รายละเอียด) — ลอกจาก `template1/pages/detail.html`
ใช้เมื่อ: ดูข้อมูลหนึ่งรายการ พร้อมประวัติ/ไฟล์แนบ/การดำเนินการ
```
ds-content
├─ ds-page-head                    h2 = เลขที่ + ชื่อเรื่อง, ds-pill สถานะ, actions: [พิมพ์ ghost] [แก้ไข ghost] [ดำเนินการ ds-btn]
└─ ds-grid ds-grid--aside          คอลัมน์หลัก | ข้าง 320px (≤900 ซ้อนลง)
    ├─ ds-stack (หลัก)
    │   ├─ ds-panel > ds-tabs (role=tablist) + ds-tabs__panel ×n
    │   │     แท็บข้อมูล: ds-dl (dt/dd) · แท็บประวัติ: ds-timeline (__item, __dot, __time, __title, __body)
    │   └─ ds-panel ไฟล์แนบ / ความคิดเห็น
    └─ aside.ds-stack (ข้าง)       ds-panel ผู้รับผิดชอบ · ds-panel ความคืบหน้า (ds-progress) · ds-panel ข้อมูลอ้างอิง (ds-dl)
```
การยืนยันที่ย้อนกลับไม่ได้ (ยกเลิกงาน/ลบ) ใช้ `data-ds-confirm` หรือ `DS.confirm()`; ฟอร์มสั้น (มอบหมายงาน, เปลี่ยนสถานะ) ใช้ `ds-dialog`; ปุ่ม "พิมพ์" = `<a class="ds-btn ds-btn--ghost" href="(หน้าเอกสาร §6.7)">` เมื่อต้องพิมพ์เป็นแบบฟอร์ม, หรือ `<button type="button" class="ds-btn ds-btn--ghost" data-ds-print>` เมื่อพิมพ์หน้าปัจจุบันตรง ๆ

### 6.5 Login (ไม่มี sidebar) — ลอกจาก `template1/pages/login.html`
ใช้เมื่อ: เข้าสู่ระบบ, ลืมรหัสผ่าน, ตั้งรหัสใหม่ (หน้า error ใช้ §6.6)
```
body.ds-body > div.ds-auth         2 คอลัมน์ (≤900 ซ้อน: แบรนด์เป็นแบนเนอร์ด้านบน)
├─ aside.ds-auth__brand            พื้น navy + ลายเส้น: a.ds-sidebar__brand (โลโก้) · ds-auth__intro (__headline, __lead) · p.ds-auth__quote
└─ main.ds-auth__card#ds-main      h1.ds-auth__title · p.ds-auth__sub · (ds-alert--danger ถ้า login ผิด)
    ├─ form.ds-auth__form          ds-field ×2 · ds-auth__row (ds-check "จดจำฉันไว้" + ds-link-btn "ลืมรหัสผ่าน?") · ds-btn ds-btn--lg ds-btn--block
    └─ ds-auth__foot               ลิงก์ติดต่อผู้ดูแล
```
หน้า login ไม่มี topbar จึงใช้ h1 เป็นหัวการ์ด; ชื่อฟิลด์/`action`/CSRF/captcha เดิมของระบบต้องคงไว้ครบ

### 6.6 Error page (ไม่มี sidebar) — ลอกจาก `template1/pages/error.html`
ใช้เมื่อ: หน้า error ที่ผู้ใช้เห็น — 403 ไม่มีสิทธิ์, 404 ไม่พบหน้า, 419 เซสชันหมดอายุ (Laravel CSRF/session), 500 ระบบขัดข้อง, 503 ปิดปรับปรุง; ไม่ใช้กับ error ของฟิลด์ฟอร์ม (§8.10) หรือผลการบันทึก (toast/alert)
```
body.ds-body > main.ds-error#ds-main      เต็มจอ จัดกลาง บนพื้น --ds-bg (ไม่มี shell, ไม่มี topbar)
└─ ds-error__card                         การ์ดกว้างไม่เกิน 520px
    ├─ ds-error__brand                    โลโก้ + ชื่อย่อระบบ (ลิงก์ไปหน้าหลัก)
    ├─ ds-error__icon                     วงกลม 72px สีตาม --ds-accent (inline บน element นี้): 403/500 style="--ds-accent:var(--ds-red)",
    │                                     419/503 style="--ds-accent:var(--ds-orange)", 404 ไม่ต้องใส่ (น้ำเงินค่าเริ่มต้น) + svg.ds-ic ตามตาราง
    ├─ p.ds-error__code.ds-num            403 / 404 / 419 / 500 / 503
    ├─ h1.ds-error__title                 ข้อความสั้น (ตารางด้านล่าง)
    ├─ p.ds-error__text                   อธิบาย + สิ่งที่ผู้ใช้ทำต่อได้ (§11)
    ├─ ds-error__actions                  [กลับหน้าหลัก ds-btn--lg] [ย้อนกลับ ds-btn--ghost ds-btn--lg data-ds-back]
    └─ p.ds-error__meta                   รหัสอ้างอิง (request id) · เวลา พ.ศ. — สำหรับแจ้งผู้ดูแล
```
| code | ไอคอน | h1 | ปุ่มหลัก |
|---|---|---|---|
| 403 | `lock` | ไม่มีสิทธิ์เข้าถึง | กลับหน้าหลัก |
| 404 | `search` | ไม่พบหน้าที่ต้องการ | กลับหน้าหลัก |
| 419 | `clock` | เซสชันหมดอายุ | เข้าสู่ระบบอีกครั้ง (ลิงก์หน้า login) |
| 500 | `alert-triangle` | ระบบขัดข้อง | ลองใหม่อีกครั้ง / กลับหน้าหลัก |
| 503 | `gear` | ปิดปรับปรุงระบบ | (บอกเวลาที่คาดว่าจะกลับมา; ไม่ต้องมีปุ่มย้อนกลับ) |
- `template1/pages/error.html` เลือกแบบจาก `?code=` ด้วย script ในหน้า (ไว้ดูตัวอย่าง) — **ระบบจริงให้ server render แบบที่ถูกต้องตรง ๆ** ไม่ต้องใช้ query string: Laravel = `resources/views/errors/403.blade.php`, `404.blade.php`, `419.blade.php`, `500.blade.php`, `503.blade.php` (ไฟล์ละ code หรือ `@include` partial เดียวแล้วส่ง code/ข้อความ) · PHP ธรรมดา = `error.php?code=404` + `http_response_code(404)` · IIS = `<httpErrors>` ใน web.config ชี้ไปหน้า error
- HTTP status ต้องเป็น code จริง (ไม่ใช่ 200); หน้า error ห้ามพึ่ง session/DB (500/503 อาจเกิดเพราะ DB ล่ม) — ชื่อผู้ใช้/เมนูไม่ต้องแสดง
- `ds-error__meta` แสดงเฉพาะรหัสอ้างอิงและเวลา — **ห้าม** แสดง exception, stack trace, SQL, path ไฟล์ (§11)
- `data-ds-back` = `history.back()` และถ้าไม่มีหน้าก่อนหน้าจะไปที่ค่าของ attribute แทน — ระบบจริงใส่ URL หน้าหลักของระบบเสมอ (`data-ds-back="{{ url('/') }}"` / `data-ds-back="index.php"`) เพราะค่าสำรองของ kit คือ `dashboard.html`
- ลิงก์ "กลับหน้าหลัก" / "เข้าสู่ระบบอีกครั้ง" ใช้ URL จริงของระบบ (`route('dashboard')`, `route('login')`) ไม่ใช่ `dashboard.html`

### 6.7 เอกสารพิมพ์ A4 (ใบฟอร์มทางการ) — ลอกจาก `template1/pages/print.html`
ใช้เมื่อ: ต้องพิมพ์/บันทึก PDF เป็นแบบฟอร์มที่ส่งต่อหรือลงนาม (ใบแจ้งซ่อม, ใบขออนุมัติ, ใบส่งมอบ, ใบเบิก) — **ไม่ใช่** การพิมพ์หน้ารายการ/รายละเอียดทั่วไป (หน้านั้นใช้ `ds-no-print` ซ่อนส่วนที่ไม่ต้องพิมพ์ แล้ว `data-ds-print` ได้เลย)
```
body.ds-body.ds-print-body                  ไม่มี shell; <head> โหลด Kanit + Sarabun 300/400/600 + ds-ui.css/js
├─ ds-print-toolbar                         [← กลับ ds-btn--ghost → หน้ารายละเอียด] [พิมพ์ / บันทึก PDF ds-btn data-ds-print] (ไม่ถูกพิมพ์)
└─ article.ds-doc                           แผ่น A4 หนึ่งแผ่น (หลายหน้า = หลาย article.ds-doc เรียงกัน)
    ├─ header.ds-doc__head                  svg.ds-doc__logo · div.ds-doc__org (<b>ชื่อหน่วยงาน</b> + <span> ที่อยู่/โทร) ·
    │                                       h1.ds-doc__title ชื่อเอกสาร · table.ds-doc__meta (th[scope=row] เลขที่ / วันที่ พ.ศ.)
    ├─ section.ds-doc__section ×n           h2.ds-doc__heading "1. ข้อมูลผู้แจ้ง" + table.ds-doc__table (th[scope=row] label | td ค่า, 2 คู่ต่อแถวได้)
    │     ข้อความเขียนด้วยมือ: div.ds-doc__lines[aria-hidden=true] style="--ds-doc-lines:3" (จำนวนเส้นบรรทัดว่าง)
    │     ตัวเลือก: span.ds-doc__check "☐ ซ่อมได้ทันที" (☐ / ☑ เขียนในข้อความ ไม่ใช่ checkbox จริง)
    ├─ div.ds-doc__signs                    3 ช่องลงนาม ds-doc__sign: ลงชื่อ ....... / (ชื่อ-สกุล) / ตำแหน่ง / วันที่ ..../..../....
    └─ footer.ds-doc__foot                  รหัสแบบฟอร์ม · พิมพ์เมื่อ 15/05/2568 10:24 น. · หน้า 1/1
```
- **ฟอนต์ Sarabun** (`--ds-font-doc`) เฉพาะใน `ds-doc` — ตามแบบหนังสือราชการ; toolbar และส่วนอื่นยังเป็น Kanit; โหลด `https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600&display=swap` **เฉพาะหน้านี้** (Sarabun มีแค่ 300/400/600 — `<b>`/`<th>`/หัวข้อในเอกสาร kit ตั้งเป็น 600 ให้แล้ว ห้ามตั้ง `font-weight:500` / `var(--ds-fw-medium)` ใน `ds-doc` เพราะจะกลายเป็น 400)
- แผ่นเอกสารเป็น **กระดาษขาว ตัวดำเสมอทั้งสองธีม** (token `--ds-doc-*`) — ห้ามใส่สีแบรนด์ พื้นสี pill หรือ `var(--ds-ink)` ในเนื้อเอกสาร; สถานะให้เขียนเป็นข้อความ/☑
- บนจอ: แผ่น 210×297mm กลางหน้าบนพื้น `--ds-bg` มีเงา; ≤900px ทั้งแผ่นย่อลงตามความกว้างจอ (คงสัดส่วน A4 และการตัดบรรทัดเหมือนบนกระดาษ แบบหน้าตัวอย่าง PDF — ผู้ใช้ซูมด้วยนิ้วเพื่ออ่าน) ไม่มี scroll แนวนอน; ขนาดภายในแผ่นคิดเป็นทวีคูณของ `--ds-doc-u` (ตัวแปรภายใน ห้ามตั้งเอง) · ตอนพิมพ์: toolbar หาย, ไม่มีเงา/ขอบ, ขึ้นหน้าใหม่ระหว่างแผ่น, `@page ds-a4` (A4, margin 0) มีผลเฉพาะ `.ds-doc` จึงไม่กระทบการพิมพ์หน้าอื่น
- ข้อมูลทั้งหมด render จาก server (escape เสมอ); วันที่ พ.ศ. `dd/mm/yyyy`, เงิน `1,234.50 บาท`; ตารางยาวเกินหนึ่งแผ่น → แบ่งเป็น `article.ds-doc` ใหม่พร้อมหัวเอกสารซ้ำและ "หน้า n/N"
- ปุ่มพิมพ์ใช้ `data-ds-print` (= `window.print()`) — ห้าม `onclick="window.print()"` หรือ `<a href="javascript:…">`
- PDF ที่ server สร้าง (mPDF / dompdf / TCPDF / Crystal Report) **ไม่อยู่ในขอบเขต** — kit นี้ใช้สำหรับเอกสาร HTML ที่พิมพ์จากเบราว์เซอร์; หน้า print HTML เดิมของระบบแปลงมาใช้ `ds-doc` ได้เมื่อผู้ใช้สั่ง

---

## 7. สูตรการนำไปใช้กับแต่ละ stack

หลักร่วมทุก stack: **(1)** ทำ layout กลางจาก `starter.html` ให้เสร็จก่อน → **(2)** ย้ายทุกหน้าเข้า layout ใหม่ (เนื้อหาเดิมยังแสดงได้เพราะอยู่ใน scope `.ds-app` ได้ฟอนต์/สีพื้นของ kit) → **(3)** แปลงเนื้อหาทีละหน้าเป็นคอมโพเนนต์ `ds-*` → **(4)** ลบ CSS/ฟอนต์เดิมที่ไม่ใช้แล้ว

### 7a. Plain PHP (include ธรรมดา)
แยก `starter.html` เป็น 3 ไฟล์ (PHP ≥ 7.0 + mbstring; ชื่อ key ใน `$_SESSION` เป็นตัวอย่าง ให้ใช้ของระบบจริง) — หน้าแต่ละหน้าตั้ง `$pageTitle` + `$activeMenu` แล้ว include
```php
<?php /* partials/header.php : DOCTYPE -> <main> (head, skip link, sidebar, topbar) */
$pageTitle  = isset($pageTitle)  ? $pageTitle  : 'หน้าหลัก';
$activeMenu = isset($activeMenu) ? $activeMenu : '';
$dsBase     = '/template/template1/assets';            // production: 'assets/vendor/ds-ui/1.0.2' (§2.3)
if (!function_exists('h')) { function h($s) { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); } }
?><!DOCTYPE html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?= h($pageTitle) ?> | SMMS แจ้งซ่อม</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap">
<?php /* CSS เดิมของระบบ (bootstrap, datatables ...) วางตรงนี้ ก่อน ds-ui.css */ ?>
<link rel="stylesheet" href="<?= $dsBase ?>/ds-ui.css?v=1.0.2">
<script src="<?= $dsBase ?>/ds-ui.js?v=1.0.2"></script>
</head>
<body class="ds-body">
<a class="ds-skip-link" href="#ds-main">ข้ามไปยังเนื้อหาหลัก</a>
<div class="ds-app">
<?php include __DIR__ . '/sidebar.php'; ?>
  <div class="ds-main">
    <header class="ds-topbar">
      <!-- ลอก topbar จาก starter.html: เมนู · โลโก้ · h1 · ค้นหา · ธีม · การแจ้งเตือน (§5.3b) · เมนูผู้ใช้ (ด้านล่าง) -->
<?php $fullname = $_SESSION['fullname'] ?? ''; ?>
      <div class="ds-dropdown">
        <button type="button" class="ds-user" data-ds-dropdown aria-controls="ds-user-menu" aria-expanded="false" aria-haspopup="menu">
          <span class="ds-avatar" aria-hidden="true"><?= h(mb_substr($fullname, 0, 1, 'UTF-8')) ?></span>
          <span class="ds-user__meta"><b><?= h($fullname) ?></b><small><?= h($_SESSION['role'] ?? '') ?></small></span>
          <svg class="ds-ic ds-ic--sm ds-user__caret" aria-hidden="true"><use href="#ds-i-chevron-down"></use></svg>
        </button>
        <div class="ds-menu" id="ds-user-menu" role="menu" aria-label="เมนูผู้ใช้" hidden>
          <div class="ds-menu__header" role="none"><b><?= h($fullname) ?></b><small><?= h($_SESSION['email'] ?? '') ?></small></div>
          <a class="ds-menu__item" role="menuitem" href="profile.php"><svg class="ds-ic" aria-hidden="true"><use href="#ds-i-user"></use></svg>ข้อมูลส่วนตัว</a>
          <hr class="ds-menu__sep">
          <button type="submit" form="logout-form" class="ds-menu__item ds-menu__item--danger" role="menuitem"><svg class="ds-ic" aria-hidden="true"><use href="#ds-i-logout"></use></svg>ออกจากระบบ</button>
        </div>
      </div>
      <form id="logout-form" method="post" action="logout.php" hidden><?php /* hidden input CSRF เดิมของระบบ; ระบบเดิมใช้ลิงก์ GET → ดู §5.3b */ ?></form>
    </header>
    <main class="ds-content" id="ds-main" tabindex="-1">
```
```php
<?php /* partials/sidebar.php : เมนูเดียวของทั้งระบบ; key ต้องตรงกับ $activeMenu ของหน้า */
$menu = array(
  'dashboard' => array('index.php',  'home', 'แดชบอร์ดภาพรวม'),
  'create'    => array('create.php', 'user', 'แจ้งซ่อมใหม่'),
  'list'      => array('list.php',   'doc',  'รายการแจ้งซ่อม'),
  '---1'      => null,                                   // เส้นคั่นกลุ่ม
  'settings'  => array(null, 'gear', 'ตั้งค่า', array(    // กลุ่มเมนูย่อย (§5.3a): href = null + array ลูก
      'settings.company' => array('settings-company.php', 'ตั้งค่าบริษัท'),
      'settings.users'   => array('users.php',            'ผู้ใช้งานและสิทธิ์'),
  )),
);
?>
  <aside class="ds-sidebar" id="ds-sidebar" aria-label="แถบด้านข้าง">
    <div class="ds-sidebar__brand"><!-- โลโก้ + ds-sidebar__name + ds-sidebar__tagline จาก starter.html --></div>
    <nav class="ds-nav" aria-label="เมนูหลัก">
<?php foreach ($menu as $key => $m): ?>
<?php   if ($m === null): ?>
      <hr class="ds-nav__sep">
<?php   elseif (!empty($m[3])): $open = array_key_exists($activeMenu, $m[3]); /* หน้าปัจจุบันอยู่ในกลุ่ม = เปิดจาก server */ ?>
      <div class="ds-nav__group">
        <button type="button" class="ds-nav__item ds-nav__toggle<?= $open ? ' has-current' : '' ?>" aria-expanded="<?= $open ? 'true' : 'false' ?>" aria-controls="ds-nav-<?= h($key) ?>"><svg class="ds-ic" aria-hidden="true"><use href="#ds-i-<?= h($m[1]) ?>"></use></svg><?= h($m[2]) ?><svg class="ds-ic ds-ic--sm ds-nav__caret" aria-hidden="true"><use href="#ds-i-chevron-down"></use></svg></button>
        <div class="ds-nav__sub" id="ds-nav-<?= h($key) ?>"<?= $open ? '' : ' hidden' ?>>
<?php     foreach ($m[3] as $ck => $c): ?>
          <a class="ds-nav__item ds-nav__subitem" href="<?= h($c[0]) ?>"<?= $ck === $activeMenu ? ' aria-current="page"' : '' ?>><?= h($c[1]) ?></a>
<?php     endforeach; ?>
        </div>
      </div>
<?php   else: list($href, $icon, $label) = $m; ?>
      <a class="ds-nav__item" href="<?= h($href) ?>"<?= $key === $activeMenu ? ' aria-current="page"' : '' ?>><svg class="ds-ic" aria-hidden="true"><use href="#ds-i-<?= h($icon) ?>"></use></svg><?= h($label) ?></a>
<?php   endif; ?>
<?php endforeach; ?>
    </nav>
  </aside>
```
```php
<?php /* partials/footer.php : </main> -> end */ ?>
    </main>
    <footer class="ds-footer">
      <span class="ds-footer__brand"><svg class="ds-ic" aria-hidden="true"><use href="#ds-i-gear"></use></svg>SMMS</span><span>Version 1.0.0</span>
      <span class="ds-footer__spacer">© <?= date('Y') ?> ชื่อหน่วยงาน | All rights reserved.</span>
    </footer>
  </div>
</div>
<?php if (!empty($_SESSION['flash'])): ?>
<script>DS.toast(<?= json_encode($_SESSION['flash'], JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) ?>, {type: 'success'});</script>
<?php unset($_SESSION['flash']); endif; ?>
<?php if (!empty($pageScripts)) echo $pageScripts; /* script เฉพาะหน้า (string) */ ?>
</body>
</html>
```
```php
<?php /* list.php : หน้าหนึ่งหน้า */
$pageTitle  = 'รายการแจ้งซ่อม';
$activeMenu = 'list';                         // หน้า edit.php / view.php ของรายการก็ใช้ 'list'; หน้าในกลุ่มใช้ key ลูก เช่น 'settings.users'
require __DIR__ . '/partials/header.php';
?>
      <div class="ds-page-head"> … </div>
      <section class="ds-panel"> … </section>
<?php require __DIR__ . '/partials/footer.php'; ?>
```
- ไฟล์ legacy ที่เป็น PHP+HTML ก้อนใหญ่: ตัดส่วน `<html>…<body>` + เมนูเดิมทิ้ง แทนด้วย `require header.php`; ตัดส่วนท้ายแทนด้วย `require footer.php`; **ห้ามย้ายโค้ด query/permission ที่อยู่บนสุดของไฟล์** — ให้อยู่ก่อน `require header.php` เหมือนเดิม (เพื่อให้ `header('Location: …')` ยังทำงาน)
- `<style>` inline ในหน้าเดิม: ลบกฎสี/ฟอนต์/ขนาดตัวอักษรทิ้ง เหลือเฉพาะ layout ที่หน้านั้นต้องใช้จริง

### 7b. Laravel Blade (anonymous component layout)
```blade
{{-- resources/views/components/layouts/app.blade.php  →  ใช้เป็น <x-layouts.app> --}}
@props(['title' => null, 'active' => null])
<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="csrf-token" content="{{ csrf_token() }}">
<title>{{ $title ? $title.' | ' : '' }}{{ config('app.name') }}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap">
@vite(['resources/css/app.css', 'resources/js/app.js'])
<link rel="stylesheet" href="{{ asset('vendor/ds-ui/1.0.2/ds-ui.css') }}">   {{-- หลัง @vite เสมอ --}}
<script src="{{ asset('vendor/ds-ui/1.0.2/ds-ui.js') }}"></script>            {{-- ไม่ defer --}}
@stack('styles')
</head>
<body class="ds-body">
<a class="ds-skip-link" href="#ds-main">ข้ามไปยังเนื้อหาหลัก</a>
<div class="ds-app">
  @include('partials.sidebar', ['active' => $active])
  <div class="ds-main">
    @include('partials.header')      {{-- <header class="ds-topbar"> จาก starter.html + auth()->user() (ตัวอย่างด้านล่าง) --}}
    <main class="ds-content" id="ds-main" tabindex="-1">
      {{ $slot }}
    </main>
    @include('partials.footer')      {{-- <footer class="ds-footer"> --}}
  </div>
</div>
@if (session('success'))
<script>DS.toast(@json(session('success')), {type: 'success'});</script>
@endif
@stack('scripts')
</body>
</html>
```
```blade
{{-- resources/views/partials/sidebar.blade.php --}}
@php
  $menu = [
    'dashboard' => ['route' => 'dashboard',      'match' => ['dashboard'],      'icon' => 'home', 'label' => 'แดชบอร์ดภาพรวม'],
    'create'    => ['route' => 'repairs.create', 'match' => ['repairs.create'], 'icon' => 'user', 'label' => 'แจ้งซ่อมใหม่'],
    'repairs'   => ['route' => 'repairs.index',  'match' => ['repairs.*'],      'icon' => 'doc',  'label' => 'รายการแจ้งซ่อม'],
    'settings'  => ['icon' => 'gear', 'label' => 'ตั้งค่า', 'children' => [          // กลุ่มเมนูย่อย (§5.3a)
        'company' => ['route' => 'settings.company', 'match' => ['settings.company*'], 'label' => 'ตั้งค่าบริษัท'],
        'users'   => ['route' => 'users.index',      'match' => ['users.*'],           'label' => 'ผู้ใช้งานและสิทธิ์'],
    ]],
  ];
  // รวมลูกของกลุ่มเข้ากับเมนูชั้นบน แล้วหา current: prop "active" ชนะ; ไม่งั้นรายการแรกที่ routeIs() ตรง
  $flat = collect($menu)->flatMap(fn ($m, $k) => $m['children'] ?? [$k => $m]);
  $current = $active ?? $flat->search(fn ($m) => request()->routeIs(...$m['match']));
@endphp
<aside class="ds-sidebar" id="ds-sidebar" aria-label="แถบด้านข้าง">
  <div class="ds-sidebar__brand">{{-- โลโก้ + ชื่อระบบ จาก starter.html --}}</div>
  <nav class="ds-nav" aria-label="เมนูหลัก">
    @foreach ($menu as $key => $m)
      @isset($m['children'])
        @php($open = $current && isset($m['children'][$current]))
        <div class="ds-nav__group">
          <button type="button" class="ds-nav__item ds-nav__toggle @if ($open) has-current @endif" aria-expanded="{{ $open ? 'true' : 'false' }}" aria-controls="ds-nav-{{ $key }}"><svg class="ds-ic" aria-hidden="true"><use href="#ds-i-{{ $m['icon'] }}"></use></svg>{{ $m['label'] }}<svg class="ds-ic ds-ic--sm ds-nav__caret" aria-hidden="true"><use href="#ds-i-chevron-down"></use></svg></button>
          <div class="ds-nav__sub" id="ds-nav-{{ $key }}" @unless ($open) hidden @endunless>
            @foreach ($m['children'] as $ck => $c)
              <a class="ds-nav__item ds-nav__subitem" href="{{ route($c['route']) }}" @if ($ck === $current) aria-current="page" @endif>{{ $c['label'] }}</a>
            @endforeach
          </div>
        </div>
      @else
        <a class="ds-nav__item" href="{{ route($m['route']) }}" @if ($key === $current) aria-current="page" @endif><svg class="ds-ic" aria-hidden="true"><use href="#ds-i-{{ $m['icon'] }}"></use></svg>{{ $m['label'] }}</a>
      @endisset
    @endforeach
  </nav>
</aside>
```
- key ของลูกในกลุ่มต้องไม่ซ้ำกับ key อื่นทั้งเมนู (ใช้เป็นค่า `active` ได้ เช่น `<x-layouts.app active="users">`)
```blade
{{-- resources/views/partials/header.blade.php — ส่วนการแจ้งเตือน + เมนูผู้ใช้ (ที่เหลือลอกจาก starter.html)
     ตัวอย่างใช้ Laravel Notifications; ชื่อ route / key ใน data เป็นตัวอย่าง ให้ใช้ของระบบจริง --}}
@php
  $user = auth()->user();
  $unreadCount = $user->unreadNotifications()->count();
  $notes = $user->notifications()->latest()->take(6)->get();
  $th = fn ($d) => $d->format('d/m/') . ($d->year + 543) . $d->format(' H:i');   // พ.ศ.
@endphp
<div class="ds-dropdown">
  <button type="button" class="ds-icon-btn" data-ds-dropdown aria-controls="ds-notif-panel" aria-expanded="false" aria-haspopup="true"
          aria-label="การแจ้งเตือน{{ $unreadCount ? ' (ยังไม่อ่าน '.$unreadCount.' รายการ)' : '' }}"><svg class="ds-ic" aria-hidden="true"><use href="#ds-i-bell"></use></svg>@if ($unreadCount)<span class="ds-icon-btn__dot ds-num" aria-hidden="true">{{ $unreadCount }}</span>@endif</button>
  <div class="ds-popover" id="ds-notif-panel" hidden>
    <div class="ds-popover__head"><h2 class="ds-popover__title">การแจ้งเตือน</h2>@if ($unreadCount)<button type="button" class="ds-link-btn" data-ds-notif-readall>อ่านทั้งหมดแล้ว</button>@endif</div>
    <ul class="ds-notes ds-popover__body">
      @forelse ($notes as $n)
        <li class="ds-notes__item @if (is_null($n->read_at)) is-unread @endif"><span class="ds-notes__icon" style="background:var(--ds-blue)"><svg class="ds-ic" aria-hidden="true"><use href="#ds-i-bell"></use></svg></span>
          <span><a class="ds-notes__link" href="{{ $n->data['url'] ?? route('notifications.index') }}">{{ $n->data['message'] ?? '' }}</a><small class="ds-notes__time ds-num">{{ $th($n->created_at) }}</small></span></li>
      @empty
        <li class="ds-notes__item ds-muted">ไม่มีการแจ้งเตือนใหม่</li>
      @endforelse
    </ul>
    <div class="ds-popover__foot"><a class="ds-link-btn" href="{{ route('notifications.index') }}">ดูการแจ้งเตือนทั้งหมด →</a></div>
  </div>
</div>
<div class="ds-dropdown">
  <button type="button" class="ds-user" data-ds-dropdown aria-controls="ds-user-menu" aria-expanded="false" aria-haspopup="menu">
    <span class="ds-avatar" aria-hidden="true">{{ mb_substr($user->name, 0, 1) }}</span>
    <span class="ds-user__meta"><b>{{ $user->name }}</b><small>{{ $user->position ?? '' }}</small></span>
    <svg class="ds-ic ds-ic--sm ds-user__caret" aria-hidden="true"><use href="#ds-i-chevron-down"></use></svg>
  </button>
  <div class="ds-menu" id="ds-user-menu" role="menu" aria-label="เมนูผู้ใช้" hidden>
    <div class="ds-menu__header" role="none"><b>{{ $user->name }}</b><small>{{ $user->email }}</small></div>
    <a class="ds-menu__item" role="menuitem" href="{{ route('profile.edit') }}"><svg class="ds-ic" aria-hidden="true"><use href="#ds-i-user"></use></svg>ข้อมูลส่วนตัว</a>
    <hr class="ds-menu__sep">
    <button type="submit" form="logout-form" class="ds-menu__item ds-menu__item--danger" role="menuitem"><svg class="ds-ic" aria-hidden="true"><use href="#ds-i-logout"></use></svg>ออกจากระบบ</button>
  </div>
</div>
<form id="logout-form" method="post" action="{{ route('logout') }}" hidden>@csrf</form>
```
```blade
{{-- resources/views/repairs/index.blade.php --}}
<x-layouts.app title="รายการแจ้งซ่อม">
  <div class="ds-page-head"> … </div>
  <section class="ds-panel"> … </section>
  @push('scripts')
  <script>DS.charts.donut('#stChart', @json($statusItems), {legend: '#stLegend'});</script>
  @endpush
</x-layouts.app>
```
**ย้ายหน้าที่ใช้ `<x-layouts.admin>` อยู่แล้ว** (ไม่ต้องแก้ทีละหน้า): เปลี่ยนเนื้อไฟล์ `resources/views/components/layouts/admin.blade.php` เป็น wrapper บาง ๆ
```blade
@props(['title' => null, 'active' => null])
<x-layouts.app :title="$title" :active="$active">{{ $slot }}</x-layouts.app>
```
- ถ้า layout เดิมมี named slot (เช่น `<x-slot:header>`) ให้ย้ายเนื้อหานั้นเข้า `ds-page-head` ภายใน slot หลักของหน้า แล้วลบ named slot ทิ้ง
- ไฟล์ `partials/sidebar.blade.php` / `partials/header.blade.php` เดิม → เขียนทับด้วย markup จาก starter.html (ชื่อไฟล์เดิมคงไว้ได้)
- ห้ามแก้ controller/route/policy; เปลี่ยนเฉพาะไฟล์ `.blade.php` และ CSS

### 7c. Tailwind v4 (+ DaisyUI v5) อยู่ร่วมกับ kit
**การโหลด:** `<link>` ของ `ds-ui.css` อยู่ **หลัง** `@vite(...)` (ดู layout ใน 7b) — Tailwind v4 ใส่ทุกอย่างไว้ใน `@layer theme, base, components, utilities` ส่วน `ds-ui.css` ไม่อยู่ใน layer จึงชนะ Tailwind/DaisyUI เสมอ ผลที่ต้องรู้: **utility ที่ใส่บน element ที่มีคลาส `ds-` จะแพ้ถ้าชน property เดียวกัน** (เช่น `class="ds-panel p-0"` → `p-0` ไม่มีผล)

กติกาการใช้ร่วมกัน:
| ใช้ Tailwind utilities ได้ | ห้าม |
|---|---|
| จัด layout เฉพาะหน้าบน wrapper ของตัวเอง: `flex`, `grid`, `grid-cols-*`, `gap-*`, `items-*`, `justify-*`, `m*-*`, `w-*`, `max-w-*`, `hidden md:block`, `sr-only` | utility สี (`text-gray-500`, `bg-white`, `border-slate-200`, `text-red-600`) → ใช้ token (§3) |
| ระยะเล็ก ๆ ระหว่างคอมโพเนนต์ใน panel | ขนาดตัวอักษร/น้ำหนัก (`text-sm`, `font-bold`) บนคอมโพเนนต์ ds |
| | สร้างการ์ด/ปุ่ม/badge เองจาก utility (`rounded-xl shadow p-4 bg-white`) → ใช้ `ds-panel`, `ds-btn`, `ds-pill` |

**แทน DaisyUI ด้วย ds-** (ลบคลาส DaisyUI ออกจาก element เดียวกัน):
| DaisyUI v5 | ds- equivalent |
|---|---|
| `btn btn-primary` / `btn-outline`, `btn-ghost` / `btn-error` / `btn-success` | `ds-btn` / `ds-btn ds-btn--ghost` / `ds-btn ds-btn--danger` / `ds-btn ds-btn--success` |
| `btn-lg`, `btn-block`, `btn-square` | `ds-btn--lg`, `ds-btn--block`, `ds-btn--icon` (ปุ่มไอคอนใน topbar = `ds-icon-btn`) |
| `card bg-base-100 shadow` + `card-body` + `card-title` | `ds-panel` + (ไม่ต้องมี body) + `ds-panel__head` > `ds-panel__title` |
| `alert alert-info\|success\|warning\|error` | `ds-alert ds-alert--info\|--success\|--warning\|--danger` (+ `ds-alert__icon`, `ds-alert__body`) |
| `badge badge-warning` (สถานะ) / `badge` (ตัวเลข) | `ds-pill ds-pill--pending` (§3.2) / `ds-badge` |
| `table`, `table-zebra` (ใน `overflow-x-auto`) | `ds-table-wrap` > `table.ds-table` |
| `input input-bordered`, `select`, `textarea`, `checkbox`/`radio` | `ds-input`, `ds-select`, `ds-textarea`, `label.ds-check` |
| `fieldset` + `label` / `form-control` | `ds-field` + `ds-field__label` (+ `ds-field__hint`, `ds-field__error`) |
| `modal` (`<dialog class="modal">` + `modal-box`) | `dialog.ds-dialog` + `ds-dialog__body` / `__title` / `__actions` + `data-ds-open` |
| `tabs` / `tab tab-active` | `ds-tabs` / `ds-tabs__tab` + `aria-selected="true"` |
| `stats` / `stat` | `ds-kpis` / `ds-kpi` |
| `loading loading-spinner`, `skeleton` | `ds-spinner`, `ds-skeleton` |
| `navbar`, `drawer`, `menu` (sidebar) | `ds-topbar`, `ds-app` + `ds-sidebar`, `ds-nav` |
| เมนูย่อยใน sidebar `menu` > `li` > `<details><summary>` + `ul` | `ds-nav__group` > `button.ds-nav__toggle` + `div.ds-nav__sub` > `a.ds-nav__subitem` (§5.3a) |
| `dropdown` (`dropdown-end`) + `tabindex=0` trigger + `ul.dropdown-content.menu` | `ds-dropdown` + `button[data-ds-dropdown][aria-controls]` + `div.ds-menu[role=menu]` > `a.ds-menu__item[role=menuitem]` (§8.23) |
| `dropdown` ที่ใส่การ์ด/รายการแจ้งเตือน (`dropdown-content card`) · `indicator` + `badge` บนกระดิ่ง | `ds-popover` + `ds-notes` (§8.24) · `ds-icon-btn__dot` |
| `text-base-content/60` | `ds-muted` |

**เปิด token ของ kit ให้ Tailwind ใช้** (เพิ่มใน `resources/css/app.css` หลัง `@import "tailwindcss";`):
```css
@theme inline {
  --font-sans: var(--ds-font);
  --color-ds-bg: var(--ds-bg);          --color-ds-surface: var(--ds-surface);  --color-ds-surface-2: var(--ds-surface-2);
  --color-ds-line: var(--ds-line);      --color-ds-ink: var(--ds-ink);          --color-ds-ink-2: var(--ds-ink-2);
  --color-ds-ink-3: var(--ds-ink-3);    --color-ds-link: var(--ds-link);        --color-ds-blue: var(--ds-blue);
  --color-ds-green: var(--ds-green);    --color-ds-red: var(--ds-red);          --color-ds-yellow: var(--ds-yellow);
  --color-ds-orange: var(--ds-orange);  --color-ds-purple: var(--ds-purple);    --color-ds-gray: var(--ds-gray);
  --radius-ds-md: var(--ds-r-md);       --radius-ds-lg: var(--ds-r-lg);
  --shadow-ds: var(--ds-shadow);
}
/* dark: ผูกกับ data-theme ที่ ds-ui.js ตั้ง (แทน prefers-color-scheme ของ Tailwind) */
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
```
- ใช้เป็น `text-ds-ink-2`, `bg-ds-surface`, `border-ds-line`, `rounded-ds-lg`, `shadow-ds`, `bg-ds-blue/10` — สีพวกนี้สลับธีมเองจึง**ไม่ต้องใช้ `dark:`** (ใช้ `dark:` เฉพาะกรณีที่ต้องเปลี่ยนอย่างอื่นที่ไม่ใช่สี; ข้อควรรู้: ตอนไม่มี `data-theme` และใช้ธีมตาม OS `dark:` จะไม่ทำงาน แต่ token ทำงาน)
- ลบ `@import`/`<link>` ฟอนต์ Prompt/Sarabun และ `--font-sans` เดิมใน `@theme` ออก

**DaisyUI ที่ยังเหลือใช้อยู่** (ช่วงเปลี่ยนผ่าน): ให้ธีมของ DaisyUI อ่านสีจาก token — ตั้งชื่อธีมเป็น `light` และ `dark` (ทับธีม built-in) เพราะ `ds-ui.js` ตั้ง `data-theme="light|dark"` ซึ่งตรงกับชื่อธีมของ DaisyUI; ค่าในสองบล็อกเหมือนกันทุกบรรทัดเพราะ token สลับธีมเอง; **ลบธีมเดิม (`name: "helpdesk"` ฯลฯ) และ `data-theme="<ชื่อธีมเดิม>"` บน `<html>` ออก**
```css
@plugin "daisyui";
@plugin "daisyui/theme" {
  name: "light"; default: true; prefersdark: false; color-scheme: light;
  --color-base-100: var(--ds-surface); --color-base-200: var(--ds-surface-2); --color-base-300: var(--ds-line);
  --color-base-content: var(--ds-ink);
  --color-primary: var(--ds-primary);     --color-primary-content: var(--ds-on-color);
  --color-secondary: var(--ds-navy-900);  --color-secondary-content: var(--ds-on-color);
  --color-accent: var(--ds-sky);          --color-accent-content: var(--ds-on-color);
  --color-neutral: var(--ds-navy-950);    --color-neutral-content: var(--ds-on-navy);
  --color-info: var(--ds-sky);            --color-info-content: var(--ds-on-color);
  --color-success: var(--ds-green-strong); --color-success-content: var(--ds-on-color);
  --color-warning: var(--ds-yellow);      --color-warning-content: var(--ds-navy-950);
  --color-error: var(--ds-red-strong);    --color-error-content: var(--ds-on-color);
  --radius-selector: var(--ds-r-pill); --radius-field: var(--ds-r-md); --radius-box: var(--ds-r-lg);
  --size-selector: 0.25rem; --size-field: 0.25rem; --border: 1px; --depth: 0; --noise: 0;
}
@plugin "daisyui/theme" {
  name: "dark"; default: false; prefersdark: true; color-scheme: light;
  --color-base-100: var(--ds-surface); --color-base-200: var(--ds-surface-2); --color-base-300: var(--ds-line);
  --color-base-content: var(--ds-ink);
  --color-primary: var(--ds-primary);     --color-primary-content: var(--ds-on-color);
  --color-secondary: var(--ds-navy-900);  --color-secondary-content: var(--ds-on-color);
  --color-accent: var(--ds-sky);          --color-accent-content: var(--ds-on-color);
  --color-neutral: var(--ds-navy-950);    --color-neutral-content: var(--ds-on-navy);
  --color-info: var(--ds-sky);            --color-info-content: var(--ds-on-color);
  --color-success: var(--ds-green-strong); --color-success-content: var(--ds-on-color);
  --color-warning: var(--ds-yellow);      --color-warning-content: var(--ds-navy-950);
  --color-error: var(--ds-red-strong);    --color-error-content: var(--ds-on-color);
  --radius-selector: var(--ds-r-pill); --radius-field: var(--ds-r-md); --radius-box: var(--ds-r-lg);
  --size-selector: 0.25rem; --size-field: 0.25rem; --border: 1px; --depth: 0; --noise: 0;
}
```
(`color-scheme: light` ทั้งสองธีมโดยตั้งใจ — kit ให้ native widget สว่างเสมอ) · ทางเลือกขั้นสูง: ถ้าต้องการให้ utility ทับคลาส ds ได้ ให้คัดลอก `ds-ui.css` ไว้ใน `resources/css/vendor/` แล้ว `@import "./vendor/ds-ui.css" layer(components);` ใน `app.css` แทน `<link>` (ต้องทดสอบ build และลำดับกับ DaisyUI ก่อน) · Tailwind v3 / CDN play script: หลักเดียวกัน แต่ CDN ฉีด style ท้าย `<head>` จึงชนะ ds เมื่อ specificity เท่ากัน → ยิ่งต้องไม่ใส่ utility บน element `ds-`

### 7d. Legacy: PHP + Bootstrap 3/4 + jQuery (DataTables, Select2, SweetAlert2)
ลำดับใน `<head>`: `bootstrap.css` → `dataTables.bootstrap*.css` → `select2.css` → `sweetalert2.css` → Kanit → **`ds-ui.css`** → **`ds-ui.js`** (script ของ jQuery/plugin คงตำแหน่งเดิม)
1. ทำ 7a ก่อน (header/sidebar/footer ใหม่) ให้ทุกหน้าได้ shell ใหม่พร้อมกัน — หน้าที่ยังไม่แปลงจะยังเป็น Bootstrap อยู่ใน `ds-content` แต่ได้ฟอนต์และพื้นหลังของ kit
2. แปลงเนื้อหา**ทีละหน้า** ตามตาราง แล้วลบคลาส Bootstrap ออกจาก element นั้น:
   | Bootstrap 3/4 | ds- |
   |---|---|
   | `.panel` / `.card` (+ `-heading`/`-header`, `-body`) | `ds-panel` + `ds-panel__head` > `ds-panel__title` |
   | `.btn .btn-primary\|default\|danger\|success`, `.btn-lg`, `.btn-block` | `ds-btn`, `ds-btn--ghost\|--danger\|--success`, `ds-btn--lg`, `ds-btn--block` |
   | `.form-group` + `label` + `.form-control` + `.help-block`/`.invalid-feedback` | `ds-field` + `ds-field__label` + `ds-input\|ds-select\|ds-textarea` + `ds-field__hint`/`ds-field__error` |
   | `.label-*` / `.badge-*` (สถานะ) | `ds-pill ds-pill--*` (§3.2) |
   | `.table .table-striped .table-bordered` ใน `.table-responsive` | `ds-table-wrap` > `table.ds-table` |
   | `.alert .alert-*` | `ds-alert ds-alert--*` |
   | `.row` + `.col-md-6` (ฟอร์ม) / (การ์ด) | `ds-form` + `ds-field` / `ds-grid ds-grid--2\|--3\|--4` |
   | `.nav-tabs` | `ds-tabs` |
   | `.pagination` | `ds-pager` |
   | `.modal` (Bootstrap JS) | คงไว้ได้ หรือแปลงเป็น `ds-dialog` |
   | `.dropdown` + `.dropdown-toggle[data-toggle=dropdown]` + `.dropdown-menu` > `.dropdown-item` / `.divider` (ใน navbar) | `ds-dropdown` + `button[data-ds-dropdown]` + `ds-menu` > `ds-menu__item` / `ds-menu__sep` (§8.23) — ลบ `data-toggle`/`data-bs-toggle` ออก ไม่งั้น Bootstrap JS จะเปิดซ้อน |
   | AdminLTE `.nav-treeview` / `.has-treeview` / `.menu-open` | `ds-nav__group` + `ds-nav__sub` (เปิดจาก server ตาม §5.3a) |
3. **ห้ามผสม** `.btn` กับ `.ds-btn`, `.form-control` กับ `.ds-input`, `.table` กับ `.ds-table`, `.badge` กับ `.ds-badge` บน element เดียวกัน (สไตล์สองชุดตีกัน)
4. **DataTables**: คง JS เดิม เปลี่ยน markup เป็น `<div class="ds-table-wrap"><table id="tbl" class="ds-table" style="width:100%">` (เอา `table table-striped` ออก); คอลัมน์สถานะ render เป็น pill โดย escape ข้อมูลเสมอ; เครื่องมือ `data-ds-tip` / `data-ds-confirm` ในแถวยังทำงานหลัง redraw (event delegation):
   ```js
   // DataTables 1.10-1.13: หลังโหลด dataTables.bootstrap*.js และก่อนเรียก .DataTable()
   $.extend($.fn.dataTable.ext.classes, { sFilterInput: 'ds-input ds-input--sm', sLengthSelect: 'ds-select ds-select--sm' });
   $('#tbl').DataTable({ columns: [ /* ... */ { data: 'status', render: function (d) {
     return '<span class="ds-pill ds-pill--' + DS.esc(statusGroup(d)) + '">' + DS.esc(d) + '</span>'; } } ] });
   ```
   (`statusGroup()` = ฟังก์ชัน mapping สถานะ → `pending|progress|done|cancel|info|neutral` ของระบบ ตาม §3.2)
5. **Select2**: select เดี่ยว (ไม่ใช่ `multiple`) ที่ตัวเลือกมาจาก `<option>` ในหน้า → **เปลี่ยนเป็น `data-ds-combobox`** และถอด `.select2()` ของ element นั้น (§8.26); ตัวเลือกน้อย (≤ ~10) ใช้ `ds-select` ธรรมดา; **คง Select2 ไว้** เฉพาะ `multiple` / tags / โหลดตัวเลือกด้วย AJAX (`ajax:`) / template ผลลัพธ์พิเศษ — ตั้ง `width: '100%'` และปรับสีด้วย token ในไฟล์ CSS ของระบบ (โหลดหลัง select2.css):
   ```css
   .select2-container--default .select2-selection--single,
   .select2-container--default .select2-selection--multiple{border-color:var(--ds-line);border-radius:var(--ds-r-md);background-color:var(--ds-surface-2)}
   .select2-container--default .select2-selection--single .select2-selection__rendered{color:var(--ds-ink)}
   .select2-dropdown{border-color:var(--ds-line);background-color:var(--ds-surface);color:var(--ds-ink)}
   ```
6. **SweetAlert2**: โค้ดเดิมใช้ต่อได้; **โค้ดใหม่ใช้ `DS.confirm` / `DS.toast`**
   | SweetAlert2 เดิม | ds-ui.js |
   |---|---|
   | `Swal.fire({title, text, icon:'warning', showCancelButton:true}).then(r => { if (r.isConfirmed) … })` | `DS.confirm({title, text, okText:'ลบ', danger:true}).then(ok => { if (ok) … })` |
   | `Swal.fire({toast:true, icon:'success', title:'บันทึกแล้ว'})` | `DS.toast('บันทึกแล้ว', {type:'success'})` |
   | ปุ่มลบที่เรียก Swal ใน `onclick` | `<button class="ds-btn ds-btn--danger" data-ds-confirm="ลบรายการนี้?" data-ds-confirm-danger>` |
7. Font Awesome ใช้ต่อได้ในส่วนที่ยังไม่แปลง; ส่วนที่แปลงแล้วใช้ไอคอน `#ds-i-*`; Bootstrap 5.3 ที่ใช้ `data-bs-theme` บน `<html>` → `ds-ui.js` ซิงก์ค่าให้เอง

### 7e. Alpine.js อยู่ร่วมกับ ds-ui.js
- `ds-ui.js` ใช้ event delegation บน `document` และตอบเฉพาะ attribute `data-ds-*` (+ `.ds-tabs[role=tablist]`) → ไม่ชนกับ `x-data`/`@click`; เนื้อหาที่ Alpine สร้างทีหลัง (`x-if`, `x-for`, `x-html`) ทำงานทันทีโดยไม่ต้อง init ใหม่ (ถ้าจำเป็นจริง ๆ มี `DS.init(root)`)
- `DS` พร้อมใช้ก่อน Alpine เสมอ (ds-ui.js อยู่ใน `<head>`, Alpine มากับ Vite module ที่ถูก defer) → เรียกใน expression ได้ตรง ๆ:
  ```html
  <button type="button" class="ds-btn" @click="DS.dialog.open('dlgAssign')">มอบหมายงาน</button>
  <button type="button" class="ds-btn ds-btn--ghost" @click="DS.toast('คัดลอกลิงก์แล้ว', {type: 'success'})">คัดลอกลิงก์</button>
  <form method="post" action="/repairs/15" @submit.prevent="DS.confirm({title: 'ยกเลิกใบแจ้งซ่อม?', danger: true}).then(ok => ok && $el.submit())">…</form>
  ```
- **ให้เจ้าของ state มีคนเดียวต่อ widget**: ค่าเริ่มต้นใช้ hook ของ kit (`data-ds-sidebar-toggle`, `data-ds-open`, `data-ds-close`, `data-ds-confirm`, `data-ds-dropdown`) ซึ่งจัดการ ARIA/โฟกัส/Esc ให้ครบ — dropdown เดิมแบบ `x-data="{open:false}"` + `@click.outside` ในเมนูผู้ใช้/แจ้งเตือน ให้เปลี่ยนเป็น `data-ds-dropdown` แล้วลบ state ของ Alpine ออก; ถ้าจำเป็นต้องให้ Alpine คุม sidebar เอง ให้ bind `:class="{ 'is-open': open }"` และ**ลบ** `data-ds-sidebar-toggle` ออก (แล้ว Alpine ต้องดูแล `aria-expanded`, Esc เอง) — ห้ามใช้ทั้งสองแบบกับ element เดียวกัน
- ฟังการเปลี่ยนธีมใน Alpine: `x-init="document.addEventListener('ds:themechange', e => theme = e.detail.theme)"` (อ่านค่าปัจจุบันด้วย `DS.theme.get()`)
- Tabs ของ kit ส่ง event `ds:tabchange` บน tablist — ถ้าต้องโหลดข้อมูลตอนเปลี่ยนแท็บ ให้ฟัง event นี้แทนการเขียน tab เองด้วย Alpine

## 8. คอมโพเนนต์ (Component catalog)

กติกาของส่วนนี้: ทุก snippet คัดลอกไปใช้ได้ทันที ชื่อ class ต้องตรงตัวอักษร (มี prefix `ds-` เสมอ, BEM `block__element--modifier`)
สีที่ขึ้นกับข้อมูลส่งผ่าน token เท่านั้น เช่น `style="--ds-accent:var(--ds-green)"` หรือ `style="background:var(--ds-green)"`
ตัวอย่างเต็มของทุกชิ้นดูใน `template1/pages/components.html` และการจัดวางจริงดูใน `dashboard.html` / `list.html` / `form.html` / `detail.html` / `login.html` / `error.html` / `print.html` (dropdown, แผงแจ้งเตือน, กลุ่มเมนูย่อย อยู่ใน shell ของทุกหน้า — ต้นแบบคือ `starter.html`)

### 8.1 Panel (การ์ดเนื้อหา)
ใช้ห่อเนื้อหาทุกกลุ่มบนหน้า (แทน `card`, `box`, `bg-white rounded shadow`)
```html
<section class="ds-panel" aria-labelledby="p-status">
  <div class="ds-panel__head">
    <h3 class="ds-panel__title" id="p-status">งานที่ต้องติดตามวันนี้ <span class="ds-badge ds-num">17</span></h3>
    <div class="ds-panel__tools">
      <select class="ds-select ds-select--sm" aria-label="ช่วงเวลา"><option>เดือนนี้</option></select>
      <a class="ds-link-btn" href="list.html">ดูทั้งหมด <span aria-hidden="true">→</span></a>
    </div>
  </div>
  ...เนื้อหา...
</section>
```
- ไม่มีเครื่องมือด้านขวา → วาง `<h3 class="ds-panel__title">` ตรงใน panel ได้เลย (ไม่ต้องมี `__head`)
- ห้าม: ใส่ปุ่ม/select ไว้ใน `<h3>` — ต้องอยู่ใน `ds-panel__tools` เท่านั้น
- ห้าม: ซ้อน panel ใน panel (ใช้ `ds-stack` หรือ `ds-grid` ภายในแทน)

### 8.2 Page head และ Breadcrumb
ทุกหน้าที่อยู่ใน shell เริ่ม `<main class="ds-content">` ด้วย page head หนึ่งชุด (h2 = ชื่อหน้า, h1 อยู่ที่ topbar)
```html
<div class="ds-page-head">
  <div class="ds-page-head__main">
    <nav class="ds-breadcrumb" aria-label="เส้นทาง">
      <ol><li><a href="dashboard.html">หน้าหลัก</a></li><li aria-current="page">รายการแจ้งซ่อม</li></ol>
    </nav>
    <h2 class="ds-page-head__title">รายการแจ้งซ่อม</h2>
    <p class="ds-page-head__sub">ทั้งหมด 128 รายการ</p>
  </div>
  <div class="ds-page-head__actions"><a class="ds-btn" href="form.html">แจ้งซ่อมใหม่</a></div>
</div>
```
- breadcrumb/`__sub`/`__actions` เป็น optional; ≤400px ปุ่มใน `__actions` จะเต็มความกว้างเอง
- ห้าม: ใช้ h1 ในเนื้อหา หรือมี page head มากกว่าหนึ่งชุดต่อหน้า

### 8.3 Grid และ Stack
| class | คอลัมน์ | ยุบเมื่อ |
|---|---|---|
| `ds-grid ds-grid--2` | 2 เท่ากัน | ≤620 → 1 |
| `ds-grid ds-grid--3` | 3 เท่ากัน | ≤900 → 1 |
| `ds-grid ds-grid--4` | 4 เท่ากัน | ≤1280 → 2; ≤620 → 1 |
| `ds-grid ds-grid--dash-a` | 1.22fr 1fr 1fr (donut / bars / pie) | ≤1280 → 2 คอลัมน์ ลูกตัวแรกเต็มแถว; ≤900 → 1 |
| `ds-grid ds-grid--dash-b` | 1.7fr 1.12fr 1fr (table / recent / stack) | เหมือน dash-a |
| `ds-grid ds-grid--aside` | main + aside 320px | ≤900 → 1 คอลัมน์ |
| `ds-stack` | แนวตั้ง gap 12px | — |
```html
<div class="ds-grid ds-grid--aside">
  <div class="ds-stack"><section class="ds-panel">หลัก</section><section class="ds-panel">หลัก 2</section></div>
  <aside class="ds-stack"><section class="ds-panel">ข้าง</section></aside>
</div>
```
- ห้าม: ใช้ `row`/`col-md-*` ของ Bootstrap หรือ `grid grid-cols-*` ของ Tailwind ในหน้าที่แปลงแล้ว
- ห้าม: กำหนด `gap`/`margin` เองระหว่าง panel — ระยะ 12px มาจาก grid/stack แล้ว

### 8.4 KPI (ตัวชี้วัด)
```html
<section class="ds-kpis" aria-label="ตัวชี้วัดหลัก">
  <div class="ds-kpi">
    <span class="ds-kpi__icon" style="background:var(--ds-blue)">
      <svg class="ds-ic ds-ic--lg" aria-hidden="true"><use href="#ds-i-wrench"></use></svg></span>
    <div>
      <div class="ds-kpi__label" lang="en">Total Requests</div>
      <div class="ds-kpi__row">
        <span class="ds-kpi__value ds-num">128</span>
        <span class="ds-kpi__delta ds-kpi__delta--good">▲ +12%<span class="ds-sr-only"> (ดีขึ้น)</span></span>
      </div>
    </div>
    <div class="ds-kpi__foot"><span>คำขอแจ้งซ่อมทั้งหมด</span><span>จากเดือนที่แล้ว</span></div>
  </div>
</section>
```
- คอลัมน์ 5 → 3 (≤1280) → 2 (≤620) → 1 (≤400); จำนวนการ์ดไม่เท่า 5 → `ds-kpis ds-kpis--auto` หรือ `style="--ds-kpi-cols:4"`
- delta: `--good` (เขียว) / `--bad` (แดง) / `--neutral` (ไม่เปลี่ยน) และต้องมีข้อความ `ds-sr-only` บอกความหมาย
- ทั้งการ์ดเป็นลิงก์ได้: `<a class="ds-kpi" href="list.html">`
- ห้าม: delta ยาว (แถวค่าไม่ตัดบรรทัด) และห้ามใช้ `ds-dl` แทน `ds-kpi__delta`

### 8.5 Hero และ Date card (เฉพาะหน้า dashboard)
```html
<section class="ds-hero-row">
  <div class="ds-hero">
    <!-- svg.ds-hero__art: คัดลอกจาก dashboard.html ทั้งก้อน -->
    <h2 class="ds-hero__title">สินทรัพย์พร้อมใช้ งานต่อเนื่อง องค์กรเดินหน้า</h2>
    <p class="ds-hero__lead">ขับเคลื่อนการบริการงานซ่อมบำรุงรวดเร็ว แม่นยำ ตรวจสอบได้ทุกขั้นตอน</p>
    <ul class="ds-hero__points">
      <li><svg class="ds-ic" aria-hidden="true"><use href="#ds-i-clock"></use></svg>ลดเวลาซ่อม</li>
    </ul>
    <div class="ds-hero__quote" aria-hidden="true">“ดูแลวันนี้<span>เพื่อพรุ่งนี้ที่ดีกว่า”</span></div>
  </div>
  <div class="ds-datecard">
    <div class="ds-datecard__date" data-ds-clock="date" data-ds-clock-be>วันพฤหัสบดีที่ <b>15 พฤษภาคม 2568</b></div>
    <time class="ds-datecard__time ds-num" data-ds-clock="time">10:24 น.</time>
  </div>
</section>
```
- `ds-datecard__weather` (svg 70×56 + `__temp` + `__place`) เป็น optional; ข้อความวัน/เวลาจาก server เป็นแค่ first paint — JS เขียนทับจาก `DS.now()`
- ชื่อเรื่องยาว → `ds-hero ds-hero--fit` (ซ่อน quote เมื่อพื้นที่ไม่พอ)
- ห้าม: ใช้ hero/datecard ในหน้า list/form/detail (มีได้เฉพาะ dashboard หน้าแรก)

### 8.6 Charts, Legend, Bars, Progress
Donut/Pie/Bars วาดด้วย `DS.charts.*` (ดู §10) — HTML ที่ต้องเตรียม:
```html
<div class="ds-chart">
  <svg class="ds-chart__svg" id="stChart" viewBox="0 0 180 180" role="img"
       aria-label="สัดส่วนสถานะงานแจ้งซ่อม" aria-describedby="stLegend"></svg>
  <ul class="ds-legend" id="stLegend"></ul>
</div>
<div class="ds-bars" id="catBars"></div>
<script>
  var items = [{label:'รอดำเนินการ', value:18, color:'--ds-yellow'}, {label:'เสร็จสิ้น', value:96, color:'--ds-green'}];
  DS.charts.donut('#stChart', items, {legend:'#stLegend', center:114, centerLabel:'ทั้งหมด'});
  DS.charts.bars('#catBars', [{label:'คอมพิวเตอร์ / Notebook', value:32, color:'--ds-blue'}]);
</script>
```
- Pie ใช้ legend แบบแน่น: `<ul class="ds-legend ds-legend--tight">`
- Legend/bar เขียนมือได้ (โครง: `ds-legend__item` > `__dot` + `__label` + `__value`; `ds-bar` > `__label` + `__track` > `__fill` + `__value`)
- Progress ค่าเดียว:
```html
<div class="ds-progress" role="progressbar" aria-label="ความคืบหน้างานซ่อม"
     aria-valuemin="0" aria-valuemax="100" aria-valuenow="62" style="--ds-accent:var(--ds-green)">
  <span class="ds-progress__fill" style="width:62%"></span>
</div>
```
- ห้าม: ใส่สี hex ใน `items[].color` — ต้องเป็นชื่อ custom property เช่น `'--ds-blue'`
- ห้าม: โหลด Chart.js/ApexCharts เพิ่มเพื่อทำ donut/pie/bar แนวนอนที่ kit มีอยู่แล้ว (กราฟชนิดอื่นที่ kit ไม่มี ใช้ lib เดิมได้ แต่สีต้องอ่านจาก token)

### 8.7 Table และ Pager
```html
<div class="ds-table-wrap" role="region" aria-labelledby="p-list" tabindex="0">
  <table class="ds-table ds-table--hover">
    <caption class="ds-sr-only">รายการแจ้งซ่อม</caption>
    <thead><tr>
      <th class="ds-table__check"><input type="checkbox" aria-label="เลือกทั้งหมด"></th>
      <th aria-sort="ascending"><button class="ds-table__sort" type="button">เลขที่แจ้งซ่อม</button></th>
      <th aria-sort="none"><button class="ds-table__sort" type="button">กำหนดเสร็จ</button></th>
      <th>สถานะ</th>
      <th class="ds-table__actions">การดำเนินการ</th>
    </tr></thead>
    <tbody>
      <tr>
        <td class="ds-table__check"><input type="checkbox" aria-label="เลือก SR-202505-0025"></td>
        <td><a class="ds-id-link" href="detail.html?id=SR-202505-0025">SR-202505-0025</a></td>
        <td class="ds-num ds-nowrap">20/05/2568</td>
        <td><span class="ds-pill ds-pill--pending">รอดำเนินการ</span></td>
        <td class="ds-table__actions">
          <a class="ds-btn ds-btn--ghost ds-btn--icon" href="form.html?id=SR-202505-0025" aria-label="แก้ไข" data-ds-tip="แก้ไข">
            <svg class="ds-ic" aria-hidden="true"><use href="#ds-i-edit"></use></svg></a></td>
      </tr>
      <!-- ไม่มีข้อมูล: <tr><td class="ds-table__empty" colspan="5">ไม่พบรายการ</td></tr> -->
    </tbody>
  </table>
</div>
<nav class="ds-pager" aria-label="เปลี่ยนหน้า">
  <p class="ds-pager__info">แสดง 1–10 จาก 58 รายการ</p>
  <ul class="ds-pager__list">
    <li><button class="ds-pager__btn" type="button" disabled aria-label="หน้าก่อนหน้า">
      <svg class="ds-ic" aria-hidden="true"><use href="#ds-i-chevron-left"></use></svg></button></li>
    <li><a class="ds-pager__btn" href="?page=1" aria-current="page">1</a></li>
    <li><a class="ds-pager__btn" href="?page=2">2</a></li>
    <li aria-hidden="true">…</li>
    <li><a class="ds-pager__btn" href="?page=2" aria-label="หน้าถัดไป">
      <svg class="ds-ic" aria-hidden="true"><use href="#ds-i-chevron-right"></use></svg></a></li>
  </ul>
  <label class="ds-pager__size">แสดง
    <select class="ds-select ds-select--sm" name="per_page"><option>10</option><option>25</option></select> รายการ</label>
</nav>
```
- ตารางกว้างขั้นต่ำ 540px แล้ว scroll ภายใน `ds-table-wrap`; ตารางแคบ → `style="--ds-table-min-w:0"` ที่ `<table>`
- `aria-sort` = `ascending | descending | none` (script ของระบบเป็นคนอัปเดต); แถวที่เลือก `<tr class="is-selected">`
- วันที่/ตัวเลข/จำนวนเงิน → `class="ds-num ds-nowrap"`; เลขที่เอกสาร → `ds-id-link` (เป็น `<button>` ได้ถ้าเปิด dialog)
- Pagination เดิม (Laravel `links()`, Bootstrap `.pagination`): เรนเดอร์ใหม่เป็นโครง `ds-pager` โดยใช้ URL `?page=` เดิมทุกตัว; ลิงก์ที่กดไม่ได้ = `<a class="ds-pager__btn" aria-disabled="true">` (ไม่มี href)
- DataTables เดิม: คง JS ไว้ ใส่ `ds-table` ที่ `<table>` และห่อด้วย `ds-table-wrap`; ถอดเฉพาะ CSS theme ของ DataTables ที่ทำให้หน้าตาชนกัน แล้วทดสอบ sort/search/paging ให้ครบ
- ห้าม: วางตารางโดยไม่มี `ds-table-wrap` (มือถือล้นจอ) และห้ามลงสีพื้นแถวเอง

### 8.8 Status pill และ Badge
| สถานะ | class | โทนสี |
|---|---|---|
| รอดำเนินการ | `ds-pill ds-pill--pending` | เหลืองอำพัน |
| กำลังดำเนินการ | `ds-pill ds-pill--progress` | น้ำเงิน |
| เสร็จสิ้น / อนุมัติ | `ds-pill ds-pill--done` | เขียว |
| ยกเลิก / ไม่อนุมัติ / เกินกำหนด | `ds-pill ds-pill--cancel` | แดง |
| ข้อมูลประกอบ (เช่น รออะไหล่) | `ds-pill ds-pill--info` | ฟ้า |
| กลาง (ฉบับร่าง, ปิดใช้งาน) | `ds-pill ds-pill--neutral` (= ค่า default ของ `ds-pill`) | เทา |
```html
<span class="ds-pill ds-pill--done">เสร็จสิ้น</span>
<h3 class="ds-panel__title">งานค้าง <span class="ds-badge ds-num">3</span></h3>
<span class="ds-badge ds-badge--neutral ds-num">12</span>
```
- pill = สถานะของ "รายการ"; badge = "ตัวนับ" ข้างหัวข้อ (แดงทั้งสองธีม) — ห้ามใช้สลับกัน
- ห้าม: สร้าง pill สีใหม่ด้วย inline hex; สถานะใหม่ต้อง map เข้า 6 กลุ่มข้างบน (ดู §11)

### 8.9 Buttons และ Link button
```html
<button class="ds-btn" type="button">บันทึก</button>
<a class="ds-btn" href="form.html"><svg class="ds-ic" aria-hidden="true"><use href="#ds-i-plus"></use></svg>แจ้งซ่อมใหม่</a>
<button class="ds-btn ds-btn--ghost" type="button">ยกเลิก</button>
<button class="ds-btn ds-btn--danger" type="button">ลบรายการ</button>
<button class="ds-btn ds-btn--success" type="button">ปิดงาน</button>
<button class="ds-btn ds-btn--lg ds-btn--block" type="submit">เข้าสู่ระบบ</button>
<button class="ds-btn ds-btn--ghost ds-btn--icon" type="button" aria-label="แก้ไข" data-ds-tip="แก้ไข">
  <svg class="ds-ic" aria-hidden="true"><use href="#ds-i-edit"></use></svg></button>
<a class="ds-link-btn" href="list.html">ดูทั้งหมด <span aria-hidden="true">→</span></a>
<button class="ds-link-btn" type="button">ล้างตัวกรอง</button>
```
| ขนาด | ใช้ที่ |
|---|---|
| `ds-btn` (สูง 30.75px, ghost 32.75px) | panel, ตาราง, page head, dialog |
| `ds-btn ds-btn--lg` (39px = สูงเท่า `ds-input`) | คู่กับ input, filter bar, form actions, login |
- `ds-btn--success` / `--danger` ใช้พื้น `--ds-green-strong` / `--ds-red-strong` (ตัวขาวผ่าน AA — §3.6); hover ของปุ่มสีเต็มเข้มขึ้น
- สีตามข้อมูล: `style="--ds-btn-bg:var(--ds-purple)"` (ใน `ds-btn` ชื่อ palette ถูกแปลงเป็น `-strong` ให้เอง); ระหว่างส่ง: `<button class="ds-btn" disabled><span class="ds-spinner" aria-hidden="true"></span> กำลังบันทึก…</button>`
- หนึ่งกลุ่มปุ่มมี primary (`ds-btn` เปล่า) ได้ **ปุ่มเดียว**; ลำดับ ghost (ยกเลิก) ซ้าย → primary ขวา
- ห้าม: `<a href="#" onclick="…">` เป็นปุ่ม — การกระทำในหน้า = `<button type="button">`, ไปหน้าอื่น = `<a href>`
- ห้าม: ปุ่มไอคอนล้วนที่ไม่มี `aria-label`

### 8.10 ฟอร์ม: field, label, required, hint, error
`ds-form` = grid 2 คอลัมน์ (≤620 → 1); `ds-field--full` = เต็มแถว
```html
<form class="ds-form" action="save.php" method="post">
  <div class="ds-field">
    <label class="ds-field__label" for="fTitle">เรื่อง / อาการ <span class="ds-field__req" aria-hidden="true">*</span></label>
    <input class="ds-input" id="fTitle" name="title" required aria-describedby="fTitleHint"
           placeholder="เช่น เครื่องพิมพ์ชั้น 2 กระดาษติด">
    <p class="ds-field__hint" id="fTitleHint">อธิบายอาการสั้น ๆ</p>
  </div>
  <div class="ds-field">
    <label class="ds-field__label" for="fCat">ประเภทครุภัณฑ์</label>
    <select class="ds-select" id="fCat" name="cat"><option value="">— เลือก —</option></select>
  </div>
  <div class="ds-field ds-field--full">
    <label class="ds-field__label" for="fDetail">รายละเอียด</label>
    <textarea class="ds-textarea" id="fDetail" name="detail" rows="4"
              aria-invalid="true" aria-describedby="fDetailErr"></textarea>
    <p class="ds-field__error" id="fDetailErr">กรุณากรอกรายละเอียด</p>
  </div>
</form>
```
- ฟิลด์แบบย่อ (ใน dialog): `<label class="ds-field"><span class="ds-field__label">ผู้แจ้ง</span><input class="ds-input" name="by"></label>`
- Laravel: ใส่ `@error('detail') aria-invalid="true" aria-describedby="fDetailErr" @enderror` ที่ control และ `@error('detail')<p class="ds-field__error" id="fDetailErr">{{ $message }}</p>@enderror`; `value="{{ old('detail') }}"` คงเดิม
- ห้าม: ใช้ placeholder แทน label; ห้ามแสดง error ด้วยขอบแดงอย่างเดียวโดยไม่มีข้อความ `ds-field__error`

### 8.11 ฟอร์ม: input / select / textarea / ขนาดเล็ก / check / choice group
| class | ลักษณะ |
|---|---|
| `ds-input`, `ds-select`, `ds-textarea` | สูง 39px, 14px, เต็มความกว้าง |
| `ds-input--sm`, `ds-select--sm` | 12.5px, กว้างตามเนื้อหา — ใน `ds-panel__tools`, pager |
| state | `aria-invalid="true"` · `disabled` · `readonly` (ไม่มี class state) |
```html
<label class="ds-check"><input type="checkbox" name="urgent" value="1"> งานด่วน</label>
<fieldset class="ds-field">
  <legend class="ds-field__label" id="prioLbl">ความเร่งด่วน</legend>
  <div class="ds-choice-group" role="radiogroup" aria-labelledby="prioLbl">
    <label class="ds-check"><input type="radio" name="prio" value="1" checked> ปกติ</label>
    <label class="ds-check"><input type="radio" name="prio" value="2"> ด่วน</label>
  </div>
</fieldset>
```
- เรียงแนวตั้ง: เพิ่ม `aria-orientation="vertical"` ที่ `ds-choice-group`
- ต้องพิมพ์ค้นหาในตัวเลือก (หน่วยงาน, ครุภัณฑ์, ผู้ใช้ — ตัวเลือกเกิน ~10) → ใส่ `data-ds-combobox` ที่ `ds-select` (§8.26); Select2 เดิมแบบเลือกเดี่ยวให้เปลี่ยนเป็น combobox, แบบ `multiple`/AJAX คง Select2 ไว้ (ใส่ `ds-select` ที่ element ต้นฉบับ แล้วทดสอบว่า widget ยังทำงาน); datepicker เดิม: เปลี่ยนเป็นปฏิทินไทยของ kit ตาม §8.12a (ดูเงื่อนไขรูปแบบค่าที่ backend รับ)
- ห้าม: ซ่อน checkbox จริงแล้ววาดกล่องเอง (kit ใช้ native input + `accent-color`)

### 8.12 ฟอร์ม: input group, file, form section, form actions, filter bar
```html
<div class="ds-input-group">
  <span class="ds-input-group__addon">฿</span>
  <input class="ds-input" type="number" name="cost" aria-label="ค่าซ่อม">
  <span class="ds-input-group__addon">บาท</span>
</div>
<div class="ds-input-group">
  <input class="ds-input" type="search" name="asset" aria-label="ค้นหาครุภัณฑ์">
  <button class="ds-btn" type="button">ค้นหา</button>
</div>

<label class="ds-file">
  <input class="ds-file__input" type="file" name="files[]" multiple accept=".pdf,.jpg,.png">
  <svg class="ds-ic" aria-hidden="true"><use href="#ds-i-upload"></use></svg>
  <span class="ds-file__title">ลากไฟล์มาวางที่นี่ หรือ <span class="ds-file__link">เลือกไฟล์</span></span>
  <span class="ds-file__hint">PDF, JPG, PNG ขนาดไม่เกิน 10 MB</span>
</label>
```
- `ds-file` ไม่ต้องใช้ JS (input จริงถูกขยายทับพื้นที่); script ใส่ `.is-dragover` ได้ถ้าต้องการ; `name`/`multiple`/`accept` ต้องเหมือนเดิม และ `<form>` ต้องมี `enctype="multipart/form-data"` เหมือนเดิม

ฟอร์มยาว (หน้า form.html) = หลาย `ds-form-section` ใน `ds-stack` + แถบปุ่มติดล่าง:
```html
<form class="ds-stack" action="save.php" method="post">
  <section class="ds-form-section" aria-labelledby="secReq">
    <div class="ds-form-section__head">
      <span class="ds-form-section__num" aria-hidden="true">1</span>
      <h3 class="ds-form-section__title" id="secReq">ข้อมูลผู้แจ้ง</h3>
      <p class="ds-form-section__desc">ใช้ติดต่อกลับเมื่อดำเนินการเสร็จ</p>
    </div>
    <div class="ds-form"> ...ds-field... </div>
  </section>
  <div class="ds-form-actions">
    <p class="ds-form-actions__info"><span class="ds-field__req">*</span> จำเป็นต้องกรอก</p>
    <a class="ds-btn ds-btn--ghost ds-btn--lg" href="list.html">ยกเลิก</a>
    <button class="ds-btn ds-btn--lg" type="submit">บันทึกใบแจ้งซ่อม</button>
  </div>
</form>
```
แถบตัวกรองบนหน้า list (พับได้บนมือถือ — ดู §5.6):
```html
<form class="ds-filters ds-filters--collapsible" id="lstFilters" role="search" aria-label="ตัวกรองรายการแจ้งซ่อม" method="get">
  <div class="ds-field"><!-- ลูกตัวแรก = ช่องค้นหา (แสดงเสมอ) -->
    <label class="ds-field__label" for="fQ">คำค้น</label>
    <input class="ds-input" id="fQ" name="q" type="search">
  </div>
  <button type="button" class="ds-btn ds-btn--ghost ds-btn--lg ds-filters__toggle"
          data-ds-filters-toggle aria-controls="lstFilters" aria-expanded="false">
    <svg class="ds-ic" aria-hidden="true"><use href="#ds-i-filter"></use></svg>ตัวกรอง</button>
  <div class="ds-field ds-filters__more">
    <label class="ds-field__label" for="fSt">สถานะ</label>
    <select class="ds-select" id="fSt" name="status"><option value="">ทั้งหมด</option></select>
  </div>
  <div class="ds-filters__actions ds-filters__more">
    <button class="ds-btn ds-btn--ghost ds-btn--lg" type="reset">ล้างตัวกรอง</button>
    <button class="ds-btn ds-btn--lg" type="submit">ค้นหา</button>
  </div>
</form>
```
- ปุ่ม `ds-filters__toggle` แสดงเฉพาะจอ ≤620px (desktop ซ่อนเอง); ถ้าตัวกรองมีค่าที่ผู้ใช้เลือกไว้ตอนโหลดหน้า ให้ใส่คลาส `is-open` ที่ form และ `aria-expanded="true"` ที่ปุ่ม เพื่อให้เห็นค่าที่กรองอยู่
- `ds-form-section` เป็น panel อยู่แล้ว — ห้ามห่อด้วย `ds-panel` ซ้ำ
- ห้าม: ใช้ `ds-btn` ขนาดปกติข้าง input สูง 39px (ต้อง `--lg`); ห้ามมี `ds-form-actions` มากกว่าหนึ่งแถบต่อฟอร์ม

### 8.12a ช่องวันที่ — ปฏิทินไทย (พ.ศ.)
ช่องวันที่ทุกช่องต้องใช้ **ปฏิทินไทยของ kit** (ชื่อเดือนไทย, หัวคอลัมน์ อา–ส, ปี พ.ศ., แสดง `วว/ดด/ปปปป`) — ห้ามปล่อยให้เบราว์เซอร์แสดงปฏิทินภาษาอังกฤษ `mm/dd/yyyy`
เขียนแค่ `<input type="date">` ธรรมดาที่มีคลาส `ds-input` แล้ว `ds-ui.js` แปลงให้อัตโนมัติ:
```html
<div class="ds-field">
  <label class="ds-field__label" for="fDue">วันที่ต้องการให้แล้วเสร็จ</label>
  <input class="ds-input" type="date" id="fDue" name="due_date" value="2025-05-20" min="2025-01-01">
</div>
<!-- แสดงเป็น 20/05/2568 + ปุ่มปฏิทิน; ค่าที่ส่งฟอร์มยังเป็น due_date=2025-05-20 -->
```
- ค่าที่ส่งเซิร์ฟเวอร์ / อ่านด้วย JS (`input.value`) ยังเป็น **ISO ค.ศ. `YYYY-MM-DD`** เหมือน `type=date` ปกติ → backend, validation, `old('due_date')` ไม่ต้องแก้; event `input`/`change` ยังยิงที่ input เดิม
- `id`, `name`, `min`, `max`, `required`, `disabled`, `readonly`, `aria-invalid`, `aria-describedby` ใช้กับ input เดิมได้ตามปกติ (kit ซิงก์ไปยังช่องที่มองเห็นให้); `label for` ถูกย้ายไปช่องที่มองเห็นอัตโนมัติ; script ที่ `focus()` id เดิมจะไปโฟกัสช่องที่มองเห็น
- ผู้ใช้พิมพ์ได้: `15/05/2568`, `15/5/68`, `15/05/2025` (ปี > 2400 = พ.ศ.); พิมพ์ผิดรูปแบบหรือเกินช่วง min/max → ช่องขึ้นกรอบแดง (`aria-invalid`) และค่าเดิมไม่เปลี่ยน
- คีย์บอร์ด: ลูกศรลงในช่อง = เปิดปฏิทิน · ลูกศร = เลื่อนวัน · PageUp/PageDown = เดือน (Shift = ปี) · Home/End = ต้น/ท้ายสัปดาห์ · Enter = เลือก · Esc = ปิด
- ใช้ใน `ds-dialog` ได้ (ปฏิทินเปิดใน dialog เดียวกัน); input ที่ใส่เข้ามาภายหลัง (AJAX/Alpine) ถูกแปลงอัตโนมัติ
- ต้องการปฏิทินของเบราว์เซอร์จริง ๆ (ไม่แนะนำ) ใส่ `data-ds-native`; ต้องการ ค.ศ. เฉพาะช่องใส่ `data-ds-era="ce"`
- **แทน datepicker เดิม**: jQuery UI datepicker / bootstrap-datepicker / flatpickr / `<input type="text" class="datepicker">` → เปลี่ยนเป็น `<input class="ds-input" type="date" name="(ชื่อเดิม)">` แล้วถอด init ของ plugin เดิม **เฉพาะเมื่อรูปแบบค่าที่ส่งเข้าเซิร์ฟเวอร์เป็น `YYYY-MM-DD` อยู่แล้ว**; ถ้า backend เดิมรับ `dd/mm/yyyy` หรือ พ.ศ. ให้คง plugin เดิมไว้ (แค่ใส่ `ds-input`) หรือแปลงค่าในฝั่งเซิร์ฟเวอร์ — ห้ามเปลี่ยนรูปแบบค่าที่ backend รับโดยไม่บอกผู้ใช้
- ห้าม: เขียน `dd/mm/yyyy` ลง `value` ของ `type=date`, แสดงวันที่ ค.ศ. ปนกับ พ.ศ. ในระบบเดียวกัน
### 8.13 Tabs
แบบ JS (สลับ panel ในหน้า):
```html
<div class="ds-tabs" role="tablist" aria-label="รายละเอียดใบแจ้งซ่อม">
  <button class="ds-tabs__tab" type="button" role="tab" id="tab-info" aria-controls="tp-info" aria-selected="true">ข้อมูลทั่วไป</button>
  <button class="ds-tabs__tab" type="button" role="tab" id="tab-log" aria-controls="tp-log" aria-selected="false" tabindex="-1">
    ประวัติการดำเนินการ <span class="ds-tabs__count">4</span></button>
</div>
<div class="ds-tabs__panel" role="tabpanel" id="tp-info" aria-labelledby="tab-info" tabindex="0">…</div>
<div class="ds-tabs__panel" role="tabpanel" id="tp-log" aria-labelledby="tab-log" tabindex="0" hidden>…</div>
```
แบบลิงก์ (server เลือกแท็บจาก URL, ไม่ใช้ JS): `<nav class="ds-tabs" aria-label="มุมมอง"><a class="ds-tabs__tab" href="?tab=info">ข้อมูล</a><a class="ds-tabs__tab" href="?tab=log" aria-current="page">ประวัติ</a></nav>`
- ห้าม: ใส่ `role="tablist"` บนแบบลิงก์ หรือใช้ `.active` แทน `aria-selected` / `aria-current`

### 8.14 Alert
```html
<div class="ds-alert ds-alert--warning" role="alert">
  <svg class="ds-ic ds-alert__icon" aria-hidden="true"><use href="#ds-i-alert-triangle"></use></svg>
  <div class="ds-alert__body">
    <p class="ds-alert__title">มีงานค้างเกินกำหนด 9 รายการ</p>
    กรุณาตรวจสอบและมอบหมายช่างผู้รับผิดชอบ <a href="list.html">ดูรายการ</a>
  </div>
</div>
```
| variant | ไอคอนแนะนำ | role |
|---|---|---|
| `ds-alert--info` | `info` | `status` |
| `ds-alert--success` | `check-circle` | `status` |
| `ds-alert--warning` | `alert-triangle` | `alert` |
| `ds-alert--danger` | `x-circle` | `alert` |
- alert = ข้อความค้างบนหน้า (เช่น error สรุปจาก validation); ผลการกระทำชั่วคราว → `DS.toast`
- ห้าม: ใช้ alert แทน error รายฟิลด์ (ต้องมี `ds-field__error` ที่ฟิลด์ด้วย)

### 8.15 Definition list (ข้อมูลแบบ ชื่อ–ค่า)
```html
<dl class="ds-dl">
  <dt>เลขที่แจ้งซ่อม</dt><dd class="ds-num">SR-202505-0152</dd>
  <dt>สถานะ</dt><dd><span class="ds-pill ds-pill--pending">รอดำเนินการ</span></dd>
  <div><dt>กำหนดเสร็จ</dt><dd class="ds-num">15/05/2568</dd></div>
</dl>
```
- ใช้ในหน้า detail และ dialog ดูรายละเอียด; ห้าม: ทำ "ชื่อ: ค่า" ด้วย `<table>` หรือ `<br>`

### 8.16 Timeline
```html
<ol class="ds-timeline">
  <li class="ds-timeline__item" style="--ds-accent:var(--ds-green)">
    <span class="ds-timeline__dot" aria-hidden="true"></span>
    <p class="ds-timeline__title">ปิดงานซ่อม</p>
    <time class="ds-timeline__time ds-num" datetime="2025-05-15T16:30">15/05/2568 16:30 น.</time>
    <div class="ds-timeline__body">เปลี่ยนลูกยางดึงกระดาษ ทดสอบพิมพ์ผ่าน</div>
  </li>
  <li class="ds-timeline__item">…ไม่มี --ds-accent = จุดสีน้ำเงิน…</li>
</ol>
```
- สีจุดตามสถานะ: green = เสร็จ, yellow = รอ, blue = ดำเนินการ, red = ยกเลิก; ห้าม: เรียงเก่า→ใหม่ปนกันในหน้าเดียว (เลือกทางเดียวทั้งระบบ แนะนำใหม่ล่าสุดอยู่บน)

### 8.17 Empty state, Skeleton, Spinner
```html
<div class="ds-empty">
  <svg class="ds-ic ds-empty__icon" aria-hidden="true"><use href="#ds-i-file-text"></use></svg>
  <p class="ds-empty__title">ยังไม่มีใบแจ้งซ่อม</p>
  <p class="ds-empty__text">เมื่อมีการแจ้งซ่อม รายการจะแสดงที่นี่</p>
  <a class="ds-btn" href="form.html">แจ้งซ่อมใหม่</a>
</div>
<div class="ds-panel" aria-busy="true">
  <span class="ds-skeleton ds-skeleton--title" aria-hidden="true"></span>
  <span class="ds-skeleton" aria-hidden="true"></span>
  <span class="ds-skeleton" aria-hidden="true"></span>
</div>
<span class="ds-spinner" role="status" aria-label="กำลังโหลด"></span>
```
- skeleton variants: `--title`, `--circle`, `--block`; spinner: `--sm` (14px), `--lg` (32px)
- ในตาราง ใช้ `<td class="ds-table__empty" colspan="N">` แทน `ds-empty`
- ห้าม: แสดงตาราง/กราฟว่างเปล่าโดยไม่มีข้อความ; ห้ามใช้ spinner เต็มจอบังทั้งหน้า

### 8.18 Dialog (modal)
```html
<button class="ds-btn" type="button" data-ds-open="dlgNew">แจ้งซ่อมใหม่</button>
<dialog class="ds-dialog" id="dlgNew" data-ds-backdrop-close>
  <form class="ds-dialog__body" method="dialog">
    <h2 class="ds-dialog__title">แจ้งซ่อมใหม่</h2>
    <p class="ds-dialog__text">กรอกข้อมูลให้ครบถ้วน</p>
    <label class="ds-field"><span class="ds-field__label">เรื่อง / อาการ</span>
      <input class="ds-input" name="title" required autofocus></label>
    <div class="ds-dialog__actions">
      <button class="ds-btn ds-btn--ghost" type="button" data-ds-close>ยกเลิก</button>
      <button class="ds-btn" value="ok">บันทึกใบแจ้งซ่อม</button>
    </div>
  </form>
</dialog>
```
- กว้าง 480px; ฟอร์มกว้าง → `ds-dialog ds-dialog--lg` (720px); ฟอร์มที่ต้องส่งไป server ใช้ `method="post" action="…"` แทน `method="dialog"`
- ห้าม: ตั้ง `display` บน `.ds-dialog` หรือสร้าง modal เองด้วย div + overlay; ห้ามใช้ `alert()`/`confirm()` ของ browser (ใช้ `DS.confirm`)

### 8.19 Toast และ Tooltip
- Toast: JS เท่านั้น `DS.toast('บันทึกเรียบร้อย', {type:'success'})` — ห้ามเขียน `.ds-toast` เป็น HTML ตรง (จะไม่หายไป)
- Tooltip: ใส่ `data-ds-tip="ข้อความสั้น"` ที่ element ใดก็ได้ (kit สร้าง `.ds-tip` ให้เอง) — ข้อความบรรทัดเดียว สั้น
- ห้าม: ใช้ tooltip เป็นที่เดียวที่บอกข้อมูลสำคัญ (ปุ่มไอคอนต้องมี `aria-label` ด้วย); ห้ามใช้ `title=` ซ้ำกับ `data-ds-tip`

### 8.20 Quick actions, Notes, Recent (รายการย่อบน dashboard)
```html
<div class="ds-quick">
  <a class="ds-quick__btn" href="form.html" style="background:var(--ds-blue)">
    <svg class="ds-ic" aria-hidden="true"><use href="#ds-i-plus"></use></svg>
    <span>แจ้งซ่อมใหม่<small class="ds-quick__sub">สร้างคำขอแจ้งซ่อม</small></span></a>
  <button class="ds-quick__btn" type="button" data-ds-open="dlgNew" style="--ds-accent:var(--ds-green)">…</button>
</div>
<ul class="ds-notes">
  <li class="ds-notes__item">
    <span class="ds-notes__icon" style="background:var(--ds-red)">
      <svg class="ds-ic ds-ic--sm" aria-hidden="true"><use href="#ds-i-bell"></use></svg></span>
    <span>มีงานค้างเกินกำหนด 9 รายการ <small class="ds-notes__time ds-num">15/05/2568 09:00</small></span>
  </li>
</ul>
<ul class="ds-recent">
  <li class="ds-recent__item">
    <a class="ds-id-link ds-num" href="detail.html?id=SR-202505-0152">SR-202505-0152</a>
    <span class="ds-recent__name" title="เครื่องปรับอากาศ ชั้น 3 (ไม่เย็น)">เครื่องปรับอากาศ ชั้น 3</span>
    <time class="ds-recent__time ds-num" datetime="2025-05-15">15/05/2568</time>
    <span class="ds-pill ds-pill--pending">รอดำเนินการ</span>
  </li>
</ul>
```
- quick: สี tile ผ่าน token เท่านั้น (blue / green / orange / purple — kit ใช้ค่า `-strong` ให้เองเพื่อให้ตัวขาวผ่าน AA; ห้าม yellow/sky/gray); ลิงก์ = `<a>`, action = `<button type="button">`
- recent: ลำดับลูกต้องเป็น id → name → time → pill; คอลัมน์แคบ → `ds-recent ds-recent--reflow`
- notes ที่กดได้: ห่อข้อความด้วย `<a class="ds-notes__link" href="…">` (ไม่ห่อทั้ง `li`); รายการยังไม่อ่านใส่ `is-unread` — ใช้แบบเดียวกันในแผงแจ้งเตือนของ topbar (§8.24)
- ห้าม: ใส่เกิน 4–6 tile ใน `ds-quick` หรือเกิน ~6 รายการใน notes/recent (ใส่ `ds-link-btn` "ดูทั้งหมด" ใน panel head แทน)

### 8.21 Auth (login / ลืมรหัสผ่าน) — ไม่มี sidebar
```html
<body class="ds-body">
<div class="ds-auth">
  <aside class="ds-auth__brand">
    <a class="ds-sidebar__brand" href="dashboard.html">…โลโก้ + ds-sidebar__name + ds-sidebar__tagline (คัดลอกจาก login.html)…</a>
    <div class="ds-auth__intro">
      <p class="ds-auth__headline">สินทรัพย์พร้อมใช้ งานต่อเนื่อง องค์กรเดินหน้า</p>
      <p class="ds-auth__lead">ขับเคลื่อนการบริการงานซ่อมบำรุงรวดเร็ว แม่นยำ ตรวจสอบได้ทุกขั้นตอน</p>
    </div>
    <p class="ds-auth__quote">“ดูแลวันนี้<span>เพื่อพรุ่งนี้ที่ดีกว่า”</span></p>
  </aside>
  <main class="ds-auth__card" id="ds-main">
    <h1 class="ds-auth__title">เข้าสู่ระบบ</h1>
    <p class="ds-auth__sub">ใช้บัญชีผู้ใช้ขององค์กร</p>
    <form class="ds-auth__form" method="post" action="…route เดิม…">
      <!-- CSRF เดิม เช่น @csrf -->
      <div class="ds-field"><label class="ds-field__label" for="u">ชื่อผู้ใช้</label>
        <input class="ds-input" id="u" name="username" autocomplete="username" required></div>
      <div class="ds-field"><label class="ds-field__label" for="p">รหัสผ่าน</label>
        <input class="ds-input" id="p" name="password" type="password" autocomplete="current-password" required></div>
      <div class="ds-auth__row"><label class="ds-check"><input type="checkbox" name="remember"> จดจำฉันไว้</label>
        <a class="ds-link-btn" href="…">ลืมรหัสผ่าน?</a></div>
      <button class="ds-btn ds-btn--lg ds-btn--block" type="submit">เข้าสู่ระบบ</button>
    </form>
    <div class="ds-auth__foot">ยังไม่มีบัญชี? <a href="…">ติดต่อผู้ดูแลระบบ</a></div>
  </main>
</div>
</body>
```
- ≤900px ฝั่ง brand กลายเป็นแถบบน, ≤620px เหลือโลโก้ — ไม่ต้องเขียน CSS เพิ่ม
- ห้าม: เปลี่ยน `name` ของ username/password/remember หรือ action ของฟอร์ม login; ห้ามวาง shell (`ds-app`) ในหน้า auth

### 8.22 ตัวช่วยจัดวางและส่วนเสริม (เพิ่มตอนรวม kit)
| คลาส / attribute | ใช้เมื่อ |
|---|---|
| `ds-actions` (+ `ds-actions--end`) | แถวปุ่มแบบ inline (ปุ่มส่งฟอร์มในพาเนล, ปุ่มหลายอันเรียงกัน) — `--end` = ชิดขวา |
| `ds-subhead` | หัวข้อย่อยในพาเนล / tab panel (เล็กกว่า `ds-panel__title`) |
| `ds-person` (`__body` `__name` `__meta`) | avatar + ชื่อ + ตำแหน่ง/เบอร์ (ผู้รับผิดชอบ, ผู้แจ้ง) — ข้อความไม่ถูกซ่อนบนจอแคบ ต่างจาก `ds-user__meta` |
| `ds-no-print` | ส่วนที่ไม่ต้องพิมพ์ (ฟอร์มความคิดเห็น, แถบเครื่องมือ) |
| `ds-table--stack` | ตารางกลายเป็นการ์ดต่อแถวที่ ≤620px — **ต้องใส่ `data-label="ชื่อคอลัมน์"` ทุก `<td>`** (ยกเว้นช่อง check / actions) |
| `ds-table--fluid` | ตารางสั้นที่ไม่ต้องบังคับกว้างขั้นต่ำ 540px |
| `ds-kpis--3` / `ds-kpis--4` | แถว KPI 3 หรือ 4 ใบ (ค่าปกติ 5; `ds-kpis--auto` = กี่ใบก็ได้) |
| `ds-pager__gap` | `<li class="ds-pager__gap" aria-hidden="true">…</li>` ระหว่างเลขหน้า |
| `ds-alert__actions` | ปุ่มท้าย alert (ขึ้นแถวใหม่เต็มกว้างบนมือถือ); `ul`/`ol` ใน `ds-alert__body` จัดระยะให้แล้ว (สรุป error) |
| `ds-field__hint--split` | hint ซ้าย + ตัวนับขวา: `<p class="ds-field__hint ds-field__hint--split"><span>…</span><span class="ds-num">0/500</span></p>` |
| `ds-file__list` (`__item` `__name` `__size` `__remove`) | รายการไฟล์ที่เลือกใต้ `ds-file` (ไอคอน · ชื่อตัดท้าย · ขนาด · ปุ่มลบ) |
| `ds-btn--ghost[aria-pressed="true"]` · `ds-btn[aria-busy="true"]` | ปุ่ม toggle ที่กดค้าง (เช่น แสดงรหัสผ่าน) · ปุ่มกำลังทำงาน (ไม่จางแม้ `disabled`) |
| `ds-search-btn` + `data-ds-search-toggle` | ปุ่มค้นหาใน topbar ที่ ≤620px (topbar เหลือแถวเดียว) — ดู §5.1 |
| `data-ds-back` | ปุ่ม "ย้อนกลับ" (`<button type="button">`) = `history.back()`; ไม่มีประวัติ → ไปหน้าหลัก (หน้า error §6.6) |
| `data-ds-print` | ปุ่ม "พิมพ์ / บันทึก PDF" = `window.print()` (หน้าเอกสาร §6.7 หรือหน้าที่ซ่อนส่วนไม่พิมพ์ด้วย `ds-no-print`) |

```html
<!-- ตารางที่เป็นการ์ดบนมือถือ -->
<div class="ds-table-wrap" role="region" aria-label="รายการแจ้งซ่อม" tabindex="0">
  <table class="ds-table ds-table--hover ds-table--stack">
    <thead><tr><th scope="col">เลขที่</th><th scope="col">เรื่อง</th><th scope="col">สถานะ</th><th scope="col" class="ds-table__actions">การดำเนินการ</th></tr></thead>
    <tbody><tr>
      <td data-label="เลขที่"><a class="ds-id-link ds-num" href="detail.html?id=SR-202505-0153">SR-202505-0153</a></td>
      <td data-label="เรื่อง">แอร์ไม่เย็น<br><small class="ds-muted">ชั้น 3 ห้อง 301</small></td>
      <td data-label="สถานะ"><span class="ds-pill ds-pill--pending">รอดำเนินการ</span></td>
      <td class="ds-table__actions"><a class="ds-btn ds-btn--ghost ds-btn--icon" href="detail.html?id=SR-202505-0153" aria-label="ดูรายละเอียด SR-202505-0153"><svg class="ds-ic" aria-hidden="true"><use href="#ds-i-eye"></use></svg></a></td>
    </tr></tbody>
  </table>
</div>

<!-- ผู้รับผิดชอบ + ฟอร์มที่ไม่พิมพ์ + ปุ่มชิดขวา -->
<div class="ds-person">
  <span class="ds-avatar" aria-hidden="true">ว</span>
  <span class="ds-person__body"><b class="ds-person__name">วิชัย ช่างเย็น</b><small class="ds-person__meta">ช่างเครื่องปรับอากาศ</small></span>
</div>
<form class="ds-stack ds-no-print" method="post">
  <h4 class="ds-subhead">เพิ่มความคิดเห็น</h4>
  <div class="ds-actions ds-actions--end"><button class="ds-btn" type="submit">ส่งความคิดเห็น</button></div>
</form>
```

### 8.23 Dropdown และเมนู (`ds-dropdown` + `ds-menu`)
ใช้เมื่อ: เมนูผู้ใช้ใน topbar (§5.1), ปุ่ม "เพิ่มเติม ⋯" ใน `ds-page-head__actions` / `ds-panel__tools` ที่มีการกระทำรองหลายอย่าง
```html
<div class="ds-dropdown">
  <button type="button" class="ds-btn ds-btn--ghost ds-btn--icon" data-ds-dropdown aria-controls="srMore"
          aria-expanded="false" aria-haspopup="menu" aria-label="การดำเนินการเพิ่มเติม">
    <svg class="ds-ic" aria-hidden="true"><use href="#ds-i-more"></use></svg></button>
  <div class="ds-menu" id="srMore" role="menu" aria-label="การดำเนินการเพิ่มเติม" hidden>
    <div class="ds-menu__header" role="none"><b>SR-202505-0152</b><small>เครื่องปรับอากาศ ชั้น 3</small></div>   <!-- ไม่บังคับ -->
    <a class="ds-menu__item" role="menuitem" href="print.html"><svg class="ds-ic" aria-hidden="true"><use href="#ds-i-printer"></use></svg>พิมพ์ใบแจ้งซ่อม</a>
    <button type="button" class="ds-menu__item" role="menuitem" data-ds-open="dlgAssign"><svg class="ds-ic" aria-hidden="true"><use href="#ds-i-user"></use></svg>มอบหมายช่าง</button>
    <hr class="ds-menu__sep">
    <button type="submit" form="cancelForm" class="ds-menu__item ds-menu__item--danger" role="menuitem"
            data-ds-confirm="ยกเลิกใบแจ้งซ่อม SR-202505-0152 ?" data-ds-confirm-danger><svg class="ds-ic" aria-hidden="true"><use href="#ds-i-x-circle"></use></svg>ยกเลิกใบแจ้งซ่อม</button>
  </div>
</div>
<form id="cancelForm" method="post" action="…route เดิม…" hidden><!-- @csrf --></form>
```
| ส่วน | กฎ |
|---|---|
| `ds-dropdown` | ตัวครอบ (position:relative) — ปุ่มและเมนูต้องเป็นลูกโดยตรง |
| ปุ่มเปิด | `<button type="button" data-ds-dropdown aria-controls="<id เมนู>" aria-expanded="false" aria-haspopup="menu">` — ใช้คลาสปุ่มเดิมของบริบท (`ds-user`, `ds-icon-btn`, `ds-btn ds-btn--ghost`) |
| `ds-menu` | `role="menu"` + `aria-label` + `hidden` ตอนเริ่ม; เปิดชิดขวาใต้ปุ่ม กว้างอย่างน้อย 220px |
| `ds-menu__item` | `role="menuitem"`; ไปหน้าอื่น = `<a href>`, การกระทำ = `<button type="button">`, ส่งฟอร์ม = `<button type="submit" form="…">` (ฟอร์มวางนอกเมนู); ไอคอนนำหน้า 1 ตัว |
| `ds-menu__item--danger` | ออกจากระบบ / ลบ / ยกเลิก — วางท้ายเมนูหลัง `ds-menu__sep` |
| `ds-menu__header` | หัวเมนู (ชื่อ + ข้อความรองเล็ก) `role="none"` ไม่ใช่ปุ่ม |
| `ds-menu__sep` | `<hr>` เส้นคั่นกลุ่ม |
- พฤติกรรม (kit ทำให้): คลิก/Enter/Space/↓ ที่ปุ่ม = เปิด (เปิดด้วยคีย์บอร์ด → โฟกัสรายการแรก), ↑/↓/Home/End เลื่อนรายการ, Esc ปิดแล้วโฟกัสกลับปุ่ม, คลิกนอก/Tab ออก/เลือกรายการ = ปิด, เปิดได้ทีละเมนู, เปิด drawer มือถือแล้วเมนูปิดเอง
- ห้าม: ใช้ในแถวของ `ds-table-wrap` (เมนูจะถูกตัดด้วย overflow — ใช้ปุ่มไอคอนแยก ดู/แก้/ลบ แทน), ใส่ฟอร์ม/ช่องกรอกในเมนู (ใช้ `ds-dialog`), ซ้อนเมนูย่อยในเมนู, ใช้ `role="menu"` กับรายการลิงก์นำทางของหน้า (นั่นคือ `ds-nav`)

### 8.24 Popover แจ้งเตือน (`ds-popover` + `ds-notes`)
ใช้เมื่อ: แผงการแจ้งเตือนจากกระดิ่งใน topbar (markup เต็มใน §5.1, ข้อมูลจาก server §5.3b / §7b) — แผงเนื้อหาที่มีหัวข้อ ลิงก์ และปุ่ม **ไม่ใช่เมนู**
```html
<div class="ds-popover" id="ds-notif-panel" hidden>
  <div class="ds-popover__head"><h2 class="ds-popover__title">การแจ้งเตือน</h2><button type="button" class="ds-link-btn" data-ds-notif-readall>อ่านทั้งหมดแล้ว</button></div>
  <ul class="ds-notes ds-popover__body">
    <li class="ds-notes__item is-unread">…ยังไม่อ่าน…</li>
    <li class="ds-notes__item">…อ่านแล้ว…</li>
  </ul>
  <div class="ds-popover__foot"><a class="ds-link-btn" href="notifications.php">ดูการแจ้งเตือนทั้งหมด →</a></div>
</div>
```
- ปุ่มเปิดใช้ `aria-haspopup="true"` (ไม่ใช่ `menu`) และ **ไม่มี** `role="menu"` ที่แผง — ผู้ใช้ไล่ด้วย Tab ตามปกติ; Esc/คลิกนอกปิดเหมือน §8.23
- `ds-popover` กว้าง 360px สูงไม่เกิน `min(70vh, 520px)` เนื้อหาใน `__body` เลื่อนได้; ≤620px เป็นแผ่นเต็มกว้างใต้ topbar
- จุดนับ `ds-icon-btn__dot` แสดงจำนวน **ยังไม่อ่าน** (ไม่ใช่จำนวนทั้งหมด), เกิน 99 แสดง `99+`; `aria-label` ของปุ่มต้องบอกจำนวนเดียวกัน
- `data-ds-notif-readall` เปลี่ยนหน้าจอเท่านั้น + ยิง `ds:notif-readall` → ระบบบันทึกเอง (§5.3b)
- ใช้ `ds-popover` กับแผงลอยอื่นที่คล้ายกัน (เช่น สรุปงานของฉัน) ได้ โดยใช้ปุ่ม `data-ds-dropdown` เดียวกัน; ห้ามใส่ฟอร์มยาวในแผง (ใช้ `ds-dialog`)

### 8.25 กลุ่มเมนูย่อยใน sidebar (`ds-nav__group`)
markup และวิธีตั้งสถานะจาก server อยู่ใน **§5.3a** (ตัวอย่าง loop: PHP §7a, Blade §7b)
| คลาส | หน้าที่ |
|---|---|
| `ds-nav__group` | ตัวครอบกลุ่ม (ปุ่ม + รายการลูก) |
| `ds-nav__item ds-nav__toggle` | `<button type="button" aria-expanded aria-controls>` หัวกลุ่ม หน้าตาเหมือนเมนูปกติ; `has-current` = กลุ่มที่มีหน้าปัจจุบัน |
| `ds-nav__caret` | ไอคอน `chevron-down` ท้ายปุ่ม หมุน 180° เมื่อกาง |
| `ds-nav__sub` | กล่องรายการลูก (`id` = ค่าของ `aria-controls`, `hidden` เมื่อพับ) |
| `ds-nav__item ds-nav__subitem` | ลิงก์ลูก (ไม่มีไอคอน) — หน้าปัจจุบันได้ `aria-current="page"`: ตัวขาว หนา 500 + ขอบซ้าย 4px (ไม่ใช่แถบ gradient เต็มแบบเมนูชั้นบน) |
- ใช้เมื่อเมนูมีหน้าย่อย 2–7 หน้าที่อยู่หมวดเดียวกัน; เมนูใช้บ่อยให้อยู่ชั้นบน อย่าซ่อนในกลุ่ม
- ห้าม: ใส่ `href` หรือ `aria-current` ที่ปุ่มหัวกลุ่ม, ทำกลุ่มด้วย `<details>/<summary>` หรือ JS ของตัวเอง, ซ้อนกลุ่มเกิน 1 ชั้น

### 8.26 Combobox — select ที่พิมพ์ค้นหาได้ (แทน Select2)
เขียนแค่ `<select class="ds-select">` ปกติแล้วเติม `data-ds-combobox` — `ds-ui.js` สร้างช่องพิมพ์ค้นหาให้เอง (select ที่เพิ่มมาทีหลังก็ถูกแปลงอัตโนมัติ):
```html
<div class="ds-field">
  <label class="ds-field__label" for="fDept">หน่วยงาน <span class="ds-field__req" aria-hidden="true">*</span></label>
  <select class="ds-select" id="fDept" name="dept" required data-ds-combobox>
    <option value="">— เลือกหน่วยงาน —</option>
    <optgroup label="สำนักงานใหญ่">
      <option value="IT">ฝ่ายไอที</option>
      <option value="HR" selected>ฝ่ายบุคคล</option>
    </optgroup>
    <option value="OLD" disabled>ฝ่ายที่ยุบแล้ว</option>
  </select>
</div>
<!-- kit สร้าง: div.ds-combo > input.ds-input.ds-combo__input#fDept-ds[role=combobox] + button.ds-combo__btn + select.ds-combo__native#fDept
     และรายการ ul.ds-combo__list#fDept-ds-list[role=listbox] (li.ds-combo__option / __group / __empty) ต่อท้าย <body> -->
```
- **select เดิมยังเป็นตัวจริง**: `id`/`name`/`value` เดิม, ฟอร์มส่ง `dept=HR` เหมือนเดิม, event `change`/`input` ยิงที่ select เดิม, script ที่ตั้ง `select.value = 'IT'` หรือ jQuery `$('#fDept').val('IT').trigger('change')` แล้วช่องที่มองเห็นเปลี่ยนตาม; `label for`, `required`, `disabled`, `aria-invalid`, `aria-describedby` ซิงก์ไปช่องที่มองเห็นให้; `focus()` ที่ id เดิมไปโฟกัสช่องที่มองเห็น
- การใช้: พิมพ์ = กรองตัวเลือก (ไม่สนตัวพิมพ์ใหญ่-เล็ก, ตรงส่วนใดของคำก็ได้, ไฮไลต์คำที่ตรงด้วย `<mark>`), ↑/↓ เลื่อน, Enter เลือก, Esc ปิดและคืนค่าเดิม; ออกจากช่องโดยพิมพ์ค้างไว้แต่ไม่ได้เลือก = คืนค่าเดิม (**ไม่รับข้อความอิสระ**); ลบข้อความจนว่าง = เลือก option `value=""` (ถ้ามี); option `disabled` แสดงแต่เลือกไม่ได้; ไม่พบ = "ไม่พบข้อมูล"
- ใช้กับตัวเลือกจำนวนมากที่อยู่ในหน้าแล้ว (~10 ถึงไม่กี่พันรายการ); ตัวเลือกน้อยใช้ `ds-select` ธรรมดา; ใช้ใน `ds-dialog` และ `ds-filters` ได้
- เพิ่ม/แก้ `<option>` หรือตั้ง `option.selected` ตรง ๆ ด้วย script หลังโหลด → เรียก `DS.combobox.sync(select)` ให้ข้อความที่มองเห็นตรงกัน; ห้ามแก้ `ds-combo__*` ที่ kit สร้างโดยตรง
- ข้อความในช่องพิมพ์เปลี่ยนได้ด้วย `data-ds-placeholder="พิมพ์ชื่อหรือรหัสหน่วยงาน…"` ที่ select; พิมพ์ชื่อตัวเลือกตรงทั้งคำแล้วออกจากช่อง = เลือกตัวนั้น; PageUp/PageDown เลื่อนทีละหน้า
- **ย้ายจาก Select2** (`$('.select2').select2()` / `class="select2"` / `data-live-search` ของ bootstrap-select / Tom Select / Choices.js):
  | Select2 เดิม | ทำอย่างไร |
  |---|---|
  | เลือกเดี่ยว, ตัวเลือกอยู่ใน `<option>` (มี/ไม่มี `placeholder`, `allowClear`) | ใส่ `data-ds-combobox` + `ds-select`, ถอดการเรียก `.select2()` ของ element นั้น (และคลาส `select2` ถ้าไม่ใช่ hook ของ script อื่น); `placeholder` → `<option value="">— เลือก… —</option>` |
  | `multiple`, `tags: true`, `ajax: {…}` (ค้นจาก server), `templateResult` แสดงรูป/หลายบรรทัด | **คง Select2 ไว้** (ใส่ `ds-select` ที่ element เดิม + CSS token ตาม §7d ข้อ 5) |
  | `$('#x').on('select2:select', fn)` | เปลี่ยนเป็น `$('#x').on('change', fn)` (combobox ยิง `change` ที่ select เดิม) |
  | `$('#x').val(v).trigger('change.select2')` | `$('#x').val(v).trigger('change')` |
  หลังย้าย ถ้าไม่มี Select2 ตัวไหนเหลือในหน้าแล้ว ให้ลบ `select2.css`/`select2.js` ของหน้านั้นได้ (ทดสอบก่อน)
- ห้าม: ใช้ combobox กับ `<select multiple>`, เขียน markup `ds-combo` เอง, ใช้ `<input list>` + `<datalist>` แทน (ค่าที่ส่งไม่ใช่ value)

## 9. ไอคอน

**กลไก:** `ds-ui.js` ฝัง sprite `<svg id="ds-sprite">` ไว้ต้น `<body>` หนึ่งครั้ง (มี `<symbol id="ds-i-NAME" viewBox="0 0 24 24">` ทุกตัว) หน้าเว็บอ้างอิงด้วย `<use>` — HTML ที่ server เรนเดอร์ได้ตรง ๆ ไม่ต้องรอ JS แปลง
```html
<svg class="ds-ic" aria-hidden="true"><use href="#ds-i-home"></use></svg>            <!-- 22px ค่าปกติ -->
<svg class="ds-ic ds-ic--sm" aria-hidden="true"><use href="#ds-i-clock"></use></svg>  <!-- 16px ในบรรทัดข้อความ -->
<svg class="ds-ic ds-ic--lg" aria-hidden="true"><use href="#ds-i-wrench"></use></svg> <!-- 30px ใน ds-kpi__icon -->
```
- เส้น outline 24×24, stroke 1.8 (`--lg` = 2), สีตาม `currentColor` → เปลี่ยนสีด้วย `color` ของ parent เท่านั้น
- ขนาดเฉพาะบริบท (ช่องค้นหา 18, hero 24, quick 26, ในปุ่ม 16/18) คอมโพเนนต์กำหนดเอง — ห้ามใส่ width/height ที่ svg
- ไอคอนตกแต่ง = `aria-hidden="true"` เสมอ; ความหมายต้องอยู่ที่ข้อความหรือ `aria-label` ของปุ่ม
- สร้างจาก JS: `el.insertAdjacentHTML('beforeend', DS.icon('trash', 'ds-ic--sm'))`; ชื่อที่ไม่มีได้ svg ว่าง + console warning หนึ่งครั้ง

**รายชื่อทั้งหมด (59 ตัว — ตรวจสดได้ด้วย `DS.iconNames`; `sidebar-collapse` / `sidebar-expand` เป็นไอคอนของปุ่มย่อเมนูที่ kit สลับให้เอง §5.4a ไม่ต้องใส่ใน markup)**
| กลุ่ม | ชื่อ |
|---|---|
| นำทาง/โครง | `home` `menu` `search` `bell` `gear` `user` `users` `login` `logout` `lock` `building` `map-pin` `sidebar-collapse` `sidebar-expand` |
| เอกสาร/งาน | `doc` `file-text` `task` `cal` `clock` `printer` `db` `chart` `scan` `image` `paperclip` `wrench` |
| การกระทำ | `plus` `minus` `edit` `trash` `eye` `eye-off` `save` `send` `copy` `download` `upload` `filter` `sort` `refresh` `external` `more` `x` |
| ทิศทาง | `chevron-left` `chevron-right` `chevron-up` `chevron-down` `arrow-left` `arrow-right` |
| สถานะ | `check` `check-circle` `x-circle` `alert` `alert-triangle` `info` |
| ติดต่อ/ธีม | `mail` `phone` `sun` `moon` |

**แปลงชื่อจาก Font Awesome / Heroicons / Bootstrap Icons**
| เดิม | ds |
|---|---|
| `fa-house` `fa-home` / `HomeIcon` / `bi-house` | `home` |
| `fa-bars` / `Bars3Icon` / `bi-list` | `menu` |
| `fa-magnifying-glass` `fa-search` / `MagnifyingGlassIcon` | `search` |
| `fa-plus` / `PlusIcon` | `plus` |
| `fa-pen` `fa-pencil` `fa-edit` / `PencilSquareIcon` | `edit` |
| `fa-trash` `fa-trash-can` / `TrashIcon` | `trash` |
| `fa-eye` / `EyeIcon` | `eye` |
| `fa-floppy-disk` `fa-save` | `save` |
| `fa-download` / `ArrowDownTrayIcon` | `download` |
| `fa-upload` / `ArrowUpTrayIcon` | `upload` |
| `fa-print` / `PrinterIcon` | `printer` |
| `fa-file` `fa-file-lines` / `DocumentTextIcon` | `file-text` (เอกสารทั่วไป `doc`) |
| `fa-calendar` / `CalendarIcon` | `cal` |
| `fa-clock` / `ClockIcon` | `clock` |
| `fa-user` / `UserIcon` · `fa-users` / `UsersIcon` | `user` · `users` |
| `fa-gear` `fa-cog` / `Cog6ToothIcon` | `gear` |
| `fa-screwdriver-wrench` `fa-wrench` | `wrench` |
| `fa-bell` / `BellIcon` | `bell` |
| `fa-check` · `fa-circle-check` / `CheckCircleIcon` | `check` · `check-circle` |
| `fa-xmark` `fa-times` / `XMarkIcon` · `fa-circle-xmark` | `x` · `x-circle` |
| `fa-triangle-exclamation` / `ExclamationTriangleIcon` | `alert-triangle` (`fa-exclamation` = `alert`) |
| `fa-circle-info` / `InformationCircleIcon` | `info` |
| `fa-chart-pie` `fa-chart-bar` / `ChartBarIcon` | `chart` |
| `fa-database` | `db` |
| `fa-filter` / `FunnelIcon` | `filter` |
| `fa-sort` `fa-arrow-down-wide-short` | `sort` |
| `fa-rotate` `fa-sync` / `ArrowPathIcon` | `refresh` |
| `fa-ellipsis` `fa-ellipsis-vertical` | `more` |
| `fa-arrow-up-right-from-square` | `external` |
| `fa-right-from-bracket` `fa-sign-out` | `logout` |
| `fa-envelope` · `fa-phone` · `fa-location-dot` · `fa-building` | `mail` · `phone` · `map-pin` · `building` |
| `fa-paperclip` · `fa-image` · `fa-copy` · `fa-lock` · `fa-qrcode`/`fa-barcode` | `paperclip` · `image` · `copy` · `lock` · `scan` |
| `fa-angle-*` `fa-chevron-*` | `chevron-*` |

- `info` เป็นตัว i ในวงกลม (ตั้งแต่ v1.0.1 — เดิมเป็นตัว i เปล่าแล้วกลืนกับพื้น `ds-alert--info`) ใช้เป็น `ds-alert__icon` ของ `ds-alert--info` ได้เลย
- `alert` เป็นเครื่องหมาย ! ล้วน (ไม่มีวงกลม) — เหมาะกับข้อความ error ในบรรทัด (`ds-field__error`) หรือ `ds-notes__icon` ที่มีวงกลมสีอยู่แล้ว
- ไม่มีตัวที่ตรง → เลือกตัวที่ความหมายใกล้ที่สุดจากตารางข้างบนก่อน แล้วค่อยพิจารณาเพิ่มใหม่
- **เพิ่มไอคอนเฉพาะระบบ** (ห้ามแก้ `ds-ui.js` ส่วนกลาง): วาง sprite ของระบบเองใน layout ใต้ `<body>` ใช้ prefix `app-i-` และ path แบบ 24×24 outline
```html
<svg hidden aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">
  <symbol id="app-i-truck" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7M7.5 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17.5 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></symbol>
</svg>
<svg class="ds-ic" aria-hidden="true"><use href="#app-i-truck"></use></svg>
```
- ไอคอนที่หลายระบบต้องใช้ → แจ้งผู้ดูแล kit ให้เพิ่มใน `ICONS` ของ `template1/assets/ds-ui.js` (ไอคอนใหม่จะมาเป็น `ds-i-NAME`)
- ห้าม: โหลด Font Awesome / icon font เพิ่มในหน้าที่แปลงแล้ว, ห้ามใช้ `<i class="fa …">` ปนกับ `ds-ic`, ห้ามใช้ emoji เป็นไอคอน

## 10. JavaScript API (`window.DS`)

- vanilla JS, ไม่ต้องมี jQuery; ใช้ร่วมกับ jQuery, Alpine.js, Bootstrap JS, SweetAlert2, DataTables ได้
- โหลดใน `<head>` แบบ **ไม่** `defer`/`async` (ธีมถูกตั้งก่อน paint); โหลดซ้ำสองครั้งไม่เป็นไร (ตัวที่สองถูกข้าม)
- ทำงานผ่าน event delegation บน `document` + MutationObserver → เนื้อหาที่มาทีหลัง (AJAX, DataTables redraw, Alpine, Livewire, Turbo) ใช้ได้ทันทีโดยไม่ต้อง init ใหม่
- kit ไม่เรียก `preventDefault`/`stopPropagation` กับ element ที่ไม่มี `data-ds-*` → ไม่ไปแย่ง event ของ script เดิม

### 10.1 Data attributes (ไม่ต้องเขียน JS)
| attribute | ใส่ที่ | ผล |
|---|---|---|
| `data-ds-theme-toggle` | ปุ่ม | สลับ light/dark, ไอคอน sun↔moon, จำใน localStorage `ds-theme` (ข้อความเสริม `data-ds-label-light` / `data-ds-label-dark`) |
| `data-ds-sidebar-toggle[="id"]` | ปุ่ม hamburger | เปิด/ปิด `.ds-sidebar.is-open` (≤900px), คุม `aria-expanded`, Esc/คลิกนอกปิด, ล็อก scroll |
| `data-ds-sidebar-close` | ปุ่มใน sidebar | ปิด sidebar |
| `data-ds-search-toggle` | ปุ่ม `ds-icon-btn ds-search-btn` ใน topbar (วางก่อน `.ds-search`) | ≤620px: เปิด/ปิดช่องค้นหา (`aria-controls`) เป็นแถวเต็มกว้างใต้ topbar, คุม `aria-expanded`, โฟกัส input, Esc ปิด |
| `data-ds-filters-toggle` | ปุ่ม `ds-filters__toggle` ใน `.ds-filters--collapsible` | ≤620px: เปิด/ปิดช่อง `ds-filters__more` ของฟอร์มที่ `aria-controls` ชี้ (หรือ `.ds-filters` ที่ครอบ) และคุม `aria-expanded` |
| `data-ds-open="dialogId"` | ปุ่ม | `showModal()` ของ `<dialog id>`; โฟกัสกลับที่ปุ่มเมื่อปิด |
| `data-ds-close[="value"]` | ปุ่มใน dialog | ปิด dialog ที่ครอบอยู่ (`returnValue` = value) |
| `data-ds-backdrop-close` | `<dialog>` | คลิกพื้นหลังแล้วปิด |
| `data-ds-tip="ข้อความ"` | element ใดก็ได้ (รวม SVG) | tooltip ทั้งเมาส์และคีย์บอร์ด |
| `data-ds-confirm="คำถาม"` | ลิงก์/ปุ่ม submit | ถาม `DS.confirm` ก่อน กด OK จึงทำต่อ; เสริม `data-ds-confirm-title`, `-ok`, `-cancel`, `data-ds-confirm-danger` |
| `data-ds-clock="time\|date\|date-short\|year"` | ข้อความ | นาฬิกาสด "10:24 น." / วันยาว / "15/05/2568" / ปี — ปีเป็น พ.ศ. ตามค่าเริ่มต้น; `data-ds-clock-ce` = บังคับ ค.ศ. |
| `data-ds-dropdown` | ปุ่มใน `.ds-dropdown` (+ `aria-controls` ชี้ `ds-menu`/`ds-popover`) | เปิด/ปิดด้วย attribute `hidden`, คุม `aria-expanded`, เปิดได้ทีละอัน, ปิดเมื่อคลิกนอก/Esc (โฟกัสกลับปุ่ม)/Tab ออก/เลือก `ds-menu__item`; `role=menu`: ↑/↓/Home/End เลื่อนรายการ, เปิดด้วย Enter/Space/↓ แล้วโฟกัสรายการแรก; เปิดแล้วปิด drawer และกลับกัน |
| `data-ds-notif-readall` | ปุ่มในหัว `ds-popover` | ลบ `is-unread` ของรายการในแผงเดียวกัน, ซ่อนจุดนับของปุ่มเปิด, เปลี่ยน `aria-label` ของปุ่มเปิดเป็น "การแจ้งเตือน" (หรือค่า `data-ds-label-read` ของปุ่มเปิด), ยิง `ds:notif-readall` {count, panel, trigger} (ระบบต้อง POST บันทึกเอง §5.3b) |
| `select[data-ds-combobox]` | `<select class="ds-select">` เลือกเดี่ยว | แปลงเป็นช่องพิมพ์ค้นหา (`ds-combo`) โดย select เดิมยังเป็นตัวส่งค่า — §8.26; `data-ds-placeholder="…"` ที่ select = เปลี่ยนข้อความ "พิมพ์เพื่อค้นหา…" |
| `.ds-nav__toggle` (อัตโนมัติ) | ปุ่มหัวกลุ่มใน `ds-nav__group` | สลับ `aria-expanded` + `hidden` ของ `ds-nav__sub` (ยิง `ds:navgroup`); ตอนโหลดเปิดกลุ่มที่มี `aria-current="page"` + ใส่ `has-current`; กลุ่มที่ผู้ใช้กางเองจำไว้ใน sessionStorage `ds-nav-open` (เฉพาะแท็บนั้น); ในแถบไอคอนกด = ขยาย sidebar แล้วกางกลุ่ม |
| `data-ds-back[="url"]` | ปุ่ม / ลิงก์ | `history.back()`; ถ้าแท็บไม่มีประวัติ (เปิดจากแท็บใหม่) ไปที่ค่า attribute → `href` ของลิงก์ → `dashboard.html` ตามลำดับ — **ระบบจริงต้องใส่ URL หน้าหลักเสมอ** เช่น `data-ds-back="{{ route('dashboard') }}"` / `data-ds-back="index.php"` |
| `data-ds-print` | ปุ่ม | `window.print()` (ถ้าเบราว์เซอร์พิมพ์ไม่ได้ ปุ่มถูกซ่อนเอง) |
| `.ds-tabs[role=tablist]` | tablist | ต่อสายอัตโนมัติ: click, ←/→/Home/End, `aria-selected`, roving tabindex, ซ่อน/แสดง panel; tab กรองหลายอันชี้ `aria-controls` เดียวกันได้ (panel นั้นไม่ถูกซ่อน) |

```html
<form method="post" action="/requests/15/delete">
  @csrf @method('DELETE')
  <button class="ds-btn ds-btn--danger" type="submit" data-ds-confirm="ลบใบแจ้งซ่อม SR-202505-0001 ?"
          data-ds-confirm-ok="ลบ" data-ds-confirm-danger>ลบ</button>
</form>
```

### 10.2 ฟังก์ชัน
| API | คืนค่า / หมายเหตุ |
|---|---|
| `DS.version` | `'1.0.2'` |
| `DS.init(root?)` | สแกน container ใหม่ (ปกติไม่ต้องเรียก) |
| `DS.theme.get()` | `'light' \| 'dark'` (ตาม OS ถ้ายังไม่เคยเลือก) |
| `DS.theme.set('light'\|'dark'\|'system')` · `DS.theme.toggle()` | ยิง event `ds:themechange` {theme, source} ที่ document — source = `'toggle'` | `'api'` | `'os'` (ข้าม toast เมื่อ `'os'`) |
| `DS.icon(name, extraClass?)` | string `<svg class="ds-ic …"><use href="#ds-i-name">` |
| `DS.iconNames` | array ชื่อไอคอนทั้งหมด |
| `DS.sidebar.open(id?)` `.close(id?)` `.toggle(id?)` `.isOpen(id?)` | คุม sidebar off-canvas |
| `DS.dialog.open(idOrEl)` · `DS.dialog.close(idOrEl, value?)` | เปิด/ปิด `<dialog class="ds-dialog">` |
| `DS.dropdown.open(elOrId)` · `.close()` · `.toggle(elOrId)` | เปิด/ปิด `ds-menu` / `ds-popover` (รับปุ่มเปิด แผง หรือ id ของอย่างใดอย่างหนึ่ง เช่น `DS.dropdown.open('ds-notif-panel')`); `close()` = ปิดตัวที่เปิดอยู่; ยิง `ds:dropdown` {open, panel} ที่ปุ่มเปิด |
| `DS.combobox.enhance(select)` · `.open(select)` · `.close()` · `.sync(select)` | แปลง `<select>` เป็น combobox (ปกติไม่ต้องเรียก — kit แปลง `select[data-ds-combobox]` ทุกตัวรวมที่เพิ่มมาทีหลัง); `sync` = อัปเดตข้อความที่มองเห็นหลัง script ตั้ง `option.selected` ตรง ๆ หรือแก้รายการ `<option>` (การตั้ง `select.value` / `selectedIndex` / `$(select).val(x)` / event `change` ซิงก์เองอยู่แล้ว) |
| `DS.tabs.select(tabElOrSelector, {focus, silent})` | เลือก tab จากโค้ด (`silent:true` = ไม่ยิง `ds:tabchange`) |
| `DS.toast(msg, {type:'info'\|'success'\|'danger', timeout:2600})` | `{close()}`; ทีละอัน, `timeout:0` = ค้าง, `'error'` = `'danger'` |
| `DS.confirm({title, text, okText, cancelText, danger})` | `Promise<boolean>` (Esc/พื้นหลัง/ยกเลิก = false); ส่ง string ได้ = text |
| `DS.charts.donut(svg, items, {center, centerLabel, unit, legend, legendFormat})` | วง donut + legend |
| `DS.charts.pie(svg, items, {unit, legend, legendFormat})` | pie (legend แบบ %) |
| `DS.charts.bars(el, items, {unit, total, emptyText})` | bar แนวนอน, ความยาวเทียบค่าสูงสุด |
| `DS.charts.legend(ul, items, {format:'count-pct'\|'pct'\|'count'\|fn, total})` | legend อย่างเดียว |
| `DS.fmtDate(d, {be})` | `'15/05/2568'` (ค่าเริ่มต้น พ.ศ.); `{be:false}` → `'15/05/2025'` |
| `DS.parseDate(str)` | `'15/05/2568'` / `'15/05/2025'` / `'2025-05-15'` → `Date` (ปี > 2400 อ่านเป็น พ.ศ.); ไม่ถูกต้อง → `null` |
| `DS.config.era` | `'be'` (ค่าเริ่มต้น = ปฏิทินไทย พ.ศ.) หรือ `'ce'` — ตั้งครั้งเดียวต่อหน้า ก่อน DOMContentLoaded |
| `DS.datepicker.enhance(el)` / `.open(el)` / `.close()` | ปฏิทินไทย (ทำอัตโนมัติกับทุก `input[type=date].ds-input` อยู่แล้ว — ใช้ `enhance` เฉพาะ input ที่สร้างเองแบบไม่มี class) |
| `DS.fmtDateLong(d, {be, weekday})` | `'15 พฤษภาคม 2568'` / `'วันพฤหัสบดีที่ 15 พฤษภาคม 2568'` |
| `DS.fmtTime(d)` | `'10:24'` (เติม " น." เองเมื่อแสดงผล) |
| `DS.fmtNum(n, {decimals})` · `DS.fmtPct(n, total, {decimals:1})` | `'1,234'` · `'14.1%'` |
| `DS.esc(str)` | escape HTML — **ต้องใช้ทุกครั้ง** ที่ต่อค่าจากข้อมูลเข้า innerHTML |
| `DS.now()` | แหล่งเวลาของนาฬิกา; override เพื่อ demo ได้ |

`items` ของกราฟ = `[{label:'รอดำเนินการ', value:18, color:'--ds-yellow'}]` — `color` เป็น **ชื่อ custom property** (default palette วนตาม blue, sky, green, yellow, orange, red, purple, gray); `svg`/`el` เป็น element หรือ selector ก็ได้; tooltip ของ segment สร้างให้อัตโนมัติ; label ถูก escape แล้ว; `fmtDate` รับ `Date`, timestamp, `'YYYY-MM-DD'` (อ่านเป็นวันท้องถิ่น) หรือ string ที่ `Date` อ่านได้

### 10.3 สูตรที่ใช้บ่อย
```html
<!-- flash message จาก server (PHP session / Laravel) ท้าย <body> -->
@if (session('success'))<script>DS.toast(@json(session('success')), {type:'success'})</script>@endif
<?php if (!empty($_SESSION['flash'])): ?><script>DS.toast(<?= json_encode($_SESSION['flash']) ?>, {type:'success'})</script><?php endif; ?>
```
```js
// แทน SweetAlert2 confirm เดิม (ถ้าจะเปลี่ยน — Swal เดิมใช้ต่อได้)
DS.confirm({title:'ลบรายการนี้?', text:'ไม่สามารถย้อนกลับได้', okText:'ลบ', danger:true})
  .then(function (ok) { if (ok) form.submit(); });
// ต่อค่าจาก AJAX เข้า HTML
row.innerHTML = '<td>' + DS.esc(item.name) + '</td><td class="ds-num">' + DS.fmtDate(item.date) + '</td>';
// jQuery ฟังการเปลี่ยนธีม (เช่น redraw กราฟ lib อื่น)
$(document).on('ds:themechange', function (e) { redraw(e.originalEvent.detail.theme); });
```
- Alpine: `@click="DS.sidebar.toggle()"` หรือคง `data-ds-*` ไว้เฉย ๆ; ถ้า Alpine จะคุม sidebar เอง ให้ bind `:class="{'is-open': open}"` และไม่ใส่ `data-ds-sidebar-toggle`
- Bootstrap 5.3: ถ้า `<html>` มี `data-bs-theme` อยู่แล้ว kit จะตั้งค่าให้ตรงกันเอง
- Events (bubble ทุกตัว ฟังที่ `document` ได้): `ds:themechange` (document) · `ds:tabchange` {tab, panel} (tablist) · `ds:sidebar` {open} (sidebar) · `ds:dropdown` {open, panel} (ปุ่ม `data-ds-dropdown`) · `ds:notif-readall` {count, panel, trigger} (ปุ่ม `data-ds-notif-readall`) · `ds:navgroup` {open, sub} (ปุ่ม `ds-nav__toggle`, เฉพาะเมื่อผู้ใช้กด)
- id ที่ kit สร้าง (ห้ามใช้ซ้ำ): `ds-sprite` `ds-tip` `ds-toast` `ds-live` `ds-live-alert` `ds-dlg-title-N` `ds-dlg-text-N` `ds-tab-N` `ds-legend-N` และของ combobox `<id>-ds` `<id>-ds-list` `<id>-ds-oN` (select ที่ใช้ `data-ds-combobox` ควรมี id และ `<label for>` คู่กัน)
- ปุ่มในแม่แบบใช้ `data-ds-print` / `data-ds-back` แทน `onclick="window.print()"` / `onclick="history.back()"`
- ห้าม: เขียน JS สลับ class `dark` / แก้ `data-theme` เอง (ใช้ `DS.theme.*`), ห้ามใช้ class `ds-*` เป็น selector ของ script ระบบ (hook ของระบบใช้ id หรือ `data-*` ของตัวเอง)

## 11. ภาษาและเนื้อหา

| เรื่อง | กฎ | ตัวอย่าง |
|---|---|---|
| ชื่อ panel | ภาษาไทยก่อน; ถ้าระบบเดิมมีคำอังกฤษกำกับ ใช้ "ไทย (English)" | `สถานะงานแจ้งซ่อม (Status)` |
| ชื่อหน้า (h2) | คำนามสั้น ตรงกับเมนู | `รายการแจ้งซ่อม`, `แจ้งซ่อมใหม่` |
| label ฟิลด์ | คำนาม ไม่มี ":" ท้าย | `ประเภทครุภัณฑ์` |
| ปุ่ม | กริยา + กรรม (ชัดว่าทำอะไร) | `บันทึกใบแจ้งซ่อม`, `อนุมัติคำขอ`, `ส่งออก Excel` |
| ปุ่มคู่ | ยกเลิก (ghost) ↔ กริยาหลัก (primary) | `ยกเลิก` / `บันทึก` |
| ลบ | `ลบ` + ยืนยันผ่าน `data-ds-confirm` ที่ระบุชื่อสิ่งที่ลบ | `ลบใบแจ้งซ่อม SR-… ?` |
| ลิงก์ต่อ | `ดูทั้งหมด →`, `ดูรายละเอียด` | |

**คำสถานะมาตรฐาน** (ห้ามใช้สีอื่นแทน):
| คำ | class | ความหมาย/คำพ้องที่ map เข้า |
|---|---|---|
| รอดำเนินการ | `ds-pill--pending` | รอตรวจสอบ, รออนุมัติ, ใหม่ |
| กำลังดำเนินการ | `ds-pill--progress` | อยู่ระหว่างซ่อม, กำลังพิจารณา |
| เสร็จสิ้น | `ds-pill--done` | อนุมัติแล้ว, ปิดงาน, ใช้งานได้ |
| ยกเลิก | `ds-pill--cancel` | ไม่อนุมัติ, ตีกลับ, เกินกำหนด |
| (ข้อมูล) | `ds-pill--info` | รออะไหล่, ส่งต่อ |
| (กลาง) | `ds-pill--neutral` | ฉบับร่าง, ปิดใช้งาน |
- **คงคำสถานะเดิมของระบบ** (ข้อความมาจาก DB/enum) — เปลี่ยนแค่ class สีให้ตรงกลุ่ม ห้ามเปลี่ยนค่าที่บันทึก

**วันที่ เวลา ตัวเลข**
- วันที่ `dd/mm/yyyy` เสมอ (`DS.fmtDate`, PHP `date('d/m/Y')`, Carbon `->format('d/m/Y')`)
- **ใช้ปฏิทินไทย (พ.ศ.) เป็นมาตรฐาน**: ทุกวันที่ที่ผู้ใช้เห็นแสดงปี พ.ศ. (`15/05/2568`) — `DS.fmtDate` / `DS.fmtDateLong` / `data-ds-clock` / ตัวเลือกวันที่ ของ kit เป็น พ.ศ. อยู่แล้ว; ฝั่ง PHP ให้บวก 543 ตอนแสดงผล (เช่น `date('d/m/') . (date('Y') + 543)` หรือ Carbon `->format('d/m/') . ($d->year + 543)`)
- ค่าที่ส่งเข้า/ออกเซิร์ฟเวอร์ (form value, query string, API, DB) ยังเป็น **ISO ค.ศ. `YYYY-MM-DD`** เสมอ — ห้ามเก็บ พ.ศ. ลงฐานข้อมูล
- ยกเว้นเฉพาะระบบที่ผู้ใช้สั่งให้ใช้ ค.ศ.: ตั้ง `DS.config.era = 'ce'` ครั้งเดียวใน layout — **ทั้งระบบต้องใช้แบบเดียว**
- วันที่ยาว: `15 พฤษภาคม 2568` (`DS.fmtDateLong`); เวลา `10:24 น.` (24 ชม. + " น."); วันที่+เวลา `15/05/2568 10:24 น.`
- ใส่ `datetime="2025-05-15"` (ISO ค.ศ.) ใน `<time>` เสมอ แม้ข้อความจะเป็น พ.ศ.
- ตัวเลข/เงิน/วันที่ในตารางและ KPI → `ds-num` (tabular); คั่นหลักพัน `1,234`; เงิน `1,234.50 บาท`; ร้อยละ `14.1%`

**ข้อความว่าง / ผิดพลาด** — สุภาพ สั้น บอกสิ่งที่ทำต่อได้ ไม่โทษผู้ใช้ ไม่ใช้ตัวพิมพ์ใหญ่/อัศเจรีย์
- ว่าง: `ยังไม่มีใบแจ้งซ่อม` + `เมื่อมีการแจ้งซ่อม รายการจะแสดงที่นี่`; ค้นหาไม่พบ: `ไม่พบรายการที่ตรงกับเงื่อนไข`
- error ฟิลด์: `กรุณากรอกรายละเอียด`, `รูปแบบอีเมลไม่ถูกต้อง`; error ระบบ: `บันทึกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง`
- สำเร็จ (toast): `บันทึกใบแจ้งซ่อม SR-202505-0153 แล้ว` (อดีต + ระบุสิ่งที่ทำ)
- ห้าม: แสดง stack trace / SQL error / ข้อความอังกฤษดิบจาก exception ให้ผู้ใช้

**ข้อความของเมนู แผงแจ้งเตือน combobox หน้า error และเอกสาร**
| ที่ | ข้อความมาตรฐาน |
|---|---|
| เมนูผู้ใช้ | `ข้อมูลส่วนตัว` · `เปลี่ยนรหัสผ่าน` · `ออกจากระบบ` (อันตราย อยู่ท้ายสุด); `aria-label="เมนูผู้ใช้"` |
| แผงแจ้งเตือน | หัว `การแจ้งเตือน` · ปุ่ม `อ่านทั้งหมดแล้ว` · ท้าย `ดูการแจ้งเตือนทั้งหมด →` · ว่าง `ไม่มีการแจ้งเตือนใหม่`; ข้อความแต่ละรายการขึ้นต้นด้วยสิ่งที่เกิด + เลขที่ เช่น `SR-202505-0153 ได้รับมอบหมายให้คุณ` |
| ปุ่มกระดิ่ง (`aria-label`) | `การแจ้งเตือน (ยังไม่อ่าน 3 รายการ)` / ไม่มี = `การแจ้งเตือน` |
| combobox | option ว่าง `— เลือกหน่วยงาน —` (บอกสิ่งที่เลือก), ช่องพิมพ์ `พิมพ์เพื่อค้นหา…`, ไม่พบ `ไม่พบข้อมูล` |
| หน้า error | h1 ตามตาราง §6.6 + ข้อความบอกสิ่งที่ทำได้ เช่น 404 `ลิงก์อาจไม่ถูกต้องหรือหน้านี้ถูกย้ายแล้ว`, 403 `บัญชีของคุณไม่มีสิทธิ์ใช้งานหน้านี้ หากต้องการสิทธิ์ โปรดติดต่อผู้ดูแลระบบ`, 419 `เพื่อความปลอดภัย กรุณาเข้าสู่ระบบอีกครั้ง`; ปุ่ม `กลับหน้าหลัก` / `ย้อนกลับ`; meta `รหัสอ้างอิง: … · เวลา 15/05/2568 10:24 น.` |
| เอกสาร A4 | หัวข้อมีเลขลำดับ `1. ข้อมูลผู้แจ้ง`; ช่องลงนาม `ลงชื่อ ……… / ( ชื่อ-สกุล ) / ตำแหน่ง ……… / วันที่ ……/……/……`; ท้าย `แบบฟอร์ม <รหัส> · พิมพ์เมื่อ 15/05/2568 10:24 น. · หน้า 1/1`; วันที่ พ.ศ. เสมอ |

## 12. การเข้าถึง (Accessibility) และโหมดมืด

**Accessibility — กฎที่ตรวจได้**
1. ทุก control มีชื่อ: `<label for>` คู่ `id`, หรือ `aria-label` (ช่องค้นหา, select ใน panel tools, ปุ่มไอคอน, checkbox ในตาราง)
2. Error: control ได้ `aria-invalid="true"` + `aria-describedby="<id ของ ds-field__error>"`; hint ก็ผูกด้วย `aria-describedby` (หลาย id คั่นช่องว่าง)
3. Required: attribute `required` บน control + `<span class="ds-field__req" aria-hidden="true">*</span>` ใน label
4. โฟกัส: kit มีวง `:focus-visible` ให้ทุกคอมโพเนนต์ — ห้าม `outline:none` / `outline-0` โดยไม่มีวงแทน
5. คีย์บอร์ด: ทุกอย่างที่คลิกได้ต้องเป็น `<a href>` หรือ `<button>` (ห้าม `div onclick`); tabs ใช้ลูกศรได้, dialog ปิดด้วย Esc และคืนโฟกัส (kit ทำให้ถ้าใช้ `data-ds-open` / `DS.dialog`)
6. Landmark: ใช้ shell ของ starter.html ครบ (skip link `ds-skip-link` → `#ds-main`, `<nav aria-label>`, `<main>`); เมนูปัจจุบัน `aria-current="page"`
7. หัวข้อ: h1 = topbar (หรือ `ds-auth__title`), h2 = ชื่อหน้า / ชื่อ dialog, h3 = panel / form section — ไม่ข้ามระดับ
8. สีไม่ใช่สัญญาณเดียว: pill มีข้อความเสมอ, KPI delta มี ▲/▼ + `ds-sr-only`, error มีข้อความ, กราฟมี legend ที่มีตัวเลข
9. Contrast: kit ผ่าน **WCAG AA ทั้งสองธีม** (ข้อความ ≥ 4.5:1, ข้อความใหญ่/ไอคอน/ขอบ control ≥ 3:1 — §3.6) เมื่อใช้ token ตามความหมาย; ตัวอักษรขาวบนพื้นสีใช้ `--ds-*-strong` เท่านั้น, ห้ามตัวขาวบน `--ds-yellow`/`--ds-sky`/`--ds-gray`; ห้ามเอาข้อความ `--ds-ink-3` ไปวางบน `--ds-surface-2` สำหรับเนื้อหาสำคัญ; สีที่ระบบกำหนดเอง (override token แบรนด์ §3.5) ต้องตรวจ contrast ใหม่ทั้งสองธีม
10. ตาราง: `<caption>` (ใช้ `ds-sr-only` ได้), `<th>` จริง, `aria-sort` บน th ที่เรียงได้, checkbox แถวมี `aria-label="เลือก <เลขที่>"`
11. Motion: kit ลด animation เองเมื่อ `prefers-reduced-motion` — animation ที่เพิ่มเองต้องห่อด้วย `@media (prefers-reduced-motion: no-preference)`
12. ภาษา: `<html lang="th">`; คำอังกฤษล้วนที่อ่านออกเสียงแยก ใส่ `lang="en"` (เช่น `ds-kpi__label`)
13. การแจ้งเตือนแบบ live: `DS.toast` ประกาศให้ screen reader อัตโนมัติ — ไม่ต้องเพิ่ม `aria-live` เอง
14. เมนู (`ds-menu`): ปุ่มเปิดมี `aria-haspopup="menu"` + `aria-expanded` + `aria-controls`; เมนูมี `role="menu"` + `aria-label`; ทุกรายการ `role="menuitem"` (หัวเมนู `role="none"`, เส้นคั่นเป็น `<hr>`); ห้ามใส่ element โฟกัสได้อื่นในเมนู (input, ลิงก์ที่ไม่ใช่ menuitem); ปุ่มกระดิ่ง/ปุ่มไอคอน "⋯" ต้องมี `aria-label` ที่บอกจำนวน/ความหมาย
15. แผงแจ้งเตือน (`ds-popover`) ไม่ใช่เมนู: ปุ่มเปิดใช้ `aria-haspopup="true"`, ภายในมีหัวข้อ `h2`, รายการเป็น `<ul>` + ลิงก์ปกติ ไล่ด้วย Tab; จำนวนยังไม่อ่านอยู่ใน `aria-label` ของปุ่ม (จุดนับเป็น `aria-hidden`); สถานะยังไม่อ่านไม่ใช้สีอย่างเดียว (มีจุด/ตัวหนา)
16. Combobox: ช่องที่มองเห็นมี `role="combobox"` + `aria-expanded` + `aria-controls` + `aria-autocomplete="list"` + `aria-activedescendant` ชี้ option ที่ไฮไลต์, รายการ `role="listbox"` + `role="option"` + `aria-selected` — kit สร้างให้ทั้งหมด หน้าที่ของ AI คือ **ต้องมี `<label for="id ของ select">`** (หรือ `aria-label` ที่ select) และ error ผูก `aria-describedby` ที่ select เดิม
17. กลุ่มเมนูย่อย: หัวกลุ่มเป็น `<button aria-expanded aria-controls>` (อ่านว่า "ยุบ/ขยาย"), หน้าปัจจุบันมี `aria-current="page"` ที่ลูก, กลุ่มที่มีหน้าปัจจุบันต้องเปิดอยู่ตั้งแต่โหลด (ผู้ใช้ screen reader จะเจอเมนูปัจจุบันทันที)
18. หน้า error / เอกสาร: หน้า error มี `<main id="ds-main">` + h1 และปุ่มจริง (`data-ds-back` เป็น `<button>`); เอกสาร A4 ใช้ตาราง `<th>`/`<td>` จริงสำหรับ label–ค่า และ `ds-print-toolbar` อยู่นอก `article.ds-doc`

**โหมดมืด**
- ทำงานด้วย `<html data-theme="light|dark">` + token `--ds-*` เท่านั้น; ไม่มี class `dark:`, ไม่มี CSS แยกไฟล์
- ถ้าทุกสีมาจาก token (`var(--ds-surface)`, `var(--ds-ink)`, `var(--ds-line)` …) หน้านั้นรองรับ dark อัตโนมัติ
- สีที่ถูก hard-code (`#fff`, `bg-white`, `text-gray-700`, `style="color:#333"`) = จุดที่พังในโหมดมืด → ต้องเปลี่ยนเป็น token
- token ที่ใช้บ่อย: พื้นหน้า `--ds-bg` · การ์ด `--ds-surface` · พื้นรอง `--ds-surface-2` · เส้น `--ds-line` · ข้อความ `--ds-ink` / `--ds-ink-2` / `--ds-ink-3` · ลิงก์ `--ds-link` · ดี/แย่ `--ds-good` / `--ds-bad` · palette `--ds-blue` … `--ds-gray`
- sidebar/hero/datecard เป็น navy ทั้งสองธีม (ตั้งใจ) — ไม่ต้องแก้; แผ่นเอกสาร `ds-doc` เป็นกระดาษขาวตัวดำทั้งสองธีม (ตั้งใจ — token `--ds-doc-*`) ส่วน `ds-print-toolbar` และพื้นรอบแผ่นเปลี่ยนตามธีม
- บังคับธีมจาก server: เขียน `data-theme="light"` บน `<html>` (ชนะค่าที่ผู้ใช้เคยเลือก)
- ทดสอบ: กดปุ่ม `data-ds-theme-toggle` หรือรัน `DS.theme.set('dark')` ใน console แล้วไล่ดูทุกหน้า — ต้องไม่มีกล่องขาว ข้อความมองไม่เห็น หรือเส้นหาย
- CSS เฉพาะระบบ (ถ้าจำเป็นจริง) ต้องใช้ token: `.app-note{background:var(--ds-surface-2);color:var(--ds-ink-2);border:1px solid var(--ds-line)}`

## 13. ขั้นตอนแปลงระบบเดิม (Migration playbook for AI)

**ขั้น 0 — อ่านก่อน**: อ่านไฟล์นี้ทั้งฉบับ + `template1/pages/starter.html` + หน้า kit ที่ใกล้ที่สุด (dashboard / list / form / detail / login / error / print / components) ห้ามเดา class

**ขั้น 1 — สำรวจ (ยังไม่แก้โค้ด)** สร้างรายการ:
- layout/master ทั้งหมด (`resources/views/layouts/*`, `components/layouts/*`, `header.php`/`footer.php`/`menu.php`, `include/*`)
- ทุกหน้า → จัดเข้า archetype: dashboard / list (ตาราง+ตัวกรอง) / form (สร้าง-แก้ไข) / detail (ดูข้อมูล+ประวัติ) / auth / error (403/404/419/500/503 — `resources/views/errors/*`, `error.php`, ErrorDocument) / print (หน้าพิมพ์ใบฟอร์ม HTML) / อื่น ๆ
- ส่วนที่มักซ่อนอยู่ใน layout: dropdown ผู้ใช้/แจ้งเตือนใน navbar, เมนูย่อยใน sidebar (treeview), Select2 ในฟอร์ม, CSS `@media print` / หน้า print แยก
- CSS/JS ที่โหลดอยู่ (Bootstrap, Tailwind build, DaisyUI, AdminLTE, FA, DataTables, Select2, SweetAlert2, Chart.js) และ script ของระบบที่อ้าง class/id ใน DOM (grep `$('.`, `querySelector`, `getElementById`, `x-data`, `wire:`)
- เสนอแผน (ลำดับไฟล์ที่จะแก้) ก่อนลงมือ

**ขั้น 2 — ใส่ assets** ใน `<head>` ของ layout (ก่อน CSS เดิมหรือหลังก็ได้ — class ไม่ชนกันเพราะมี prefix):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap">
<link rel="stylesheet" href="/template/template1/assets/ds-ui.css?v=1.0.2">
<script src="/template/template1/assets/ds-ui.js?v=1.0.2"></script>
```
ลบการโหลดฟอนต์เดิม (Sarabun/Prompt) และ `font-family` ที่ตั้งบน `body` ของ layout ที่แปลงแล้ว (kit ใช้ `--ds-font`)

**ขั้น 3 — เปลี่ยน layout shell** ตาม starter.html: `ds-body` → `ds-app` → `ds-sidebar` (เมนูเดิมทุกรายการ, URL/route เดิม, สิทธิ์ `@can`/`if($role)` เดิม) → `ds-main` → `ds-topbar` → `<main class="ds-content" id="ds-main">` → `ds-footer`; เมนูปัจจุบันใช้ `aria-current="page"` (เช่น `@if(request()->routeIs('requests.*')) aria-current="page" @endif`)
- ทดสอบทันทีว่าทุกหน้ายังเปิดได้ (เนื้อหาเก่ายังหน้าตาเดิมอยู่ใน `ds-content` ได้ชั่วคราว)

**ขั้น 4 — แปลงทีละหน้า ตาม archetype** (ทำ 1 หน้าต่อรอบ แล้วทดสอบ)
| archetype | ต้นแบบ | โครง |
|---|---|---|
| dashboard | dashboard.html | page head → (hero-row) → `ds-kpis` → `ds-grid--dash-a` (กราฟ) → `ds-grid--dash-b` (ตาราง/recent/notes) |
| list | list.html | page head (+ปุ่มสร้าง) → `ds-filters` → panel > `ds-table-wrap` + `ds-pager` |
| form | form.html | page head → `ds-stack` ของ `ds-form-section` → `ds-form-actions` |
| detail | detail.html | page head (+ปุ่มแก้ไข/พิมพ์) → `ds-grid--aside`: `ds-dl` + `ds-tabs` / aside: สถานะ + `ds-timeline` |
| auth | login.html | `ds-auth` ไม่มี shell |
| error | error.html | `ds-error` ไม่มี shell — server render ตาม status code (§6.6) |
| print | print.html | `ds-print-toolbar` + `article.ds-doc` ×n (A4, Sarabun, ขาว-ดำ — §6.7) |

**ขั้น 5 — ตาราง mapping (เดิม → ใหม่)**
| เดิม | ใหม่ |
|---|---|
| BS `btn btn-primary` · DaisyUI `btn btn-primary` | `ds-btn` |
| BS `btn btn-secondary` / `btn-outline-*` / `btn-light` · DaisyUI `btn-ghost` `btn-outline` | `ds-btn ds-btn--ghost` |
| BS/DaisyUI `btn-danger` / `btn-error` · `btn-success` | `ds-btn ds-btn--danger` · `ds-btn ds-btn--success` |
| `btn-sm` · `btn-lg` · `btn-block` / `w-full` | `ds-btn` (ปกติ) · `ds-btn--lg` · `ds-btn--block` |
| `btn btn-link` · ลิงก์ "ดูทั้งหมด" | `ds-link-btn` |
| BS `card` + `card-header` + `card-body` · BS3 `panel panel-default` · DaisyUI `card bg-base-100 shadow` + `card-body` + `card-title` | `ds-panel` + `ds-panel__head` + `ds-panel__title` (body ไม่ต้องมี wrapper) |
| Tailwind `bg-white rounded-lg shadow p-4` (+ `dark:bg-gray-800`) | `ds-panel` |
| `table table-striped table-bordered table-hover` · DaisyUI `table table-zebra` · `table-responsive` / `overflow-x-auto` | `ds-table` (`ds-table--hover` ในหน้า list) ใน `ds-table-wrap` |
| สถานะ `badge bg-warning` / `label label-warning` / `badge badge-warning` | `ds-pill ds-pill--pending` (ดูตาราง §11 สำหรับสีอื่น) |
| ตัวนับ `badge bg-danger rounded-pill` · DaisyUI `badge badge-error` | `ds-badge` |
| `alert alert-success` (BS/DaisyUI) · `alert-info` · `alert-warning` · `alert-danger` / `alert-error` | `ds-alert ds-alert--success` · `--info` · `--warning` · `--danger` (+ `ds-alert__icon` + `ds-alert__body`) |
| `form-group` / `mb-3` + `form-label` / `control-label` · DaisyUI `form-control` + `label-text` | `ds-field` + `ds-field__label` |
| `form-control` (BS) · DaisyUI `input input-bordered` · `textarea textarea-bordered` | `ds-input` · `ds-textarea` |
| `form-select` / BS3 `form-control` บน select · DaisyUI `select select-bordered` | `ds-select` |
| `form-control-sm` / `input-sm` · `form-select-sm` | `ds-input--sm` · `ds-select--sm` (เฉพาะ tools/pager) |
| `form-check` + `form-check-input` + `form-check-label` · DaisyUI `checkbox` / `radio` | `<label class="ds-check"><input type="checkbox"> ข้อความ</label>` |
| `invalid-feedback` / `help-block` (error) · `form-text` / `help-block` (hint) · `is-invalid` | `ds-field__error` · `ds-field__hint` · `aria-invalid="true"` |
| `input-group` + `input-group-text` / `input-group-addon` · DaisyUI `join` | `ds-input-group` + `ds-input-group__addon` |
| `row` + `col-md-6` ในฟอร์ม · Tailwind `grid grid-cols-2 gap-4` | `ds-form` + `ds-field` (`ds-field--full` = เต็มแถว) |
| `row` + `col-*` ระดับหน้า · Tailwind `grid md:grid-cols-3 gap-6` | `ds-grid ds-grid--2/--3/--4/--aside` หรือ `ds-stack` |
| `nav nav-tabs` + `tab-content` + `tab-pane` · DaisyUI `tabs tabs-bordered` + `tab tab-active` | `ds-tabs` + `ds-tabs__tab` (`aria-selected`) + `ds-tabs__panel` |
| `pagination` + `page-item` + `page-link` · DaisyUI `join` + `btn` ในหน้า | `ds-pager` + `ds-pager__list` + `ds-pager__btn` (`aria-current="page"`) |
| BS `modal` + `modal-dialog` + `modal-content` + `data-bs-toggle="modal"` · DaisyUI `modal` + `modal-box` | `<dialog class="ds-dialog">` + `ds-dialog__body` + `data-ds-open` / `data-ds-close` |
| `breadcrumb` + `breadcrumb-item` + `active` | `ds-breadcrumb` > `ol` > `li` (`aria-current="page"` ที่ตัวสุดท้าย) |
| `dl.row` + `dt.col-sm-3` + `dd.col-sm-9` | `ds-dl` |
| `spinner-border` · DaisyUI `loading loading-spinner` | `ds-spinner` |
| DaisyUI `stat` + `stat-title` + `stat-value` + `stat-desc` · AdminLTE `small-box` / `info-box` | `ds-kpi` + `ds-kpi__label` + `ds-kpi__value` + `ds-kpi__foot` |
| `progress` + `progress-bar` · DaisyUI `progress` | `ds-progress` + `ds-progress__fill` |
| `text-muted` / `text-gray-500` / `text-base-content/60` | `ds-muted` |
| `text-success` / `text-danger` (ตัวเลขดี/แย่) | `ds-text-good` / `ds-text-bad` |
| `text-nowrap` / `whitespace-nowrap` · `text-truncate` / `truncate` · `visually-hidden` / `sr-only` | `ds-nowrap` · `ds-truncate` · `ds-sr-only` |
| `text-end` ตัวเลขในตาราง / `tabular-nums` | `ds-num` |
| `<i class="fa fa-*">` / `<i class="fas fa-*">` / Heroicons `<svg>` | `<svg class="ds-ic" aria-hidden="true"><use href="#ds-i-NAME"></use></svg>` (ตาราง §9) |
| SweetAlert2 `Swal.fire({icon:'success', toast:true})` · toastr | `DS.toast(msg, {type:'success'})` (Swal ที่เป็น confirm ใช้ต่อได้หรือเปลี่ยนเป็น `DS.confirm`) |
| `title="..."` บนปุ่มไอคอน · Bootstrap tooltip `data-bs-toggle="tooltip"` | `data-ds-tip="..."` + `aria-label` |
| utility ระยะ (`mb-3`, `mt-4`, `p-4`, `space-y-4`, `gap-6`) ระหว่างบล็อก | ลบออก — ระยะมาจาก `ds-stack` / `ds-grid` / `ds-form` |
| BS `dropdown` + `dropdown-toggle` + `data-bs-toggle`/`data-toggle="dropdown"` + `dropdown-menu` (`dropdown-menu-end`) + `dropdown-item` + `dropdown-divider` + `dropdown-header` | `ds-dropdown` + `button[data-ds-dropdown][aria-controls][aria-haspopup=menu]` + `ds-menu[role=menu][hidden]` + `ds-menu__item[role=menuitem]` + `ds-menu__sep` + `ds-menu__header` (§8.23) — ลบ `data-bs-toggle` ออก |
| DaisyUI `dropdown dropdown-end` + `ul.dropdown-content.menu` · Alpine `x-data="{open}"` dropdown | `ds-dropdown` + `ds-menu` (§8.23) |
| navbar กระดิ่ง + `dropdown-menu` รายการแจ้งเตือน · DaisyUI `indicator` + `dropdown-content card` | `ds-dropdown` + `ds-icon-btn` (+ `ds-icon-btn__dot`) + `ds-popover` + `ds-notes` (§8.24) |
| navbar user dropdown (ชื่อ + รูป + ลิงก์ Profile / Logout) | ปุ่ม `ds-user` + `ds-menu` (§5.1, §5.3b); logout แบบฟอร์ม POST เดิม → `<button type="submit" form="logout-form">` |
| sidebar treeview: AdminLTE `nav-treeview`/`has-treeview`/`menu-open` · BS `collapse` ใน sidebar · DaisyUI `menu` + `<details>` | `ds-nav__group` + `ds-nav__toggle` + `ds-nav__sub` + `ds-nav__subitem` (เปิดจาก server §5.3a) |
| Select2 เลือกเดี่ยว (`.select2()`, `class="select2"`) · bootstrap-select `data-live-search` · Tom Select / Choices.js เลือกเดี่ยว | `<select class="ds-select" data-ds-combobox>` (§8.26) |
| Select2 `multiple` / `tags` / `ajax` | คง Select2 + CSS token (§7d ข้อ 5) |
| หน้า 404/500 ที่ทำเอง · `errors/*.blade.php` ของ Laravel · IIS/Apache error page | archetype error `ds-error` (§6.6) |
| CSS `@media print` ที่เขียนเอง (ซ่อน navbar/sidebar) | ใช้ของ kit (shell ถูกซ่อนตอนพิมพ์อยู่แล้ว) + `ds-no-print` กับส่วนที่ไม่ต้องพิมพ์ |
| หน้าพิมพ์ใบฟอร์ม HTML (`<table border="1">`, ฟอนต์ TH Sarabun, `onclick="window.print()"`) | `ds-doc` + `ds-doc__table` + `ds-doc__signs` + ปุ่ม `data-ds-print` (§6.7) |

**ขั้น 6 — สิ่งที่ห้ามเปลี่ยน (behaviour lock)**
- route / URL / `action` / `method` / query string ของตัวกรองและ pager
- `name`, `id`, `value`, `type` ของ input/select/textarea/button ทุกตัว; ลำดับ option; ค่า `selected`/`checked` ที่ server ใส่
- `@csrf`, `@method`, hidden input (`_token`, `id`, `mode`), `enctype`
- โค้ด backend: controller, model, query, validation rules, สิทธิ์ (`@can`, `if ($_SESSION['role'])`), การ `echo`/escape ค่า
- JS hook ที่ script เดิมใช้: `id`, `data-*`, class ที่ถูก select (`.js-*`, `.select2`, `.datepicker`, `.datatable`, `x-data`, `wire:model`, `@click`) — ถ้า class เดิมเป็นทั้ง style และ hook ให้ **คง class เดิมไว้คู่กับ class `ds-`** แล้วถอดเฉพาะ CSS ที่ขัดกัน
- ความหมายของข้อความ ตัวเลข สถานะ และลำดับคอลัมน์ในตาราง (ปรับถ้อยคำได้เฉพาะ label/ปุ่มให้ตรง §11 โดยความหมายเท่าเดิม)
- ไฟล์ export (PDF ที่ server สร้าง, Excel) และ endpoint AJAX/JSON — ไม่ใช่ขอบเขตงาน UI; หน้าพิมพ์ที่เป็น HTML แปลงเป็น `ds-doc` ได้ (§6.7) โดยคงข้อมูล ลำดับหัวข้อ และเลขแบบฟอร์มเดิม
- วิธีออกจากระบบเดิม (POST/GET, ชื่อ route, CSRF) และ endpoint "อ่านแล้ว" ของการแจ้งเตือน — เปลี่ยนแค่หน้าตา (§5.3b)

**ขั้น 7 — ตรวจ** ตาม §15 ทุกหน้า: เปิดจริงที่ 1440 / 900 / 375 ทั้ง light/dark, ลองส่งฟอร์ม (ผ่าน/ไม่ผ่าน validation), ลองตัวกรอง/เรียง/เปลี่ยนหน้า, ดู console ต้องไม่มี error; เมื่อทุกหน้าแปลงแล้วจึงถอด CSS framework เดิมออกจาก layout (ทดสอบซ้ำอีกรอบ)

## 14. กฎเหล็ก (Hard rules: DO / DON'T)

**DO**
1. ใช้ `/template/template1/assets/ds-ui.css` + `/template/template1/assets/ds-ui.js` ชุดเดียว (หรือสำเนาเวอร์ชันเดียวกัน) โหลดใน `<head>`, JS ไม่ `defer`
2. คัดลอก shell จาก `template1/pages/starter.html` ทุกครั้ง แก้เฉพาะ `<title>`, เมนูที่มี `aria-current="page"`, และเนื้อหาใน `<main class="ds-content">`
3. ใช้เฉพาะ class ที่มีใน §8 (prefix `ds-`); ถ้าไม่แน่ใจ ให้ `grep` ใน `ds-ui.css` ก่อนใช้
4. เลือกโครงหน้าจาก archetype (dashboard / list / form / detail / login / error / print) ก่อนเขียน markup
5. สีทุกจุดมาจาก token `var(--ds-*)`; สีตามข้อมูลส่งผ่าน `--ds-accent` / `--ds-btn-bg` / `background:var(--ds-…)` เท่านั้น
6. ใช้ semantic HTML: `<a href>` = ไปหน้าอื่น, `<button type="button">` = การกระทำ, `<table>` = ข้อมูลตาราง, `<dl>` = ชื่อ–ค่า, `<dialog>` = modal
7. ทุก control มี label; error ใช้ `aria-invalid` + `aria-describedby` + ข้อความ `ds-field__error`
8. วันที่ `dd/mm/yyyy`, เวลา `HH:MM น.`, ตัวเลขในตาราง/KPI ใส่ `ds-num`
9. คงพฤติกรรมเดิมทั้งหมด (§13 ขั้น 6) และทดสอบทั้ง light/dark ที่ 1440 / 900 / 375 ก่อนส่ง
10. แก้ทีละ layout → ทีละหน้า และสรุปรายการไฟล์ที่แก้ทุกครั้ง

**DON'T**
11. ห้ามแก้ `ds-ui.css` / `ds-ui.js` / หน้า kit / `smms-dashboard_2.html` จากโปรเจกต์ปลายทาง (ต้องการของใหม่ → แจ้งผู้ดูแล kit)
12. ห้าม hex / rgb / ชื่อสี Tailwind (`bg-white`, `text-gray-*`, `bg-blue-600`, `dark:*`) ในหน้าที่แปลงแล้ว
13. ห้ามผสม component ของ Bootstrap / DaisyUI / AdminLTE กับ `ds-` ในคอมโพเนนต์เดียวกัน (เช่น `class="btn ds-btn"`) — ยกเว้น class เดิมที่เป็น JS hook
14. ห้ามเขียน CSS ใหม่ที่ override `.ds-*` หรือใช้ `!important`; ห้าม inline `style` ยกเว้นส่ง token / ความกว้าง `%` ของ progress/bar
15. ห้ามเปลี่ยน route, `name`/`id` ของฟิลด์, CSRF, hidden input, validation, query, สิทธิ์ผู้ใช้ หรือ id/class/data-* ที่ script ใช้
16. ห้ามใช้ `<div onclick>`, `href="#"`/`javascript:void(0)` เป็นปุ่ม, `outline:none`, หรือ placeholder แทน label
17. ห้ามโหลด icon font / Font Awesome / ฟอนต์อื่นเพิ่ม; ห้ามใช้ emoji เป็นไอคอน
18. ห้ามสร้าง modal / toast / tooltip / tabs / sidebar toggle / dropdown / เมนูย่อย sidebar / searchable select เอง — ใช้ของ kit (`data-ds-*`, `DS.*`, `ds-nav__group`, `data-ds-combobox`)
19. ห้ามต่อ string เข้า `innerHTML` โดยไม่ผ่าน `DS.esc()` (หรือ `{{ }}` / `htmlspecialchars` ฝั่ง server)
20. ห้ามเพิ่มฟีเจอร์ ข้อมูล คอลัมน์ หรือข้อความที่ระบบเดิมไม่มี เพียงเพื่อให้เหมือนหน้า kit (ข้อความตัวอย่าง SMMS ห้ามหลุดเข้าระบบจริง)

## 15. Checklist ก่อนส่งงาน

**ภาพและโครง**
- [ ] layout ตรงกับ starter.html: sidebar navy, topbar, `ds-content`, footer; เมนูปัจจุบันไฮไลต์ (`aria-current="page"`)
- [ ] ทุกหน้ามี page head หนึ่งชุด (breadcrumb ถ้ามีหลายระดับ, h2 ชื่อหน้า, ปุ่มหลักด้านขวา)
- [ ] เนื้อหาอยู่ใน `ds-panel` / `ds-form-section`; ระยะห่างมาจาก `ds-grid` / `ds-stack` เท่านั้น
- [ ] ฟอนต์ Kanit ทั้งหน้า (ไม่มี Sarabun/Prompt/Tahoma หลงเหลือ — ยกเว้น Sarabun ภายใน `ds-doc` ของหน้าเอกสาร); ไอคอนเป็น `ds-ic` ทั้งหมด
- [ ] topbar: กระดิ่งเปิดแผงแจ้งเตือน (จำนวนยังไม่อ่านตรงกับ server, 0 = ไม่มีจุดนับ), ปุ่มผู้ใช้เปิดเมนู, ออกจากระบบทำงานแบบเดิม (Laravel: POST + `@csrf` ไม่ขึ้น 419/405)
- [ ] เมนูที่มีหน้าย่อยเป็น `ds-nav__group`; เปิดหน้าลูกแล้วกลุ่มกางอยู่ตั้งแต่โหลด (ไม่กระตุก) และลูกนั้นมี `aria-current="page"`; ย่อ sidebar เป็นแถบไอคอนแล้วกดกลุ่ม = sidebar ขยาย + กลุ่มกาง
- [ ] select เดี่ยวที่ต้องค้นหาใช้ `data-ds-combobox`; ส่งฟอร์มแล้วค่า `name` เดิมถูกต้อง, `old()`/ค่า selected จาก server แสดงถูก, error ของฟิลด์แสดงที่ช่อง; Select2 ที่เหลือมีเฉพาะ multiple/AJAX
- [ ] หน้า error (403/404/419/500/503) ใช้ `ds-error` และส่ง HTTP status ถูกต้อง ไม่แสดง exception; หน้าพิมพ์ใช้ `ds-doc`: Print preview เป็น A4 ไม่มี toolbar/เงา, แผ่นขาวตัวดำแม้อยู่ในธีมมืด, ขึ้นหน้าใหม่ระหว่างแผ่นถูก
- [ ] สถานะใช้ `ds-pill--*` ตาม §11; ตัวเลข/วันที่มี `ds-num`; วันที่ทุกจุดเป็น `วว/ดด/พ.ศ.` และช่องวันที่ทุกช่องเปิดเป็นปฏิทินไทย (§8.12a) — ไม่มีปฏิทินอังกฤษ `mm/dd/yyyy` หลงเหลือ

**Responsive**
- [ ] 1440px: grid/คอลัมน์ตามต้นแบบ, ไม่มีช่องว่างแปลก
- [ ] 900px: sidebar กลายเป็น drawer, ปุ่ม hamburger เปิด/ปิดได้ (Esc ปิด), grid ยุบถูกต้อง
- [ ] 375px / 360px: ไม่มี scroll แนวนอนของหน้า, ฟอร์ม 1 คอลัมน์, ปุ่มกดได้ง่าย; เมนูผู้ใช้/แผงแจ้งเตือนเปิดเป็นแผ่นเต็มกว้างใต้ topbar; เอกสาร A4 ย่อเต็มจอโดยไม่มี scroll แนวนอน
- [ ] มือถือ (§5.6): topbar แถวเดียว + ปุ่มค้นหาเปิด/ปิดได้; ตารางใช้ `ds-table--stack` + `data-label` ครบทุกช่อง; ตัวกรองพับได้ (`ds-filters--collapsible`); แถบปุ่มฟอร์มไม่สูงเกิน ~110px; footer ไม่มี `|` ห้อย

**โหมดมืด**
- [ ] สลับด้วยปุ่มธีมแล้วทุกหน้าอ่านได้: ไม่มีกล่องขาว ข้อความจาง หรือเส้นหาย; รีโหลดแล้วธีมยังอยู่และไม่กระพริบ
- [ ] `grep` ไฟล์ที่แก้ไม่พบ `#[0-9a-f]{3,6}`, `rgb(`, `bg-white`, `text-gray-`, `dark:` ในส่วนที่แปลงแล้ว
- [ ] Contrast AA (§3.6): ตัวอักษรขาวบนพื้นสีใช้ `--ds-*-strong`; สี/แบรนด์ที่ระบบ override เอง ตรวจด้วย DevTools/Lighthouse แล้วผ่าน 4.5:1 (ข้อความ) และ 3:1 (ไอคอน/ขอบ control) ทั้งสองธีม

**Accessibility**
- [ ] ใช้แป้น Tab ไล่ได้ครบ เห็นวงโฟกัสทุกจุด; tabs ใช้ลูกศรได้; dialog เปิด-ปิดด้วยคีย์บอร์ดและคืนโฟกัส
- [ ] เมนูผู้ใช้: Enter/↓ เปิดแล้วโฟกัสรายการแรก, ↑/↓ เลื่อน, Esc ปิดและโฟกัสกลับปุ่ม; แผงแจ้งเตือนไล่ด้วย Tab ได้; combobox: คลิก label แล้วโฟกัสช่องพิมพ์, พิมพ์กรอง + ↑/↓ + Enter เลือกได้, Esc คืนค่าเดิม
- [ ] ทุก input มี label; ปุ่มไอคอนมี `aria-label`; error ผูก `aria-describedby`; required มี `*`
- [ ] สถานะ/ผลลัพธ์ไม่พึ่งสีอย่างเดียว; h1 → h2 → h3 เรียงถูก; `<html lang="th">`

**พฤติกรรมเดิม**
- [ ] ส่งฟอร์มสำเร็จ และกรณี validation ไม่ผ่านแสดง error ถูกฟิลด์ พร้อมค่าเดิม (`old()`)
- [ ] ตัวกรอง / เรียงลำดับ / เปลี่ยนหน้า / ค้นหา / export / พิมพ์ ทำงานเหมือนเดิม และ URL เหมือนเดิม
- [ ] ลบ/อนุมัติ มีการยืนยัน; flash message แสดงเป็น toast; สิทธิ์ผู้ใช้แต่ละระดับเห็นเมนูเหมือนเดิม
- [ ] script เดิม (DataTables, Select2, datepicker, Alpine, AJAX) ทำงาน; DevTools Console ไม่มี error/warning ใหม่ (รวม `unknown icon`)
- [ ] ไม่มีการแก้ controller / model / route / migration / validation (ยกเว้นผู้ใช้สั่ง)
