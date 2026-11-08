"use client";

import { useState } from "react";

import { BookText } from "lucide-react";

import { FormField } from "@/components/app/form-field";
import {
  textAreaClassName,
  textInputClassName,
} from "@/components/app/fields";
import { SectionShell } from "@/components/app/section-shell";
import { useAppState } from "@/components/providers/app-state-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateLabel } from "@/lib/date";

export function MatematikGunlugumPageView() {
  const { data, addJournalEntry } = useAppState();
  const [form, setForm] = useState({
    title: "",
    tag: "genel",
    body: "",
  });

  return (
    <SectionShell
      title="Matematik Günlüğüm"
      description="Düşünceyi yavaşlatıp görünür hale getiren yer burası. Takıldığın anı, küçük bir fark edişi ya da netleşen bir fikri yaz."
      eyebrow="Yazı hafızası"
    >
      <div className="grid gap-4 xl:grid-cols-[0.82fr_1.18fr]">
        <Card className="surface-glow h-fit border-border bg-card backdrop-blur-xl">
          <CardContent className="space-y-4 px-5 py-5 sm:px-6">
            <h2 className="font-heading text-xl text-white">Yeni günlük kaydı</h2>

            <FormField label="Başlık">
              <input
                className={textInputClassName()}
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({ ...current, title: event.target.value }))
                }
              />
            </FormField>

            <FormField label="Etiket">
              <input
                className={textInputClassName()}
                value={form.tag}
                onChange={(event) =>
                  setForm((current) => ({ ...current, tag: event.target.value }))
                }
              />
            </FormField>

            <FormField label="Metin">
              <textarea
                className={textAreaClassName("min-h-[220px]")}
                value={form.body}
                onChange={(event) =>
                  setForm((current) => ({ ...current, body: event.target.value }))
                }
              />
            </FormField>

            <Button
              className="h-11 w-full rounded-2xl bg-white text-zinc-950 hover:bg-zinc-200"
              onClick={() => {
                if (!form.title.trim() || !form.body.trim()) {
                  return;
                }

                addJournalEntry({
                  title: form.title.trim(),
                  tag: form.tag.trim() || "genel",
                  body: form.body.trim(),
                });

                setForm({
                  title: "",
                  tag: "genel",
                  body: "",
                });
              }}
            >
              Günlüğe ekle
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {data.journalEntries.map((entry) => (
            <Card
              key={entry.id}
              className="surface-glow border-border bg-card backdrop-blur-xl"
            >
              <CardContent className="space-y-4 px-5 py-5 sm:px-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white/80">
                      <BookText className="size-4" />
                    </div>
                    <div>
                      <h2 className="font-heading text-lg text-white">
                        {entry.title}
                      </h2>
                      <p className="mt-1 text-sm text-white/46">
                        {formatDateLabel(entry.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-white/10 text-white/70">{entry.tag}</Badge>
                </div>

                <p className="text-sm leading-7 text-white/56">{entry.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
