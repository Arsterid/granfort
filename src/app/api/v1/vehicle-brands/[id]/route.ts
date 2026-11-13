import { requireAdmin } from "@/server/auth/require-admin";
import { handleApiError } from "@/server/http/handle-api-error";
import { parseJsonBody } from "@/server/http/parse-json-body";

import { toVehicleBrandDto } from "@/server/vehicle-brands/vehicle-brand.dto";

import {
  updateVehicleBrandSchema,
  vehicleBrandIdSchema,
} from "@/server/vehicle-brands/vehicle-brand.schema";

import { vehicleBrandService } from "@/server/vehicle-brands/vehicle-brand.service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function resolveId(params: RouteContext["params"]) {
  const { id } = await params;
  return vehicleBrandIdSchema.parse(id);
}

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const id = await resolveId(params);
    const brand = await vehicleBrandService.getById(id);

    return Response.json({
      data: toVehicleBrandDto(brand),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    await requireAdmin();

    const id = await resolveId(params);

    const input = await parseJsonBody(request, updateVehicleBrandSchema);

    const brand = await vehicleBrandService.update(id, input);

    return Response.json({
      data: toVehicleBrandDto(brand),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    await requireAdmin();

    const id = await resolveId(params);

    await vehicleBrandService.delete(id);

    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
