import { apiRequest, type ApiDataResponse } from "@/lib/api/api-client";

import type { VehicleBrandDto } from "@/server/vehicle-brands/vehicle-brand.dto";
import type {
  CreateVehicleBrandInput,
  UpdateVehicleBrandInput,
} from "@/server/vehicle-brands/vehicle-brand.schema";

const BASE_URL = "/api/v1/vehicle-brands";

function getBrandUrl(id: string) {
  return `${BASE_URL}/${encodeURIComponent(id)}`;
}

export async function getVehicleBrands(signal?: AbortSignal) {
  const response = await apiRequest<ApiDataResponse<VehicleBrandDto[]>>(BASE_URL, {
    signal,
    cache: "no-store",
  });

  return response.data;
}

export async function getVehicleBrand(id: string, signal?: AbortSignal) {
  const response = await apiRequest<ApiDataResponse<VehicleBrandDto>>(getBrandUrl(id), {
    signal,
    cache: "no-store",
  });

  return response.data;
}

export async function createVehicleBrand(input: CreateVehicleBrandInput) {
  const response = await apiRequest<ApiDataResponse<VehicleBrandDto>>(BASE_URL, {
    method: "POST",
    json: input,
  });

  return response.data;
}

export async function updateVehicleBrand(id: string, input: UpdateVehicleBrandInput) {
  const response = await apiRequest<ApiDataResponse<VehicleBrandDto>>(getBrandUrl(id), {
    method: "PATCH",
    json: input,
  });

  return response.data;
}

export async function deleteVehicleBrand(id: string) {
  await apiRequest<void>(getBrandUrl(id), {
    method: "DELETE",
  });
}
