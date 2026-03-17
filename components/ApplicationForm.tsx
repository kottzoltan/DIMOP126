"use client";

import {
  EDITABLE_FIELDS,
  FIGYELEMBE_VETEL_OPTIONS,
  type EditableField,
} from "@/config/editableFields";
import { hardwareItems, softwareGoalGroups } from "@/lib/workbook/templateMetadata";
import { resolveMennyiseg } from "@/lib/defaultFormData";

interface Props {
  formData: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
  vatMode?: "VAT" | "AAM";
}

function isQuantityEnabled(formData: Record<string, unknown>, row: number): boolean {
  const val = formData[`sw_figyelembe_${row}`];
  return val !== "Nem releváns" && val !== "nem releváns" && val != null && val !== "";
}

function getEffectiveMennyiseg(formData: Record<string, unknown>, row: number): number {
  const r = resolveMennyiseg(formData, row);
  return typeof r === "number" ? r : 0;
}

export function ApplicationForm({ formData, onChange, vatMode = "VAT" }: Props) {
  const update = (key: string, value: unknown) => {
    onChange({ ...formData, [key]: value });
  };

  const alapFields = EDITABLE_FIELDS.filter((f) => f.key.startsWith("alap_"));
  const showGross = vatMode === "VAT";

  const renderField = (field: EditableField) => {
    const val = formData[field.key];
    const enabled =
      field.type === "number" && field.key.startsWith("sw_mennyiseg_")
        ? isQuantityEnabled(formData, parseInt(field.key.replace("sw_mennyiseg_", ""), 10))
        : true;

    if (field.type === "checkbox") {
      return (
        <label key={field.key} className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!!val}
            onChange={(e) => update(field.key, e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-blue-600"
          />
          <span className="text-sm">{field.label}</span>
        </label>
      );
    }
    if (field.type === "number") {
      const v = val === "" || val === undefined || val === null ? "" : String(val);
      return (
        <div key={field.key}>
          <label className="block text-sm font-medium text-slate-700 mb-1">{field.label}</label>
          <input
            type="number"
            value={v}
            onChange={(e) => {
              const n = e.target.value === "" ? "" : Number(e.target.value);
              update(field.key, n);
              if (field.key.startsWith("sw_mennyiseg_")) {
                update(field.key.replace("sw_mennyiseg_", "sw_mennyiseg_") + "_overridden", n !== "" && n !== undefined);
              }
            }}
            disabled={!enabled}
            min={field.validation?.min}
            max={field.validation?.max}
            className="w-full px-3 py-2 border border-slate-300 rounded-md disabled:bg-slate-100 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500"
          />
        </div>
      );
    }
    if (field.type === "select") {
      const options = field.options || FIGYELEMBE_VETEL_OPTIONS;
      return (
        <div key={field.key}>
          <label className="block text-sm font-medium text-slate-700 mb-1">{field.label}</label>
          <select
            value={(val as string) ?? ""}
            onChange={(e) => update(field.key, e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">— Válassz —</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      );
    }
    return null;
  };

  const formatFt = (n: number) => new Intl.NumberFormat("hu-HU").format(n);

  return (
    <div className="space-y-8">
      {/* Alapadatok */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-slate-800">Alapadatok</h2>
        <div className="space-y-4 grid grid-cols-1 md:grid-cols-2">
          {alapFields.map(renderField)}
        </div>
      </section>

      {/* Hardver */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-slate-800">Hardver</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 font-medium text-slate-700">Megnevezés</th>
                <th className="text-right py-2 font-medium text-slate-700">Mennyiség</th>
                <th className="text-right py-2 font-medium text-slate-700">Egységköltség (nettó)</th>
                {showGross && <th className="text-right py-2 font-medium text-slate-700">Egységköltség (bruttó)</th>}
                <th className="text-right py-2 font-medium text-slate-700">Sorösszeg</th>
              </tr>
            </thead>
            <tbody>
              {hardwareItems.map((h) => {
                const qty = Number(formData[h.key] ?? 0);
                const rowNet = qty * h.unitCostNet;
                const rowGross = qty * h.unitCostGross;
                return (
                  <tr key={h.key} className="border-b border-slate-100">
                    <td className="py-2">{h.name}</td>
                    <td className="text-right">
                      <input
                        type="number"
                        value={formData[h.key] != null ? String(formData[h.key]) : ""}
                        onChange={(e) => update(h.key, e.target.value === "" ? 0 : Number(e.target.value))}
                        min={0}
                        className="w-20 px-2 py-1 border border-slate-300 rounded text-right"
                      />
                    </td>
                    <td className="text-right tabular-nums">{formatFt(h.unitCostNet)} Ft</td>
                    {showGross && <td className="text-right tabular-nums">{formatFt(h.unitCostGross)} Ft</td>}
                    <td className="text-right tabular-nums font-medium">{formatFt(showGross ? rowGross : rowNet)} Ft</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Szoftver - csoportosítva */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-slate-800">Szoftver</h2>
        <p className="text-sm text-slate-500 mb-4">
          Figyelembe vétel és mennyiség. Ha „Nem releváns”, a mennyiség örökli az alap létszámot vagy felülírható.
        </p>
        {softwareGoalGroups.map((grp) => (
          <div key={grp.goalRow} className="mb-6 last:mb-0">
            <h3 className="font-medium text-slate-700 mb-2">{grp.goal}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 font-medium text-slate-600">Összetevő</th>
                    <th className="text-left py-2 font-medium text-slate-600 w-40">Figyelembe vétel</th>
                    <th className="text-right py-2 font-medium text-slate-600 w-24">Mennyiség</th>
                    <th className="text-right py-2 font-medium text-slate-600">Egység nettó</th>
                    {showGross && <th className="text-right py-2 font-medium text-slate-600">Egység bruttó</th>}
                    <th className="text-right py-2 font-medium text-slate-600">Sorösszeg</th>
                  </tr>
                </thead>
                <tbody>
                  {grp.items.map((item) => {
                    const figyelembe = formData[`sw_figyelembe_${item.row}`];
                    const overridden = formData[`sw_mennyiseg_${item.row}_overridden`];
                    const effectiveQty = getEffectiveMennyiseg(formData, item.row);
                    const rowNet = effectiveQty * (item.unitCostNet || 0);
                    const rowGross = effectiveQty * (item.unitCostGross || 0);
                    const enabled = isQuantityEnabled(formData, item.row);
                    const headcount = Number(formData.alap_alkalmazotti_letszam ?? 1);
                    return (
                      <tr key={item.row} className="border-b border-slate-100">
                        <td className="py-2">
                          <span className="text-slate-700">{item.label.slice(0, 50)}{item.label.length > 50 ? "…" : ""}</span>
                        </td>
                        <td>
                          <select
                            value={(figyelembe as string) ?? ""}
                            onChange={(e) => update(`sw_figyelembe_${item.row}`, e.target.value)}
                            className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                          >
                            {FIGYELEMBE_VETEL_OPTIONS.map((o) => (
                              <option key={o} value={o}>{o}</option>
                            ))}
                          </select>
                        </td>
                        <td className="text-right">
                          {enabled ? (
                            <div className="flex items-center justify-end gap-1">
                              <input
                                type="number"
                                value={overridden ? String(formData[`sw_mennyiseg_${item.row}`] ?? "") : ""}
                                onChange={(e) => {
                                  const v = e.target.value === "" ? "" : Number(e.target.value);
                                  update(`sw_mennyiseg_${item.row}`, v);
                                  update(`sw_mennyiseg_${item.row}_overridden`, v !== "" && v !== undefined);
                                }}
                                placeholder={overridden ? "" : String(headcount)}
                                min={0}
                                className="w-16 px-2 py-1 border border-slate-300 rounded text-right text-sm"
                              />
                              {!overridden && (
                                <span className="text-xs text-slate-400" title="Alapértelmezett: alkalmazotti létszám">↻</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="text-right tabular-nums">{item.unitCostNet ? formatFt(item.unitCostNet) : "—"} Ft</td>
                        {showGross && <td className="text-right tabular-nums">{item.unitCostGross ? formatFt(item.unitCostGross) : "—"} Ft</td>}
                        <td className="text-right tabular-nums font-medium">{formatFt(showGross ? rowGross : rowNet)} Ft</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
