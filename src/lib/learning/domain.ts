export type VideoSourceProvider =
  | "google-drive"
  | "local"
  | "external"
  | "embed";

export type VideoSource = {
  provider: VideoSourceProvider;
  fileId?: string;
  url?: string;
  path?: string;
  poster?: string;
  openUrl?: string;
};

export type CourseKind = "core" | "advanced" | "supplementary";
export type LessonStatus = "not_started" | "in_progress" | "completed";
export type ExerciseKind = "lesson" | "practice";
export type ExerciseFormat = "proof" | "reflection" | "computation" | "reading";
export type ExerciseAnswerMode = "multiple_choice" | "short_answer" | "proof";
export type MasteryLevel = "not_started" | "learning" | "familiar" | "mastered";
export type LessonReadinessState =
  | "completed"
  | "recommended"
  | "ready"
  | "needs_prerequisites";

export type LearningCourse = {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  summary: string;
  kind: CourseKind;
  recommended?: boolean;
  flagship?: boolean;
  moduleIds: string[];
  conceptIds: string[];
  accent: string;
};

export type LearningModule = {
  id: string;
  slug: string;
  courseId: string;
  title: string;
  description: string;
  curriculumOrder: number;
  lessonIds: string[];
};

export type LearningLesson = {
  id: string;
  slug: string;
  courseId: string;
  moduleId: string;
  title: string;
  description: string;
  curriculumOrder: number;
  instructor?: string;
  sourceOrder?: number;
  sourceFileName?: string;
  originalFileName?: string;
  driveFileId?: string;
  driveUrl?: string;
  fileSizeBytes?: number;
  durationMinutes?: number;
  concepts: string[];
  prerequisites: string[];
  exerciseIds: string[];
  videoSource?: VideoSource;
};

export type LearningConcept = {
  id: string;
  slug: string;
  name: string;
  description: string;
  courseIds: string[];
  prerequisiteIds: string[];
};

export type LearningPathStage = {
  id: string;
  title: string;
  description: string;
  lessonIds: string[];
};

export type LessonPathMetadata = {
  lessonId: string;
  prerequisiteLessonIds?: string[];
  recommendedPreviousLessonIds?: string[];
};

export type LearningPath = {
  id: string;
  courseId: string;
  title: string;
  description: string;
  stages: LearningPathStage[];
  lessonMetadata: LessonPathMetadata[];
};

export type LearningExercise = {
  id: string;
  title: string;
  prompt: string;
  kind: ExerciseKind;
  format: ExerciseFormat;
  answerMode?: ExerciseAnswerMode;
  placeholder?: string;
  hint?: string;
  solution?: string;
  choices?: Array<{
    id: string;
    text: string;
  }>;
  lessonId?: string;
  conceptIds: string[];
  courseId: string;
};

export type LessonProgressRecord = {
  lessonId: string;
  status: LessonStatus;
  lastVisitedAt: string;
  completedAt?: string;
};

export type LessonNoteRecord = {
  id: string;
  lessonId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type ConceptMasteryRecord = {
  conceptId: string;
  score: number;
  level: MasteryLevel;
  updatedAt: string;
};

export type ExerciseProgressRecord = {
  exerciseId: string;
  completedAt: string;
};

export type LearningActivityRecord = {
  id: string;
  type: "lesson_started" | "lesson_completed" | "exercise_completed" | "note_saved";
  title: string;
  lessonId?: string;
  courseId?: string;
  createdAt: string;
};

export type LearningWorkspaceState = {
  lastLessonId?: string;
  lessonProgress: Record<string, LessonProgressRecord>;
  lessonNotes: Record<string, LessonNoteRecord>;
  conceptMastery: Record<string, ConceptMasteryRecord>;
  exerciseProgress: Record<string, ExerciseProgressRecord>;
  recentActivity: LearningActivityRecord[];
};

export type LearningCatalog = {
  courses: LearningCourse[];
  modules: LearningModule[];
  lessons: LearningLesson[];
  concepts: LearningConcept[];
  exercises: LearningExercise[];
};
