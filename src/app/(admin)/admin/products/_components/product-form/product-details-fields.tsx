"use client";

import { useFormContext } from "react-hook-form";

import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

      <CardContent>
        <FieldGroup className="gap-5">
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="name">Название</FieldLabel>

            <Input
              id="name"
              autoComplete="off"
              aria-invalid={!!errors.name}
              {...register("name")}
            />

            {errors.name && <FieldError errors={[errors.name]} />}
          </Field>

          <Field data-invalid={!!errors.slug}>
            <FieldLabel htmlFor="slug">URL-адрес (slug)</FieldLabel>

            <Input
              id="slug"
              autoComplete="off"
              aria-invalid={!!errors.slug}
              {...register("slug")}
            />

            {errors.slug && <FieldError errors={[errors.slug]} />}
          </Field>

          <Field data-invalid={!!errors.sku}>
            <FieldLabel htmlFor="sku">Артикул (SKU)</FieldLabel>

            <Input id="sku" autoComplete="off" aria-invalid={!!errors.sku} {...register("sku")} />

            {errors.sku && <FieldError errors={[errors.sku]} />}
          </Field>

          <Field data-invalid={!!errors.description}>
            <FieldLabel htmlFor="description">Описание</FieldLabel>

            <Textarea
              id="description"
              rows={6}
              aria-invalid={!!errors.description}
              {...register("description")}
            />

            {errors.description && <FieldError errors={[errors.description]} />}
          </Field>

          <Field data-invalid={!!errors.sortOrder}>
            <FieldLabel htmlFor="sortOrder">Порядок сортировки</FieldLabel>

            <Input
              id="sortOrder"
              type="number"
              min={0}
              max={1_000_000}
              aria-invalid={!!errors.sortOrder}
              {...register("sortOrder", {
                valueAsNumber: true,
              })}
            />

            {errors.sortOrder && <FieldError errors={[errors.sortOrder]} />}
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
