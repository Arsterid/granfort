export type ProductStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type ProductImage = {
  id: string;
  url: string;
  altText: string | null;
  sortOrder: number;
};

export type ProductEditorData = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  description: string | null;
  sortOrder: number;
  status: ProductStatus;
  images: ProductImage[];
  compatibilities: Array<{
    vehicleVariantId: string;
  }>;
};
