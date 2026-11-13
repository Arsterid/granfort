import { requireAdmin } from "@/server/auth/require-admin";
import { handleApiError } from "@/server/http/handle-api-error";
import { parseJsonBody } from "@/server/http/parse-json-body";

import { changeProductStatusSchema, productIdSchema } from "@/server/products/product.schema";

import { toAdminProductDto } from "@/server/products/product.dto";
import { productService } from "@/server/products/product.service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const runtime = "nodejs";

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    await requireAdmin();

    const { id } = await params;
    const productId = productIdSchema.parse(id);

    const input = await parseJsonBody(request, changeProductStatusSchema);

    const product = await productService.changeStatus(productId, input);

    return Response.json({
      data: toAdminProductDto(product),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
