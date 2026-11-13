import { ProductForm } from "../_components/product-form/product-form";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminProductPage({ params }: PageProps) {
  const { id } = await params;

  return <ProductForm mode="edit" productId={id} />;
}
