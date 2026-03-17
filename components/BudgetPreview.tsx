"use client";

interface Props {
  data: Record<string, number | null>;
  vatMode?: "VAT" | "AAM";
}

function fmt(num: number | null | undefined): string {
  if (num == null || Number.isNaN(num)) return "—";
  return new Intl.NumberFormat("hu-HU").format(Math.round(num));
}

export function BudgetPreview({ data, vatMode = "VAT" }: Props) {
  const net = data.projektkoltseg_osszesen ?? 0;
  const gross = (data.projektkoltseg_osszesen_brutto as number) ?? net * 1.27;
  const tamogatasNet = data.tamogatas_osszesen ?? 0;
  const tamogatasGross = (data.tamogatas_osszesen_brutto as number) ?? tamogatasNet * 1.27;
  const oneroNet = data.onero ?? 0;
  const oneroGross = (data.onero_brutto as number) ?? oneroNet * 1.27;

  const showGross = vatMode === "VAT";

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h2 className="font-semibold mb-4 text-slate-800">Költségvetési összesítő</h2>
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-slate-600">Hardver összesen</dt>
          <dd className="font-medium tabular-nums">{fmt(data.hardver_osszesen)} Ft</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-slate-600">Szoftver összesen</dt>
          <dd className="font-medium tabular-nums">{fmt(data.szoftver_osszesen)} Ft</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-slate-600">Képzés összesen</dt>
          <dd className="font-medium tabular-nums">{fmt(data.kepzes_osszesen)} Ft</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-slate-600">Szolgáltatások</dt>
          <dd className="font-medium tabular-nums">{fmt(data.szolgaltatasok_osszesen)} Ft</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-slate-600">Egyéb költségek</dt>
          <dd className="font-medium tabular-nums">{fmt(data.egyeb_koltsegek)} Ft</dd>
        </div>
        <div className="border-t border-slate-200 pt-3 mt-3">
          <div className="flex justify-between gap-2 font-medium">
            <dt className="text-slate-700">Projektköltség (nettó)</dt>
            <dd className="tabular-nums">{fmt(net)} Ft</dd>
          </div>
          {showGross && (
            <div className="flex justify-between gap-2 text-slate-600">
              <dt>Projektköltség (bruttó)</dt>
              <dd className="tabular-nums">{fmt(gross)} Ft</dd>
            </div>
          )}
        </div>
        <div className="border-t border-slate-200 pt-3">
          <div className="flex justify-between gap-2 font-medium text-emerald-700">
            <dt>Támogatás (nettó)</dt>
            <dd className="tabular-nums">{fmt(tamogatasNet)} Ft</dd>
          </div>
          {showGross && (
            <div className="flex justify-between gap-2 text-emerald-600">
              <dt>Támogatás (bruttó)</dt>
              <dd className="tabular-nums">{fmt(tamogatasGross)} Ft</dd>
            </div>
          )}
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-slate-600">Önerő</dt>
          <dd className="font-medium tabular-nums">{fmt(oneroNet)} Ft</dd>
        </div>
      </dl>
    </div>
  );
}
