"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Compass,
  GraduationCap,
  Layers3,
  Sigma,
} from "lucide-react";

import { SectionShell } from "@/components/app/section-shell";
import { useLearningWorkspace } from "@/components/providers/learning-workspace-provider";
import { learningCatalog } from "@/data/learning/curriculum";
import { getContinueLesson } from "@/lib/learning/catalog";
import {
  getCourseRecommendation,
  getLearningPathForCourse,
  getPathProgress,
} from "@/lib/learning/paths";
import { getCourseProgressStatusLabel } from "@/lib/learning/ui-copy";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function LearningLibraryPage() {
  const { recommendedCourses, getCourseProgressSummary, state } = useLearningWorkspace();
  const featuredCourses = recommendedCourses;
  const continueLesson = getContinueLesson(state);
  const continueCourse = continueLesson
    ? learningCatalog.courses.find((course) => course.id === continueLesson.courseId)
    : null;
  const continueCourseRecommendation = continueCourse
    ? getCourseRecommendation(state, continueCourse.id)
    : null;

  return (
    <SectionShell
      eyebrow="Müfredat"
      title="Dersler"
      description="Temellerden ileri başlıklara uzanan matematik öğrenimini tek akışta izle."
      action={
        <div className="flex flex-wrap gap-3">
          <Link
            href={
              continueLesson && continueCourse
                ? `/learning/course/${continueCourse.slug}/lesson/${continueLesson.slug}`
                : "/learning/course/foundations-of-mathematics"
            }
            className="flex h-11 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
          >
            {continueLesson ? "Öğrenmeye Devam Et" : "Temellerden Başla"}
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/practice"
            className="flex h-11 items-center gap-2 rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-sm font-medium text-white transition hover:bg-white/[0.08]"
          >
            Alıştırmalar
            <Compass className="size-4" />
          </Link>
          <Link
            href="/learning/course/calculus"
            className="flex h-11 items-center gap-2 rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-sm font-medium text-white transition hover:bg-white/[0.08]"
          >
            Calculus
            <ArrowRight className="size-4" />
          </Link>
        </div>
      }
    >
      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            label: "Toplam kurs",
            value: learningCatalog.courses.length,
            detail: "Çekirdek, ileri ve destekleyici akışlar.",
            icon: GraduationCap,
          },
          {
            label: "Toplam modül",
            value: learningCatalog.modules.length,
            detail: "Akademik müfredat yapısı modül bazında kuruldu.",
            icon: Layers3,
          },
          {
            label: "Kavram omurgası",
            value: learningCatalog.concepts.length,
            detail: "Alıştırma ve hakimiyet ekranlarını besleyen kavram havuzu.",
            icon: Sigma,
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

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="surface-glow overflow-hidden border-border bg-card backdrop-blur-xl">
          <CardContent className="relative px-5 py-6 sm:px-6">
            <div className="relative">
              <Badge className="bg-white/10 text-white/72">Önerilen Rota</Badge>
              <h2 className="mt-4 font-heading text-2xl text-white">Foundations of Mathematics</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/56">
                Bu rota tüm platformun doğal başlangıcı. Kümeler, dil, önerme ve
                ispat omurgası burada kuruluyor; sonra Real Analysis çok daha temiz akıyor.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/learning/course/foundations-of-mathematics"
                  className="inline-flex h-11 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
                >
                  Kursu Aç
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/concepts"
                  className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-sm font-medium text-white transition hover:bg-white/[0.08]"
                >
                  Kavramlara geç
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="surface-glow border-border bg-card backdrop-blur-xl">
          <CardContent className="space-y-4 px-5 py-6 sm:px-6">
            <div className="flex items-center gap-2 text-sm text-white/66">
              <BookOpen className="size-4" />
              <span>Kaldığın Yerden Devam</span>
            </div>
            <h2 className="font-heading text-2xl text-white">
              {continueCourse?.title ?? "Real Analysis"}
            </h2>
            <p className="text-sm leading-7 text-white/54">
              {continueLesson && continueCourse
                ? continueCourseRecommendation?.explanation ?? `${continueLesson.title} kaldığın yer olarak hazır.`
                : "Dizilerden integrale uzanan ders akışı burada toplanıyor."}
            </p>
            <Link
              href={
                continueLesson && continueCourse
                  ? `/learning/course/${continueCourse.slug}/lesson/${continueLesson.slug}`
                  : "/learning/course/real-analysis"
              }
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-sm font-medium text-white transition hover:bg-white/[0.08]"
            >
              {continueLesson ? "Ders Alanını Aç" : "Kursu Aç"}
              <ArrowRight className="size-4" />
            </Link>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {featuredCourses.map(({ course }) => {
          const path = getLearningPathForCourse(course.id);
          const progress = path ? getPathProgress(state, course.id) : getCourseProgressSummary(course.id);
          const statusLabel = getCourseProgressStatusLabel(
            progress.progressPercent,
            progress.completed,
            progress.total
          );
          const recommendation = getCourseRecommendation(state, course.id);
          const nextLesson =
            recommendation.lesson ??
            (recommendation.kind === "course_completed"
              ? null
              : learningCatalog.lessons.find((lesson) => lesson.courseId === course.id));

          return (
            <Link key={course.id} href={`/learning/course/${course.slug}`}>
              <Card className="surface-glow h-full border-border bg-card transition hover:border-white/14 hover:bg-[#222226]">
                <CardContent className="space-y-5 px-5 py-5 sm:px-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-white/10 text-white/72">{statusLabel}</Badge>
                        {course.recommended ? (
                          <Badge className="bg-zinc-300/14 text-zinc-200">
                            Buradan Başla
                          </Badge>
                        ) : null}
                        {course.flagship ? (
                          <Badge className="bg-zinc-100/14 text-zinc-200">Öne Çıkan</Badge>
                        ) : null}
                      </div>
                      <h3 className="mt-4 font-heading text-2xl text-white">{course.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-white/54">{course.description}</p>
                    </div>

                    <div
                      className={`hidden size-14 shrink-0 rounded-3xl border border-white/10 ${course.accent} xl:flex xl:items-center xl:justify-center`}
                    >
                      <BookOpen className="size-6 text-white/80" />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/8 bg-black/10 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/32">Modüller</p>
                      <p className="mt-2 text-lg font-semibold text-white">
                        {course.moduleIds.length}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-black/10 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/32">Dersler</p>
                      <p className="mt-2 text-lg font-semibold text-white">{progress.total}</p>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-black/10 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/32">Sıradaki</p>
                      <p className="mt-2 text-sm font-semibold text-white">
                        {nextLesson?.title ?? "Kurs tamamlandı"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-white/52">
                      <span>
                        {progress.completed} / {progress.total} ders tamamlandı
                      </span>
                      <span>{statusLabel}</span>
                    </div>
                    <Progress
                      value={progress.progressPercent}
                      className="[&_[data-slot='progress-track']]:h-2 [&_[data-slot='progress-track']]:bg-white/8 [&_[data-slot='progress-indicator']]:bg-zinc-100"
                    />
                  </div>

                  <p className="text-sm leading-6 text-white/44">
                    {path ? recommendation.explanation : course.summary}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </section>
    </SectionShell>
  );
}
