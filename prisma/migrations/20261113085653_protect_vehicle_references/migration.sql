-- DropForeignKey
ALTER TABLE "ProductVehicle" DROP CONSTRAINT "ProductVehicle_vehicleVariantId_fkey";

-- DropForeignKey
ALTER TABLE "VehicleVariant" DROP CONSTRAINT "VehicleVariant_vehicleModelId_fkey";

-- AddForeignKey
ALTER TABLE "VehicleVariant" ADD CONSTRAINT "VehicleVariant_vehicleModelId_fkey" FOREIGN KEY ("vehicleModelId") REFERENCES "VehicleModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVehicle" ADD CONSTRAINT "ProductVehicle_vehicleVariantId_fkey" FOREIGN KEY ("vehicleVariantId") REFERENCES "VehicleVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
