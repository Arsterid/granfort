import { requireAdmin } from "@/server/auth/require-admin";
import { handleApiError } from "@/server/http/handle-api-error";

import { toAdminOverviewDto } from "@/server/admin-overview/admin-overview.dto";
import { adminOverviewService } from "@/server/admin-overview/admin-overview.service";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdmin();

    const overview = await adminOverviewService.getForAdmin();

    return Response.json({
      data: toAdminOverviewDto(overview),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
