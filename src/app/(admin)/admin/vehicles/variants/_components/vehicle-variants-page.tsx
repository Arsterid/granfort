"use client";

import { Plus, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import type { VehicleVariantDto } from "@/server/vehicle-variants/vehicle-variant.dto";

import type { AdminDataTableColumn } from "../../../_components/admin-data-table";
import { AdminResourcePage } from "../../../_components/admin-resource-page";

import { useVehicleVariants } from "../_hooks/use-vehicle-variants";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatYearRange(yearFrom: number | null, yearTo: number | null) {
  if (yearFrom !== null && yearTo !== null) {
    return `${yearFrom}–${yearTo}`;
  }

  if (yearFrom !== null) return `С ${yearFrom}`;
  if (yearTo !== null) return `До ${yearTo}`;

  return "—";
}

const columns: AdminDataTableColumn<VehicleVariantDto>[] = [
  {
    id: "vehicle",
    header: "Автомобиль",
    width: "25%",
    cell: (variant) => (
      <div className="min-w-0">
        <p className="truncate font-medium">
          {variant.vehicleModel.brand.name} {variant.vehicleModel.name}
        </p>
        <p className="text-muted-foreground truncate text-xs">
          {variant.vehicleModel.brand.slug} / {variant.vehicleModel.slug}
        </p>
      </div>
    ),
  },
  {
    id: "generation",
    header: "Поколение",
    width: "17%",
    cell: (variant) => variant.generation || "—",
  },
  {
    id: "years",
    header: "Годы",
    width: "15%",
    cell: (variant) => formatYearRange(variant.yearFrom, variant.yearTo),
  },
  {
    id: "trim",
    header: "Комплектация",
    width: "18%",
    cell: (variant) => variant.trim || "—",
  },
  {
    id: "updatedAt",
    header: "Обновлена",
    width: "17%",
    cell: (variant) => formatDate(variant.updatedAt),
  },
];

export function VehicleVariantsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const { data: variants = [], isPending, isFetching, error, refetch } = useVehicleVariants();

  const filteredVariants = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("ru");

    if (!query) return variants;

    return variants.filter((variant) => {
      const searchableFields = [
        variant.vehicleModel.name,
        variant.vehicleModel.slug,
        variant.vehicleModel.brand.name,
        variant.vehicleModel.brand.slug,
        variant.generation ?? "",
        variant.trim ?? "",
        variant.notes ?? "",
        variant.yearFrom?.toString() ?? "",
        variant.yearTo?.toString() ?? "",
      ];

      return searchableFields.some((value) => value.toLocaleLowerCase("ru").includes(query));
    });
  }, [variants, search]);

  const errorMessage =
    error instanceof Error ? error.message : error ? "Не удалось загрузить модификации." : null;

  return (
    <AdminResourcePage
      eyebrow="GRANFORT / АВТОМОБИЛИ"
      title="Модификации"
      description="Управление поколениями, годами выпуска и комплектациями."
      headerActions={
        <>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => void refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
            Обновить
          </Button>

          <Button
            nativeButton={false}
            render={<Link href="/admin/vehicles/variants/new" />}
            size="lg"
          >
            <Plus className="size-4" />
            Добавить модификацию
          </Button>
        </>
      }
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder="Поиск по автомобилю, поколению или комплектации..."
      tableTitle="Список модификаций"
      tableDescription={`Показано ${filteredVariants.length} из ${variants.length}`}
      data={filteredVariants}
      columns={columns}
      getRowId={(variant) => variant.id}
      getRowLabel={(variant) =>
        `Редактировать модификацию ${variant.vehicleModel.brand.name} ${variant.vehicleModel.name}`
      }
      onRowClick={(variant) => router.push(`/admin/vehicles/variants/${variant.id}`)}
      isLoading={isPending}
      error={errorMessage}
      onRetry={() => void refetch()}
      emptyMessage={search ? "Модификации не найдены." : "Модификаций пока нет."}
    />
  );
}
