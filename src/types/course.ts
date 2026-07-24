export type Lesson = {
  id: string;
  title: string;
  duration: string;
  completed: boolean;

  videoUrl: string;
  summary: string;
  concepts: string[];
};

export interface Module {
  id: number;
  title: string;
  description: string;
  unlocked: boolean;
  lessons: Lesson[];
}

export interface Course {
  id: number;
  slug: string;
  title: string;
  track: string;
  level: "Foundations" | "Core" | "Advanced";
  description: string;
  progress: number;
  lessons: number;
  conceptCount: number;
  weeklyGoal: string;
  currentLesson: string;
  modules: Module[];
}