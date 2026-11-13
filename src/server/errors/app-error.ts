export abstract class AppError extends Error {
  abstract readonly kind: string;

  constructor(
    public readonly code: string,
    message: string
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class ValidationError extends AppError {
  readonly kind = "VALIDATION";
}

export class UnauthorizedError extends AppError {
  readonly kind = "UNAUTHENTICATED";
}

export class ForbiddenError extends AppError {
  readonly kind = "FORBIDDEN";
}

export class NotFoundError extends AppError {
  readonly kind = "NOT_FOUND";
}

export class ConflictError extends AppError {
  readonly kind = "CONFLICT";
}

export class UnprocessableError extends AppError {
  readonly kind = "UNPROCESSABLE";
}
