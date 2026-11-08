import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type SectionShellProps = {
  title: string;
  description: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
};

export function SectionShell({
  title,
  description,
  eyebrow,
  action,
  children,
}: SectionShellProps) {
  return (
    <div className="space-y-6">
      <Card className="surface-glow overflow-hidden border-border bg-card backdrop-blur-2xl">
        <CardContent className="relative px-5 py-7 sm:px-6 md:px-8 md:py-9">
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              {eyebrow ? (
                <Badge className="mb-4 bg-white/10 text-white/72">{eyebrow}</Badge>
              ) : null}
              <h1 className="font-heading text-3xl font-semibold text-white">
                {title}
              </h1>
              <p className="mt-3 text-sm leading-7 text-white/58 sm:text-base">
                {description}
              </p>
            </div>
            {action ? <div className="flex flex-wrap gap-3">{action}</div> : null}
          </div>
        </CardContent>
      </Card>

      {children}
    </div>
  );
}
