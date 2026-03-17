# DIMOP126 Pályázati Kalkulátor – Technikai Terv

## Stack

| Réteg | Technológia |
|-------|-------------|
| Frontend | Next.js 14 (App Router), React |
| Backend | Next.js API Routes (Node.js) |
| Excel kezelés | Python + openpyxl (formula preservation, cell write) |
| Excel recalc | Python openpyxl `data_only=False` + **LibreOffice headless** `--headless --convert-to` (újraszámolás) |
| PDF export | LibreOffice headless `--convert-to pdf` |
| Adattárolás | JSON file (lowdb-style), fájlrendszer `/data/companies/` |
| Tesztelés | Vitest (unit), Playwright/Node (integration) |

## Excel Recalc stratégia

1. **openpyxl** nem számol újra képleteket – csak olvas/ír cellaértékeket.
2. **LibreOffice** headless módban megnyitja az xlsx-et, újraszámolja, majd:
   - vagy elmenti xlsx-ként (recalc),
   - vagy exportál PDF-et.
3. **Pipeline**: Template másolás → cella írás (openpyxl) → LibreOffice `--headless --convert-to xlsx` (recalc) → LibreOffice `--convert-to pdf` (PDF).
4. **Alternatíva ha LibreOffice nincs**: csak openpyxl-tal mentünk – a képletek a következő Excel-megnyitáskor számolnak. A budget preview-hoz a Költségvetés lap F oszlopából `data_only=True`-val olvassuk a *már korábban kiszámolt* értékeket. **Figyelem**: első mentés után a usernek Excel-ben meg kell nyitnia a fájlt a recalc-hoz, vagy LibreOffice-t kell használni.

5. **Döntés**: LibreOffice headless **kötelező** a stabil recalc és PDF export miatt. README-ben dokumentáljuk a követelményt.

## PDF Export

- **LibreOffice** `soffice --headless --convert-to pdf --outdir <dir> application.xlsx`
- Az eredmény: `application.pdf` – az egész workbook első lapjai alapján, vagy csak a megadott lapok. A DIMOP workbookban a Rövid_pdf és Hosszú_pdf lapok vannak a nyomtatáshoz.
- **Lap kiválasztás**: LibreOffice alapból az összes lapot exportálja. Ha csak bizonyos lapok kellenek, előzetes sheet-copy vagy külön xlsx készítése lehet, de MVP-ben az egész workbook PDF-je elég.

## Kockázatok

| Kockázat | Valószínűség | Megoldás |
|----------|--------------|----------|
| LibreOffice nincs telepítve | Közepes | README, brew install, Docker fallback később |
| Data validation / conditional formatting elveszik | Alacsony | openpyxl preserve mode; tesztelés |
| Checkbox form control ↔ cella mapping | Közepes | A spec alapján I oszlop cellák = értékhordozók, nem form control |
| Szoftver „nem releváns” sorok M oszlopa | Alacsony | Config-ban `enabledWhen` – ha D nem „Pályázatból szerzi be” vagy „Már rendelkezik”, akkor M disabled |
| PDF layout eltérés | Közepes | LibreOffice rendering; tesztelés, ha szükséges manual page setup |

## Architektúra

```
/app (Next.js App Router)
  /api/companies/*        – CRUD, application, recalc, export
  /lib/
    workbook/             – Node: Python child_process hívása
    pdf/                  – LibreOffice wrapper
    storage/              – fájl + JSON
  /features/
    application-form/
    budget-preview/
    company-files/
/scripts/
  python/
    workbook_service.py   – openpyxl: copy, write cells, optionally recalc via subprocess
    pdf_export.py         – LibreOffice convert
/data/
  companies/{id}/
    application.xlsx
    application.pdf
    form-data.json
```

## Következő lépések

1. Projekt inicializálás (Next.js)
2. `editableFields` config készítése a workbook elemzés alapján
3. Python scriptek: workbook copy, cell write, LibreOffice recalc + PDF
4. API route-ok
5. Frontend form + budget preview
6. Seed adatok, README, tesztek
