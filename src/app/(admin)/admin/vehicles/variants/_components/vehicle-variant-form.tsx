"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";

import type { VehicleVariantDto } from "@/server/vehicle-variants/vehicle-variant.dto";
import type {
  CreateVehicleVariantInput,
  UpdateVehicleVariantInput,
} from "@/server/vehicle-variants/vehicle-variant.schema";

import { useVehicleModels } from "../../models/_hooks/use-vehicle-models";

import {
  useCreateVehicleVariant,
  useDeleteVehicleVariant,
  useUpdateVehicleVariant,
  useVehicleVariant,
} from "../_hooks/use-vehicle-variants";

import { AdminEntityDeleteAction } from "../../../_components/admin-entity-delete-action";
import { AdminEntityEditor } from "../../../_components/admin-entity-editor";
import { AdminEntityForm } from "../../../_components/admin-entity-form";
import { useAdminFormHydration } from "../../../_hooks/use-admin-form-hydration";

const yearFieldSchema = z
  .string()
  .trim()
  .refine((value) => {
    if (!value) return true;

    const year = Number(value);

    return Number.isInteger(year) && year >= 1886 && year <= 2100;
  }, "Введите целый год от 1886 до 2100");

const vehicleVariantFormSchema = z
  .object({
    vehicleModelId: z.uuid(),
    generation: z.string().trim().max(100),
    yearFrom: yearFieldSchema,
    yearTo: yearFieldSchema,
    trim: z.string().trim().max(120),
    notes: z.string().trim().max(5000),
  })
  .superRefine((values, context) => {
    if (values.yearFrom && values.yearTo && Number(values.yearFrom) > Number(values.yearTo)) {
      context.addIssue({
        code: "custom",
        path: ["yearTo"],
        message: "Год окончания не может быть раньше года начала",
      });
    }
  });

type VehicleVariantFormValues = z.infer<typeof vehicleVariantFormSchema>;

type VehicleVariantFormProps = { mode: "create" } | { mode: "edit"; variantId: string };

function toFormValues(variant: VehicleVariantDto): VehicleVariantFormValues {
  return {
    vehicleModelId: variant.vehicleModelId,
    generation: variant.generation ?? "",
    yearFrom: variant.yearFrom?.toString() ?? "",
    yearTo: variant.yearTo?.toString() ?? "",
    trim: variant.trim ?? "",
    notes: variant.notes ?? "",
  };
}

type VehicleVariantPayload = Pick<
  CreateVehicleVariantInput,
  "generation" | "yearFrom" | "yearTo" | "trim" | "notes"
>;

function toPayload(values: VehicleVariantFormValues): VehicleVariantPayload {
  return {
    generation: values.generation || null,
    yearFrom: values.yearFrom ? Number(values.yearFrom) : null,
    yearTo: values.yearTo ? Number(values.yearTo) : null,
    trim: values.trim || null,
    notes: values.notes || null,
  };
}

export function VehicleVariantForm(props: VehicleVariantFormProps) {
  const router = useRouter();

  const isEdit = props.mode === "edit";
  const variantId = isEdit ? props.variantId : "";

  const variantQuery = useVehicleVariant(variantId);
  const variant = variantQuery.data;

  const modelsQuery = useVehicleModels(undefined, !isEdit);
  const models = modelsQuery.data ?? [];

  const createMutation = useCreateVehicleVariant();
  const updateMutation = useUpdateVehicleVariant();
  const deleteMutation = useDeleteVehicleVariant();

  const form = useForm<VehicleVariantFormValues>({
    resolver: zodResolver(vehicleVariantFormSchema),
    defaultValues: {
      vehicleModelId: "",
      generation: "",
      yearFrom: "",
      yearTo: "",
      trim: "",
      notes: "",
    },
  });

  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  useAdminFormHydration(form, variant, toFormValues);

  const frameProps = {
    eyebrow: "GRANFORT / АВТОМОБИЛИ",
    title: isEdit ? "Редактирование модификации" : "Новая модификация",
    description: "Управление поколением, годами выпуска и комплектацией.",
    backHref: "/admin/vehicles/variants",
    backLabel: "Все модификации",
  };

  const onSubmit: SubmitHandler<VehicleVariantFormValues> = async (values) => {
    try {
      const commonPayload = toPayload(values);

      let savedVariant: VehicleVariantDto;

      if (isEdit) {
        savedVariant = await updateMutation.mutateAsync({
          id: variantId,
          input: commonPayload satisfies UpdateVehicleVariantInput,
        });
      } else {
        savedVariant = await createMutation.mutateAsync({
          vehicleModelId: values.vehicleModelId,
          ...commonPayload,
        } satisfies CreateVehicleVariantInput);
      }

      reset(toFormValues(savedVariant));

      toast.add({
        title: isEdit ? "Модификация обновлена" : "Модификация создана",
        description: "Изменения успешно сохранены.",
        type: "success",
      });

      router.push("/admin/vehicles/variants");
    } catch (error) {
      toast.add({
        title: "Не удалось сохранить модификацию",
        description: error instanceof Error ? error.message : "Ошибка соединения с сервером.",
        type: "error",
      });
    }
  };

  const isSaving = isSubmitting || createMutation.isPending || updateMutation.isPending;

  const editorContent = (
    <AdminEntityForm
      {...frameProps}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSaving}
      submitLabel={isEdit ? "Сохранить" : "Создать модификацию"}
      destructiveAction={
        variant ? (
          <AdminEntityDeleteAction
            onDelete={() => deleteMutation.mutateAsync(variant.id)}
            entityLabel={`модификацию ${variant.vehicleModel.brand.name} ${variant.vehicleModel.name}`}
            returnHref="/admin/vehicles/variants"
            disabled={deleteMutation.isPending}
          />
        ) : undefined
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Основная информация</CardTitle>
        </CardHeader>

        <CardContent>
          <FieldGroup className="gap-5">
            {isEdit ? (
              <Field>
                <FieldLabel htmlFor="variant-model">Модель автомобиля</FieldLabel>

                <Input
                  id="variant-model"
                  value={
                    variant ? `${variant.vehicleModel.brand.name} ${variant.vehicleModel.name}` : ""
                  }
                  disabled
                />

                <input type="hidden" {...register("vehicleModelId")} />
              </Field>
            ) : (
              <Controller
                control={control}
                name="vehicleModelId"
                render={({ field }) => (
                  <Field data-invalid={!!errors.vehicleModelId}>
                    <FieldLabel htmlFor="variant-model">Модель автомобиля</FieldLabel>

                    <Select
                      items={models.map((model) => ({
                        label: `${model.brand.name} ${model.name}`,
                        value: model.id,
                      }))}
                      value={field.value || null}
                      onValueChange={(value) => field.onChange(value ?? "")}
                      disabled={modelsQuery.isPending || models.length === 0}
                    >
                      <SelectTrigger
                        id="variant-model"
                        className="w-full"
                        aria-invalid={!!errors.vehicleModelId}
                        onBlur={field.onBlur}
                      >
                        <SelectValue placeholder="Выберите модель" />
                      </SelectTrigger>

                      <SelectContent>
                        {models.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.brand.name} {model.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {errors.vehicleModelId && <FieldError errors={[errors.vehicleModelId]} />}
                  </Field>
                )}
              />
            )}

            {!isEdit && modelsQuery.isError && models.length === 0 && (
              <div className="space-y-2">
                <p role="alert" className="text-destructive text-sm">
                  Не удалось загрузить модели автомобилей.
                </p>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void modelsQuery.refetch()}
                >
                  Повторить
                </Button>
              </div>
            )}

            {!isEdit && modelsQuery.isSuccess && models.length === 0 && (
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">
                  Сначала необходимо создать модель автомобиля.
                </p>

                <Button
                  type="button"
                  variant="outline"
                  nativeButton={false}
                  render={<Link href="/admin/vehicles/models/new" />}
                >
                  Добавить модель
                </Button>
              </div>
            )}

            <Field data-invalid={!!errors.generation}>
              <FieldLabel htmlFor="variant-generation">Поколение</FieldLabel>

              <Input
                id="variant-generation"
                placeholder="Например, H3"
                aria-invalid={!!errors.generation}
                {...register("generation")}
              />

              {errors.generation && <FieldError errors={[errors.generation]} />}
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={!!errors.yearFrom}>
                <FieldLabel htmlFor="variant-year-from">Год выпуска от</FieldLabel>

                <Input
                  id="variant-year-from"
                  type="number"
                  min={1886}
                  max={2100}
                  step={1}
                  placeholder="2020"
                  aria-invalid={!!errors.yearFrom}
                  {...register("yearFrom")}
                />

                {errors.yearFrom && <FieldError errors={[errors.yearFrom]} />}
              </Field>

              <Field data-invalid={!!errors.yearTo}>
                <FieldLabel htmlFor="variant-year-to">Год выпуска до</FieldLabel>

                <Input
                  id="variant-year-to"
                  type="number"
                  min={1886}
                  max={2100}
                  step={1}
                  placeholder="2025"
                  aria-invalid={!!errors.yearTo}
                  {...register("yearTo")}
                />

                {errors.yearTo && <FieldError errors={[errors.yearTo]} />}
              </Field>
            </div>

            <Field data-invalid={!!errors.trim}>
              <FieldLabel htmlFor="variant-trim">Комплектация</FieldLabel>

              <Input
                id="variant-trim"
                placeholder="Например, Premium"
                aria-invalid={!!errors.trim}
                {...register("trim")}
              />

              {errors.trim && <FieldError errors={[errors.trim]} />}
            </Field>

            <Field data-invalid={!!errors.notes}>
              <FieldLabel htmlFor="variant-notes">Примечания</FieldLabel>

              <Textarea
                id="variant-notes"
                rows={5}
                placeholder="Дополнительная информация..."
                aria-invalid={!!errors.notes}
                {...register("notes")}
              />

              {errors.notes && <FieldError errors={[errors.notes]} />}
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </AdminEntityForm>
  );

  if (!isEdit) {
    return editorContent;
  }

  return (
    <AdminEntityEditor
      {...frameProps}
      query={variantQuery}
      loadingMessage="Загрузка модификации..."
      onRetry={() => void variantQuery.refetch()}
    >
      {editorContent}
    </AdminEntityEditor>
  );
}
