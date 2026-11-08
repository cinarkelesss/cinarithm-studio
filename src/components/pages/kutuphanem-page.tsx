"use client";

import { useMemo, useState } from "react";

import { BookOpenText, Check, Star } from "lucide-react";

import { FormField } from "@/components/app/form-field";
import { textInputClassName, textAreaClassName } from "@/components/app/fields";
import { SectionShell } from "@/components/app/section-shell";
import { useAppState } from "@/components/providers/app-state-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { buildLearningReverseCounts } from "@/lib/learning-links";

export function KutuphanemPageView() {
  const { data, addBook, setActiveBook, updateBook } = useAppState();
  const { bookCounts } = useMemo(() => buildLearningReverseCounts(data), [data]);
  const [form, setForm] = useState({
    title: "",
    author: "",
    currentSection: "",
    note: "",
  });

  return (
    <SectionShell
      title="Kütüphanem"
      description="Aktif kitaplarını, ilerleme yüzdelerini ve bölüm notlarını tek yerde tut. Bir kitabı odak kitabı yaptığında Ana Sayfa da otomatik güncellenir."
      eyebrow="Okuma sistemi"
    >
      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          {data.books.map((book) => (
            <Card
              key={book.id}
              className="surface-glow border-border bg-card backdrop-blur-xl"
            >
              <CardContent className="space-y-4 px-5 py-5 sm:px-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white/80">
                      <BookOpenText className="size-5" />
                    </div>
                    <div>
                      <h2 className="font-heading text-xl text-white">{book.title}</h2>
                      <p className="mt-1 text-sm text-white/46">{book.author}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {book.isActive ? (
                      <Badge className="bg-zinc-100/16 text-zinc-200">Odakta</Badge>
                    ) : null}
                    {(bookCounts[book.id] ?? 0) > 0 ? (
                      <Badge className="bg-zinc-200/16 text-zinc-200">
                        Learning Hub: {bookCounts[book.id]}
                      </Badge>
                    ) : null}
                    <Badge className="bg-white/10 text-white/70">%{book.progress}</Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <Progress value={book.progress} />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={book.progress}
                    onChange={(event) =>
                      updateBook(book.id, { progress: Number(event.target.value) })
                    }
                    className="w-full accent-zinc-100"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField label="Sıradaki bölüm">
                    <input
                      className={textInputClassName()}
                      value={book.currentSection}
                      onChange={(event) =>
                        updateBook(book.id, {
                          currentSection: event.target.value,
                        })
                      }
                    />
                  </FormField>

                  <FormField label="Not">
                    <textarea
                      className={textAreaClassName("min-h-[90px]")}
                      value={book.note}
                      onChange={(event) =>
                        updateBook(book.id, {
                          note: event.target.value,
                        })
                      }
                    />
                  </FormField>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    className="rounded-2xl bg-white text-zinc-950 hover:bg-zinc-200"
                    onClick={() => setActiveBook(book.id)}
                  >
                    <Star className="size-4" />
                    Aktif kitap yap
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="surface-glow h-fit border-border bg-card backdrop-blur-xl">
          <CardContent className="space-y-4 px-5 py-5 sm:px-6">
            <h2 className="font-heading text-xl text-white">Yeni kitap ekle</h2>

            <FormField label="Kitap adı">
              <input
                className={textInputClassName()}
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({ ...current, title: event.target.value }))
                }
              />
            </FormField>

            <FormField label="Yazar">
              <input
                className={textInputClassName()}
                value={form.author}
                onChange={(event) =>
                  setForm((current) => ({ ...current, author: event.target.value }))
                }
              />
            </FormField>

            <FormField label="Sıradaki bölüm">
              <input
                className={textInputClassName()}
                value={form.currentSection}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    currentSection: event.target.value,
                  }))
                }
              />
            </FormField>

            <FormField label="Kısa not">
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
                if (!form.title.trim() || !form.author.trim()) {
                  return;
                }

                addBook({
                  title: form.title.trim(),
                  author: form.author.trim(),
                  progress: 0,
                  currentSection: form.currentSection.trim() || "Başlangıç",
                  note: form.note.trim(),
                });

                setForm({
                  title: "",
                  author: "",
                  currentSection: "",
                  note: "",
                });
              }}
            >
              <Check className="size-4" />
              Kitabı ekle
            </Button>
          </CardContent>
        </Card>
      </div>
    </SectionShell>
  );
}
