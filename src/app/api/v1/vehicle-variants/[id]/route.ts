import { requireAdmin } from "@/server/auth/require-admin";
import { handleApiError } from "@/server/http/handle-api-error";
import { parseJsonBody } from "@/server/http/parse-json-body";

import {
  updateVehicleVariantSchema,
  vehicleVariantIdSchema,
} from "@/server/vehicle-variants/vehicle-variant.schema";

import { toVehicleVariantDto } from "@/server/vehicle-variants/vehicle-variant.dto";

import { vehicleVariantService } from "@/server/vehicle-variants/vehicle-variant.service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function resolveId(params: RouteContext["params"]) {
  const { id } = await params;
  return vehicleVariantIdSchema.parse(id);
}

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const id = await resolveId(params);
    const variant = await vehicleVariantService.getById(id);

    return Response.json({
      data: toVehicleVariantDto(variant),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    await requireAdmin();

    const id = await resolveId(params);

    const input = await parseJsonBody(request, updateVehicleVariantSchema);

    const variant = await vehicleVariantService.update(id, input);

    return Response.json({
      data: toVehicleVariantDto(variant),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    await requireAdmin();

    const id = await resolveId(params);

    await vehicleVariantService.delete(id);

    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
