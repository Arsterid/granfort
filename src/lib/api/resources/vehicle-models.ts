import { apiRequest, type ApiDataResponse } from "@/lib/api/api-client";

import type { VehicleModelDto } from "@/server/vehicle-models/vehicle-model.dto";
import type {
  CreateVehicleModelInput,
  UpdateVehicleModelInput,
} from "@/server/vehicle-models/vehicle-model.schema";

const BASE_URL = "/api/v1/vehicle-models";

function getModelUrl(id: string) {
  return `${BASE_URL}/${encodeURIComponent(id)}`;
}

export async function getVehicleModels(brandId?: string, signal?: AbortSignal) {
  const params = new URLSearchParams();

  if (brandId) {
    params.set("brandId", brandId);
  }

  const query = params.toString();
  const url = query ? `${BASE_URL}?${query}` : BASE_URL;

  const response = await apiRequest<ApiDataResponse<VehicleModelDto[]>>(url, {
    signal,
    cache: "no-store",
  });

  return response.data;
}

export async function getVehicleModel(id: string, signal?: AbortSignal) {
  const response = await apiRequest<ApiDataResponse<VehicleModelDto>>(getModelUrl(id), {
    signal,
    cache: "no-store",
  });

  return response.data;
}

export async function createVehicleModel(input: CreateVehicleModelInput) {
  const response = await apiRequest<ApiDataResponse<VehicleModelDto>>(BASE_URL, {
    method: "POST",
    json: input,
  });

  return response.data;
}

export async function updateVehicleModel(id: string, input: UpdateVehicleModelInput) {
  const response = await apiRequest<ApiDataResponse<VehicleModelDto>>(getModelUrl(id), {
    method: "PATCH",
    json: input,
  });

  return response.data;
}

export async function deleteVehicleModel(id: string) {
  await apiRequest<void>(getModelUrl(id), {
    method: "DELETE",
  });
}
