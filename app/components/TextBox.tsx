
"use client";

import React, { forwardRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AlertCircle } from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TextBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

const TextBox = forwardRef<HTMLInputElement, TextBoxProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        <label className="text-sm font-semibold text-slate-700 ml-1">
          {label}
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors duration-200">
            {icon ? icon : <span className="text-xs">○</span>}
          </div>

          <input
            ref={ref}
            className={cn(
              "w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400",
              "focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500",
              "transition-all duration-200 shadow-sm hover:shadow-md hover:border-emerald-300",
              error && "border-red-500 focus:ring-red-500/10 focus:border-red-500 hover:border-red-400",
              className
            )}
            {...props}
          />
          
          <div className="absolute inset-0 rounded-xl shadow-sm pointer-events-none transition-opacity duration-300 group-focus-within:opacity-0" />
        </div>
        
        {error && (
          <div className="flex items-center gap-1 text-red-500 text-xs ml-1 animate-in fade-in slide-in-from-top-1">
            <AlertCircle size={12} />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

TextBox.displayName = "TextBox";
export { TextBox };