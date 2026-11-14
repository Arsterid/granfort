import { ProductStatus } from "@/generated/prisma/enums";
import { z } from "zod";

import type {
  AdminOverviewProductRecord,
  AdminOverviewRepositoryResult,
} from "./admin-overview.repository";

const productSummaryDtoSchema = z.strictObject({
  id: z.uuid(),
  name: z.string(),
  status: z.enum(ProductStatus),
  updatedAt: z.iso.datetime(),
  imagesCount: z.number().int().nonnegative(),
  compatibilitiesCount: z.number().int().nonnegative(),
});

const attentionProductDtoSchema = productSummaryDtoSchema.extend({
  issues: z.array(z.enum(["NO_IMAGES", "NO_COMPATIBILITIES"])),
});

export const adminOverviewDtoSchema = z.strictObject({
  products: z.strictObject({
    total: z.number().int().nonnegative(),
    published: z.number().int().nonnegative(),
    drafts: z.number().int().nonnegative(),
    archived: z.number().int().nonnegative(),
  }),

  vehicles: z.strictObject({
    brands: z.number().int().nonnegative(),
    models: z.number().int().nonnegative(),
    variants: z.number().int().nonnegative(),
  }),

  attention: z.strictObject({
    draftsWithoutCompatibilities: z.number().int().nonnegative(),
    activeProductsWithoutImages: z.number().int().nonnegative(),
    items: z.array(attentionProductDtoSchema),
  }),

  recentProducts: z.array(productSummaryDtoSchema),
});

export type AdminOverviewDto = z.output<typeof adminOverviewDtoSchema>;

function getStatusCount(
  counts: AdminOverviewRepositoryResult["productStatusCounts"],
  status: AdminOverviewProductRecord["status"]
) {
  return counts.find((item) => item.status === status)?._count._all ?? 0;
}

function toProductSummaryDto(product: AdminOverviewProductRecord) {
  return {
    id: product.id,
    name: product.name,
    status: product.status,
    updatedAt: product.updatedAt.toISOString(),
    imagesCount: product._count.images,
    compatibilitiesCount: product._count.vehicles,
  };
}

function toAttentionProductDto(product: AdminOverviewProductRecord) {
  const issues: Array<"NO_IMAGES" | "NO_COMPATIBILITIES"> = [];

  if (product._count.images === 0) {
    issues.push("NO_IMAGES");
  }

  if (product.status === ProductStatus.DRAFT && product._count.vehicles === 0) {
    issues.push("NO_COMPATIBILITIES");
  }

  return {
    ...toProductSummaryDto(product),
    issues,
  };
}

export function toAdminOverviewDto(data: AdminOverviewRepositoryResult): AdminOverviewDto {
  const published = getStatusCount(data.productStatusCounts, ProductStatus.PUBLISHED);

  const drafts = getStatusCount(data.productStatusCounts, ProductStatus.DRAFT);

  const archived = getStatusCount(data.productStatusCounts, ProductStatus.ARCHIVED);

  return {
    products: {
      total: published + drafts + archived,
      published,
      drafts,
      archived,
    },

    vehicles: {
      brands: data.brandsCount,
      models: data.modelsCount,
      variants: data.variantsCount,
    },

    attention: {
      draftsWithoutCompatibilities: data.draftsWithoutCompatibilitiesCount,
      activeProductsWithoutImages: data.activeProductsWithoutImagesCount,
      items: data.attentionProducts.map(toAttentionProductDto),
    },

    recentProducts: data.recentProducts.map(toProductSummaryDto),
  };
}
