import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

import { ConflictError } from "@/server/errors/app-error";
import { createPrismaExecutor } from "@/server/errors/prisma-errors";

import type { PrismaConstraintErrors } from "@/server/errors/prisma-errors";

import { VehicleBrandErrorCode } from "./vehicle-brand.errors";

import type { CreateVehicleBrandInput, UpdateVehicleBrandInput } from "./vehicle-brand.schema";

const vehicleBrandSelect = {
  id: true,
  name: true,
  slug: true,
  createdAt: true,
  updatedAt: true,

  _count: {
    select: {
      models: true,
    },
  },
} satisfies Prisma.VehicleBrandSelect;

export type VehicleBrandRecord = Prisma.VehicleBrandGetPayload<{
  select: typeof vehicleBrandSelect;
}>;

const constraintErrors = {
  vehicle_brand_name_key: () =>
    new ConflictError(
      VehicleBrandErrorCode.NAME_ALREADY_EXISTS,
      "A vehicle brand with this name already exists"
    ),

  vehicle_brand_slug_key: () =>
    new ConflictError(
      VehicleBrandErrorCode.SLUG_ALREADY_EXISTS,
      "A vehicle brand with this slug already exists"
    ),
} satisfies PrismaConstraintErrors;

const execute = createPrismaExecutor(constraintErrors);

export const vehicleBrandRepository = {
  findAll() {
    return prisma.vehicleBrand.findMany({
      orderBy: [{ name: "asc" }, { id: "asc" }],
      select: vehicleBrandSelect,
    });
  },

  findById(id: string) {
    return prisma.vehicleBrand.findUnique({
      where: { id },
      select: vehicleBrandSelect,
    });
  },

  create(input: CreateVehicleBrandInput) {
    return execute(() =>
      prisma.vehicleBrand.create({
        data: input,
        select: vehicleBrandSelect,
      })
    );
  },

  update(id: string, input: UpdateVehicleBrandInput) {
    return execute(() =>
      prisma.vehicleBrand.update({
        where: { id },
        data: input,
        select: vehicleBrandSelect,
      })
    );
  },

  delete(id: string) {
    return execute(() =>
      prisma.vehicleBrand.delete({
        where: { id },
        select: {
          id: true,
        },
      })
    );
  },
};
