import { learningCatalog } from "@/data/learning/curriculum";
import { getRecommendedNextLesson } from "@/lib/learning/paths";
import type {
  ConceptMasteryRecord,
  LearningActivityRecord,
  LearningCatalog,
  LearningCourse,
  LearningLesson,
  LearningModule,
  LearningWorkspaceState,
  LessonStatus,
  MasteryLevel,
} from "@/lib/learning/domain";

export type LearningCatalogIndex = {
  catalog: LearningCatalog;
  courseMap: Map<string, LearningCourse>;
  courseBySlug: Map<string, LearningCourse>;
  moduleMap: Map<string, LearningModule>;
  lessonMap: Map<string, LearningLesson>;
  lessonBySlug: Map<string, LearningLesson>;
};

const courseSlugAliases = new Map<string, string>([
  ["metric-spaces-topology", "metric-spaces-and-topology"],
  ["set-theory-ordinals", "set-theory-and-ordinals"],
  ["supplementary-unclassified", "supplementary-and-miscellaneous"],
]);

function levelFromScore(score: number): MasteryLevel {
  if (score >= 85) {
    return "mastered";
  }
  if (score >= 60) {
    return "familiar";
  }
  if (score >= 25) {
    return "learning";
  }
  return "not_started";
}

export const learningCatalogIndex: LearningCatalogIndex = {
  catalog: learningCatalog,
  courseMap: new Map(learningCatalog.courses.map((course) => [course.id, course])),
  courseBySlug: new Map(learningCatalog.courses.map((course) => [course.slug, course])),
  moduleMap: new Map(learningCatalog.modules.map((module) => [module.id, module])),
  lessonMap: new Map(learningCatalog.lessons.map((lesson) => [lesson.id, lesson])),
  lessonBySlug: new Map(learningCatalog.lessons.map((lesson) => [lesson.slug, lesson])),
};

export function resolveCourseSlug(slug: string) {
  return courseSlugAliases.get(slug) ?? slug;
}

export function getCourseBySlug(slug: string) {
  return learningCatalogIndex.courseBySlug.get(resolveCourseSlug(slug)) ?? null;
}

export function createEmptyLearningWorkspaceState(): LearningWorkspaceState {
  return {
    lastLessonId: undefined,
    lessonProgress: {},
    lessonNotes: {},
    conceptMastery: {},
    exerciseProgress: {},
    recentActivity: [],
  };
}

export function getCourseModules(courseId: string) {
  return learningCatalog.modules
    .filter((module) => module.courseId === courseId)
    .sort((left, right) => left.curriculumOrder - right.curriculumOrder);
}

export function getModuleLessons(moduleId: string) {
  return learningCatalog.lessons
    .filter((lesson) => lesson.moduleId === moduleId)
    .sort((left, right) => left.curriculumOrder - right.curriculumOrder);
}

export function getCourseLessons(courseId: string) {
  return learningCatalog.lessons
    .filter((lesson) => lesson.courseId === courseId)
    .sort((left, right) => left.curriculumOrder - right.curriculumOrder);
}

export function getLessonStatus(
  state: LearningWorkspaceState,
  lessonId: string
): LessonStatus {
  return state.lessonProgress[lessonId]?.status ?? "not_started";
}

export function isLessonUnlocked(state: LearningWorkspaceState, lessonId: string) {
  const lesson = learningCatalogIndex.lessonMap.get(lessonId);
  if (!lesson) {
    return false;
  }

  if (lesson.prerequisites.length === 0) {
    return true;
  }

  return lesson.prerequisites.every(
    (prerequisiteId) => getLessonStatus(state, prerequisiteId) === "completed"
  );
}

export function getCourseProgress(state: LearningWorkspaceState, courseId: string) {
  const lessons = getCourseLessons(courseId);
  const completed = lessons.filter(
    (lesson) => getLessonStatus(state, lesson.id) === "completed"
  ).length;
  const inProgress = lessons.filter(
    (lesson) => getLessonStatus(state, lesson.id) === "in_progress"
  ).length;
  const total = lessons.length;
  const progressPercent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    completed,
    inProgress,
    total,
    progressPercent,
  };
}

export function getModuleProgress(state: LearningWorkspaceState, moduleId: string) {
  const lessons = getModuleLessons(moduleId);
  const completed = lessons.filter(
    (lesson) => getLessonStatus(state, lesson.id) === "completed"
  ).length;
  return {
    completed,
    total: lessons.length,
    progressPercent:
      lessons.length === 0 ? 0 : Math.round((completed / lessons.length) * 100),
  };
}

export function getLessonNavigation(lessonId: string) {
  const lesson = learningCatalogIndex.lessonMap.get(lessonId);
  if (!lesson) {
    return {
      previousLesson: null,
      nextLesson: null,
    };
  }

  const courseLessons = getCourseLessons(lesson.courseId);
  const index = courseLessons.findIndex((entry) => entry.id === lessonId);

  return {
    previousLesson: index > 0 ? courseLessons[index - 1] : null,
    nextLesson: index >= 0 && index < courseLessons.length - 1 ? courseLessons[index + 1] : null,
  };
}

export function getContinueLesson(state: LearningWorkspaceState, courseId?: string) {
  return getRecommendedNextLesson(state, courseId);
}

export function getRecommendedCourses(state: LearningWorkspaceState) {
  return learningCatalog.courses
    .map((course) => ({
      course,
      progress: getCourseProgress(state, course.id),
    }))
    .sort((left, right) => {
      if (left.course.recommended && !right.course.recommended) {
        return -1;
      }
      if (!left.course.recommended && right.course.recommended) {
        return 1;
      }
      if (left.course.flagship && !right.course.flagship) {
        return -1;
      }
      if (!left.course.flagship && right.course.flagship) {
        return 1;
      }
      if (left.progress.progressPercent !== right.progress.progressPercent) {
        return right.progress.progressPercent - left.progress.progressPercent;
      }
      return left.course.title.localeCompare(right.course.title, "en");
    });
}

export function computeConceptMastery(
  state: LearningWorkspaceState,
  conceptId: string
): ConceptMasteryRecord {
  return (
    state.conceptMastery[conceptId] ?? {
      conceptId,
      score: 0,
      level: "not_started",
      updatedAt: "",
    }
  );
}

export function buildSearchIndex() {
  return [
    ...learningCatalog.courses.map((course) => ({
      id: course.id,
      title: course.title,
      subtitle: course.summary,
      href: `/learning/course/${course.slug}`,
      kind: "course" as const,
    })),
    ...learningCatalog.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      subtitle: learningCatalogIndex.courseMap.get(lesson.courseId)?.title ?? "",
      href: `/learning/course/${learningCatalogIndex.courseMap.get(lesson.courseId)?.slug}/lesson/${lesson.slug}`,
      kind: "lesson" as const,
    })),
    ...learningCatalog.concepts.map((concept) => ({
      id: concept.id,
      title: concept.name,
      subtitle: concept.description,
      href: `/concepts?concept=${concept.slug}`,
      kind: "concept" as const,
    })),
  ];
}

export function appendLearningActivity(
  current: LearningActivityRecord[],
  next: LearningActivityRecord
) {
  return [next, ...current].slice(0, 14);
}

export function elevateConceptMastery(
  current: ConceptMasteryRecord | undefined,
  points: number,
  updatedAt: string
): ConceptMasteryRecord {
  const nextScore = Math.min(100, (current?.score ?? 0) + points);
  return {
    conceptId: current?.conceptId ?? "",
    score: nextScore,
    level: levelFromScore(nextScore),
    updatedAt,
  };
}
