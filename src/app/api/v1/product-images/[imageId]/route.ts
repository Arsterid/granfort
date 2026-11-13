import { handleApiError } from "@/server/http/handle-api-error";
import { mediaService } from "@/server/media/media.service";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    imageId: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { imageId } = await context.params;
    const file = await mediaService.getPublicProductImage(imageId);

    const body = new Uint8Array(file.data.byteLength);
    body.set(file.data);

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": file.contentType,
        "Cache-Control": "public, max-age=300",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
