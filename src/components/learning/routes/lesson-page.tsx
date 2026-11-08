"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Eye,
  FileText,
  ListTree,
  Maximize2,
  Minimize2,
  NotebookPen,
  PencilLine,
  X,
} from "lucide-react";

import { LessonVideoPlayer } from "@/components/learning/lesson-video-player";
import {
  LessonExercisesSection,
  LessonStudyContentSection,
} from "@/components/learning/rich-lesson-content";
import {
  useEditorialOverrides,
  usePublishedLessonContent,
} from "@/components/learning/use-editorial-content";
import { useLearningWorkspace } from "@/components/providers/learning-workspace-provider";
import { learningCatalog } from "@/data/learning/curriculum";
import {
  getCourseModules,
  getLessonNavigation,
  getModuleLessons,
} from "@/lib/learning/catalog";
import {
  getCourseRecommendation,
  getLessonPathPosition,
  getLessonReadiness,
  getPathProgress,
} from "@/lib/learning/paths";
import {
  getCurrentStudySession,
  getStudySessionPlan,
  getStudySessionProgress,
} from "@/lib/learning/study-session";
import type { LearningCourse, LearningLesson, LearningModule } from "@/lib/learning/domain";
import {
  getExerciseFormatLabel,
  getLessonReadinessLabel,
  getLessonStatusLabel,
} from "@/lib/learning/ui-copy";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type LessonPageProps = {
  course: LearningCourse;
  lesson: LearningLesson;
};

const LESSON_FOCUS_EVENT = "cinarithm:lesson-focus";

function getReadinessBadgeClass(readiness: NonNullable<ReturnType<typeof getLessonReadiness>>["readiness"]) {
  switch (readiness) {
    case "completed":
      return "bg-zinc-300/14 text-zinc-200";
    case "recommended":
      return "bg-zinc-100/14 text-zinc-200";
    case "ready":
      return "bg-white/10 text-white/72";
    default:
      return "bg-zinc-400/12 text-zinc-200";
  }
}

function formatNoteDate(value?: string) {
  if (!value) {
    return "Henüz kaydedilmedi";
  }

  return new Date(value).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function countWords(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function WorkspaceToggleButton({
  active,
  label,
  onClick,
  children,
}: {
  active?: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      variant="outline"
      size="icon-sm"
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "rounded-2xl border-white/12 bg-white/[0.03] text-white hover:bg-white/[0.08]",
        active && "bg-white/[0.1]"
      )}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function LessonNotesPanel({
  lesson,
  onClose,
  compact = false,
}: {
  lesson: LearningLesson;
  onClose?: () => void;
  compact?: boolean;
}) {
  const { getLessonNote, saveLessonNote } = useLearningWorkspace();
  const storedNote = getLessonNote(lesson.id);
  const [draft, setDraft] = useState(storedNote?.content ?? "");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [mode, setMode] = useState<"write" | "preview">("write");

  useEffect(() => {
    setDraft(storedNote?.content ?? "");
  }, [storedNote?.content]);

  useEffect(() => {
    const baseline = storedNote?.content ?? "";
    if (draft === baseline) {
      setSaveState(draft.trim().length > 0 ? "saved" : "idle");
      return;
    }

    setSaveState("saving");
    const timeout = window.setTimeout(() => {
      saveLessonNote(lesson.id, draft);
      setSaveState("saved");
    }, 450);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [draft, lesson.id, saveLessonNote, storedNote?.content]);

  const prompts = [
    {
      label: "Tanım",
      text: "Tanım\n- İfade:\n- Sezgi:\n\n",
    },
    {
      label: "İspat fikri",
      text: "İspat fikri\n1. \n2. \n3. \n\n",
    },
    {
      label: "Soru",
      text: "Soru\n- Takıldığım yer:\n- Örnek istediğim nokta:\n\n",
    },
  ];

  function insertPrompt(template: string) {
    setDraft((current) =>
      `${current}${current.endsWith("\n") || current.length === 0 ? "" : "\n\n"}${template}`
    );
    setMode("write");
  }

  const wordCount = countWords(draft);

  return (
    <Card className="surface-glow h-full border-border bg-card backdrop-blur-xl">
      <CardContent className="flex h-full flex-col gap-4 px-5 py-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm text-white/66">
              <NotebookPen className="size-4" />
              <span>Ders Notları</span>
            </div>
            <h2 className="mt-2 text-base font-medium text-white">{lesson.title}</h2>
            <p className="mt-2 text-xs leading-5 text-white/42">
              {(saveState === "saving"
                ? "Kaydediliyor"
                : saveState === "saved"
                  ? "Kaydedildi"
                  : "Taslak") + ` · ${wordCount} kelime`}
              {storedNote?.updatedAt ? ` · ${formatNoteDate(storedNote.updatedAt)}` : ""}
            </p>
          </div>
          {onClose ? (
            <WorkspaceToggleButton label="Notları kapat" onClick={onClose}>
              <X className="size-4" />
            </WorkspaceToggleButton>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {(["write", "preview"] as const).map((value) => (
              <Button
                key={value}
                variant="outline"
                size="sm"
                className={cn(
                  "rounded-2xl border-white/12 bg-white/[0.03] text-white hover:bg-white/[0.08]",
                  mode === value && "bg-white/[0.1]"
                )}
                onClick={() => setMode(value)}
              >
                {value === "write" ? (
                  <PencilLine className="size-3.5" />
                ) : (
                  <Eye className="size-3.5" />
                )}
                {value === "write" ? "Yaz" : "Önizle"}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {prompts.map((prompt) => (
              <Button
                key={prompt.label}
                variant="outline"
                size="sm"
                className="rounded-2xl border-white/12 bg-white/[0.03] text-white/72 hover:bg-white/[0.08] hover:text-white"
                onClick={() => insertPrompt(prompt.text)}
              >
                {prompt.label}
              </Button>
            ))}
          </div>
        </div>

        {mode === "write" ? (
          <textarea
            aria-label="Ders notları"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Tanım, ispat fikri, soru ya da derse dair kendi kısa özetini buraya yaz."
            className={cn(
              "flex-1 resize-none rounded-[24px] border border-white/8 bg-black/12 px-4 py-4 text-sm leading-8 text-white outline-none placeholder:text-white/28 focus:border-white/14 focus:bg-black/18",
              compact ? "min-h-[320px]" : "min-h-[320px] lg:min-h-[620px]"
            )}
          />
        ) : (
          <div
            className={cn(
              "flex-1 rounded-[24px] border border-white/8 bg-black/12 px-4 py-4 text-sm leading-8 text-white/86",
              compact ? "min-h-[320px]" : "min-h-[320px] lg:min-h-[620px]"
            )}
          >
            {draft.trim().length > 0 ? (
              <div className="whitespace-pre-wrap">{draft}</div>
            ) : (
              <p className="text-white/34">Henüz not yok. Ders notların burada görünecek.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CurriculumPanel({
  course,
  lesson,
  modules,
  onClose,
}: {
  course: LearningCourse;
  lesson: LearningLesson;
  modules: LearningModule[];
  onClose?: () => void;
}) {
  const { getCourseProgressSummary, getLessonStatusValue } = useLearningWorkspace();
  const progress = getCourseProgressSummary(course.id);

  return (
    <Card className="surface-glow h-full border-border bg-card backdrop-blur-xl">
      <CardContent className="flex h-full flex-col gap-4 px-4 py-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.18em] text-white/34">{course.shortTitle}</p>
            <h2 className="mt-2 font-heading text-lg text-white">{course.title}</h2>
          </div>
          {onClose ? (
            <WorkspaceToggleButton label="Müfredatı kapat" onClick={onClose}>
              <X className="size-4" />
            </WorkspaceToggleButton>
          ) : null}
        </div>

        <div className="rounded-[22px] border border-white/8 bg-black/12 px-4 py-4">
          <div className="flex items-center justify-between gap-3 text-sm text-white/62">
            <span>{progress.completed} / {progress.total} ders</span>
            <span>%{progress.progressPercent}</span>
          </div>
          <Progress
            value={progress.progressPercent}
            className="mt-3 [&_[data-slot='progress-track']]:h-2 [&_[data-slot='progress-track']]:bg-white/8 [&_[data-slot='progress-indicator']]:bg-zinc-100"
          />
        </div>

        <div className="max-h-[74vh] space-y-4 overflow-y-auto pr-1">
          {modules.map((module) => {
            const lessons = getModuleLessons(module.id);
            const completedCount = lessons.filter(
              (moduleLesson) => getLessonStatusValue(moduleLesson.id) === "completed"
            ).length;

            return (
              <div key={module.id} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/32">
                    {module.title}
                  </p>
                  <span className="text-xs text-white/38">
                    {completedCount}/{lessons.length}
                  </span>
                </div>

                <div className="space-y-1">
                  {lessons.map((moduleLesson, index) => {
                    const status = getLessonStatusValue(moduleLesson.id);
                    const isCurrent = moduleLesson.id === lesson.id;

                    return (
                      <Link
                        key={moduleLesson.id}
                        href={`/learning/course/${course.slug}/lesson/${moduleLesson.slug}`}
                        className={cn(
                          "flex items-start gap-3 rounded-2xl px-3 py-3 text-sm transition",
                          isCurrent
                            ? "border border-zinc-100/14 bg-zinc-100/10 text-white"
                            : "border border-transparent text-white/58 hover:bg-white/[0.04] hover:text-white/86"
                        )}
                      >
                        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[11px] text-white/48">
                          {status === "completed" ? (
                            <CheckCircle2 className="size-3.5 text-zinc-300" />
                          ) : (
                            index + 1
                          )}
                        </span>
                        <div className="min-w-0">
                          <p className="leading-6">{moduleLesson.title}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/34">
                            <span>
                              {status === "completed"
                                ? "Tamamlandı"
                                : isCurrent
                                  ? "Şu anki ders"
                                  : "Açık"}
                            </span>
                            {moduleLesson.durationMinutes ? (
                              <span>{moduleLesson.durationMinutes} dk</span>
                            ) : null}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export function LessonPage({ course, lesson }: LessonPageProps) {
  const editorialOverrides = useEditorialOverrides();
  const {
    hydrated,
    markExerciseComplete,
    markLessonComplete,
    openLesson,
    state,
    getLessonStatusValue,
  } = useLearningWorkspace();
  const [desktopCurriculumVisible, setDesktopCurriculumVisible] = useState(true);
  const [desktopNotesVisible, setDesktopNotesVisible] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<"curriculum" | "notes" | null>(null);
  const [focusMode, setFocusMode] = useState(false);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    openLesson(lesson.id);
  }, [hydrated, lesson.id, openLesson]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent(LESSON_FOCUS_EVENT, { detail: { active: focusMode } })
    );

    return () => {
      window.dispatchEvent(
        new CustomEvent(LESSON_FOCUS_EVENT, { detail: { active: false } })
      );
    };
  }, [focusMode]);

  const modules = useMemo(() => getCourseModules(course.id), [course.id]);
  const navigation = useMemo(() => getLessonNavigation(lesson.id), [lesson.id]);
  const lessonExercises = learningCatalog.exercises.filter((exercise) =>
    lesson.exerciseIds.includes(exercise.id)
  );
  const lessonConcepts = useMemo(
    () =>
      lesson.concepts
        .map((conceptId) => learningCatalog.concepts.find((item) => item.id === conceptId))
        .filter((concept): concept is NonNullable<typeof concept> => Boolean(concept)),
    [lesson.concepts]
  );
  const lessonRichContent = usePublishedLessonContent(course.slug, lesson.slug);
  const lessonStatus = getLessonStatusValue(lesson.id);
  const currentModule = modules.find((module) => module.id === lesson.moduleId);
  const lessonReadiness = getLessonReadiness(state, lesson.id);
  const lessonPathPosition = getLessonPathPosition(lesson.id);
  const pathProgress = getPathProgress(state, course.id);
  const courseRecommendation = getCourseRecommendation(state, course.id);
  const currentStudySession = getCurrentStudySession(state, {
    courseId: course.id,
    editorialOverrides,
  });
  const studyPlan = getStudySessionPlan(state, lesson.id, editorialOverrides);
  const studyProgress = getStudySessionProgress(state, lesson.id, editorialOverrides);
  const isCurrentStudyLesson = currentStudySession?.lesson?.id === lesson.id;
  const recommendedNextLesson =
    courseRecommendation.lesson && courseRecommendation.lesson.id !== lesson.id
      ? courseRecommendation.lesson
      : null;
  const visibleLessonExercises = lessonRichContent ? lessonExercises : [];
  const reviewedExercises = visibleLessonExercises.filter(
    (exercise) => state.exerciseProgress[exercise.id]
  ).length;
  const nextHref = navigation.nextLesson
    ? `/learning/course/${course.slug}/lesson/${navigation.nextLesson.slug}`
    : `/learning/course/${course.slug}`;
  const recommendedNextHref = recommendedNextLesson
    ? `/learning/course/${course.slug}/lesson/${recommendedNextLesson.slug}`
    : null;

  function toggleCurriculumPanel() {
    setFocusMode(false);
    setDesktopCurriculumVisible((current) => {
      const next = !current;
      if (next) {
        setDesktopNotesVisible(false);
      }
      return next;
    });
  }

  function toggleNotesPanel() {
    setFocusMode(false);
    setDesktopNotesVisible((current) => {
      const next = !current;
      if (next) {
        setDesktopCurriculumVisible(false);
      }
      return next;
    });
  }

  function toggleFocusMode() {
    setFocusMode((current) => !current);
  }

  const desktopGridClass = focusMode
    ? "xl:grid-cols-[minmax(0,1fr)]"
    : desktopNotesVisible
      ? "xl:grid-cols-[minmax(0,1fr)_340px]"
      : desktopCurriculumVisible
        ? "xl:grid-cols-[252px_minmax(0,1fr)]"
        : "xl:grid-cols-[minmax(0,1fr)]";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 xl:hidden">
        <Button
          variant="outline"
          className="rounded-2xl border-white/12 bg-white/[0.03] text-white hover:bg-white/[0.08]"
          onClick={() => setMobilePanel("curriculum")}
        >
          <ListTree className="size-4" />
          Müfredat
        </Button>
        <Button
          variant="outline"
          className="rounded-2xl border-white/12 bg-white/[0.03] text-white hover:bg-white/[0.08]"
          onClick={() => setMobilePanel("notes")}
        >
          <FileText className="size-4" />
          Notlar
        </Button>
        <Button
          variant="outline"
          className="rounded-2xl border-white/12 bg-white/[0.03] text-white hover:bg-white/[0.08]"
          onClick={toggleFocusMode}
        >
          {focusMode ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
          {focusMode ? "Odaktan Çık" : "Odak Modu"}
        </Button>
      </div>

      {mobilePanel ? (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button
            aria-label="Paneli kapat"
            className="absolute inset-0 bg-black/70"
            onClick={() => setMobilePanel(null)}
          />
          <div className="absolute inset-x-3 bottom-3 top-20 overflow-y-auto">
            {mobilePanel === "curriculum" ? (
              <CurriculumPanel
                course={course}
                lesson={lesson}
                modules={modules}
                onClose={() => setMobilePanel(null)}
              />
            ) : (
              <LessonNotesPanel
                lesson={lesson}
                compact
                onClose={() => setMobilePanel(null)}
              />
            )}
          </div>
        </div>
      ) : null}

      <div className={cn("grid gap-4", desktopGridClass)}>
        {!focusMode && desktopCurriculumVisible ? (
          <aside className="hidden xl:block xl:sticky xl:top-5 xl:self-start">
            <CurriculumPanel course={course} lesson={lesson} modules={modules} />
          </aside>
        ) : null}

        <main className="space-y-4">
          <Card className="surface-glow border-border bg-card backdrop-blur-xl">
            <CardContent className="space-y-2.5 px-5 py-3.5 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-sm text-white/48">
                    <Link href="/learning" className="hover:text-white">
                      Dersler
                    </Link>
                    <ChevronRight className="size-4" />
                    <Link href={`/learning/course/${course.slug}`} className="hover:text-white">
                      {course.title}
                    </Link>
                    <ChevronRight className="size-4" />
                    <span className="text-white/66">{lesson.title}</span>
                  </div>

                  <div>
                    <p className="text-sm text-white/42">
                      {course.title} / {currentModule?.title}
                    </p>
                    <h1 className="mt-1 font-heading text-[1.75rem] leading-tight text-white sm:text-[1.9rem]">
                      {lesson.title}
                    </h1>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/58">
                      {lesson.instructor ? <span>{lesson.instructor}</span> : null}
                      {lesson.sourceOrder ? <span>Archive #{lesson.sourceOrder}</span> : null}
                      <span>{getLessonStatusLabel(lessonStatus)}</span>
                    </div>
                  </div>

                  {lessonReadiness && lessonPathPosition ? (
                    <div className="rounded-[22px] border border-white/8 bg-black/12 px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-white/48">
                        <Badge className="bg-white/10 text-white/72">Öğrenme Yolu</Badge>
                        <span>{lessonReadiness.stage.title}</span>
                        <span>
                          {pathProgress.completed} / {pathProgress.total} ders
                        </span>
                        <Badge className={getReadinessBadgeClass(lessonReadiness.readiness)}>
                          {getLessonReadinessLabel(lessonReadiness.readiness)}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-white/60">
                        {lessonReadiness.explanation}
                      </p>
                      {!focusMode && lessonReadiness.prerequisiteLessons.length > 0 ? (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="text-xs uppercase tracking-[0.18em] text-white/34">
                            Önerilen önkoşullar
                          </span>
                          {lessonReadiness.prerequisiteLessons.map((prerequisiteLesson) => {
                            const completed = lessonReadiness.completedPrerequisiteLessons.some(
                              (item) => item.id === prerequisiteLesson.id
                            );

                            return (
                              <Link
                                key={prerequisiteLesson.id}
                                href={`/learning/course/${course.slug}/lesson/${prerequisiteLesson.slug}`}
                                className={cn(
                                  "inline-flex items-center gap-2 rounded-2xl border px-3 py-1.5 text-xs transition hover:bg-white/[0.08]",
                                  completed
                                    ? "border-zinc-300/18 bg-zinc-300/10 text-zinc-200"
                                    : "border-white/10 bg-white/[0.03] text-white/70"
                                )}
                              >
                                <span>{completed ? "✓" : "○"}</span>
                                <span>{prerequisiteLesson.title}</span>
                              </Link>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {studyPlan && studyProgress ? (
                    <div className="rounded-[20px] border border-white/8 bg-white/[0.03] px-3.5 py-2.5">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-white/40">
                        <span>Bugünkü Çalışma</span>
                        {lessonStatus === "completed" ? (
                          <span>Bugünkü çalışma tamamlandı</span>
                        ) : isCurrentStudyLesson ? (
                          <span>
                            {studyProgress.completedSteps}/{studyProgress.totalSteps} adım
                          </span>
                        ) : currentStudySession?.lesson ? (
                          <span>Günün önerisi: {currentStudySession.lesson.title}</span>
                        ) : (
                          <span>Günlük akış hazır</span>
                        )}
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-sm text-white/62">
                        {studyPlan.steps.map((step) => (
                          <span
                            key={step.key}
                            className={cn(
                              "inline-flex items-center rounded-2xl border px-2.5 py-0.5 text-[11px]",
                              step.completed
                                ? "border-zinc-300/18 bg-zinc-300/10 text-zinc-200"
                                : "border-white/10 bg-black/12 text-white/68"
                            )}
                          >
                            {step.label}
                            {step.detail ? ` · ${step.detail}` : ""}
                          </span>
                        ))}
                      </div>

                      {lessonStatus === "completed" && recommendedNextLesson && recommendedNextHref ? (
                        <Link
                          href={recommendedNextHref}
                          className="mt-2.5 inline-flex items-center gap-2 text-sm text-zinc-200 transition hover:text-white"
                        >
                          <span>Sıradaki: {recommendedNextLesson.title}</span>
                          <ArrowRight className="size-4" />
                        </Link>
                      ) : null}

                      {!isCurrentStudyLesson &&
                      lessonStatus !== "completed" &&
                      currentStudySession?.lesson ? (
                        <Link
                          href={`/learning/course/${course.slug}/lesson/${currentStudySession.lesson.slug}`}
                          className="mt-2.5 inline-flex items-center gap-2 text-sm text-white/56 transition hover:text-white"
                        >
                          Bugünkü derse dön
                          <ArrowRight className="size-4" />
                        </Link>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <div className="hidden items-center gap-2 xl:flex">
                  <WorkspaceToggleButton
                    active={desktopCurriculumVisible}
                    label="Müfredatı aç veya kapat"
                    onClick={toggleCurriculumPanel}
                  >
                    <ListTree className="size-4" />
                  </WorkspaceToggleButton>
                  <WorkspaceToggleButton
                    active={desktopNotesVisible}
                    label="Notları aç veya kapat"
                    onClick={toggleNotesPanel}
                  >
                    <FileText className="size-4" />
                  </WorkspaceToggleButton>
                  <WorkspaceToggleButton
                    active={focusMode}
                    label={focusMode ? "Odak modundan çık" : "Odak moduna gir"}
                    onClick={toggleFocusMode}
                  >
                    {focusMode ? (
                      <Minimize2 className="size-4" />
                    ) : (
                      <Maximize2 className="size-4" />
                    )}
                  </WorkspaceToggleButton>
                </div>
              </div>
            </CardContent>
          </Card>

          <LessonVideoPlayer lesson={lesson} />

          {lessonRichContent ? (
            <LessonStudyContentSection content={lessonRichContent} />
          ) : (lesson.description || lessonConcepts.length > 0) ? (
            <Card className="surface-glow border-border bg-card backdrop-blur-xl">
              <CardContent className="space-y-4 px-5 py-4 sm:px-6">
                {lesson.description ? (
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/34">
                      Bu ders hakkında
                    </p>
                    <p className="max-w-4xl text-sm leading-7 text-white/56">
                      {lesson.description}
                    </p>
                  </div>
                ) : null}

                {lessonConcepts.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/34">Kavramlar</p>
                    <div className="flex flex-wrap gap-2">
                      {lessonConcepts.map((concept) => (
                        <Badge key={concept.id} className="bg-white/10 text-white/72">
                          {concept.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ) : null}

          {lessonRichContent ? (
            <LessonExercisesSection course={course} exercises={visibleLessonExercises} />
          ) : visibleLessonExercises.length > 0 ? (
            <Card className="surface-glow border-border bg-card backdrop-blur-xl">
              <CardContent className="space-y-5 px-5 py-5 sm:px-6">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h2 className="font-heading text-2xl text-white">Alıştırmalar</h2>
                    <p className="mt-2 text-sm leading-7 text-white/50">
                      Bu derse bağlı alıştırmalar ortak alıştırma sistemiyle bağlantılı kalır.
                    </p>
                  </div>
                  <Badge className="bg-white/10 text-white/72">
                    {reviewedExercises}/{visibleLessonExercises.length} tamamlandı
                  </Badge>
                </div>

                <div className="space-y-3">
                  {visibleLessonExercises.map((exercise) => {
                    const completed = Boolean(state.exerciseProgress[exercise.id]);

                    return (
                      <div
                        key={exercise.id}
                        className="rounded-[24px] border border-white/8 bg-black/12 px-4 py-4"
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div>
                            <div className="flex flex-wrap gap-2">
                              <Badge className="bg-white/10 text-white/72">
                                {getExerciseFormatLabel(exercise.format)}
                              </Badge>
                              <Badge className="bg-white/10 text-white/72">
                                {exercise.kind === "lesson" ? "Ders" : "Alıştırma"}
                              </Badge>
                            </div>
                            <h3 className="mt-3 text-lg font-medium text-white">
                              {exercise.title}
                            </h3>
                            <p className="mt-2 text-sm leading-7 text-white/52">
                              {exercise.prompt}
                            </p>
                          </div>

                          <Button
                            variant={completed ? "outline" : "default"}
                            className={
                              completed
                                ? "rounded-2xl border-white/12 bg-white/[0.03] text-white"
                                : "rounded-2xl bg-white text-zinc-950 hover:bg-zinc-200"
                            }
                            onClick={() => markExerciseComplete(exercise.id)}
                          >
                            {completed ? "Tamamlandı" : "Tamamlandı olarak işaretle"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ) : (
            <section className="space-y-2 px-1">
              <h2 className="font-heading text-2xl text-white">Alıştırmalar</h2>
              <p className="text-sm text-white/46">Bu ders için henüz alıştırma yok.</p>
            </section>
          )}

          <Card className="surface-glow border-border bg-card backdrop-blur-xl">
            <CardContent className="space-y-3.5 px-5 py-4 sm:px-6">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/34">
                    Dersi Tamamla
                  </p>
                  <h2 className="mt-1.5 font-heading text-xl text-white">
                    {lessonStatus === "completed"
                      ? "Ders tamamlandı"
                      : "Hazırsan bu dersi tamamla"}
                  </h2>
                  <p className="mt-1.5 max-w-2xl text-sm leading-6 text-white/52">
                    {lessonStatus === "completed"
                      ? recommendedNextLesson
                        ? "Bu ders tamamlandı. Hazır olduğunda öğrenme yolundaki sıradaki öneriye geçebilirsin."
                        : "Bu ders tamamlandı. Real Analysis öğrenme yolu da tamamlandıysa kavramları gözden geçirip pratik yapabilirsin."
                      : "Dersi tamamlamak kurs ilerlemeni günceller ve çalışma akışını ileri taşır."}
                  </p>
                </div>
                <Badge
                  className={
                    lessonStatus === "completed"
                      ? "bg-zinc-300/14 text-zinc-200"
                      : "bg-zinc-100/14 text-zinc-200"
                  }
                >
                  {getLessonStatusLabel(lessonStatus)}
                </Badge>
              </div>

              <div className="flex flex-col gap-2.5">
                {lessonStatus !== "completed" ? (
                  <Button
                    className="rounded-2xl bg-white text-zinc-950 hover:bg-zinc-200 sm:w-fit"
                    onClick={() => markLessonComplete(lesson.id)}
                  >
                    <CheckCircle2 className="size-4" />
                    Dersi tamamlandı olarak işaretle
                  </Button>
                ) : null}

                {lessonStatus === "completed" && recommendedNextLesson && recommendedNextHref ? (
                  <Link
                    href={recommendedNextHref}
                    className="inline-flex w-full items-center justify-between gap-3 rounded-2xl border border-zinc-100/14 bg-zinc-100/10 px-4 py-3 text-sm text-white transition hover:bg-zinc-100/14 sm:w-fit sm:min-w-[280px]"
                  >
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/38">
                        Sıradaki önerilen ders
                      </p>
                      <p className="mt-1 truncate font-medium text-white">
                        {recommendedNextLesson.title}
                      </p>
                    </div>
                    <ArrowRight className="size-4 shrink-0" />
                  </Link>
                ) : null}

                {lessonStatus === "completed" && !recommendedNextLesson ? (
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/concepts"
                      className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-sm text-white transition hover:bg-white/[0.08]"
                    >
                      Kavramları Gözden Geçir
                      <ArrowRight className="size-4" />
                    </Link>
                    <Link
                      href="/practice"
                      className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-sm text-white transition hover:bg-white/[0.08]"
                    >
                      Pratik Yap
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                ) : null}

                {lessonStatus !== "completed" ? (
                  <Link
                    href={nextHref}
                    className="inline-flex w-full items-center justify-between gap-3 rounded-2xl border border-white/12 bg-white/[0.03] px-4 py-3 text-sm text-white transition hover:bg-white/[0.08] sm:w-fit sm:min-w-[260px]"
                  >
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/38">
                        {navigation.nextLesson ? "Sonraki ders" : "Kursa dön"}
                      </p>
                      <p className="mt-1 truncate font-medium text-white">
                        {navigation.nextLesson?.title ?? course.title}
                      </p>
                    </div>
                    <ArrowRight className="size-4 shrink-0" />
                  </Link>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card className="surface-glow border-border bg-card backdrop-blur-xl">
            <CardContent className="grid gap-3 px-5 py-4 md:grid-cols-2">
              <Link
                href={
                  navigation.previousLesson
                    ? `/learning/course/${course.slug}/lesson/${navigation.previousLesson.slug}`
                    : `/learning/course/${course.slug}`
                }
                className="rounded-2xl border border-white/8 bg-black/10 px-4 py-3 transition hover:bg-white/[0.04]"
              >
                <div className="flex items-center gap-2 text-sm text-white/46">
                  <ArrowLeft className="size-4" />
                  Önceki
                </div>
                <p className="mt-1.5 line-clamp-2 text-sm font-medium text-white">
                  {navigation.previousLesson?.title ?? course.title}
                </p>
              </Link>

              <Link
                href={nextHref}
                className="rounded-2xl border border-white/8 bg-black/10 px-4 py-3 text-left transition hover:bg-white/[0.04] md:text-right"
              >
                <div className="flex items-center gap-2 text-sm text-white/46 md:justify-end">
                  Sonraki
                  <ArrowRight className="size-4" />
                </div>
                <p className="mt-1.5 line-clamp-2 text-sm font-medium text-white">
                  {navigation.nextLesson?.title ?? "Kurs görünümü"}
                </p>
              </Link>
            </CardContent>
          </Card>
        </main>

        {!focusMode && desktopNotesVisible ? (
          <aside className="hidden xl:block xl:sticky xl:top-5 xl:self-start">
            <LessonNotesPanel lesson={lesson} />
          </aside>
        ) : null}
      </div>
    </div>
  );
}
