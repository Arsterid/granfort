import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

import { ConflictError } from "@/server/errors/app-error";
import { createPrismaExecutor } from "@/server/errors/prisma-errors";

import type { PrismaConstraintErrors } from "@/server/errors/prisma-errors";

import { VehicleModelErrorCode } from "./vehicle-model.errors";

import type { CreateVehicleModelInput, UpdateVehicleModelInput } from "./vehicle-model.schema";

const vehicleModelSelect = {
  id: true,
  brandId: true,
  name: true,
  slug: true,
  createdAt: true,
  updatedAt: true,

  brand: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },

  _count: {
    select: {
      variants: true,
    },
  },
} satisfies Prisma.VehicleModelSelect;

export type VehicleModelRecord = Prisma.VehicleModelGetPayload<{
  select: typeof vehicleModelSelect;
}>;

const constraintErrors = {
  vehicle_model_brand_id_name_key: () =>
    new ConflictError(
      VehicleModelErrorCode.NAME_ALREADY_EXISTS,
      "A vehicle model with this name already exists within this brand"
    ),

  vehicle_model_brand_id_slug_key: () =>
    new ConflictError(
      VehicleModelErrorCode.SLUG_ALREADY_EXISTS,
      "A vehicle model with this slug already exists within this brand"
    ),
} satisfies PrismaConstraintErrors;

const execute = createPrismaExecutor(constraintErrors);

export const vehicleModelRepository = {
  findAll(brandId?: string) {
    return prisma.vehicleModel.findMany({
      where: {
        ...(brandId ? { brandId } : {}),
      },
      orderBy: [{ brand: { name: "asc" } }, { name: "asc" }, { id: "asc" }],
      select: vehicleModelSelect,
    });
  },

  findById(id: string) {
    return prisma.vehicleModel.findUnique({
      where: { id },
      select: vehicleModelSelect,
    });
  },

  create(input: CreateVehicleModelInput) {
    const { brandId, ...modelData } = input;

    return execute(() =>
      prisma.vehicleModel.create({
        data: {
          ...modelData,
          brand: {
            connect: { id: brandId },
          },
        },
        select: vehicleModelSelect,
      })
    );
  },

  update(id: string, input: UpdateVehicleModelInput) {
    return execute(() =>
      prisma.vehicleModel.update({
        where: { id },
        data: input,
        select: vehicleModelSelect,
      })
    );
  },

  delete(id: string) {
    return execute(() =>
      prisma.vehicleModel.delete({
        where: { id },
        select: {
          id: true,
        },
      })
    );
  },
};
