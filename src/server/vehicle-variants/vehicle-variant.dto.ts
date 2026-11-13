import { z } from "zod";

import type { VehicleVariantRecord } from "./vehicle-variant.repository";

export const vehicleVariantDtoSchema = z.strictObject({
  id: z.uuid(),
  vehicleModelId: z.uuid(),
  generation: z.string().nullable(),
  yearFrom: z.number().int().nullable(),
  yearTo: z.number().int().nullable(),
  trim: z.string().nullable(),
  notes: z.string().nullable(),

  vehicleModel: z.strictObject({
    id: z.uuid(),
    name: z.string(),
    slug: z.string(),

    brand: z.strictObject({
      id: z.uuid(),
      name: z.string(),
      slug: z.string(),
    }),
  }),

  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type VehicleVariantDto = z.output<typeof vehicleVariantDtoSchema>;

export function toVehicleVariantDto(variant: VehicleVariantRecord): VehicleVariantDto {
  return {
    id: variant.id,
    vehicleModelId: variant.vehicleModelId,
    generation: variant.generation,
    yearFrom: variant.yearFrom,
    yearTo: variant.yearTo,
    trim: variant.trim,
    notes: variant.notes,

    vehicleModel: variant.vehicleModel,

    createdAt: variant.createdAt.toISOString(),
    updatedAt: variant.updatedAt.toISOString(),
  };
}
