"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ProductForm = {
  code: string;
  name: string;
  price: number;
  discount: number;
  image: string;
};

export default function NewProductPage() {
  const router = useRouter();

  const [form, setForm] = useState<ProductForm>({
    code: "",
    name: "",
    price: 0,
    discount: 0,
    image: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key: keyof ProductForm, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const submit = async () => {
    setError("");

    if (!form.code.trim()) return setError("Product code is required");
    if (!form.name.trim()) return setError("Product name is required");
    if (form.price <= 0) return setError("Price must be greater than 0");
    if (form.discount < 0 || form.discount > 1)
      return setError("Discount must be between 0 and 1");

    try {
      setLoading(true);

      const res = await fetch("/pos/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to save product");
      }

      router.push("/pos/products");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Add Product</h1>

      {error && (
        <div className="mb-3 bg-red-100 text-red-700 p-2 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <input
          placeholder="CODE"
          className="w-full border rounded-lg p-2"
          value={form.code}
          onChange={e => update("code", e.target.value)}
        />

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
          disabled={loading}
          onClick={submit}
          className="w-full py-2 bg-emerald-600 text-white rounded-lg disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Product"}
        </button>
      </div>
    </div>
  );
}