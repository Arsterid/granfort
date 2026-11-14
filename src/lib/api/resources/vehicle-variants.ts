import { apiRequest, type ApiDataResponse } from "@/lib/api/api-client";

import type { VehicleVariantDto } from "@/server/vehicle-variants/vehicle-variant.dto";
import type {
  CreateVehicleVariantInput,
  UpdateVehicleVariantInput,
} from "@/server/vehicle-variants/vehicle-variant.schema";

const BASE_URL = "/api/v1/vehicle-variants";

function getVariantUrl(id: string) {
  return `${BASE_URL}/${encodeURIComponent(id)}`;
}

export async function getVehicleVariants(vehicleModelId?: string, signal?: AbortSignal) {
  const params = new URLSearchParams();

  if (vehicleModelId) {
    params.set("vehicleModelId", vehicleModelId);
  }

  const query = params.toString();
  const url = query ? `${BASE_URL}?${query}` : BASE_URL;

  const response = await apiRequest<ApiDataResponse<VehicleVariantDto[]>>(url, {
    signal,
    cache: "no-store",
  });

  return response.data;
}

export async function getVehicleVariant(id: string, signal?: AbortSignal) {
  const response = await apiRequest<ApiDataResponse<VehicleVariantDto>>(getVariantUrl(id), {
    signal,
    cache: "no-store",
  });

  return response.data;
}

export async function createVehicleVariant(input: CreateVehicleVariantInput) {
  const response = await apiRequest<ApiDataResponse<VehicleVariantDto>>(BASE_URL, {
    method: "POST",
    json: input,
  });

  return response.data;
}

export async function updateVehicleVariant(id: string, input: UpdateVehicleVariantInput) {
  const response = await apiRequest<ApiDataResponse<VehicleVariantDto>>(getVariantUrl(id), {
    method: "PATCH",
    json: input,
  });

  return response.data;
}

export async function deleteVehicleVariant(id: string) {
  await apiRequest<void>(getVariantUrl(id), {
    method: "DELETE",
  });
}
