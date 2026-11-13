export const VehicleVariantErrorCode = {
  NOT_FOUND: "VEHICLE_VARIANT_NOT_FOUND",
  MODEL_NOT_FOUND: "VEHICLE_MODEL_NOT_FOUND",
  HAS_PRODUCTS: "VEHICLE_VARIANT_HAS_PRODUCTS",
  INVALID_YEAR_RANGE: "VEHICLE_VARIANT_INVALID_YEAR_RANGE",
} as const;

export type VehicleVariantErrorCode =
  (typeof VehicleVariantErrorCode)[keyof typeof VehicleVariantErrorCode];
