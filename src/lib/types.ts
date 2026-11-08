export type Difficulty = "kolay" | "orta" | "zor";
export type ProgressStatus = "planlandı" | "devam ediyor" | "tamamlandı";
export type ProblemStatus = "bekliyor" | "çalışılıyor" | "çözüldü";
export type NodeStatus = "başlangıç" | "çalışılıyor" | "oturdu";
export type LearningLevel = "temel" | "orta";
export type LearningCourseStatus =
  | "sırada"
  | "başladı"
  | "derinleşiyor"
  | "tamamlandı";
export type LearningResourceFormat =
  | "ders serisi"
  | "kitap"
  | "notlar"
  | "okuma listesi";
export type LearningContentKind = "video" | "not" | "pdf" | "makale";

export type Profile = {
  displayName: string;
  slogan: string;
  dailyGoalHours: number;
  focusArea: string;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  progress: number;
  currentSection: string;
  note: string;
  isActive: boolean;
  updatedAt: string;
};

export type Proof = {
  id: string;
  title: string;
  technique: string;
  source: string;
  difficulty: Difficulty;
  note: string;
  createdAt: string;
};

export type JournalEntry = {
  id: string;
  title: string;
  body: string;
  tag: string;
  createdAt: string;
};

export type RoadmapWeek = {
  id: string;
  weekNumber: number;
  title: string;
  focus: string;
  progress: number;
  status: ProgressStatus;
};

export type KnowledgeNode = {
  id: string;
  title: string;
  branch: string;
  status: NodeStatus;
  note: string;
};

export type Problem = {
  id: string;
  title: string;
  source: string;
  difficulty: Difficulty;
  status: ProblemStatus;
  note: string;
  createdAt: string;
};

export type LearningCategory = {
  id: string;
  title: string;
  description: string;
  emphasis: string;
};

export type LearningResource = {
  id: string;
  title: string;
  author: string;
  format: LearningResourceFormat;
  note: string;
  items: LearningContentItem[];
};

export type LearningContentItem = {
  id: string;
  title: string;
  kind: LearningContentKind;
  url: string;
  summary: string;
  durationLabel: string;
  sourceLabel: string;
};

export type LearningCourse = {
  id: string;
  title: string;
  categoryId: string;
  level: LearningLevel;
  progress: number;
  status: LearningCourseStatus;
  summary: string;
  nextStep: string;
  topics: string[];
  resourceIds: string[];
  relatedBookIds: string[];
  relatedNodeIds: string[];
  relatedProofIds: string[];
};

export type DailyTaskTemplate = {
  id: string;
  title: string;
  subtitle: string;
  xp: number;
  estimatedMinutes: number;
};

export type ActivityKind =
  | "task"
  | "proof"
  | "journal"
  | "book"
  | "roadmap"
  | "problem"
  | "node"
  | "learning";

export type ActivityEvent = {
  id: string;
  kind: ActivityKind;
  entityId?: string;
  label: string;
  date: string;
  xp: number;
};

export type Settings = {
  language: "tr";
  storageMode: "yerel";
};

export type AppData = {
  profile: Profile;
  books: Book[];
  proofs: Proof[];
  journalEntries: JournalEntry[];
  roadmapWeeks: RoadmapWeek[];
  knowledgeNodes: KnowledgeNode[];
  problems: Problem[];
  learningCategories: LearningCategory[];
  learningResources: LearningResource[];
  learningCourses: LearningCourse[];
  dailyTaskTemplates: DailyTaskTemplate[];
  taskCompletions: Record<string, string[]>;
  activityLog: ActivityEvent[];
  settings: Settings;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  progressLabel: string;
};
