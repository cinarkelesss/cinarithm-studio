import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
};

export function StatCard({ label, value, detail, icon: Icon }: StatCardProps) {
  return (
    <Card className="surface-glow border-border bg-card backdrop-blur-xl">
      <CardContent className="px-5 py-5 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-white/55">{label}</p>
            <p className="mt-3 font-heading text-3xl font-semibold text-white">
              {value}
            </p>
          </div>
          <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white/80">
            <Icon className="size-5" />
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-white/48">{detail}</p>
      </CardContent>
    </Card>
  );
}
