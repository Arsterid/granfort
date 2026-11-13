import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { ProductStatus } from "@/generated/prisma/enums";

import { prisma } from "@/lib/prisma";

import { ConflictError } from "@/server/errors/app-error";
import { createPrismaExecutor } from "@/server/errors/prisma-errors";

import type { PrismaConstraintErrors } from "@/server/errors/prisma-errors";

import { ProductErrorCode } from "./product.errors";

import type {
  ChangeProductStatusInput,
  CreateProductInput,
  UpdateProductInput,
} from "./product.schema";

const productSelect = {
  id: true,
  name: true,
  slug: true,
  sku: true,
  description: true,
  status: true,
  sortOrder: true,
  createdAt: true,
  updatedAt: true,

  images: {
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      storageKey: true,
      altText: true,
      sortOrder: true,
    },
  },

  vehicles: {
    orderBy: {
      vehicleVariantId: "asc",
    },
    select: {
      fitmentNotes: true,
      vehicleVariant: {
        select: {
          id: true,
          generation: true,
          yearFrom: true,
          yearTo: true,
          trim: true,
          notes: true,
          vehicleModel: {
            select: {
              id: true,
              name: true,
              slug: true,
              brand: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      },
    },
  },
} satisfies Prisma.ProductSelect;

export type ProductRecord = Prisma.ProductGetPayload<{
  select: typeof productSelect;
}>;

const constraintErrors = {
  product_slug_key: () =>
    new ConflictError(
      ProductErrorCode.SLUG_ALREADY_EXISTS,
      "A product with this slug already exists"
    ),

  product_sku_key: () =>
    new ConflictError(
      ProductErrorCode.SKU_ALREADY_EXISTS,
      "A product with this SKU already exists"
    ),
} satisfies PrismaConstraintErrors;

const execute = createPrismaExecutor(constraintErrors);

export const productRepository = {
  findPublished() {
    return prisma.product.findMany({
      where: {
        status: ProductStatus.PUBLISHED,
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }, { id: "asc" }],
      select: productSelect,
    });
  },

  findPublishedBySlug(slug: string) {
    return prisma.product.findFirst({
      where: {
        slug,
        status: ProductStatus.PUBLISHED,
      },
      select: productSelect,
    });
  },

  findForAdmin() {
    return prisma.product.findMany({
      orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
      select: productSelect,
    });
  },

  findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      select: productSelect,
    });
  },

  findVehicleVariantIds(ids: string[]) {
    if (ids.length === 0) {
      return Promise.resolve([]);
    }

    return prisma.vehicleVariant.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        id: true,
      },
    });
  },

  create(input: CreateProductInput) {
    const { compatibilities, ...productData } = input;

    return execute(() =>
      prisma.product.create({
        data: {
          ...productData,
          vehicles: {
            create: compatibilities.map(({ vehicleVariantId, fitmentNotes }) => ({
              fitmentNotes: fitmentNotes ?? null,
              vehicleVariant: {
                connect: {
                  id: vehicleVariantId,
                },
              },
            })),
          },
        },
        select: productSelect,
      })
    );
  },

  update(id: string, input: UpdateProductInput) {
    const { compatibilities, ...productData } = input;

    return execute(() =>
      prisma.product.update({
        where: { id },
        data: {
          ...productData,

          ...(compatibilities !== undefined && {
            vehicles: {
              deleteMany: {},
              create: compatibilities.map(({ vehicleVariantId, fitmentNotes }) => ({
                fitmentNotes: fitmentNotes ?? null,
                vehicleVariant: {
                  connect: {
                    id: vehicleVariantId,
                  },
                },
              })),
            },
          }),
        },
        select: productSelect,
      })
    );
  },

  changeStatus(id: string, input: ChangeProductStatusInput) {
    return execute(() =>
      prisma.product.update({
        where: { id },
        data: {
          status: input.status,
        },
        select: productSelect,
      })
    );
  },

  delete(id: string) {
    return execute(() =>
      prisma.product.delete({
        where: { id },
        select: {
          id: true,
        },
      })
    );
  },
};
