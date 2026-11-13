import "server-only";

import { ConflictError, NotFoundError } from "@/server/errors/app-error";

import { vehicleBrandRepository } from "@/server/vehicle-brands/vehicle-brand.repository";

import { VehicleModelErrorCode } from "./vehicle-model.errors";
import { vehicleModelRepository } from "./vehicle-model.repository";

import type { CreateVehicleModelInput, UpdateVehicleModelInput } from "./vehicle-model.schema";

async function getModelOrThrow(id: string) {
  const model = await vehicleModelRepository.findById(id);

  if (!model) {
    throw new NotFoundError(VehicleModelErrorCode.NOT_FOUND, "Vehicle model not found");
  }

  return model;
}

export const vehicleModelService = {
  findAll(brandId?: string) {
    return vehicleModelRepository.findAll(brandId);
  },

  getById(id: string) {
    return getModelOrThrow(id);
  },

  async create(input: CreateVehicleModelInput) {
    const brand = await vehicleBrandRepository.findById(input.brandId);

    if (!brand) {
      throw new NotFoundError(VehicleModelErrorCode.BRAND_NOT_FOUND, "Vehicle brand not found");
    }

    return vehicleModelRepository.create(input);
  },

  async update(id: string, input: UpdateVehicleModelInput) {
    await getModelOrThrow(id);

    return vehicleModelRepository.update(id, input);
  },

  async delete(id: string) {
    const model = await getModelOrThrow(id);

    if (model._count.variants > 0) {
      throw new ConflictError(
        VehicleModelErrorCode.HAS_VARIANTS,
        "Cannot delete a vehicle model that has variants"
      );
    }

    return vehicleModelRepository.delete(id);
  },
};
