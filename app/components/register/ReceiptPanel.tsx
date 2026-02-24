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

    const subtotal = cart.reduce((acc, item) => {
      const discountedPrice = item.price * (1 - item.discount);
      return acc + discountedPrice * item.quantity;
    }, 0);

    return (
      <div
        ref={ref}
        className="w-[380px] bg-white border-r border-gray-200 flex flex-col h-full shadow-xl" 
      >
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.map(item => {
            const discountedPrice = item.price * (1 - item.discount);
            const itemTotal = discountedPrice * item.quantity;

            return (
              <div
                key={item.id}
                className="flex justify-between bg-gray-50 p-3 rounded-xl"
              >
                <div>
                  <p className="font-semibold text-sm">{item.name}</p>

                  {item.discount > 0 && (
                    <p className="text-xs text-emerald-500">
                      {item.discount * 100}% discount
                    </p>
                  )}

                  {item.discount > 0 && (
                    <p className="text-xs line-through text-gray-400">
                      ${item.price.toFixed(2)}
                    </p>
                  )}

                  <p className="text-xs text-gray-600">
                    ${discountedPrice.toFixed(2)}
                  </p>
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
            );
          })}
        </div>

        <div className="p-6 bg-gray-900 text-white border-t border-gray-200">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  }
);