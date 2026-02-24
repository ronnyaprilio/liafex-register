"use client";

import { Home, LayoutGrid, PlusCircle, Receipt, Settings, LogOut } from "lucide-react";
import LogoutButton from "../LogoutButton";
import { NavItem } from "./NavItem";

export const Navbar = () => (
  <header className="w-screen bg-gradient-to-r from-emerald-700 to-emerald-500 shadow-lg shadow-emerald-900/20">
    <nav className="h-16 w-full flex items-center justify-between px-6 text-white relative">

      <div className="flex items-center gap-6 text-sm font-medium">
        <NavItem icon={<Home size={18}/>} label="Home"/>
      </div>

      <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-bold tracking-wide">
        Cash Register
      </h1>

      <div className="flex items-center gap-4 text-sm font-medium">
        <LogoutButton />
      </div>

    </nav>
  </header>
);