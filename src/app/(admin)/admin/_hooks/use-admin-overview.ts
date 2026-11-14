"use client";

import { useQuery } from "@tanstack/react-query";

import { getAdminOverview } from "@/lib/api/resources/admin-overview";
import { adminQueryKeys } from "@/lib/query/query-keys";

export function useAdminOverview() {
  return useQuery({
    queryKey: adminQueryKeys.overview(),
    queryFn: ({ signal }) => getAdminOverview(signal),
  });
}
