import { z } from "zod";

import type { VehicleBrandRecord } from "./vehicle-brand.repository";

export const vehicleBrandDtoSchema = z.strictObject({
  id: z.uuid(),
  name: z.string(),
  slug: z.string(),
  modelsCount: z.number().int().nonnegative(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type VehicleBrandDto = z.output<typeof vehicleBrandDtoSchema>;

export function toVehicleBrandDto(brand: VehicleBrandRecord): VehicleBrandDto {
  return {
    id: brand.id,
    name: brand.name,
    slug: brand.slug,
    modelsCount: brand._count.models,
    createdAt: brand.createdAt.toISOString(),
    updatedAt: brand.updatedAt.toISOString(),
  };
}
