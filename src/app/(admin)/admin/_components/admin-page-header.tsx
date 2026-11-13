import type { ReactNode } from "react";

type AdminPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

export function AdminPageHeader({ eyebrow, title, description, actions }: AdminPageHeaderProps) {
  return (
    <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div className="min-w-0">
        <p className="text-brand text-xs font-bold tracking-[0.18em] uppercase">{eyebrow}</p>

        <h1 className="text-foreground mt-3 text-3xl font-extrabold tracking-tight">{title}</h1>

        <p className="text-muted-foreground mt-2 text-sm">{description}</p>
      </div>

      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}
