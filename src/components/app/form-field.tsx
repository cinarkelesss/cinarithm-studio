import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type FormFieldProps = {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
};

export function FormField({
  label,
  hint,
  children,
  className,
}: FormFieldProps) {
  return (
    <label className={cn("grid gap-2", className)}>
      <span className="text-sm font-medium text-white/82">{label}</span>
      {children}
      {hint ? <span className="text-xs text-white/42">{hint}</span> : null}
    </label>
  );
}
