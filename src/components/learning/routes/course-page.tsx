"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  ExternalLink,
  PlayCircle,
  Sigma,
} from "lucide-react";

import { SectionShell } from "@/components/app/section-shell";
import { useLearningWorkspace } from "@/components/providers/learning-workspace-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  getCourseLessons,
  getCourseModules,
  getModuleLessons,
  getModuleProgress,
} from "@/lib/learning/catalog";
import type {
  LearningCourse,
  LearningLesson,
  LearningPathStage,
  LessonReadinessState,
} from "@/lib/learning/domain";
import {
  getCourseRecommendation,
  getLearningPathForCourse,
  getLessonPathPosition,
  getLessonReadiness,
  getPathProgress,
  getStageProgress,
} from "@/lib/learning/paths";
import {
  getCourseProgressStatusLabel,
  getLessonStatusLabel,
} from "@/lib/learning/ui-copy";

type CoursePageProps = {
  course: LearningCourse;
};

function LessonStateIcon({
  readiness,
  currentLessonId,
  lesson,
}: {
  readiness?: LessonReadinessState;
  currentLessonId?: string;
  lesson: LearningLesson;
}) {
  if (readiness === "completed") {
    return <CheckCircle2 className="size-4 text-zinc-300" />;
  }

  if (currentLessonId === lesson.id || readiness === "recommended") {
    return <PlayCircle className="size-4 text-zinc-300" />;
  }

  if (readiness === "needs_prerequisites") {
    return <AlertCircle className="size-4 text-zinc-300" />;
  }

  return <Circle className="size-4 text-white/34" />;
}

function getLessonRowCopy(
  lesson: LearningLesson,
  readiness: ReturnType<typeof getLessonReadiness>,
  isCurrent: boolean,
  statusLabel: string
) {
  if (isCurrent) {
    return {
      eyebrow: "Devam et",
      body: readiness?.explanation ?? `${lesson.title} üzerinde çalışıyorsun.`,
    };
  }

  if (readiness?.readiness === "recommended") {
    return {
      eyebrow: "Sıradaki",
      body: readiness.explanation,
    };
  }

  if (readiness?.readiness === "completed") {
    return {
      eyebrow: statusLabel,
      body: "Tamamladın. İstersen kısa bir tekrar için yeniden açabilirsin.",
    };
  }

  if (readiness?.readiness === "needs_prerequisites") {
    const firstMissing = readiness.missingPrerequisiteLessons[0];
    return {
      eyebrow: "Hazırlık önerisi",
      body: firstMissing
        ? `Önce önerilen: ${firstMissing.title}`
        : readiness.explanation,
    };
  }

  return {
    eyebrow: statusLabel,
    body: lesson.description,
  };
}

function getStageState({
  completed,
  total,
  currentStageId,
  currentStageIndex,
  stage,
  stageIndex,
}: {
  completed: number;
  total: number;
  currentStageId: string | null;
  currentStageIndex: number;
  stage: LearningPathStage;
  stageIndex: number;
}) {
  if (total > 0 && completed === total) {
    return {
      label: "Tamamlandı",
      className: "bg-zinc-300/14 text-zinc-200",
    };
  }

  if (stage.id === currentStageId) {
    return {
      label: "Şu anki aşama",
      className: "bg-zinc-100/14 text-zinc-200",
    };
  }

  if (currentStageIndex >= 0 && stageIndex === currentStageIndex + 1) {
    return {
      label: "Sırada",
      className: "bg-white/10 text-white/72",
    };
  }

  return {
    label: "Başlanmadı",
    className: "bg-white/8 text-white/50",
  };
}

export function CoursePage({ course }: CoursePageProps) {
  const {
    continueLessonId,
    state,
    getCourseProgressSummary,
    getLessonStatusValue,
  } = useLearningWorkspace();
  const modules = getCourseModules(course.id);
  const allLessons = getCourseLessons(course.id);
  const lessonMap = useMemo(
    () => new Map(allLessons.map((lesson) => [lesson.id, lesson])),
    [allLessons]
  );
  const learningPath = getLearningPathForCourse(course.id);
  const progress = learningPath
    ? getPathProgress(state, course.id)
    : getCourseProgressSummary(course.id);
  const pathIsComplete =
    learningPath && "isComplete" in progress
      ? progress.isComplete
      : progress.total > 0 && progress.completed === progress.total;
  const recommendation = getCourseRecommendation(state, course.id);
  const nextLesson =
    recommendation.lesson ??
    (pathIsComplete ? null : allLessons[0] ?? null);
  const nextStage = nextLesson ? getLessonPathPosition(nextLesson.id)?.stage : null;

  const currentStageId = useMemo(() => {
    if (!learningPath) {
      return null;
    }

    if (pathIsComplete) {
      return null;
    }

    if (recommendation.lesson) {
      return getLessonPathPosition(recommendation.lesson.id)?.stage?.id ?? learningPath.stages[0]?.id ?? null;
    }

    return learningPath.stages[0]?.id ?? null;
  }, [learningPath, pathIsComplete, recommendation.lesson]);

  const currentStageIndex = learningPath
    ? learningPath.stages.findIndex((stage) => stage.id === currentStageId)
    : -1;

  const defaultExpandedStageIds = useMemo(() => {
    if (!learningPath) {
      return [] as string[];
    }

    if (pathIsComplete) {
      return [] as string[];
    }

    return currentStageId ? [currentStageId] : learningPath.stages[0] ? [learningPath.stages[0].id] : [];
  }, [currentStageId, learningPath, pathIsComplete]);
  const defaultExpandedStageKey = defaultExpandedStageIds.join("|");
  const [expandedStageIds, setExpandedStageIds] = useState<string[]>(defaultExpandedStageIds);
  const stageRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    setExpandedStageIds(defaultExpandedStageIds);
  }, [defaultExpandedStageKey, defaultExpandedStageIds]);

  function toggleStage(stageId: string) {
    setExpandedStageIds((current) =>
      current.includes(stageId)
        ? current.filter((item) => item !== stageId)
        : [...current, stageId]
    );
  }

  function openStageAndScroll(stageId: string) {
    setExpandedStageIds((current) =>
      current.includes(stageId) ? current : [...current, stageId]
    );
    stageRefs.current[stageId]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <SectionShell
      eyebrow="Kurs"
      title={course.title}
      description={course.description}
      action={
        <>
          {nextLesson ? (
            <Link
              href={`/learning/course/${course.slug}/lesson/${nextLesson.slug}`}
              className="flex h-11 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
            >
              {progress.progressPercent > 0 ? "Devam Et" : "Başla"}
              <ArrowRight className="size-4" />
            </Link>
          ) : (
            <Link
              href="/practice"
              className="flex h-11 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
            >
              Pratik Yap
              <ArrowRight className="size-4" />
            </Link>
          )}
          {course.driveFolderUrl ? (
            <a
              href={course.driveFolderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center gap-2 rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-sm font-medium text-white transition hover:bg-white/[0.08]"
            >
              Drive klasörünü aç
              <ExternalLink className="size-4" />
            </a>
          ) : null}
        </>
      }
    >
      {course.driveFolderUrl ? (
        <p className="rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-3 text-sm text-white/54">
          Drive videolarını açmak için klasöre erişim iznin olmalı.
        </p>
      ) : null}
      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="surface-glow border-border bg-card backdrop-blur-xl">
          <CardContent className="space-y-5 px-5 py-5 sm:px-6">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.18em] text-white/34">
                {learningPath ? "Öğrenme Yolu" : "İlerleme"}
              </p>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="font-heading text-3xl text-white">
                    {progress.completed} / {progress.total} ders
                  </p>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-white/54">
                    {learningPath?.description ?? course.summary}
                  </p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-white/72">
                  %{progress.progressPercent}
                </div>
              </div>
            </div>

            <Progress
              value={progress.progressPercent}
              className="[&_[data-slot='progress-track']]:h-2 [&_[data-slot='progress-track']]:bg-white/8 [&_[data-slot='progress-indicator']]:bg-zinc-100"
            />

            <div className="flex flex-wrap gap-2.5 text-sm">
              <div className="rounded-full border border-white/8 bg-black/12 px-3 py-2 text-white/70">
                {learningPath ? `${learningPath.stages.length} aşama` : `${course.moduleIds.length} modül`}
              </div>
              <div className="rounded-full border border-white/8 bg-black/12 px-3 py-2 text-white/70">
                {course.conceptIds.length} kavram
              </div>
              <div className="rounded-full border border-white/8 bg-black/12 px-3 py-2 text-white/70">
                {Math.max(progress.total - progress.completed, 0)} ders kaldı
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="surface-glow border-border bg-card backdrop-blur-xl">
          <CardContent className="space-y-4 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-2 text-sm text-white/66">
              <Sigma className="size-4" />
              <span>{learningPath ? "Sıradaki Önerilen Ders" : "Buradan Devam Et"}</span>
            </div>

            <div className="space-y-2">
              <h2 className="font-heading text-2xl text-white">
                {nextLesson?.title ?? `${course.title} derslerini tamamladın.`}
              </h2>
              <p className="text-sm leading-7 text-white/52">{recommendation.explanation}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-black/12 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-white/32">Aşama</p>
                <p className="mt-2 text-sm font-medium text-white">
                  {nextStage?.title ?? "Tamamlandı"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/12 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-white/32">Durum</p>
                <p className="mt-2 text-sm font-medium text-white">
                  {getCourseProgressStatusLabel(
                    progress.progressPercent,
                    progress.completed,
                    progress.total
                  )}
                </p>
              </div>
            </div>

            {nextLesson ? (
              <Link
                href={`/learning/course/${course.slug}/lesson/${nextLesson.slug}`}
                className="inline-flex h-11 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
              >
                {recommendation.kind === "continue_in_progress" ? "Kaldığın Yerden Devam Et" : "Ders Alanını Aç"}
                <ArrowRight className="size-4" />
              </Link>
            ) : (
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/concepts"
                  className="inline-flex h-11 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
                >
                  Kavramları Gözden Geçir
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/practice"
                  className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-sm font-medium text-white transition hover:bg-white/[0.08]"
                >
                  Alıştırmalara Git
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {learningPath ? (
        <section className="space-y-4">
          <Card className="surface-glow border-border bg-card backdrop-blur-xl">
            <CardContent className="space-y-4 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-2 text-sm text-white/66">
                <Sigma className="size-4" />
                <span>Öğrenme Yolu</span>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-1">
                {learningPath.stages.map((stage, stageIndex) => {
                  const stageProgress = getStageProgress(state, stage.id);
                  const isCurrent = stage.id === currentStageId;
                  const isCompleted =
                    stageProgress.total > 0 && stageProgress.completed === stageProgress.total;
                  const isExpanded = expandedStageIds.includes(stage.id);

                  return (
                    <Button
                      key={stage.id}
                      type="button"
                      variant="outline"
                      size="sm"
                      aria-pressed={isExpanded}
                      className={`h-auto min-w-[116px] shrink-0 rounded-[22px] border px-3 py-3 text-left ${
                        isCurrent
                          ? "border-zinc-100/18 bg-zinc-100/10 text-white hover:bg-zinc-100/14"
                          : isCompleted
                            ? "border-zinc-300/16 bg-zinc-300/8 text-white/84 hover:bg-zinc-300/12"
                            : "border-white/10 bg-black/12 text-white/68 hover:bg-white/[0.05]"
                      }`}
                      onClick={() => openStageAndScroll(stage.id)}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs uppercase tracking-[0.18em] text-white/38">
                          {stageIndex + 1}
                        </span>
                        <span
                          className={`size-2.5 rounded-full ${
                            isCurrent
                              ? "bg-zinc-100"
                              : isCompleted
                                ? "bg-zinc-300"
                                : "bg-white/24"
                          }`}
                        />
                      </div>
                      <p className="mt-3 text-sm font-medium text-white">
                        Aşama {stageIndex + 1}
                      </p>
                      <p className="mt-1 text-xs text-white/46">
                        {stageProgress.completed}/{stageProgress.total}
                      </p>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {pathIsComplete ? (
            <Card className="surface-glow border-zinc-300/14 bg-zinc-300/[0.05] backdrop-blur-xl">
              <CardContent className="space-y-3 px-5 py-5 sm:px-6">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-200/72">
                  Tamamlandı
                </p>
                <h2 className="font-heading text-2xl text-white">
                  Real Analysis öğrenme yolunu tamamladın.
                </h2>
                <p className="max-w-3xl text-sm leading-7 text-white/58">
                  İstersen kavramları gözden geçir, alıştırmalara dön ya da dersleri tekrar incele.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/concepts"
                    className="inline-flex h-11 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
                  >
                    Kavramları Gözden Geçir
                    <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href="/practice"
                    className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-sm font-medium text-white transition hover:bg-white/[0.08]"
                  >
                    Alıştırmalara Git
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : null}

          <div className="space-y-3">
            {learningPath.stages.map((stage, stageIndex) => {
              const stageProgress = getStageProgress(state, stage.id);
              const isExpanded = expandedStageIds.includes(stage.id);
              const stageState = getStageState({
                completed: stageProgress.completed,
                total: stageProgress.total,
                currentStageId,
                currentStageIndex,
                stage,
                stageIndex,
              });

              return (
                <Card
                  key={stage.id}
                  ref={(node) => {
                    stageRefs.current[stage.id] = node;
                  }}
                  className={`surface-glow border-border bg-card backdrop-blur-xl ${
                    stage.id === currentStageId
                      ? "border-zinc-100/16 bg-zinc-100/[0.05]"
                      : "bg-white/[0.03]"
                  }`}
                >
                  <CardContent className="px-0 py-0">
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      aria-controls={`${stage.id}-panel`}
                      className="w-full rounded-[24px] px-5 py-5 text-left outline-none transition hover:bg-white/[0.03] focus-visible:ring-2 focus-visible:ring-zinc-300/50 sm:px-6"
                      onClick={() => toggleStage(stage.id)}
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge className={stageState.className}>
                              {stageState.label}
                            </Badge>
                            <span className="text-xs uppercase tracking-[0.18em] text-white/34">
                              Aşama {stageIndex + 1}
                            </span>
                          </div>
                          <h2 className="mt-3 font-heading text-xl text-white">
                            {stage.title}
                          </h2>
                          <p className="mt-2 max-w-3xl text-sm leading-7 text-white/52">
                            {stage.description}
                          </p>
                        </div>

                        <div className="flex min-w-[220px] items-center gap-4">
                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex items-center justify-between text-sm text-white/52">
                              <span>
                                {stageProgress.completed} / {stageProgress.total}
                              </span>
                              <span>%{stageProgress.progressPercent}</span>
                            </div>
                            <Progress
                              value={stageProgress.progressPercent}
                              className="[&_[data-slot='progress-track']]:h-1.5 [&_[data-slot='progress-track']]:bg-white/8 [&_[data-slot='progress-indicator']]:bg-white"
                            />
                          </div>
                          <div className="shrink-0 text-white/42">
                            {isExpanded ? (
                              <ChevronDown className="size-4" />
                            ) : (
                              <ChevronRight className="size-4" />
                            )}
                          </div>
                        </div>
                      </div>
                    </button>

                    {isExpanded ? (
                      <div
                        id={`${stage.id}-panel`}
                        className="border-t border-white/8 px-5 pb-5 pt-2 sm:px-6 sm:pb-6"
                      >
                        <div className="space-y-2">
                          {stage.lessonIds.map((lessonId) => {
                            const lesson = lessonMap.get(lessonId);
                            if (!lesson) {
                              return null;
                            }

                            const readiness = getLessonReadiness(state, lesson.id);
                            const status = getLessonStatusValue(lesson.id);
                            const isCurrent =
                              continueLessonId === lesson.id ||
                              (state.lastLessonId === lesson.id && status === "in_progress");
                            const pathPosition = getLessonPathPosition(lesson.id);
                            const statusLabel =
                              status === "in_progress"
                                ? "Devam et"
                                : status === "completed"
                                  ? "Tamamlandı"
                                  : "Hazır";
                            const copy = getLessonRowCopy(
                              lesson,
                              readiness,
                              isCurrent,
                              statusLabel
                            );
                            const rowClass =
                              status === "completed"
                                ? "border-white/8 bg-black/10 text-white/82"
                                : isCurrent || readiness?.readiness === "recommended"
                                  ? "border-zinc-100/14 bg-zinc-100/10 text-white"
                                  : "border-white/8 bg-black/12 text-white/88 hover:bg-white/[0.04]";

                            return (
                              <Link
                                key={lesson.id}
                                href={`/learning/course/${course.slug}/lesson/${lesson.slug}`}
                                className={`block rounded-[24px] border px-4 py-4 transition sm:px-5 ${rowClass}`}
                              >
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                  <div className="min-w-0 flex items-start gap-3">
                                    <div className="mt-1">
                                      <LessonStateIcon
                                        lesson={lesson}
                                        readiness={readiness?.readiness}
                                        currentLessonId={state.lastLessonId}
                                      />
                                    </div>
                                    <div className="min-w-0">
                                      <div className="flex flex-wrap items-center gap-2 text-xs text-white/34">
                                        {pathPosition ? (
                                          <span className="uppercase tracking-[0.18em]">
                                            Ders {pathPosition.position}
                                          </span>
                                        ) : null}
                                        {lesson.sourceOrder ? (
                                          <span className="rounded-full border border-white/8 bg-white/[0.03] px-2 py-0.5 text-white/46">
                                            Archive #{lesson.sourceOrder}
                                          </span>
                                        ) : null}
                                      </div>
                                      <h3 className="mt-2 text-base font-medium text-white">
                                        {lesson.title}
                                      </h3>
                                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/38">
                                        {copy.eyebrow}
                                      </p>
                                      <p className="mt-2 max-w-2xl text-sm leading-6 text-white/52">
                                        {copy.body}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex shrink-0 items-center gap-2 sm:pl-4">
                                    {status === "completed" ? (
                                      <span className="rounded-full border border-zinc-300/14 bg-zinc-300/10 px-3 py-1.5 text-xs text-zinc-200">
                                        Tamamlandı
                                      </span>
                                    ) : null}
                                    {isCurrent ? (
                                      <span className="rounded-full border border-zinc-100/14 bg-zinc-100/10 px-3 py-1.5 text-xs text-zinc-200">
                                        Devam et
                                      </span>
                                    ) : null}
                                    {!isCurrent &&
                                    readiness?.readiness === "recommended" &&
                                    status !== "completed" ? (
                                      <span className="rounded-full border border-zinc-100/14 bg-zinc-100/10 px-3 py-1.5 text-xs text-zinc-200">
                                        Sıradaki
                                      </span>
                                    ) : null}
                                    <ChevronRight className="size-4 text-white/28" />
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="space-y-4">
          {modules.map((module) => {
            const moduleLessons = getModuleLessons(module.id);
            const moduleProgress = getModuleProgress(state, module.id);
            const activeLesson = moduleLessons.find((item) => item.id === continueLessonId);

            return (
              <Card
                key={module.id}
                className="surface-glow border-border bg-card backdrop-blur-xl"
              >
                <CardContent className="space-y-5 px-5 py-5 sm:px-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="bg-white/10 text-white/72">
                          {moduleLessons.length > 0
                            ? `${moduleProgress.completed}/${moduleProgress.total} tamamlandı`
                            : "Henüz video yok"}
                        </Badge>
                        {activeLesson ? (
                          <Badge className="bg-zinc-100/14 text-zinc-200">Şu anki modül</Badge>
                        ) : null}
                      </div>
                      <h2 className="mt-3 font-heading text-2xl text-white">{module.title}</h2>
                      <p className="mt-2 text-sm leading-7 text-white/52">{module.description}</p>
                      {module.driveFolderUrl ? (
                        <a
                          href={module.driveFolderUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-2 text-sm text-white/72 transition hover:text-white"
                        >
                          Drive klasörü
                          <ExternalLink className="size-4" />
                        </a>
                      ) : null}
                    </div>
                    {moduleLessons.length > 0 ? (
                      <div className="min-w-[220px] space-y-3">
                        <div className="flex items-center justify-between text-sm text-white/52">
                          <span>
                            {moduleProgress.completed} / {moduleProgress.total}
                          </span>
                          <span>%{moduleProgress.progressPercent}</span>
                        </div>
                        <Progress
                          value={moduleProgress.progressPercent}
                          className="[&_[data-slot='progress-track']]:h-1.5 [&_[data-slot='progress-track']]:bg-white/8 [&_[data-slot='progress-indicator']]:bg-white"
                        />
                      </div>
                    ) : null}
                  </div>

                  <div className="overflow-hidden rounded-[26px] border border-white/8 bg-black/12">
                    {moduleLessons.length > 0 ? moduleLessons.map((lesson, lessonIndex) => {
                      const status = getLessonStatusValue(lesson.id);
                      const isCurrent =
                        continueLessonId === lesson.id || state.lastLessonId === lesson.id;

                      return (
                        <Link
                          key={lesson.id}
                          href={`/learning/course/${course.slug}/lesson/${lesson.slug}`}
                          className="block border-b border-white/8 last:border-b-0"
                        >
                          <div
                            className={`flex flex-col gap-4 px-4 py-4 transition sm:flex-row sm:items-center sm:justify-between ${
                              isCurrent ? "bg-zinc-100/8" : "hover:bg-white/[0.04]"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-1">
                                <LessonStateIcon
                                  lesson={lesson}
                                  readiness={
                                    status === "completed"
                                      ? "completed"
                                      : isCurrent
                                        ? "recommended"
                                        : "ready"
                                  }
                                  currentLessonId={state.lastLessonId}
                                />
                              </div>
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-xs uppercase tracking-[0.18em] text-white/32">
                                    Ders {lessonIndex + 1}
                                  </p>
                                  {lesson.sourceOrder ? (
                                    <Badge className="bg-white/10 text-white/60">
                                      Archive #{lesson.sourceOrder}
                                    </Badge>
                                  ) : null}
                                </div>
                                <h3 className="mt-1 text-base font-medium text-white">
                                  {lesson.title}
                                </h3>
                                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/48">
                                  {lesson.description}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                              <Badge
                                className={
                                  status === "completed"
                                    ? "bg-zinc-300/14 text-zinc-200"
                                    : isCurrent
                                      ? "bg-zinc-100/14 text-zinc-200"
                                      : "bg-white/10 text-white/70"
                                }
                              >
                                {isCurrent ? "Şu anki ders" : getLessonStatusLabel(status)}
                              </Badge>
                            </div>
                          </div>
                        </Link>
                      );
                    }) : (
                      <p className="px-5 py-5 text-sm text-white/52">
                        Bu klasörde henüz ders videosu bulunmuyor.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
      )}
    </SectionShell>
  );
}
