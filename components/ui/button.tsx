import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
type Size = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 disabled:hover:bg-brand-600 shadow-sm",
  secondary:
    "bg-slate-900 text-white hover:bg-slate-800 disabled:hover:bg-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white dark:disabled:hover:bg-slate-100",
  outline:
    "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:hover:bg-white dark:border-slate-700 dark:bg-card dark:text-slate-200 dark:hover:bg-slate-800 dark:disabled:hover:bg-card",
  ghost:
    "text-slate-600 hover:bg-slate-100 disabled:hover:bg-transparent dark:text-slate-300 dark:hover:bg-slate-800",
  danger: "bg-red-600 text-white hover:bg-red-700 disabled:hover:bg-red-600",
  success: "bg-emerald-600 text-white hover:bg-emerald-700 disabled:hover:bg-emerald-600",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
  icon: "h-9 w-9",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-70",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
);
Button.displayName = "Button";
