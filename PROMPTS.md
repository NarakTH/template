# Prompt สำเร็จรูป — ปรับ UI ระบบให้เป็นแบบ DS UI Kit (Template 1)

ไฟล์นี้รวม prompt ที่คัดลอกไปวางได้ทันที สำหรับสั่ง AI (Claude Code หรือ chat AI) ให้ปรับหน้าจอระบบเดิมให้เป็นแบบ template นี้
แทนค่าในวงเล็บปีกกา `{...}` ก่อนส่ง ทุก prompt อ้างไฟล์หลักคือ `C:\inetpub\wwwroot\template\AI-UI-GUIDE.md` (คู่มือกฎทั้งหมด)

| ไฟล์ใน kit | ใช้ทำอะไร |
|---|---|
| `AI-UI-GUIDE.md` | กฎ, class, JS API, ตาราง mapping, checklist (ต้องให้ AI อ่านทุกครั้ง) |
| `template1/assets/ds-ui.css`, `template1/assets/ds-ui.js` | ไฟล์จริงที่ระบบโหลดผ่าน `/template/template1/assets/...` |
| `template1/pages/starter.html` | โครง layout (sidebar + กลุ่มเมนูย่อย + topbar พร้อมแผงแจ้งเตือนและเมนูผู้ใช้ + content + footer) |
| `template1/pages/dashboard.html` `list.html` `form.html` `detail.html` `login.html` | ต้นแบบหน้าแต่ละประเภท |
| `template1/pages/error.html` | หน้า error 403/404/419/500/503 (ไม่มี sidebar; ดูแต่ละแบบด้วย `?code=`) |
| `template1/pages/print.html` | เอกสาร A4 สำหรับพิมพ์/บันทึก PDF (ใบฟอร์มทางการ, ฟอนต์ Sarabun) |
| `template1/pages/components.html` | ตัวอย่างคอมโพเนนต์ทุกชิ้น (รวม dropdown, combobox แทน Select2) |

เคล็ดลับ: ให้ทำทีละขั้น (วางแผน → layout → ทีละหน้า) และสั่ง commit/สำรองไฟล์ก่อนเริ่มเสมอ

---

## 0. Claude Code — พัฒนาระบบใหม่ด้วย template นี้ (เริ่มจากศูนย์)

สร้างโฟลเดอร์ระบบใหม่ (เช่น `C:\inetpub\wwwroot\{system_folder}`) เปิด Claude Code ในโฟลเดอร์นั้น แล้ววาง:

```text
พัฒนาระบบ "{system_name}" ({คำอธิบายสั้น ๆ ว่าระบบทำอะไร ใครใช้})
UI ทั้งหมดต้องใช้ DS UI Kit (Template 1) ที่ C:\inetpub\wwwroot\template\template1\ เท่านั้น

ก่อนเริ่ม อ่านให้ครบ:
- C:\inetpub\wwwroot\template\AI-UI-GUIDE.md (ทั้งฉบับ — เป็นกฎที่ต้องทำตาม)
- C:\inetpub\wwwroot\template\template1\pages\starter.html (layout: sidebar + topbar + footer)
- หน้าต้นแบบใน C:\inetpub\wwwroot\template\template1\pages\ : dashboard, list, form, detail, login, error, print, components

ข้อกำหนด UI:
- โหลด /template/template1/assets/ds-ui.css และ /template/template1/assets/ds-ui.js ตาม §2 (หรือคัดลอกเข้าโปรเจกต์ถ้าฉันสั่ง)
- ทำ layout กลางจาก starter.html ครั้งเดียว (§7a PHP include หรือ §7b Blade layout) ทุกหน้าใช้ layout นี้
- ทุกหน้าเลือก archetype ที่ตรงที่สุด (§6) แล้วลอกโครง markup จากหน้าต้นแบบ — ห้ามออกแบบ UI เอง
- ใช้เฉพาะ class/API ในคู่มือ, สีจาก token --ds-* เท่านั้น, ไม่เขียน CSS ใหม่ถ้าไม่จำเป็น
- ภาษาไทยตาม §11, วันที่ พ.ศ. + ปฏิทินไทย (§8.12a), รองรับมือถือตาม §5.6, โหมดมืด, ย่อ sidebar ได้ (§5.4a)
- topbar มีแผงแจ้งเตือน + เมนูผู้ใช้ (ออกจากระบบแบบ POST + CSRF) ตาม §5.3b; เมนูที่มีหน้าย่อยใช้กลุ่มเมนูย่อย §5.3a
- select ที่ต้องพิมพ์ค้นหาใช้ data-ds-combobox (§8.26) ไม่ใช้ Select2 ยกเว้น multiple/AJAX
- ทำหน้า error (403/404/419/500/503) จาก error.html (§6.6) และถ้ามีเอกสารที่ต้องพิมพ์/ลงนาม ทำจาก print.html (§6.7)
- ข้อความตัวอย่างของ kit (SMMS, แจ้งซ่อม) ห้ามหลุดเข้าระบบ

ข้อมูลระบบ:
- stack: {Laravel 12 + Blade / PHP ธรรมดา + MySQL / ...}   ฐานข้อมูล: {ชื่อ DB}
- ชื่อบน sidebar: "{short_name}"   คำขวัญ/tagline: "{tagline}"
- เมนู: {รายการเมนู เช่น แดชบอร์ด, รายการคำขอ, สร้างคำขอ, รายงาน, ตั้งค่า}
- หน้าและข้อมูล: {แต่ละหน้า: ชื่อ, archetype (dashboard/list/form/detail/login/error/print), ฟิลด์/คอลัมน์, สถานะ, ปุ่ม}
- เอกสารที่ต้องพิมพ์: {ชื่อแบบฟอร์ม + รหัสแบบฟอร์ม เช่น ใบขออนุมัติ F-01 — หรือ "ไม่มี"}
- ผู้ใช้/สิทธิ์: {บทบาทต่าง ๆ และสิ่งที่แต่ละบทบาททำได้}

ขั้นตอน: เสนอแผน (โครงไฟล์ + รายการหน้า + archetype ของแต่ละหน้า) ให้ฉันยืนยันก่อน →
ทำ layout + login → ทำทีละหน้า → ตรวจตาม §15 (1440/900/375, light/dark, console ไม่มี error)
```

## 1. Claude Code — ปรับทั้งระบบ

เปิด Claude Code ในโฟลเดอร์ของระบบ (เช่น `C:\inetpub\wwwroot\{system_folder}`) แล้ววาง:

```text
ปรับ UI ของระบบนี้ทั้งระบบให้เป็นแบบ DS UI Kit

ก่อนเริ่ม อ่านให้ครบ:
- C:\inetpub\wwwroot\template\AI-UI-GUIDE.md (ทั้งฉบับ — เป็นกฎที่ต้องทำตาม)
- C:\inetpub\wwwroot\template\template1\pages\starter.html (layout shell)
- หน้า kit ที่ตรงกับแต่ละ archetype: dashboard.html, list.html, form.html, detail.html, login.html,
  error.html (หน้า error), print.html (เอกสารพิมพ์ A4), components.html ในโฟลเดอร์ C:\inetpub\wwwroot\template\template1\pages\

ขั้นตอน:
1. สำรวจระบบ (ยังไม่แก้ไฟล์): layout/master, ทุกหน้า + archetype, CSS/JS ที่โหลดอยู่,
   script ที่อ้าง class/id ใน DOM แล้วเสนอแผนเป็นรายการไฟล์ตามลำดับ รอฉันยืนยันก่อน
2. ใส่ assets: /template/template1/assets/ds-ui.css และ /template/template1/assets/ds-ui.js ใน <head> ตาม §13 ขั้น 2
3. เปลี่ยน layout shell ให้ตรง starter.html (เมนูเดิมครบ, route เดิม, เงื่อนไขสิทธิ์เดิม; เมนูย่อยเดิม → ds-nav__group §5.3a;
   dropdown ผู้ใช้/แจ้งเตือนเดิม → ds-dropdown §5.3b โดยคงวิธีออกจากระบบเดิม)
4. แปลงทีละหน้าตาม archetype และตาราง mapping ใน §13 — จบแต่ละหน้าให้สรุปสิ่งที่เปลี่ยน
   (หน้า error เดิม → error.html §6.6, หน้าพิมพ์ HTML เดิม → print.html §6.7, Select2 เลือกเดี่ยว → data-ds-combobox §8.26)
5. ตรวจตาม §15 ทุกหน้า (1440/900/375, light/dark, console ไม่มี error)
   ทุกหน้าต้องใช้บนมือถือได้ตาม §5.6: topbar แถวเดียว, ตาราง ds-table--stack + data-label,
   ตัวกรอง ds-filters--collapsible, ไม่มี scroll แนวนอนที่ 360px

ข้อบังคับ:
- ห้ามเปลี่ยน route, name/id ของฟิลด์, CSRF, hidden input, validation, backend logic, สิทธิ์ผู้ใช้
  และ id/class/data-* ที่ script เดิมใช้ (ดู §13 ขั้น 6)
- ใช้เฉพาะ class/API ที่มีใน AI-UI-GUIDE.md; สีต้องมาจาก token --ds-* เท่านั้น
- ห้ามแก้ไฟล์ใน C:\inetpub\wwwroot\template\
- ข้อความตัวอย่างของ kit (SMMS, แจ้งซ่อม) ห้ามหลุดเข้าระบบ — ใช้ข้อความ/ข้อมูลของระบบนี้

ข้อมูลระบบ: ชื่อระบบ "{system_name}", ชื่อย่อบน sidebar "{short_name}", stack {Laravel+Tailwind / PHP+Bootstrap 3/4},
วันที่แสดงเป็น พ.ศ. และช่องวันที่ใช้ปฏิทินไทยของ kit (§8.12a) — ค่าที่ส่งเซิร์ฟเวอร์ยังเป็น YYYY-MM-DD
```

## 2. Claude Code — ปรับหน้าเดียว

```text
ปรับหน้า {path/to/page.blade.php หรือ page.php} ให้เป็นแบบ DS UI Kit

อ่าน C:\inetpub\wwwroot\template\AI-UI-GUIDE.md (§8 คอมโพเนนต์, §11 ภาษา, §13 mapping, §14 กฎเหล็ก)
และหน้าต้นแบบ C:\inetpub\wwwroot\template\template1\pages\{list|form|detail|dashboard|error|print}.html ก่อนแก้

- layout ของระบบ{ใช้ DS shell แล้ว / ยังไม่ใช้ — ถ้ายังไม่ใช้ ให้แปลงเฉพาะเนื้อหาในหน้า และห่อด้วย <div class="ds-scope">}
- คง behaviour เดิมทั้งหมด: route, form action/method, name/id, CSRF, validation, JS hook, ลำดับคอลัมน์
- แสดง diff สรุปก่อนบันทึก แล้วตรวจตาม §15 (responsive, dark mode, a11y, console)
```

## 3. สร้างหน้าใหม่จาก archetype

```text
สร้างหน้าใหม่ "{page_title}" ในระบบนี้ โดยใช้ archetype {dashboard | list | form | detail | error | print}
(error = หน้า 403/404/419/500/503 ไม่มี sidebar ตาม §6.6; print = เอกสาร A4 สำหรับพิมพ์/ลงนาม ตาม §6.7)
ต้นแบบ: C:\inetpub\wwwroot\template\template1\pages\{archetype}.html และกฎใน C:\inetpub\wwwroot\template\AI-UI-GUIDE.md

รายละเอียด:
- route/URL: {route_or_url}   ไฟล์: {view_path}
- ข้อมูลที่แสดง / ฟิลด์: {columns_or_fields — ชื่อ, ชนิด, required, ตัวเลือก}
- สถานะที่มี: {รายการสถานะ} → map เข้า ds-pill ตาม §11
- ปุ่ม/การกระทำ: {actions}
- ใช้ layout เดิมของระบบ (DS shell) และตั้งเมนู "{menu_label}" เป็น aria-current="page"
  (ถ้าเมนูอยู่ในกลุ่มเมนูย่อย ให้กลุ่มนั้นเปิดจาก server ตาม §5.3a; archetype error/print ไม่ใช้ shell)

ใช้เฉพาะ class/API ที่มีในคู่มือ ห้ามเขียน CSS ใหม่ ห้ามใส่สี hex; ถ้าต้องมี backend (controller/route)
ให้บอกก่อนว่าจะเพิ่มอะไร แล้วรอฉันยืนยัน
```

## 4. ตรวจความถูกต้องของหน้า (review + fix)

```text
ตรวจหน้า {path/to/page} (หรือทั้งโฟลเดอร์ {views_folder}) เทียบกับ C:\inetpub\wwwroot\template\AI-UI-GUIDE.md
§14 (กฎเหล็ก) และ §15 (Checklist) ทีละข้อ

1. รายงานเป็นตาราง: ข้อ / ผ่าน-ไม่ผ่าน / ไฟล์:บรรทัด / วิธีแก้
   ตรวจอย่างน้อย: class ที่ไม่มีใน ds-ui.css, สี hard-code (hex, rgb, bg-white, text-gray-*, dark:*),
   class Bootstrap/DaisyUI ที่ยังค้าง, ไอคอน fa-*, label/aria ที่ขาด, ปุ่มที่เป็น <a href="#">,
   วันที่ผิดรูปแบบ, ตัวเลขที่ไม่มี ds-num, สถานะที่ใช้สีผิดกลุ่ม
2. แก้เฉพาะเรื่อง UI ที่ไม่ผ่าน โดยไม่แตะ route, name/id, CSRF, validation, backend, JS hook
3. สรุปสิ่งที่แก้ และสิ่งที่ต้องให้คนตรวจด้วยตา (dark mode, 375px)
```

## 5. Chat AI (Claude.ai / ChatGPT) — ไม่มีสิทธิ์เข้าถึงไฟล์บนเครื่อง

แนบไฟล์เหล่านี้ในแชต:
1. `C:\inetpub\wwwroot\template\AI-UI-GUIDE.md`
2. `C:\inetpub\wwwroot\template\template1\assets\ds-ui.css`
3. หน้า kit ที่ใกล้ที่สุด 1 ไฟล์ (`pages\list.html` / `form.html` / `detail.html` / `dashboard.html` / `login.html` / `error.html` / `print.html`) — ถ้าแปลง layout ให้แนบ `pages\starter.html` ด้วย
4. ไฟล์ของระบบที่จะแปลง (view/หน้า PHP) และ layout ถ้าเกี่ยวข้อง

แล้ววาง:

```text
ไฟล์แนบ: AI-UI-GUIDE.md (คู่มือ/กฎ), ds-ui.css (class ที่มีจริง), {ชื่อหน้า kit}.html (ต้นแบบ),
และ {ชื่อไฟล์ระบบ} (ไฟล์ที่ต้องแปลง)

ปรับ UI ของ {ชื่อไฟล์ระบบ} ให้เป็นแบบ template นี้ ตาม AI-UI-GUIDE.md อย่างเคร่งครัด:
- ใช้เฉพาะ class ที่มีใน ds-ui.css และ API ที่มีในคู่มือ §10
- คง route, action, method, name/id, CSRF (@csrf / token), validation, PHP/Blade logic และ JS hook เดิมทุกตัว
- ไฟล์ CSS/JS โหลดจาก /template/template1/assets/ds-ui.css และ /template/template1/assets/ds-ui.js
- ส่งกลับเป็นไฟล์เต็มที่พร้อมวางทับ พร้อมรายการสิ่งที่เปลี่ยน และสิ่งที่ฉันต้องทดสอบเอง (§15)
```

## 6. Snippet สำหรับ CLAUDE.md ของระบบปลายทาง

วางต่อท้าย `CLAUDE.md` ที่ root ของแต่ละระบบ เพื่อให้ทุกงาน UI ในอนาคตทำตาม template:

```markdown
## UI standard: DS UI Kit (บังคับ)
- ทุกการแก้หน้าจอ ต้องอ่านและทำตาม C:\inetpub\wwwroot\template\AI-UI-GUIDE.md ก่อนเสมอ
  (ต้นแบบหน้า: C:\inetpub\wwwroot\template\template1\pages\ — starter, dashboard, list, form, detail, login, error, print, components)
- โหลด /template/template1/assets/ds-ui.css และ /template/template1/assets/ds-ui.js ใน <head> ของ layout (JS ห้าม defer)
- ใช้เฉพาะ class `ds-*` และ `window.DS` ที่มีในคู่มือ; สีมาจาก token `--ds-*` เท่านั้น
  (ห้าม hex, bg-white, text-gray-*, dark:*); ไอคอนใช้ `<svg class="ds-ic"><use href="#ds-i-NAME">`
- หน้าใหม่: เลือก archetype (dashboard/list/form/detail/error/print) แล้วคัดลอกโครงจากหน้า kit
- dropdown/เมนูผู้ใช้/แจ้งเตือน = `data-ds-dropdown`, เมนูย่อย sidebar = `ds-nav__group`, select ค้นหาได้ = `data-ds-combobox` (Select2 เฉพาะ multiple/AJAX)
- ฟอนต์ Kanit ทั้งระบบ ยกเว้นเอกสารพิมพ์ `ds-doc` ใช้ Sarabun
- ห้ามแก้ไฟล์ใน C:\inetpub\wwwroot\template\ จากโปรเจกต์นี้
- งาน UI ห้ามเปลี่ยน route, name/id ของฟิลด์, CSRF, validation, backend logic หรือ JS hook ที่มีอยู่
- ก่อนส่งงาน ตรวจตาม Checklist §15: 1440/900/375, light+dark, keyboard/aria, console ไม่มี error
- ภาษา: ป้ายภาษาไทย, วันที่ dd/mm/yyyy ({พ.ศ. หรือ ค.ศ.} ทั้งระบบ), เวลา "10:24 น.", สถานะตาม §11
```
