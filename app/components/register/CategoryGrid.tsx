"use client";

import Image from "next/image";

interface Props {
  addToCart: (product: {
    id: string;
    name: string;
    price: number;
  }) => void;
}

const PRODUCTS = [
  { id: "1", name: "Coffee", price: 34, image: "/categories/coffee.png" },
  { id: "2", name: "Pizza", price: 12, image: "/categories/pizza.png" }
];

export const CategoryGrid = ({ addToCart }: Props) => {
  return (
    <div className="flex-1 min-h-0 bg-gray-50 overflow-y-auto">
      <div className="p-4 grid 
        grid-cols-2 
        sm:grid-cols-3 
        md:grid-cols-4 
        lg:grid-cols-5 
        gap-3">
        {PRODUCTS.map(product => (
          <div
            key={product.id}
            onClick={() => addToCart(product)}
            className="bg-white rounded-xl shadow hover:shadow-md cursor-pointer transition overflow-hidden group"
          >
            <div className="relative h-20 w-full">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-2 text-center">
              <p className="text-sm font-medium text-slate-700">
                {product.name}
              </p>
              <p className="text-xs text-gray-400">
                ${product.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};