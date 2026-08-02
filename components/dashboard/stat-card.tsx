import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon,
  tone = "default",
  hint,
}: {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  tone?: "default" | "success" | "warning" | "danger" | "info";
  hint?: string;
}) {
  const tones = {
    default: "bg-slate-100 text-slate-600",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
  };
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1.5 text-2xl font-bold text-slate-900">{value}</p>
          {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
        </div>
        <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl", tones[tone])}>
          {icon}
        </span>
      </div>
    </Card>
  );
}
