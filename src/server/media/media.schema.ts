import { z } from "zod";

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export const uploadProductImageSchema = z.object({
  productId: z.uuid(),
  altText: z.string().trim().max(500).optional(),
});

export const imageDataSchema = z
  .instanceof(Uint8Array)
  .refine((data) => data.byteLength > 0, {
    error: "Image file is empty",
  })
  .refine((data) => data.byteLength <= MAX_IMAGE_SIZE, {
    error: "Image file must not exceed 10 MB",
  });

export const uploadProductImageFormSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, {
      error: "Image file is empty",
    })
    .refine((file) => file.size <= MAX_IMAGE_SIZE, {
      error: "Image file must not exceed 10 MB",
    }),
  altText: z.string().trim().max(500).optional(),
});

export type UploadProductImageInput = z.infer<typeof uploadProductImageSchema>;
