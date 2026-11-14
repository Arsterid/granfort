import { apiRequest, type ApiDataResponse } from "@/lib/api/api-client";

import type { AdminOverviewDto } from "@/server/admin-overview/admin-overview.dto";

export async function getAdminOverview(signal?: AbortSignal) {
  const response = await apiRequest<ApiDataResponse<AdminOverviewDto>>("/api/v1/admin/overview", {
    signal,
    cache: "no-store",
  });

  return response.data;
}
