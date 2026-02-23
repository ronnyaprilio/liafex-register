"use client";

import { useState } from "react";
import { Search, Coffee, Pizza } from "lucide-react";

const CATEGORIES = [
  { id:"1", name:"Coffee", icon:<Coffee/> },
  { id:"2", name:"Pizza", icon:<Pizza/> }
];

export const CategoryGrid = () => {
  const [search,setSearch] = useState("");

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      <div className="p-6 flex justify-between">
        <h2 className="text-2xl font-bold">Products</h2>

        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18}/>
          <input
            value={search}
            onChange={e=>setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl shadow-sm"
          />
        </div>
      </div>

      <div className="p-6 grid grid-cols-3 gap-5">
        {CATEGORIES.map(cat=>(
          <div key={cat.id} className="bg-white p-6 rounded-3xl shadow hover:shadow-xl cursor-pointer transition">
            <div className="mb-4">{cat.icon}</div>
            <p className="font-bold">{cat.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};