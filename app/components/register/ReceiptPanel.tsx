"use client";

import { useState } from "react";
import { Minus, Plus, User } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const INITIAL_CART: CartItem[] = [
  { id: "101", name: "Classic Beef Burger", price: 12.5, quantity: 2 },
  { id: "102", name: "Pepperoni Pizza Large", price: 18, quantity: 1 },
];

export const ReceiptPanel = () => {
  const [cart, setCart] = useState(INITIAL_CART);

  const subtotal = cart.reduce((a,i)=>a+i.price*i.quantity,0);
  const discount = 2.5;
  const total = subtotal - discount;

  const update = (id:string,d:number)=>{
    setCart(prev=>prev.map(i=>i.id===id?{...i,quantity:Math.max(0,i.quantity+d)}:i).filter(i=>i.quantity>0));
  };

  return (
    <div className="w-[400px] bg-white border-r flex flex-col h-full shadow-xl">

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cart.map(item=>(
          <div key={item.id} className="flex justify-between bg-gray-50 p-3 rounded-xl">
            <div>
              <p className="font-semibold text-sm">{item.name}</p>
              <p className="text-xs text-gray-500">${item.price}</p>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={()=>update(item.id,-1)}><Minus size={14}/></button>
              <span>{item.quantity}</span>
              <button onClick={()=>update(item.id,1)}><Plus size={14}/></button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-gray-900 text-white rounded-t-3xl">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Discount</span>
          <span>${discount}</span>
        </div>
        <div className="flex justify-between text-2xl font-bold mt-4">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};