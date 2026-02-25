"use client";

import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/app/components/register/Navbar";
import { Transaction } from "@/app/types/cart";

export default function ReceiptPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchRef, setSearchRef] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("/pos/api/transactions");
        if (!res.ok) throw new Error("Failed to fetch transactions");

        const data = await res.json();
        setTransactions(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const refMatch = tx.transaction_ref
        ?.toLowerCase()
        .includes(searchRef.toLowerCase());

      const dateMatch = searchDate
        ? new Date(tx.date).toISOString().slice(0, 10) === searchDate
        : true;

      return refMatch && dateMatch;
    });
  }, [transactions, searchRef, searchDate]);

  const pad = (n: number) => n.toString().padStart(2, "0");

  const formatDate = (d: string | Date) => {
    const date = new Date(d);
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds()
    )} ${pad(date.getDate())}-${date.toLocaleString("en-US", {
      month: "long",
    })}-${date.getFullYear()}`;
  };

  const handleReprint = async (tx: Transaction) => {
    const res = await fetch("/pos/api/prints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tx),
    });

    if (!res.ok) {
      alert("Failed to generate receipt");
      return;
    }

    const { html } = await res.json();

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";

    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(html);
    doc.close();

    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();

      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 500);
    };
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            placeholder="Search reference..."
            value={searchRef}
            onChange={e => setSearchRef(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full md:w-64"
          />

          <input
            type="date"
            value={searchDate}
            onChange={e => setSearchDate(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full md:w-56"
          />
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100">
              <tr className="text-left text-sm">
                <th className="p-3">Time</th>
                <th className="p-3">Reference</th>
                <th className="p-3 text-center">Items</th>
                <th className="p-3">Total</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.map(tx => (
                <tr
                  key={tx.transaction_ref}
                  className="border-t hover:bg-gray-50 text-sm"
                >
                  <td className="p-3 whitespace-nowrap">
                    {formatDate(tx.date)}
                  </td>
                  <td className="p-3 font-mono">
                    {tx.transaction_ref}
                  </td>
                  <td className="p-3 text-center">
                    {tx.items.length}
                  </td>
                  <td className="p-3 font-semibold">
                    ${tx.total.toFixed(2)}
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => setSelectedTx(tx)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg text-xs"
                    >
                      Detail
                    </button>
                    <button
                      onClick={() => handleReprint(tx)}
                      className="px-3 py-1 bg-emerald-500 text-white rounded-lg text-xs"
                    >
                      Reprint
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTx && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[420px] shadow-xl">
            <h3 className="font-bold mb-2">
              {selectedTx.transaction_ref}
            </h3>

            <div className="text-xs text-gray-500 mb-3">
              {formatDate(selectedTx.date)}
            </div>

            <div className="max-h-64 overflow-y-auto text-sm">
              {selectedTx.items.map(item => {
                const discounted = item.price * (1 - item.discount);
                return (
                  <div
                    key={item.code}
                    className="flex justify-between border-b py-1"
                  >
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">
                        {item.quantity} x ${discounted.toFixed(2)}
                        {item.discount > 0 &&
                          ` (${item.discount * 100}% off)`}
                      </div>
                    </div>
                    <div className="font-semibold">
                      ${(discounted * item.quantity).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 pt-3 flex justify-between font-bold">
              <span>Total</span>
              <span>${selectedTx.total.toFixed(2)}</span>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setSelectedTx(null)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Close
              </button>

              <button
                onClick={() => handleReprint(selectedTx)}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg"
              >
                Reprint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}