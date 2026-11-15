# Template 2 — ชุด UI แบบ GSD Tools (t2-ui v1.0)

> **สรุป 3 บรรทัด**
> 1. หน้าตาถอดแบบจาก https://gsd.opdc.go.th/ (หน้าแรก, หน้า login, ภาพ Dashboard และภาพหน้า "จัดการข้อมูลงานบริการ" หลัง login) เมื่อ 27 ต.ค. 2569
> 2. แยกจาก Template 1 (DS UI Kit) ทั้งหมด: คลาสขึ้นต้น `t2-` ไฟล์หลักคือ `assets/t2-ui.css` + `assets/t2-ui.js` (`window.T2`) ไม่ต้อง build ไม่พึ่ง framework
> 3. โลโก้ ชื่อระบบ ข้อความ ตัวเลข และชื่อคนในหน้าตัวอย่างเป็น **ข้อมูลสมมติ** ต้องแทนที่ทั้งหมดก่อนใช้งานจริง

---

## 1. ที่มา และสิ่งที่ต่างจากต้นฉบับ

| เรื่อง | ทำอย่างไร |
|---|---|
| สี ขนาดตัวอักษร ระยะ มุมโค้ง เงา | ดึงค่าจริงจาก CSS ของต้นฉบับ (`--primary:#0088e0`, `--background:#f5fbff`, `--border:#cedfec`, เงา panel/soft, มุม 6/8/12px) มาเป็น token `--t2-*` |
| พื้นหลังลายตาราง 44px + แสงฟุ้ง | คัดลอกสูตรเดิม (`.gsd-grid-bg`) เป็น `.t2-grid-bg` |
| ฟอนต์ | Inter + Noto Sans Thai เหมือนต้นฉบับ แต่โหลดจาก Google Fonts (ต้นฉบับพึ่งฟอนต์ในเครื่อง ทำให้แต่ละเครื่องเห็นไม่เหมือนกัน) |
| โครงหน้า | หน้าแรก, login, หัวหน้าระบบ + แท็บเมนู, Dashboard (filter/KPI/donut), ตารางจัดการงานบริการ ทำตามต้นฉบับ |
| โลโก้ / ภาพหน้าจอ | **ไม่ได้คัดลอก** โลโก้ GSD และภาพ dashboard-preview.jpg — ใช้ `assets/logo.svg` (โลโก้ตัวอย่าง) และให้ภาพใน hero เป็น `dashboard.html` จริงที่ย่อขนาดผ่าน iframe |
| ข้อความ | เขียนใหม่เป็นข้อมูลตัวอย่าง (ระบบสมมติชื่อ "Service Hub" ของ "สำนักงานตัวอย่าง") คงโครงเนื้อหาเดิม |
| CSS/JS ของต้นฉบับ | ไม่ได้ใช้ (เป็น Tailwind/React ที่ build แล้ว) — เขียน CSS/JS ใหม่ที่อ่านและแก้เองได้ |
| เพิ่มจากต้นฉบับ | โหมดมืด, ตรวจช่องบังคับในฟอร์ม, skip link/ARIA, หน้า form (ต้นฉบับไม่มีให้ดู จึงออกแบบจากคอมโพเนนต์ชุดเดียวกัน) |

## 2. ไฟล์

```
template2/
├─ README.md            คู่มือนี้
├─ assets/
│  ├─ t2-ui.css         token + โครงหน้า + คอมโพเนนต์ทั้งหมด (คลาส t2-)
│  ├─ t2-ui.js          ไอคอน + พฤติกรรมทั้งหมด (window.T2)
│  └─ logo.svg          โลโก้ตัวอย่าง (แทนด้วยโลโก้ระบบจริง)
└─ pages/
   ├─ index.html        หน้าแรกสาธารณะ (ก่อน login)
   ├─ login.html        หน้าเข้าสู่ระบบ
   ├─ dashboard.html    หลัง login: Dashboard  ← ต้นแบบ app shell
   ├─ list.html         หลัง login: ตารางจัดการงานบริการ (ค้นหา/กรอง/ตาราง)
   └─ form.html         หลัง login: ฟอร์มเพิ่ม/แก้ไข
```

เปิดดูบน IIS เครื่องนี้: `http://localhost/template/template2/pages/index.html`

## 3. การติดตั้งใน `<head>`

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Thai:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="/template/template2/assets/t2-ui.css?v=1.0.0">
<!-- ไว้ใน head และห้ามใส่ defer/async: ตั้งธีมที่บันทึกไว้ก่อนวาดหน้าจอ -->
<script src="/template/template2/assets/t2-ui.js?v=1.0.0"></script>
```

- `<body class="t2-body">` ทุกหน้า (หน้าหลัง login เพิ่ม `t2-grid-bg`)
- ถ้าโหลด Google Fonts ไม่ได้ ระบบจะใช้ Segoe UI / Tahoma แทน ถ้าต้องใช้แบบออฟไลน์ ให้ดาวน์โหลดไฟล์ฟอนต์มาไว้ในโปรเจกต์แล้วประกาศ `@font-face` เอง

## 4. โครงหน้า 3 แบบ

### 4.1 หน้าสาธารณะ — `index.html`
```
body.t2-body
  a.t2-skip-link
  div.t2-page.t2-grid-bg > div.t2-container.t2-page__inner
    header.t2-site-header     โลโก้ + ชื่อระบบ | ปุ่ม Dashboard / เข้าสู่ระบบ
    main#t2-main              t2-hero, t2-section, t2-band ...
    footer.t2-site-footer
```

### 4.2 หน้าหลัง login — `dashboard.html`, `list.html`, `form.html`
```
body.t2-body.t2-grid-bg
  a.t2-skip-link
  div.t2-app
    header.t2-appbar
      div.t2-container.t2-container--fluid > div.t2-appbar__row
        a.t2-brand.t2-brand--app          โลโก้ + ชื่อระบบ
        div.t2-appbar__actions            span.t2-user (ชื่อ + .t2-user__role) | กระดิ่ง | ธีม | ออกจากระบบ
      nav.t2-appnav > div.t2-container--fluid > ul.t2-appnav__list
        a.t2-appnav__link[aria-current="page"]   แท็บที่เปิดอยู่ (พื้นสีหลัก)
    main.t2-main#t2-main > div.t2-container.t2-container--fluid.t2-stack.t2-stack--lg
    footer.t2-app-footer
```
- ต้นฉบับใช้ความกว้างเต็มจอ จึงใช้ `.t2-container--fluid` ทุกส่วนของหน้าหลัง login
- เมนูในตัวอย่างเป็นของบทบาท "ผู้ประสานหลัก" (Dashboard / ข้อมูลของฉัน / งานบริการ) บทบาทอื่นเพิ่มแท็บได้ เช่น รออนุมัติ, ผู้ใช้และสิทธิ์, ประวัติเวอร์ชัน, API Spec
- ต่อหน้าเปลี่ยนแค่ `<title>`, แท็บที่มี `aria-current="page"` และเนื้อหาใน `main`
- แยกเป็นไฟล์กลาง: PHP — `header.php` = ตั้งแต่ DOCTYPE ถึงเปิด `<div class="t2-container ...">` ใน main, `footer.php` = ปิด container/main ถึง `</html>`; Blade — ทั้งไฟล์เป็น layout component แล้วให้เนื้อหาเป็น slot
- ออกจากระบบ: ตัวอย่างเป็นลิงก์ไป login.html ระบบจริงต้องเป็น `<form method="post">` + CSRF token

### 4.3 หน้า login — `login.html`
```
main.t2-auth.t2-grid-bg > section.t2-auth__card
  div.t2-auth__brand    แผงสีหลัก: โลโก้, ชื่อระบบ, คำอธิบาย, กล่องหมายเหตุ
  form.t2-auth__form    หัวข้อ, ช่องผู้ใช้/รหัสผ่าน (.t2-input-group), ปุ่ม
```

## 5. Design tokens (สรุป — ค่าเต็มอยู่ต้น `t2-ui.css`)

| Token | สว่าง | ใช้กับ |
|---|---|---|
| `--t2-bg` | `#f5fbff` | พื้นหน้า, พื้นช่องกรอก |
| `--t2-fg` | `#122232` | ตัวอักษรหลัก |
| `--t2-card` | `#ffffff` | การ์ด |
| `--t2-muted-fg` | `#5a6b7d` | ตัวอักษรรอง |
| `--t2-primary` | `#0088e0` | ปุ่มหลัก, แท็บที่เลือก, แถบขั้นตอน |
| `--t2-primary-strong` | `#0070c0` | ตัวอักษรสีหลักขนาดเล็ก (ลิงก์, eyebrow) |
| `--t2-border` / `--t2-input` | `#cedfec` / `#d6e5f1` | เส้นขอบ / ขอบช่องกรอก |
| `--t2-surface` / `--t2-muted` | `#eff6fb` / `#e9f1f8` | พื้นรอง / หัวตาราง |
| `--t2-info` `--t2-success` `--t2-warning` | คู่พื้น/ตัวอักษร (`-fg`) | ปุ่มออกจากระบบ, badge สถานะ |
| `--t2-chart-1..5` | `#008be5 #00bcbf #62d28e #dca82d #e86153` | กราฟ |
| `--t2-radius-md` / `--t2-radius` / `--t2-radius-xl` | 6 / 8 / 12px | ปุ่ม-ช่องกรอก / กล่อง / การ์ด |
| `--t2-shadow-panel` / `--t2-shadow-soft` | เงาเทา / เงาฟ้า | การ์ด / ปุ่มหลัก-กรอบภาพ |

**Tone** — ใส่ `t2-tone-primary | sky | amber | rose | blue | green | red | orange` ที่คอมโพเนนต์ (หรือกล่องที่ครอบ) เพื่อเปลี่ยนสีทั้งชุด: ใช้กับ `t2-tier`, `t2-def`, `t2-icon-tile`, `t2-kpi`, `t2-num`, `t2-alert`, `t2-badge--solid`, ช่องตาราง (`td.t2-tone-*` = ระบายพื้น) และแถวตาราง (`tr.t2-tone-*` = แถบสีหน้าแถว 4px)

**ธีม** — `<html data-theme="light|dark">`; ไม่ใส่ = ตาม OS; ปุ่ม `data-t2-theme-toggle` จำค่าไว้ใน localStorage `t2-theme`
เปลี่ยนแบรนด์: override token บน `:root` และใน dark block ทั้งสองจุด ห้ามแก้กฎของคอมโพเนนต์

## 6. คอมโพเนนต์

| กลุ่ม | คลาส |
|---|---|
| โครง/จัดวาง | `t2-container` `--fluid`, `t2-stack` `--sm` `--lg`, `t2-cluster`, `t2-grid` `--2` `--3` `--4` `--5`, `t2-section` `--flush-top`, `t2-block`, `t2-measure`, `t2-hide-mobile`, `t2-only-mobile`, `t2-sr-only` |
| ตัวอักษร | `t2-display`, `t2-eyebrow`, `t2-title`, `t2-subtitle`, `t2-desc`, `t2-lead`, `t2-note`, `t2-source`, `t2-muted`, `t2-text-primary`, `t2-link`, `t2-link-btn`, `t2-section-head` `--narrow` `--sm` `--split` |
| หัวหน้า | `t2-page-head` `--top` + `__main` `__title` (`--sm`) `__desc` `__actions`, `t2-breadcrumb__list`, `t2-scope` + `__chip`, `t2-stat-chip` + `__value` |
| ปุ่ม | `t2-btn` + `--primary` `--outline` `--info` `--secondary` `--ghost` `--danger` `--danger-ghost`; ขนาด `--sm` `--md` `--lg` `--block` `--icon`; `--strong`; ปุ่มเปิด/ปิดใช้ `aria-pressed` |
| ป้าย | `t2-chip`, `t2-tag`, `t2-badge` + `--primary` `--info` `--success` `--warning` `--danger` `--outline` `--dot` `--solid`, `t2-num` `--sm` |
| การ์ด | `t2-card` `--flush` `--flex` + `__head` (`--bar`) `__title` `__actions` `__body` `__foot` `__kicker`, `t2-icon-tile` `--md` `--lg` `--solid`, `t2-feature` (`--compact`) |
| หน้าแรก | `t2-hero` + `__content` `__actions` `__media`, `t2-float`, `t2-shot` + `__viewport`, `t2-tiers` / `t2-tier` (กว้างด้วย `style="--t2-tier-w:70%"`), `t2-stat__value` `__unit`, `t2-example`, `t2-defs` / `t2-def`, `t2-band` + `t2-steps` / `t2-step` |
| Accordion ค้นหาได้ | `t2-acc__toolbar` `__meta` `__list` `__item` `__trigger` `__label` `__title` `__sub` `__chev` `__panel` `__item-label` `__count` `__empty` |
| ฟอร์ม | `t2-field` (`--span`), `t2-label`, `t2-req`, `t2-hint`, `t2-error`, `t2-input` `t2-select` `t2-textarea` (`--sm` `--lg`), `t2-search`, `t2-input-group` + `__btn`, `t2-choices`, `t2-check`, `t2-options` / `t2-option`, `t2-form-grid` (`--3`), `t2-form-section__head` `__title` `__desc` `__body`, `t2-form-actions` (+ `__note`), `t2-dropzone`, `t2-files` |
| Dashboard | `t2-filters` / `t2-filter`, `t2-kpis` / `t2-kpi` (+ `__body` `__label` `__value`), `t2-donut`, `t2-legend` (`--row`), `t2-bars` / `t2-bar`, `t2-colchart` (+ `__y` `__plot` `__col` `__x`) |
| ตาราง | `t2-table` (`--compact` `--grid`), `t2-table-wrap` (`--boxed` `--scroll`), `t2-table__primary` `__sub` `__code` `__index` `__actions`, `t2-num-cell`, `t2-toolbar` (`--tinted` `--roomy`) + `__end`, `t2-segment` / `__btn` / `__count`, `t2-pager` |
| แจ้งเตือน | `t2-alert` (+ tone, `__body` `__title`), `t2-empty`, `t2-dialog` (`<dialog>`) + `__body` `__title` `__text` `__foot` |

ไอคอน: `<svg class="t2-ic" aria-hidden="true"><use href="#t2-i-ชื่อ"></use></svg>` ขนาด `t2-ic--xs|sm|md|lg|xl` — รายชื่อไอคอนอยู่ใน `ICONS` ของ `t2-ui.js` (แบบเส้นสไตล์ lucide เหมือนต้นฉบับ) เพิ่มเองได้ด้วย `T2.icons['ชื่อ'] = '<path .../>'` ก่อนหน้าโหลดเสร็จ

## 7. JavaScript (`window.T2`)

| Attribute | ทำอะไร |
|---|---|
| `data-t2-theme-toggle` | สลับสว่าง/มืด |
| `data-t2-accordion` (+ `-search`, `-all`, `-count`, `-empty`) | accordion พร้อมช่องค้นหา เปิดหมวดที่เจอเฉพาะในหมวดย่อยให้อัตโนมัติ |
| `data-t2-password-toggle` | แสดง/ซ่อนรหัสผ่าน |
| `data-t2-shot` | ย่อ iframe ขนาด 1280×896 ให้พอดีกรอบ |
| `data-t2-donut` | วาดกราฟโดนัทจาก `<li data-value="..." style="--c:var(--t2-chart-1)">` (+ `data-t2-caption`, `data-t2-total`) |
| `data-t2-pressed-group` | กลุ่มปุ่มเลือกได้ทีละปุ่ม (KPI, แท็บสถานะ) ส่ง event `t2:change` |
| `data-t2-toggle` | ปุ่มเปิด/ปิดเดี่ยว (เช่น "ข้อมูลยังไม่ครบ") ส่ง event `t2:change` |
| `data-t2-dialog-open="id"` / `data-t2-dialog-close` | เปิด/ปิด `<dialog class="t2-dialog">` (คลิกฉากหลังก็ปิด) |
| `data-t2-dropzone` + `data-t2-file-list` | แสดงชื่อไฟล์ที่เลือก, ไฮไลต์ตอนลากไฟล์ |
| `data-t2-validate` (บน `<form novalidate>`) | ช่อง `required` ที่ว่าง/ผิดรูปแบบ → `aria-invalid="true"` + แสดง `.t2-error` ของช่องนั้น + โฟกัสช่องแรก |
| `data-t2-demo-redirect` / `data-t2-demo-success` | **ใช้ในหน้าตัวอย่างเท่านั้น** ระบบจริงต้องลบออก |

ฟังก์ชัน: `T2.setTheme('dark')`, `T2.theme()`, `T2.refresh(root)` (เรียกหลังเติมเนื้อหาด้วย AJAX ที่มีกราฟ/กรอบภาพ), `T2.renderDonut(el)`, `T2.openDialog(id)`

## 8. เลือกหน้าต้นแบบให้ตรงงาน

| งาน | ลอกจาก |
|---|---|
| หน้าแนะนำระบบ / landing ก่อน login | `index.html` |
| เข้าสู่ระบบ | `login.html` |
| ภาพรวม ตัวชี้วัด กราฟ | `dashboard.html` |
| รายการ + ค้นหา + ตัวกรอง + ตารางหลายคอลัมน์ | `list.html` |
| เพิ่ม/แก้ไขข้อมูล | `form.html` |

## 9. ข้อควรรู้

- **ความต่างสี (contrast)**: ตัวอักษรขาวบน `--t2-primary` ได้ 3.75:1 เท่าต้นฉบับ (ผ่านสำหรับปุ่ม/ตัวหนา/ตัวใหญ่ ไม่ผ่าน AA สำหรับตัวเล็ก) ป้ายสีส้ม/เขียวแบบทึบ (`t2-badge--solid`) ก็ต่ำกว่า 4.5:1 เช่นกัน ถ้าต้องผ่าน AA ทั้งหมด ให้ตั้ง `--t2-primary:#0077c6` และเลือก tone `red` / `blue` สำหรับป้ายทึบ
- ยังไม่มี: ปฏิทินไทย (พ.ศ.), combobox ค้นหาใน select, หน้า "ข้อมูลของฉัน", แผงแจ้งเตือนของกระดิ่ง, หน้า error และเอกสารพิมพ์ — ถ้าต้องใช้ ให้ส่งภาพหน้าต้นฉบับมาเพิ่ม หรือยืมแนวทางจาก Template 1
- ข้อมูลตัวอย่าง ("Service Hub", "สำนักงานตัวอย่าง", ชื่อคน, ตัวเลข) ห้ามหลุดเข้าระบบจริง
- ฟอร์มทุกฟอร์มต้องตรวจซ้ำที่ server และส่งด้วย POST + CSRF token; อย่าใส่ข้อมูลส่วนบุคคลใน URL

## 10. Prompt สำเร็จรูป (สั่ง AI ให้ทำระบบด้วย Template 2)

```text
พัฒนาระบบ "{system_name}" ({คำอธิบายสั้น ๆ})
UI ทั้งหมดใช้ Template 2 ที่ C:\inetpub\wwwroot\template\template2\ เท่านั้น

ก่อนเริ่ม อ่านให้ครบ:
- C:\inetpub\wwwroot\template\template2\README.md
- หน้าต้นแบบใน C:\inetpub\wwwroot\template\template2\pages\ : index, login, dashboard, list, form
- comment หัวไฟล์ assets\t2-ui.css และ assets\t2-ui.js

ข้อกำหนด UI:
- โหลด /template/template2/assets/t2-ui.css และ t2-ui.js ตาม README §3
- ทำ layout กลางจาก app shell ของ dashboard.html ครั้งเดียว แล้วทุกหน้าหลัง login ใช้ layout นี้
- แต่ละหน้าลอกโครง markup จากหน้าต้นแบบที่ตรงที่สุด (README §8) ห้ามออกแบบ UI เอง
- ใช้เฉพาะคลาส t2- ที่มีใน t2-ui.css, สีจาก token --t2-* เท่านั้น, ห้ามใช้คลาส ds- ของ Template 1 ปนกัน
- ภาษาไทย, วันที่ พ.ศ., รองรับมือถือ, ออกจากระบบแบบ POST + CSRF
- ลบ data-t2-demo-* ออกจากฟอร์มจริง; ข้อความตัวอย่าง (Service Hub, สำนักงานตัวอย่าง) ห้ามหลุดเข้าระบบ

ข้อมูลระบบ:
- stack: {Laravel + Blade / PHP + MySQL / ...}
- ชื่อบนหัวหน้า: "{short_name}" / "{full_name}"   หน่วยงาน: "{agency}"
- เมนู (แท็บ): {เช่น Dashboard, ข้อมูลของฉัน, งานบริการ}
- หน้าและข้อมูล: {ชื่อหน้า, แบบหน้า (dashboard/list/form), ฟิลด์/คอลัมน์, สถานะ, ปุ่ม}
- ผู้ใช้/สิทธิ์: {บทบาท และสิ่งที่แต่ละบทบาททำได้}

ขั้นตอน: เสนอแผน (โครงไฟล์ + รายการหน้า) ให้ฉันอนุมัติก่อน แล้วทำ layout → ทีละหน้า
```
