"use client";

import { useState } from "react";

import { Plus } from "lucide-react";

import { FormField } from "@/components/app/form-field";
import { textInputClassName } from "@/components/app/fields";
import { SectionShell } from "@/components/app/section-shell";
import { useAppState } from "@/components/providers/app-state-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function YolHaritasiPageView() {
  const { data, completedRoadmapCount, addRoadmapWeek, upsertRoadmapWeek } =
    useAppState();
  const [form, setForm] = useState({
    weekNumber: String(data.roadmapWeeks.length + 1),
    title: "",
    focus: "",
  });

  return (
    <SectionShell
      title="Yol Haritası"
      description="Haftalık plan bloklarını yaşayan bir sistem gibi yönet. İlerleme yüzdesi ve durum güncellendiğinde tablo kendini yeniden kurar."
      eyebrow="52 haftalık düzen"
      action={
        <Badge className="bg-white/10 text-white/72">
          {completedRoadmapCount}/{data.roadmapWeeks.length} hafta tamamlandı
        </Badge>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-4">
          {data.roadmapWeeks.map((week) => (
            <Card
              key={week.id}
              className="surface-glow border-border bg-card backdrop-blur-xl"
            >
              <CardContent className="space-y-4 px-5 py-5 sm:px-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/38">
                      Hafta {week.weekNumber}
                    </p>
                    <h2 className="mt-2 font-heading text-xl text-white">
                      {week.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-white/55">
                      {week.focus}
                    </p>
                  </div>

                  <Badge className="w-fit bg-white/10 text-white/72">
                    {week.status}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-white/52">
                    <span>İlerleme</span>
                    <span>%{week.progress}</span>
                  </div>
                  <Progress value={week.progress} />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={week.progress}
                    onChange={(event) =>
                      upsertRoadmapWeek(week.id, {
                        progress: Number(event.target.value),
                      })
                    }
                    className="w-full accent-zinc-100"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {(["planlandı", "devam ediyor", "tamamlandı"] as const).map(
                    (status) => (
                      <Button
                        key={status}
                        variant={week.status === status ? "default" : "outline"}
                        className={
                          week.status === status
                            ? "rounded-2xl bg-white text-zinc-950 hover:bg-zinc-200"
                            : "rounded-2xl border-white/12 bg-white/[0.03] text-white hover:bg-white/[0.08]"
                        }
                        onClick={() => upsertRoadmapWeek(week.id, { status })}
                      >
                        {status}
                      </Button>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="surface-glow h-fit border-border bg-card backdrop-blur-xl">
          <CardContent className="space-y-4 px-5 py-5 sm:px-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/38">
                Yeni hafta
              </p>
              <h2 className="mt-2 font-heading text-xl text-white">
                Planı genişlet
              </h2>
            </div>

            <FormField label="Hafta numarası">
              <input
                className={textInputClassName()}
                value={form.weekNumber}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    weekNumber: event.target.value,
                  }))
                }
              />
            </FormField>

            <FormField label="Başlık">
              <input
                className={textInputClassName()}
                placeholder="Örn. Fonksiyon kavramını oturt"
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
              />
            </FormField>

            <FormField label="Odak">
              <textarea
                className="min-h-[100px] w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/28 focus:border-zinc-100/40"
                placeholder="Bu haftanın ana çalışmasını kısa yaz."
                value={form.focus}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    focus: event.target.value,
                  }))
                }
              />
            </FormField>

            <Button
              className="h-11 w-full rounded-2xl bg-white text-zinc-950 hover:bg-zinc-200"
              onClick={() => {
                if (!form.title.trim() || !form.focus.trim()) {
                  return;
                }

                addRoadmapWeek({
                  weekNumber: Number(form.weekNumber) || data.roadmapWeeks.length + 1,
                  title: form.title.trim(),
                  focus: form.focus.trim(),
                  progress: 0,
                  status: "planlandı",
                });

                setForm({
                  weekNumber: String(data.roadmapWeeks.length + 2),
                  title: "",
                  focus: "",
                });
              }}
            >
              <Plus className="size-4" />
              Yeni hafta ekle
            </Button>
          </CardContent>
        </Card>
      </div>
    </SectionShell>
  );
}
