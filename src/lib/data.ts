export interface Product {
  productId: number;
  name: string;
  image: string;
  description: string;
  variants: ProductVariant[];
}

export interface ProductVariant {
  variantId: number;
  variantName: string;
  price: number;
}

export const products: Product[] = [
  {
    productId: 6965953462307,
    name: "The Multi-location Snowboard",
    image: "https://images.unsplash.com/photo-1555424263-4f5e2c709c51",
    description: "Your ultimate companion for versatility and adventure",
    variants: [
      {
        variantId: 40370960334883,
        variantName: "Default Title",
        price: 800.0,
      },
    ],
  },
  {
    productId: 6965953429539,
    name: "The Collection Snowboard: Oxygen",
    image: "https://images.unsplash.com/photo-1522056615691-da7b8106c665",
    description:
      "A masterpiece of lightweight performance and cutting-edge style",
    variants: [
      {
        variantId: 40370960236579,
        variantName: "Last season",
        price: 1025.0,
      },
      {
        variantId: 40370960269347,
        variantName: "Modern",
        price: 1025.0,
      },
      {
        variantId: 40370960302115,
        variantName: "Retro",
        price: 3500.0,
      },
    ],
  },
  {
    productId: 6965953331235,
    name: "The Collection Snowboard: Hydrogen",
    image: "https://images.unsplash.com/photo-1590806351178-64634cc9613b",
    description: "Where explosive energy meets bold design",
    variants: [
      {
        variantId: 40370959941667,
        variantName: "Classic Retro",
        price: 650.0,
      },
      {
        variantId: 40370959974435,
        variantName: "Modern",
        price: 650.0,
      },
    ],
  },
];
