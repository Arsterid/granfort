import { VehicleModelForm } from "../_components/vehicle-model-form";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminVehicleModelEditPage({ params }: PageProps) {
  const { id } = await params;

  return <VehicleModelForm mode="edit" modelId={id} />;
}
