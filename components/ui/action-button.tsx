import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}

export function ActionButton({ 
  children, 
  variant = "primary", 
  size = "md",
  className = "", 
  ...props 
}: ActionButtonProps) {
  
  const baseStyles = "font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 shrink-0 select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#090D16]";
  
  const sizes = {
    sm: "text-[11px] px-3 py-1.5 rounded-lg",
    md: "text-xs px-4 py-2.5 rounded-xl",
    lg: "text-sm px-5 py-3 rounded-2xl"
  };

  const variants = {
    primary: "bg-indigo-500 text-white border border-indigo-400 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-sm shadow-indigo-500/10",
    secondary: "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 dark:bg-white/[0.03] dark:text-slate-300 dark:border-white/[0.06] dark:hover:bg-white/[0.06]"
  };

  return (
    <button
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}