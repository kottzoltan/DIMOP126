# DIMOP126 – fájllista és struktúra

## Fő fájlok

| Fájl | Leírás |
|------|--------|
| `config/editableFields.ts` | Szerkeszthető mezők konfigurációja (alapadatok, hardver, szoftver) |
| `lib/storage/index.ts` | Cégadat tárolás, fájl útvonalak |
| `lib/workbook/index.ts` | Workbook szolgáltatás (Node → Python) |
| `lib/pdf/index.ts` | PDF export (LibreOffice) |
| `scripts/python/workbook_service.py` | openpyxl: copy, apply, preview |
| `scripts/python/pdf_export.py` | LibreOffice headless PDF konverzió |
| `app/api/companies/*` | API route-ok |
| `app/page.tsx` | Főoldal – céglista |
| `app/companies/[id]/page.tsx` | Cég adatlap + űrlap |
| `components/ApplicationForm.tsx` | Űrlap komponens |
| `components/BudgetPreview.tsx` | Költségvetés összesítő |

## Mappastruktúra

```
/data/companies/{companyId}/
  application.xlsx    - kitöltött workbook
  application.pdf    - generált PDF (export után)
  form-data.json     - űrlap adatok JSON
/template/
  DIMOP126B végleges, kalkulátor_v1.xlsx  - sablon
```

## Futtatási lépések

1. `npm install`
2. `pip install openpyxl` (Python)
3. `brew install --cask libreoffice` (PDF export)
4. `npm run seed` – 2 demo cég
5. `npm run dev` – http://localhost:3000
