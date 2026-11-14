"use client";

import { Check, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Field, FieldLabel } from "@/components/ui/field";

import type { AdminProductDto } from "@/server/products/product.dto";
import type { VehicleVariantDto } from "@/server/vehicle-variants/vehicle-variant.dto";

import { useVehicleVariants } from "../../../vehicles/variants/_hooks/use-vehicle-variants";

import type { ProductFormValues } from "./product-form-schema";

type ProductCompatibility = ProductFormValues["compatibilities"][number];

type ProductCompatibilitiesFieldProps = {
  initialCompatibilities?: AdminProductDto["compatibilities"];
};

const EMPTY_COMPATIBILITIES: AdminProductDto["compatibilities"] = [];

type VariantDisplay = {
  title: string;
  details: string;
};

function formatYearRange(yearFrom: number | null, yearTo: number | null) {
  if (yearFrom !== null && yearTo !== null) {
    return `${yearFrom}–${yearTo}`;
  }

  if (yearFrom !== null) return `с ${yearFrom}`;
  if (yearTo !== null) return `до ${yearTo}`;

  return null;
}

function getVariantDisplay(variant: VehicleVariantDto): VariantDisplay {
  return {
    title: `${variant.vehicleModel.brand.name} ${variant.vehicleModel.name}`,
    details: [variant.generation, formatYearRange(variant.yearFrom, variant.yearTo), variant.trim]
      .filter((part): part is string => Boolean(part))
      .join(" · "),
  };
}

function getSavedVariantDisplay(
  compatibility: AdminProductDto["compatibilities"][number]
): VariantDisplay {
  return {
    title: `${compatibility.model.brand.name} ${compatibility.model.name}`,
    details: [
      compatibility.generation,
      formatYearRange(compatibility.yearFrom, compatibility.yearTo),
      compatibility.trim,
    ]
      .filter((part): part is string => Boolean(part))
      .join(" · "),
  };
}

function getVariantSearchLabel(variant: VehicleVariantDto) {
  const display = getVariantDisplay(variant);
  return [display.title, display.details].filter(Boolean).join(" ");
}

export function ProductCompatibilitiesField({
  initialCompatibilities = EMPTY_COMPATIBILITIES,
}: ProductCompatibilitiesFieldProps) {
  const { control, setValue } = useFormContext<ProductFormValues>();

  const selectedCompatibilities =
    useWatch({
      control,
      name: "compatibilities",
    }) ?? [];

  const variantsQuery = useVehicleVariants();

  const variants = useMemo(() => variantsQuery.data ?? [], [variantsQuery.data]);

  const variantsById = useMemo(
    () => new Map(variants.map((variant) => [variant.id, variant])),
    [variants]
  );

  const savedVariantsById = useMemo(
    () => new Map(initialCompatibilities.map((item) => [item.vehicleVariantId, item])),
    [initialCompatibilities]
  );

  const selectedIds = selectedCompatibilities.map((item) => item.vehicleVariantId);

  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const [inputValue, setInputValue] = useState("");

  function handleVariantSelect(variant: VehicleVariantDto | null) {
    if (!variant) return;

    const alreadySelected = selectedCompatibilities.some(
      (item) => item.vehicleVariantId === variant.id
    );

    if (!alreadySelected) {
      const nextCompatibilities: ProductCompatibility[] = [
        ...selectedCompatibilities,
        {
          vehicleVariantId: variant.id,
          fitmentNotes: "",
        },
      ];

      setValue("compatibilities", nextCompatibilities, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }

    setInputValue("");
  }

  function removeCompatibility(vehicleVariantId: string) {
    setValue(
      "compatibilities",
      selectedCompatibilities.filter((item) => item.vehicleVariantId !== vehicleVariantId),
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      }
    );
  }

  function getSelectedDisplay(vehicleVariantId: string): VariantDisplay {
    const variant = variantsById.get(vehicleVariantId);

    if (variant) {
      return getVariantDisplay(variant);
    }

    const saved = savedVariantsById.get(vehicleVariantId);

    if (saved) {
      return getSavedVariantDisplay(saved);
    }

    return {
      title: "Модификация автомобиля",
      details: "",
    };
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Совместимость с автомобилями</CardTitle>
        <CardDescription>Найдите автомобиль и добавьте подходящую модификацию.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <Field>
          <FieldLabel htmlFor="product-compatibilities">Поиск автомобиля</FieldLabel>

          <Combobox
            items={variants}
            value={null}
            inputValue={inputValue}
            onInputValueChange={setInputValue}
            onValueChange={handleVariantSelect}
            itemToStringLabel={getVariantSearchLabel}
          >
            <ComboboxInput
              id="product-compatibilities"
              placeholder="Например, BMW 3 Series..."
              showTrigger
              aria-label="Поиск автомобиля"
            />

            <ComboboxContent>
              <ComboboxEmpty>Автомобиль не найден.</ComboboxEmpty>

              <ComboboxList>
                {variants.map((variant) => {
                  const display = getVariantDisplay(variant);
                  const isSelected = selectedIdSet.has(variant.id);

                  return (
                    <ComboboxItem
                      key={variant.id}
                      value={variant}
                      disabled={isSelected}
                      className="py-2.5"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-medium">{display.title}</div>

                        {display.details && (
                          <div className="text-muted-foreground mt-0.5 text-xs">
                            {display.details}
                          </div>
                        )}
                      </div>

                      {isSelected ? (
                        <span className="text-muted-foreground flex items-center gap-1 text-xs">
                          <Check className="size-3.5" />
                          Добавлен
                        </span>
                      ) : (
                        <Plus className="text-muted-foreground size-4" />
                      )}
                    </ComboboxItem>
                  );
                })}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Field>

        {variantsQuery.isPending && (
          <p className="text-muted-foreground text-sm">Загружаем автомобили...</p>
        )}

        {variantsQuery.isError && (
          <div className="flex items-center gap-3">
            <p className="text-destructive text-sm">Не удалось загрузить автомобили.</p>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void variantsQuery.refetch()}
            >
              Повторить
            </Button>
          </div>
        )}

        {!variantsQuery.isPending && !variantsQuery.isError && variants.length === 0 && (
          <p className="text-muted-foreground text-sm">
            Список модификаций пуст.{" "}
            <Link
              href="/admin/vehicles/variants/new"
              className="hover:text-foreground underline underline-offset-4"
            >
              Добавить модификацию
            </Link>
          </p>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium">Добавленные автомобили</p>

            <span className="text-muted-foreground text-xs">{selectedCompatibilities.length}</span>
          </div>

          {selectedCompatibilities.length > 0 ? (
            <div className="divide-y rounded-lg border">
              {selectedCompatibilities.map((compatibility) => {
                const display = getSelectedDisplay(compatibility.vehicleVariantId);

                return (
                  <div
                    key={compatibility.vehicleVariantId}
                    className="flex items-center gap-3 px-3 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{display.title}</p>

                      {display.details && (
                        <p className="text-muted-foreground mt-0.5 text-xs">{display.details}</p>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive size-8 shrink-0"
                      onClick={() => removeCompatibility(compatibility.vehicleVariantId)}
                      aria-label={`Удалить ${display.title}`}
                      title="Удалить автомобиль"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed px-4 py-6 text-center">
              <p className="text-muted-foreground text-sm">Пока ни один автомобиль не добавлен.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
