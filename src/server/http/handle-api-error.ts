import { ZodError } from "zod";

import {
  AppError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  UnprocessableError,
  ValidationError,
} from "@/server/errors/app-error";

function getStatusCode(error: AppError): number | undefined {
  if (error instanceof ValidationError) return 400;
  if (error instanceof UnauthorizedError) return 401;
  if (error instanceof ForbiddenError) return 403;
  if (error instanceof NotFoundError) return 404;
  if (error instanceof ConflictError) return 409;
  if (error instanceof UnprocessableError) return 422;

  return undefined;
}

export function handleApiError(error: unknown): Response {
  if (error instanceof ZodError) {
    return Response.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Request validation failed",
          details: error.issues.map((issue) => ({
            path: issue.path.map(String).join("."),
            message: issue.message,
          })),
        },
      },
      { status: 400 }
    );
  }

  if (error instanceof AppError) {
    const status = getStatusCode(error);

    if (status !== undefined) {
      return Response.json(
        {
          error: {
            code: error.code,
            message: error.message,
          },
        },
        { status }
      );
    }
  }

  console.error("Unhandled API error:", error);

  return Response.json(
    {
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
      },
    },
    { status: 500 }
  );
}
