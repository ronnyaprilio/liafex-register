"use client";

import { CreditCard, Printer, Trash2 } from "lucide-react";

export const ActionBar = () => {
  const btn="h-14 rounded-2xl font-semibold flex items-center justify-center gap-2";

  return (
    <div className="p-4 border-t bg-white grid grid-cols-5 gap-3">
      <button className={`${btn} bg-gray-100`}>Hold</button>
      <button className={`${btn} bg-yellow-100`}>Discount</button>
      <button className={`${btn} bg-emerald-500 text-white`}><CreditCard size={18}/>Pay</button>
      <button className={`${btn} bg-blue-100`}>Cash In</button>
      <button className={`${btn} bg-red-100`}><Trash2 size={18}/>Void</button>
      <button className={`${btn} bg-gray-900 text-white`}><Printer size={18}/>Print</button>
    </div>
  );
};