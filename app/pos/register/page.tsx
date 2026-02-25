"use client";

import { useState, useRef } from "react";
import { ActionBar } from "@/app/components/register/ActionBar";
import { CategoryGrid } from "@/app/components/register/CategoryGrid";
import { ReceiptPanel } from "@/app/components/register/ReceiptPanel";
import { CartItem, Transaction } from "@/app/types/cart";
import { Navbar } from "@/app/components/register/Navbar";

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const receiptRef = useRef<HTMLDivElement>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const addToCart = (product: Omit<CartItem, "quantity">) => {
    setCart(prev => {
      const existing = prev.find(i => i.code === product.code);

      if (existing) {
        return prev.map(i =>
          i.code === product.code
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (code: string, delta: number) => {
    setCart(prev =>
      prev
        .map(i =>
          i.code === code
            ? { ...i, quantity: Math.max(0, i.quantity + delta) }
            : i
        )
        .filter(i => i.quantity > 0)
    );
  };

  const handleVoid = () => {
    setCart([]);
  };

  const handlePay = () => {
    if (cart.length === 0) return;
    setShowConfirm(true);
  };

  const confirmPayment = async () => {
    const subtotal = cart.reduce((acc, item) => {
      const discountedPrice = item.price * (1 - item.discount);
      return acc + discountedPrice * item.quantity;
    }, 0);

    const newTransaction = {
      items: cart,
      total: subtotal
    };

    const res = await fetch("/pos/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTransaction),
    });
    const saved = await res.json();

    handlePrint(saved);
    setCart([]);
    setShowConfirm(false);
  };

  const handlePrint = async (tx: Transaction) => {
    const res = await fetch("/pos/api/prints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tx),
    });

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

  const confirmTotal = cart.reduce((acc, item) => {
    const discountedPrice = item.price * (1 - item.discount);
    return acc + discountedPrice * item.quantity;
  }, 0);

  return ( <>
      <div className="flex flex-col h-screen">
        <Navbar />

        <div className="flex flex-1">
          <ReceiptPanel
            ref={receiptRef}
            cart={cart}
            updateQuantity={updateQuantity}
          />

          <div className="flex flex-col flex-1">
            <CategoryGrid addToCart={addToCart} />

            <ActionBar
              onPay={handlePay}
              onVoid={handleVoid}
            />
          </div>
        </div>
      </div>
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[350px] shadow-xl">
            <h2 className="text-lg font-bold mb-4">Confirm Payment</h2>

            <div className="max-h-48 overflow-y-auto text-sm mb-4">
              {cart.map(item => {
                const original = item.price;
                const discountAmount = original * item.discount;
                const discounted = original - discountAmount;
                const total = discounted * item.quantity;

                return (
                  <div key={item.code} className="border-b py-2">
                    <div className="font-medium">{item.name}</div>

                    {item.discount > 0 ? (
                      <>
                        <div className="text-xs text-gray-400 line-through">
                          ${original.toFixed(2)}
                        </div>
                        <div className="text-xs text-emerald-600">
                          Discount {item.discount * 100}% (-${discountAmount.toFixed(2)})
                        </div>
                      </>
                    ) : (
                      <div className="text-xs text-gray-500">
                        ${original.toFixed(2)}
                      </div>
                    )}

                    <div className="flex justify-between text-sm font-semibold">
                      <span>
                        {item.quantity} x ${discounted.toFixed(2)}
                      </span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}

              <div className="mt-3 pt-3 flex justify-between font-bold text-base">
                <span>Total</span>
                <span>${confirmTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={confirmPayment}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}