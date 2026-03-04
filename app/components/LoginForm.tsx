"use client";

import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { TextBox } from "./TextBox";
import { SubmitButton } from "./SubmitButton";
import { User, Lock, Building2 } from "lucide-react";
// import { useRouter } from "next/navigation";

export const LoginForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [recaptchaReady, setRecaptchaReady] = useState(false);
    // const router = useRouter();

    const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;

    useEffect(() => {
        const scriptId = "recaptcha-v3";
        if (document.getElementById(scriptId)) {
            setRecaptchaReady(true);
            return;
        }

        const script = document.createElement("script");
        script.id = scriptId;
        script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
        script.async = true;
        script.onload = () => setRecaptchaReady(true);
        document.body.appendChild(script);
    }, [RECAPTCHA_SITE_KEY]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (!recaptchaReady) {
            setError("reCAPTCHA not loaded. Please refresh the page.");
            setIsLoading(false);
            return;
        }

        try {
            const token = await (window as any).grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'login' });

            const res = await signIn("credentials", {
                username,
                password,
                recaptchaToken: token,
                callbackUrl: "/pos/register",
                redirect: false,
            });

            setIsLoading(false);

            if (res?.error) {
                if (res?.code && res.code === "RATE_LIMIT") {
                    setError("Too many login attempts. Please wait 1 minute.");
                } else {
                    setError("Invalid username or password");
                }
                return;
            }

            // router.push("/pos/register");
            window.location.href = "/pos/register";
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
            setIsLoading(false);
        }
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