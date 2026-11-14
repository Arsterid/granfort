"use client";

import { useEffect } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

type AdminFormInstance<TValues extends FieldValues> = Pick<
  UseFormReturn<TValues>,
  "reset" | "formState"
>;

export function useAdminFormHydration<TData, TValues extends FieldValues>(
  form: AdminFormInstance<TValues>,
  data: TData | undefined,
  mapToFormValues: (data: TData) => TValues
) {
  const {
    reset,
    formState: { isDirty },
  } = form;

  useEffect(() => {
    if (data === undefined || isDirty) return;

    reset(mapToFormValues(data));
  }, [data, isDirty, mapToFormValues, reset]);
}
