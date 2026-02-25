"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/app/components/register/Navbar";
import { Transaction } from "@/app/types/cart";

export default function ReceiptPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("/pos/api/transactions");

        if (!res.ok) {
          throw new Error("Failed to fetch transactions");
        }

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

  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Transaction History</h2>

        {transactions.length === 0 && (
          <p className="text-gray-400">No transactions yet</p>
        )}

        {transactions.map(tx => (
          <div
            key={tx.transaction_ref}
            className="border p-4 rounded-xl mb-4 shadow-sm"
          >
            <p className="text-sm text-gray-500">{tx.date}</p>
            <p className="font-bold">
              Total: ${tx.total.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}