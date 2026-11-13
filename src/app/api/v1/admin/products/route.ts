import { requireAdmin } from "@/server/auth/require-admin";
import { handleApiError } from "@/server/http/handle-api-error";

import { toAdminProductDto } from "@/server/products/product.dto";
import { productService } from "@/server/products/product.service";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdmin();

    const products = await productService.getAllForAdmin();

    return Response.json({
      data: products.map(toAdminProductDto),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
