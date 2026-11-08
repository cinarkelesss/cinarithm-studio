"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { learningCatalog } from "@/data/learning/curriculum";
import {
  appendLearningActivity,
  computeConceptMastery,
  createEmptyLearningWorkspaceState,
  elevateConceptMastery,
  getContinueLesson,
  getCourseProgress,
  getLessonStatus,
  getRecommendedCourses,
  learningCatalogIndex,
} from "@/lib/learning/catalog";
import type {
  ConceptMasteryRecord,
  ExerciseProgressRecord,
  LearningWorkspaceState,
  LessonNoteRecord,
  LessonStatus,
} from "@/lib/learning/domain";

const STORAGE_KEY = "cinarithm-learning-workspace-v1";

type LearningWorkspaceContextValue = {
  state: LearningWorkspaceState;
  hydrated: boolean;
  continueLessonId?: string;
  recommendedCourses: ReturnType<typeof getRecommendedCourses>;
  getCourseProgressSummary: (courseId: string) => ReturnType<typeof getCourseProgress>;
  getLessonStatusValue: (lessonId: string) => LessonStatus;
  getLessonNote: (lessonId: string) => LessonNoteRecord | undefined;
  getConceptMasteryValue: (conceptId: string) => ConceptMasteryRecord;
  openLesson: (lessonId: string) => void;
  markLessonComplete: (lessonId: string) => void;
  markLessonInProgress: (lessonId: string) => void;
  saveLessonNote: (lessonId: string, content: string) => void;
  markExerciseComplete: (exerciseId: string) => void;
};

const LearningWorkspaceContext =
  createContext<LearningWorkspaceContextValue | null>(null);

function uid(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function readStateFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createEmptyLearningWorkspaceState();
    }

    const parsed = JSON.parse(raw) as LearningWorkspaceState;
    return {
      ...createEmptyLearningWorkspaceState(),
      ...parsed,
    };
  } catch {
    return createEmptyLearningWorkspaceState();
  }
}

export function LearningWorkspaceProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, setState] = useState<LearningWorkspaceState>(
    createEmptyLearningWorkspaceState
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(readStateFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const continueLesson = useMemo(() => getContinueLesson(state), [state]);
  const recommendedCourses = useMemo(
    () => getRecommendedCourses(state),
    [state]
  );

  const setLessonStatus = useCallback((lessonId: string, status: LessonStatus) => {
    setState((current) => {
      const now = nowIso();
      const currentRecord = current.lessonProgress[lessonId];
      const lesson = learningCatalogIndex.lessonMap.get(lessonId);
      const currentStatus = currentRecord?.status;

      if (!lesson) {
        if (current.lastLessonId === lessonId) {
          return current;
        }

        return {
          ...current,
          lastLessonId: lessonId,
        };
      }

      const isSameStatus = currentStatus === status;

      if (status === "completed" && isSameStatus) {
        if (current.lastLessonId === lessonId) {
          return current;
        }

        return {
          ...current,
          lastLessonId: lessonId,
        };
      }

      if (status === "in_progress" && isSameStatus) {
        if (current.lastLessonId === lessonId) {
          return current;
        }

        return {
          ...current,
          lastLessonId: lessonId,
        };
      }

      const nextState: LearningWorkspaceState = {
        ...current,
        lastLessonId: lessonId,
        lessonProgress: {
          ...current.lessonProgress,
          [lessonId]: {
            lessonId,
            status,
            lastVisitedAt: now,
            completedAt:
              status === "completed"
                ? currentRecord?.completedAt ?? now
                : undefined,
          },
        },
      };

      const activityType =
        status === "completed" ? "lesson_completed" : "lesson_started";
      const activityTitle =
        status === "completed"
          ? `${lesson.title} tamamlandı`
          : `${lesson.title} açıldı`;

      const dedupeActivity =
        current.recentActivity[0]?.lessonId === lessonId &&
        current.recentActivity[0]?.type === activityType;

      if (!dedupeActivity) {
        nextState.recentActivity = appendLearningActivity(current.recentActivity, {
          id: uid("learning-activity"),
          type: activityType,
          title: activityTitle,
          lessonId,
          courseId: lesson.courseId,
          createdAt: now,
        });
      }

      if (status === "completed") {
        const nextConceptMastery = { ...current.conceptMastery };
        lesson.concepts.forEach((conceptId) => {
          const elevated = elevateConceptMastery(
            {
              ...(nextConceptMastery[conceptId] ?? {
                conceptId,
                score: 0,
                level: "not_started",
                updatedAt: now,
              }),
              conceptId,
            },
            18,
            now
          );
          nextConceptMastery[conceptId] = elevated;
        });
        nextState.conceptMastery = nextConceptMastery;
      }

      return nextState;
    });
  }, []);

  const saveLessonNote = useCallback((lessonId: string, content: string) => {
    setState((current) => {
      const now = nowIso();
      const lesson = learningCatalogIndex.lessonMap.get(lessonId);
      const existing = current.lessonNotes[lessonId];

      if (existing && existing.content === content) {
        return current;
      }

      const nextNote: LessonNoteRecord = existing
        ? {
            ...existing,
            content,
            updatedAt: now,
          }
        : {
            id: uid("lesson-note"),
            lessonId,
            content,
            createdAt: now,
            updatedAt: now,
          };

      const shouldLogActivity =
        content.trim().length > 0 &&
        (!existing ||
          existing.content.trim() !== content.trim() ||
          current.recentActivity[0]?.type !== "note_saved" ||
          current.recentActivity[0]?.lessonId !== lessonId);

      return {
        ...current,
        lessonNotes: {
          ...current.lessonNotes,
          [lessonId]: nextNote,
        },
        recentActivity:
          shouldLogActivity && lesson
            ? appendLearningActivity(current.recentActivity, {
                id: uid("learning-activity"),
                type: "note_saved",
                title: `${lesson.title} notu güncellendi`,
                lessonId,
                courseId: lesson.courseId,
                createdAt: now,
              })
            : current.recentActivity,
      };
    });
  }, []);

  const markExerciseComplete = useCallback((exerciseId: string) => {
    setState((current) => {
      if (current.exerciseProgress[exerciseId]) {
        return current;
      }

      const exercise = learningCatalog.exercises.find((item) => item.id === exerciseId);
      const now = nowIso();
      const nextExercise: ExerciseProgressRecord = {
        exerciseId,
        completedAt: now,
      };
      const nextConceptMastery = { ...current.conceptMastery };

      exercise?.conceptIds.forEach((conceptId) => {
        nextConceptMastery[conceptId] = elevateConceptMastery(
          {
            ...(nextConceptMastery[conceptId] ?? {
              conceptId,
              score: 0,
              level: "not_started",
              updatedAt: now,
            }),
            conceptId,
          },
          10,
          now
        );
      });

      return {
        ...current,
        exerciseProgress: {
          ...current.exerciseProgress,
          [exerciseId]: nextExercise,
        },
        conceptMastery: nextConceptMastery,
        recentActivity: exercise
          ? appendLearningActivity(current.recentActivity, {
              id: uid("learning-activity"),
              type: "exercise_completed",
              title: `${exercise.title} tamamlandı`,
              lessonId: exercise.lessonId,
              courseId: exercise.courseId,
              createdAt: now,
            })
          : current.recentActivity,
      };
    });
  }, []);

  const getCourseProgressSummary = useCallback(
    (courseId: string) => getCourseProgress(state, courseId),
    [state]
  );

  const getLessonStatusValue = useCallback(
    (lessonId: string) => getLessonStatus(state, lessonId),
    [state]
  );

  const getLessonNote = useCallback(
    (lessonId: string) => state.lessonNotes[lessonId],
    [state]
  );

  const getConceptMasteryValue = useCallback(
    (conceptId: string) => computeConceptMastery(state, conceptId),
    [state]
  );

  const openLesson = useCallback((lessonId: string) => {
    setState((current) => {
      const lesson = learningCatalogIndex.lessonMap.get(lessonId);
      const currentRecord = current.lessonProgress[lessonId];
      const currentStatus = currentRecord?.status;

      if (!lesson) {
        if (current.lastLessonId === lessonId) {
          return current;
        }

        return {
          ...current,
          lastLessonId: lessonId,
        };
      }

      if (currentStatus === "completed") {
        if (current.lastLessonId === lessonId) {
          return current;
        }

        return {
          ...current,
          lastLessonId: lessonId,
        };
      }

      if (currentStatus === "in_progress") {
        if (current.lastLessonId === lessonId) {
          return current;
        }

        return {
          ...current,
          lastLessonId: lessonId,
        };
      }

      const now = nowIso();
      const nextState: LearningWorkspaceState = {
        ...current,
        lastLessonId: lessonId,
        lessonProgress: {
          ...current.lessonProgress,
          [lessonId]: {
            lessonId,
            status: "in_progress",
            lastVisitedAt: now,
            completedAt: undefined,
          },
        },
      };

      const dedupeActivity =
        current.recentActivity[0]?.lessonId === lessonId &&
        current.recentActivity[0]?.type === "lesson_started";

      if (!dedupeActivity) {
        nextState.recentActivity = appendLearningActivity(current.recentActivity, {
          id: uid("learning-activity"),
          type: "lesson_started",
          title: `${lesson.title} açıldı`,
          lessonId,
          courseId: lesson.courseId,
          createdAt: now,
        });
      }

      return nextState;
    });
  }, []);

  const markLessonComplete = useCallback((lessonId: string) => {
    setLessonStatus(lessonId, "completed");
  }, [setLessonStatus]);

  const markLessonInProgress = useCallback((lessonId: string) => {
    setLessonStatus(lessonId, "in_progress");
  }, [setLessonStatus]);

  const value = useMemo<LearningWorkspaceContextValue>(
    () => ({
      state,
      hydrated,
      continueLessonId: continueLesson?.id,
      recommendedCourses,
      getCourseProgressSummary,
      getLessonStatusValue,
      getLessonNote,
      getConceptMasteryValue,
      openLesson,
      markLessonComplete,
      markLessonInProgress,
      saveLessonNote,
      markExerciseComplete,
    }),
    [
      continueLesson?.id,
      getConceptMasteryValue,
      getCourseProgressSummary,
      getLessonNote,
      getLessonStatusValue,
      hydrated,
      markExerciseComplete,
      markLessonComplete,
      markLessonInProgress,
      openLesson,
      recommendedCourses,
      saveLessonNote,
      state,
    ]
  );

  return (
    <LearningWorkspaceContext.Provider value={value}>
      {children}
    </LearningWorkspaceContext.Provider>
  );
}

export function useLearningWorkspace() {
  const context = useContext(LearningWorkspaceContext);

  if (!context) {
    throw new Error("useLearningWorkspace must be used within LearningWorkspaceProvider");
  }

  return context;
}
