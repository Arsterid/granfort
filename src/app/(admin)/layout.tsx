import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { AdminShell } from "@/components/admin/admin-shell";
import { AdminQueryProvider } from "@/components/admin/admin-query-provider";
import { Toaster } from "@/components/ui/toast";
import { requireAdmin } from "@/server/auth/require-admin";
import { UnauthorizedError } from "@/server/errors/app-error";

export const metadata: Metadata = {
  title: "Администрирование - GRANFORT",
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
    <AdminQueryProvider>
      <AdminShell>{children}</AdminShell>
      <Toaster />
    </AdminQueryProvider>
  );
}
