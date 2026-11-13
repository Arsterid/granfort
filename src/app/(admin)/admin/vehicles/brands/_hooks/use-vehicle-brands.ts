"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { adminQueryKeys } from "@/lib/query/query-keys";

import {
  createVehicleBrand,
  deleteVehicleBrand,
  getVehicleBrand,
  getVehicleBrands,
  updateVehicleBrand,
} from "@/lib/api/resources/vehicle-brands";

import type {
  CreateVehicleBrandInput,
  UpdateVehicleBrandInput,
} from "@/server/vehicle-brands/vehicle-brand.schema";

export function useVehicleBrands() {
  return useQuery({
    queryKey: adminQueryKeys.vehicleBrands.list(),
    queryFn: ({ signal }) => getVehicleBrands(signal),
  });
}

export function useVehicleBrand(id: string) {
  return useQuery({
    queryKey: adminQueryKeys.vehicleBrands.detail(id),
    queryFn: ({ signal }) => getVehicleBrand(id, signal),
  });
}

export function useCreateVehicleBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateVehicleBrandInput) => createVehicleBrand(input),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminQueryKeys.vehicleBrands.lists(),
      });
    },
  });
}

export function useUpdateVehicleBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateVehicleBrandInput }) =>
      updateVehicleBrand(id, input),

    onSuccess: async (brand) => {
      queryClient.setQueryData(adminQueryKeys.vehicleBrands.detail(brand.id), brand);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: adminQueryKeys.vehicleBrands.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: adminQueryKeys.vehicleModels.all(),
        }),
        queryClient.invalidateQueries({
          queryKey: adminQueryKeys.vehicleVariants.all(),
        }),
      ]);
    },
  });
}

export function useDeleteVehicleBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteVehicleBrand(id),

    onSuccess: async (_, id) => {
      queryClient.removeQueries({
        queryKey: adminQueryKeys.vehicleBrands.detail(id),
        exact: true,
      });

      await queryClient.invalidateQueries({
        queryKey: adminQueryKeys.vehicleBrands.lists(),
      });
    },
  });
}
