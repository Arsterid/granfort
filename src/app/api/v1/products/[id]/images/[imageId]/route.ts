import { requireAdmin } from "@/server/auth/require-admin";
import { handleApiError } from "@/server/http/handle-api-error";
import { mediaService } from "@/server/media/media.service";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    id: string;
    imageId: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();

    const { id, imageId } = await context.params;

    const file = await mediaService.getProductImage({
      productId: id,
      imageId,
    });

    const body = new Uint8Array(file.data.byteLength);
    body.set(file.data);

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": file.contentType,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();

    const { id, imageId } = await context.params;

    const result = await mediaService.deleteProductImage({
      productId: id,
      imageId,
    });

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
