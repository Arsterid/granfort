import { VehicleVariantForm } from "../_components/vehicle-variant-form";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminVehicleVariantEditPage({ params }: PageProps) {
  const { id } = await params;

  return <VehicleVariantForm mode="edit" variantId={id} />;
}
