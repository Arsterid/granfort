import "server-only";

import { ProductStatus } from "@/generated/prisma/enums";

import { ConflictError, NotFoundError } from "@/server/errors/app-error";

import { ProductErrorCode } from "./product.errors";
import { productRepository } from "./product.repository";

import { getStorageProvider } from "../storage/storage";

import type {
  ChangeProductStatusInput,
  CreateProductInput,
  UpdateProductInput,
} from "./product.schema";

async function getProductOrThrow(id: string) {
  const product = await productRepository.findById(id);

  if (!product) {
    throw new NotFoundError(ProductErrorCode.NOT_FOUND, "Product not found");
  }

  return product;
}

async function assertVehicleVariantsExist(compatibilities: { vehicleVariantId: string }[]) {
  if (compatibilities.length === 0) {
    return;
  }

  const ids = compatibilities.map((item) => item.vehicleVariantId);
  const existingVariants = await productRepository.findVehicleVariantIds(ids);

  if (existingVariants.length !== ids.length) {
    throw new NotFoundError(
      ProductErrorCode.VEHICLE_VARIANT_NOT_FOUND,
      "One or more vehicle variants do not exist"
    );
  }
}

function assertCanPublish(compatibilityCount: number) {
  if (compatibilityCount === 0) {
    throw new ConflictError(
      ProductErrorCode.HAS_NO_COMPATIBILITY,
      "A product must have at least one compatible vehicle before publishing"
    );
  }
}

export const productService = {
  getPublished() {
    return productRepository.findPublished();
  },

  async getPublishedBySlug(slug: string) {
    const product = await productRepository.findPublishedBySlug(slug);

    if (!product) {
      throw new NotFoundError(ProductErrorCode.NOT_FOUND, "Product not found");
    }

    return product;
  },

  getAllForAdmin() {
    return productRepository.findForAdmin();
  },

  getById(id: string) {
    return getProductOrThrow(id);
  },

  async create(input: CreateProductInput) {
    await assertVehicleVariantsExist(input.compatibilities);

    return productRepository.create(input);
  },

  async update(id: string, input: UpdateProductInput) {
    const product = await getProductOrThrow(id);

    if (input.compatibilities !== undefined) {
      await assertVehicleVariantsExist(input.compatibilities);
    }

    if (input.status === ProductStatus.PUBLISHED) {
      const compatibilityCount = input.compatibilities?.length ?? product.vehicles.length;

      assertCanPublish(compatibilityCount);
    }

    return productRepository.update(id, input);
  },

  async changeStatus(id: string, input: ChangeProductStatusInput) {
    const product = await getProductOrThrow(id);

    if (input.status === ProductStatus.PUBLISHED) {
      assertCanPublish(product.vehicles.length);
    }

    return productRepository.changeStatus(id, input);
  },

  async delete(id: string) {
    const storage = getStorageProvider();
    const storageKeys = await productRepository.deleteWithImages(id);

    if (storageKeys === null) {
      throw new NotFoundError(ProductErrorCode.NOT_FOUND, "Product not found");
    }

    const results = await Promise.allSettled(storageKeys.map((key) => storage.delete(key)));

    for (const result of results) {
      if (result.status === "rejected") {
        console.error("Failed to delete product image from storage", result.reason);
      }
    }

    return { id };
  },
};
