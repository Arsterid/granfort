"use client";

import { useFormContext } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { ProductFormValues } from "./product-form-schema";

export function ProductDetailsFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProductFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Основная информация</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">Название</Label>

          <Input
            id="name"
            autoComplete="off"
            aria-invalid={Boolean(errors.name)}
            {...register("name")}
          />

          {errors.name?.message && (
            <p className="text-destructive text-sm">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">URL-адрес (slug)</Label>

          <Input
            id="slug"
            autoComplete="off"
            aria-invalid={Boolean(errors.slug)}
            {...register("slug")}
          />

          {errors.slug?.message && (
            <p className="text-destructive text-sm">{errors.slug.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sku">Артикул (SKU)</Label>

          <Input
            id="sku"
            autoComplete="off"
            aria-invalid={Boolean(errors.sku)}
            {...register("sku")}
          />

          {errors.sku?.message && <p className="text-destructive text-sm">{errors.sku.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Описание</Label>

          <Textarea
            id="description"
            rows={6}
            aria-invalid={Boolean(errors.description)}
            {...register("description")}
          />

          {errors.description?.message && (
            <p className="text-destructive text-sm">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sortOrder">Порядок сортировки</Label>

          <Input
            id="sortOrder"
            type="number"
            min={0}
            max={1_000_000}
            aria-invalid={Boolean(errors.sortOrder)}
            {...register("sortOrder", {
              valueAsNumber: true,
            })}
          />

          {errors.sortOrder?.message && (
            <p className="text-destructive text-sm">{errors.sortOrder.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
