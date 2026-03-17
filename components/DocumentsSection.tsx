"use client";

import { useState, useEffect, useRef } from "react";

interface Doc {
  id: string;
  originalName: string;
  size: number;
  createdAt: string;
}

interface Props {
  companyId: string;
}

export function DocumentsSection({ companyId }: Props) {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => {
    fetch(`/api/companies/${companyId}/documents`)
      .then((r) => r.json())
      .then(setDocs)
      .catch(() => {});
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch(`/api/companies/${companyId}/documents`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Feltöltés sikertelen");
      }
      load();
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      alert(err instanceof Error ? err.message : "Hiba");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm("Törölni szeretnéd a dokumentumot?")) return;
    try {
      const res = await fetch(`/api/companies/${companyId}/documents/${docId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Törlés sikertelen");
      load();
    } catch {
      alert("Törlés sikertelen");
    }
  };

  const fmtSize = (n: number) => (n < 1024 ? `${n} B` : n < 1024 * 1024 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`);

  return (
    <section className="bg-white rounded-lg border border-slate-200 p-6">
      <h2 className="text-lg font-semibold mb-4">Dokumentumok</h2>
      <p className="text-sm text-slate-500 mb-4">
        pdf, doc, docx, xls, xlsx, csv, txt, png, jpg, zip (max 10 MB)
      </p>
      <div className="flex gap-2 mb-4">
        <input
          ref={fileRef}
          type="file"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.png,.jpg,.jpeg,.zip"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-md disabled:opacity-50"
        >
          {uploading ? "Feltöltés..." : "Fájl feltöltése"}
        </button>
      </div>
      {docs.length === 0 ? (
        <p className="text-sm text-slate-500">Még nincs feltöltött dokumentum.</p>
      ) : (
        <ul className="space-y-2">
          {docs.map((d) => (
            <li
              key={d.id}
              className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
            >
              <a
                href={`/api/companies/${companyId}/documents/${d.id}`}
                download={d.originalName}
                className="text-sm text-blue-600 hover:underline truncate flex-1 min-w-0"
              >
                {d.originalName}
              </a>
              <span className="text-xs text-slate-400 flex-shrink-0 ml-2">
                {fmtSize(d.size)}
              </span>
              <button
                type="button"
                onClick={() => handleDelete(d.id)}
                className="ml-2 text-red-500 hover:text-red-700 text-sm"
              >
                Törlés
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
