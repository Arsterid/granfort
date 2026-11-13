import { requireAdmin } from "@/server/auth/require-admin";
import { handleApiError } from "@/server/http/handle-api-error";
import { parseJsonBody } from "@/server/http/parse-json-body";

import { productIdSchema, updateProductSchema } from "@/server/products/product.schema";

import { toAdminProductDto } from "@/server/products/product.dto";

import { productService } from "@/server/products/product.service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function resolveId(params: RouteContext["params"]) {
  const { id } = await params;
  return productIdSchema.parse(id);
}

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    await requireAdmin();

    const id = await resolveId(params);
    const product = await productService.getById(id);

    return Response.json({
      data: toAdminProductDto(product),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    await requireAdmin();

    const id = await resolveId(params);
    const input = await parseJsonBody(request, updateProductSchema);

    const product = await productService.update(id, input);

    return Response.json({
      data: toAdminProductDto(product),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    await requireAdmin();

    const id = await resolveId(params);

    await productService.delete(id);

    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
