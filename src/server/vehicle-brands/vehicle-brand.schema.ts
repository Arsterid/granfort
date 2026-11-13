import { z } from "zod";

import { slugSchema } from "@/server/shared/slug.schema";

export const vehicleBrandIdSchema = z.uuid();

export const createVehicleBrandSchema = z.strictObject({
  name: z.string().trim().min(1).max(80),
  slug: slugSchema,
});

export const updateVehicleBrandSchema = z
  .strictObject({
    name: z.string().trim().min(1).max(80).optional(),
    slug: slugSchema.optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "At least one field must be provided",
  });

export type CreateVehicleBrandInput = z.output<typeof createVehicleBrandSchema>;

export type UpdateVehicleBrandInput = z.output<typeof updateVehicleBrandSchema>;
