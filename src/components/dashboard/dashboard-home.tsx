"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  GraduationCap,
  NotebookPen,
  Sigma,
} from "lucide-react";

import { useEditorialOverrides } from "@/components/learning/use-editorial-content";
import { useAppState } from "@/components/providers/app-state-provider";
import { useLearningWorkspace } from "@/components/providers/learning-workspace-provider";
import { learningCatalog } from "@/data/learning/curriculum";
import { getCourseModules } from "@/lib/learning/catalog";
import {
  getCourseRecommendation,
  getLearningPathForCourse,
  getPathProgress,
} from "@/lib/learning/paths";
import { getCurrentStudySession } from "@/lib/learning/study-session";
import { getMasteryLevelLabel } from "@/lib/learning/ui-copy";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function DashboardHome() {
  const editorialOverrides = useEditorialOverrides();
  const { data, streak } = useAppState();
  const {
    getConceptMasteryValue,
    getCourseProgressSummary,
    recommendedCourses,
    state,
  } = useLearningWorkspace();

  const studySession = getCurrentStudySession(state, { editorialOverrides });
  const continueLesson = studySession?.lesson ?? null;
  const continueCourse = studySession?.course ?? null;
  const continueCourseRecommendation = continueCourse
    ? getCourseRecommendation(state, continueCourse.id)
    : null;
  const continueCoursePath = continueCourse ? getLearningPathForCourse(continueCourse.id) : null;
  const continueModule =
    continueLesson && continueCourse
      ? getCourseModules(continueCourse.id).find((module) => module.id === continueLesson.moduleId)
      : null;
  const continueCourseProgress = continueCourse
    ? continueCoursePath
      ? getPathProgress(state, continueCourse.id)
      : getCourseProgressSummary(continueCourse.id)
    : null;
  const currentCourses = recommendedCourses.slice(0, 4);
  const masterySnapshot = learningCatalog.concepts.slice(0, 4).map((concept) => ({
    concept,
    mastery: getConceptMasteryValue(concept.id),
  }));
  const primaryCtaHref =
    continueLesson && continueCourse
      ? `/learning/course/${continueCourse.slug}/lesson/${continueLesson.slug}`
      : "/learning";
  const primaryCtaLabel =
    studySession?.status === "active" ? "Kaldığın Yerden Devam Et" : "Çalışmaya Başla";
  const hasCompletedPath = studySession?.status === "course_completed";

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="surface-glow overflow-hidden border-border bg-card backdrop-blur-2xl">
          <CardContent className="relative px-5 py-6 sm:px-6 md:px-8 md:py-8">
            <div className="relative space-y-5">
              <Badge className="bg-white/10 text-white/72">Bugünkü Çalışman</Badge>
              <div className="space-y-3">
                <h1 className="font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  {hasCompletedPath && continueCourse
                    ? `${continueCourse.title} öğrenme yolunu tamamladın.`
                    : continueLesson && continueCourse
                    ? continueLesson.title
                    : "Bugün ne çalışmalıyım?"}
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-white/58 sm:text-base">
                  {hasCompletedPath && continueCourse
                    ? "Günlük ders hedefi tamamlandı. İstersen kavramları gözden geçir veya pratik alanına geç."
                    : continueLesson && continueCourse
                      ? continueCourseRecommendation?.explanation ??
                        `${continueCourse.title} içinde kaldığın yer hazır. ${continueModule?.title ?? "Bu modül"} üzerinden ritmi sürdürebilirsin.`
                      : "Öğrenme yolu hazır. Günlük oturumun için önerilen dersi açıp ritmi başlatabilirsin."}
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-[24px] border border-white/8 bg-black/12 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/32">Kurs</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {continueCourse?.shortTitle ?? "Real Analysis"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/46">
                    {studySession?.stage?.title ?? continueModule?.title ?? "Önerilen günlük oturum"}
                  </p>
                </div>
                <div className="rounded-[24px] border border-white/8 bg-black/12 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/32">Durum</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {hasCompletedPath
                      ? "Tamamlandı"
                      : studySession?.status === "active"
                        ? "Devam ediyor"
                        : "Hazır"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/46">
                    {continueLesson
                      ? `${studySession?.position ?? 0}. ders · ${continueLesson.title}`
                      : "Bu yol için yeni ders önerisi kalmadı."}
                  </p>
                </div>
                <div className="rounded-[24px] border border-white/8 bg-black/12 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/32">
                    {continueCoursePath ? "Yol ilerlemesi" : "Kurs ilerlemesi"}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {continueCourseProgress
                      ? `${continueCourseProgress.completed}/${continueCourseProgress.total}`
                      : "0/0"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/46">
                    {continueCourseProgress
                      ? `%${continueCourseProgress.progressPercent} tamamlandı`
                      : "İlk dersi açınca ilerleme akışı başlar."}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {hasCompletedPath ? (
                  <>
                    <Link
                      href="/concepts"
                      className="flex h-11 items-center gap-2 rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-sm font-medium text-white transition hover:bg-white/[0.08]"
                    >
                      Kavramları Gözden Geçir
                      <ArrowRight className="size-4" />
                    </Link>
                    <Link
                      href="/practice"
                      className="flex h-11 items-center gap-2 rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-sm font-medium text-white transition hover:bg-white/[0.08]"
                    >
                      Alıştırma Yap
                      <ArrowRight className="size-4" />
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href={primaryCtaHref}
                      className="flex h-11 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
                    >
                      {primaryCtaLabel}
                      <ArrowRight className="size-4" />
                    </Link>
                    <Link
                      href="/notes"
                      className="flex h-11 items-center gap-2 rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-sm font-medium text-white transition hover:bg-white/[0.08]"
                    >
                      Ders Notları
                      <NotebookPen className="size-4" />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="surface-glow border-border bg-card backdrop-blur-xl">
          <CardContent className="space-y-4 px-5 py-6 sm:px-6">
            <div className="flex items-center gap-2 text-sm text-white/66">
              <BookOpen className="size-4" />
              <span>Bugünkü Plan</span>
            </div>
            {hasCompletedPath ? (
              <>
                <h2 className="font-heading text-2xl text-white">{continueCourse?.title}</h2>
                <p className="text-sm leading-7 text-white/52">
                  Günlük ders önerisi tamamlandı. İstersen kavram tekrarına geçebilir veya pratik
                  alanında momentumunu koruyabilirsin.
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  <Link
                    href="/concepts"
                    className="rounded-2xl border border-white/8 bg-black/12 px-4 py-4 text-sm text-white/66 transition hover:bg-white/[0.04]"
                  >
                    Kavramları Gözden Geçir
                  </Link>
                  <Link
                    href="/practice"
                    className="rounded-2xl border border-white/8 bg-black/12 px-4 py-4 text-sm text-white/66 transition hover:bg-white/[0.04]"
                  >
                    Alıştırma Yap
                  </Link>
                </div>
              </>
            ) : studySession?.plan && studySession.progress ? (
              <>
                <div className="flex items-center justify-between gap-3 text-sm text-white/54">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">
                      {continueCourse?.shortTitle}
                      {studySession.stage ? ` · ${studySession.stage.title}` : ""}
                    </p>
                    <p className="mt-1 text-xs text-white/38">
                      {studySession.progress.completedSteps}/{studySession.progress.totalSteps} adım
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-white/38">
                    {studySession.status === "active" ? "Devam ediyor" : "Hazır"}
                  </span>
                </div>

                <div className="rounded-[24px] border border-white/8 bg-black/12 px-4 py-3.5">
                  <div className="space-y-2.5">
                    {studySession.plan.steps.map((step) => (
                      <div
                        key={step.key}
                        className="flex items-center justify-between gap-3 text-sm text-white/62"
                      >
                        <p className={step.completed ? "text-white" : "text-white/70"}>
                          {step.label}
                          {step.detail ? ` · ${step.detail}` : ""}
                        </p>
                        <span className="shrink-0 text-xs text-white/34">
                          {step.completed ? "Tamam" : " "}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm leading-7 text-white/52">
                Günlük çalışma planı için bir öğrenme yolu oturumu bulunamadı.
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-white/66">
          <GraduationCap className="size-4" />
          <span>Aktif Kurslar</span>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {currentCourses.map(({ course }) => {
            const path = getLearningPathForCourse(course.id);
            const progress = path ? getPathProgress(state, course.id) : getCourseProgressSummary(course.id);
            const recommendation = getCourseRecommendation(state, course.id);
            const nextCourseLesson =
              recommendation.lesson ??
              learningCatalog.lessons.find((lesson) => lesson.courseId === course.id);

            return (
              <Link key={course.id} href={`/learning/course/${course.slug}`}>
                <Card className="surface-glow h-full border-border bg-card transition hover:bg-[#222226]">
                  <CardContent className="space-y-5 px-5 py-5 sm:px-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap gap-2">
                          {course.recommended ? (
                            <Badge className="bg-zinc-300/14 text-zinc-200">
                              Buradan Başla
                            </Badge>
                          ) : null}
                          {course.flagship ? (
                            <Badge className="bg-zinc-100/14 text-zinc-200">Öne Çıkan</Badge>
                          ) : null}
                        </div>
                        <h3 className="mt-4 text-xl font-semibold text-white">{course.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-white/50">{course.summary}</p>
                      </div>
                      <span className="text-sm text-white/46">%{progress.progressPercent}</span>
                    </div>

                    <Progress
                      value={progress.progressPercent}
                      className="[&_[data-slot='progress-track']]:h-2 [&_[data-slot='progress-track']]:bg-white/8 [&_[data-slot='progress-indicator']]:bg-zinc-100"
                    />

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/8 bg-black/12 px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-white/32">İlerleme</p>
                        <p className="mt-2 text-base font-semibold text-white">
                          {progress.completed}/{progress.total}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/8 bg-black/12 px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-white/32">
                          {path ? "Sıradaki ders" : "Sonraki ders"}
                        </p>
                        <p className="mt-2 text-base font-semibold text-white">
                          {nextCourseLesson?.title ?? (path ? "Öğrenme yolu tamamlandı" : "Kurs görünümü")}
                        </p>
                      </div>
                    </div>

                    {path ? (
                      <p className="text-sm leading-6 text-white/44">{recommendation.explanation}</p>
                    ) : null}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="surface-glow border-border bg-card backdrop-blur-xl">
          <CardContent className="space-y-4 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-2 text-sm text-white/66">
              <CheckCircle2 className="size-4" />
              <span>Son Etkinlik</span>
            </div>
            <div className="space-y-3">
              {state.recentActivity.slice(0, 5).map((activity) => (
                <div
                  key={activity.id}
                  className="rounded-2xl border border-white/8 bg-black/12 px-4 py-3 text-sm text-white/60"
                >
                  <p className="font-medium text-white">{activity.title}</p>
                  <p className="mt-1">
                    {new Date(activity.createdAt).toLocaleDateString("tr-TR")}
                  </p>
                </div>
              ))}
              {state.recentActivity.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 px-4 py-5 text-sm leading-7 text-white/44">
                  İlk dersi açınca, not yazınca veya bir alıştırmayı tamamlayınca etkinlik
                  akışı burada dolacak.
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card className="surface-glow border-border bg-card backdrop-blur-xl">
          <CardContent className="space-y-4 px-5 py-5 sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-white/66">
                <Sigma className="size-4" />
                <span>Hakimiyet Özeti</span>
              </div>
              <Badge className="bg-white/10 text-white/72">{streak} günlük ritim</Badge>
            </div>
            <p className="text-sm leading-7 text-white/54">
              Aktif focus alanı {data.profile.focusArea}. Kavram hakimiyeti ders, not ve
              alıştırma işaretlerinden besleniyor.
            </p>
            <div className="space-y-3">
              {masterySnapshot.map(({ concept, mastery }) => (
                <div
                  key={concept.id}
                  className="rounded-2xl border border-white/8 bg-black/12 px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-white">{concept.name}</p>
                    <Badge className="bg-white/10 text-white/72">
                      {getMasteryLevelLabel(mastery.level)}
                    </Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-white/46">
                    <span>Puan</span>
                    <span>{mastery.score}/100</span>
                  </div>
                  <Progress
                    value={mastery.score}
                    className="mt-3 [&_[data-slot='progress-track']]:h-2 [&_[data-slot='progress-track']]:bg-white/8 [&_[data-slot='progress-indicator']]:bg-white"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Link href="/learning">
          <Card className="surface-glow h-full border-border bg-card transition hover:bg-[#222226]">
            <CardContent className="space-y-3 px-5 py-5 text-white/66">
              <BookOpen className="size-5" />
              <h3 className="text-base font-medium text-white">Ders Kütüphanesi</h3>
              <p className="text-sm leading-6">
                Kurslar, modüller ve ders akışı tek yerde.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/practice">
          <Card className="surface-glow h-full border-border bg-card transition hover:bg-[#222226]">
            <CardContent className="space-y-3 px-5 py-5 text-white/66">
              <Compass className="size-5" />
              <h3 className="text-base font-medium text-white">Alıştırma Kuyruğu</h3>
              <p className="text-sm leading-6">
                Ders alıştırmaları ile tekrar kuyruğunu toparlar.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/notes">
          <Card className="surface-glow h-full border-border bg-card transition hover:bg-[#222226]">
            <CardContent className="space-y-3 px-5 py-5 text-white/66">
              <NotebookPen className="size-5" />
              <h3 className="text-base font-medium text-white">Ders Notları</h3>
              <p className="text-sm leading-6">
                Ders bağlamına yapışık kişisel matematik defteri.
              </p>
            </CardContent>
          </Card>
        </Link>
      </section>
    </div>
  );
}
