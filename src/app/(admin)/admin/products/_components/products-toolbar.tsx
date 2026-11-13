import { Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import type { ProductStatus, ProductStatusFilter } from "./products-page";

type ProductsToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: ProductStatusFilter;
  onStatusFilterChange: (value: ProductStatusFilter) => void;
  statusCounts: Record<ProductStatus, number>;
  totalCount: number;
};

const filters: { value: ProductStatusFilter; label: string }[] = [
  { value: "ALL", label: "Все товары" },
  { value: "DRAFT", label: "Черновики" },
  { value: "PUBLISHED", label: "Опубликованные" },
  { value: "ARCHIVED", label: "Архив" },
];

export function ProductsToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  statusCounts,
  totalCount,
}: ProductsToolbarProps) {
  return (
    <Card className="py-4">
      <CardContent className="space-y-4">
        <div className="relative w-full max-w-md">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />

          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Поиск по названию или артикулу..."
            aria-label="Поиск товаров"
            className="h-9 pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => {
            const count = filter.value === "ALL" ? totalCount : statusCounts[filter.value];

            const isActive = statusFilter === filter.value;

            return (
              <Button
                key={filter.value}
                type="button"
                size="sm"
                variant={isActive ? "default" : "outline"}
                aria-pressed={isActive}
                onClick={() => onStatusFilterChange(filter.value)}
              >
                {filter.label}

                <Badge variant="secondary" className="ml-1 h-5 min-w-5 justify-center px-1">
                  {count}
                </Badge>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
