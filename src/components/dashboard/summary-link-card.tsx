import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type SummaryLinkCardProps = {
  title: string;
  description: string;
  href: string;
  value: string;
  icon: LucideIcon;
};

export function SummaryLinkCard({
  title,
  description,
  href,
  value,
  icon: Icon,
}: SummaryLinkCardProps) {
  return (
    <Link href={href} className="block">
      <Card className="surface-glow h-full border-border bg-card backdrop-blur-xl transition hover:bg-[#222226]">
        <CardContent className="space-y-4 px-5 py-5 sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white/80">
              <Icon className="size-5" />
            </div>
            <Badge className="bg-white/10 text-white/72">
              {value}
            </Badge>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-lg text-white">{title}</h3>
              <ArrowUpRight className="size-4 text-white/45" />
            </div>
            <p className="mt-2 text-sm leading-6 text-white/48">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
