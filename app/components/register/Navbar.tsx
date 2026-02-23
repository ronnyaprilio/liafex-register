"use client";

import { Home, LayoutGrid, PlusCircle, Receipt, Settings, LogOut } from "lucide-react";

export const Navbar = () => (
  <header className="w-screen bg-gradient-to-r from-emerald-700 to-emerald-500 shadow-lg shadow-emerald-900/20">
    <nav className="h-16 w-full flex items-center justify-between px-6 text-white relative">

      <div className="flex items-center gap-6 text-sm font-medium">
        <NavItem icon={<Home size={18}/>} label="Home"/>
        <NavItem icon={<LayoutGrid size={18}/>} label="Table"/>
        <NavItem icon={<PlusCircle size={18}/>} label="New Transaction"/>
      </div>

      <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-bold tracking-wide">
        Cash Register
      </h1>

      <div className="flex items-center gap-4 text-sm font-medium">
        <NavItem icon={<Receipt size={18}/>} label="Transaction"/>
        <NavItem icon={<Settings size={18}/>} label="Functions"/>
        <NavItem icon={<LogOut size={18}/>} label="Logout" danger/>
      </div>

    </nav>
  </header>
);

const NavItem = ({ icon, label, danger=false }: any) => (
  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl transition cursor-pointer ${
    danger ? "hover:bg-red-500/20 text-red-100" : "hover:bg-white/10"
  }`}>
    {icon}
    <span>{label}</span>
  </div>
);