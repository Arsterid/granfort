"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";

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
import { toast } from "@/components/ui/toast";

import type { VehicleModelDto } from "@/server/vehicle-models/vehicle-model.dto";
import {
  createVehicleModelSchema,
  type CreateVehicleModelInput,
} from "@/server/vehicle-models/vehicle-model.schema";

import { useVehicleBrands } from "../../brands/_hooks/use-vehicle-brands";
import {
  useCreateVehicleModel,
  useDeleteVehicleModel,
  useUpdateVehicleModel,
  useVehicleModel,
} from "../_hooks/use-vehicle-models";

import { AdminEntityDeleteAction } from "../../../_components/admin-entity-delete-action";
import { AdminEntityEditor } from "../../../_components/admin-entity-editor";
import { AdminEntityForm } from "../../../_components/admin-entity-form";
import { useAdminFormHydration } from "../../../_hooks/use-admin-form-hydration";

type VehicleModelFormProps = { mode: "create" } | { mode: "edit"; modelId: string };

function toFormValues(model: VehicleModelDto): CreateVehicleModelInput {
  return {
    brandId: model.brandId,
    name: model.name,
    slug: model.slug,
  };
}

export function VehicleModelForm(props: VehicleModelFormProps) {
  const router = useRouter();
  const isEdit = props.mode === "edit";
  const modelId = isEdit ? props.modelId : "";

  const modelQuery = useVehicleModel(modelId);
  const model = modelQuery.data;

  const brandsQuery = useVehicleBrands();
  const brands = brandsQuery.data ?? [];

  const createMutation = useCreateVehicleModel();
  const updateMutation = useUpdateVehicleModel();
  const deleteMutation = useDeleteVehicleModel();

  const form = useForm<CreateVehicleModelInput>({
    resolver: zodResolver(createVehicleModelSchema),
    defaultValues: {
      brandId: "",
      name: "",
      slug: "",
    },
  });

  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  useAdminFormHydration(form, model, toFormValues);

  const frameProps = {
    eyebrow: "GRANFORT / АВТОМОБИЛИ",
    title: isEdit ? "Редактирование модели" : "Новая модель",
    description: "Управление моделью автомобиля.",
    backHref: "/admin/vehicles/models",
    backLabel: "Все модели",
  };

  const onSubmit: SubmitHandler<CreateVehicleModelInput> = async (values) => {
    try {
      let savedModel: VehicleModelDto;

      if (isEdit) {
        savedModel = await updateMutation.mutateAsync({
          id: modelId,
          input: {
            name: values.name,
            slug: values.slug,
          },
        });
      } else {
        savedModel = await createMutation.mutateAsync(values);
      }

      reset(toFormValues(savedModel));

      toast.add({
        title: isEdit ? "Модель обновлена" : "Модель создана",
        description: "Изменения успешно сохранены.",
        type: "success",
      });

      router.push("/admin/vehicles/models");
    } catch (error) {
      toast.add({
        title: "Не удалось сохранить модель",
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
      submitLabel={isEdit ? "Сохранить" : "Создать модель"}
      destructiveAction={
        model ? (
          <AdminEntityDeleteAction
            onDelete={() => deleteMutation.mutateAsync(model.id)}
            entityLabel={`модель «${model.brand.name} ${model.name}»`}
            returnHref="/admin/vehicles/models"
            disabled={model.variantsCount > 0 || deleteMutation.isPending}
            disabledReason="Сначала удалите связанные модификации."
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
              <>
                <Field>
                  <FieldLabel>Марка</FieldLabel>
                  <Input value={model?.brand.name ?? ""} disabled />
                  <input type="hidden" {...register("brandId")} />
                </Field>
              </>
            ) : (
              <Controller
                control={control}
                name="brandId"
                render={({ field }) => (
                  <Field data-invalid={!!errors.brandId}>
                    <FieldLabel htmlFor="model-brand">Марка</FieldLabel>

                    <Select
                      items={brands.map((brand) => ({
                        label: brand.name,
                        value: brand.id,
                      }))}
                      value={field.value || null}
                      onValueChange={(value) => field.onChange(value ?? "")}
                      disabled={brandsQuery.isPending || brands.length === 0}
                    >
                      <SelectTrigger
                        id="model-brand"
                        className="w-full"
                        aria-invalid={!!errors.brandId}
                        onBlur={field.onBlur}
                        ref={field.ref}
                      >
                        <SelectValue placeholder="Выберите марку" />
                      </SelectTrigger>

                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {errors.brandId && <FieldError errors={[errors.brandId]} />}

                    {!brandsQuery.isPending && !brandsQuery.isError && brands.length === 0 && (
                      <p className="text-muted-foreground text-sm">
                        Сначала необходимо создать марку.
                      </p>
                    )}
                  </Field>
                )}
              />
            )}

            {!isEdit && brandsQuery.isError && !brandsQuery.data && (
              <div className="space-y-2">
                <p role="alert" className="text-destructive text-sm">
                  Не удалось загрузить марки.
                </p>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void brandsQuery.refetch()}
                >
                  Повторить
                </Button>
              </div>
            )}

            {!isEdit && brands.length === 0 && !brandsQuery.isPending && (
              <Button
                type="button"
                variant="outline"
                nativeButton={false}
                render={<Link href="/admin/vehicles/brands/new" />}
              >
                Добавить марку
              </Button>
            )}

            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="model-name">Название</FieldLabel>

              <Input
                id="model-name"
                autoComplete="off"
                placeholder="Например, Haval H3"
                aria-invalid={!!errors.name}
                {...register("name")}
              />

              {errors.name && <FieldError errors={[errors.name]} />}
            </Field>

            <Field data-invalid={!!errors.slug}>
              <FieldLabel htmlFor="model-slug">Slug</FieldLabel>

              <Input
                id="model-slug"
                autoComplete="off"
                placeholder="haval-h3"
                aria-invalid={!!errors.slug}
                {...register("slug")}
              />

              {errors.slug && <FieldError errors={[errors.slug]} />}
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
      query={modelQuery}
      loadingMessage="Загрузка модели..."
      onRetry={() => void modelQuery.refetch()}
    >
      {editorContent}
    </AdminEntityEditor>
  );
}
