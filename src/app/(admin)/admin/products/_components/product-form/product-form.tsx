"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";

import { toast } from "@/components/ui/toast";

import type { AdminProductDto } from "@/server/products/product.dto";

import { productFormSchema, type ProductFormValues } from "./product-form-schema";

import { ProductCompatibilitiesField } from "./product-compatibilities-field";
import { ProductDetailsFields } from "./product-details-fields";
import { ProductImagesField } from "./product-images-field";
import { ProductStatusField } from "./product-status-field";

import { AdminEntityDeleteAction } from "../../../_components/admin-entity-delete-action";
import { AdminEntityEditor } from "../../../_components/admin-entity-editor";
import { AdminEntityForm } from "../../../_components/admin-entity-form";

import { useAdminFormHydration } from "../../../_hooks/use-admin-form-hydration";

import {
  useApplyProductImageChanges,
  useCreateProduct,
  useDeleteProduct,
  useProduct,
  useUpdateProduct,
} from "../../_hooks/use-products";

type ProductFormProps = { mode: "create" } | { mode: "edit"; productId: string };

function toFormValues(product: AdminProductDto): ProductFormValues {
  return {
    name: product.name,
    slug: product.slug,
    sku: product.sku ?? "",
    description: product.description ?? "",
    sortOrder: product.sortOrder,
    status: product.status,
    compatibilities: product.compatibilities.map((compatibility) => ({
      vehicleVariantId: compatibility.vehicleVariantId,
      fitmentNotes: compatibility.fitmentNotes ?? "",
    })),
  };
}

export function ProductForm(props: ProductFormProps) {
  const router = useRouter();

  const routeProductId = props.mode === "edit" ? props.productId : null;

  const [createdProduct, setCreatedProduct] = useState<AdminProductDto | null>(null);

  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);

  const targetProductId = routeProductId ?? createdProduct?.id ?? "";

  const productQuery = useProduct(targetProductId);
  const product = productQuery.data ?? createdProduct ?? undefined;

  const productId = routeProductId ?? product?.id ?? null;
  const isPersisted = productId !== null;

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const imageChangesMutation = useApplyProductImageChanges();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      sku: "",
      description: "",
      sortOrder: 0,
      status: "DRAFT",
      compatibilities: [],
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  useAdminFormHydration(form, product, toFormValues);

  const frameProps = {
    eyebrow: "GRANFORT / ПРОИЗВОДСТВО",
    title: isPersisted ? "Редактирование товара" : "Новый товар",
    description: "Управление информацией, изображениями и настройками товара.",
    backHref: "/admin/products",
    backLabel: "Все товары",
  };

  async function applyImageChanges(targetId: string): Promise<boolean> {
    const result = await imageChangesMutation.mutateAsync({
      productId: targetId,
      pendingFiles,
      deletedImageIds,
    });

    setPendingFiles(result.failedUploads);
    setDeletedImageIds(result.failedDeletions);

    if (result.failedUploads.length > 0) {
      toast.add({
        title: "Не все изображения загружены",
        description:
          `Товар сохранён. Не удалось добавить файлов: ` +
          `${result.failedUploads.length}. Повторите сохранение.`,
        type: "error",
      });

      return false;
    }

    if (result.failedDeletions.length > 0) {
      toast.add({
        title: "Не все изображения удалены",
        description:
          `Товар сохранён. Не удалось удалить изображений: ` +
          `${result.failedDeletions.length}. Повторите сохранение.`,
        type: "error",
      });

      return false;
    }

    return true;
  }

  const onSubmit: SubmitHandler<ProductFormValues> = async (values) => {
    const isUpdating = productId !== null;

    try {
      const commonPayload = {
        name: values.name,
        slug: values.slug,
        sku: values.sku.trim() || null,
        description: values.description.trim() || null,
        sortOrder: values.sortOrder,
      };

      const compatibilities = values.compatibilities.map(({ vehicleVariantId, fitmentNotes }) => ({
        vehicleVariantId,
        fitmentNotes: fitmentNotes.trim() || null,
      }));

      const savedProduct = isUpdating
        ? await updateMutation.mutateAsync({
            id: productId,
            input: {
              ...commonPayload,
              status: values.status,
              compatibilities,
            },
          })
        : await createMutation.mutateAsync({
            ...commonPayload,
            compatibilities,
          });

      if (!isUpdating) {
        setCreatedProduct(savedProduct);
      }

      reset(toFormValues(savedProduct));

      const imagesApplied = await applyImageChanges(savedProduct.id);

      if (!imagesApplied) return;

      toast.add({
        title: isUpdating ? "Товар обновлён" : "Товар создан",
        description: "Все изменения успешно сохранены.",
        type: "success",
      });

      router.push("/admin/products");
    } catch (error) {
      toast.add({
        title: "Не удалось сохранить товар",
        description: error instanceof Error ? error.message : "Ошибка соединения с сервером.",
        type: "error",
      });
    }
  };

  const isSaving =
    isSubmitting ||
    createMutation.isPending ||
    updateMutation.isPending ||
    imageChangesMutation.isPending;

  const editorContent = (
    <FormProvider {...form}>
      <AdminEntityForm
        {...frameProps}
        onSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSaving}
        submitLabel={isPersisted ? "Сохранить" : "Создать товар"}
        destructiveAction={
          product ? (
            <AdminEntityDeleteAction
              onDelete={() => deleteMutation.mutateAsync(product.id)}
              entityLabel={`товар «${product.name}»`}
              returnHref="/admin/products"
              disabled={deleteMutation.isPending}
            />
          ) : undefined
        }
      >
        {isPersisted && <ProductStatusField />}

        <ProductDetailsFields />

        <ProductCompatibilitiesField initialCompatibilities={product?.compatibilities ?? []} />

        <ProductImagesField
          images={product?.images ?? []}
          pendingFiles={pendingFiles}
          deletedImageIds={deletedImageIds}
          onPendingFilesChange={setPendingFiles}
          onDeletedImageIdsChange={setDeletedImageIds}
        />
      </AdminEntityForm>
    </FormProvider>
  );

  if (props.mode === "create") {
    return editorContent;
  }

  return (
    <AdminEntityEditor
      {...frameProps}
      query={productQuery}
      loadingMessage="Загрузка товара..."
      onRetry={() => void productQuery.refetch()}
    >
      {editorContent}
    </AdminEntityEditor>
  );
}
