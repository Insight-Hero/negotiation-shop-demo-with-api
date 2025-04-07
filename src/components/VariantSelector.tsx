"use client";

import { useState } from "react";
import Image from "next/image";
import NegotiationForm from "./NegotiationForm";
import { Product } from "@/lib/data";

export default function VariantSelector({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Image
            src={product.image}
            alt={product.name}
            width={500}
            height={500}
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">{product.description}</p>
            <p className="text-gray-600 dark:text-gray-300 font-semibold text-sm mt-2">
              Select a variant:
            </p>
            <select
              value={selectedVariant.variantId}
              onChange={(e) => {
                const variant =
                  product.variants.find(
                    (v) => v.variantId === parseInt(e.target.value)
                  ) || product.variants[0];
                setSelectedVariant(variant);
              }}
              className="mt-2 block w-full rounded-md border px-2 py-1 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {product.variants.map((variant) => (
                <option key={variant.variantId} value={variant.variantId}>
                  {variant.variantName}
                </option>
              ))}
            </select>
            <p className="text-xl font-semibold mt-4">
              ${selectedVariant.price.toFixed(2)}
            </p>
          </div>
          <NegotiationForm
            productVariant={{
              productId: product.productId,
              variantId: selectedVariant.variantId,
              price: selectedVariant.price,
            }}
          />
        </div>
      </div>
    </div>
  );
}
