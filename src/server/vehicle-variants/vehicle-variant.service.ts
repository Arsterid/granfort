import "server-only";

import { ConflictError, NotFoundError, UnprocessableError } from "@/server/errors/app-error";

import { vehicleModelRepository } from "@/server/vehicle-models/vehicle-model.repository";

import { VehicleVariantErrorCode } from "./vehicle-variant.errors";
import { vehicleVariantRepository } from "./vehicle-variant.repository";

import type {
  CreateVehicleVariantInput,
  UpdateVehicleVariantInput,
} from "./vehicle-variant.schema";

function assertYearRange(yearFrom?: number | null, yearTo?: number | null) {
  if (yearFrom != null && yearTo != null && yearFrom > yearTo) {
    throw new UnprocessableError(
      VehicleVariantErrorCode.INVALID_YEAR_RANGE,
      "End year cannot be earlier than start year"
    );
  }
}

async function getVariantOrThrow(id: string) {
  const variant = await vehicleVariantRepository.findById(id);

  if (!variant) {
    throw new NotFoundError(VehicleVariantErrorCode.NOT_FOUND, "Vehicle variant not found");
  }

  return variant;
}

export const vehicleVariantService = {
  findAll(vehicleModelId?: string) {
    return vehicleVariantRepository.findAll(vehicleModelId);
  },

  getById(id: string) {
    return getVariantOrThrow(id);
  },

  async create(input: CreateVehicleVariantInput) {
    const model = await vehicleModelRepository.findById(input.vehicleModelId);

    if (!model) {
      throw new NotFoundError(VehicleVariantErrorCode.MODEL_NOT_FOUND, "Vehicle model not found");
    }

    assertYearRange(input.yearFrom, input.yearTo);

    return vehicleVariantRepository.create(input);
  },

  async update(id: string, input: UpdateVehicleVariantInput) {
    const variant = await getVariantOrThrow(id);

    const yearFrom = input.yearFrom === undefined ? variant.yearFrom : input.yearFrom;

    const yearTo = input.yearTo === undefined ? variant.yearTo : input.yearTo;

    assertYearRange(yearFrom, yearTo);

    return vehicleVariantRepository.update(id, input);
  },

  async delete(id: string) {
    const variant = await getVariantOrThrow(id);

    if (variant._count.products > 0) {
      throw new ConflictError(
        VehicleVariantErrorCode.HAS_PRODUCTS,
        "Cannot delete a vehicle variant associated with products"
      );
    }

    return vehicleVariantRepository.delete(id);
  },
};
