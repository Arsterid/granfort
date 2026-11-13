import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/server/auth/require-admin";
import { UnauthorizedError } from "@/server/errors/app-error";

export const metadata: Metadata = {
  title: "Администрирование — GRANFORT",
};

export default async function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      redirect("/api/auth/signin?callbackUrl=%2Fadmin");
    }

    throw error;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-md bg-brand text-xl font-black text-white">
              G
            </span>

            <span className="flex flex-col">
              <span className="text-lg font-extrabold tracking-wider">
                GRANFORT
              </span>
              <span className="text-[10px] font-semibold tracking-[0.18em] text-slate-500">
                ПАНЕЛЬ УПРАВЛЕНИЯ
              </span>
            </span>
          </Link>

          <Link
            href="/"
            className="text-sm font-semibold text-slate-600 transition hover:text-brand"
          >
            На сайт <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <nav className="border-t border-slate-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/admin"
              aria-current="page"
              className="inline-flex border-b-2 border-brand px-1 py-3 text-sm font-semibold text-brand"
            >
              Обзор
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}