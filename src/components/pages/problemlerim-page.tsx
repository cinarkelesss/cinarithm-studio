"use client";

import { useState } from "react";

import { Puzzle } from "lucide-react";

import { FormField } from "@/components/app/form-field";
import {
  selectClassName,
  textInputClassName,
  textAreaClassName,
} from "@/components/app/fields";
import { SectionShell } from "@/components/app/section-shell";
import { useAppState } from "@/components/providers/app-state-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ProblemlerimPageView() {
  const { data, addProblem, updateProblem } = useAppState();
  const [form, setForm] = useState({
    title: "",
    source: "",
    difficulty: "orta",
    status: "bekliyor",
    note: "",
  });

  return (
    <SectionShell
      title="Problemlerim"
      description="Uğraştığın soruları unutma. Çözülemeyen problem bile değerli bir kayıt; nasıl düşündüğünü görünür kılar."
      eyebrow="Problem havuzu"
    >
      <div className="grid gap-4 xl:grid-cols-[0.84fr_1.16fr]">
        <Card className="surface-glow h-fit border-border bg-card backdrop-blur-xl">
          <CardContent className="space-y-4 px-5 py-5 sm:px-6">
            <h2 className="font-heading text-xl text-white">Yeni problem ekle</h2>

            <FormField label="Başlık">
              <input
                className={textInputClassName()}
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({ ...current, title: event.target.value }))
                }
              />
            </FormField>

            <FormField label="Kaynak">
              <input
                className={textInputClassName()}
                value={form.source}
                onChange={(event) =>
                  setForm((current) => ({ ...current, source: event.target.value }))
                }
              />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Zorluk">
                <select
                  className={selectClassName()}
                  value={form.difficulty}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      difficulty: event.target.value as "kolay" | "orta" | "zor",
                    }))
                  }
                >
                  <option value="kolay">Kolay</option>
                  <option value="orta">Orta</option>
                  <option value="zor">Zor</option>
                </select>
              </FormField>

              <FormField label="Durum">
                <select
                  className={selectClassName()}
                  value={form.status}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      status: event.target.value as
                        | "bekliyor"
                        | "çalışılıyor"
                        | "çözüldü",
                    }))
                  }
                >
                  <option value="bekliyor">Bekliyor</option>
                  <option value="çalışılıyor">Çalışılıyor</option>
                  <option value="çözüldü">Çözüldü</option>
                </select>
              </FormField>
            </div>

            <FormField label="Not">
              <textarea
                className={textAreaClassName()}
                value={form.note}
                onChange={(event) =>
                  setForm((current) => ({ ...current, note: event.target.value }))
                }
              />
            </FormField>

            <Button
              className="h-11 w-full rounded-2xl bg-white text-zinc-950 hover:bg-zinc-200"
              onClick={() => {
                if (!form.title.trim()) {
                  return;
                }

                addProblem({
                  title: form.title.trim(),
                  source: form.source.trim() || "Belirtilmedi",
                  difficulty: form.difficulty as "kolay" | "orta" | "zor",
                  status: form.status as "bekliyor" | "çalışılıyor" | "çözüldü",
                  note: form.note.trim(),
                });

                setForm({
                  title: "",
                  source: "",
                  difficulty: "orta",
                  status: "bekliyor",
                  note: "",
                });
              }}
            >
              Problemi ekle
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {data.problems.map((problem) => (
            <Card
              key={problem.id}
              className="surface-glow border-border bg-card backdrop-blur-xl"
            >
              <CardContent className="space-y-4 px-5 py-5 sm:px-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white/80">
                      <Puzzle className="size-4" />
                    </div>
                    <div>
                      <h2 className="font-heading text-lg text-white">
                        {problem.title}
                      </h2>
                      <p className="mt-1 text-sm text-white/46">
                        {problem.source}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className="bg-white/10 text-white/70">
                      {problem.difficulty}
                    </Badge>
                    <Badge className="bg-zinc-100/12 text-zinc-200">
                      {problem.status}
                    </Badge>
                  </div>
                </div>

                <textarea
                  className={textAreaClassName("min-h-[90px]")}
                  value={problem.note}
                  onChange={(event) =>
                    updateProblem(problem.id, { note: event.target.value })
                  }
                />

                <div className="flex flex-wrap gap-2">
                  {(["bekliyor", "çalışılıyor", "çözüldü"] as const).map(
                    (status) => (
                      <Button
                        key={status}
                        variant={problem.status === status ? "default" : "outline"}
                        className={
                          problem.status === status
                            ? "rounded-2xl bg-white text-zinc-950 hover:bg-zinc-200"
                            : "rounded-2xl border-white/12 bg-white/[0.03] text-white hover:bg-white/[0.08]"
                        }
                        onClick={() => updateProblem(problem.id, { status })}
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
      </div>
    </SectionShell>
  );
}
