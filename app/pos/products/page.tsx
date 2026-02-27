"use client";

import { Navbar } from "@/app/components/register/Navbar";
import { Product } from "@/app/types/cart";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/pos/api/products")
      .then(res => res.json())
      .then(setProducts);
  }, []);

  const formatPrice = (price: number) =>
    `$${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />

      <main className="flex-1 p-6 flex flex-col gap-4 overflow-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800 tracking-wide">
            Products
          </h1>

          <Link
            href="/pos/products/new"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 transition text-white rounded-lg font-medium shadow"
          >
            + Add Product
          </Link>
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full min-w-[600px] text-sm divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left font-medium text-gray-700">Code</th>
                <th className="p-3 text-left font-medium text-gray-700">Name</th>
                <th className="p-3 text-right font-medium text-gray-700">Price</th>
                <th className="p-3 text-right font-medium text-gray-700">Discount</th>
                <th className="p-3 text-center font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map(p => {
                const discountedPrice = p.price * (1 - p.discount);

                return (
                  <tr
                    key={p.code}
                    className="hover:bg-gray-50 transition cursor-pointer"
                  >
                    <td className="p-3 text-gray-700">{p.code}</td>
                    <td className="p-3 text-gray-800 font-medium">{p.name}</td>
                    <td className="p-3 text-right text-gray-700">
                      {p.discount > 0 ? (
                        <div className="flex flex-col items-end">
                          <span className="line-through text-gray-400 text-xs">
                            {formatPrice(p.price)}
                          </span>
                          <span className="text-emerald-600 font-bold text-sm">
                            {formatPrice(discountedPrice)}
                          </span>
                        </div>
                      ) : (
                        <span>{formatPrice(p.price)}</span>
                      )}
                    </td>
                    <td className="p-3 text-right text-gray-500 font-medium">
                      {p.discount > 0 ? `${p.discount * 100}% OFF` : "-"}
                    </td>
                    <td className="p-3 text-center">
                      <Link
                        href={`/pos/products/${p.code}/edit`}
                        className="text-emerald-600 hover:underline font-medium"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-400">
                    No products available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}