/**
 * DIMOP126 Editable Field Configuration
 * Workbook: DIMOP126B végleges, kalkulátor_v1.xlsx
 *
 * A workbook tényleges szerkezete alapján:
 * - Alapadatok: I oszlop = checkbox értékek (True/False), H14, H16 = számok
 * - Hardver: D oszlop = mennyiség (D3-D10)
 * - Szoftver: D oszlop = Figyelembe vétel, M oszlop = mennyiség/alkalmazotti szám
 *   Ha D = "Nem releváns", M nem szerkeszthető
 */

export const FIGYELEMBE_VETEL_OPTIONS = [
  "Nem releváns",
  "Pályázatból szerzi be",
  "Már rendelkezik vele",
] as const;

export type FigyelembeVetel = (typeof FIGYELEMBE_VETEL_OPTIONS)[number];

export interface EditableField {
  key: string;
  sheet: string;
  cell: string;
  label: string;
  type: "checkbox" | "number" | "select";
  options?: readonly string[];
  validation?: { min?: number; max?: number };
  /** Ha true, a mező csak akkor szerkeszthető, ha a kapcsolódó " Figyelembe vétel" != "Nem releváns" */
  enabledWhenNotRelevant?: boolean;
  /** Szoftver soroknál: melyik D cella szabályozza (pl. "D7") */
  dependsOnCell?: string;
}

export const EDITABLE_FIELDS: EditableField[] = [
  // === Alapadatok - Checkboxok (I oszlop) ===
  {
    key: "alap_dii_felmérés",
    sheet: "Alapadatok",
    cell: "I2",
    label: "A pályázó rendelkezik DII felméréssel?",
    type: "checkbox",
  },
  {
    key: "alap_dfk_megvan",
    sheet: "Alapadatok",
    cell: "I10",
    label: "A pályázó már rendelkezik a DFK-val?",
    type: "checkbox",
  },
  {
    key: "alap_dfk_vallalja",
    sheet: "Alapadatok",
    cell: "I12",
    label: "Ha nem, a pályázó vállalja a DFK minősítés megszerzését?",
    type: "checkbox",
  },
  {
    key: "alap_30mbps",
    sheet: "Alapadatok",
    cell: "I22",
    label: "Legalább 30 Mbps sebességű helyhez kötött internetkapcsolat",
    type: "checkbox",
  },
  {
    key: "alap_50pct_internet",
    sheet: "Alapadatok",
    cell: "I23",
    label: "Alkalmazottak több mint 50%-a rendelkezik internet-hozzáféréssel",
    type: "checkbox",
  },
  {
    key: "alap_tavoli_hozzaferes",
    sheet: "Alapadatok",
    cell: "I24",
    label: "Távoli hozzáférés (e-mail, dokumentum, cloud)",
    type: "checkbox",
  },
  {
    key: "alap_online_megbeszeles",
    sheet: "Alapadatok",
    cell: "I25",
    label: "Online (távoli) megbeszélések tartása",
    type: "checkbox",
  },
  {
    key: "alap_ikt_kepzes",
    sheet: "Alapadatok",
    cell: "I26",
    label: "IKT-képzés biztosítása az alkalmazottaknak",
    type: "checkbox",
  },
  {
    key: "alap_ikt_szakember",
    sheet: "Alapadatok",
    cell: "I27",
    label: "IKT-szakember igénybevétele",
    type: "checkbox",
  },
  {
    key: "alap_ikt_biztonsag",
    sheet: "Alapadatok",
    cell: "I28",
    label: "Alkalmazottak tájékoztatása az IKT-biztonsággal",
    type: "checkbox",
  },
  {
    key: "alap_3_ikt_intézkedes",
    sheet: "Alapadatok",
    cell: "I29",
    label: "Legalább 3 IKT-biztonsági intézkedés",
    type: "checkbox",
  },
  {
    key: "alap_ikt_gyakorlat",
    sheet: "Alapadatok",
    cell: "I30",
    label: "IKT-biztonsági gyakorlatok dokumentumok",
    type: "checkbox",
  },
  {
    key: "alap_weboldal",
    sheet: "Alapadatok",
    cell: "I31",
    label: "Saját weboldallal/honlappal való rendelkezés",
    type: "checkbox",
  },
  {
    key: "alap_kozossegi_media",
    sheet: "Alapadatok",
    cell: "I32",
    label: "Bármilyen közösségi média használata",
    type: "checkbox",
  },
  {
    key: "alap_2_tipusu_media",
    sheet: "Alapadatok",
    cell: "I33",
    label: "Kettő vagy több típusú közösségi média",
    type: "checkbox",
  },
  {
    key: "alap_felho",
    sheet: "Alapadatok",
    cell: "I34",
    label: "Bármilyen fizetős felhőszolgáltatás",
    type: "checkbox",
  },
  {
    key: "alap_fejlett_felho",
    sheet: "Alapadatok",
    cell: "I35",
    label: "Fejlett vagy közepesen fejlett felhőszolgáltatás",
    type: "checkbox",
  },
  {
    key: "alap_erp",
    sheet: "Alapadatok",
    cell: "I36",
    label: "ERP megoldás használata",
    type: "checkbox",
  },
  {
    key: "alap_crm",
    sheet: "Alapadatok",
    cell: "I37",
    label: "CRM megoldás használata",
    type: "checkbox",
  },
  {
    key: "alap_adatanalitika",
    sheet: "Alapadatok",
    cell: "I38",
    label: "Adatanalitika végzése",
    type: "checkbox",
  },
  {
    key: "alap_mi",
    sheet: "Alapadatok",
    cell: "I39",
    label: "MI technológia üzleti célú használata",
    type: "checkbox",
  },
  {
    key: "alap_robot",
    sheet: "Alapadatok",
    cell: "I40",
    label: "Ipari vagy szolgáltató robot használata",
    type: "checkbox",
  },
  {
    key: "alap_iot",
    sheet: "Alapadatok",
    cell: "I41",
    label: "IoT-eszközök/rendszerek használata",
    type: "checkbox",
  },
  {
    key: "alap_e_szamlak",
    sheet: "Alapadatok",
    cell: "I42",
    label: "Automatizált e-számlák küldése",
    type: "checkbox",
  },
  {
    key: "alap_webes_ertekesites",
    sheet: "Alapadatok",
    cell: "I43",
    label: "Webes értékesítés",
    type: "checkbox",
  },
  {
    key: "alap_elektronikus_ertekesites",
    sheet: "Alapadatok",
    cell: "I44",
    label: "Elektronikus értékesítés",
    type: "checkbox",
  },
  // === Alapadatok - számok ===
  {
    key: "alap_alkalmazotti_letszam",
    sheet: "Alapadatok",
    cell: "H14",
    label: "A pályázónál figyelembe vehető alkalmazotti / alvállalkozói létszám",
    type: "number",
    validation: { min: 1, max: 500 },
  },
  {
    key: "alap_projekt_honap",
    sheet: "Alapadatok",
    cell: "H16",
    label: "Tervezett projekt időtartam (hónap)",
    type: "number",
    validation: { min: 1, max: 36 },
  },
  // === Hardver - mennyiségek D3-D10 ===
  {
    key: "hw_szamitogep",
    sheet: "Hardver",
    cell: "D3",
    label: "Számítógép (db)",
    type: "number",
    validation: { min: 0, max: 50 },
  },
  {
    key: "hw_monitor",
    sheet: "Hardver",
    cell: "D4",
    label: "Monitor (db)",
    type: "number",
    validation: { min: 0, max: 50 },
  },
  {
    key: "hw_laptop",
    sheet: "Hardver",
    cell: "D5",
    label: "Laptop (db)",
    type: "number",
    validation: { min: 0, max: 50 },
  },
  {
    key: "hw_nas",
    sheet: "Hardver",
    cell: "D6",
    label: "Hálózati adattároló - NAS (db)",
    type: "number",
    validation: { min: 0, max: 20 },
  },
  {
    key: "hw_router",
    sheet: "Hardver",
    cell: "D7",
    label: "Router (db)",
    type: "number",
    validation: { min: 0, max: 20 },
  },
  {
    key: "hw_mobil",
    sheet: "Hardver",
    cell: "D8",
    label: "Mobiltelefon (db)",
    type: "number",
    validation: { min: 0, max: 50 },
  },
  {
    key: "hw_tablet",
    sheet: "Hardver",
    cell: "D9",
    label: "Tablet (db)",
    type: "number",
    validation: { min: 0, max: 50 },
  },
  {
    key: "hw_nyomtato",
    sheet: "Hardver",
    cell: "D10",
    label: "Multifunkciós nyomtató (db)",
    type: "number",
    validation: { min: 0, max: 20 },
  },
  // === Szoftver - Figyelembe vétel (D) + Mennyiség (M) ===
  // D5-D39, M5-M39 - csak ahol a row "Pályázatból szerzi be" vagy "Már rendelkezik vele", ott M szerkeszthető
  ...generateSzoftverFields(),
];

function generateSzoftverFields(): EditableField[] {
  const rows = [
    { r: 5, label: "Internet" },
    { r: 6, label: "Internet hozzáférés" },
    { r: 7, label: "Távoli hozzáférés" },
    { r: 8, label: "Távoli hozzáférés - Domain" },
    { r: 9, label: "Távoli hozzáférés - IT üzemeltetés" },
    { r: 10, label: "Online megbeszélés" },
    { r: 11, label: "Online megbeszélés - Bevezetés" },
    { r: 12, label: "IKT-képzés - alapképzés" },
    { r: 13, label: "IKT-képzés - haladó" },
    { r: 14, label: "IKT-szakember" },
    { r: 15, label: "IKT-biztonsági képzés" },
    { r: 16, label: "Végpontvédelmi licenc" },
    { r: 17, label: "Biztonsági mentés" },
    { r: 18, label: "IBSZ" },
    { r: 19, label: "GDPR alapfelmérés" },
    { r: 20, label: "Incidenskezelési terv" },
    { r: 21, label: "Digitális aláírás" },
    { r: 22, label: "Saját weboldal" },
    { r: 23, label: "Karbantartás/frissítés" },
    { r: 24, label: "Webtárhely" },
    { r: 25, label: "SSL tanúsítvány" },
    { r: 26, label: "Közösségi média - tartalom" },
    { r: 27, label: "Online jelenlét és hirdetés" },
    { r: 28, label: "Képzés" },
    { r: 29, label: "Bármilyen fizetős felhő - összetevő 1" },
    { r: 30, label: "Bármilyen fizetős felhő - összetevő 2" },
    { r: 31, label: "Fejlett felhő" },
    { r: 32, label: "Közösségi média - használat" },
    { r: 33, label: "ERP" },
    { r: 34, label: "CRM alternatíva" },
    { r: 35, label: "CRM" },
    { r: 36, label: "E-számlák" },
    { r: 37, label: "Webes értékesítés" },
    { r: 38, label: "E-számla feldolgozás" },
    { r: 39, label: "Biztonsági mentés (2)" },
  ];
  const fields: EditableField[] = [];
  for (const { r, label } of rows) {
    const dCell = `D${r}`;
    const mCell = `M${r}`;
    fields.push({
      key: `sw_figyelembe_${r}`,
      sheet: "Szoftver",
      cell: dCell,
      label: `${label} - Figyelembe vétel`,
      type: "select",
      options: FIGYELEMBE_VETEL_OPTIONS,
    });
    fields.push({
      key: `sw_mennyiseg_${r}`,
      sheet: "Szoftver",
      cell: mCell,
      label: `${label} - Mennyiség/fő`,
      type: "number",
      validation: { min: 0, max: 500 },
      enabledWhenNotRelevant: false,
      dependsOnCell: dCell,
    });
  }
  return fields;
}

/** Költségvetés preview cellák - Költségvetés lap, F oszlop */
export const BUDGET_PREVIEW_CELLS = {
  hardver_osszesen: { sheet: "Költségvetés", cell: "F4" },
  szoftver_osszesen: { sheet: "Költségvetés", cell: "F6" },
  kepzes_osszesen: { sheet: "Költségvetés", cell: "F8" },
  szolgaltatasok_osszesen: { sheet: "Költségvetés", cell: "F10" },
  egyeb_koltsegek: { sheet: "Költségvetés", cell: "F12" },
  projektkoltseg_osszesen: { sheet: "Költségvetés", cell: "F14" },
  onero: { sheet: "Költségvetés", cell: "F16" },
  tamogatas_osszesen: { sheet: "Költségvetés", cell: "F18" },
} as const;
