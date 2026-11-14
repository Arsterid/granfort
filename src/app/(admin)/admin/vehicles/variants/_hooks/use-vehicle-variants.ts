"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { adminQueryKeys } from "@/lib/query/query-keys";

import {
  createVehicleVariant,
  deleteVehicleVariant,
  getVehicleVariant,
  getVehicleVariants,
  updateVehicleVariant,
} from "@/lib/api/resources/vehicle-variants";

import type {
  CreateVehicleVariantInput,
  UpdateVehicleVariantInput,
} from "@/server/vehicle-variants/vehicle-variant.schema";

export function useVehicleVariants(vehicleModelId?: string) {
  return useQuery({
    queryKey: adminQueryKeys.vehicleVariants.list(vehicleModelId ? { vehicleModelId } : {}),
    queryFn: ({ signal }) => getVehicleVariants(vehicleModelId, signal),
  });
}

export function useVehicleVariant(id: string) {
  return useQuery({
    queryKey: adminQueryKeys.vehicleVariants.detail(id),
    queryFn: ({ signal }) => getVehicleVariant(id, signal),
    enabled: Boolean(id),
  });
}

export function useCreateVehicleVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateVehicleVariantInput) => createVehicleVariant(input),

    onSuccess: async (variant) => {
      queryClient.setQueryData(adminQueryKeys.vehicleVariants.detail(variant.id), variant);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: adminQueryKeys.vehicleVariants.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: adminQueryKeys.vehicleModels.lists(),
        }),
      ]);
    },
  });
}

export function useUpdateVehicleVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateVehicleVariantInput }) =>
      updateVehicleVariant(id, input),

    onSuccess: async (variant) => {
      queryClient.setQueryData(adminQueryKeys.vehicleVariants.detail(variant.id), variant);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: adminQueryKeys.vehicleVariants.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: adminQueryKeys.products.all(),
        }),
      ]);
    },
  });
}

export function useDeleteVehicleVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVehicleVariant,

    onSuccess: async (_, id) => {
      queryClient.removeQueries({
        queryKey: adminQueryKeys.vehicleVariants.detail(id),
        exact: true,
      });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: adminQueryKeys.vehicleVariants.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: adminQueryKeys.vehicleModels.lists(),
        }),
      ]);
    },
  });
}
