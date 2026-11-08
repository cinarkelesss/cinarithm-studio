"use client";

import { BarChart3, BookOpen, CalendarDays, PenSquare } from "lucide-react";

import { SectionShell } from "@/components/app/section-shell";
import { useAppState } from "@/components/providers/app-state-provider";
import { Card, CardContent } from "@/components/ui/card";
import { formatShortDate } from "@/lib/date";

export function IstatistiklerPageView() {
  const { data, streak, totalXp, weeklyXp } = useAppState();
  const estimatedHours =
    weeklyXp.reduce((total, day) => total + day.xp, 0) / 10 + data.proofs.length;
  const maxDailyXp = Math.max(10, ...weeklyXp.map((day) => day.xp));

  const cards = [
    {
      title: "Toplam XP",
      value: totalXp,
      detail: "Kümülatif çalışma puanı",
      icon: BarChart3,
    },
    {
      title: "Seri",
      value: `${streak} gün`,
      detail: "Aralıksız çalışma zinciri",
      icon: CalendarDays,
    },
    {
      title: "İspatlar",
      value: data.proofs.length,
      detail: "Kayıtlı ispat sayısı",
      icon: PenSquare,
    },
    {
      title: "Kitaplar",
      value: data.books.length,
      detail: "Aktif ve pasif kaynaklar",
      icon: BookOpen,
    },
  ];

  return (
    <SectionShell
      title="İstatistikler"
      description="Buradaki sayılar amaç değil, aynadır. Nerede tempo tuttuğunu ve nerede dağıldığını görmeni sağlar."
      eyebrow="Sayısal görünüm"
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card
            key={card.title}
            className="surface-glow border-border bg-card backdrop-blur-xl"
          >
            <CardContent className="px-5 py-5 sm:px-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-white/50">{card.title}</p>
                  <p className="mt-3 font-heading text-3xl text-white">
                    {card.value}
                  </p>
                </div>
                <div className="flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white/80">
                  <card.icon className="size-4" />
                </div>
              </div>
              <p className="mt-4 text-sm text-white/44">{card.detail}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="surface-glow border-border bg-card backdrop-blur-xl">
          <CardContent className="space-y-5 px-5 py-5 sm:px-6">
            <div>
              <h2 className="font-heading text-xl text-white">Son 7 gün XP akışı</h2>
              <p className="mt-2 text-sm text-white/48">
                Her günün çalışma puanı burada yoğunluk olarak görünüyor.
              </p>
            </div>

            <div className="grid grid-cols-7 gap-3">
              {weeklyXp.map((day) => (
                <div key={day.date} className="space-y-2">
                  <div className="flex h-44 items-end rounded-3xl border border-white/8 bg-black/18 p-2">
                    <div
                      className="w-full rounded-2xl bg-zinc-100"
                      style={{
                        height: `${Math.max(8, (day.xp / maxDailyXp) * 100)}%`,
                      }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-white/40">
                      {formatShortDate(day.date)}
                    </p>
                    <p className="mt-1 text-sm text-white/68">{day.xp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="surface-glow border-border bg-card backdrop-blur-xl">
          <CardContent className="space-y-4 px-5 py-5 sm:px-6">
            <h2 className="font-heading text-xl text-white">Yoğunluk özeti</h2>

            <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-4">
              <p className="text-sm text-white/46">Tahmini haftalık yük</p>
              <p className="mt-3 font-heading text-3xl text-white">
                {estimatedHours.toFixed(1)} saat
              </p>
            </div>

            <div className="grid gap-3">
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <p className="text-sm text-white/46">Günlük kayıtlar</p>
                <p className="mt-2 text-lg text-white">
                  {data.journalEntries.length} giriş
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <p className="text-sm text-white/46">Çözülen problem</p>
                <p className="mt-2 text-lg text-white">
                  {
                    data.problems.filter((problem) => problem.status === "çözüldü")
                      .length
                  }
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <p className="text-sm text-white/46">Oturmuş kavram</p>
                <p className="mt-2 text-lg text-white">
                  {
                    data.knowledgeNodes.filter((node) => node.status === "oturdu")
                      .length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SectionShell>
  );
}
