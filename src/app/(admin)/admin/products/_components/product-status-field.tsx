"use client";

import { Controller, useFormContext } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProductFormValues } from "./product-form/product-form-schema";

const statusItems = [
  { label: "Черновик", value: "DRAFT" },
  { label: "Опубликован", value: "PUBLISHED" },
  { label: "В архиве", value: "ARCHIVED" },
];

export function ProductStatusField() {
  const { control } = useFormContext<ProductFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Статус товара</CardTitle>
      </CardHeader>

      <CardContent>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select
              items={statusItems}
              value={field.value}
              onValueChange={(value) => {
                if (value) {
                  field.onChange(value);
                }
              }}
            >
              <SelectTrigger className="w-full sm:max-w-sm">
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
      </CardContent>
    </Card>
  );
}
