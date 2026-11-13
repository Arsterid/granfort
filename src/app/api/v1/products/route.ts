import { requireAdmin } from "@/server/auth/require-admin";
import { handleApiError } from "@/server/http/handle-api-error";
import { parseJsonBody } from "@/server/http/parse-json-body";

import { toAdminProductDto, toPublicProductDto } from "@/server/products/product.dto";
import { createProductSchema } from "@/server/products/product.schema";
import { productService } from "@/server/products/product.service";

export const runtime = "nodejs";

export async function GET() {
  try {
    const products = await productService.getPublished();

    return Response.json({
      data: products.map(toPublicProductDto),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const input = await parseJsonBody(request, createProductSchema);
    const product = await productService.create(input);

    return Response.json(
      {
        data: toAdminProductDto(product),
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
