"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

import { productFormSchema, type ProductFormValues } from "./product-form-schema";

import { ProductDeleteAction } from "./product-delete-action";
import { ProductDetailsFields } from "./product-details-fields";
import { ProductImagesField } from "./product-images-field";
import { ProductStatusField } from "./product-status-field";

import type { ProductEditorData } from "./product-types";

type ProductFormProps =
  | {
      mode: "create";
    }
  | {
      mode: "edit";
      productId: string;
    };

type ApiResponse = {
  data?: ProductEditorData;
  error?: {
    message?: string;
  };
};

type LoadState = "loading" | "ready" | "error";

const emptyValues: ProductFormValues = {
  name: "",
  slug: "",
  sku: "",
  description: "",
  sortOrder: 0,
  status: "DRAFT",
};

function getApiErrorMessage(status: number) {
  switch (status) {
    case 400:
    case 422:
      return "Проверьте правильность заполнения полей.";
    case 401:
    case 403:
      return "Недостаточно прав для выполнения операции.";
    case 404:
      return "Товар не найден.";
    case 409:
      return "Не удалось сохранить изменения. Проверьте уникальность URL и артикула, а также наличие совместимостей для публикации.";
    default:
      return "Не удалось выполнить операцию. Попробуйте ещё раз.";
  }
}

async function fetchProduct(productId: string, signal?: AbortSignal): Promise<ProductEditorData> {
  const response = await fetch(`/api/v1/products/${productId}`, {
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new Error(getApiErrorMessage(response.status));
  }

  const result = (await response.json()) as ApiResponse;

  if (!result.data) {
    throw new Error("Сервер не вернул данные товара.");
  }

  return result.data;
}

export function ProductForm(props: ProductFormProps) {
  const router = useRouter();

  const routeProductId = props.mode === "edit" ? props.productId : null;

  const [loadState, setLoadState] = useState<LoadState>(
    props.mode === "edit" ? "loading" : "ready"
  );

  const [loadError, setLoadError] = useState<string | null>(null);
  const [product, setProduct] = useState<ProductEditorData | null>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: emptyValues,
  });

  const { reset, setValue } = form;

  const productId = routeProductId ?? product?.id ?? null;
  const isPersisted = productId !== null;

  useEffect(() => {
    if (!routeProductId) return;

    const currentProductId = routeProductId;
    const controller = new AbortController();

    async function loadProduct() {
      try {
        const loadedProduct = await fetchProduct(currentProductId, controller.signal);

        reset({
          name: loadedProduct.name,
          slug: loadedProduct.slug,
          sku: loadedProduct.sku ?? "",
          description: loadedProduct.description ?? "",
          sortOrder: loadedProduct.sortOrder,
          status: loadedProduct.status,
        });

        setProduct(loadedProduct);
        setLoadState("ready");
      } catch (error) {
        if (controller.signal.aborted) return;

        const message = error instanceof Error ? error.message : "Не удалось загрузить товар.";

        setLoadError(message);
        setLoadState("error");

        toast.add({
          title: "Не удалось загрузить товар",
          description: message,
          type: "error",
        });
      }
    }

    void loadProduct();

    return () => controller.abort();
  }, [routeProductId, reset]);

  async function refreshProduct(targetProductId: string) {
    try {
      const updatedProduct = await fetchProduct(targetProductId);
      setProduct(updatedProduct);
    } catch {
      toast.add({
        title: "Не удалось обновить данные",
        description: "Повторите попытку.",
        type: "error",
      });
    }
  }

  async function applyImageChanges(targetProductId: string): Promise<boolean> {
    const failedUploads: File[] = [];
    let uploadedCount = 0;

    for (const file of pendingFiles) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(`/api/v1/products/${targetProductId}/images`, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          uploadedCount += 1;
        } else {
          failedUploads.push(file);
        }
      } catch {
        failedUploads.push(file);
      }
    }

    setPendingFiles(failedUploads);

    if (uploadedCount > 0) {
      await refreshProduct(targetProductId);
    }

    if (failedUploads.length > 0) {
      toast.add({
        title: "Не все изображения загружены",
        description: `Товар сохранён. Не удалось добавить файлов: ${failedUploads.length}. Повторите сохранение.`,
        type: "error",
      });

      return false;
    }

    const failedDeletions: string[] = [];
    let deletedCount = 0;

    for (const imageId of deletedImageIds) {
      try {
        const response = await fetch(`/api/v1/products/${targetProductId}/images/${imageId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          deletedCount += 1;
        } else {
          failedDeletions.push(imageId);
        }
      } catch {
        failedDeletions.push(imageId);
      }
    }

    setDeletedImageIds(failedDeletions);

    if (deletedCount > 0) {
      await refreshProduct(targetProductId);
    }

    if (failedDeletions.length > 0) {
      toast.add({
        title: "Не все изображения удалены",
        description: `Товар сохранён. Не удалось удалить изображений: ${failedDeletions.length}. Повторите сохранение.`,
        type: "error",
      });

      return false;
    }

    return true;
  }

  const onSubmit: SubmitHandler<ProductFormValues> = async (values) => {
    try {
      const isUpdating = productId !== null;

      const payload = {
        name: values.name,
        slug: values.slug,
        sku: values.sku.trim() || null,
        description: values.description.trim() || null,
        sortOrder: values.sortOrder,
        ...(isUpdating ? { status: values.status } : {}),
      };

      const response = await fetch(
        isUpdating ? `/api/v1/products/${productId}` : "/api/v1/products",
        {
          method: isUpdating ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as ApiResponse | null;

        toast.add({
          title: "Не удалось сохранить товар",
          description: result?.error?.message ?? getApiErrorMessage(response.status),
          type: "error",
        });

        return;
      }

      const result = (await response.json()) as ApiResponse;
      const savedProduct = result.data;

      if (!savedProduct) {
        throw new Error("Сервер не вернул сохранённый товар.");
      }

      setProduct(savedProduct);
      setValue("status", savedProduct.status);

      const imagesApplied = await applyImageChanges(savedProduct.id);

      if (!imagesApplied) {
        return;
      }

      toast.add({
        title: isUpdating ? "Товар обновлён" : "Товар создан",
        description: "Все изменения успешно сохранены.",
        type: "success",
      });

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      toast.add({
        title: "Не удалось сохранить товар",
        description: error instanceof Error ? error.message : "Ошибка соединения с сервером.",
        type: "error",
      });
    }
  };

  if (loadState === "loading") {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-8">
        <p className="text-muted-foreground text-sm">Загрузка товара...</p>
      </main>
    );
  }

  if (loadState === "error") {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-8">
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold">Не удалось открыть товар</h1>

          <p className="text-destructive text-sm">{loadError}</p>

          <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
            Вернуться к товарам
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8">
      <div>
        <Button
          type="button"
          variant="ghost"
          className="mb-2 -ml-3"
          onClick={() => router.push("/admin/products")}
        >
          ← Все товары
        </Button>

        <h1 className="text-2xl font-semibold tracking-tight">
          {isPersisted ? "Редактирование товара" : "Новый товар"}
        </h1>
      </div>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {isPersisted && <ProductStatusField />}

          <ProductDetailsFields />

          <ProductImagesField
            images={product?.images ?? []}
            pendingFiles={pendingFiles}
            deletedImageIds={deletedImageIds}
            onPendingFilesChange={setPendingFiles}
            onDeletedImageIdsChange={setDeletedImageIds}
          />

          <div className="flex flex-wrap items-center gap-2 border-t pt-5">
            {product && <ProductDeleteAction productId={product.id} productName={product.name} />}

            <div className="ml-auto flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/products")}
              >
                Отмена
              </Button>

              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? "Сохранение..."
                  : isPersisted
                    ? "Сохранить"
                    : "Создать товар"}
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </main>
  );
}
