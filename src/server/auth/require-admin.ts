import "server-only";

import { UnauthorizedError } from "@/server/errors/app-error";
import { AuthErrorCode } from "./auth.errors";
import { getCurrentAdmin } from "./get-current-admin";

export async function requireAdmin() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    throw new UnauthorizedError(AuthErrorCode.AUTHENTICATION_REQUIRED, "Authentication required");
  }

  return admin;
}
