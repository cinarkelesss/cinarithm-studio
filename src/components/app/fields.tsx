import { cn } from "@/lib/utils";

export function textInputClassName(className?: string) {
  return cn(
    "h-11 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-zinc-100/40 focus:bg-black/28",
    className
  );
}

export function textAreaClassName(className?: string) {
  return cn(
    "min-h-[120px] w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-zinc-100/40 focus:bg-black/28",
    className
  );
}

export function selectClassName(className?: string) {
  return textInputClassName(className);
}
