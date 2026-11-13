import { requireAdmin } from "@/server/auth/require-admin";
import { handleApiError } from "@/server/http/handle-api-error";
import { parseJsonBody } from "@/server/http/parse-json-body";

import {
  createVehicleVariantSchema,
  listVehicleVariantsQuerySchema,
} from "@/server/vehicle-variants/vehicle-variant.schema";

import { toVehicleVariantDto } from "@/server/vehicle-variants/vehicle-variant.dto";

import { vehicleVariantService } from "@/server/vehicle-variants/vehicle-variant.service";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const query = listVehicleVariantsQuerySchema.parse(
      Object.fromEntries(new URL(request.url).searchParams)
    );

    const variants = await vehicleVariantService.findAll(query.vehicleModelId);

    return Response.json({
      data: variants.map(toVehicleVariantDto),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const input = await parseJsonBody(request, createVehicleVariantSchema);

    const variant = await vehicleVariantService.create(input);

    return Response.json(
      {
        data: toVehicleVariantDto(variant),
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
