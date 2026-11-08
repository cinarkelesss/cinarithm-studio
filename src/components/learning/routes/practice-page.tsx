"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CirclePlay,
  Layers3,
  Repeat2,
} from "lucide-react";

import { SectionShell } from "@/components/app/section-shell";
import { useLearningWorkspace } from "@/components/providers/learning-workspace-provider";
import { learningCatalog } from "@/data/learning/curriculum";
import { getContinueLesson } from "@/lib/learning/catalog";
import { getExerciseFormatLabel } from "@/lib/learning/ui-copy";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function PracticePage() {
  const { markExerciseComplete, state } = useLearningWorkspace();
  const continueLesson = getContinueLesson(state);
  const completedExerciseIds = new Set(Object.keys(state.exerciseProgress));
  const remainingExercises = learningCatalog.exercises.filter(
    (exercise) => !completedExerciseIds.has(exercise.id)
  );
  const completedExercises = learningCatalog.exercises.filter((exercise) =>
    completedExerciseIds.has(exercise.id)
  );

  return (
    <SectionShell
      eyebrow="Alıştırmalar"
      title="Alıştırmalar"
      description="Ders alıştırmaları ve ortak alıştırma havuzu aynı modelde birleşiyor; burada tekrar için toparlanıyor."
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
        {[
          {
            label: "Açık olanlar",
            value: remainingExercises.length,
            detail: "Henüz işaretlenmemiş alıştırma sayısı.",
            icon: CirclePlay,
          },
          {
            label: "Tamamlananlar",
            value: completedExercises.length,
            detail: "Tekrar dönülmüş alıştırma sayısı.",
            icon: CheckCircle2,
          },
          {
            label: "Ortak havuz",
            value: learningCatalog.exercises.length,
            detail: "Ders ve alıştırma bağlamı aynı bankadan besleniyor.",
            icon: Layers3,
          },
        ].map((item) => (
          <Card
            key={item.label}
            className="surface-glow border-border bg-card backdrop-blur-xl"
          >
            <CardContent className="space-y-3 px-5 py-5 sm:px-6">
              <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white/78">
                <item.icon className="size-5" />
              </div>
              <p className="text-sm text-white/55">{item.label}</p>
              <p className="font-heading text-3xl text-white">{item.value}</p>
              <p className="text-sm leading-6 text-white/45">{item.detail}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="surface-glow border-border bg-card backdrop-blur-xl">
          <CardContent className="space-y-5 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-2 text-sm text-white/66">
              <Repeat2 className="size-4" />
              <span>Alıştırmaya Devam Et</span>
            </div>
            {remainingExercises.length > 0 ? (
              <div className="space-y-3">
                {remainingExercises.slice(0, 5).map((exercise) => {
                  const course = learningCatalog.courses.find(
                    (item) => item.id === exercise.courseId
                  );
                  const lesson = learningCatalog.lessons.find(
                    (item) => item.id === exercise.lessonId
                  );

                  return (
                    <div
                      key={exercise.id}
                      className="rounded-[24px] border border-white/8 bg-black/12 px-4 py-4"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-2">
                            <Badge className="bg-white/10 text-white/72">
                              {getExerciseFormatLabel(exercise.format)}
                            </Badge>
                            <Badge className="bg-white/10 text-white/72">
                              {course?.shortTitle ?? "Kurs"}
                            </Badge>
                            {lesson ? (
                              <Badge className="bg-white/10 text-white/72">{lesson.title}</Badge>
                            ) : null}
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-white">{exercise.title}</h3>
                            <p className="mt-2 text-sm leading-7 text-white/52">{exercise.prompt}</p>
                          </div>
                          {lesson && course ? (
                            <Link
                              href={`/learning/course/${course.slug}/lesson/${lesson.slug}`}
                              className="inline-flex items-center gap-2 text-sm text-white/62 transition hover:text-white"
                            >
                              Derse dön
                              <ArrowRight className="size-4" />
                            </Link>
                          ) : null}
                        </div>
                        <Button
                          className="rounded-2xl bg-white text-zinc-950 hover:bg-zinc-200"
                          onClick={() => markExerciseComplete(exercise.id)}
                        >
                          Tamamlandı olarak işaretle
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[24px] border border-dashed border-white/10 bg-black/10 px-4 py-6 text-sm leading-7 text-white/46">
                Şu an bekleyen exercise kalmadı. Yeni dersler tamamlandıkça burası yeniden dolacak.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="surface-glow border-border bg-card backdrop-blur-xl">
          <CardContent className="space-y-4 px-5 py-5 sm:px-6">
            <h2 className="font-heading text-2xl text-white">Tekrar Geçmişi</h2>
            <p className="text-sm leading-7 text-white/52">
              Tekrar geçmişi küçük ama işlevsel tutuluyor. Buradaki liste çalışma ritmini
              görmeni sağlıyor; gamification yerine sade tekrar izi bırakıyor.
            </p>
            <div className="space-y-3">
              {completedExercises.slice(0, 4).map((exercise) => {
                const course = learningCatalog.courses.find((item) => item.id === exercise.courseId);
                return (
                  <div
                    key={exercise.id}
                    className="rounded-2xl border border-white/8 bg-black/12 px-4 py-4 text-sm text-white/64"
                  >
                    <div className="flex flex-wrap gap-2">
                      {course ? (
                        <Badge className="bg-white/10 text-white/72">{course.shortTitle}</Badge>
                      ) : null}
                      <Badge className="bg-white/10 text-white/72">Tamamlandı</Badge>
                    </div>
                    <p className="mt-3 font-medium text-white">{exercise.title}</p>
                    <p className="mt-2 leading-6">{exercise.prompt}</p>
                  </div>
                );
              })}
              {completedExercises.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 px-4 py-5 text-sm leading-7 text-white/44">
                  Henüz tekrar geçmişi oluşmadı. İlk birkaç alıştırma işaretlenince tekrar alanı
                  daha anlamlı olacak.
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </section>
    </SectionShell>
  );
}
