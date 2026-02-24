"use client";

import { useState, useRef } from "react";
import { ActionBar } from "@/app/components/register/ActionBar";
import { CategoryGrid } from "@/app/components/register/CategoryGrid";
import { ReceiptPanel } from "@/app/components/register/ReceiptPanel";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const receiptRef = useRef<HTMLDivElement>(null);

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

    handlePrint();

    setTimeout(() => {
      alert("Payment successful ✅");
      setCart([]);
    }, 300);
  };

  const handlePrint = () => {
    if (cart.length === 0) return;

    const now = new Date().toLocaleString();
    const subtotal = cart.reduce((a, i) => a + i.price * i.quantity, 0);

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
          <p>${now}</p>
          <div class="line"></div>

          ${cart.map(item => `
            <div class="item">
              ${item.name}<br/>
              ${item.quantity} x $${item.price.toFixed(2)}
              <div style="text-align:right;">
                $${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          `).join("")}

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

  return (
    <div className="flex h-full bg-gray-100">
      <ReceiptPanel
        ref={receiptRef}
        cart={cart}
        updateQuantity={updateQuantity}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <CategoryGrid addToCart={addToCart} />

        <ActionBar
          onPay={handlePay}
          onVoid={handleVoid}
          onPrint={handlePrint}
        />
      </div>
    </div>
  );
}