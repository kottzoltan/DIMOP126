import { describe, it, expect } from "vitest";
import { EDITABLE_FIELDS, FIGYELEMBE_VETEL_OPTIONS } from "@/config/editableFields";

describe("editableFields config", () => {
  it("has valid options for Figyelembe vétel", () => {
    expect(FIGYELEMBE_VETEL_OPTIONS).toContain("Nem releváns");
    expect(FIGYELEMBE_VETEL_OPTIONS).toContain("Pályázatból szerzi be");
    expect(FIGYELEMBE_VETEL_OPTIONS).toContain("Már rendelkezik vele");
  });

  it("all fields have required props", () => {
    for (const f of EDITABLE_FIELDS) {
      expect(f.key).toBeTruthy();
      expect(f.sheet).toBeTruthy();
      expect(f.cell).toMatch(/^[A-Z]+\d+$/);
      expect(f.label).toBeTruthy();
      expect(["checkbox", "number", "select"]).toContain(f.type);
    }
  });

  it("keys are unique", () => {
    const keys = new Set<string>();
    for (const f of EDITABLE_FIELDS) {
      expect(keys.has(f.key)).toBe(false);
      keys.add(f.key);
    }
  });
});
