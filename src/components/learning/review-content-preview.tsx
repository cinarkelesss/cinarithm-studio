"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  clearLessonEditorialOverride,
  saveLessonEditorialReview,
  transitionLessonContentStatus,
  useEditorialLessonContentByLessonId,
  useEditorialLessonContentEntries,
} from "@/components/learning/use-editorial-content";
import {
  getLessonContentValidationReport,
  getBaseLessonRichContentByLessonId,
} from "@/data/learning/content";
import { learningCatalog } from "@/data/learning/curriculum";
import {
  buildLessonContentReviewSummary,
  CONTENT_STATUS_LABELS,
  getAllowedContentStatusTransitions,
  getReviewStatusLabel,
  LESSON_EDITORIAL_CHECKLIST,
  REAL_ANALYSIS_DRAFT_BATCH_LESSON_IDS,
  REVIEW_STATUS_LABELS,
  TURKISH_MATH_TERMINOLOGY,
  type LessonContentValidationIssue,
} from "@/lib/learning/editorial";
import type {
  ContentStatus,
  LessonContentReview,
  LessonContentReviewStatus,
  LessonRichContent,
} from "@/lib/learning/lesson-content";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function statusBadgeClass(status: ContentStatus) {
  switch (status) {
    case "draft":
      return "bg-zinc-400/14 text-zinc-200";
    case "review":
      return "bg-zinc-100/14 text-zinc-200";
    case "approved":
      return "bg-zinc-300/14 text-zinc-200";
    case "published":
      return "bg-zinc-200/14 text-zinc-200";
    default:
      return "bg-white/10 text-white/72";
  }
}

function reviewBadgeClass(status: LessonContentReviewStatus) {
  switch (status) {
    case "pass":
      return "bg-zinc-300/14 text-zinc-200";
    case "needs_changes":
      return "bg-zinc-400/14 text-zinc-200";
    default:
      return "bg-white/10 text-white/72";
  }
}

function formatDate(value?: string) {
  if (!value) {
    return "Henüz yok";
  }

  return new Date(value).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MathInline({ expression }: { expression: string }) {
  return (
    <span className="rounded-md bg-white/[0.04] px-1.5 py-0.5 font-serif text-[0.98em] text-white/92">
      {expression}
    </span>
  );
}

function MathBlock({ expression }: { expression: string }) {
  return (
    <div className="rounded-[22px] border border-white/8 bg-black/14 px-4 py-4 text-center font-serif text-lg text-white">
      {expression}
    </div>
  );
}

const INLINE_FORMULAS = [
  "sup(A + c) = sup(A) + c",
  "∀ ε > 0 ∃ δ > 0",
  "|f(x) - f(y)| < ε",
  "|x - y| < δ",
  "aHa^{-1} = H",
  "aH = Ha",
  "G = (V, E)",
  "deg(v)",
  "2|E|",
  "A ⊆ ℝ",
  "M ∈ ℝ",
  "x ≤ M",
  "sup A",
  "max A",
  "B_r(x)",
  "d(x, y)",
  "√2",
  "ℚ",
  "ℝ",
  "δ",
  "ε",
];

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function splitFormulaParagraph(paragraph: string) {
  const pattern = new RegExp(
    `(${[...INLINE_FORMULAS]
      .sort((left, right) => right.length - left.length)
      .map((formula) => escapeRegExp(formula))
      .join("|")})`,
    "g"
  );
  return paragraph.split(pattern).filter(Boolean);
}

function FormulaParagraph({ paragraph }: { paragraph: string }) {
  return (
    <p className="text-sm leading-7 text-white/62">
      {splitFormulaParagraph(paragraph).map((token, index) =>
        INLINE_FORMULAS.includes(token) ? (
          <MathInline key={`${token}-${index}`} expression={token} />
        ) : (
          <span key={`${token}-${index}`}>{token}</span>
        )
      )}
    </p>
  );
}

function ReviewLessonContentPreview({
  content,
}: {
  content: LessonRichContent;
}) {
  const concepts = content.keyConcepts
    .map((item) => ({
      summary: item.summary,
      concept: learningCatalog.concepts.find((concept) => concept.id === item.conceptId),
    }))
    .filter(
      (
        item
      ): item is {
        summary: string;
        concept: (typeof learningCatalog.concepts)[number];
      } => Boolean(item.concept)
    );
  const exercises = learningCatalog.exercises.filter((exercise) =>
    content.exerciseIds.includes(exercise.id)
  );

  return (
    <div className="space-y-4">
      <Card className="surface-glow border-border bg-card backdrop-blur-xl">
        <CardContent className="space-y-6 px-5 py-5 sm:px-6">
          <section className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.18em] text-white/34">Çalışma Rehberi</p>
              <FormulaParagraph paragraph={content.intro} />
            </div>

            <div className="flex flex-wrap gap-2">
              {content.prerequisites.map((item) => (
                <span
                  key={item.href}
                  className="inline-flex items-center rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/64"
                >
                  {item.label}
                </span>
              ))}
            </div>

            <div className="space-y-5">
              {content.studyGuide.map((section) => (
                <div key={section.title} className="space-y-3">
                  <h2 className="text-base font-semibold text-white">{section.title}</h2>
                  <div className="space-y-3">
                    {section.body.map((paragraph) => (
                      <FormulaParagraph key={paragraph} paragraph={paragraph} />
                    ))}
                  </div>
                  {section.statement ? <MathBlock expression={section.statement} /> : null}
                  {section.note ? (
                    <p className="text-sm leading-7 text-white/48">{section.note}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4 border-t border-white/8 pt-6">
            <p className="text-xs uppercase tracking-[0.18em] text-white/34">Örnek</p>
            <div className="space-y-3">
              <h2 className="text-base font-semibold text-white">{content.example.title}</h2>
              <FormulaParagraph paragraph={content.example.overview} />
              <MathBlock expression={content.example.expression} />
              <div className="space-y-2">
                {content.example.steps.map((step) => (
                  <div key={step} className="flex gap-3 text-sm leading-7 text-white/56">
                    <span className="mt-1.5 size-1.5 rounded-full bg-white/40" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-[22px] border border-white/8 bg-black/12 px-4 py-4">
                <p className="text-sm font-medium text-white">{content.example.contrastTitle}</p>
                <div className="mt-3 space-y-2">
                  {content.example.contrast.map((paragraph) => (
                    <FormulaParagraph key={paragraph} paragraph={paragraph} />
                  ))}
                </div>
              </div>
              <p className="text-sm leading-7 text-white/48">{content.example.takeaway}</p>
            </div>
          </section>

          <section className="space-y-4 border-t border-white/8 pt-6">
            <p className="text-xs uppercase tracking-[0.18em] text-white/34">Temel Kavramlar</p>
            <div className="grid gap-3 md:grid-cols-2">
              {concepts.map(({ concept, summary }) => (
                <div
                  key={concept.id}
                  className="rounded-[20px] border border-white/8 bg-black/12 px-4 py-3.5"
                >
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-white">{concept.name}</p>
                    <FormulaParagraph paragraph={summary} />
                    <p className="text-xs text-white/34">{concept.id}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </CardContent>
      </Card>

      <Card className="surface-glow border-border bg-card backdrop-blur-xl">
        <CardContent className="space-y-4 px-5 py-5 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/34">Alıştırmalar</p>
              <p className="mt-1 text-sm text-white/48">
                Bu önizleme ekranında alıştırmalar salt-okunur gösterilir.
              </p>
            </div>
            <Badge className="bg-white/10 text-white/72">{exercises.length} alıştırma</Badge>
          </div>

          <div className="space-y-3">
            {exercises.map((exercise, index) => (
              <div
                key={exercise.id}
                className="rounded-[22px] border border-white/8 bg-black/12 px-4 py-4"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="bg-white/10 text-white/72">Alıştırma {index + 1}</Badge>
                    <Badge className="bg-white/10 text-white/72">{exercise.format}</Badge>
                    <Badge className="bg-white/10 text-white/72">
                      {exercise.answerMode ?? "short_answer"}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-white">{exercise.title}</h3>
                    <p className="mt-2 whitespace-pre-line text-sm leading-7 text-white/56">
                      {exercise.prompt}
                    </p>
                  </div>
                  {exercise.choices?.length ? (
                    <div className="space-y-2">
                      {exercise.choices.map((choice) => (
                        <div
                          key={choice.id}
                          className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/72"
                        >
                          {choice.text}
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {exercise.hint ? (
                    <div className="rounded-[20px] border border-zinc-100/10 bg-zinc-100/8 px-4 py-3 text-sm leading-7 text-white/72">
                      <p className="mb-1 text-xs uppercase tracking-[0.18em] text-zinc-200/72">
                        İpucu
                      </p>
                      {exercise.hint}
                    </div>
                  ) : null}
                  {exercise.solution ? (
                    <div className="rounded-[20px] border border-white/8 bg-white/[0.04] px-4 py-4 text-sm leading-7 text-white/74">
                      <p className="mb-2 text-xs uppercase tracking-[0.18em] text-white/38">
                        Çözüm
                      </p>
                      <p className="whitespace-pre-line">{exercise.solution}</p>
                    </div>
                  ) : null}
                  <div className="flex flex-wrap gap-2">
                    {exercise.conceptIds.map((conceptId) => (
                      <Badge key={conceptId} className="bg-white/10 text-white/68">
                        {conceptId}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ReviewStatusField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: LessonContentReviewStatus;
  onChange: (next: LessonContentReviewStatus) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs uppercase tracking-[0.18em] text-white/34">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as LessonContentReviewStatus)}
        className="w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none"
      >
        {Object.entries(REVIEW_STATUS_LABELS).map(([key, optionLabel]) => (
          <option key={key} value={key} className="bg-zinc-950">
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

function ReviewValidationList({ issues }: { issues: LessonContentValidationIssue[] }) {
  if (issues.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-300/12 bg-zinc-300/8 px-4 py-3 text-sm text-zinc-200">
        Bu ders için yapısal doğrulama uyarısı yok.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {issues.map((issue) => (
        <div
          key={`${issue.lessonId}-${issue.message}`}
          className={cn(
            "rounded-2xl border px-4 py-3 text-sm",
            issue.severity === "error"
              ? "border-zinc-400/16 bg-zinc-400/10 text-zinc-200"
              : "border-zinc-400/16 bg-zinc-400/10 text-zinc-200"
          )}
        >
          <span className="font-medium">{issue.severity.toUpperCase()}</span>
          {" · "}
          {issue.message}
        </div>
      ))}
    </div>
  );
}

export function ReviewDashboardPage() {
  const [filter, setFilter] = useState<ContentStatus | "all">("all");
  const entries = useEditorialLessonContentEntries();
  const validationReport = getLessonContentValidationReport();

  const filteredEntries = useMemo(
    () => entries.filter((entry) => (filter === "all" ? true : entry.status === filter)),
    [entries, filter]
  );
  const batchEntries = useMemo(
    () =>
      entries.filter((entry) =>
        REAL_ANALYSIS_DRAFT_BATCH_LESSON_IDS.includes(
          entry.lessonId as (typeof REAL_ANALYSIS_DRAFT_BATCH_LESSON_IDS)[number]
        )
      ),
    [entries]
  );
  const batchSummary = batchEntries.map((entry) => buildLessonContentReviewSummary(entry));
  const statusCounts = {
    draft: entries.filter((entry) => entry.status === "draft").length,
    review: entries.filter((entry) => entry.status === "review").length,
    approved: entries.filter((entry) => entry.status === "approved").length,
    published: entries.filter((entry) => entry.status === "published").length,
  };

  return (
    <div className="space-y-6">
      <Card className="surface-glow border-border bg-card backdrop-blur-xl">
        <CardContent className="space-y-5 px-5 py-5 sm:px-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-white/34">
              Editorial Pipeline
            </p>
            <h1 className="font-heading text-3xl text-white">Content Review Dashboard</h1>
            <p className="max-w-3xl text-sm leading-7 text-white/54">
              Bu alan öğrenci deneyiminden ayrıdır. Durum geçişleri, checklist ve review
              notları burada tutulur; öğrenci ilerleme durumu ile karışmaz.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-4">
            {(["draft", "review", "approved", "published"] as const).map((status) => (
              <div
                key={status}
                className="rounded-[22px] border border-white/8 bg-black/12 px-4 py-4"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-white/34">
                  {CONTENT_STATUS_LABELS[status]}
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">{statusCounts[status]}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {(["all", "draft", "review", "approved", "published"] as const).map((status) => (
              <Button
                key={status}
                variant="outline"
                size="sm"
                className={cn(
                  "rounded-2xl border-white/12 bg-white/[0.03] text-white hover:bg-white/[0.08]",
                  filter === status && "bg-white/[0.1]"
                )}
                onClick={() => setFilter(status)}
              >
                {status === "all" ? "Hepsi" : CONTENT_STATUS_LABELS[status]}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="surface-glow border-border bg-card backdrop-blur-xl">
        <CardContent className="space-y-4 px-5 py-5 sm:px-6">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.18em] text-white/34">
              First Real Analysis Batch
            </p>
            <p className="text-sm text-white/52">
              Bu tablo ilk kontrollü batch için review özetini verir.
            </p>
          </div>

          <div className="space-y-3">
            {batchSummary.map((item) => (
              <Link
                key={item.lessonId}
                href={`/review/content/${item.lessonId}`}
                className="block rounded-[22px] border border-white/8 bg-black/12 px-4 py-4 transition hover:bg-white/[0.04]"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <Badge className={statusBadgeClass(item.status)}>
                        {CONTENT_STATUS_LABELS[item.status]}
                      </Badge>
                      <Badge className={reviewBadgeClass(item.mathematicalReviewStatus)}>
                        Matematik: {getReviewStatusLabel(item.mathematicalReviewStatus)}
                      </Badge>
                      <Badge className={reviewBadgeClass(item.languageReviewStatus)}>
                        Dil: {getReviewStatusLabel(item.languageReviewStatus)}
                      </Badge>
                    </div>
                    <div>
                      <h2 className="text-lg font-medium text-white">{item.lessonTitle}</h2>
                      <p className="text-sm text-white/48">
                        {item.courseTitle} / {item.moduleTitle}
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-2 text-sm text-white/58 sm:grid-cols-2 lg:text-right">
                    <p>Versiyon: {item.version}</p>
                    <p>Alıştırma: {item.exerciseCount}</p>
                    <p>Proof: {item.proofExerciseCount}</p>
                    <p>Yeni kavram: {item.newConceptIds.length}</p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {item.conceptIdsReused.map((conceptId) => (
                    <Badge key={conceptId} className="bg-white/10 text-white/68">
                      {conceptId}
                    </Badge>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="surface-glow border-border bg-card backdrop-blur-xl">
        <CardContent className="space-y-4 px-5 py-5 sm:px-6">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.18em] text-white/34">Validation</p>
            <p className="text-sm text-white/52">
              Yapısal kontroller matematiksel doğrulama yapmaz; sadece referans, alan ve ID
              tutarlılığını kontrol eder.
            </p>
          </div>
          <ReviewValidationList issues={validationReport.issues} />
        </CardContent>
      </Card>

      <Card className="surface-glow border-border bg-card backdrop-blur-xl">
        <CardContent className="space-y-4 px-5 py-5 sm:px-6">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.18em] text-white/34">
              Concept Duplicate Report
            </p>
            <p className="text-sm text-white/52">
              Bu rapor matematiksel eşitlik değil, ad benzerliği üzerinden olası duplicate
              adaylarını listeler.
            </p>
          </div>

          {validationReport.conceptDuplicateCandidates.length === 0 ? (
            <div className="rounded-2xl border border-zinc-300/12 bg-zinc-300/8 px-4 py-3 text-sm text-zinc-200">
              Olası concept-name duplicate adayı bulunamadı.
            </div>
          ) : (
            <div className="space-y-2">
              {validationReport.conceptDuplicateCandidates.map((group) => (
                <div
                  key={group.map((concept) => concept.id).join("-")}
                  className="rounded-2xl border border-zinc-400/16 bg-zinc-400/10 px-4 py-3 text-sm text-zinc-200"
                >
                  {group.map((concept) => `${concept.name} (${concept.id})`).join(" / ")}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="surface-glow border-border bg-card backdrop-blur-xl">
        <CardContent className="space-y-4 px-5 py-5 sm:px-6">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.18em] text-white/34">Terminology</p>
            <p className="text-sm text-white/52">
              Batch boyunca terim tutarlılığı için kullanılan hafif sözlük.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {TURKISH_MATH_TERMINOLOGY.map((item) => (
              <div
                key={item.source}
                className="rounded-[20px] border border-white/8 bg-black/12 px-4 py-3"
              >
                <p className="text-sm text-white/48">{item.source}</p>
                <p className="mt-1 font-medium text-white">{item.target}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="surface-glow border-border bg-card backdrop-blur-xl">
        <CardContent className="space-y-4 px-5 py-5 sm:px-6">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.18em] text-white/34">All Content</p>
            <p className="text-sm text-white/52">
              Filter mevcut status override&apos;larını da dikkate alır.
            </p>
          </div>
          <div className="space-y-3">
            {filteredEntries.map((entry) => {
              const lesson = learningCatalog.lessons.find((item) => item.id === entry.lessonId);

              return (
                <Link
                  key={entry.lessonId}
                  href={`/review/content/${entry.lessonId}`}
                  className="flex flex-col gap-3 rounded-[22px] border border-white/8 bg-black/12 px-4 py-4 transition hover:bg-white/[0.04] md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap gap-2">
                      <Badge className={statusBadgeClass(entry.status)}>
                        {CONTENT_STATUS_LABELS[entry.status]}
                      </Badge>
                      <Badge className="bg-white/10 text-white/72">v{entry.version}</Badge>
                    </div>
                    <h2 className="text-base font-medium text-white">
                      {lesson?.title ?? entry.lessonSlug}
                    </h2>
                    <p className="text-sm text-white/48">{entry.lessonId}</p>
                  </div>
                  <div className="text-sm text-white/52">
                    {entry.reviewedBy ? `${entry.reviewedBy} · ` : ""}
                    {formatDate(entry.lastReviewedAt)}
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ReviewContentPage({ lessonId }: { lessonId: string }) {
  const content = useEditorialLessonContentByLessonId(lessonId);
  const baseContent = getBaseLessonRichContentByLessonId(lessonId);
  const validationIssues = getLessonContentValidationReport().issues.filter(
    (issue) => issue.lessonId === lessonId
  );
  const [reviewedBy, setReviewedBy] = useState("");
  const [reviewNotesText, setReviewNotesText] = useState("");
  const [review, setReview] = useState<LessonContentReview | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!content) {
      return;
    }

    setReviewedBy(content.reviewedBy ?? "");
    setReviewNotesText((content.reviewNotes ?? []).join("\n"));
    setReview(content.review);
  }, [content]);

  const lesson = content
    ? learningCatalog.lessons.find((item) => item.id === content.lessonId)
    : null;
  const course = lesson
    ? learningCatalog.courses.find((item) => item.id === lesson.courseId)
    : null;
  const lessonModule = lesson
    ? learningCatalog.modules.find((item) => item.id === lesson.moduleId)
    : null;

  if (!content || !review || !lesson || !course || !lessonModule) {
    return null;
  }

  const nextStatuses = getAllowedContentStatusTransitions(content.status);
  const isDirty =
    reviewedBy !== (content.reviewedBy ?? "") ||
    reviewNotesText !== (content.reviewNotes ?? []).join("\n") ||
    JSON.stringify(review) !== JSON.stringify(content.review);

  function handleSaveReview() {
    if (!review) {
      return;
    }

    saveLessonEditorialReview({
      lessonId,
      review,
      reviewNotes: reviewNotesText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      reviewedBy: reviewedBy.trim() || undefined,
    });
    setMessage("Review notlari kaydedildi.");
  }

  function handleStatusTransition(nextStatus: ContentStatus) {
    const result = transitionLessonContentStatus(lessonId, nextStatus);
    setMessage(result.ok ? `${CONTENT_STATUS_LABELS[nextStatus]} durumuna gecildi.` : result.message);
  }

  function handleClearOverride() {
    clearLessonEditorialOverride(lessonId);
    setMessage("Local editorial override temizlendi.");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/review" className="text-sm text-white/52 transition hover:text-white">
            /review
          </Link>
          <h1 className="mt-2 font-heading text-3xl text-white">{lesson.title}</h1>
          <p className="mt-1 text-sm text-white/48">
            {course.title} / {lessonModule.title} / {lessonId}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className={statusBadgeClass(content.status)}>
            {CONTENT_STATUS_LABELS[content.status]}
          </Badge>
          <Badge className="bg-white/10 text-white/72">v{content.version}</Badge>
        </div>
      </div>

      {content.status !== "published" ? (
        <div className="rounded-[24px] border border-zinc-400/16 bg-zinc-400/10 px-5 py-4 text-zinc-200">
          <p className="text-sm font-medium">
            {content.status === "draft" ? "Taslak İçerik" : "Yayınlanmamış İnceleme İçeriği"}
          </p>
          <p className="mt-1 text-sm text-zinc-200/78">
            Bu önizleme öğrenciye gösterilen normal lesson experience değildir.
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <Card className="surface-glow border-border bg-card backdrop-blur-xl">
            <CardContent className="space-y-4 px-5 py-5 sm:px-6">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-[22px] border border-white/8 bg-black/12 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/34">Status</p>
                  <p className="mt-2 text-lg font-medium text-white">
                    {CONTENT_STATUS_LABELS[content.status]}
                  </p>
                </div>
                <div className="rounded-[22px] border border-white/8 bg-black/12 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/34">Last Reviewed</p>
                  <p className="mt-2 text-lg font-medium text-white">
                    {formatDate(content.lastReviewedAt)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {nextStatuses.map((status) => (
                  <Button
                    key={status}
                    variant="outline"
                    className="rounded-2xl border-white/12 bg-white/[0.03] text-white hover:bg-white/[0.08]"
                    onClick={() => handleStatusTransition(status)}
                  >
                    {status === "review"
                      ? "İncelemeye gönder"
                      : status === "approved"
                        ? "Onayla"
                        : status === "published"
                          ? "Yayına al"
                          : "Taslağa geri al"}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  className="rounded-2xl border-white/12 bg-white/[0.03] text-white hover:bg-white/[0.08]"
                  onClick={handleClearOverride}
                  disabled={!baseContent || JSON.stringify(baseContent) === JSON.stringify(content)}
                >
                  Override&apos;i temizle
                </Button>
              </div>

              {message ? <p className="text-sm text-white/58">{message}</p> : null}
            </CardContent>
          </Card>

          <ReviewLessonContentPreview content={content} />
        </div>

        <aside className="space-y-4">
          <Card className="surface-glow border-border bg-card backdrop-blur-xl">
            <CardContent className="space-y-4 px-5 py-5">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.18em] text-white/34">Review Controls</p>
                <p className="text-sm text-white/52">
                  Buradaki tüm değişiklikler ayrı editorial local store&apos;a yazılır.
                </p>
              </div>

              <label className="space-y-2">
                <span className="text-xs uppercase tracking-[0.18em] text-white/34">Reviewed By</span>
                <input
                  value={reviewedBy}
                  onChange={(event) => setReviewedBy(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none"
                  placeholder="Örnek: Manual editorial review"
                />
              </label>

              <div className="grid gap-3">
                <ReviewStatusField
                  label="Mathematical Accuracy"
                  value={review.mathematicalAccuracy}
                  onChange={(next) =>
                    setReview((current) => (current ? { ...current, mathematicalAccuracy: next } : current))
                  }
                />
                <ReviewStatusField
                  label="Pedagogy"
                  value={review.pedagogy}
                  onChange={(next) =>
                    setReview((current) => (current ? { ...current, pedagogy: next } : current))
                  }
                />
                <ReviewStatusField
                  label="Language"
                  value={review.language}
                  onChange={(next) =>
                    setReview((current) => (current ? { ...current, language: next } : current))
                  }
                />
                <ReviewStatusField
                  label="Technical"
                  value={review.technical}
                  onChange={(next) =>
                    setReview((current) => (current ? { ...current, technical: next } : current))
                  }
                />
              </div>

              <label className="space-y-2">
                <span className="text-xs uppercase tracking-[0.18em] text-white/34">Review Notes</span>
                <textarea
                  value={reviewNotesText}
                  onChange={(event) => setReviewNotesText(event.target.value)}
                  className="min-h-[140px] w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-white outline-none"
                  placeholder="Her satıra bir editorial not yaz."
                />
              </label>

              <Button
                className="w-full rounded-2xl bg-white text-zinc-950 hover:bg-zinc-200"
                onClick={handleSaveReview}
                disabled={!isDirty}
              >
                Review&apos;u kaydet
              </Button>
            </CardContent>
          </Card>

          <Card className="surface-glow border-border bg-card backdrop-blur-xl">
            <CardContent className="space-y-4 px-5 py-5">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.18em] text-white/34">Checklist</p>
                <p className="text-sm text-white/52">Bu maddeler otomatik matematik onayı vermez.</p>
              </div>

              <div className="space-y-4">
                {LESSON_EDITORIAL_CHECKLIST.map((section) => (
                  <div key={section.id} className="space-y-2">
                    <p className="text-sm font-medium text-white">{section.title}</p>
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <p key={item} className="text-sm text-white/54">
                          • {item}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="surface-glow border-border bg-card backdrop-blur-xl">
            <CardContent className="space-y-4 px-5 py-5">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.18em] text-white/34">Validation</p>
                <p className="text-sm text-white/52">
                  Bu uyarılar yapı ve referans kontrolüdür; matematiksel doğruluk yerine geçmez.
                </p>
              </div>
              <ReviewValidationList issues={validationIssues} />
            </CardContent>
          </Card>

          <Card className="surface-glow border-border bg-card backdrop-blur-xl">
            <CardContent className="space-y-3 px-5 py-5">
              <p className="text-xs uppercase tracking-[0.18em] text-white/34">Review Snapshot</p>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["Mathematical", review.mathematicalAccuracy],
                    ["Pedagogy", review.pedagogy],
                    ["Language", review.language],
                    ["Technical", review.technical],
                  ] as const
                ).map(([label, status]) => (
                  <Badge key={label} className={reviewBadgeClass(status)}>
                    {label}: {getReviewStatusLabel(status)}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
