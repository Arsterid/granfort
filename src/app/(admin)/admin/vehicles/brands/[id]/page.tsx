import { VehicleBrandForm } from "../_components/vehicle-brand-form";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminVehicleBrandEditPage({ params }: PageProps) {
  const { id } = await params;

  return <VehicleBrandForm mode="edit" brandId={id} />;
}
