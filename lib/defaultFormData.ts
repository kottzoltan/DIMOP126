import { getDefaultActiveSwRows } from "@/config/defaultGrantGoals";

/**
 * Default form data for new companies:
 * - Default grant goals: "Pályázatból szerzi be"
 * - Headcount: 1 (user can change)
 * - sw_mennyiseg: inherited from headcount (no overrides initially)
 */
export function getDefaultFormData(): Record<string, unknown> {
  const defaultRows = getDefaultActiveSwRows();
  const formData: Record<string, unknown> = {
    alap_alkalmazotti_letszam: 1,
    alap_projekt_honap: 12,
    alap_dfk_vallalja: true,
  };
  for (const row of defaultRows) {
    formData[`sw_figyelembe_${row}`] = "Pályázatból szerzi be";
    formData[`sw_mennyiseg_${row}`] = 1; // Will be overwritten by headcount inheritance at display/save
    formData[`sw_mennyiseg_${row}_overridden`] = false;
  }
  formData.hw_szamitogep = 0;
  formData.hw_monitor = 0;
  formData.hw_laptop = 0;
  formData.hw_nas = 0;
  formData.hw_router = 0;
  formData.hw_mobil = 0;
  formData.hw_tablet = 0;
  formData.hw_nyomtato = 0;
  return formData;
}

/** Resolve effective mennyiseg: if inherited, use headcount; otherwise use overridden value */
export function resolveMennyiseg(
  formData: Record<string, unknown>,
  row: number
): number | string | "nem releváns" {
  const figyelembe = formData[`sw_figyelembe_${row}`];
  if (figyelembe === "Nem releváns" || !figyelembe) return "nem releváns";
  const overridden = formData[`sw_mennyiseg_${row}_overridden`];
  if (overridden === true) {
    const v = formData[`sw_mennyiseg_${row}`];
    return v === "" || v === undefined || v === null ? "nem releváns" : (v as number);
  }
  const headcount = formData.alap_alkalmazotti_letszam;
  const hc = typeof headcount === "number" ? headcount : typeof headcount === "string" ? parseInt(headcount, 10) : 1;
  return Number.isNaN(hc) ? 1 : hc;
}
