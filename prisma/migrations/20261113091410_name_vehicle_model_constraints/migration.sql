-- DropIndex
DROP INDEX "VehicleModel_brandId_idx";

-- RenameIndex
ALTER INDEX "VehicleModel_brandId_name_key" RENAME TO "vehicle_model_brand_id_name_key";

-- RenameIndex
ALTER INDEX "VehicleModel_brandId_slug_key" RENAME TO "vehicle_model_brand_id_slug_key";
