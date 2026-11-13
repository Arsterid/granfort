"use client";

import { Plus, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import type { AdminProductDto } from "@/server/products/product.dto";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { AdminDataTableColumn } from "../../_components/admin-data-table";
import { AdminResourcePage } from "../../_components/admin-resource-page";

import { useAdminProducts } from "../_hooks/use-products";
import { ProductStatusBadge } from "./product-status-badge";

export type ProductStatus = AdminProductDto["status"];
export type ProductStatusFilter = "ALL" | ProductStatus;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

const columns: AdminDataTableColumn<AdminProductDto>[] = [
  {
    id: "product",
    header: "Товар",
    width: "26%",
    cell: (product) => (
      <div className="min-w-0">
        <p className="truncate font-medium">{product.name}</p>
        <p className="text-muted-foreground truncate text-xs">{product.slug}</p>
      </div>
    ),
  },
  {
    id: "sku",
    header: "SKU",
    width: "12%",
    cell: (product) => product.sku || "—",
  },
  {
    id: "compatibilities",
    header: "Совместимости",
    width: "15%",
    cell: (product) => product.compatibilities.length,
  },
  {
    id: "images",
    header: "Изображения",
    width: "12%",
    cell: (product) => product.images.length,
  },
  {
    id: "updatedAt",
    header: "Обновлён",
    width: "17%",
    cell: (product) => formatDate(product.updatedAt),
  },
  {
    id: "status",
    header: "Статус",
    width: "18%",
    cell: (product) => <ProductStatusBadge status={product.status} />,
  },
];

const statusFilters: {
  value: ProductStatusFilter;
  label: string;
}[] = [
  { value: "ALL", label: "Все товары" },
  { value: "DRAFT", label: "Черновики" },
  { value: "PUBLISHED", label: "Опубликованные" },
  { value: "ARCHIVED", label: "Архив" },
];

export function ProductsPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductStatusFilter>("ALL");

  const { data: products = [], isPending, isFetching, error, refetch } = useAdminProducts();

  const statusCounts = useMemo<Record<ProductStatus, number>>(() => {
    const counts: Record<ProductStatus, number> = {
      DRAFT: 0,
      PUBLISHED: 0,
      ARCHIVED: 0,
    };

    for (const product of products) {
      counts[product.status] += 1;
    }

    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("ru");

    return products.filter((product) => {
      const matchesStatus = statusFilter === "ALL" || product.status === statusFilter;

      const matchesSearch =
        normalizedSearch.length === 0 ||
        product.name.toLocaleLowerCase("ru").includes(normalizedSearch) ||
        (product.sku ?? "").toLocaleLowerCase("ru").includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [products, search, statusFilter]);

  const hasActiveFilters = search.trim().length > 0 || statusFilter !== "ALL";

  function reloadProducts() {
    void refetch();
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("ALL");
  }

  const errorMessage =
    error instanceof Error ? error.message : error ? "Не удалось загрузить товары." : null;

  return (
    <AdminResourcePage
      eyebrow="GRANFORT / ПРОИЗВОДСТВО"
      title="Товары"
      description="Управление ассортиментом, характеристиками и публикациями."
      headerActions={
        <>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={reloadProducts}
            disabled={isFetching}
          >
            <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
            Обновить
          </Button>

          <Button nativeButton={false} render={<Link href="/admin/products/new" />} size="lg">
            <Plus className="size-4" />
            Добавить товар
          </Button>
        </>
      }
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder="Поиск по названию или артикулу..."
      filters={statusFilters.map((filter) => {
        const count = filter.value === "ALL" ? products.length : statusCounts[filter.value];

        const isActive = statusFilter === filter.value;

        return (
          <Button
            key={filter.value}
            type="button"
            size="sm"
            variant={isActive ? "default" : "outline"}
            aria-pressed={isActive}
            onClick={() => setStatusFilter(filter.value)}
          >
            {filter.label}

            <Badge variant="secondary" className="ml-1 h-5 min-w-5 justify-center px-1">
              {count}
            </Badge>
          </Button>
        );
      })}
      tableTitle="Список товаров"
      tableDescription={`Показано ${filteredProducts.length} из ${products.length}`}
      data={filteredProducts}
      columns={columns}
      getRowId={(product) => product.id}
      getRowLabel={(product) => `Открыть товар ${product.name}`}
      onRowClick={(product) => router.push(`/admin/products/${product.id}`)}
      isLoading={isPending}
      error={errorMessage}
      onRetry={reloadProducts}
      emptyMessage={
        hasActiveFilters ? "По заданным условиям товары не найдены." : "Товаров пока нет."
      }
      emptyAction={
        hasActiveFilters ? (
          <Button type="button" variant="outline" size="sm" onClick={clearFilters}>
            Сбросить фильтры
          </Button>
        ) : undefined
      }
    />
  );
}
