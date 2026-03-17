# DIMOP126 Phase 2 – Implementációs terv

## 1. Auth integráció
- NextAuth v4 (next-auth@4) credentials provider
- Users: `data/users.json` – id, name, email, passwordHash, role, createdAt, updatedAt
- bcrypt jelszó hash
- Roles: admin, editor – middleware ellenőrzés
- Protected: /companies, /companies/[id], /api/companies/*
- Login page, logout, session
- Seed: demo admin (admin@dimop.local / demo123)

## 2. Adatmodell bővítés
- Company.vatMode: "VAT" | "AAM"
- User interface + storage (users.json)
- CompanyDocument: id, companyId, originalName, mimeType, size, path, createdAt
- Documents: data/companies/{id}/documents/
- documents-index.json per company

## 3. Document upload
- Allowed types: pdf, doc, docx, xls, xlsx, csv, txt, png, jpg, zip
- POST multipart, GET list, DELETE
- Max 10MB/file

## 4. Template metadata
- scripts/python/extract_template_metadata.py → JSON
- lib/workbook/templateMetadata.ts – HardwareItem, SoftwareGoalGroup, SoftwareItem
- Egységköltség nettó/bruttó, mértékegység, célcsoport

## 5. UI strukturálás
- Sekciók: Alapadatok, Hardver, Szoftver, Dokumentumok
- Hardver: mennyiség | egységköltség nettó | egységköltség bruttó | sorösszeg
- Szoftver: csoportosítás fejlesztési cél szerint (B oszlop), figyelembe vétel | mennyiség | egység nettó | egység bruttó | sorösszeg
- Jobb panel: projektköltség nettó/bruttó, támogatás nettó/bruttó, önerő

## 6. Létszám öröklés
- alap_alkalmazotti_letszam → default sw_mennyiseg_* mezőknek
- formData: sw_mennyiseg_7_overridden?: boolean – ha true, ne írjuk felül
- UI: inherited / overridden állapot jelzés

## 7. Default pályázati célok
- Célok: 3, 4, 10, 12, 13, 14 (B oszlop sorszámok)
- Új cégnél: ezek "Pályázatból szerzi be", al-célok is aktívak
- seed/applyDefaults formData-ban

## 8. Budget preview bővítés
- Nettó/bruttó értékek vatMode alapján
- Összesítők: projektköltség nettó/bruttó, támogatás nettó/bruttó, önerő
- Költségvetés F oszlop + bruttó számítás (×1.27)

## 9. Validáció
- Whitelist editable field keys
- Session check minden API-n
- vatMode enum
- Document mime type whitelist
- sw_mennyiseg csak ha D != "Nem releváns"
