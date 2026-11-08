import type {
  ExerciseAnswerMode,
  ExerciseFormat,
  LessonReadinessState,
  LessonStatus,
  MasteryLevel,
} from "@/lib/learning/domain";

export function getLessonStatusLabel(status: LessonStatus) {
  switch (status) {
    case "completed":
      return "Tamamlandı";
    case "in_progress":
      return "Devam Ediyor";
    default:
      return "Başlanmadı";
  }
}

export function getMasteryLevelLabel(level: MasteryLevel) {
  switch (level) {
    case "learning":
      return "Öğreniliyor";
    case "familiar":
      return "Gelişiyor";
    case "mastered":
      return "Hakim";
    default:
      return "Başlanmadı";
  }
}

export function getExerciseFormatLabel(format: ExerciseFormat) {
  switch (format) {
    case "proof":
      return "İspat";
    case "reflection":
      return "Yorum";
    case "computation":
      return "Hesaplama";
    default:
      return "Okuma";
  }
}

export function getExerciseAnswerModeLabel(
  answerMode?: ExerciseAnswerMode,
  format?: ExerciseFormat
) {
  if (answerMode === "multiple_choice") {
    return "Çoktan Seçmeli";
  }

  if (answerMode === "short_answer") {
    return "Kısa Yanıt";
  }

  if (answerMode === "proof") {
    return "İspat";
  }

  return format ? getExerciseFormatLabel(format) : "Alıştırma";
}

export function getCourseProgressStatusLabel(
  progressPercent: number,
  completed: number,
  total: number
) {
  if (total > 0 && completed === total) {
    return "Tamamlandı";
  }

  if (progressPercent > 0) {
    return "Devam Ediyor";
  }

  return "Başlanmadı";
}

export function getLessonReadinessLabel(readiness: LessonReadinessState) {
  switch (readiness) {
    case "completed":
      return "Tamamlandı";
    case "recommended":
      return "Sıradaki";
    case "ready":
      return "Hazır";
    default:
      return "Önkoşul öneriliyor";
  }
}
