import { getBaseLessonRichContentByLessonId } from "@/data/learning/content";
import { learningPaths } from "@/data/learning/paths";
import { learningCatalogIndex } from "@/lib/learning/catalog";
import {
  mergeLessonContentWithOverride,
  type LessonContentEditorialOverride,
} from "@/lib/learning/editorial";
import {
  getCourseRecommendation,
  getLearningPathForCourse,
  getLessonPathPosition,
  getPathProgress,
} from "@/lib/learning/paths";
import type {
  LearningCourse,
  LearningLesson,
  LearningPathStage,
  LearningWorkspaceState,
  LessonStatus,
} from "@/lib/learning/domain";

export type StudySessionStatus = "not_started" | "active" | "completed";

export type StudySessionPlanStep = {
  key: "lesson" | "notes" | "exercises" | "completion";
  label: string;
  detail?: string;
  optional?: boolean;
  completed: boolean;
};

export type StudySessionPlan = {
  lesson: LearningLesson;
  status: StudySessionStatus;
  noteExists: boolean;
  noteWordCount: number;
  visibleExerciseIds: string[];
  exerciseTarget: number;
  completedExerciseCount: number;
  exerciseTargetReached: boolean;
  steps: StudySessionPlanStep[];
};

export type StudySessionProgress = {
  completedSteps: number;
  totalSteps: number;
};

export type CurrentStudySession = {
  course: LearningCourse;
  lesson: LearningLesson | null;
  stage: LearningPathStage | null;
  position: number | null;
  totalLessons: number;
  pathProgress: ReturnType<typeof getPathProgress>;
  status: StudySessionStatus | "course_completed";
  recommendationKind: "continue_in_progress" | "recommended" | "course_completed";
  explanation: string;
  plan: StudySessionPlan | null;
  progress: StudySessionProgress | null;
};

type EditorialOverrideMap = Readonly<
  Record<string, LessonContentEditorialOverride | undefined>
>;

const exerciseIdSet = new Set(
  learningCatalogIndex.catalog.exercises.map((exercise) => exercise.id)
);

function getStudySessionStatus(status: LessonStatus): StudySessionStatus {
  switch (status) {
    case "in_progress":
      return "active";
    case "completed":
      return "completed";
    default:
      return "not_started";
  }
}

function getPublishedLessonExerciseIds(
  lesson: LearningLesson,
  editorialOverrides: EditorialOverrideMap = {}
) {
  const baseContent = getBaseLessonRichContentByLessonId(lesson.id);
  if (!baseContent) {
    return [];
  }

  const resolvedContent = mergeLessonContentWithOverride(
    baseContent,
    editorialOverrides[lesson.id]
  );

  if (resolvedContent.status !== "published") {
    return [];
  }

  const lessonExerciseIds = new Set(lesson.exerciseIds);
  return resolvedContent.exerciseIds.filter(
    (exerciseId) => lessonExerciseIds.has(exerciseId) && exerciseIdSet.has(exerciseId)
  );
}

function getExerciseTarget(exerciseCount: number) {
  if (exerciseCount <= 0) {
    return 0;
  }

  if (exerciseCount <= 2) {
    return exerciseCount;
  }

  return 2;
}

function countNoteWords(value: string | undefined) {
  return (value ?? "").trim().split(/\s+/).filter(Boolean).length;
}

export function getStudySessionPlan(
  state: LearningWorkspaceState,
  lessonId: string,
  editorialOverrides: EditorialOverrideMap = {}
): StudySessionPlan | null {
  const lesson = learningCatalogIndex.lessonMap.get(lessonId);
  if (!lesson) {
    return null;
  }

  const lessonStatus = state.lessonProgress[lessonId]?.status ?? "not_started";
  const status = getStudySessionStatus(lessonStatus);
  const noteContent = state.lessonNotes[lessonId]?.content;
  const noteWordCount = countNoteWords(noteContent);
  const noteExists = noteWordCount > 0;
  const visibleExerciseIds = getPublishedLessonExerciseIds(lesson, editorialOverrides);
  const exerciseTarget = getExerciseTarget(visibleExerciseIds.length);
  const completedExerciseCount = visibleExerciseIds.filter(
    (exerciseId) => Boolean(state.exerciseProgress[exerciseId])
  ).length;
  const exerciseTargetReached =
    exerciseTarget > 0 && completedExerciseCount >= exerciseTarget;

  const steps: StudySessionPlanStep[] = [
    {
      key: "lesson",
      label: "Dersi aç",
      completed: status !== "not_started",
    },
    {
      key: "notes",
      label: "Not al",
      detail: "İsteğe bağlı",
      optional: true,
      completed: noteExists,
    },
  ];

  if (exerciseTarget > 0) {
    steps.push({
      key: "exercises",
      label: `${Math.min(completedExerciseCount, exerciseTarget)} / ${exerciseTarget} alıştırma`,
      completed: exerciseTargetReached,
    });
  }

  steps.push({
    key: "completion",
    label: "Dersi tamamla",
    completed: status === "completed",
  });

  return {
    lesson,
    status,
    noteExists,
    noteWordCount,
    visibleExerciseIds,
    exerciseTarget,
    completedExerciseCount,
    exerciseTargetReached,
    steps,
  };
}

export function getStudySessionProgress(
  state: LearningWorkspaceState,
  lessonId: string,
  editorialOverrides: EditorialOverrideMap = {}
): StudySessionProgress | null {
  const plan = getStudySessionPlan(state, lessonId, editorialOverrides);
  if (!plan) {
    return null;
  }

  return {
    completedSteps: plan.steps.filter((step) => step.completed).length,
    totalSteps: plan.steps.length,
  };
}

export function getCurrentStudySession(
  state: LearningWorkspaceState,
  options?: {
    courseId?: string;
    editorialOverrides?: EditorialOverrideMap;
  }
): CurrentStudySession | null {
  const editorialOverrides = options?.editorialOverrides ?? {};
  const pathCourseIds = options?.courseId
    ? [options.courseId]
    : learningPaths.map((path) => path.courseId);

  const candidates = pathCourseIds
    .map((courseId) => {
      const course = learningCatalogIndex.courseMap.get(courseId);
      const path = getLearningPathForCourse(courseId);
      if (!course || !path) {
        return null;
      }

      return {
        course,
        recommendation: getCourseRecommendation(state, courseId),
        pathProgress: getPathProgress(state, courseId),
      };
    })
    .filter((candidate): candidate is NonNullable<typeof candidate> => Boolean(candidate));

  if (candidates.length === 0) {
    return null;
  }

  const activeCandidate =
    candidates.find(
      (candidate) =>
        candidate.recommendation.kind === "continue_in_progress" &&
        candidate.recommendation.lesson
    ) ??
    candidates.find(
      (candidate) =>
        candidate.recommendation.kind !== "course_completed" &&
        candidate.recommendation.lesson
    ) ??
    candidates[0];

  const lesson = activeCandidate.recommendation.lesson;
  const plan = lesson
    ? getStudySessionPlan(state, lesson.id, editorialOverrides)
    : null;
  const progress = lesson
    ? getStudySessionProgress(state, lesson.id, editorialOverrides)
    : null;
  const lessonPosition = lesson ? getLessonPathPosition(lesson.id) : null;

  return {
    course: activeCandidate.course,
    lesson,
    stage: lessonPosition?.stage ?? null,
    position: lessonPosition?.position ?? null,
    totalLessons: lessonPosition?.total ?? activeCandidate.pathProgress.total,
    pathProgress: activeCandidate.pathProgress,
    status: lesson
      ? getStudySessionStatus(state.lessonProgress[lesson.id]?.status ?? "not_started")
      : "course_completed",
    recommendationKind: activeCandidate.recommendation.kind,
    explanation: activeCandidate.recommendation.explanation,
    plan,
    progress,
  };
}
