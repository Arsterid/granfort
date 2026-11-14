"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

import type { VehicleBrandDto } from "@/server/vehicle-brands/vehicle-brand.dto";
import {
  createVehicleBrandSchema,
  type CreateVehicleBrandInput,
} from "@/server/vehicle-brands/vehicle-brand.schema";

import {
  useCreateVehicleBrand,
  useDeleteVehicleBrand,
  useUpdateVehicleBrand,
  useVehicleBrand,
} from "../_hooks/use-vehicle-brands";

import { AdminEntityDeleteAction } from "../../../_components/admin-entity-delete-action";
import { AdminEntityEditor } from "../../../_components/admin-entity-editor";
import { AdminEntityForm } from "../../../_components/admin-entity-form";

import { useAdminFormHydration } from "../../../_hooks/use-admin-form-hydration";

type VehicleBrandFormProps = { mode: "create" } | { mode: "edit"; brandId: string };

function toFormValues(brand: VehicleBrandDto): CreateVehicleBrandInput {
  return {
    name: brand.name,
    slug: brand.slug,
  };
}

export function VehicleBrandForm(props: VehicleBrandFormProps) {
  const router = useRouter();

  const isEdit = props.mode === "edit";
  const brandId = isEdit ? props.brandId : "";

  const brandQuery = useVehicleBrand(brandId);
  const brand = brandQuery.data;

  const createMutation = useCreateVehicleBrand();
  const updateMutation = useUpdateVehicleBrand();
  const deleteMutation = useDeleteVehicleBrand();

  const form = useForm<CreateVehicleBrandInput>({
    resolver: zodResolver(createVehicleBrandSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  useAdminFormHydration(form, brand, toFormValues);

  const frameProps = {
    eyebrow: "GRANFORT / АВТОМОБИЛИ",
    title: isEdit ? "Редактирование марки" : "Новая марка",
    description: "Управление информацией об автомобильной марке.",
    backHref: "/admin/vehicles/brands",
    backLabel: "Все марки",
  };

  const onSubmit: SubmitHandler<CreateVehicleBrandInput> = async (values) => {
    try {
      let savedBrand: VehicleBrandDto;

      if (isEdit) {
        savedBrand = await updateMutation.mutateAsync({
          id: brandId,
          input: values,
        });
      } else {
        savedBrand = await createMutation.mutateAsync(values);
      }

      reset(toFormValues(savedBrand));

      toast.add({
        title: isEdit ? "Марка обновлена" : "Марка создана",
        description: "Изменения успешно сохранены.",
        type: "success",
      });

      router.push("/admin/vehicles/brands");
    } catch (error) {
      toast.add({
        title: "Не удалось сохранить марку",
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
      submitLabel={isEdit ? "Сохранить" : "Создать марку"}
      destructiveAction={
        brand ? (
          <AdminEntityDeleteAction
            onDelete={() => deleteMutation.mutateAsync(brand.id)}
            entityLabel={`марку «${brand.name}»`}
            returnHref="/admin/vehicles/brands"
            disabled={brand.modelsCount > 0 || deleteMutation.isPending}
            disabledReason="Сначала удалите связанные модели автомобилей."
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
            <Field data-invalid={!!form.formState.errors.name}>
              <FieldLabel htmlFor="brand-name">Название</FieldLabel>

              <Input
                id="brand-name"
                autoComplete="off"
                placeholder="Например, Toyota"
                aria-invalid={!!form.formState.errors.name}
                {...form.register("name")}
              />

              {form.formState.errors.name && <FieldError errors={[form.formState.errors.name]} />}
            </Field>

            <Field data-invalid={!!form.formState.errors.slug}>
              <FieldLabel htmlFor="brand-slug">Slug</FieldLabel>

              <Input
                id="brand-slug"
                autoComplete="off"
                placeholder="toyota"
                aria-invalid={!!form.formState.errors.slug}
                {...form.register("slug")}
              />

              {form.formState.errors.slug && <FieldError errors={[form.formState.errors.slug]} />}
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
      query={brandQuery}
      loadingMessage="Загрузка марки..."
      onRetry={() => void brandQuery.refetch()}
    >
      {editorContent}
    </AdminEntityEditor>
  );
}
