import type { ReactNode } from "react";

type AdminPageLayoutProps = {
  children: ReactNode;
};

export function AdminPageLayout({ children }: AdminPageLayoutProps) {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      {children}
    </main>
  );
}