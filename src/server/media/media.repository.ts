import { prisma } from "@/lib/prisma";
import { createPrismaExecutor } from "@/server/errors/prisma-errors";

const execute = createPrismaExecutor();

export const mediaRepository = {
  createProductImage(input: { productId: string; storageKey: string; altText: string | null }) {
    return execute(async () => {
      const lastImage = await prisma.productImage.findFirst({
        where: {
          productId: input.productId,
        },
        orderBy: {
          sortOrder: "desc",
        },
        select: {
          sortOrder: true,
        },
      });

      return prisma.productImage.create({
        data: {
          productId: input.productId,
          storageKey: input.storageKey,
          altText: input.altText,
          sortOrder: (lastImage?.sortOrder ?? -1) + 1,
        },
        select: {
          id: true,
          productId: true,
          altText: true,
          sortOrder: true,
          createdAt: true,
        },
      });
    });
  },

  findProductImage(input: { productId: string; imageId: string }) {
    return execute(async () => {
      return prisma.productImage.findFirst({
        where: {
          id: input.imageId,
          productId: input.productId,
        },
        select: {
          id: true,
          storageKey: true,
        },
      });
    });
  },

  findPublicProductImage(imageId: string) {
    return execute(async () => {
      return prisma.productImage.findFirst({
        where: {
          id: imageId,
          product: {
            is: {
              status: "PUBLISHED",
            },
          },
        },
        select: {
          storageKey: true,
        },
      });
    });
  },

  deleteProductImage(input: { productId: string; imageId: string }) {
    return execute(async () => {
      return prisma.productImage.deleteMany({
        where: {
          id: input.imageId,
          productId: input.productId,
        },
      });
    });
  },
};
