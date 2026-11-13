import { z } from "zod";

import { ValidationError } from "@/server/errors/app-error";

export async function parseJsonBody<T extends z.ZodType>(
  request: Request,
  schema: T
): Promise<z.output<T>> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    throw new ValidationError("INVALID_JSON", "Request body must be valid JSON");
  }

  return schema.parse(body);
}
