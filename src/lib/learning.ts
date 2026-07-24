import { getConceptBySlug } from "@/data/concepts";
import { studyNotes } from "@/data/notes";
import type { Course, Lesson } from "@/types/course";
import type { NoteStatus, StudyNote } from "@/types/note";

const COMPLETED_LESSONS_STORAGE_KEY = "cinarithm-completed-lessons";
const COMPLETED_LESSONS_EVENT = "cinarithm-learning-progress-change";
const LEARNING_NOTES_STORAGE_KEY = "cinarithm-learning-notes";
const LEARNING_NOTES_EVENT = "cinarithm-learning-notes-change";
const EMPTY_COMPLETED_LESSONS: string[] = [];
const EMPTY_LEARNING_NOTES: SavedLearningNote[] = [];

let completedLessonsCache: string[] | null = null;
let learningNotesCache: SavedLearningNote[] | null = null;

export type SavedLearningNote = {
  id: string;
  courseSlug: string;
  courseTitle: string;
  moduleTitle: string;
  lessonTitle: string;
  content: string;
  concepts: string[];
  updatedAt: string;
};

export type WorkspaceDisplayNote = {
  id: string;
  title: string;
  updatedAt: string;
  summary: string;
  status: NoteStatus;
  collection: string;
  linkedConceptTitles: string[];
};

export function slugifyLessonTitle(text: string) {
  return text
    .toLowerCase()
    .replaceAll(" ", "-")
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c");
}

export function buildLessonStorageId(courseSlug: string, lessonTitle: string) {
  return `${courseSlug}:${slugifyLessonTitle(lessonTitle)}`;
}

export function readCompletedLessons() {
  if (typeof window === "undefined") {
    return EMPTY_COMPLETED_LESSONS;
  }

  if (completedLessonsCache) {
    return completedLessonsCache;
  }

  try {
    const rawValue = window.localStorage.getItem(
      COMPLETED_LESSONS_STORAGE_KEY
    );

    if (!rawValue) {
      completedLessonsCache = EMPTY_COMPLETED_LESSONS;
      return completedLessonsCache;
    }

    const parsedValue = JSON.parse(rawValue);

    completedLessonsCache = Array.isArray(parsedValue)
      ? parsedValue.filter((item): item is string => typeof item === "string")
      : EMPTY_COMPLETED_LESSONS;

    return completedLessonsCache;
  } catch {
    completedLessonsCache = EMPTY_COMPLETED_LESSONS;
    return completedLessonsCache;
  }
}

export function writeCompletedLessons(lessonIds: string[]) {
  if (typeof window === "undefined") {
    return;
  }

  completedLessonsCache = lessonIds;

  window.localStorage.setItem(
    COMPLETED_LESSONS_STORAGE_KEY,
    JSON.stringify(lessonIds)
  );

  window.dispatchEvent(new Event(COMPLETED_LESSONS_EVENT));
}

export function markLessonCompleted(courseSlug: string, lessonTitle: string) {
  const completedLessons = readCompletedLessons();
  const lessonStorageId = buildLessonStorageId(courseSlug, lessonTitle);

  if (!completedLessons.includes(lessonStorageId)) {
    writeCompletedLessons([...completedLessons, lessonStorageId]);
  }
}

export function buildLearningNoteId(courseSlug: string, lessonTitle: string) {
  return `${courseSlug}:note:${slugifyLessonTitle(lessonTitle)}`;
}

export function readLearningNotes() {
  if (typeof window === "undefined") {
    return EMPTY_LEARNING_NOTES;
  }

  if (learningNotesCache) {
    return learningNotesCache;
  }

  try {
    const rawValue = window.localStorage.getItem(LEARNING_NOTES_STORAGE_KEY);

    if (!rawValue) {
      learningNotesCache = EMPTY_LEARNING_NOTES;
      return learningNotesCache;
    }

    const parsedValue = JSON.parse(rawValue);

    learningNotesCache = Array.isArray(parsedValue)
      ? parsedValue.filter(
          (item): item is SavedLearningNote =>
            typeof item === "object" &&
            item !== null &&
            typeof item.id === "string" &&
            typeof item.courseSlug === "string" &&
            typeof item.courseTitle === "string" &&
            typeof item.moduleTitle === "string" &&
            typeof item.lessonTitle === "string" &&
            typeof item.content === "string" &&
            typeof item.updatedAt === "string" &&
            Array.isArray(item.concepts)
        )
      : EMPTY_LEARNING_NOTES;

    return learningNotesCache;
  } catch {
    learningNotesCache = EMPTY_LEARNING_NOTES;
    return learningNotesCache;
  }
}

export function writeLearningNotes(notes: SavedLearningNote[]) {
  if (typeof window === "undefined") {
    return;
  }

  learningNotesCache = notes;

  window.localStorage.setItem(LEARNING_NOTES_STORAGE_KEY, JSON.stringify(notes));
  window.dispatchEvent(new Event(LEARNING_NOTES_EVENT));
}

export function upsertLearningNote(note: SavedLearningNote) {
  const notes = readLearningNotes();
  const existingIndex = notes.findIndex((item) => item.id === note.id);

  if (existingIndex >= 0) {
    const updatedNotes = [...notes];
    updatedNotes[existingIndex] = note;
    writeLearningNotes(updatedNotes);
    return;
  }

  writeLearningNotes([note, ...notes]);
}

export function getLearningNote(
  courseSlug: string,
  lessonTitle: string,
  notes: SavedLearningNote[]
) {
  const noteId = buildLearningNoteId(courseSlug, lessonTitle);
  return notes.find((note) => note.id === noteId);
}

export function subscribeToCompletedLessons(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStorageChange = (event: StorageEvent) => {
    if (
      event.key === null ||
      event.key === COMPLETED_LESSONS_STORAGE_KEY
    ) {
      completedLessonsCache = null;
      onStoreChange();
    }
  };

  const handleCompletedLessonsChange = () => {
    onStoreChange();
  };

  window.addEventListener("storage", handleStorageChange);
  window.addEventListener(COMPLETED_LESSONS_EVENT, handleCompletedLessonsChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
    window.removeEventListener(COMPLETED_LESSONS_EVENT, handleCompletedLessonsChange);
  };
}

export function subscribeToLearningNotes(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === null || event.key === LEARNING_NOTES_STORAGE_KEY) {
      learningNotesCache = null;
      onStoreChange();
    }
  };

  const handleLearningNotesChange = () => {
    onStoreChange();
  };

  window.addEventListener("storage", handleStorageChange);
  window.addEventListener(LEARNING_NOTES_EVENT, handleLearningNotesChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
    window.removeEventListener(LEARNING_NOTES_EVENT, handleLearningNotesChange);
  };
}

export function getCompletedLessonsSnapshot() {
  return readCompletedLessons();
}

export function getCompletedLessonsServerSnapshot() {
  return EMPTY_COMPLETED_LESSONS;
}

export function getLearningNotesSnapshot() {
  return readLearningNotes();
}

export function getLearningNotesServerSnapshot() {
  return EMPTY_LEARNING_NOTES;
}

export function isLessonCompleted(
  courseSlug: string,
  lesson: Lesson,
  completedLessonIds: string[]
) {
  const lessonStorageId = buildLessonStorageId(courseSlug, lesson.title);
  return lesson.completed || completedLessonIds.includes(lessonStorageId);
}

export function isLessonTitleCompleted(
  courseSlug: string,
  lessonTitle: string,
  completedLessonIds: string[],
  initialCompleted = false
) {
  const lessonStorageId = buildLessonStorageId(courseSlug, lessonTitle);
  return initialCompleted || completedLessonIds.includes(lessonStorageId);
}

export function getCourseLessonStats(
  course: Course,
  completedLessonIds: string[]
) {
  const allLessons = course.modules.flatMap((courseModule) => courseModule.lessons);
  const totalLessons = allLessons.length;
  const completedLessons = allLessons.filter((lesson) =>
    isLessonCompleted(course.slug, lesson, completedLessonIds)
  ).length;

  return {
    totalLessons,
    completedLessons,
    progress:
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : course.progress,
  };
}

export function getResolvedModules(
  course: Course,
  completedLessonIds: string[]
) {
  let previousModuleCompleted = false;

  return course.modules.map((courseModule, index) => {
    const totalLessons = courseModule.lessons.length;
    const completedLessons = courseModule.lessons.filter((lesson) =>
      isLessonCompleted(course.slug, lesson, completedLessonIds)
    ).length;
    const isCompleted = totalLessons > 0 && completedLessons === totalLessons;
    const isUnlocked =
      index === 0
        ? courseModule.unlocked
        : previousModuleCompleted || courseModule.unlocked;

    previousModuleCompleted = isCompleted;

    return {
      ...courseModule,
      isUnlocked,
      isCompleted,
      completedLessons,
      totalLessons,
      progress:
        totalLessons > 0
          ? Math.round((completedLessons / totalLessons) * 100)
          : 0,
    };
  });
}

export function getLessonStatusIcon(
  courseSlug: string,
  lesson: Lesson,
  completedLessonIds: string[]
) {
  return isLessonCompleted(courseSlug, lesson, completedLessonIds)
    ? "✅"
    : "⭕";
}

export function getNextLessonForCourse(
  course: Course,
  completedLessonIds: string[]
) {
  const resolvedModules = getResolvedModules(course, completedLessonIds);

  for (const courseModule of resolvedModules) {
    if (!courseModule.isUnlocked) {
      continue;
    }

    const nextLesson = courseModule.lessons.find(
      (lesson) => !isLessonCompleted(course.slug, lesson, completedLessonIds)
    );

    if (nextLesson) {
      return {
        module: courseModule,
        lesson: nextLesson,
        href: `/learning/course/${course.slug}/lesson/${slugifyLessonTitle(
          nextLesson.title
        )}`,
      };
    }
  }

  return null;
}

export function getFirstUnlockedModule(course: Course) {
  return course.modules.find((courseModule) => courseModule.unlocked);
}

export function getCourseContinueLabel(
  course: Course,
  completedLessonIds: string[]
) {
  const nextLesson = getNextLessonForCourse(course, completedLessonIds);

  if (nextLesson) {
    return `${nextLesson.module.title} · ${nextLesson.lesson.title}`;
  }

  return course.currentLesson;
}

export function getCourseCardMeta(course: Course, completedLessonIds: string[]) {
  const stats = getCourseLessonStats(course, completedLessonIds);
  const nextLesson = getNextLessonForCourse(course, completedLessonIds);
  const hasModules = course.modules.length > 0;

  return {
    progress: hasModules ? stats.progress : course.progress,
    lessonCount: hasModules ? stats.totalLessons : course.lessons,
    completedCount: hasModules ? stats.completedLessons : Math.round((course.progress / 100) * course.lessons),
    continueHref: nextLesson ? nextLesson.href : `/learning/course/${course.slug}`,
    continueLabel: nextLesson ? `${nextLesson.module.title} · ${nextLesson.lesson.title}` : course.currentLesson,
    isComplete: hasModules && stats.totalLessons > 0 && stats.completedLessons === stats.totalLessons,
  };
}

function formatNoteDate(dateInput: string) {
  const parsedDate = new Date(dateInput);

  if (Number.isNaN(parsedDate.getTime())) {
    return dateInput;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function getSortableTimestamp(dateInput: string) {
  const parsedDate = new Date(dateInput);
  return Number.isNaN(parsedDate.getTime()) ? 0 : parsedDate.getTime();
}

function summarizeNoteContent(content: string) {
  const normalizedContent = content.replace(/\s+/g, " ").trim();

  if (normalizedContent.length <= 140) {
    return normalizedContent;
  }

  return `${normalizedContent.slice(0, 137)}...`;
}

export function mapStudyNoteToWorkspaceNote(note: StudyNote): WorkspaceDisplayNote {
  return {
    id: `seed-${note.id}`,
    title: note.title,
    updatedAt: note.updatedAt,
    summary: note.summary,
    status: note.status,
    collection: note.collection,
    linkedConceptTitles: note.linkedConceptSlugs.map(
      (slug) => getConceptBySlug(slug)?.title ?? slug
    ),
  };
}

export function mapSavedLearningNoteToWorkspaceNote(
  note: SavedLearningNote
): WorkspaceDisplayNote {
  return {
    id: note.id,
    title: note.lessonTitle,
    updatedAt: formatNoteDate(note.updatedAt),
    summary: summarizeNoteContent(note.content),
    status: note.concepts.length > 0 ? "linked" : "draft",
    collection: `${note.courseTitle} / ${note.moduleTitle}`,
    linkedConceptTitles: note.concepts,
  };
}

export function getMergedWorkspaceNotes(savedNotes: SavedLearningNote[]) {
  const dynamicNotes = savedNotes
    .filter((note) => note.content.trim().length > 0)
    .map(mapSavedLearningNoteToWorkspaceNote);

  const staticNotes = studyNotes.map(mapStudyNoteToWorkspaceNote);

  return [...dynamicNotes, ...staticNotes].sort(
    (left, right) =>
      getSortableTimestamp(right.updatedAt) - getSortableTimestamp(left.updatedAt)
  );
}
