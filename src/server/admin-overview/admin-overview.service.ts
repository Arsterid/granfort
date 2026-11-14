import "server-only";

import { adminOverviewRepository } from "./admin-overview.repository";

export const adminOverviewService = {
  getForAdmin() {
    return adminOverviewRepository.getForAdmin();
  },
};
