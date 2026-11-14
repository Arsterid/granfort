"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { adminQueryKeys } from "@/lib/query/query-keys";

import {
  createVehicleModel,
  deleteVehicleModel,
  getVehicleModel,
  getVehicleModels,
  updateVehicleModel,
} from "@/lib/api/resources/vehicle-models";

import type {
  CreateVehicleModelInput,
  UpdateVehicleModelInput,
} from "@/server/vehicle-models/vehicle-model.schema";

export function useVehicleModels(brandId?: string, enabled = true) {
  return useQuery({
    queryKey: adminQueryKeys.vehicleModels.list(brandId ? { brandId } : {}),
    queryFn: ({ signal }) => getVehicleModels(brandId, signal),
    enabled,
  });
}

export function useVehicleModel(id: string) {
  return useQuery({
    queryKey: adminQueryKeys.vehicleModels.detail(id),
    queryFn: ({ signal }) => getVehicleModel(id, signal),
    enabled: Boolean(id),
  });
}

export function useCreateVehicleModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateVehicleModelInput) => createVehicleModel(input),

    onSuccess: async (model) => {
      queryClient.setQueryData(adminQueryKeys.vehicleModels.detail(model.id), model);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: adminQueryKeys.vehicleModels.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: adminQueryKeys.vehicleBrands.lists(),
        }),
      ]);
    },
  });
}

export function useUpdateVehicleModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateVehicleModelInput }) =>
      updateVehicleModel(id, input),

    onSuccess: async (model) => {
      queryClient.setQueryData(adminQueryKeys.vehicleModels.detail(model.id), model);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: adminQueryKeys.vehicleModels.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: adminQueryKeys.vehicleVariants.all(),
        }),
        queryClient.invalidateQueries({
          queryKey: adminQueryKeys.products.all(),
        }),
      ]);
    },
  });
}

export function useDeleteVehicleModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVehicleModel,

    onSuccess: async (_, id) => {
      queryClient.removeQueries({
        queryKey: adminQueryKeys.vehicleModels.detail(id),
        exact: true,
      });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: adminQueryKeys.vehicleModels.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: adminQueryKeys.vehicleBrands.lists(),
        }),
      ]);
    },
  });
}
