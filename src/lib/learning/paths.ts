import { learningPaths } from "@/data/learning/paths";
import { learningCatalog } from "@/data/learning/curriculum";
import type {
  LearningLesson,
  LearningPath,
  LearningPathStage,
  LearningWorkspaceState,
  LessonPathMetadata,
  LessonReadinessState,
  LessonStatus,
} from "@/lib/learning/domain";

type LearningPathIndex = {
  path: LearningPath;
  lessonIds: string[];
  metadataByLessonId: Map<string, LessonPathMetadata>;
  stageByLessonId: Map<string, LearningPathStage>;
  positionByLessonId: Map<string, number>;
};

type LearningPathValidationIssue = {
  pathId: string;
  message: string;
};

export type LessonReadinessSummary = {
  lesson: LearningLesson;
  path: LearningPath;
  stage: LearningPathStage;
  position: number;
  totalLessons: number;
  readiness: LessonReadinessState;
  prerequisiteLessons: LearningLesson[];
  completedPrerequisiteLessons: LearningLesson[];
  missingPrerequisiteLessons: LearningLesson[];
  explanation: string;
};

export type LearningPathRecommendation = {
  lesson: LearningLesson | null;
  explanation: string;
  kind: "continue_in_progress" | "recommended" | "course_completed";
};

type LearningPathProgressSummary = {
  completed: number;
  total: number;
  progressPercent: number;
  isComplete: boolean;
};

const lessonMap = new Map(learningCatalog.lessons.map((lesson) => [lesson.id, lesson]));
const courseMap = new Map(learningCatalog.courses.map((course) => [course.id, course]));

function getLessonStatus(state: LearningWorkspaceState, lessonId: string): LessonStatus {
  return state.lessonProgress[lessonId]?.status ?? "not_started";
}

function getCourseLessonsSorted(courseId: string) {
  return learningCatalog.lessons
    .filter((lesson) => lesson.courseId === courseId)
    .sort((left, right) => left.curriculumOrder - right.curriculumOrder);
}

function isUnlockedByCurriculum(
  state: LearningWorkspaceState,
  lesson: LearningLesson
) {
  if (lesson.prerequisites.length === 0) {
    return true;
  }

  return lesson.prerequisites.every(
    (prerequisiteId) => getLessonStatus(state, prerequisiteId) === "completed"
  );
}

function getMostRecentInProgressLesson(
  state: LearningWorkspaceState,
  lessonIds: string[]
) {
  const records = lessonIds
    .map((lessonId) => state.lessonProgress[lessonId])
    .filter((record): record is NonNullable<typeof record> => Boolean(record))
    .filter((record) => record.status === "in_progress")
    .sort((left, right) => right.lastVisitedAt.localeCompare(left.lastVisitedAt));

  return records[0] ? lessonMap.get(records[0].lessonId) ?? null : null;
}

function buildPathIndex(path: LearningPath): LearningPathIndex {
  const lessonIds = path.stages.flatMap((stage) => stage.lessonIds);
  const metadataByLessonId = new Map(
    path.lessonMetadata.map((metadata) => [metadata.lessonId, metadata])
  );
  const stageByLessonId = new Map<string, LearningPathStage>();
  const positionByLessonId = new Map<string, number>();

  lessonIds.forEach((lessonId, index) => {
    positionByLessonId.set(lessonId, index + 1);
  });

  path.stages.forEach((stage) => {
    stage.lessonIds.forEach((lessonId) => {
      stageByLessonId.set(lessonId, stage);
    });
  });

  return {
    path,
    lessonIds,
    metadataByLessonId,
    stageByLessonId,
    positionByLessonId,
  };
}

function validateLearningPath(path: LearningPath): LearningPathValidationIssue[] {
  const issues: LearningPathValidationIssue[] = [];
  const index = buildPathIndex(path);
  const seenLessonIds = new Set<string>();
  const duplicateLessonIds = new Set<string>();

  index.lessonIds.forEach((lessonId) => {
    if (seenLessonIds.has(lessonId)) {
      duplicateLessonIds.add(lessonId);
    }
    seenLessonIds.add(lessonId);
  });

  duplicateLessonIds.forEach((lessonId) => {
    issues.push({
      pathId: path.id,
      message: `duplicate lesson in stages: ${lessonId}`,
    });
  });

  const metadataLessonIds = new Set(path.lessonMetadata.map((metadata) => metadata.lessonId));
  const metadataDuplicates = new Set<string>();
  path.lessonMetadata.forEach((metadata, indexValue) => {
    if (
      path.lessonMetadata.findIndex((entry) => entry.lessonId === metadata.lessonId) !== indexValue
    ) {
      metadataDuplicates.add(metadata.lessonId);
    }
  });

  metadataDuplicates.forEach((lessonId) => {
    issues.push({
      pathId: path.id,
      message: `duplicate metadata entry: ${lessonId}`,
    });
  });

  index.lessonIds.forEach((lessonId) => {
    const lesson = lessonMap.get(lessonId);
    if (!lesson) {
      issues.push({
        pathId: path.id,
        message: `missing lesson: ${lessonId}`,
      });
      return;
    }

    if (lesson.courseId !== path.courseId) {
      issues.push({
        pathId: path.id,
        message: `lesson belongs to a different course: ${lessonId}`,
      });
    }

    if (!metadataLessonIds.has(lessonId)) {
      issues.push({
        pathId: path.id,
        message: `missing metadata for lesson: ${lessonId}`,
      });
    }
  });

  path.lessonMetadata.forEach((metadata) => {
    if (!index.positionByLessonId.has(metadata.lessonId)) {
      issues.push({
        pathId: path.id,
        message: `metadata lesson not staged: ${metadata.lessonId}`,
      });
    }

    const prerequisiteLessonIds = metadata.prerequisiteLessonIds ?? [];
    prerequisiteLessonIds.forEach((prerequisiteId) => {
      if (prerequisiteId === metadata.lessonId) {
        issues.push({
          pathId: path.id,
          message: `self prerequisite: ${metadata.lessonId}`,
        });
      }

      if (!index.positionByLessonId.has(prerequisiteId)) {
        issues.push({
          pathId: path.id,
          message: `unknown prerequisite ${prerequisiteId} for ${metadata.lessonId}`,
        });
      }

      const prerequisitePosition = index.positionByLessonId.get(prerequisiteId);
      const lessonPosition = index.positionByLessonId.get(metadata.lessonId);
      if (
        prerequisitePosition &&
        lessonPosition &&
        prerequisitePosition >= lessonPosition
      ) {
        issues.push({
          pathId: path.id,
          message: `non-backward prerequisite ${prerequisiteId} -> ${metadata.lessonId}`,
        });
      }
    });
  });

  const visiting = new Set<string>();
  const visited = new Set<string>();

  function visit(lessonId: string) {
    if (visited.has(lessonId)) {
      return;
    }

    if (visiting.has(lessonId)) {
      issues.push({
        pathId: path.id,
        message: `prerequisite cycle detected at ${lessonId}`,
      });
      return;
    }

    visiting.add(lessonId);
    const metadata = index.metadataByLessonId.get(lessonId);
    (metadata?.prerequisiteLessonIds ?? []).forEach((prerequisiteId) => {
      if (index.metadataByLessonId.has(prerequisiteId)) {
        visit(prerequisiteId);
      }
    });
    visiting.delete(lessonId);
    visited.add(lessonId);
  }

  index.lessonIds.forEach((lessonId) => visit(lessonId));

  return issues;
}

const pathIndexes = learningPaths.map(buildPathIndex);
const learningPathIndexById = new Map(pathIndexes.map((index) => [index.path.id, index]));
const learningPathByCourseId = new Map(pathIndexes.map((index) => [index.path.courseId, index]));
const validationIssues = learningPaths.flatMap((path) => validateLearningPath(path));

if (validationIssues.length > 0) {
  throw new Error(
    validationIssues
      .map((issue) => `[learning-path] ${issue.pathId}: ${issue.message}`)
      .join("\n")
  );
}

function getPathIndexForCourse(courseId: string) {
  return learningPathByCourseId.get(courseId) ?? null;
}

function getPathMetadata(courseId: string, lessonId: string) {
  return getPathIndexForCourse(courseId)?.metadataByLessonId.get(lessonId) ?? null;
}

function getFallbackRecommendedLesson(
  state: LearningWorkspaceState,
  courseId?: string
) {
  const scopedLessons = courseId
    ? getCourseLessonsSorted(courseId)
    : learningCatalog.lessons
        .slice()
        .sort((left, right) => left.curriculumOrder - right.curriculumOrder);

  if (state.lastLessonId) {
    const lastLesson = scopedLessons.find((lesson) => lesson.id === state.lastLessonId);
    if (lastLesson) {
      if (getLessonStatus(state, lastLesson.id) !== "completed") {
        return lastLesson;
      }

      const currentIndex = scopedLessons.findIndex((lesson) => lesson.id === lastLesson.id);
      const nextIncomplete = scopedLessons.slice(currentIndex + 1).find(
        (lesson) =>
          getLessonStatus(state, lesson.id) !== "completed" &&
          isUnlockedByCurriculum(state, lesson)
      );
      if (nextIncomplete) {
        return nextIncomplete;
      }
    }
  }

  const inProgress = getMostRecentInProgressLesson(
    state,
    scopedLessons.map((lesson) => lesson.id)
  );
  if (inProgress) {
    return inProgress;
  }

  const incompleteLessons = scopedLessons.filter(
    (lesson) => getLessonStatus(state, lesson.id) !== "completed"
  );
  return incompleteLessons.find((lesson) => isUnlockedByCurriculum(state, lesson)) ??
    incompleteLessons[0] ??
    null;
}

function buildReadyExplanation(
  lesson: LearningLesson,
  position: number,
  prerequisiteLessons: LearningLesson[],
  completedPrerequisiteLessons: LearningLesson[],
  kind: "recommended" | "ready"
) {
  if (kind === "recommended" && position === 1) {
    return "Öğrenme yoluna başlamak için uygun ilk ders bu.";
  }

  if (completedPrerequisiteLessons.length === 1) {
    return `${completedPrerequisiteLessons[0].title} dersini tamamladığın için bu derse hazırsın.`;
  }

  if (completedPrerequisiteLessons.length > 1) {
    return "Önkoşul derslerini tamamladığın için bu derse hazırsın.";
  }

  if (prerequisiteLessons.length > 0) {
    return "Önerilen önkoşulları tamamladığında bu ders daha akıcı ilerler.";
  }

  return kind === "recommended"
    ? "Öğrenme yolundaki sıradaki doğal adım bu ders."
    : "Bu derse hazırsın.";
}

function buildNeedsPrerequisiteExplanation(missingLessons: LearningLesson[]) {
  if (missingLessons.length === 0) {
    return "Bu derse hazırsın.";
  }

  if (missingLessons.length === 1) {
    return `Bu dersten önce ${missingLessons[0].title} dersini çalışman önerilir.`;
  }

  return `Bu dersten önce ${missingLessons.length} dersi çalışman önerilir.`;
}

export function getLearningPathForCourse(courseId: string) {
  return getPathIndexForCourse(courseId)?.path ?? null;
}

export function getLearningPathStages(courseId: string) {
  return getPathIndexForCourse(courseId)?.path.stages ?? [];
}

export function getPathLessonOrder(courseId: string) {
  return getPathIndexForCourse(courseId)?.lessonIds ?? [];
}

export function getLessonPathPosition(lessonId: string) {
  const lesson = lessonMap.get(lessonId);
  if (!lesson) {
    return null;
  }

  const pathIndex = getPathIndexForCourse(lesson.courseId);
  if (!pathIndex) {
    return null;
  }

  const position = pathIndex.positionByLessonId.get(lessonId);
  if (!position) {
    return null;
  }

  return {
    position,
    total: pathIndex.lessonIds.length,
    stage: pathIndex.stageByLessonId.get(lessonId) ?? null,
  };
}

export function getLessonPrerequisites(lessonId: string) {
  const lesson = lessonMap.get(lessonId);
  if (!lesson) {
    return [];
  }

  const metadata = getPathMetadata(lesson.courseId, lessonId);
  return (metadata?.prerequisiteLessonIds ?? [])
    .map((prerequisiteId) => lessonMap.get(prerequisiteId))
    .filter((entry): entry is LearningLesson => Boolean(entry));
}

export function getPathProgress(
  state: LearningWorkspaceState,
  courseId: string
): LearningPathProgressSummary {
  const lessonIds = getPathLessonOrder(courseId);
  const total = lessonIds.length;
  const completed = lessonIds.filter(
    (lessonId) => getLessonStatus(state, lessonId) === "completed"
  ).length;

  return {
    completed,
    total,
    progressPercent: total === 0 ? 0 : Math.round((completed / total) * 100),
    isComplete: total > 0 && completed === total,
  };
}

export function getStageProgress(
  state: LearningWorkspaceState,
  stageId: string
) {
  const stage = pathIndexes
    .flatMap((index) => index.path.stages)
    .find((entry) => entry.id === stageId);

  if (!stage) {
    return {
      completed: 0,
      total: 0,
      progressPercent: 0,
    };
  }

  const completed = stage.lessonIds.filter(
    (lessonId) => getLessonStatus(state, lessonId) === "completed"
  ).length;

  return {
    completed,
    total: stage.lessonIds.length,
    progressPercent:
      stage.lessonIds.length === 0
        ? 0
        : Math.round((completed / stage.lessonIds.length) * 100),
  };
}

export function getRecommendedNextLesson(
  state: LearningWorkspaceState,
  courseId?: string
) {
  if (!courseId) {
    if (state.lastLessonId) {
      const lastLesson = lessonMap.get(state.lastLessonId);
      if (lastLesson) {
        return getRecommendedNextLesson(state, lastLesson.courseId);
      }
    }

    const mostRecentInProgress = Object.values(state.lessonProgress)
      .filter((record) => record.status === "in_progress")
      .sort((left, right) => right.lastVisitedAt.localeCompare(left.lastVisitedAt))[0];

    if (mostRecentInProgress) {
      const inProgressLesson = lessonMap.get(mostRecentInProgress.lessonId);
      if (inProgressLesson) {
        return getRecommendedNextLesson(state, inProgressLesson.courseId);
      }
    }

    return getFallbackRecommendedLesson(state);
  }

  const pathIndex = getPathIndexForCourse(courseId);
  if (!pathIndex) {
    return getFallbackRecommendedLesson(state, courseId);
  }

  if (
    state.lastLessonId &&
    pathIndex.positionByLessonId.has(state.lastLessonId) &&
    getLessonStatus(state, state.lastLessonId) === "in_progress"
  ) {
    return lessonMap.get(state.lastLessonId) ?? null;
  }

  const inProgress = getMostRecentInProgressLesson(state, pathIndex.lessonIds);
  if (inProgress) {
    return inProgress;
  }

  const firstReadyIncomplete = pathIndex.lessonIds.find((lessonId) => {
    if (getLessonStatus(state, lessonId) === "completed") {
      return false;
    }

    const prerequisites = getPathMetadata(courseId, lessonId)?.prerequisiteLessonIds ?? [];
    return prerequisites.every(
      (prerequisiteId) => getLessonStatus(state, prerequisiteId) === "completed"
    );
  });

  if (firstReadyIncomplete) {
    return lessonMap.get(firstReadyIncomplete) ?? null;
  }

  const firstIncomplete = pathIndex.lessonIds.find(
    (lessonId) => getLessonStatus(state, lessonId) !== "completed"
  );

  return firstIncomplete ? lessonMap.get(firstIncomplete) ?? null : null;
}

export function getLessonReadiness(
  state: LearningWorkspaceState,
  lessonId: string
): LessonReadinessSummary | null {
  const lesson = lessonMap.get(lessonId);
  if (!lesson) {
    return null;
  }

  const pathIndex = getPathIndexForCourse(lesson.courseId);
  if (!pathIndex) {
    return null;
  }

  const stage = pathIndex.stageByLessonId.get(lessonId);
  const position = pathIndex.positionByLessonId.get(lessonId);
  if (!stage || !position) {
    return null;
  }

  const prerequisiteLessons = getLessonPrerequisites(lessonId);
  const completedPrerequisiteLessons = prerequisiteLessons.filter(
    (entry) => getLessonStatus(state, entry.id) === "completed"
  );
  const missingPrerequisiteLessons = prerequisiteLessons.filter(
    (entry) => getLessonStatus(state, entry.id) !== "completed"
  );

  const status = getLessonStatus(state, lessonId);
  const recommendedLesson = getRecommendedNextLesson(state, lesson.courseId);
  let readiness: LessonReadinessState;
  let explanation: string;

  if (status === "completed") {
    readiness = "completed";
    explanation = "Bu dersi tamamladın.";
  } else if (missingPrerequisiteLessons.length > 0) {
    readiness = "needs_prerequisites";
    explanation = buildNeedsPrerequisiteExplanation(missingPrerequisiteLessons);
  } else if (recommendedLesson?.id === lessonId) {
    readiness = "recommended";
    explanation = buildReadyExplanation(
      lesson,
      position,
      prerequisiteLessons,
      completedPrerequisiteLessons,
      "recommended"
    );
  } else {
    readiness = "ready";
    explanation = buildReadyExplanation(
      lesson,
      position,
      prerequisiteLessons,
      completedPrerequisiteLessons,
      "ready"
    );
  }

  return {
    lesson,
    path: pathIndex.path,
    stage,
    position,
    totalLessons: pathIndex.lessonIds.length,
    readiness,
    prerequisiteLessons,
    completedPrerequisiteLessons,
    missingPrerequisiteLessons,
    explanation,
  };
}

export function getCourseRecommendation(
  state: LearningWorkspaceState,
  courseId: string
): LearningPathRecommendation {
  const lesson = getRecommendedNextLesson(state, courseId);
  const courseLessons = getCourseLessonsSorted(courseId);
  const isComplete = getPathIndexForCourse(courseId)
    ? getPathProgress(state, courseId).isComplete
    : courseLessons.length > 0 && courseLessons.every(
        (item) => getLessonStatus(state, item.id) === "completed"
      );

  if (!lesson) {
    return {
      lesson: null,
      explanation: isComplete
        ? "Tüm dersleri tamamladın. İstersen kavramları gözden geçir veya pratik yap."
        : "Bu kurs için önerilen ders bulunamadı.",
      kind: "course_completed",
    };
  }

  if (getLessonStatus(state, lesson.id) === "in_progress") {
    return {
      lesson,
      explanation: `${lesson.title} üzerinde çalışıyorsun. Kaldığın yerden devam edebilirsin.`,
      kind: "continue_in_progress",
    };
  }

  const readiness = getLessonReadiness(state, lesson.id);
  return {
    lesson,
    explanation: readiness?.explanation ?? "Öğrenme yolundaki sıradaki doğal adım bu ders.",
    kind: "recommended",
  };
}

export function getLearningPathValidationState() {
  return {
    valid: validationIssues.length === 0,
    issues: validationIssues,
  };
}

export function getLearningPathCourseTitle(courseId: string) {
  return courseMap.get(courseId)?.title ?? null;
}

export function getLearningPathIndex(pathId: string) {
  return learningPathIndexById.get(pathId) ?? null;
}
