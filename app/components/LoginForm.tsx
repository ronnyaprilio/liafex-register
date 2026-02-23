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
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsLoading(true);

        const res = await signIn("credentials", {
            username,
            password,
            callbackUrl: "/dashboard",
            redirect:false
        });

        setIsLoading(false);
        if(res?.error) {
            setError("Invalid username or password");
            return;
        }
        router.push("/dashboard");
    };

    return (
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-8 ring-1 ring-slate-900/5">
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Building2 size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">LIAFEX REGISTER</h1>
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

            {error && (
                <p className="text-sm text-red-500 text-center">
                    {error}
                </p>
            )}

            <div className="pt-2">
                <SubmitButton isLoading={isLoading}>
                    Sign In
                </SubmitButton>
            </div>
        </form>
        </div>
    );
};