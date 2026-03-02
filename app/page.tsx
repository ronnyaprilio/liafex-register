"use client";

import { LoginForm } from "./components/LoginForm";
export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-teal-200/30 blur-3xl" />
        <div className="absolute -bottom-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-green-200/30 blur-3xl" />
      </div>

      <div className="relative z-10 flex justify-center w-full px-4">
        <LoginForm />
      </div>
    </div>
  );
}