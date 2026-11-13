import "server-only";

import { ConflictError, NotFoundError } from "@/server/errors/app-error";

import { VehicleBrandErrorCode } from "./vehicle-brand.errors";
import { vehicleBrandRepository } from "./vehicle-brand.repository";

import type { CreateVehicleBrandInput, UpdateVehicleBrandInput } from "./vehicle-brand.schema";

async function getBrandOrThrow(id: string) {
  const brand = await vehicleBrandRepository.findById(id);

  if (!brand) {
    throw new NotFoundError(VehicleBrandErrorCode.NOT_FOUND, "Vehicle brand not found");
  }

  return brand;
}

export const vehicleBrandService = {
  findAll() {
    return vehicleBrandRepository.findAll();
  },

  getById(id: string) {
    return getBrandOrThrow(id);
  },

  create(input: CreateVehicleBrandInput) {
    return vehicleBrandRepository.create(input);
  },

  async update(id: string, input: UpdateVehicleBrandInput) {
    await getBrandOrThrow(id);

    return vehicleBrandRepository.update(id, input);
  },

  async delete(id: string) {
    const brand = await getBrandOrThrow(id);

    if (brand._count.models > 0) {
      throw new ConflictError(
        VehicleBrandErrorCode.HAS_MODELS,
        "Cannot delete a vehicle brand that has models"
      );
    }

    return vehicleBrandRepository.delete(id);
  },
};
