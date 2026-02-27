"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditProductPage() {
  const { code } = useParams();
  const router = useRouter();

  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    fetch(`/pos/api/products/${code}`)
      .then(res => res.json())
      .then(setForm);
  }, [code]);

  if (!form) return <div className="p-6">Loading...</div>;

  const submit = async () => {
    await fetch(`/pos/api/products/${code}`, {
      method: "PUT",
      body: JSON.stringify(form),
    });

    router.push("/pos/products");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Edit Product</h1>

      <div className="space-y-3">
        {["name", "image"].map(key => (
          <input
            key={key}
            placeholder={key.toUpperCase()}
            className="w-full border rounded-lg p-2"
            value={form[key]}
            onChange={e => setForm({ ...form, [key]: e.target.value })}
          />
        ))}

        <input
          type="number"
          placeholder="PRICE"
          className="w-full border rounded-lg p-2"
          value={form.price}
          onChange={e => setForm({ ...form, price: +e.target.value })}
        />

        <input
          type="number"
          step="0.01"
          placeholder="DISCOUNT"
          className="w-full border rounded-lg p-2"
          value={form.discount}
          onChange={e => setForm({ ...form, discount: +e.target.value })}
        />

        <button
          onClick={submit}
          className="w-full py-2 bg-emerald-600 text-white rounded-lg"
        >
          Update Product
        </button>
      </div>
    </div>
  );
}