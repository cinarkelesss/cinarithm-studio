"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, CalendarClock, FileText, NotebookPen, Search } from "lucide-react";

import { SectionShell } from "@/components/app/section-shell";
import { useLearningWorkspace } from "@/components/providers/learning-workspace-provider";
import { learningCatalog } from "@/data/learning/curriculum";
import { getContinueLesson } from "@/lib/learning/catalog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

function countWords(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function NotesPage() {
  const { state } = useLearningWorkspace();
  const [query, setQuery] = useState("");
  const continueLesson = getContinueLesson(state);
  const notes = Object.values(state.lessonNotes).sort((left, right) =>
    right.updatedAt.localeCompare(left.updatedAt)
  );
  const filteredNotes = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("tr-TR");
    return notes.filter((note) => {
      if (!normalized) {
        return true;
      }

      const lesson = learningCatalog.lessons.find((item) => item.id === note.lessonId);
      const course = learningCatalog.courses.find((item) => item.id === lesson?.courseId);
      const haystack = [note.content, lesson?.title, course?.title]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("tr-TR");

      return haystack.includes(normalized);
    });
  }, [notes, query]);

  return (
    <SectionShell
      eyebrow="Notlar"
      title="Ders Notları"
      description="Derslere bağlı notlar tek yerde görünür; günlüğe değil doğrudan ders bağlamına bağlıdır."
      action={
        continueLesson ? (
          <Link
            href={`/learning/course/${learningCatalog.courses.find((course) => course.id === continueLesson.courseId)?.slug}/lesson/${continueLesson.slug}`}
            className="flex h-11 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
          >
            Derse Dön
            <ArrowRight className="size-4" />
          </Link>
        ) : null
      }
    >
      <section className="grid gap-4 md:grid-cols-3">
        <Card className="surface-glow border-border bg-card backdrop-blur-xl md:col-span-2">
          <CardContent className="px-5 py-5 sm:px-6">
            <label className="flex items-center gap-3 rounded-2xl border border-white/8 bg-black/12 px-4 py-3 text-sm text-white/56">
              <Search className="size-4" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ders adı, kurs ya da not içinde ara..."
                className="w-full bg-transparent text-white outline-none placeholder:text-white/30"
              />
            </label>
          </CardContent>
        </Card>

        <Card className="surface-glow border-border bg-card backdrop-blur-xl">
          <CardContent className="space-y-3 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-2 text-sm text-white/66">
              <NotebookPen className="size-4" />
              <span>Görünen notlar</span>
            </div>
            <p className="font-heading text-3xl text-white">{filteredNotes.length}</p>
            <p className="text-sm leading-6 text-white/45">
              Filtre sonrası görünen ders notu sayısı.
            </p>
          </CardContent>
        </Card>
      </section>

      {filteredNotes.length > 0 ? (
        <section className="grid gap-4 xl:grid-cols-2">
          {filteredNotes.map((note) => {
            const lesson = learningCatalog.lessons.find((item) => item.id === note.lessonId);
            const course = learningCatalog.courses.find((item) => item.id === lesson?.courseId);

            return (
              <Link
                key={note.id}
                href={`/learning/course/${course?.slug}/lesson/${lesson?.slug}`}
              >
                <Card className="surface-glow h-full border-border bg-card transition hover:bg-[#222226]">
                  <CardContent className="space-y-4 px-5 py-5 sm:px-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-white/66">
                          <NotebookPen className="size-4" />
                          <span>{course?.title ?? "Ders"}</span>
                        </div>
                        <h2 className="mt-3 font-heading text-2xl text-white">
                          {lesson?.title ?? "Adsız ders"}
                        </h2>
                      </div>
                      <Badge className="bg-white/10 text-white/72">
                        <CalendarClock className="mr-2 size-3.5" />
                        {new Date(note.updatedAt).toLocaleDateString("tr-TR")}
                      </Badge>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/8 bg-black/12 px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-white/32">Kelime</p>
                        <p className="mt-2 text-base font-semibold text-white">
                          {countWords(note.content)}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/8 bg-black/12 px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-white/32">Ders</p>
                        <p className="mt-2 text-base font-semibold text-white">
                          {course?.shortTitle ?? "Kurs"}
                        </p>
                      </div>
                    </div>

                    <p className="whitespace-pre-wrap text-sm leading-7 text-white/52">
                      {note.content || "Bu ders için henüz içerik yazılmadı."}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </section>
      ) : (
        <Card className="surface-glow border-border bg-card backdrop-blur-xl">
          <CardContent className="flex flex-col items-center justify-center gap-4 px-5 py-12 text-center sm:px-6">
            <div className="flex size-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/72">
              <FileText className="size-6" />
            </div>
            <h2 className="font-heading text-2xl text-white">Henüz ders notu yok</h2>
            <p className="max-w-xl text-sm leading-7 text-white/50">
              Bir ders açıp sağ panelden not yazdığında burada toplanacak.
            </p>
            <Link
              href={continueLesson ? `/learning/course/${learningCatalog.courses.find((course) => course.id === continueLesson.courseId)?.slug}/lesson/${continueLesson.slug}` : "/learning"}
              className="inline-flex h-11 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
            >
              {continueLesson ? "Mevcut Dersi Aç" : "Derslere Git"}
              <ArrowRight className="size-4" />
            </Link>
          </CardContent>
        </Card>
      )}
    </SectionShell>
  );
}
