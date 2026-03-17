/**
 * Template metadata – hardware items, software goal groups
 * Generated from: python scripts/python/extract_template_metadata.py
 * Source: Excel workbook
 */

export interface HardwareItem {
  key: string;
  row: number;
  name: string;
  unit: string;
  unitCostNet: number;
  unitCostGross: number;
}

export interface SoftwareItem {
  row: number;
  label: string;
  unit: string;
  unitCostNet: number;
  unitCostGross: number;
}

export interface SoftwareGoalGroup {
  goal: string;
  goalRow: number;
  items: SoftwareItem[];
}

// Embedded metadata - run extract_template_metadata.py to regenerate
export const hardwareItems: HardwareItem[] = [
  { key: "hw_szamitogep", row: 3, name: "Számítógép", unit: "db", unitCostNet: 388600, unitCostGross: 493522 },
  { key: "hw_monitor", row: 4, name: "Monitor", unit: "db", unitCostNet: 62300, unitCostGross: 79121 },
  { key: "hw_laptop", row: 5, name: "Laptop", unit: "db", unitCostNet: 338300, unitCostGross: 429641 },
  { key: "hw_nas", row: 6, name: "Hálózati adattároló - NAS", unit: "db", unitCostNet: 251400, unitCostGross: 319278 },
  { key: "hw_router", row: 7, name: "Router", unit: "db", unitCostNet: 68200, unitCostGross: 86614 },
  { key: "hw_mobil", row: 8, name: "Mobiltelefon", unit: "db", unitCostNet: 212200, unitCostGross: 269494 },
  { key: "hw_tablet", row: 9, name: "Tablet", unit: "db", unitCostNet: 256500, unitCostGross: 325755 },
  { key: "hw_nyomtato", row: 10, name: "Multifunkciós nyomtató", unit: "db", unitCostNet: 152300, unitCostGross: 193421 },
];

export function getHardwareItemByKey(key: string): HardwareItem | undefined {
  return hardwareItems.find((h) => h.key === key);
}

export function getSoftwareItemByRow(row: number): SoftwareItem | undefined {
  for (const g of softwareGoalGroups) {
    const item = g.items.find((i) => i.row === row);
    if (item) return item;
  }
  return undefined;
}

// Software groups - simplified for UI (full data from extract script)
export const softwareGoalGroups: SoftwareGoalGroup[] = [
  { goal: "Internet", goalRow: 5, items: [{ row: 5, label: "Internet", unit: "", unitCostNet: 0, unitCostGross: 0 }] },
  { goal: "Internet hozzáférés", goalRow: 6, items: [{ row: 6, label: "Internet hozzáférés", unit: "", unitCostNet: 0, unitCostGross: 0 }] },
  { goal: "Távoli hozzáférés", goalRow: 7, items: [
    { row: 7, label: "SaaS irodai csomag", unit: "felhasználó/hó", unitCostNet: 5900, unitCostGross: 7493 },
    { row: 8, label: "Domain regisztráció", unit: "hó", unitCostNet: 200, unitCostGross: 254 },
    { row: 9, label: "Havidíjas IT-üzemeltetés", unit: "hó", unitCostNet: 127300, unitCostGross: 161671 },
  ]},
  { goal: "Online (távoli) megbeszélések", goalRow: 10, items: [
    { row: 10, label: "Videókonferencia platform", unit: "felhasználó/hó", unitCostNet: 5300, unitCostGross: 6731 },
    { row: 11, label: "Bevezetési, üzemeltetési", unit: "hó", unitCostNet: 53000, unitCostGross: 67310 },
  ]},
  { goal: "IKT-képzés biztosítása", goalRow: 12, items: [
    { row: 12, label: "IKT-alapképzés", unit: "fő", unitCostNet: 76300, unitCostGross: 96901 },
    { row: 13, label: "Haladó digitális készségfejlesztés", unit: "fő", unitCostNet: 191100, unitCostGross: 242697 },
  ]},
  { goal: "IKT-szakember igénybevétele", goalRow: 14, items: [{ row: 14, label: "IKT-szakember", unit: "óra", unitCostNet: 9200, unitCostGross: 11684 }]},
  { goal: "Alkalmazottak tájékoztatása", goalRow: 15, items: [{ row: 15, label: "IKT-biztonsági képzés", unit: "fő", unitCostNet: 207100, unitCostGross: 263017 }]},
  { goal: "Legalább 3 IKT-biztonsági intézkedés", goalRow: 16, items: [
    { row: 16, label: "Végpontvédelmi licenc", unit: "db/hó", unitCostNet: 1400, unitCostGross: 1778 },
    { row: 17, label: "Biztonsági mentés", unit: "db/hó", unitCostNet: 3000, unitCostGross: 3810 },
  ]},
  { goal: "IKT-biztonsági gyakorlatok", goalRow: 18, items: [
    { row: 18, label: "IBSZ", unit: "egyszeri költség", unitCostNet: 524300, unitCostGross: 665861 },
    { row: 19, label: "GDPR alapfelmérés", unit: "egyszeri költség", unitCostNet: 257900, unitCostGross: 327533 },
    { row: 20, label: "Incidenskezelési terv", unit: "fő", unitCostNet: 294300, unitCostGross: 373761 },
    { row: 21, label: "Digitális aláírás", unit: "felhasználó/hó", unitCostNet: 5200, unitCostGross: 6604 },
  ]},
  { goal: "Saját weboldallal/honlappal", goalRow: 22, items: [
    { row: 22, label: "Saját weboldal kialakítás", unit: "egyszeri költség", unitCostNet: 345100, unitCostGross: 438277 },
    { row: 23, label: "Karbantartás/frissítés", unit: "hó", unitCostNet: 10100, unitCostGross: 12827 },
    { row: 24, label: "Webtárhely", unit: "hó", unitCostNet: 1900, unitCostGross: 2413 },
    { row: 25, label: "SSL tanúsítvány", unit: "hó", unitCostNet: 600, unitCostGross: 762 },
  ]},
  { goal: "Bármilyen közösségi média", goalRow: 26, items: [
    { row: 26, label: "Tartalomgyártás", unit: "hó", unitCostNet: 74900, unitCostGross: 95123 },
  ]},
  { goal: "Kettő vagy több típusú közösségi média", goalRow: 27, items: [
    { row: 27, label: "Online jelenlét és hirdetés", unit: "hó", unitCostNet: 96300, unitCostGross: 122301 },
    { row: 28, label: "Képzés", unit: "fő", unitCostNet: 374500, unitCostGross: 475615 },
  ]},
  { goal: "Bármilyen fizetős felhő", goalRow: 29, items: [
    { row: 29, label: "Összetevő 1", unit: "db/hó", unitCostNet: 21800, unitCostGross: 27686 },
    { row: 30, label: "Összetevő 2", unit: "hó", unitCostNet: 109100, unitCostGross: 138557 },
  ]},
  { goal: "Fejlett felhő", goalRow: 31, items: [{ row: 31, label: "Fejlett felhő", unit: "egyszeri költség", unitCostNet: 1379800, unitCostGross: 1752346 }]},
  { goal: "Közösségi média használat", goalRow: 32, items: [{ row: 32, label: "Használat", unit: "felhasználó/hó", unitCostNet: 14400, unitCostGross: 18288 }]},
  { goal: "ERP", goalRow: 33, items: [{ row: 33, label: "ERP", unit: "felhasználó/hó", unitCostNet: 24800, unitCostGross: 31496 }]},
  { goal: "CRM alternatíva", goalRow: 34, items: [{ row: 34, label: "CRM alt", unit: "egyszeri költség", unitCostNet: 1994300, unitCostGross: 2532761 }]},
  { goal: "CRM", goalRow: 35, items: [{ row: 35, label: "CRM", unit: "felhasználó/hó", unitCostNet: 20700, unitCostGross: 26289 }]},
  { goal: "Automatizált e-számlák", goalRow: 36, items: [{ row: 36, label: "E-számlák", unit: "egyszeri költség", unitCostNet: 1329500, unitCostGross: 1688465 }]},
  { goal: "Webes értékesítés", goalRow: 37, items: [{ row: 37, label: "Webes értékesítés", unit: "felhasználó/hó", unitCostNet: 3200, unitCostGross: 4064 }]},
  { goal: "E-számla feldolgozás", goalRow: 38, items: [
    { row: 38, label: "E-számla", unit: "felhasználó/hó", unitCostNet: 19200, unitCostGross: 24384 },
    { row: 39, label: "Biztonsági mentés", unit: "db/hó", unitCostNet: 3000, unitCostGross: 3810 },
  ]},
];
