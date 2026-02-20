"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { TextBox } from "./TextBox";
import { SubmitButton } from "./SubmitButton";
import { User, Lock, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

export const LoginForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsLoading(true);

        await signIn("credentials", {
            username,
            password,
            callbackUrl: "/dashboard",
            redirect:false
        });

        setIsLoading(false);
        router.push("/dashboard");
    };

    return (
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-8 ring-1 ring-slate-900/5">
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Building2 size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 text-sm mt-2">Sign in to access your enterprise dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
            <TextBox
            label="Username"
            type="text"
            placeholder="username"
            icon={<User size={18} />}
            onChange={e => setUsername(e.target.value)}
            required
            />

            <TextBox
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={<Lock size={18} />}
            onChange={e => setPassword(e.target.value)}
            required
            />

            <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                    <span className="text-slate-600">Remember me</span>
                </label>
                <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline">Forgot password?</a>
            </div>

            <div className="pt-2">
                <SubmitButton isLoading={isLoading}>
                    Sign In
                </SubmitButton>
            </div>
        </form>
        
        <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">Trusted by over 500+ Enterprises</p>
        </div>
        </div>
    );
};


// "use client"

// import { signIn } from "next-auth/react"
// import { useState } from "react"

// export default function LoginPage() {
//   const [username, setUsername] = useState("")
//   const [password, setPassword] = useState("")

//   return (
//     <div style={{ padding: 20 }}>
//       <h1>Login</h1>

//       <input
//         placeholder="username"
//         onChange={e => setUsername(e.target.value)}
//       />
//       <br />

//       <input
//         type="password"
//         placeholder="password"
//         onChange={e => setPassword(e.target.value)}
//       />
//       <br />

//       <button
//         onClick={() =>
//           signIn("credentials", {
//             username,
//             password,
//             callbackUrl: "/dashboard"
//           })
//         }
//       >
//         Login
//       </button>
//     </div>
//   )
// }