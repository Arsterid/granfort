export const VehicleBrandErrorCode = {
  NOT_FOUND: "VEHICLE_BRAND_NOT_FOUND",
  NAME_ALREADY_EXISTS: "VEHICLE_BRAND_NAME_ALREADY_EXISTS",
  SLUG_ALREADY_EXISTS: "VEHICLE_BRAND_SLUG_ALREADY_EXISTS",
  HAS_MODELS: "VEHICLE_BRAND_HAS_MODELS",
} as const;

export type VehicleBrandErrorCode =
  (typeof VehicleBrandErrorCode)[keyof typeof VehicleBrandErrorCode];
