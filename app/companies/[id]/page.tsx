"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ApplicationForm } from "@/components/ApplicationForm";
import { BudgetPreview } from "@/components/BudgetPreview";
import { DocumentsSection } from "@/components/DocumentsSection";
import { AppHeader } from "@/components/AppHeader";

interface Company {
  id: string;
  name: string;
  slug?: string;
  status: string;
  vatMode?: "VAT" | "AAM";
}

export default function CompanyPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [company, setCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [budgetPreview, setBudgetPreview] = useState<Record<string, number | null>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    fetch(`/api/companies/${id}/application`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(({ company: c, formData: fd }) => {
        setCompany(c);
        setFormData(fd || {});
      })
      .catch(() => router.push("/"))
      .finally(() => setLoading(false));
  }, [id, router]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/companies/${id}/budget-preview`)
      .then((r) => r.json())
      .then(setBudgetPreview)
      .catch(() => {});
  }, [id, formData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/companies/${id}/application`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, vatMode: company?.vatMode }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Mentés sikertelen");
      }
      const { budgetPreview: bp } = await res.json();
      setBudgetPreview(bp || {});
      setDirty(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Hiba történt");
    } finally {
      setSaving(false);
    }
  };

  const handleExportXlsx = async () => {
    try {
      const res = await fetch(`/api/companies/${id}/export/xlsx`, { method: "POST" });
      if (!res.ok) throw new Error("XLSX export sikertelen");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${company?.slug || id}-palyazat.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("XLSX letöltés sikertelen");
    }
  };

  const handleExportPdf = async () => {
    try {
      const res = await fetch(`/api/companies/${id}/export/pdf`, { method: "POST" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "PDF export sikertelen");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${company?.slug || id}-palyazat.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Hiba történt");
    }
  };

  if (loading || !company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Betöltés...</p>
      </div>
    );
  }

  const updateVatMode = (v: "VAT" | "AAM") => {
    if (company) setCompany({ ...company, vatMode: v });
    setDirty(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader user={session?.user} />
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <a href="/" className="text-slate-600 hover:text-slate-900">
              ← Vissza
            </a>
            <h1 className="text-xl font-bold">{company.name}</h1>
            <span className="text-sm px-2 py-0.5 rounded bg-slate-100 capitalize">
              {company.status}
            </span>
            {dirty && <span className="text-amber-600 text-sm">Módosítva</span>}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">ÁFA mód:</span>
              <select
                value={company.vatMode || "VAT"}
                onChange={(e) => updateVatMode(e.target.value as "VAT" | "AAM")}
                className="text-sm border border-slate-300 rounded px-2 py-1"
              >
                <option value="VAT">VAT (ÁFA körös)</option>
                <option value="AAM">AAM</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSave()}
              disabled={saving || !dirty}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Mentés..." : "Mentés"}
            </button>
            <button
              onClick={handleExportXlsx}
              className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50"
            >
              XLSX letöltés
            </button>
            <button
              onClick={handleExportPdf}
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              PDF letöltés
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <div className="flex-1 min-w-0 space-y-6">
          <ApplicationForm
            formData={formData}
            onChange={(fd) => {
              setFormData(fd);
              setDirty(true);
            }}
            vatMode={company.vatMode || "VAT"}
          />
          <DocumentsSection companyId={id} />
        </div>
        <div className="w-80 flex-shrink-0">
          <div className="sticky top-20">
            <BudgetPreview data={budgetPreview} vatMode={company.vatMode || "VAT"} />
          </div>
        </div>
      </main>
    </div>
  );
}
