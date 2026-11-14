import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { ProductStatus } from "@/generated/prisma/enums";

import { prisma } from "@/lib/prisma";

const overviewProductSelect = {
  id: true,
  name: true,
  status: true,
  updatedAt: true,
  _count: {
    select: {
      images: true,
      vehicles: true,
    },
  },
} satisfies Prisma.ProductSelect;

export type AdminOverviewProductRecord = Prisma.ProductGetPayload<{
  select: typeof overviewProductSelect;
}>;

export type AdminOverviewRepositoryResult = {
  productCounts: {
    published: number;
    drafts: number;
    archived: number;
  };
  brandsCount: number;
  modelsCount: number;
  variantsCount: number;
  draftsWithoutCompatibilitiesCount: number;
  activeProductsWithoutImagesCount: number;
  attentionProducts: AdminOverviewProductRecord[];
  recentProducts: AdminOverviewProductRecord[];
};

const draftsWithoutCompatibilitiesWhere: Prisma.ProductWhereInput = {
  status: ProductStatus.DRAFT,
  vehicles: {
    none: {},
  },
};

const activeProductsWithoutImagesWhere: Prisma.ProductWhereInput = {
  status: {
    not: ProductStatus.ARCHIVED,
  },
  images: {
    none: {},
  },
};

export const adminOverviewRepository = {
  async getForAdmin(): Promise<AdminOverviewRepositoryResult> {
    const [
      publishedCount,
      draftsCount,
      archivedCount,
      brandsCount,
      modelsCount,
      variantsCount,
      draftsWithoutCompatibilitiesCount,
      activeProductsWithoutImagesCount,
      attentionProducts,
      recentProducts,
    ] = await prisma.$transaction([
      prisma.product.count({
        where: {
          status: ProductStatus.PUBLISHED,
        },
      }),

      prisma.product.count({
        where: {
          status: ProductStatus.DRAFT,
        },
      }),

      prisma.product.count({
        where: {
          status: ProductStatus.ARCHIVED,
        },
      }),

      prisma.vehicleBrand.count(),

      prisma.vehicleModel.count(),

      prisma.vehicleVariant.count(),

      prisma.product.count({
        where: draftsWithoutCompatibilitiesWhere,
      }),

      prisma.product.count({
        where: activeProductsWithoutImagesWhere,
      }),

      prisma.product.findMany({
        where: {
          status: {
            not: ProductStatus.ARCHIVED,
          },
          OR: [
            {
              images: {
                none: {},
              },
            },
            {
              status: ProductStatus.DRAFT,
              vehicles: {
                none: {},
              },
            },
          ],
        },
        orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
        take: 6,
        select: overviewProductSelect,
      }),

      prisma.product.findMany({
        orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
        take: 5,
        select: overviewProductSelect,
      }),
    ]);

    return {
      productCounts: {
        published: publishedCount,
        drafts: draftsCount,
        archived: archivedCount,
      },
      brandsCount,
      modelsCount,
      variantsCount,
      draftsWithoutCompatibilitiesCount,
      activeProductsWithoutImagesCount,
      attentionProducts,
      recentProducts,
    };
  },
};
