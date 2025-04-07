import Link from "next/link";
import { Product } from "@/lib/data";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.productId}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 dark:text-gray-600">{product.name}</h3>
        </div>
      </div>
    </Link>
  );
}
