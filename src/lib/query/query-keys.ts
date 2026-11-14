const adminRoot = ["admin"] as const;

export type VehicleModelFilters = {
  brandId?: string;
};

export type VehicleVariantFilters = {
  vehicleModelId?: string;
};

export const adminQueryKeys = {
  all: adminRoot,
  overview: () => [...adminRoot, "overview"] as const,

  products: {
    all: () => [...adminRoot, "products"] as const,
    lists: () => [...adminQueryKeys.products.all(), "list"] as const,
    list: () => [...adminQueryKeys.products.lists()] as const,
    details: () => [...adminQueryKeys.products.all(), "detail"] as const,
    detail: (id: string) => [...adminQueryKeys.products.details(), id] as const,
  },

  vehicleBrands: {
    all: () => [...adminRoot, "vehicle-brands"] as const,
    lists: () => [...adminQueryKeys.vehicleBrands.all(), "list"] as const,
    list: () => [...adminQueryKeys.vehicleBrands.lists()] as const,
    details: () => [...adminQueryKeys.vehicleBrands.all(), "detail"] as const,
    detail: (id: string) => [...adminQueryKeys.vehicleBrands.details(), id] as const,
  },

  vehicleModels: {
    all: () => [...adminRoot, "vehicle-models"] as const,
    lists: () => [...adminQueryKeys.vehicleModels.all(), "list"] as const,
    list: (filters: VehicleModelFilters = {}) =>
      [...adminQueryKeys.vehicleModels.lists(), filters] as const,
    details: () => [...adminQueryKeys.vehicleModels.all(), "detail"] as const,
    detail: (id: string) => [...adminQueryKeys.vehicleModels.details(), id] as const,
  },

  vehicleVariants: {
    all: () => [...adminRoot, "vehicle-variants"] as const,
    lists: () => [...adminQueryKeys.vehicleVariants.all(), "list"] as const,
    list: (filters: VehicleVariantFilters = {}) =>
      [...adminQueryKeys.vehicleVariants.lists(), filters] as const,
    details: () => [...adminQueryKeys.vehicleVariants.all(), "detail"] as const,
    detail: (id: string) => [...adminQueryKeys.vehicleVariants.details(), id] as const,
  },
};
