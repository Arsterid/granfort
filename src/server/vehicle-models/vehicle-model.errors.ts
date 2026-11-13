export const VehicleModelErrorCode = {
  NOT_FOUND: "VEHICLE_MODEL_NOT_FOUND",
  BRAND_NOT_FOUND: "VEHICLE_BRAND_NOT_FOUND",
  NAME_ALREADY_EXISTS: "VEHICLE_MODEL_NAME_ALREADY_EXISTS",
  SLUG_ALREADY_EXISTS: "VEHICLE_MODEL_SLUG_ALREADY_EXISTS",
  HAS_VARIANTS: "VEHICLE_MODEL_HAS_VARIANTS",
} as const;

export type VehicleModelErrorCode =
  (typeof VehicleModelErrorCode)[keyof typeof VehicleModelErrorCode];
