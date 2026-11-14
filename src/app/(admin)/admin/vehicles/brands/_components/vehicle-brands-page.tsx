"use client";

import { Plus, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

import type { VehicleBrandDto } from "@/server/vehicle-brands/vehicle-brand.dto";

import type { AdminDataTableColumn } from "../../../_components/admin-data-table";
import { AdminResourcePage } from "../../../_components/admin-resource-page";

import { useVehicleBrands } from "../_hooks/use-vehicle-brands";

function getModelsLabel(count: number) {
  const remainder10 = count % 10;
  const remainder100 = count % 100;

  if (remainder10 === 1 && remainder100 !== 11) {
    return `${count} модель`;
  }

  if (remainder10 >= 2 && remainder10 <= 4 && (remainder100 < 12 || remainder100 > 14)) {
    return `${count} модели`;
  }

  return `${count} моделей`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

const columns: AdminDataTableColumn<VehicleBrandDto>[] = [
  {
    id: "name",
    header: "Марка",
    width: "28%",
    cell: (brand) => <span className="font-medium">{brand.name}</span>,
  },
  {
    id: "slug",
    header: "Slug",
    width: "27%",
    cell: (brand) => brand.slug,
  },
  {
    id: "models",
    header: "Модели",
    width: "15%",
    cell: (brand) => getModelsLabel(brand.modelsCount),
  },
  {
    id: "updatedAt",
    header: "Обновлён",
    width: "20%",
    cell: (brand) => formatDate(brand.updatedAt),
  },
];

export function VehicleBrandsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const { data: brands = [], isPending, isFetching, error, refetch } = useVehicleBrands();

  const filteredBrands = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("ru");

    if (!query) return brands;

    return brands.filter(
      (brand) =>
        brand.name.toLocaleLowerCase("ru").includes(query) ||
        brand.slug.toLocaleLowerCase("ru").includes(query)
    );
  }, [brands, search]);

  function reloadBrands() {
    void refetch();
  }

  const errorMessage =
    error instanceof Error ? error.message : error ? "Не удалось загрузить марки." : null;

  return (
    <AdminResourcePage
      eyebrow="GRANFORT / АВТОМОБИЛИ"
      title="Марки"
      description="Управление автомобильными марками."
      headerActions={
        <>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={reloadBrands}
            disabled={isFetching}
          >
            <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
            Обновить
          </Button>

          <Button
            nativeButton={false}
            render={<Link href="/admin/vehicles/brands/new" />}
            size="lg"
          >
            <Plus className="size-4" />
            Добавить марку
          </Button>
        </>
      }
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder="Поиск по марке или slug..."
      tableTitle="Список марок"
      tableDescription={`Показано ${filteredBrands.length} из ${brands.length}`}
      data={filteredBrands}
      columns={columns}
      getRowId={(brand) => brand.id}
      getRowLabel={(brand) => `Редактировать марку ${brand.name}`}
      onRowClick={(brand) => router.push(`/admin/vehicles/brands/${brand.id}`)}
      isLoading={isPending}
      error={errorMessage}
      onRetry={reloadBrands}
      emptyMessage={search ? "Марки не найдены." : "Марок пока нет."}
    />
  );
}
