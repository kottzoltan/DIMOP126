# DIMOP126 Pályázati Kalkulátor

Webes megoldás egy meglévő Excel pályázati kalkulátor kezeléséhez. A kezelő egy űrlapon szerkeszti a kiválasztott mezőket, élőben látja a költségvetést, és per cégenként menthet XLSX-et és PDF-et.

## Követelmények

- **Node.js** 18+
- **Python 3** + openpyxl: `pip install openpyxl`
- **LibreOffice** (PDF export és képletszámítás): `brew install --cask libreoffice`

## Telepítés

```bash
npm install
```

## Környezeti változók

Hozz létre `.env.local` fájlt:

```
NEXTAUTH_SECRET=valami-titkos-kulcs-productionban-valtoztasd
```

## Futtatás

```bash
npm run dev
```

A szerver a http://localhost:3000 címen indul.

## Bejelentkezés

Először hozd létre a demo admin usert:

```bash
npm run seed:users
```

Bejelentkezési adatok:
- **Email:** admin@dimop.local
- **Jelszó:** demo123

## Minta adatok

```bash
npm run seed:users   # demo admin user
npm run seed         # 2 demo cég (Gipsz Jakab Kft., Tech Innováció Zrt.)
# vagy
npm run seed:all     # mindkettő
```

## Funkciók

- **Auth:** NextAuth credentials, admin/editor szerepkör
- **Cégek:** CRUD, vatMode (VAT/AAM)
- **Űrlap:** Alapadatok, Hardver (mennyiség, egységköltség, sorösszeg), Szoftver (fejlesztési cél szerint csoportosítva)
- **Létszám öröklés:** Szoftver mennyiségek alapértelmezetten az alkalmazotti létszámból
- **Default célok:** Új cégnél a 3, 4, 10, 12, 13, 14. célok automatikusan aktívak
- **Dokumentumok:** Feltöltés, listázás, letöltés, törlés (pdf, doc, docx, xls, xlsx, csv, txt, png, jpg, zip)
- **Költségvetés:** Nettó/bruttó megjelenítés, projektköltség, támogatás, önerő
- **Export:** XLSX, PDF

## API végpontok

| Metódus | Endpoint | Leírás |
|---------|----------|--------|
| POST | /api/auth/* | NextAuth |
| GET | /api/companies | Cégek listázása |
| POST | /api/companies | Új cég létrehozása |
| GET | /api/companies/:id | Cég adatok |
| PATCH | /api/companies/:id | Cég módosítása |
| GET | /api/companies/:id/application | űrlap adatok |
| PUT | /api/companies/:id/application | űrlap mentése |
| GET | /api/companies/:id/budget-preview | Költségvetés előnézet |
| POST | /api/companies/:id/recalculate | Újraszámítás |
| POST | /api/companies/:id/export/xlsx | XLSX letöltés |
| POST | /api/companies/:id/export/pdf | PDF generálás |
| GET | /api/companies/:id/documents | Dokumentumok listája |
| POST | /api/companies/:id/documents | Dokumentum feltöltés |
| DELETE | /api/companies/:id/documents/:docId | Dokumentum törlés |

## Ismert korlátok

1. **LibreOffice** szükséges a PDF exporthoz és a képletek stabil újraszámításához.
2. A template fájl: `template/DIMOP126B végleges, kalkulátor_v1.xlsx`
3. Adattárolás: JSON fájlok (`data/`) – productionhoz ajánlott SQLite/PostgreSQL
