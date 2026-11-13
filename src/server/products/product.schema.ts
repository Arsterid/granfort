import { ProductStatus } from "@/generated/prisma/enums";
import { z } from "zod";

import { slugSchema } from "@/server/shared/slug.schema";

const nullableText = (maxLength: number) =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? null : value),
    z.string().trim().max(maxLength).nullable()
  );

const productCompatibilitySchema = z.strictObject({
  vehicleVariantId: z.uuid(),
  fitmentNotes: nullableText(2000).optional(),
});

const productCompatibilitiesSchema = z
  .array(productCompatibilitySchema)
  .max(100)
  .refine((items) => new Set(items.map((item) => item.vehicleVariantId)).size === items.length, {
    message: "Duplicate vehicle variants are not allowed",
  });

export const createProductSchema = z.strictObject({
  name: z.string().trim().min(1).max(160),
  slug: slugSchema,
  sku: nullableText(80).optional(),
  description: nullableText(10_000).optional(),
  sortOrder: z.number().int().min(0).max(1_000_000).default(0),
  compatibilities: productCompatibilitiesSchema.default([]),
});

export const updateProductSchema = z
  .strictObject({
    name: z.string().trim().min(1).max(160).optional(),
    slug: slugSchema.optional(),
    sku: nullableText(80).optional(),
    description: nullableText(10_000).optional(),
    sortOrder: z.number().int().min(0).max(1_000_000).optional(),
    compatibilities: productCompatibilitiesSchema.optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "At least one field must be provided",
  });

export const changeProductStatusSchema = z.strictObject({
  status: z.enum(ProductStatus),
});

export const productIdSchema = z.uuid();

export type CreateProductInput = z.output<typeof createProductSchema>;
export type UpdateProductInput = z.output<typeof updateProductSchema>;

export type ChangeProductStatusInput = z.output<typeof changeProductStatusSchema>;
