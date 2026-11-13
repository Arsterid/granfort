import { requireAdmin } from "@/server/auth/require-admin";
import { handleApiError } from "@/server/http/handle-api-error";
import { parseJsonBody } from "@/server/http/parse-json-body";

import {
  createVehicleModelSchema,
  listVehicleModelsQuerySchema,
} from "@/server/vehicle-models/vehicle-model.schema";

import { toVehicleModelDto } from "@/server/vehicle-models/vehicle-model.dto";
import { vehicleModelService } from "@/server/vehicle-models/vehicle-model.service";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const query = listVehicleModelsQuerySchema.parse(
      Object.fromEntries(new URL(request.url).searchParams)
    );

    const models = await vehicleModelService.findAll(query.brandId);

    return Response.json({
      data: models.map(toVehicleModelDto),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const input = await parseJsonBody(request, createVehicleModelSchema);

    const model = await vehicleModelService.create(input);

    return Response.json(
      {
        data: toVehicleModelDto(model),
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
