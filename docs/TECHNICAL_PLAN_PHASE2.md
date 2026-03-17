# DIMOP126 – Technikai terv: Phase 2 fejlesztések

Jelenlegi alap: Next.js 14 App Router, JSON + fájl tárolás, openpyxl + LibreOffice, űrlap + költségvetés preview.

---

## 1. Auth (hitelesítés)

### Jelenlegi helyzet
- Nincs auth, minden API route nyitott
- Nincs session, user kontextus

### Cél
- Kezelők bejelentkezhetnek (email/jelszó vagy OAuth)
- API védelem: csak bejelentkezett userek érhetik el a cégeket és exportokat
- Opcionális: céghez rendelt kezelő (assignedTo)

### Technikai javaslat

| Döntés | Javaslat |
|--------|----------|
| Provider | **NextAuth.js v5** (Auth.js) |
| Session | JWT vagy database session |
| Adapter | Prisma vagy **kysely** (ha SQLite/PostgreSQL) |
| OAuth | Google / Microsoft (vállalati SSO) |

### Implementációs lépések
1. `next-auth` install, `/api/auth/[...nextauth]` route
2. Middleware: `/app`, `/companies/*`, `/api/companies/*` → `getToken` ellenőrzés
3. API route-ok: `getServerSession()` → 401 ha nincs session
4. Login page (`/login`), logout gomb a headerben
5. (Opc.) `User` + `Company.assignedToUserId` – cég szűrés kezelő szerint

### Érintett fájlok
- `middleware.ts` (új)
- `app/api/auth/[...nextauth]/route.ts` (új)
- `app/login/page.tsx` (új)
- Minden `/api/companies/*` route – session check
- `lib/storage` – ha user → company kapcsolat, bővíteni kell

---

## 2. vatMode (nettó/bruttó mód)

### Jelenlegi helyzet
- A workbook már tartalmaz nettó és bruttó oszlopokat (pl. Szoftver J/K)
- A költségvetés preview csak az F oszlop értékeket jeleníti meg (jelenlegi számítás eredménye)
- Nincs explicit nettó/bruttó választás az űrlapon

### Cél
- A kezelő választhasson: **nettó** vagy **bruttó** megjelenítés
- A költségvetés preview és esetleg export ennek megfelelően jelenjen meg
- ÁFA: 27% (konfig formában)

### Technikai javaslat

| Komponens | Megvalósítás |
|-----------|--------------|
| Form state | `vatMode: "net" | "gross"` a formData-ban vagy company metadata-ban |
| UI | Toggle vagy radio az Alapadatok szekció tetején |
| Budget preview | Ha gross: `net * 1.27`; ha net: eredeti értékek |
| Workbook | A sablon mindkét értéket tartalmazza; nem kell cellát írni |
| Config | `config/vat.ts`: `VAT_RATE = 0.27` |

### Implementációs lépések
1. `config/vat.ts` – VAT_RATE, default vatMode
2. `Company` / `formData` bővítése: `vatMode?: "net" | "gross"`
3. `BudgetPreview` – vatMode alapján szorzás / osztás
4. Opcionálisan: Excel-ben a megfelelő oszlopból olvasás (net vs gross) ha a workbook már tartalmazza

### Érintett fájlok
- `config/vat.ts` (új)
- `config/editableFields.ts` – vatMode nem mező, hanem form szintű
- `components/BudgetPreview.tsx`
- `lib/storage` – formData vagy company metadata
- `scripts/python/workbook_service.py` – ha cella írás kell (valószínűleg nem)

---

## 3. Document upload (dokumentum feltöltés)

### Jelenlegi helyzet
- Csak `application.xlsx`, `application.pdf`, `form-data.json` van per cégenként
- Nincs pályázati melléklet / igazolás feltöltés

### Cél
- Céghez tartozó dokumentumok feltöltése (pl. igazolások, mellékletek)
- Típusok: DII igazolás, DFK, eszköznyilvántartás, stb.
- Tárolás: lokálisan vagy S3/GCS

### Technikai javaslat

| Döntés | Javaslat |
|--------|----------|
| Storage MVP | `data/companies/{id}/documents/` |
| Storage scale | S3 / GCS kompatibilis interface (`lib/storage/documents.ts`) |
| API | `POST /api/companies/:id/documents` (multipart), `GET /api/companies/:id/documents` |
| Meta | Dokumentum típus, feltöltés dátuma, feltöltő user |
| Formátum | PDF, DOCX, XLSX, kép – max 10 MB/dokumentum |

### Implementációs lépések
1. `lib/storage/documents.ts` – upload, list, delete, get path
2. `app/api/companies/[id]/documents/route.ts` – GET list, POST upload
3. `app/api/companies/[id]/documents/[docId]/route.ts` – GET file, DELETE
4. UI: dokumentum lista + feltöltés űrlap a cég oldalon („Dokumentumok” szekció)
5. Config: `documentTypes` – mely típusok engedélyezettek (pl. DII, DFK, egyéb)

### Érintett fájlok
- `lib/storage/documents.ts` (új)
- `app/api/companies/[id]/documents/*` (új)
- `app/companies/[id]/page.tsx` – dokumentum szekció
- `config/documentTypes.ts` (új, opcionális)

---

## 4. UI refactor

### Jelenlegi helyzet
- Egyszerű Tailwind, nincs design system
- `ApplicationForm` – egy nagy komponens, sekciók filterrel
- `BudgetPreview` – inline stílusú
- Nincs közös layout, header, szekció wrapper

### Cél
- Konzisztens design, újrafelhasználható komponensek
- Szekciók, form mezők, státuszok egységes megjelenése
- Könnyen karbantartható, bővíthető UI

### Technikai javaslat

| Komponens | Megvalósítás |
|-----------|--------------|
| Design tokens | `tailwind.config.ts` – színek, spacing, tipográfia |
| Base components | `components/ui/` – Button, Input, Checkbox, Select, Card, Badge |
| Layout | `components/layout/` – AppShell, Sidebar, PageHeader |
| Form | `components/forms/` – FieldRenderer (config-driven), FormSection |
| Features | `app/features/` vagy `components/features/` – ApplicationForm, BudgetPreview, CompanyList |

### Implementációs lépések
1. `components/ui/` – Button, Input, Checkbox, Select, Card, Badge
2. `components/layout/AppShell.tsx` – header, nav, main wrapper
3. `ApplicationForm` szétbontása: `FormSection`, `FieldRenderer(editableFields)`
4. `BudgetPreview` – Card alapú, összesítő sorok
5. Cég lista – táblázat vagy kártya grid, szűrés, keresés (ha sok cég)

### Érintett fájlok
- `tailwind.config.ts`
- `components/ui/*` (új)
- `components/layout/*` (új)
- `components/ApplicationForm.tsx` → refaktor
- `components/BudgetPreview.tsx` → refaktor
- `app/page.tsx`, `app/companies/[id]/page.tsx` – AppShell használat

---

## 5. Metadata layer (metadata réteg)

### Jelenlegi helyzet
- `Company`: id, name, slug, status, createdAt, updatedAt, workbookPath, pdfPath
- Nincs verziózás, címkézés, workflow lépések, audit

### Cél
- Bővíthető metadata cégekhez és pályázathoz
- Verziózás: template version, form schema version
- Workflow: státusz finomítás (pl. belső ellenőrzés, jóváhagyás)
- Audit: ki, mikor módosította
- Címkék, szűrők (pl. régió, pályázati forduló)

### Technikai javaslat

| Mező | Típus | Leírás |
|------|-------|--------|
| `metadata` | `Record<string, unknown>` | Szabad formátumú bővítés |
| `tags` | `string[]` | Címkék (pl. "2025-Q1", "Észak-Alföld") |
| `workflowState` | `string` | belső állapot (draft → review → approved) |
| `version` | `{ template, schema }` | verzió követés |
| `auditLog` | `{ userId, action, timestamp }[]` | (opcionális) előzmények |

### Implementációs lépések
1. `Company` interface bővítése: `metadata?: Record<string, unknown>`, `tags?: string[]`, `workflowState?: string`
2. `lib/storage` – updateCompany, metadata merge logika
3. API: `PATCH /api/companies/:id` – metadata, tags, workflowState
4. UI: metadata szerkesztő (opcionális), tags input, workflow dropdown
5. Ha audit kell: `auditLog` tömb vagy külön `audit` tábla/file

### Érintett fájlok
- `lib/storage/index.ts` – Company interface, updateCompany
- `app/api/companies/[id]/route.ts` – PATCH bővítés
- `config/workflowStates.ts` (új)
- Cég oldal – metadata/tags UI (opcionális)

---

## 6. Headcount inheritance (létszám öröklődés)

### Jelenlegi helyzet
- `alap_alkalmazotti_letszam` (H14) – manuálisan kitöltendő
- Szoftver M oszlop – felhasználó/létszám mezők soronként, manuálisan
- Nincs automatikus „default” a M mezőkben az alapadatok alapján

### Cél
- Ha egy szoftver sor „felhasználó/hó” vagy „fő” típusú, és a user nem tölti ki: default = `alap_alkalmazotti_letszam`
- UI: placeholder vagy „Alapértelmezett: X fő” szöveg
- Mentésnél: ha üres a mező, írjuk bele a headcount-ot (vagy hagyjuk, hogy a workbook képlete kezelje – ha van ilyen)

### Technikai javaslat

| Komponens | Megvalósítás |
|-----------|--------------|
| Config | `editableFields` – `inheritsFrom: "alap_alkalmazotti_letszam"` a releváns sw_mennyiseg mezőknél |
| Form | `ApplicationForm` – ha mező üres és `inheritsFrom`, placeholder = headcount, submit-nál default érték küldése |
| Workbook | Ha a cella üres és a spec szerint kell érték: apply_form_data-nál `value ?? headcount` |
| UI | „Alapértelmezett: X fő (Alapadatok létszám)” help text |

### Implementációs lépések
1. `editableFields` – jelöljük meg mely `sw_mennyiseg_*` mezők örökölnek: `inheritsFrom: "alap_alkalmazotti_letszam"`
2. `ApplicationForm` – headcount = formData.alap_alkalmazotti_letszam; ha mező üres és inheritsFrom, placeholder + submit default
3. `apply_form_data` (Python vagy Node) – ha value üres és field.inheritsFrom, használjuk a formData[inheritsFrom]-t
4. Validáció: örökölt mezőknél max ≤ headcount (ha logikus)

### Érintett fájlok
- `config/editableFields.ts` – `inheritsFrom` opció
- `components/ApplicationForm.tsx` – placeholder, default value logic
- `scripts/python/workbook_service.py` vagy `lib/workbook` – apply logic
- `lib/workbook/index.ts` – formData preprocessing before Python call

---

## Prioritizálás és sorrend

| # | Fejlesztés | Becslés | Függőség |
|---|------------|---------|----------|
| 1 | **Auth** | 2–3 nap | Alap a többihez (doc upload user, metadata audit) |
| 2 | **Metadata layer** | 1 nap | vatMode, workflow, document types tárolása |
| 3 | **vatMode** | 0.5 nap | Metadata vagy formData |
| 4 | **Headcount inheritance** | 1 nap | Független |
| 5 | **Document upload** | 2 nap | Auth, storage bővítés |
| 6 | **UI refactor** | 2–3 nap | Párhuzamosan vagy utolsóként |

**Javasolt sorrend**: Auth → Metadata → vatMode → Headcount → Document upload → UI refactor
