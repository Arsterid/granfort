import { generateOpenApiDocument } from "@/server/openapi/document";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(generateOpenApiDocument(), {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
