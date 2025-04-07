import { products } from "@/lib/data";
import VariantSelector from "@/components/VariantSelector";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const product = products.find(
    (p) => p.productId === parseInt(resolvedParams.id)
  );

  if (!product) {
    return <div className="container py-8">Product not found</div>;
  }

  return <VariantSelector product={product} />;
}
