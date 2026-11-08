"use client";

import { Trophy } from "lucide-react";

import { SectionShell } from "@/components/app/section-shell";
import { useAppState } from "@/components/providers/app-state-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateLabel } from "@/lib/date";

export function BasarilarimPageView() {
  const { achievements, data } = useAppState();

  return (
    <SectionShell
      title="Başarılarım"
      description="Rozetler motivasyon için değil, geride gerçekten birikmiş emek olduğunu görünür kılmak için burada."
      eyebrow="Kilometre taşları"
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {achievements.map((achievement) => (
          <Card
            key={achievement.id}
            className="surface-glow border-border bg-card backdrop-blur-xl"
          >
            <CardContent className="space-y-4 px-5 py-5 sm:px-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white/80">
                  <Trophy className="size-5" />
                </div>
                <Badge
                  className={
                    achievement.unlocked
                      ? "bg-zinc-300/16 text-zinc-200"
                      : "bg-white/10 text-white/55"
                  }
                >
                  {achievement.unlocked ? "Açıldı" : achievement.progressLabel}
                </Badge>
              </div>
              <div>
                <h2 className="font-heading text-lg text-white">
                  {achievement.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/52">
                  {achievement.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="surface-glow border-border bg-card backdrop-blur-xl">
        <CardContent className="space-y-4 px-5 py-5 sm:px-6">
          <h2 className="font-heading text-xl text-white">Son hareketler</h2>
          <div className="space-y-3">
            {data.activityLog
              .slice()
              .reverse()
              .slice(0, 8)
              .map((activity) => (
                <div
                  key={activity.id}
                  className="flex flex-col gap-2 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-white">{activity.label}</p>
                    <p className="mt-1 text-sm text-white/44">
                      {formatDateLabel(activity.date)}
                    </p>
                  </div>
                  <Badge className="w-fit bg-white/10 text-white/70">
                    +{activity.xp} XP
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </SectionShell>
  );
}
