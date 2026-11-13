import { Prisma } from "@/generated/prisma/client";

import { ConflictError, NotFoundError } from "./app-error";

import type { AppError } from "./app-error";

export type PrismaConstraintErrors = Readonly<Record<string, () => AppError>>;

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== "object" || value === null) {
    return undefined;
  }

  return value as Record<string, unknown>;
}

export function getPrismaConstraintName(
  error: Prisma.PrismaClientKnownRequestError
): string | undefined {
  const meta = asRecord(error.meta);
  const adapterError = asRecord(meta?.driverAdapterError);
  const cause = asRecord(adapterError?.cause);
  const constraint = asRecord(cause?.constraint);

  const index = constraint?.index;

  return typeof index === "string" ? index : undefined;
}

export function createPrismaExecutor(constraintErrors?: PrismaConstraintErrors) {
  return async function execute<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
        throw error;
      }

      if (error.code === "P2002") {
        const constraint = getPrismaConstraintName(error);
        const mappedError = constraint ? constraintErrors?.[constraint]?.() : undefined;

        if (mappedError) {
          throw mappedError;
        }
      }

      switch (error.code) {
        case "P2002":
          throw new ConflictError(
            "UNIQUE_CONSTRAINT_VIOLATION",
            "A record with this value already exists"
          );

        case "P2003":
          throw new ConflictError(
            "RELATION_CONSTRAINT_VIOLATION",
            "The operation conflicts with related records"
          );

        case "P2025":
          throw new NotFoundError("RECORD_NOT_FOUND", "The requested record was not found");

        default:
          throw error;
      }
    }
  };
}
