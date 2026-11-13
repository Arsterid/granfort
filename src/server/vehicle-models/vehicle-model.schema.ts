import { z } from "zod";

import { slugSchema } from "@/server/shared/slug.schema";

export const vehicleModelIdSchema = z.uuid();

export const createVehicleModelSchema = z.strictObject({
  brandId: z.uuid(),
  name: z.string().trim().min(1).max(100),
  slug: slugSchema,
});

export const updateVehicleModelSchema = z
  .strictObject({
    name: z.string().trim().min(1).max(100).optional(),
    slug: slugSchema.optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "At least one field must be provided",
  });

export const listVehicleModelsQuerySchema = z.strictObject({
  brandId: z.uuid().optional(),
});

export type CreateVehicleModelInput = z.output<typeof createVehicleModelSchema>;

export type UpdateVehicleModelInput = z.output<typeof updateVehicleModelSchema>;
