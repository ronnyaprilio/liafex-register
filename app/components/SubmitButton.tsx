"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
}

export function SubmitButton({
  children,
  isLoading,
  loadingText = "Processing...",
  className = "",
  disabled,
  ...props
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading || disabled}
      className={`
        w-full py-3 rounded-xl font-semibold text-white
        bg-emerald-600 hover:bg-emerald-700
        transition active:scale-[0.98]
        disabled:opacity-60 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${className}
      `}
      {...props}
    >
      {isLoading && <Loader2 className="animate-spin w-5 h-5" />}
      {isLoading ? loadingText : children}
    </button>
  );
}