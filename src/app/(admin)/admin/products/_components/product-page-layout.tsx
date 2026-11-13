import { ArrowLeft, Package, PackagePlus } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type ProductPageLayoutProps = {
  mode: "create" | "edit";
  children: ReactNode;
  title?: string;
  description?: string;
  actions?: ReactNode;
};

export function ProductPageLayout({
  mode,
  children,
  title,
  description,
  actions,
}: ProductPageLayoutProps) {
  const isCreate = mode === "create";
  const PageIcon = isCreate ? PackagePlus : Package;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/admin/products"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" />
        Назад к товарам
      </Link>

      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-brand text-xs font-bold tracking-[0.18em] uppercase">
            GRANFORT / ПРОИЗВОДСТВО
          </p>

          <div className="mt-3 flex items-center gap-3">
            <span className="bg-brand/10 text-brand grid size-11 shrink-0 place-items-center rounded-lg">
              <PageIcon className="size-5" />
            </span>

            <div>
              <h1 className="text-foreground text-3xl font-extrabold tracking-tight">
                {title ?? (isCreate ? "Новый товар" : "Карточка товара")}
              </h1>

              <p className="text-muted-foreground mt-1 text-sm">
                {description ??
                  (isCreate
                    ? "Создание карточки товара GRANFORT."
                    : "Просмотр и редактирование карточки товара GRANFORT.")}
              </p>
            </div>
          </div>
        </div>

        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </header>

      {children}
    </div>
  );
}
