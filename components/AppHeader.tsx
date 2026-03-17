"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";

interface AppHeaderProps {
  user?: { name?: string | null; email?: string | null };
  compact?: boolean;
}

export function AppHeader({ user, compact }: AppHeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold text-slate-800 hover:text-slate-900">
          DIMOP126
        </Link>
        {!compact && (
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-slate-600">{user.email}</span>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="text-sm text-slate-600 hover:text-slate-900"
                >
                  Kijelentkezés
                </button>
              </>
            ) : (
              <Link href="/login" className="text-sm text-blue-600 hover:underline">
                Bejelentkezés
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
