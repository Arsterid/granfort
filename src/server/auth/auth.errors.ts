export const AuthErrorCode = {
  AUTHENTICATION_REQUIRED: "AUTHENTICATION_REQUIRED",
} as const;

export type AuthErrorCode = (typeof AuthErrorCode)[keyof typeof AuthErrorCode];
