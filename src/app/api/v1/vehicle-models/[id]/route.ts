import { requireAdmin } from "@/server/auth/require-admin";
import { handleApiError } from "@/server/http/handle-api-error";
import { parseJsonBody } from "@/server/http/parse-json-body";

import { toVehicleModelDto } from "@/server/vehicle-models/vehicle-model.dto";

import {
  updateVehicleModelSchema,
  vehicleModelIdSchema,
} from "@/server/vehicle-models/vehicle-model.schema";

import { vehicleModelService } from "@/server/vehicle-models/vehicle-model.service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function resolveId(params: RouteContext["params"]) {
  const { id } = await params;
  return vehicleModelIdSchema.parse(id);
}

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const id = await resolveId(params);
    const model = await vehicleModelService.getById(id);

    return Response.json({
      data: toVehicleModelDto(model),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    await requireAdmin();

    const id = await resolveId(params);

    const input = await parseJsonBody(request, updateVehicleModelSchema);

    const model = await vehicleModelService.update(id, input);

    return Response.json({
      data: toVehicleModelDto(model),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    await requireAdmin();

    const id = await resolveId(params);

    await vehicleModelService.delete(id);

    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
