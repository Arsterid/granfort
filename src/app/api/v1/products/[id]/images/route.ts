import { requireAdmin } from "@/server/auth/require-admin";
import { handleApiError } from "@/server/http/handle-api-error";
import { uploadProductImageFormSchema } from "@/server/media/media.schema";
import { mediaService } from "@/server/media/media.service";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    await requireAdmin();

    const { id } = await context.params;
    const formData = await request.formData();

    const form = uploadProductImageFormSchema.parse({
      file: formData.get("file"),
      altText: formData.get("altText") ?? undefined,
    });

    const data = new Uint8Array(await form.file.arrayBuffer());

    const image = await mediaService.uploadProductImage({
      productId: id,
      altText: form.altText,
      data,
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
