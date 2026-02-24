"use client";

import { Home, Receipt, Store } from "lucide-react";
import LogoutButton from "../LogoutButton";
import { NavItem } from "./NavItem";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const router = useRouter();

  return (
    <header className="w-screen bg-gradient-to-r from-emerald-700 to-emerald-500 shadow-lg shadow-emerald-900/20 relative z-[100]">
    <nav className="h-16 w-full flex items-center justify-between px-6 text-white">
      <div className="flex items-center gap-6 text-sm font-medium">
        <NavItem icon={<Home size={18}/>} label="Home"/>
      </div>

      <h1 className="text-xl font-bold tracking-wide">
        Cash Register
      </h1>

      <div className="flex items-center gap-6 text-sm font-medium">
        <NavItem
          icon={<Store size={18} />}
          label="Register"
          onClick={() => router.push("/pos/register")}
        />
        <NavItem
          icon={<Receipt size={18} />}
          label="Receipt"
          onClick={() => router.push("/pos/receipt")}
        />
        <LogoutButton />
      </div>

    </nav>
  </header> );

}