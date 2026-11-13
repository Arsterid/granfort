"use client";

import { LoaderCircle, Plus, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type { AdminProductDto } from "@/server/products/product.dto";

import { Button } from "@/components/ui/button";

import { ProductsTable } from "./products-table";
import { ProductsToolbar } from "./products-toolbar";

export type ProductStatus = AdminProductDto["status"];

export type ProductStatusFilter = "ALL" | ProductStatus;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getApiErrorMessage(payload: unknown): string | null {
  if (!isRecord(payload) || !isRecord(payload.error)) {
    return null;
  }

  return typeof payload.error.message === "string" ? payload.error.message : null;
}

export function ProductsPage() {
  const [products, setProducts] = useState<AdminProductDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductStatusFilter>("ALL");

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/v1/admin/products", {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        const payload: unknown = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            getApiErrorMessage(payload) ?? `Не удалось загрузить товары (HTTP ${response.status}).`
          );
        }

        if (!isRecord(payload) || !Array.isArray(payload.data)) {
          throw new Error("Сервер вернул некорректный формат данных.");
        }

        setProducts(payload.data as AdminProductDto[]);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setError(error instanceof Error ? error.message : "Произошла ошибка при загрузке товаров.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      controller.abort();
    };
  }, [reloadKey]);

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
    const normalizedSearch = search.trim().toLocaleLowerCase();

    return products.filter((product) => {
      const matchesStatus = statusFilter === "ALL" || product.status === statusFilter;

      const matchesSearch =
        normalizedSearch.length === 0 ||
        product.name.toLocaleLowerCase().includes(normalizedSearch) ||
        (product.sku ?? "").toLocaleLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [products, search, statusFilter]);

  const hasActiveFilters = search.trim().length > 0 || statusFilter !== "ALL";

  function clearFilters() {
    setSearch("");
    setStatusFilter("ALL");
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-brand text-xs font-bold tracking-[0.18em] uppercase">
            GRANFORT / ПРОИЗВОДСТВО
          </p>

          <h1 className="text-foreground mt-3 text-3xl font-extrabold tracking-tight">Товары</h1>

          <p className="text-muted-foreground mt-2 text-sm">
            Управление ассортиментом, характеристиками и публикациями.
          </p>

          <p className="text-muted-foreground mt-2 text-xs">Всего товаров: {products.length}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => setReloadKey((value) => value + 1)}
            disabled={isLoading}
          >
            <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            Обновить
          </Button>

          <Button nativeButton={false} render={<Link href="/admin/products/new" />} size="lg">
            <Plus className="size-4" />
            Добавить товар
          </Button>
        </div>
      </header>

      <ProductsToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusCounts={statusCounts}
        totalCount={products.length}
      />

      <ProductsTable
        products={filteredProducts}
        totalCount={products.length}
        isLoading={isLoading}
        error={error}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
        onRetry={() => setReloadKey((value) => value + 1)}
      />

      {isLoading && products.length > 0 && (
        <div className="text-muted-foreground flex items-center justify-center gap-2 text-xs">
          <LoaderCircle className="size-3.5 animate-spin" />
          Обновление списка...
        </div>
      )}
    </div>
  );
}
