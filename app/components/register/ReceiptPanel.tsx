"use client";

import { forwardRef } from "react";
import { Minus, Plus } from "lucide-react";
import { CartItem } from "@/app/types/cart";

interface Props {
  cart: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
}



export const ReceiptPanel = forwardRef<HTMLDivElement, Props>(
  ({ cart, updateQuantity }, ref) => {
    const subtotal = cart.reduce((a, i) => a + i.price * i.quantity, 0);
    const total = subtotal;

    return ( <>
          <div className="
            w-full md:w-[380px]
            bg-white
            border-t md:border-t-0 md:border-r
            flex flex-col
            h-full
            shadow-xl
          ">        
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between bg-gray-50 p-3 rounded-xl">
              <div>
                <p className="font-semibold text-sm">{item.name}</p>
                <p className="text-xs text-gray-500">${item.price}</p>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.id, -1)}>
                  <Minus size={14} />
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)}>
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-gray-900 text-white">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      </>
    );
  }
);