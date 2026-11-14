import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { createProductSchema, updateProductSchema } from "@/server/products/product.schema";

import { adminProductDtoSchema, publicProductDtoSchema } from "@/server/products/product.dto";
import { vehicleBrandDtoSchema } from "../vehicle-brands/vehicle-brand.dto";
import {
  createVehicleBrandSchema,
  updateVehicleBrandSchema,
} from "../vehicle-brands/vehicle-brand.schema";
import { vehicleModelDtoSchema } from "../vehicle-models/vehicle-model.dto";
import {
  createVehicleModelSchema,
  updateVehicleModelSchema,
} from "../vehicle-models/vehicle-model.schema";
import { vehicleVariantDtoSchema } from "../vehicle-variants/vehicle-variant.dto";
import {
  createVehicleVariantSchema,
  listVehicleVariantsQuerySchema,
  updateVehicleVariantSchema,
} from "../vehicle-variants/vehicle-variant.schema";
import { adminOverviewDtoSchema } from "../admin-overview/admin-overview.dto";

export const registry = new OpenAPIRegistry();

const PublicProduct = publicProductDtoSchema.meta({
  id: "PublicProduct",
});

const AdminProduct = adminProductDtoSchema.meta({
  id: "AdminProduct",
});

const AdminProductResponse = z
  .strictObject({
    data: AdminProduct,
  })
  .meta({
    id: "AdminProductResponse",
  });

const AdminProductsResponse = z
  .strictObject({
    data: z.array(AdminProduct),
  })
  .meta({
    id: "AdminProductsResponse",
  });

const ApiErrorResponse = z
  .strictObject({
    error: z.strictObject({
      code: z.string(),
      message: z.string(),
      details: z
        .array(
          z.strictObject({
            path: z.string(),
            message: z.string(),
          })
        )
        .optional(),
    }),
  })
  .meta({
    id: "ApiErrorResponse",
  });

const ProductIdParams = z
  .object({
    id: z.uuid(),
  })
  .meta({
    id: "ProductIdParams",
  });

const authSession = registry.registerComponent("securitySchemes", "AuthJsSession", {
  type: "apiKey",
  in: "cookie",
  name: "authjs.session-token",
  description: "Auth.js session cookie",
});

const VehicleBrand = vehicleBrandDtoSchema.meta({
  id: "VehicleBrand",
});

const VehicleBrandResponse = z
  .strictObject({
    data: VehicleBrand,
  })
  .meta({
    id: "VehicleBrandResponse",
  });

const VehicleBrandsResponse = z
  .strictObject({
    data: z.array(VehicleBrand),
  })
  .meta({
    id: "VehicleBrandsResponse",
  });

const VehicleBrandIdParams = z
  .object({
    id: z.uuid(),
  })
  .meta({
    id: "VehicleBrandIdParams",
  });

const VehicleModel = vehicleModelDtoSchema.meta({
  id: "VehicleModel",
});

const VehicleModelResponse = z
  .strictObject({
    data: VehicleModel,
  })
  .meta({
    id: "VehicleModelResponse",
  });

const VehicleModelsResponse = z
  .strictObject({
    data: z.array(VehicleModel),
  })
  .meta({
    id: "VehicleModelsResponse",
  });

const VehicleModelIdParams = z
  .object({
    id: z.uuid(),
  })
  .meta({
    id: "VehicleModelIdParams",
  });

const VehicleVariant = vehicleVariantDtoSchema.meta({
  id: "VehicleVariant",
});

const VehicleVariantResponse = z
  .strictObject({
    data: VehicleVariant,
  })
  .meta({
    id: "VehicleVariantResponse",
  });

const VehicleVariantsResponse = z
  .strictObject({
    data: z.array(VehicleVariant),
  })
  .meta({
    id: "VehicleVariantsResponse",
  });

const VehicleVariantIdParams = z
  .object({
    id: z.uuid(),
  })
  .meta({
    id: "VehicleVariantIdParams",
  });

const AdminOverview = adminOverviewDtoSchema.meta({
  id: "AdminOverview",
});

const AdminOverviewResponse = z
  .strictObject({
    data: AdminOverview,
  })
  .meta({
    id: "AdminOverviewResponse",
  });

registry.registerPath({
  method: "get",
  path: "/api/v1/products",
  operationId: "getPublishedProducts",
  tags: ["Products"],
  summary: "Get published products",
  description: "Returns published products with images and compatible vehicles.",

  responses: {
    200: {
      description: "Published products",
      content: {
        "application/json": {
          schema: z.strictObject({
            data: z.array(PublicProduct),
          }),
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/admin/products",
  operationId: "getAdminProducts",
  tags: ["Products"],
  summary: "Get all products for administration",
  description:
    "Returns all products, including drafts, published and archived products. Requires administrator authentication.",

  security: [
    {
      [authSession.name]: [],
    },
  ],

  responses: {
    200: {
      description: "All products",
      content: {
        "application/json": {
          schema: AdminProductsResponse,
        },
      },
    },
    401: {
      description: "Authentication required",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/products",
  operationId: "createProduct",
  tags: ["Products"],
  summary: "Create a product",
  description: "Creates a product in DRAFT status. Requires administrator authentication.",

  security: [
    {
      [authSession.name]: [],
    },
  ],

  request: {
    body: {
      description: "Product creation data",
      required: true,
      content: {
        "application/json": {
          schema: createProductSchema.meta({
            id: "CreateProductRequest",
          }),
        },
      },
    },
  },

  responses: {
    201: {
      description: "Product successfully created",
      content: {
        "application/json": {
          schema: AdminProductResponse,
        },
      },
    },
    400: {
      description: "Invalid request body",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
    401: {
      description: "Authentication required",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
    404: {
      description: "Vehicle variant not found",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
    409: {
      description: "Product conflicts with existing data",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/products/{id}",
  operationId: "getProductById",
  tags: ["Products"],
  summary: "Get product by ID",
  security: [{ [authSession.name]: [] }],

  request: {
    params: ProductIdParams,
  },

  responses: {
    200: {
      description: "Product details",
      content: {
        "application/json": {
          schema: AdminProductResponse,
        },
      },
    },
    401: {
      description: "Authentication required",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
    404: {
      description: "Product not found",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
  },
});

registry.registerPath({
  method: "patch",
  path: "/api/v1/products/{id}",
  operationId: "updateProduct",
  tags: ["Products"],
  summary: "Update product",
  security: [{ [authSession.name]: [] }],

  request: {
    params: ProductIdParams,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateProductSchema.meta({
            id: "UpdateProductRequest",
          }),
        },
      },
    },
  },

  responses: {
    200: {
      description: "Product updated",
      content: {
        "application/json": {
          schema: AdminProductResponse,
        },
      },
    },
    400: {
      description: "Invalid request",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
    401: {
      description: "Authentication required",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
    404: {
      description: "Product not found",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
    409: {
      description: "Product conflicts with existing data",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/v1/products/{id}",
  operationId: "deleteProduct",
  tags: ["Products"],
  summary: "Delete product",
  security: [{ [authSession.name]: [] }],

  request: {
    params: ProductIdParams,
  },

  responses: {
    204: {
      description: "Product deleted",
    },
    401: {
      description: "Authentication required",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
    404: {
      description: "Product not found",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/vehicle-brands",
  operationId: "getVehicleBrands",
  tags: ["Vehicle Brands"],
  summary: "Get vehicle brands",
  responses: {
    200: {
      description: "Vehicle brands",
      content: {
        "application/json": {
          schema: VehicleBrandsResponse,
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/vehicle-brands",
  operationId: "createVehicleBrand",
  tags: ["Vehicle Brands"],
  summary: "Create vehicle brand",
  security: [{ [authSession.name]: [] }],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createVehicleBrandSchema.meta({
            id: "CreateVehicleBrandRequest",
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: "Vehicle brand created",
      content: {
        "application/json": {
          schema: VehicleBrandResponse,
        },
      },
    },
    400: {
      description: "Invalid request",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
    401: {
      description: "Authentication required",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
    409: {
      description: "Vehicle brand already exists",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/vehicle-brands/{id}",
  operationId: "getVehicleBrandById",
  tags: ["Vehicle Brands"],
  summary: "Get vehicle brand",
  request: {
    params: VehicleBrandIdParams,
  },
  responses: {
    200: {
      description: "Vehicle brand details",
      content: {
        "application/json": {
          schema: VehicleBrandResponse,
        },
      },
    },
    404: {
      description: "Vehicle brand not found",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
  },
});

registry.registerPath({
  method: "patch",
  path: "/api/v1/vehicle-brands/{id}",
  operationId: "updateVehicleBrand",
  tags: ["Vehicle Brands"],
  summary: "Update vehicle brand",
  security: [{ [authSession.name]: [] }],
  request: {
    params: VehicleBrandIdParams,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateVehicleBrandSchema.meta({
            id: "UpdateVehicleBrandRequest",
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Vehicle brand updated",
      content: {
        "application/json": {
          schema: VehicleBrandResponse,
        },
      },
    },
    400: {
      description: "Invalid request",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
    401: {
      description: "Authentication required",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
    404: {
      description: "Vehicle brand not found",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
    409: {
      description: "Vehicle brand conflicts with existing data",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/v1/vehicle-brands/{id}",
  operationId: "deleteVehicleBrand",
  tags: ["Vehicle Brands"],
  summary: "Delete vehicle brand",
  security: [{ [authSession.name]: [] }],
  request: {
    params: VehicleBrandIdParams,
  },
  responses: {
    204: {
      description: "Vehicle brand deleted",
    },
    401: {
      description: "Authentication required",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
    404: {
      description: "Vehicle brand not found",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
    409: {
      description: "Vehicle brand has associated models",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/vehicle-models",
  operationId: "getVehicleModels",
  tags: ["Vehicle Models"],
  summary: "Get vehicle models",
  description: "Returns vehicle models. Optionally filtered by brandId.",
  request: {
    query: z.object({
      brandId: z.uuid().optional(),
    }),
  },
  responses: {
    200: {
      description: "Vehicle models",
      content: {
        "application/json": {
          schema: VehicleModelsResponse,
        },
      },
    },
    400: {
      description: "Invalid query parameters",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/vehicle-models",
  operationId: "createVehicleModel",
  tags: ["Vehicle Models"],
  summary: "Create vehicle model",
  security: [{ [authSession.name]: [] }],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createVehicleModelSchema.meta({
            id: "CreateVehicleModelRequest",
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: "Vehicle model created",
      content: {
        "application/json": {
          schema: VehicleModelResponse,
        },
      },
    },
    400: {
      description: "Invalid request",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
    401: {
      description: "Authentication required",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
    404: {
      description: "Vehicle brand not found",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
    409: {
      description: "Vehicle model already exists",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/vehicle-models/{id}",
  operationId: "getVehicleModelById",
  tags: ["Vehicle Models"],
  summary: "Get vehicle model",
  request: {
    params: VehicleModelIdParams,
  },
  responses: {
    200: {
      description: "Vehicle model details",
      content: {
        "application/json": {
          schema: VehicleModelResponse,
        },
      },
    },
    404: {
      description: "Vehicle model not found",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
  },
});

registry.registerPath({
  method: "patch",
  path: "/api/v1/vehicle-models/{id}",
  operationId: "updateVehicleModel",
  tags: ["Vehicle Models"],
  summary: "Update vehicle model",
  security: [{ [authSession.name]: [] }],
  request: {
    params: VehicleModelIdParams,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateVehicleModelSchema.meta({
            id: "UpdateVehicleModelRequest",
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Vehicle model updated",
      content: {
        "application/json": {
          schema: VehicleModelResponse,
        },
      },
    },
    404: {
      description: "Vehicle model not found",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
    409: {
      description: "Vehicle model conflicts with existing data",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/v1/vehicle-models/{id}",
  operationId: "deleteVehicleModel",
  tags: ["Vehicle Models"],
  summary: "Delete vehicle model",
  security: [{ [authSession.name]: [] }],
  request: {
    params: VehicleModelIdParams,
  },
  responses: {
    204: {
      description: "Vehicle model deleted",
    },
    401: {
      description: "Authentication required",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
    404: {
      description: "Vehicle model not found",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
    409: {
      description: "Vehicle model has associated variants",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/vehicle-variants",
  operationId: "getVehicleVariants",
  tags: ["Vehicle Variants"],
  summary: "Get vehicle variants",
  description: "Returns vehicle variants, optionally filtered by vehicleModelId.",
  request: {
    query: listVehicleVariantsQuerySchema,
  },
  responses: {
    200: {
      description: "Vehicle variants",
      content: {
        "application/json": {
          schema: VehicleVariantsResponse,
        },
      },
    },
    400: {
      description: "Invalid query parameters",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/vehicle-variants",
  operationId: "createVehicleVariant",
  tags: ["Vehicle Variants"],
  summary: "Create vehicle variant",
  security: [{ [authSession.name]: [] }],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createVehicleVariantSchema.meta({
            id: "CreateVehicleVariantRequest",
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: "Vehicle variant created",
      content: {
        "application/json": {
          schema: VehicleVariantResponse,
        },
      },
    },
    400: {
      description: "Invalid request",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
    401: {
      description: "Authentication required",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
    404: {
      description: "Vehicle model not found",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/vehicle-variants/{id}",
  operationId: "getVehicleVariantById",
  tags: ["Vehicle Variants"],
  summary: "Get vehicle variant",
  request: {
    params: VehicleVariantIdParams,
  },
  responses: {
    200: {
      description: "Vehicle variant details",
      content: {
        "application/json": {
          schema: VehicleVariantResponse,
        },
      },
    },
    404: {
      description: "Vehicle variant not found",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
  },
});

registry.registerPath({
  method: "patch",
  path: "/api/v1/vehicle-variants/{id}",
  operationId: "updateVehicleVariant",
  tags: ["Vehicle Variants"],
  summary: "Update vehicle variant",
  security: [{ [authSession.name]: [] }],
  request: {
    params: VehicleVariantIdParams,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: updateVehicleVariantSchema.meta({
            id: "UpdateVehicleVariantRequest",
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Vehicle variant updated",
      content: {
        "application/json": {
          schema: VehicleVariantResponse,
        },
      },
    },
    400: {
      description: "Invalid request",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
    401: {
      description: "Authentication required",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
    404: {
      description: "Vehicle variant not found",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
    409: {
      description: "Vehicle variant is associated with products",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
    422: {
      description: "Invalid year range",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/v1/vehicle-variants/{id}",
  operationId: "deleteVehicleVariant",
  tags: ["Vehicle Variants"],
  summary: "Delete vehicle variant",
  security: [{ [authSession.name]: [] }],
  request: {
    params: VehicleVariantIdParams,
  },
  responses: {
    204: {
      description: "Vehicle variant deleted",
    },
    401: {
      description: "Authentication required",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
    404: {
      description: "Vehicle variant not found",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
    409: {
      description: "Vehicle variant is associated with products",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/products/{id}/images",
  tags: ["Products"],
  summary: "Upload product image",
  description: "Upload a JPEG, PNG or WebP image for a product. Maximum size: 10 MB.",
  security: [{ AuthJsSession: [] }],
  request: {
    params: z.object({
      id: z.uuid(),
    }),
    body: {
      description: "Image file and optional alternative text",
      required: true,
      content: {
        "multipart/form-data": {
          schema: z.object({
            file: z.string().meta({
              format: "binary",
              description: "JPEG, PNG or WebP image, up to 10 MB",
            }),
            altText: z.string().max(500).optional(),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: "Image uploaded successfully",
      content: {
        "application/json": {
          schema: z.object({
            id: z.uuid(),
            productId: z.uuid(),
            altText: z.string().nullable(),
            sortOrder: z.number().int(),
            createdAt: z.iso.datetime(),
          }),
        },
      },
    },
    400: {
      description: "Invalid request or unsupported image",
    },
    401: {
      description: "Unauthorized",
    },
    409: {
      description: "Resource conflict",
    },
    500: {
      description: "Internal server error",
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/v1/products/{id}/images/{imageId}",
  tags: ["Products"],
  summary: "Delete product image",
  description: "Delete a product image from storage and database.",
  security: [{ AuthJsSession: [] }],
  request: {
    params: z.object({
      id: z.uuid(),
      imageId: z.uuid(),
    }),
  },
  responses: {
    200: {
      description: "Image deleted successfully",
      content: {
        "application/json": {
          schema: z.object({
            id: z.uuid(),
          }),
        },
      },
    },
    401: {
      description: "Unauthorized",
    },
    404: {
      description: "Product or image not found",
    },
    500: {
      description: "Internal server error",
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/product-images/{imageId}",
  tags: ["Products"],
  summary: "Get product image",
  description: "Retrieve an image belonging to a published product.",
  request: {
    params: z.object({
      imageId: z.uuid(),
    }),
  },
  responses: {
    200: {
      description: "Image retrieved successfully",
      content: {
        "image/jpeg": {
          schema: z.string().meta({ format: "binary" }),
        },
        "image/png": {
          schema: z.string().meta({ format: "binary" }),
        },
        "image/webp": {
          schema: z.string().meta({ format: "binary" }),
        },
      },
    },
    400: {
      description: "Invalid image ID",
    },
    404: {
      description: "Image not found",
    },
    500: {
      description: "Internal server error",
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/products/{id}/images/{imageId}",
  tags: ["Products"],
  summary: "Get product image (admin)",
  description:
    "Retrieve an image of any product, including drafts and archived products. Admin authentication required.",
  security: [{ AuthJsSession: [] }],
  request: {
    params: z.object({
      id: z.uuid(),
      imageId: z.uuid(),
    }),
  },
  responses: {
    200: {
      description: "Image retrieved successfully",
      content: {
        "image/jpeg": {
          schema: z.string().meta({ format: "binary" }),
        },
        "image/png": {
          schema: z.string().meta({ format: "binary" }),
        },
        "image/webp": {
          schema: z.string().meta({ format: "binary" }),
        },
      },
    },
    401: {
      description: "Unauthorized",
    },
    404: {
      description: "Image not found",
    },
    500: {
      description: "Internal server error",
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/admin/overview",
  operationId: "getAdminOverview",
  tags: ["Admin"],
  summary: "Get admin overview",
  description:
    "Returns aggregated statistics for the product and vehicle catalogs, " +
    "products requiring attention, and recently updated products.",

  security: [{ [authSession.name]: [] }],

  responses: {
    200: {
      description: "Administrative catalog overview",
      content: {
        "application/json": {
          schema: AdminOverviewResponse,
        },
      },
    },

    401: {
      description: "Authentication required",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },

    403: {
      description: "Administrator access required",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },

    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: ApiErrorResponse,
        },
      },
    },
  },
});
