import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type PlaceholderSectionCardProps = {
  title: string;
  description: string;
  status: string;
  icon: LucideIcon;
};

export function PlaceholderSectionCard({
  title,
  description,
  status,
  icon: Icon,
}: PlaceholderSectionCardProps) {
  return (
    <Card className="surface-glow border-border bg-card backdrop-blur-xl">
      <CardContent className="space-y-4 px-5 py-5 sm:px-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white/80">
            <Icon className="size-5" />
          </div>
          <Badge
            variant="outline"
            className="border-white/10 bg-white/[0.03] text-white/58"
          >
            {status}
          </Badge>
        </div>

        <div>
          <h3 className="font-heading text-lg text-white">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-white/46">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
