import { learningCatalog } from "@/data/learning/curriculum";
import type { LearningCatalog } from "@/lib/learning/domain";
import type {
  ContentStatus,
  LessonContentReview,
  LessonContentReviewStatus,
  LessonRichContent,
} from "@/lib/learning/lesson-content";

export const CONTENT_STATUS_LABELS: Record<ContentStatus, string> = {
  draft: "Taslak",
  review: "İncelemede",
  approved: "Onaylandı",
  published: "Yayında",
};

export const REVIEW_STATUS_LABELS: Record<LessonContentReviewStatus, string> = {
  pending: "Bekliyor",
  pass: "Geçti",
  needs_changes: "Düzenleme gerekli",
};

const STATUS_TRANSITIONS: Record<ContentStatus, ContentStatus[]> = {
  draft: ["review"],
  review: ["draft", "approved"],
  approved: ["review", "published"],
  published: ["review"],
};

export const LESSON_EDITORIAL_CHECKLIST = [
  {
    id: "mathematical-accuracy",
    title: "Mathematical Accuracy",
    items: [
      "Tanımlar doğru mu?",
      "Notasyon tutarlı mı?",
      "Örnekler ve karşı örnekler geçerli mi?",
      "Çözümler ve ispatlar yeterince sağlam mı?",
    ],
  },
  {
    id: "pedagogy",
    title: "Pedagogy",
    items: [
      "İlerleme dersi takip ediyor mu?",
      "Seviye ders bağlamına uyuyor mu?",
      "Alıştırmalar kademeli olarak zorlaşıyor mu?",
      "İpuçları öğretici mi?",
    ],
  },
  {
    id: "scope",
    title: "Scope",
    items: [
      "İçerik dersin konusuna sadık mı?",
      "İlgisiz teorem yığını var mı?",
      "Sahte transcript veya hoca atfı var mı?",
    ],
  },
  {
    id: "language",
    title: "Language",
    items: [
      "Türkçe doğal mı?",
      "Terminoloji tutarlı mı?",
      "Evrensel matematik notasyonu korunuyor mu?",
    ],
  },
  {
    id: "technical",
    title: "Technical",
    items: [
      "Kavram ve alıştırma ID'leri stabil mi?",
      "Referans verilen kavramlar var mı?",
      "Renderer notasyonu sağlam gösteriyor mu?",
      "Yineleyen varlıklar var mı?",
    ],
  },
] as const;

export const TURKISH_MATH_TERMINOLOGY = [
  { source: "bounded above", target: "üstten sınırlı" },
  { source: "bounded below", target: "alttan sınırlı" },
  { source: "upper bound", target: "üst sınır" },
  { source: "lower bound", target: "alt sınır" },
  { source: "least upper bound", target: "en küçük üst sınır" },
  { source: "greatest lower bound", target: "en büyük alt sınır" },
  { source: "sequence", target: "dizi" },
  { source: "subsequence", target: "alt dizi" },
  { source: "limit", target: "limit" },
  { source: "accumulation point", target: "yoğunlaşma noktası" },
  { source: "continuous", target: "sürekli" },
  { source: "uniformly continuous", target: "düzgün sürekli" },
  { source: "derivative", target: "türev" },
] as const;

export const REAL_ANALYSIS_DRAFT_BATCH_LESSON_IDS = [
  "lesson-real-analysis-ordered-field-structure",
  "lesson-real-analysis-supremum-and-infimum",
  "lesson-real-analysis-archimedean-property",
  "lesson-real-analysis-gercel-sayilarda-ninci-kok",
  "lesson-real-analysis-limit-introduction-and-accumulation-point",
  "lesson-real-analysis-limits-of-functions",
  "lesson-real-analysis-ustel-fonksiyonlar-ve-limitleri",
  "lesson-real-analysis-uniform-continuity-2",
  "lesson-real-analysis-logaritma-limit-ve-lhospital",
] as const;

export type LessonContentEditorialOverride = {
  status?: ContentStatus;
  version?: number;
  review?: LessonContentReview;
  reviewNotes?: string[];
  lastReviewedAt?: string;
  reviewedBy?: string;
};

export type LessonContentValidationIssue = {
  lessonId: string;
  severity: "warning" | "error";
  message: string;
};

export function createPendingLessonReview(notes: string[] = []): LessonContentReview {
  return {
    mathematicalAccuracy: "pending",
    pedagogy: "pending",
    language: "pending",
    technical: "pending",
    notes,
  };
}

export function createValidatedLessonReview(notes: string[] = []): LessonContentReview {
  return {
    mathematicalAccuracy: "pass",
    pedagogy: "pass",
    language: "pass",
    technical: "pass",
    notes,
  };
}

export function getContentStatusLabel(status: ContentStatus) {
  return CONTENT_STATUS_LABELS[status];
}

export function getReviewStatusLabel(status: LessonContentReviewStatus) {
  return REVIEW_STATUS_LABELS[status];
}

export function getAllowedContentStatusTransitions(status: ContentStatus) {
  return STATUS_TRANSITIONS[status];
}

export function canTransitionContentStatus(from: ContentStatus, to: ContentStatus) {
  return STATUS_TRANSITIONS[from].includes(to);
}

export function mergeLessonContentWithOverride(
  content: LessonRichContent,
  override?: LessonContentEditorialOverride
) {
  if (!override) {
    return content;
  }

  return {
    ...content,
    status: override.status ?? content.status,
    version: override.version ?? content.version,
    review: override.review ?? content.review,
    reviewNotes: override.reviewNotes ?? content.reviewNotes,
    lastReviewedAt: override.lastReviewedAt ?? content.lastReviewedAt,
    reviewedBy: override.reviewedBy ?? content.reviewedBy,
  };
}

function normalizeConceptName(value: string) {
  return value
    .normalize("NFKD")
    .toLocaleLowerCase("tr-TR")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function findPotentialConceptNameDuplicates(
  catalog: LearningCatalog = learningCatalog
) {
  const buckets = new Map<string, typeof catalog.concepts>();

  catalog.concepts.forEach((concept) => {
    const key = normalizeConceptName(concept.name);
    const existing = buckets.get(key) ?? [];
    existing.push(concept);
    buckets.set(key, existing);
  });

  return [...buckets.values()].filter((group) => group.length > 1);
}

export function validateLessonRichContentEntries(
  entries: LessonRichContent[],
  catalog: LearningCatalog = learningCatalog
) {
  const issues: LessonContentValidationIssue[] = [];
  const lessonIds = new Set(catalog.lessons.map((lesson) => lesson.id));
  const conceptIds = new Set(catalog.concepts.map((concept) => concept.id));
  const exerciseIds = new Set(catalog.exercises.map((exercise) => exercise.id));
  const lessonExerciseMap = new Map(
    catalog.lessons.map((lesson) => [lesson.id, new Set(lesson.exerciseIds)])
  );

  entries.forEach((entry) => {
    if (!lessonIds.has(entry.lessonId)) {
      issues.push({
        lessonId: entry.lessonId,
        severity: "error",
        message: "lessonId katalogda bulunamadi.",
      });
    }

    if (entry.studyGuide.length === 0) {
      issues.push({
        lessonId: entry.lessonId,
        severity: "error",
        message: "Çalışma rehberi boş bırakılmış.",
      });
    }

    if (entry.keyConcepts.length === 0) {
      issues.push({
        lessonId: entry.lessonId,
        severity: "error",
        message: "Temel kavramlar bos birakilmis.",
      });
    }

    const duplicatedContentConceptIds = entry.conceptIds.filter(
      (conceptId, index) => entry.conceptIds.indexOf(conceptId) !== index
    );
    if (duplicatedContentConceptIds.length > 0) {
      issues.push({
        lessonId: entry.lessonId,
        severity: "warning",
        message: `Yineleyen conceptId bulundu: ${duplicatedContentConceptIds.join(", ")}`,
      });
    }

    entry.conceptIds.forEach((conceptId) => {
      if (!conceptIds.has(conceptId)) {
        issues.push({
          lessonId: entry.lessonId,
          severity: "error",
          message: `Gecersiz conceptId: ${conceptId}`,
        });
      }
    });

    const keyConceptIds = entry.keyConcepts.map((item) => item.conceptId);
    if (keyConceptIds.length !== entry.conceptIds.length) {
      issues.push({
        lessonId: entry.lessonId,
        severity: "warning",
        message: "conceptIds ile keyConcepts sayisi bire bir eslesmiyor.",
      });
    }

    entry.exerciseIds.forEach((exerciseId) => {
      if (!exerciseIds.has(exerciseId)) {
        issues.push({
          lessonId: entry.lessonId,
          severity: "error",
          message: `Gecersiz exerciseId: ${exerciseId}`,
        });
      }

      if (!lessonExerciseMap.get(entry.lessonId)?.has(exerciseId)) {
        issues.push({
          lessonId: entry.lessonId,
          severity: "warning",
          message: `exerciseId lesson.exerciseIds ile eslesmiyor: ${exerciseId}`,
        });
      }
    });

    const duplicateExerciseIds = entry.exerciseIds.filter(
      (exerciseId, index) => entry.exerciseIds.indexOf(exerciseId) !== index
    );
    if (duplicateExerciseIds.length > 0) {
      issues.push({
        lessonId: entry.lessonId,
        severity: "error",
        message: `Yineleyen exerciseId bulundu: ${duplicateExerciseIds.join(", ")}`,
      });
    }

    catalog.exercises
      .filter((exercise) => entry.exerciseIds.includes(exercise.id))
      .forEach((exercise) => {
        exercise.conceptIds.forEach((conceptId) => {
          if (!conceptIds.has(conceptId)) {
            issues.push({
              lessonId: entry.lessonId,
              severity: "error",
              message: `Alistirma gecersiz conceptId kullaniyor: ${exercise.id} -> ${conceptId}`,
            });
          }
        });

        if (exercise.answerMode === "proof" && (!exercise.hint || !exercise.solution)) {
          issues.push({
            lessonId: entry.lessonId,
            severity: "warning",
            message: `Proof alıştırmasında ipucu veya çözüm eksik: ${exercise.id}`,
          });
        }
      });
  });

  return {
    issues,
    conceptDuplicateCandidates: findPotentialConceptNameDuplicates(catalog),
  };
}

export function buildLessonContentReviewSummary(content: LessonRichContent) {
  const lesson = learningCatalog.lessons.find((item) => item.id === content.lessonId);
  const course = lesson
    ? learningCatalog.courses.find((item) => item.id === lesson.courseId)
    : null;
  const lessonModule = lesson
    ? learningCatalog.modules.find((item) => item.id === lesson.moduleId)
    : null;
  const exercises = learningCatalog.exercises.filter((exercise) =>
    content.exerciseIds.includes(exercise.id)
  );

  return {
    lessonId: content.lessonId,
    lessonTitle: lesson?.title ?? content.lessonSlug,
    courseTitle: course?.title ?? content.courseSlug,
    moduleTitle: lessonModule?.title ?? "-",
    status: content.status,
    version: content.version,
    conceptIdsReused: content.conceptIds.filter(
      (conceptId) => !content.introducedConceptIds?.includes(conceptId)
    ),
    newConceptIds: content.introducedConceptIds ?? [],
    exerciseCount: exercises.length,
    proofExerciseCount: exercises.filter((exercise) => exercise.answerMode === "proof").length,
    knownConcerns: [...(content.reviewNotes ?? []), ...content.review.notes],
    mathematicalReviewStatus: content.review.mathematicalAccuracy,
    languageReviewStatus: content.review.language,
  };
}
