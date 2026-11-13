"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { adminQueryKeys } from "@/lib/query/query-keys";

import {
  createProduct,
  deleteProduct,
  deleteProductImage,
  getAdminProducts,
  getProduct,
  updateProduct,
  uploadProductImage,
} from "@/lib/api/resources/products";

import type { CreateProductInput, UpdateProductInput } from "@/server/products/product.schema";

export type ProductImageChangesInput = {
  productId: string;
  pendingFiles: File[];
  deletedImageIds: string[];
};

export type ProductImageChangesResult = {
  failedUploads: File[];
  failedDeletions: string[];
  uploadedCount: number;
  deletedCount: number;
};

export function useAdminProducts() {
  return useQuery({
    queryKey: adminQueryKeys.products.list(),
    queryFn: ({ signal }) => getAdminProducts(signal),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: adminQueryKeys.products.detail(id),
    queryFn: ({ signal }) => getProduct(id, signal),
    enabled: Boolean(id),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateProductInput) => createProduct(input),

    onSuccess: async (product) => {
      queryClient.setQueryData(adminQueryKeys.products.detail(product.id), product);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: adminQueryKeys.products.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: adminQueryKeys.vehicleVariants.all(),
        }),
      ]);
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateProductInput }) =>
      updateProduct(id, input),

    onSuccess: async (product) => {
      queryClient.setQueryData(adminQueryKeys.products.detail(product.id), product);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: adminQueryKeys.products.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: adminQueryKeys.vehicleVariants.all(),
        }),
      ]);
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,

    onSuccess: async (_, id) => {
      queryClient.removeQueries({
        queryKey: adminQueryKeys.products.detail(id),
        exact: true,
      });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: adminQueryKeys.products.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: adminQueryKeys.vehicleVariants.all(),
        }),
      ]);
    },
  });
}

async function applyProductImageChanges({
  productId,
  pendingFiles,
  deletedImageIds,
}: ProductImageChangesInput): Promise<ProductImageChangesResult> {
  const failedUploads: File[] = [];
  let uploadedCount = 0;

  for (const file of pendingFiles) {
    try {
      await uploadProductImage(productId, file);
      uploadedCount += 1;
    } catch {
      failedUploads.push(file);
    }
  }

  if (failedUploads.length > 0) {
    return {
      failedUploads,
      failedDeletions: deletedImageIds,
      uploadedCount,
      deletedCount: 0,
    };
  }

  const failedDeletions: string[] = [];
  let deletedCount = 0;

  for (const imageId of deletedImageIds) {
    try {
      await deleteProductImage(productId, imageId);
      deletedCount += 1;
    } catch {
      failedDeletions.push(imageId);
    }
  }

  return {
    failedUploads,
    failedDeletions,
    uploadedCount,
    deletedCount,
  };
}

export function useApplyProductImageChanges() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applyProductImageChanges,

    onSuccess: async (result, { productId }) => {
      if (result.uploadedCount === 0 && result.deletedCount === 0) {
        return;
      }

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: adminQueryKeys.products.detail(productId),
          exact: true,
        }),
        queryClient.invalidateQueries({
          queryKey: adminQueryKeys.products.lists(),
        }),
      ]);
    },
  });
}
