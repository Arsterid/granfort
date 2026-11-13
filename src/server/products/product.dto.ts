import { ProductStatus } from "@/generated/prisma/enums";
import { z } from "zod";

import type { ProductRecord } from "./product.repository";

export const publicProductDtoSchema = z.strictObject({
  id: z.uuid(),
  name: z.string(),
  slug: z.string(),
  sku: z.string().nullable(),
  description: z.string().nullable(),

  images: z.array(
    z.strictObject({
      id: z.uuid(),
      url: z.string(),
      altText: z.string().nullable(),
      sortOrder: z.number().int(),
    })
  ),

  compatibilities: z.array(
    z.strictObject({
      vehicleVariantId: z.uuid(),
      fitmentNotes: z.string().nullable(),
      generation: z.string().nullable(),
      yearFrom: z.number().int().nullable(),
      yearTo: z.number().int().nullable(),
      trim: z.string().nullable(),
      notes: z.string().nullable(),

      model: z.strictObject({
        id: z.uuid(),
        name: z.string(),
        slug: z.string(),

        brand: z.strictObject({
          id: z.uuid(),
          name: z.string(),
          slug: z.string(),
        }),
      }),
    })
  ),
});

export const adminProductDtoSchema = publicProductDtoSchema.extend({
  status: z.enum(ProductStatus),
  sortOrder: z.number().int(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type PublicProductDto = z.output<typeof publicProductDtoSchema>;

export type AdminProductDto = z.output<typeof adminProductDtoSchema>;

export function toPublicProductDto(product: ProductRecord): PublicProductDto {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    description: product.description,

    images: product.images.map((image) => ({
      id: image.id,
      url: `/api/v1/product-images/${image.id}`,
      altText: image.altText,
      sortOrder: image.sortOrder,
    })),

    compatibilities: product.vehicles.map(({ fitmentNotes, vehicleVariant }) => ({
      vehicleVariantId: vehicleVariant.id,
      fitmentNotes,
      generation: vehicleVariant.generation,
      yearFrom: vehicleVariant.yearFrom,
      yearTo: vehicleVariant.yearTo,
      trim: vehicleVariant.trim,
      notes: vehicleVariant.notes,

      model: {
        id: vehicleVariant.vehicleModel.id,
        name: vehicleVariant.vehicleModel.name,
        slug: vehicleVariant.vehicleModel.slug,

        brand: {
          id: vehicleVariant.vehicleModel.brand.id,
          name: vehicleVariant.vehicleModel.brand.name,
          slug: vehicleVariant.vehicleModel.brand.slug,
        },
      },
    })),
  };
}

export function toAdminProductDto(product: ProductRecord): AdminProductDto {
  return {
    ...toPublicProductDto(product),

    images: product.images.map((image) => ({
      id: image.id,
      url: `/api/v1/products/${product.id}/images/${image.id}`,
      altText: image.altText,
      sortOrder: image.sortOrder,
    })),

    status: product.status,
    sortOrder: product.sortOrder,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}
