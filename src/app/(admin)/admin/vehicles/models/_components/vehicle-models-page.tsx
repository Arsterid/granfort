"use client";

import { Plus, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import type { VehicleModelDto } from "@/server/vehicle-models/vehicle-model.dto";

import type { AdminDataTableColumn } from "../../../_components/admin-data-table";
import { AdminResourcePage } from "../../../_components/admin-resource-page";

import { useVehicleModels } from "../_hooks/use-vehicle-models";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getVariantsLabel(count: number) {
  const remainder10 = count % 10;
  const remainder100 = count % 100;

  if (remainder10 === 1 && remainder100 !== 11) {
    return `${count} модификация`;
  }

  if (remainder10 >= 2 && remainder10 <= 4 && (remainder100 < 12 || remainder100 > 14)) {
    return `${count} модификации`;
  }

  return `${count} модификаций`;
}

const columns: AdminDataTableColumn<VehicleModelDto>[] = [
  {
    id: "name",
    header: "Модель",
    width: "25%",
    cell: (model) => (
      <div className="min-w-0">
        <p className="truncate font-medium">{model.name}</p>
        <p className="text-muted-foreground truncate text-xs">{model.slug}</p>
      </div>
    ),
  },
  {
    id: "brand",
    header: "Марка",
    width: "20%",
    cell: (model) => model.brand.name,
  },
  {
    id: "variants",
    header: "Модификации",
    width: "20%",
    cell: (model) => getVariantsLabel(model.variantsCount),
  },
  {
    id: "updatedAt",
    header: "Обновлена",
    width: "20%",
    cell: (model) => formatDate(model.updatedAt),
  },
];

export function VehicleModelsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const { data: models = [], isPending, isFetching, error, refetch } = useVehicleModels();

  const filteredModels = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("ru");

    if (!query) return models;

    return models.filter(
      (model) =>
        model.name.toLocaleLowerCase("ru").includes(query) ||
        model.slug.toLocaleLowerCase("ru").includes(query) ||
        model.brand.name.toLocaleLowerCase("ru").includes(query) ||
        model.brand.slug.toLocaleLowerCase("ru").includes(query)
    );
  }, [models, search]);

  const errorMessage =
    error instanceof Error ? error.message : error ? "Не удалось загрузить модели." : null;

  return (
    <AdminResourcePage
      eyebrow="GRANFORT / АВТОМОБИЛИ"
      title="Модели"
      description="Управление моделями автомобилей и их принадлежностью к маркам."
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
            render={<Link href="/admin/vehicles/models/new" />}
            size="lg"
          >
            <Plus className="size-4" />
            Добавить модель
          </Button>
        </>
      }
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder="Поиск по модели, slug или марке..."
      tableTitle="Список моделей"
      tableDescription={`Показано ${filteredModels.length} из ${models.length}`}
      data={filteredModels}
      columns={columns}
      getRowId={(model) => model.id}
      getRowLabel={(model) => `Редактировать модель ${model.brand.name} ${model.name}`}
      onRowClick={(model) => router.push(`/admin/vehicles/models/${model.id}`)}
      isLoading={isPending}
      error={errorMessage}
      onRetry={() => void refetch()}
      emptyMessage={search ? "Модели не найдены." : "Моделей пока нет."}
    />
  );
}
