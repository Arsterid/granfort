"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";

import {
  useCreateVehicleBrand,
  useDeleteVehicleBrand,
  useUpdateVehicleBrand,
  useVehicleBrand,
} from "../_hooks/use-vehicle-brands";

import { AdminEntityDeleteAction } from "../../../_components/admin-entity-delete-action";
import { AdminEntityForm, AdminEntityFormFrame } from "../../../_components/admin-entity-form";

type VehicleBrandFormProps = { mode: "create" } | { mode: "edit"; brandId: string };

const brandFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Введите название марки")
    .max(80, "Название не должно превышать 80 символов"),
  slug: z.string().trim().min(1, "Введите URL-адрес").max(160, "URL-адрес слишком длинный"),
});

type BrandFormValues = z.infer<typeof brandFormSchema>;

const emptyValues: BrandFormValues = {
  name: "",
  slug: "",
};

export function VehicleBrandForm(props: VehicleBrandFormProps) {
  const router = useRouter();

  const mode = props.mode;
  const brandId = mode === "edit" ? props.brandId : "";

  const brandQuery = useVehicleBrand(brandId);

  const createMutation = useCreateVehicleBrand();
  const updateMutation = useUpdateVehicleBrand();
  const deleteMutation = useDeleteVehicleBrand();

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: emptyValues,
  });

  const { reset } = form;

  const brand = brandQuery.data ?? null;

  useEffect(() => {
    if (!brand || form.formState.isDirty) return;

    reset({
      name: brand.name,
      slug: brand.slug,
    });
  }, [brand, form.formState.isDirty, reset]);

  const isPersisted = mode === "edit";

  const frameProps = {
    eyebrow: "GRANFORT / АВТОМОБИЛИ",
    title: isPersisted ? "Редактирование марки" : "Новая марка",
    description: "Управление информацией об автомобильной марке.",
    backHref: "/admin/vehicles/brands",
    backLabel: "Все марки",
  };

  const isLoading = isPersisted && brandQuery.isPending;
  const loadError =
    brandQuery.error instanceof Error ? brandQuery.error.message : "Не удалось загрузить марку.";

  const onSubmit: SubmitHandler<BrandFormValues> = async (values) => {
    try {
      if (mode === "edit") {
        await updateMutation.mutateAsync({
          id: brandId,
          input: values,
        });
      } else {
        await createMutation.mutateAsync(values);
      }

      toast.add({
        title: mode === "edit" ? "Марка обновлена" : "Марка создана",
        description: "Изменения успешно сохранены.",
        type: "success",
      });

      router.push("/admin/vehicles/brands");
      router.refresh();
    } catch (error) {
      toast.add({
        title: "Не удалось сохранить марку",
        description: error instanceof Error ? error.message : "Ошибка соединения с сервером.",
        type: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <AdminEntityFormFrame {...frameProps}>
        <Card>
          <CardContent className="text-muted-foreground py-8 text-sm">
            Загрузка марки...
          </CardContent>
        </Card>
      </AdminEntityFormFrame>
    );
  }

  if (isPersisted && (brandQuery.isError || !brand)) {
    return (
      <AdminEntityFormFrame {...frameProps}>
        <Card>
          <CardContent className="space-y-4 py-6">
            <p className="text-destructive text-sm">{loadError}</p>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/vehicles/brands")}
            >
              Вернуться к маркам
            </Button>
          </CardContent>
        </Card>
      </AdminEntityFormFrame>
    );
  }

  return (
    <AdminEntityForm
      {...frameProps}
      onSubmit={form.handleSubmit(onSubmit)}
      isSubmitting={
        form.formState.isSubmitting || createMutation.isPending || updateMutation.isPending
      }
      submitLabel={isPersisted ? "Сохранить" : "Создать марку"}
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
          <CardDescription>Название и уникальный URL-адрес марки.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="brandName">Название</Label>

            <Input
              id="brandName"
              autoComplete="off"
              placeholder="Например, Toyota"
              aria-invalid={Boolean(form.formState.errors.name)}
              {...form.register("name")}
            />

            {form.formState.errors.name?.message && (
              <p className="text-destructive text-sm">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="brandSlug">Slug</Label>

            <Input
              id="brandSlug"
              autoComplete="off"
              placeholder="toyota"
              aria-invalid={Boolean(form.formState.errors.slug)}
              {...form.register("slug")}
            />

            {form.formState.errors.slug?.message && (
              <p className="text-destructive text-sm">{form.formState.errors.slug.message}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </AdminEntityForm>
  );
}
