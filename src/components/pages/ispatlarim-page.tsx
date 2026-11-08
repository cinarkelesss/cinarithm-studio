"use client";

import { useMemo, useState } from "react";

import { Sigma } from "lucide-react";

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
import { buildLearningReverseCounts } from "@/lib/learning-links";

export function IspatlarimPageView() {
  const { data, addProof } = useAppState();
  const { proofCounts } = useMemo(() => buildLearningReverseCounts(data), [data]);
  const [form, setForm] = useState({
    title: "",
    technique: "Doğrudan ispat",
    source: "",
    difficulty: "orta",
    note: "",
  });

  return (
    <SectionShell
      title="İspatlarım"
      description="Her yazdığın ispatı kaydet. Zamanla hangi teknikleri daha sık kullandığını ve hangi kaynaklardan beslendiğini buradan göreceksin."
      eyebrow="İspat arşivi"
      action={
        <Badge className="bg-white/10 text-white/72">
          Toplam {data.proofs.length} ispat
        </Badge>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="surface-glow h-fit border-border bg-card backdrop-blur-xl">
          <CardContent className="space-y-4 px-5 py-5 sm:px-6">
            <h2 className="font-heading text-xl text-white">Yeni ispat ekle</h2>

            <FormField label="Başlık">
              <input
                className={textInputClassName()}
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({ ...current, title: event.target.value }))
                }
              />
            </FormField>

            <FormField label="Teknik">
              <input
                className={textInputClassName()}
                value={form.technique}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    technique: event.target.value,
                  }))
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

                addProof({
                  title: form.title.trim(),
                  technique: form.technique.trim(),
                  source: form.source.trim() || "Belirtilmedi",
                  difficulty: form.difficulty as "kolay" | "orta" | "zor",
                  note: form.note.trim(),
                });

                setForm({
                  title: "",
                  technique: "Doğrudan ispat",
                  source: "",
                  difficulty: "orta",
                  note: "",
                });
              }}
            >
              İspatı kaydet
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {data.proofs.map((proof) => (
            <Card
              key={proof.id}
              className="surface-glow border-border bg-card backdrop-blur-xl"
            >
              <CardContent className="space-y-3 px-5 py-5 sm:px-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white/80">
                      <Sigma className="size-4" />
                    </div>
                    <div>
                      <h2 className="font-heading text-lg text-white">
                        {proof.title}
                      </h2>
                      <p className="mt-1 text-sm text-white/46">{proof.source}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(proofCounts[proof.id] ?? 0) > 0 ? (
                      <Badge className="bg-zinc-200/16 text-zinc-200">
                        Learning Hub: {proofCounts[proof.id]}
                      </Badge>
                    ) : null}
                    <Badge className="bg-white/10 text-white/70">
                      {proof.difficulty}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-white/65">{proof.technique}</p>
                <p className="text-sm leading-6 text-white/52">{proof.note}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
