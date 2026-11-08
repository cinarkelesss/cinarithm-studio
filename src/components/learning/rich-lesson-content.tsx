"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ChevronDown, ChevronUp, Lightbulb, Sigma } from "lucide-react";

import { useLearningWorkspace } from "@/components/providers/learning-workspace-provider";
import { learningCatalog } from "@/data/learning/curriculum";
import type { LearningCourse, LearningExercise } from "@/lib/learning/domain";
import type { LessonRichContent } from "@/lib/learning/lesson-content";
import {
  getExerciseAnswerModeLabel,
  getMasteryLevelLabel,
} from "@/lib/learning/ui-copy";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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
    `(${INLINE_FORMULAS.sort((left, right) => right.length - left.length)
      .map((formula) => escapeRegExp(formula))
      .join("|")})`,
    "g"
  );
  const tokens = paragraph.split(pattern);
  return tokens.filter(Boolean);
}

function FormulaParagraph({ paragraph }: { paragraph: string }) {
  return (
    <p className="text-sm leading-7 text-white/56">
      {splitFormulaParagraph(paragraph).map((token, index) => {
        const isFormula = INLINE_FORMULAS.includes(token);

        return isFormula ? (
          <MathInline key={`${token}-${index}`} expression={token} />
        ) : (
          <span key={`${token}-${index}`}>{token}</span>
        );
      })}
    </p>
  );
}

export function LessonStudyContentSection({
  content,
}: {
  content: LessonRichContent;
}) {
  const { getConceptMasteryValue } = useLearningWorkspace();

  const concepts = useMemo(
    () =>
      content.keyConcepts
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
        ),
    [content.keyConcepts]
  );

  return (
    <Card className="surface-glow border-border bg-card backdrop-blur-xl">
      <CardContent className="space-y-7 px-5 py-5 sm:px-6">
        <section className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-white/34">Çalışma Rehberi</p>
            <FormulaParagraph paragraph={content.intro} />
          </div>

          <div className="flex flex-wrap gap-2">
            {content.prerequisites.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/64 transition hover:bg-white/[0.06] hover:text-white"
              >
                {item.label}
              </Link>
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

        <section className="space-y-4 border-t border-white/8 pt-7">
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
                {content.example.contrast.map((step) => (
                  <FormulaParagraph key={step} paragraph={step} />
                ))}
              </div>
            </div>
            <p className="text-sm leading-7 text-white/48">{content.example.takeaway}</p>
          </div>
        </section>

        <section className="space-y-4 border-t border-white/8 pt-7">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.18em] text-white/34">Temel Kavramlar</p>
            <span className="text-xs text-white/34">{concepts.length} kavram</span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {concepts.map(({ concept, summary }) => {
              const mastery = getConceptMasteryValue(concept.id);

              return (
                <div
                  key={concept.id}
                  className="rounded-[20px] border border-white/8 bg-black/12 px-4 py-3.5"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/concepts?concept=${concept.slug}`}
                        className="inline-flex min-w-0 items-center gap-2 text-sm font-medium text-white transition hover:text-zinc-200"
                      >
                        <Sigma className="size-4 shrink-0" />
                        <span className="truncate">{concept.name}</span>
                      </Link>
                      <Badge className="shrink-0 bg-white/10 text-white/68">
                        {getMasteryLevelLabel(mastery.level)}
                      </Badge>
                    </div>

                    <FormulaParagraph paragraph={summary} />

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-white/34">
                        <span>Hakimiyet</span>
                        <span>{mastery.score}/100</span>
                      </div>
                      <Progress
                        value={mastery.score}
                        className="[&_[data-slot='progress-track']]:h-1.5 [&_[data-slot='progress-track']]:bg-white/8 [&_[data-slot='progress-indicator']]:bg-white"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}

function ExerciseFormatLabel({
  exercise,
}: {
  exercise: LearningExercise;
}) {
  return (
    <Badge className="bg-white/10 text-white/72">
      {getExerciseAnswerModeLabel(exercise.answerMode, exercise.format)}
    </Badge>
  );
}

export function LessonExercisesSection({
  course,
  exercises,
}: {
  course: LearningCourse;
  exercises: LearningExercise[];
}) {
  const { markExerciseComplete, state } = useLearningWorkspace();
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string>>({});
  const [draftAnswers, setDraftAnswers] = useState<Record<string, string>>({});
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(exercises[0]?.id ?? null);
  const [openHints, setOpenHints] = useState<Record<string, boolean>>({});
  const [openSolutions, setOpenSolutions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (activeExerciseId && exercises.some((exercise) => exercise.id === activeExerciseId)) {
      return;
    }

    setActiveExerciseId(exercises[0]?.id ?? null);
  }, [activeExerciseId, exercises]);

  if (exercises.length === 0) {
    return (
      <section className="space-y-2 px-1">
        <h2 className="font-heading text-2xl text-white">Alıştırmalar</h2>
        <p className="text-sm text-white/46">Bu ders için henüz alıştırma eklenmedi.</p>
      </section>
    );
  }

  return (
    <Card className="surface-glow border-border bg-card backdrop-blur-xl">
      <CardContent className="space-y-4 px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.18em] text-white/34">Alıştırmalar</p>
            <p className="text-sm leading-6 text-white/52">
              Yanıtını yaz ya da seç; ardından ilerlemeyi işaretle.
            </p>
          </div>
          <Badge className="bg-white/10 text-white/72">
            {Object.keys(state.exerciseProgress).filter((exerciseId) =>
              exercises.some((exercise) => exercise.id === exerciseId)
            ).length}
            /{exercises.length} tamamlandı
          </Badge>
        </div>

        <div className="space-y-3">
          {exercises.map((exercise, index) => {
            const completed = Boolean(state.exerciseProgress[exercise.id]);
            const isOpen = activeExerciseId === exercise.id;
            const hasAnswer =
              exercise.answerMode === "multiple_choice"
                ? Boolean(selectedChoices[exercise.id])
                : Boolean((draftAnswers[exercise.id] ?? "").trim());
            const concepts = exercise.conceptIds
              .map((conceptId) => learningCatalog.concepts.find((concept) => concept.id === conceptId))
              .filter((concept): concept is (typeof learningCatalog.concepts)[number] => Boolean(concept));

            return (
              <div
                key={exercise.id}
                className="overflow-hidden rounded-[22px] border border-white/8 bg-black/12"
              >
                <button
                  type="button"
                  onClick={() =>
                    setActiveExerciseId((current) => (current === exercise.id ? null : exercise.id))
                  }
                  className="flex w-full items-start justify-between gap-4 px-4 py-3.5 text-left transition hover:bg-white/[0.03]"
                  aria-expanded={isOpen}
                >
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="bg-white/10 text-white/72">Alıştırma {index + 1}</Badge>
                      <ExerciseFormatLabel exercise={exercise} />
                      {completed ? (
                        <Badge className="bg-zinc-300/14 text-zinc-200">Tamamlandı</Badge>
                      ) : hasAnswer ? (
                        <Badge className="bg-zinc-100/14 text-zinc-200">Yanıt hazır</Badge>
                      ) : null}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-medium text-white">{exercise.title}</h3>
                      <p className="text-sm leading-6 text-white/52">
                        {concepts.map((concept) => concept.name).join(" · ") || course.shortTitle}
                      </p>
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="mt-1 size-4 shrink-0 text-white/48" />
                  ) : (
                    <ChevronDown className="mt-1 size-4 shrink-0 text-white/48" />
                  )}
                </button>

                {isOpen ? (
                  <div className="space-y-4 border-t border-white/8 px-4 py-4">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <ExerciseFormatLabel exercise={exercise} />
                        <Badge className="bg-white/10 text-white/72">{course.shortTitle}</Badge>
                      </div>
                      <p className="whitespace-pre-line text-sm leading-7 text-white/56">
                        {exercise.prompt}
                      </p>
                    </div>

                    {exercise.answerMode === "multiple_choice" && exercise.choices ? (
                      <div className="space-y-2">
                        {exercise.choices.map((choice) => (
                          <button
                            key={choice.id}
                            type="button"
                            onClick={() =>
                              setSelectedChoices((current) => ({
                                ...current,
                                [exercise.id]: choice.id,
                              }))
                            }
                            className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition ${
                              selectedChoices[exercise.id] === choice.id
                                ? "border-white/18 bg-white/[0.07] text-white"
                                : "border-white/8 bg-white/[0.03] text-white/68 hover:bg-white/[0.05]"
                            }`}
                          >
                            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-white/12 text-[11px]">
                              {selectedChoices[exercise.id] === choice.id ? "●" : ""}
                            </span>
                            <span>{choice.text}</span>
                          </button>
                        ))}
                      </div>
                    ) : null}

                    {exercise.answerMode === "short_answer" || exercise.answerMode === "proof" ? (
                      <textarea
                        value={draftAnswers[exercise.id] ?? ""}
                        onChange={(event) =>
                          setDraftAnswers((current) => ({
                            ...current,
                            [exercise.id]: event.target.value,
                          }))
                        }
                        placeholder={exercise.placeholder ?? "Yanıtını buraya yaz."}
                        className={`w-full resize-none rounded-[22px] border border-white/8 bg-black/14 px-4 py-4 text-sm text-white outline-none placeholder:text-white/28 focus:border-white/14 ${
                          exercise.answerMode === "proof" ? "min-h-[180px]" : "min-h-[110px]"
                        }`}
                      />
                    ) : null}

                    {concepts.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {concepts.map((concept) => (
                          <Link
                            key={concept.id}
                            href={`/concepts?concept=${concept.slug}`}
                            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/66 transition hover:bg-white/[0.06] hover:text-white"
                          >
                            {concept.name}
                          </Link>
                        ))}
                      </div>
                    ) : null}

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={completed ? "outline" : "default"}
                        className={
                          completed
                            ? "rounded-2xl border-white/12 bg-white/[0.03] text-white"
                            : "rounded-2xl bg-white text-zinc-950 hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
                        }
                        onClick={() => markExerciseComplete(exercise.id)}
                        disabled={!completed && !hasAnswer}
                      >
                        {completed ? "Tamamlandı" : "Tamamlandı olarak işaretle"}
                      </Button>
                      {exercise.hint ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-2xl border-white/12 bg-white/[0.03] text-white hover:bg-white/[0.08]"
                          onClick={() =>
                            setOpenHints((current) => ({
                              ...current,
                              [exercise.id]: !current[exercise.id],
                            }))
                          }
                        >
                          <Lightbulb className="size-3.5" />
                          {openHints[exercise.id] ? "İpucunu gizle" : "İpucunu göster"}
                        </Button>
                      ) : null}
                      {exercise.solution ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-2xl border-white/12 bg-white/[0.03] text-white hover:bg-white/[0.08]"
                          onClick={() =>
                            setOpenSolutions((current) => ({
                              ...current,
                              [exercise.id]: !current[exercise.id],
                            }))
                          }
                        >
                          {openSolutions[exercise.id] ? "Çözümü gizle" : "Çözümü göster"}
                          {openSolutions[exercise.id] ? (
                            <ChevronUp className="size-3.5" />
                          ) : (
                            <ChevronDown className="size-3.5" />
                          )}
                        </Button>
                      ) : null}
                    </div>

                    {!hasAnswer && !completed ? (
                      <p className="text-xs text-white/42">
                        Bu alıştırmayı tamamlandı olarak işaretlemek için önce bir yanıt gir.
                      </p>
                    ) : null}

                    {openHints[exercise.id] && exercise.hint ? (
                      <div className="rounded-[20px] border border-zinc-100/10 bg-zinc-100/8 px-4 py-3 text-sm leading-7 text-white/72">
                        {exercise.hint}
                      </div>
                    ) : null}

                    {openSolutions[exercise.id] && exercise.solution ? (
                      <div className="rounded-[20px] border border-white/8 bg-white/[0.04] px-4 py-4 text-sm leading-7 text-white/74">
                        <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/38">
                          <CheckCircle2 className="size-3.5" />
                          Çözüm
                        </div>
                        <p className="whitespace-pre-line">{exercise.solution}</p>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
