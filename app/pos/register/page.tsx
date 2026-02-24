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
      const existing = prev.find(i => i.id === product.id);

      if (existing) {
        return prev.map(i =>
          i.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev =>
      prev
        .map(i =>
          i.id === id
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

  const confirmPayment = () => {
    const subtotal = cart.reduce((acc, item) => {
      const discountedPrice = item.price * (1 - item.discount);
      return acc + discountedPrice * item.quantity;
    }, 0);

    const newTransaction = {
      id: crypto.randomUUID(),
      date: new Date().toLocaleString(),
      items: cart,
      total: subtotal
    };

    const existing = JSON.parse(localStorage.getItem("transactions") || "[]");
    localStorage.setItem(
      "transactions",
      JSON.stringify([newTransaction, ...existing])
    );

    handlePrint();
    setCart([]);
    setShowConfirm(false);
  };

  const handlePrint = () => {
    if (cart.length === 0) return;

    const now = new Date().toLocaleString();
    const subtotal = cart.reduce((acc, item) => {
  const discountedPrice = item.price * (1 - item.discount);
  return acc + discountedPrice * item.quantity;
}, 0);

const receiptHTML = `
    <html>
    <head>
    <title>Receipt</title>
    <style>
      body {
        font-family: monospace;
        width: 80mm;
        margin: 0;
        padding: 10px;
      }
      h2 { text-align:center; margin:0; }
      .line { border-top:1px dashed #000; margin:8px 0; }
      .item { font-size:12px; margin-bottom:6px; }
      .total {
        display:flex;
        justify-content:space-between;
        font-weight:bold;
        font-size:14px;
      }
    </style>
    </head>
    <body>
      <h2>KEDAI KELINCI</h2>
      <div class="line"></div>

      ${cart.map(item => {
        const discountedPrice = item.price * (1 - item.discount);
        const total = discountedPrice * item.quantity;

    return `
      <div class="item">
            ${item.name}
            ${item.discount > 0 ? `<br/>${item.discount * 100}% discount` : ""}
            <br/>
            ${item.quantity} x $${discountedPrice.toFixed(2)}
            <div style="text-align:right;">
              $${total.toFixed(2)}
            </div>
          </div>
        `;
      }).join("")}

      <div class="line"></div>

      <div class="total">
        <span>TOTAL</span>
        <span>$${subtotal.toFixed(2)}</span>
      </div>

      <div class="line"></div>
      <p style="text-align:center;">Thank you 🐇</p>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
    `;

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Popup blocked. Please allow popups for this site.");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
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
              onPrint={handlePrint}
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
                const discountedPrice = item.price * (1 - item.discount);
                return (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name} x{item.quantity}</span>
                    <span>
                      ${(discountedPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
              <div className="border-t mt-3 pt-3 flex justify-between font-bold">
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