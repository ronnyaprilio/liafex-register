"use client";

import { Navbar } from "@/app/components/register/Navbar";
import { Product } from "@/app/types/cart";
import { useEffect, useState } from "react";

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selected, setSelected] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("/pos/api/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  const formatPrice = (price: number) =>
    `$${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  const handleSave = async (product: Product, isEdit: boolean) => {
    const url = isEdit
      ? `/pos/api/products/${product.code}`
      : `/pos/api/products`;

    const method = isEdit ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    await fetchProducts();

    setIsAddOpen(false);
    setIsEditOpen(false);
    setSelected(null);
  };

  const handleDelete = async () => {
    if (!selected) return;

    await fetch(`/pos/api/products/${selected.code}`, {
      method: "DELETE",
    });

    setProducts(prev =>
      prev.filter(p => p.code !== selected.code)
    );

    setIsDeleteOpen(false);
    setSelected(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />

      <main className="flex-1 p-6 flex flex-col gap-4 overflow-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">
            Products
          </h1>

          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow"
          >
            + Add Product
          </button>
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full text-sm divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Code</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-right">Price</th>
                <th className="p-3 text-right">Discount</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-400">
                    No products available.
                  </td>
                </tr>
              ) : (
                products.map(p => {
                  const discounted = p.price * (1 - p.discount);

                  return (
                    <tr key={p.code} className="hover:bg-gray-50">
                      <td className="p-3">{p.code}</td>
                      <td className="p-3 font-medium">{p.name}</td>

                      <td className="p-3 text-right">
                        {p.discount > 0 ? (
                          <div className="flex flex-col items-end">
                            <span className="line-through text-gray-400 text-xs">
                              {formatPrice(p.price)}
                            </span>
                            <span className="text-emerald-600 font-bold text-sm">
                              {formatPrice(discounted)}
                            </span>
                          </div>
                        ) : (
                          formatPrice(p.price)
                        )}
                      </td>

                      <td className="p-3 text-right">
                        {p.discount > 0 ? `${p.discount * 100}% OFF` : "-"}
                      </td>

                      <td className="p-3 text-center space-x-3">
                        <button
                          onClick={() => {
                            setSelected(p);
                            setIsEditOpen(true);
                          }}
                          className="text-emerald-600 hover:underline"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => {
                            setSelected(p);
                            setIsDeleteOpen(true);
                          }}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>

      <Modal open={isAddOpen} onClose={() => setIsAddOpen(false)}>
        <ProductForm
          onSubmit={(data) => handleSave(data, false)}
        />
      </Modal>

      <Modal open={isEditOpen} onClose={() => setIsEditOpen(false)}>
        {selected && (
          <ProductForm
            initialData={selected}
            onSubmit={(data) => handleSave(data, true)}
          />
        )}
      </Modal>

      <Modal open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
        {selected && (
          <>
            <h2 className="text-lg font-semibold mb-2">
              Delete Product?
            </h2>

            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="font-medium text-slate-800">
                {selected.name}
              </p>
              <p className="text-sm text-gray-500">
                ${selected.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              This action cannot be undone.
            </p>

            <button
              onClick={handleDelete}
              className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              Confirm Delete
            </button>
          </>
        )}
      </Modal>
    </div>
  );
}

function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-xl p-6 w-full max-w-md shadow-lg">

        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 text-3xl leading-none font-bold"
        >
          ×
        </button>

        {children}
      </div>
    </div>
  );
}

function ProductForm({
  initialData,
  onSubmit,
}: {
  initialData?: Product;
  onSubmit: (data: Product) => void;
}) {
  const [form, setForm] = useState<Product>(
    initialData || {
      code: "",
      name: "",
      price: 0,
      discount: 0,
      image: "",
    }
  );

  const update = (key: keyof Product, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">
        {initialData ? "Edit Product" : "Add Product"}
      </h2>

      {!initialData && (
        <input
          placeholder="CODE"
          className="w-full border rounded-lg p-2"
          value={form.code}
          onChange={e => update("code", e.target.value)}
        />
      )}

      <input
        placeholder="NAME"
        className="w-full border rounded-lg p-2"
        value={form.name}
        onChange={e => update("name", e.target.value)}
      />

      <input
        placeholder="IMAGE URL"
        className="w-full border rounded-lg p-2"
        value={form.image}
        onChange={e => update("image", e.target.value)}
      />

      <input
        type="number"
        placeholder="PRICE"
        className="w-full border rounded-lg p-2"
        value={form.price}
        onChange={e => update("price", +e.target.value)}
      />

      <input
        type="number"
        step="0.01"
        placeholder="DISCOUNT (0 - 1)"
        className="w-full border rounded-lg p-2"
        value={form.discount}
        onChange={e => update("discount", +e.target.value)}
      />

      <button
        onClick={() => onSubmit(form)}
        className="w-full py-2 bg-emerald-600 text-white rounded-lg"
      >
        Save
      </button>
    </div>
  );
}