import { AlertCircle, Car, Image as ImageIcon, LoaderCircle, Package, Search } from "lucide-react";
import Link from "next/link";

import type { AdminProductDto } from "@/server/products/product.dto";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ProductStatusBadge } from "./product-status-badge";

type ProductsTableProps = {
  products: AdminProductDto[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onRetry: () => void;
};

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getVehicleLabel(count: number): string {
  const remainder10 = count % 10;
  const remainder100 = count % 100;

  if (remainder100 >= 11 && remainder100 <= 14) {
    return `${count} автомобилей`;
  }

  if (remainder10 === 1) {
    return `${count} автомобиль`;
  }

  if (remainder10 >= 2 && remainder10 <= 4) {
    return `${count} автомобиля`;
  }

  return `${count} автомобилей`;
}

export function ProductsTable({
  products,
  totalCount,
  isLoading,
  error,
  hasActiveFilters,
  onClearFilters,
  onRetry,
}: ProductsTableProps) {
  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <AlertCircle className="text-destructive size-9" />

          <div>
            <p className="text-foreground font-semibold">Не удалось загрузить товары</p>

            <p className="text-muted-foreground mt-1 text-sm">{error}</p>
          </div>

          <Button type="button" variant="outline" onClick={onRetry}>
            Повторить
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gap-0 py-0">
      <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
        <div>
          <h2 className="text-foreground font-semibold">Список товаров</h2>

          <p className="text-muted-foreground mt-0.5 text-xs">
            Показано: {products.length} из {totalCount}
          </p>
        </div>

        {isLoading && <LoaderCircle className="text-muted-foreground size-4 animate-spin" />}
      </div>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-[28%] px-4">Товар</TableHead>
              <TableHead>Артикул</TableHead>
              <TableHead>Совместимости</TableHead>
              <TableHead>Изображения</TableHead>
              <TableHead>Обновлён</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="w-[120px] pr-4 text-right">Карточка</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading && products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-40 text-center">
                  <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
                    <LoaderCircle className="size-4 animate-spin" />
                    Загружаем товары...
                  </div>
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-44 text-center">
                  <div className="flex flex-col items-center gap-2">
                    {totalCount === 0 ? (
                      <Package className="text-muted-foreground size-8" />
                    ) : (
                      <Search className="text-muted-foreground size-8" />
                    )}

                    <p className="text-foreground font-medium">
                      {totalCount === 0 ? "Товаров пока нет" : "Ничего не найдено"}
                    </p>

                    <p className="text-muted-foreground text-xs">
                      {totalCount === 0
                        ? "Создайте первый товар GRANFORT."
                        : "Измените поисковый запрос или фильтр."}
                    </p>

                    {totalCount === 0 ? (
                      <Button
                        nativeButton={false}
                        render={<Link href="/admin/products/new" />}
                        size="sm"
                        className="mt-2"
                      >
                        Добавить товар
                      </Button>
                    ) : hasActiveFilters ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={onClearFilters}
                      >
                        Сбросить фильтры
                      </Button>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="max-w-[280px] px-4 py-3">
                    <div className="min-w-0">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-foreground hover:text-brand font-semibold transition-colors"
                      >
                        {product.name}
                      </Link>

                      <p className="text-muted-foreground mt-1 truncate text-xs">{product.slug}</p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="text-muted-foreground font-mono text-xs">
                      {product.sku || "—"}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Car className="text-muted-foreground size-4 shrink-0" />
                      <span>{getVehicleLabel(product.compatibilities.length)}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <ImageIcon className="text-muted-foreground size-4 shrink-0" />
                      <span>{product.images.length}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <time dateTime={product.updatedAt} className="text-muted-foreground text-xs">
                      {formatDate(product.updatedAt)}
                    </time>
                  </TableCell>

                  <TableCell>
                    <ProductStatusBadge status={product.status} />
                  </TableCell>

                  <TableCell className="pr-4 text-right">
                    <Button
                      nativeButton={false}
                      render={<Link href={`/admin/products/${product.id}`} />}
                      variant="outline"
                      size="sm"
                    >
                      Открыть
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
