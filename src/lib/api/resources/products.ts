import { apiRequest, type ApiDataResponse } from "@/lib/api/api-client";

import type { AdminProductDto } from "@/server/products/product.dto";
import type { CreateProductInput, UpdateProductInput } from "@/server/products/product.schema";

const ADMIN_URL = "/api/v1/admin/products";
const PRODUCTS_URL = "/api/v1/products";

function productUrl(id: string) {
  return `${PRODUCTS_URL}/${encodeURIComponent(id)}`;
}

export async function getAdminProducts(signal?: AbortSignal) {
  const response = await apiRequest<ApiDataResponse<AdminProductDto[]>>(ADMIN_URL, {
    signal,
    cache: "no-store",
  });

  return response.data;
}

export async function getProduct(id: string, signal?: AbortSignal) {
  const response = await apiRequest<ApiDataResponse<AdminProductDto>>(productUrl(id), {
    signal,
    cache: "no-store",
  });

  return response.data;
}

export async function createProduct(input: CreateProductInput) {
  const response = await apiRequest<ApiDataResponse<AdminProductDto>>(PRODUCTS_URL, {
    method: "POST",
    json: input,
  });

  return response.data;
}

export async function updateProduct(id: string, input: UpdateProductInput) {
  const response = await apiRequest<ApiDataResponse<AdminProductDto>>(productUrl(id), {
    method: "PATCH",
    json: input,
  });

  return response.data;
}

export async function deleteProduct(id: string) {
  await apiRequest<void>(productUrl(id), {
    method: "DELETE",
  });
}

export async function uploadProductImage(productId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  await apiRequest<unknown>(`${productUrl(productId)}/images`, {
    method: "POST",
    body: formData,
  });
}

export async function deleteProductImage(productId: string, imageId: string) {
  await apiRequest<unknown>(`${productUrl(productId)}/images/${encodeURIComponent(imageId)}`, {
    method: "DELETE",
  });
}
