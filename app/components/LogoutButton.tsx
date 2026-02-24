"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { NavItem } from "./register/NavItem";

export default function LogoutButton() {
  return (
    <NavItem
      icon={<LogOut size={18}/>}
      label="Logout"
      onClick={() => signOut({ callbackUrl: "/" })}
    />
  );
}