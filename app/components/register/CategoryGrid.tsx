"use client";

import Image from "next/image";

interface Props {
  addToCart: (product: {
    id: string;
    name: string;
    price: number;
    discount: number;
  }) => void;
}

const PRODUCTS = [
  { id: "1", name: "Coffee", price: 34, discount: 0.1, image: "/categories/coffee.png" },
  { id: "2", name: "Pizza", price: 12, discount: 0.25, image: "/categories/pizza.png" },
  { id: "3", name: "Sandwich", price: 16, discount: 0.3, image: "/categories/sandwich.png" }
];

export const CategoryGrid = ({ addToCart }: Props) => {
  return (
    <div className="flex-1 min-h-0 bg-gray-50 overflow-y-auto">
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {PRODUCTS.map(product => {
          const discountedPrice = product.price * (1 - product.discount);

          return (
            <div
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-white rounded-xl shadow hover:shadow-md cursor-pointer transition overflow-hidden group"
            >
              <div className="relative h-24 w-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-3 text-center">
                <p className="text-sm font-semibold text-slate-700">
                  {product.name}
                </p>

                {product.discount > 0 ? (
                  <div className="mt-1">
                    <p className="text-xs text-gray-400 line-through">
                      ${product.price.toFixed(2)}
                    </p>
                    <p className="text-sm font-bold text-emerald-600">
                      ${discountedPrice.toFixed(2)}
                    </p>
                    <p className="text-[10px] text-emerald-500">
                      {product.discount * 100}% OFF
                    </p>
                  </div>
                ) : (
                  <p className="text-sm font-medium text-gray-600 mt-1">
                    ${product.price.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};