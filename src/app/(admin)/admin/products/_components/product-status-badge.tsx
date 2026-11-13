import { Badge } from "@/components/ui/badge";

import type { ProductStatus } from "./products-page";

type ProductStatusBadgeProps = {
  status: ProductStatus;
};

const statusLabels: Record<ProductStatus, string> = {
  DRAFT: "Черновик",
  PUBLISHED: "Опубликован",
  ARCHIVED: "В архиве",
};

const statusClasses: Record<ProductStatus, string> = {
  DRAFT:
    "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
  PUBLISHED: "border-brand/20 bg-brand/10 text-brand",
  ARCHIVED: "border-border bg-muted text-muted-foreground",
};

export function ProductStatusBadge({ status }: ProductStatusBadgeProps) {
  return (
    <Badge variant="outline" className={statusClasses[status]}>
      {statusLabels[status]}
    </Badge>
  );
}
