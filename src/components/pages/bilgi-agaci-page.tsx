"use client";

import { useMemo, useState } from "react";

import { Network } from "lucide-react";

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

export function BilgiAgaciPageView() {
  const { data, addKnowledgeNode, updateKnowledgeNode } = useAppState();
  const { nodeCounts } = useMemo(() => buildLearningReverseCounts(data), [data]);
  const [form, setForm] = useState({
    title: "",
    branch: "",
    status: "başlangıç",
    note: "",
  });

  return (
    <SectionShell
      title="Bilgi Ağacı"
      description="Kavramları düğüm gibi düşün. Bir düğüm yalnızca okundu diye değil, gerçekten oturduğunda değer kazanır."
      eyebrow="Kavram haritası"
    >
      <div className="grid gap-4 xl:grid-cols-[0.84fr_1.16fr]">
        <Card className="surface-glow h-fit border-border bg-card backdrop-blur-xl">
          <CardContent className="space-y-4 px-5 py-5 sm:px-6">
            <h2 className="font-heading text-xl text-white">Yeni düğüm ekle</h2>

            <FormField label="Kavram">
              <input
                className={textInputClassName()}
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({ ...current, title: event.target.value }))
                }
              />
            </FormField>

            <FormField label="Dal">
              <input
                className={textInputClassName()}
                value={form.branch}
                onChange={(event) =>
                  setForm((current) => ({ ...current, branch: event.target.value }))
                }
              />
            </FormField>

            <FormField label="Durum">
              <select
                className={selectClassName()}
                value={form.status}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    status: event.target.value as "başlangıç" | "çalışılıyor" | "oturdu",
                  }))
                }
              >
                <option value="başlangıç">Başlangıç</option>
                <option value="çalışılıyor">Çalışılıyor</option>
                <option value="oturdu">Oturdu</option>
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
                if (!form.title.trim() || !form.branch.trim()) {
                  return;
                }

                addKnowledgeNode({
                  title: form.title.trim(),
                  branch: form.branch.trim(),
                  status: form.status as "başlangıç" | "çalışılıyor" | "oturdu",
                  note: form.note.trim(),
                });

                setForm({
                  title: "",
                  branch: "",
                  status: "başlangıç",
                  note: "",
                });
              }}
            >
              Düğüm ekle
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {data.knowledgeNodes.map((node) => (
            <Card
              key={node.id}
              className="surface-glow border-border bg-card backdrop-blur-xl"
            >
              <CardContent className="space-y-4 px-5 py-5 sm:px-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white/80">
                      <Network className="size-4" />
                    </div>
                    <div>
                      <h2 className="font-heading text-lg text-white">
                        {node.title}
                      </h2>
                      <p className="mt-1 text-sm text-white/46">{node.branch}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(nodeCounts[node.id] ?? 0) > 0 ? (
                      <Badge className="bg-zinc-200/16 text-zinc-200">
                        Learning Hub: {nodeCounts[node.id]}
                      </Badge>
                    ) : null}
                    <Badge className="bg-white/10 text-white/70">{node.status}</Badge>
                  </div>
                </div>

                <textarea
                  className={textAreaClassName("min-h-[100px]")}
                  value={node.note}
                  onChange={(event) =>
                    updateKnowledgeNode(node.id, { note: event.target.value })
                  }
                />

                <div className="flex flex-wrap gap-2">
                  {(["başlangıç", "çalışılıyor", "oturdu"] as const).map(
                    (status) => (
                      <Button
                        key={status}
                        variant={node.status === status ? "default" : "outline"}
                        className={
                          node.status === status
                            ? "rounded-2xl bg-white text-zinc-950 hover:bg-zinc-200"
                            : "rounded-2xl border-white/12 bg-white/[0.03] text-white hover:bg-white/[0.08]"
                        }
                        onClick={() => updateKnowledgeNode(node.id, { status })}
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
