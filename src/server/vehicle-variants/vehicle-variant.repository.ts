import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

import { createPrismaExecutor } from "@/server/errors/prisma-errors";

import type {
  CreateVehicleVariantInput,
  UpdateVehicleVariantInput,
} from "./vehicle-variant.schema";

const vehicleVariantSelect = {
  id: true,
  vehicleModelId: true,
  generation: true,
  yearFrom: true,
  yearTo: true,
  trim: true,
  notes: true,
  createdAt: true,
  updatedAt: true,

  vehicleModel: {
    select: {
      id: true,
      name: true,
      slug: true,
      brand: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  },

  _count: {
    select: {
      products: true,
    },
  },
} satisfies Prisma.VehicleVariantSelect;

export type VehicleVariantRecord = Prisma.VehicleVariantGetPayload<{
  select: typeof vehicleVariantSelect;
}>;

const execute = createPrismaExecutor();

export const vehicleVariantRepository = {
  findAll(vehicleModelId?: string) {
    return prisma.vehicleVariant.findMany({
      where: {
        ...(vehicleModelId ? { vehicleModelId } : {}),
      },
      orderBy: [{ vehicleModel: { name: "asc" } }, { yearFrom: "asc" }, { id: "asc" }],
      select: vehicleVariantSelect,
    });
  },

  findById(id: string) {
    return prisma.vehicleVariant.findUnique({
      where: { id },
      select: vehicleVariantSelect,
    });
  },

  create(input: CreateVehicleVariantInput) {
    const { vehicleModelId, ...variantData } = input;

    return execute(() =>
      prisma.vehicleVariant.create({
        data: {
          ...variantData,
          vehicleModel: {
            connect: {
              id: vehicleModelId,
            },
          },
        },
        select: vehicleVariantSelect,
      })
    );
  },

  update(id: string, input: UpdateVehicleVariantInput) {
    return execute(() =>
      prisma.vehicleVariant.update({
        where: { id },
        data: input,
        select: vehicleVariantSelect,
      })
    );
  },

  delete(id: string) {
    return execute(() =>
      prisma.vehicleVariant.delete({
        where: { id },
        select: {
          id: true,
        },
      })
    );
  },
};
