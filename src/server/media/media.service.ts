import { getStorageProvider } from "@/server/storage/storage";
import type { StorageContentType } from "@/server/storage/storage-provider";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { NotFoundError } from "../errors/app-error";
import { MediaErrorCode } from "./media.errors";
import { mediaRepository } from "./media.repository";
import {
  imageDataSchema,
  uploadProductImageSchema,
  type UploadProductImageInput,
} from "./media.schema";

const imageContentTypeSchema = z.enum(["image/jpeg", "image/png", "image/webp"]);

const extensionByContentType: Record<StorageContentType, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

function detectContentType(data: Uint8Array): StorageContentType | null {
  const isJpeg = data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff;

  const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

  const isPng =
    data.length >= pngSignature.length && pngSignature.every((byte, index) => data[index] === byte);

  const isWebp =
    data.length >= 12 &&
    data[0] === 0x52 &&
    data[1] === 0x49 &&
    data[2] === 0x46 &&
    data[3] === 0x46 &&
    data[8] === 0x57 &&
    data[9] === 0x45 &&
    data[10] === 0x42 &&
    data[11] === 0x50;

  if (isJpeg) return "image/jpeg";
  if (isPng) return "image/png";
  if (isWebp) return "image/webp";

  return null;
}

export const mediaService = {
  async uploadProductImage(input: UploadProductImageInput & { data: Uint8Array }) {
    const metadata = uploadProductImageSchema.parse(input);
    const data = imageDataSchema.parse(input.data);

    const contentType = imageContentTypeSchema.parse(detectContentType(data));

    const extension = extensionByContentType[contentType];
    const storageKey = `products/${metadata.productId}/${randomUUID()}${extension}`;

    const storage = getStorageProvider();

    await storage.save({
      key: storageKey,
      data,
      contentType,
    });

    try {
      return await mediaRepository.createProductImage({
        productId: metadata.productId,
        storageKey,
        altText: metadata.altText || null,
      });
    } catch (error) {
      try {
        await storage.delete(storageKey);
      } catch (cleanupError) {
        console.error("Failed to clean up uploaded image after database error", cleanupError);
      }

      throw error;
    }
  },

  async deleteProductImage(input: { productId: string; imageId: string }) {
    const image = await mediaRepository.findProductImage(input);

    if (!image) {
      throw new NotFoundError(MediaErrorCode.PRODUCT_IMAGE_NOT_FOUND, "Product image not found");
    }

    const storage = getStorageProvider();

    await storage.delete(image.storageKey);

    const result = await mediaRepository.deleteProductImage(input);

    if (result.count === 0) {
      throw new NotFoundError(MediaErrorCode.PRODUCT_IMAGE_NOT_FOUND, "Product image not found");
    }

    return {
      id: image.id,
    };
  },

  async getPublicProductImage(imageId: string) {
    const parsedImageId = z.uuid().parse(imageId);

    const image = await mediaRepository.findPublicProductImage(parsedImageId);

    if (!image) {
      throw new NotFoundError(MediaErrorCode.PRODUCT_IMAGE_NOT_FOUND, "Product image not found");
    }

    const file = await getStorageProvider().read(image.storageKey);

    if (!file) {
      console.error("Product image file is missing from storage", {
        imageId: parsedImageId,
      });

      throw new NotFoundError(MediaErrorCode.PRODUCT_IMAGE_NOT_FOUND, "Product image not found");
    }

    return file;
  },

  async getProductImage(input: { productId: string; imageId: string }) {
    const productId = z.uuid().parse(input.productId);
    const imageId = z.uuid().parse(input.imageId);

    const image = await mediaRepository.findProductImage({
      productId,
      imageId,
    });

    if (!image) {
      throw new NotFoundError(MediaErrorCode.PRODUCT_IMAGE_NOT_FOUND, "Product image not found");
    }

    const file = await getStorageProvider().read(image.storageKey);

    if (!file) {
      console.error("Product image file is missing from storage", {
        imageId,
      });

      throw new NotFoundError(MediaErrorCode.PRODUCT_IMAGE_NOT_FOUND, "Product image not found");
    }

    return file;
  },
};
