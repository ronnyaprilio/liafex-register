"use client";

import { CreditCard, Printer, Trash2 } from "lucide-react";

interface Props {
  onPay: () => void;
  onVoid: () => void;
  onPrint: () => void;
}

export const ActionBar = ({ onPay, onVoid, onPrint }: Props) => {
  const btn = "h-12 md:h-14 rounded-xl md:rounded-2xl font-semibold flex items-center justify-center gap-2 transition active:scale-95";
  return (
        <div className="p-4 border-t bg-white grid grid-cols-3 gap-3 shadow-2xl">      
        <button
          onClick={onPay}
          className={`${btn} bg-emerald-500 hover:bg-emerald-600 text-white`}
          >
          <CreditCard size={18} />
          Pay
        </button>

      <button
        onClick={onVoid}
        className={`${btn} bg-red-100 hover:bg-red-200`}
      >
        <Trash2 size={18} />
        Void
      </button>

      <button
        onClick={onPrint}
        className={`${btn} bg-gray-900 hover:bg-black text-white`}
      >
        <Printer size={18} />
        Print
      </button>
    </div>
  );
};