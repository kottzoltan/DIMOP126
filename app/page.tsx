"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { AppHeader } from "@/components/AppHeader";

interface Company {
  id: string;
  name: string;
  slug: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function HomePage() {
  const { data: session } = useSession();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch("/api/companies")
      .then((r) => r.json())
      .then(setCompanies)
      .finally(() => setLoading(false));
  }, []);

  const createCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Hiba");
      }
      const company = await res.json();
      setCompanies((prev) => [company, ...prev]);
      setNewName("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Hiba történt");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader user={session?.user} />
      <div className="max-w-4xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">DIMOP126 Pályázati Kalkulátor</h1>
        <p className="text-slate-600 mt-1">Cég szerinti pályázati űrlap kezelés</p>
      </header>

      <section className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
        <h2 className="font-semibold mb-3">Új cég felvétele</h2>
        <form onSubmit={createCompany} className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Cégnév"
            className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={creating || !newName.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? "..." : "Létrehozás"}
          </button>
        </form>
      </section>

      <section className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <h2 className="font-semibold p-4 border-b border-slate-200">Cégek</h2>
        {loading ? (
          <p className="p-4 text-slate-500">Betöltés...</p>
        ) : companies.length === 0 ? (
          <p className="p-4 text-slate-500">Még nincs cég. Hozz létre egyet a fenti űrlappal.</p>
        ) : (
          <ul>
            {companies.map((c) => (
              <li key={c.id} className="border-b border-slate-100 last:border-0">
                <Link
                  href={`/companies/${c.id}`}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 transition"
                >
                  <span className="font-medium">{c.name}</span>
                  <span className="text-sm text-slate-500 capitalize">{c.status}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      </div>
    </div>
  );
}
