import { cn } from "@/lib/utils";

type CinarithmLogoProps = {
  compact?: boolean;
  className?: string;
};

export function CinarithmLogo({
  compact = false,
  className,
}: CinarithmLogoProps) {
  if (compact) {
    return (
      <div
        className={cn(
          "flex min-w-0 items-center justify-center rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-2 py-2.5 text-center shadow-2xl shadow-black/20",
          className
        )}
      >
        <div className="min-w-0">
          <p className="font-heading text-[0.58rem] font-semibold uppercase tracking-[0.24em] text-white/92">
            Cinar
          </p>
          <p className="mt-0.5 font-heading text-[0.58rem] font-semibold uppercase tracking-[0.24em] text-white/82">
            ithm
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-w-0", className)}>
      <p className="font-heading text-lg font-semibold uppercase tracking-[0.28em] text-white/95">
        Cinarithm
      </p>
      <p className="mt-1 text-sm text-white/55">Matematikte derinleşmek için.</p>
    </div>
  );
}
