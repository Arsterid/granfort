import { requireAdmin } from "@/server/auth/require-admin";
import { handleApiError } from "@/server/http/handle-api-error";
import { parseJsonBody } from "@/server/http/parse-json-body";

import { toVehicleBrandDto } from "@/server/vehicle-brands/vehicle-brand.dto";

import { createVehicleBrandSchema } from "@/server/vehicle-brands/vehicle-brand.schema";

import { vehicleBrandService } from "@/server/vehicle-brands/vehicle-brand.service";

export const runtime = "nodejs";

export async function GET() {
  try {
    const brands = await vehicleBrandService.findAll();

    return Response.json({
      data: brands.map(toVehicleBrandDto),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const input = await parseJsonBody(request, createVehicleBrandSchema);

    const brand = await vehicleBrandService.create(input);

    return Response.json(
      {
        data: toVehicleBrandDto(brand),
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
