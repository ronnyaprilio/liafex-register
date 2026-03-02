"use client";

import { useEffect, useMemo, useState } from "react";
import { Transaction } from "@/app/types/cart";
import { Navbar } from "@/app/components/register/Navbar";

export default function ReportPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  useEffect(() => {
    const now = new Date();

    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const today = new Date();

    setStartDate(firstDay.toISOString().slice(0, 10));
    setEndDate(today.toISOString().slice(0, 10));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/pos/api/transactions");
      const data = await res.json();
      setTransactions(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const { rangeTotal, monthlyTotal, filteredTransactions } = useMemo(() => {
    let range = 0;
    let monthly = 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const result: Transaction[] = [];

    transactions.forEach(tx => {
      const txDate = new Date(tx.date);
      const txDateStr = txDate.toISOString().slice(0, 10);

      const inRange =
        (!startDate || txDateStr >= startDate) &&
        (!endDate || txDateStr <= endDate);

      if (inRange) {
        range += tx.total;
        result.push(tx);
      }

      if (
        txDate.getMonth() === currentMonth &&
        txDate.getFullYear() === currentYear
      ) {
        monthly += tx.total;
      }
    });

    return {
      rangeTotal: range,
      monthlyTotal: monthly,
      filteredTransactions: result,
    };
  }, [transactions, startDate, endDate]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />

      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <h1 className="text-2xl font-bold text-slate-800">
          Sales Report
        </h1>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="border rounded-lg px-4 py-2"
          />
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="border rounded-lg px-4 py-2"
          />
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow">
                <div className="text-sm text-gray-500">
                  Sales (Selected Range)
                </div>
                <div className="text-3xl font-bold text-emerald-600 mt-2">
                  ${rangeTotal.toFixed(2)}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow">
                <div className="text-sm text-gray-500">
                  Monthly Sales (Current Month)
                </div>
                <div className="text-3xl font-bold text-blue-600 mt-2">
                  ${monthlyTotal.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow overflow-x-auto">
              <div className="p-4 font-semibold border-b">
                Transactions
              </div>

              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Reference</th>
                    <th className="p-3 text-center">Items</th>
                    <th className="p-3">Total</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-gray-400">
                        No transactions found.
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map(tx => (
                      <tr
                        key={tx.transaction_ref}
                        className="border-t hover:bg-gray-50"
                      >
                        <td className="p-3">
                          {new Date(tx.date).toLocaleString()}
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
                        <td className="p-3 text-center">
                          <button
                            onClick={() => setSelectedTx(tx)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg text-xs"
                          >
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      {selectedTx && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-2xl w-[420px] shadow-xl">
            <button
              onClick={() => setSelectedTx(null)}
              className="absolute top-5 right-5 text-3xl leading-none font-bold text-gray-400 hover:text-gray-700"
            >
              ×
            </button>

            <h3 className="font-bold mb-1">
              {selectedTx.transaction_ref}
            </h3>

            <div className="text-xs text-gray-500 mb-3">
              {new Date(selectedTx.date).toLocaleString()}
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
          </div>
        </div>
      )}
    </div>
  );
}