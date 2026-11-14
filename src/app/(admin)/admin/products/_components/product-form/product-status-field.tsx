"use client";

import { Controller, useFormContext } from "react-hook-form";

import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductFormValues } from "./product-form-schema";

const statusItems = [
  { label: "Черновик", value: "DRAFT" },
  { label: "Опубликован", value: "PUBLISHED" },
  { label: "В архиве", value: "ARCHIVED" },
];

export function ProductStatusField() {
  const {
    control,
    formState: { errors },
  } = useFormContext<ProductFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Статус товара</CardTitle>
      </CardHeader>

      <CardContent>
        <FieldGroup>
          <Field data-invalid={!!errors.status}>
            <FieldLabel htmlFor="status">Статус</FieldLabel>

            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select
                  items={statusItems}
                  value={field.value}
                  onValueChange={(value) => {
                    if (value) field.onChange(value);
                  }}
                >
                  <SelectTrigger
                    id="status"
                    aria-invalid={!!errors.status}
                    className="w-full sm:max-w-sm"
                    onBlur={field.onBlur}
                  >
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>

                  <SelectContent>
                    {statusItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {errors.status && <FieldError errors={[errors.status]} />}
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
