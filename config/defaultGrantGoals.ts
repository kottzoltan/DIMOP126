/**
 * Default pályázati célok - B oszlop sorszámok (1., 2., 3., ...)
 * Új cégnél ezek "Pályázatból szerzi be" + al-célok aktívak
 */
export const DEFAULT_GRANT_GOAL_NUMBERS = [3, 4, 10, 12, 13, 14] as const;

/** B oszlop sorszám -> Excel sorok (D/M cellák) */
export const GOAL_NUMBER_TO_EXCEL_ROWS: Record<number, number[]> = {
  1: [5],
  2: [6],
  3: [7, 8, 9],       // Távoli hozzáférés
  4: [10, 11],       // Online megbeszélések
  5: [12, 13],       // IKT-képzés
  6: [14],           // IKT-szakember
  7: [15],           // Alkalmazottak tájékoztatása
  8: [16, 17],       // 3 IKT-biztonsági
  9: [18, 19, 20, 21],
  10: [22, 23, 24, 25], // Saját weboldal
  11: [26],
  12: [27, 28],
  13: [29, 30],
  14: [31],
  15: [32],
  16: [33, 34],
  17: [35],
  18: [36, 37, 38, 39],
};

/** Összes Excel sor (sw_figyelembe_X, sw_mennyiseg_X) ami default "Pályázatból szerzi be" */
export function getDefaultActiveSwRows(): number[] {
  const rows: number[] = [];
  for (const goalNum of DEFAULT_GRANT_GOAL_NUMBERS) {
    const excelRows = GOAL_NUMBER_TO_EXCEL_ROWS[goalNum];
    if (excelRows) rows.push(...excelRows);
  }
  return Array.from(new Set(rows));
}
