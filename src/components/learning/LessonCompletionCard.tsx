"use client";

import { useSyncExternalStore } from "react";
import {
  getCompletedLessonsServerSnapshot,
  getCompletedLessonsSnapshot,
  isLessonTitleCompleted,
  markLessonCompleted,
  subscribeToCompletedLessons,
} from "@/lib/learning";

type LessonCompletionCardProps = {
  courseSlug: string;
  courseTitle: string;
  moduleTitle: string;
  lessonTitle: string;
  initialCompleted: boolean;
};

export default function LessonCompletionCard({
  courseSlug,
  courseTitle,
  moduleTitle,
  lessonTitle,
  initialCompleted,
}: LessonCompletionCardProps) {
  const completedLessonIds = useSyncExternalStore(
    subscribeToCompletedLessons,
    getCompletedLessonsSnapshot,
    getCompletedLessonsServerSnapshot
  );
  const completed = isLessonTitleCompleted(
    courseSlug,
    lessonTitle,
    completedLessonIds,
    initialCompleted
  );

  function handleCompleteLesson() {
    markLessonCompleted(courseSlug, lessonTitle);
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-xl font-bold">Ders Bilgisi</h2>

      <div className="mt-4 space-y-3 text-sm text-slate-300">
        <p>Kurs: {courseTitle}</p>
        <p>Modül: {moduleTitle}</p>
        <p>Durum: {completed ? "Tamamlandı" : "Devam ediyor"}</p>
      </div>

      <button
        onClick={handleCompleteLesson}
        disabled={completed}
        className="mt-6 w-full rounded-2xl bg-sky-500 px-6 py-3 font-semibold transition hover:bg-sky-400 disabled:cursor-default disabled:bg-emerald-500 disabled:hover:bg-emerald-500"
      >
        {completed ? "✓ Ders Tamamlandı" : "✓ Dersi Tamamla"}
      </button>

      <p className="mt-3 text-sm text-slate-400">
        Tamamlama durumu bu tarayıcıda saklanır.
      </p>
    </div>
  );
}
