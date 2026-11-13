import { z } from "zod";

export const vehicleVariantIdSchema = z.uuid();

const vehicleYearsSchema = {
  yearFrom: z.number().int().min(1886).max(2100).nullable().optional(),
  yearTo: z.number().int().min(1886).max(2100).nullable().optional(),
};

function hasValidYearRange(data: { yearFrom?: number | null; yearTo?: number | null }) {
  return data.yearFrom == null || data.yearTo == null || data.yearFrom <= data.yearTo;
}

export const createVehicleVariantSchema = z
  .strictObject({
    vehicleModelId: z.uuid(),
    generation: z.string().trim().min(1).max(100).nullable().optional(),
    ...vehicleYearsSchema,
    trim: z.string().trim().min(1).max(120).nullable().optional(),
    notes: z.string().trim().max(5000).nullable().optional(),
  })
  .refine(hasValidYearRange, {
    path: ["yearTo"],
    message: "End year cannot be earlier than start year",
  });

export const updateVehicleVariantSchema = z
  .strictObject({
    generation: z.string().trim().min(1).max(100).nullable().optional(),
    ...vehicleYearsSchema,
    trim: z.string().trim().min(1).max(120).nullable().optional(),
    notes: z.string().trim().max(5000).nullable().optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "At least one field must be provided",
  })
  .refine(hasValidYearRange, {
    path: ["yearTo"],
    message: "End year cannot be earlier than start year",
  });

export const listVehicleVariantsQuerySchema = z.strictObject({
  vehicleModelId: z.uuid().optional(),
});

export type CreateVehicleVariantInput = z.output<typeof createVehicleVariantSchema>;

export type UpdateVehicleVariantInput = z.output<typeof updateVehicleVariantSchema>;
