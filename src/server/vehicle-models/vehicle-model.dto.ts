import { z } from "zod";

import type { VehicleModelRecord } from "./vehicle-model.repository";

export const vehicleModelDtoSchema = z.strictObject({
  id: z.uuid(),
  brandId: z.uuid(),
  name: z.string(),
  slug: z.string(),

  brand: z.strictObject({
    id: z.uuid(),
    name: z.string(),
    slug: z.string(),
  }),

  variantsCount: z.number().int().nonnegative(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type VehicleModelDto = z.output<typeof vehicleModelDtoSchema>;

export function toVehicleModelDto(model: VehicleModelRecord): VehicleModelDto {
  return {
    id: model.id,
    brandId: model.brandId,
    name: model.name,
    slug: model.slug,
    brand: model.brand,
    variantsCount: model._count.variants,
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}
