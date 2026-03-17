import { resolveMennyiseg } from "./defaultFormData";
import { EDITABLE_FIELDS } from "@/config/editableFields";

const VALID_KEYS = new Set(EDITABLE_FIELDS.map((f) => f.key));

/**
 * Prepare formData for workbook write:
 * - Resolve headcount inheritance for sw_mennyiseg_*
 * - Filter to only allowed keys
 * - Skip _overridden internal keys
 */
export function prepareFormDataForWorkbook(formData: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const field of EDITABLE_FIELDS) {
    const key = field.key;
    if (key.startsWith("sw_mennyiseg_")) {
      const row = parseInt(key.replace("sw_mennyiseg_", ""), 10);
      const resolved = resolveMennyiseg(formData, row);
      result[key] = resolved === "nem releváns" ? "nem releváns" : resolved;
    } else if (VALID_KEYS.has(key) && !key.endsWith("_overridden")) {
      const v = formData[key];
      if (v !== undefined && v !== null && v !== "") {
        result[key] = v;
      }
    }
  }
  return result;
}
