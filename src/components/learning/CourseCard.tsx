"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Network, Target } from "lucide-react";
import { useSyncExternalStore } from "react";
import type { Course } from "@/types/course";
import {
  getCompletedLessonsServerSnapshot,
  getCompletedLessonsSnapshot,
  getCourseCardMeta,
  subscribeToCompletedLessons,
} from "@/lib/learning";

type CourseCardProps = Course;

export default function CourseCard({
  id,
  slug,
  title,
  track,
  level,
  description,
  progress,
  lessons,
  conceptCount,
  weeklyGoal,
  currentLesson,
  modules,
}: CourseCardProps) {
  const completedLessonIds = useSyncExternalStore(
    subscribeToCompletedLessons,
    getCompletedLessonsSnapshot,
    getCompletedLessonsServerSnapshot
  );
  const cardMeta = getCourseCardMeta(
    {
      id,
      slug,
      title,
      track,
      level,
      description,
      progress,
      lessons,
      conceptCount,
      weeklyGoal,
      currentLesson,
      modules,
    } as Course,
    completedLessonIds
  );

  return (
    <article className="glass-panel group min-h-[420px] overflow-hidden rounded-[28px] p-6 hover:-translate-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/15">
          <BookOpen className="h-8 w-8 text-violet-300" />
        </div>

        <div className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-400">
          {level}
        </div>
      </div>

      <p className="mt-6 text-xs uppercase tracking-[0.22em] text-slate-500">
        {track}
      </p>

      <h3 className="mt-3 text-2xl font-bold tracking-tight text-white">
        {title}
      </h3>

      <p className="mt-3 leading-6 text-slate-400">{description}</p>

      <div className="mt-6 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-slate-300">
          {cardMeta.lessonCount || lessons} Lesson
        </span>
        <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-slate-300">
          {conceptCount} Concepts
        </span>
        {cardMeta.isComplete ? (
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-emerald-200">
            Complete
          </span>
        ) : null}
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="text-slate-400">Progress</span>
          <span className="font-semibold text-white">%{cardMeta.progress}</span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-white/8">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-400 via-blue-400 to-violet-500 transition-all duration-500"
            style={{ width: `${cardMeta.progress}%` }}
          />
        </div>

        <p className="mt-3 text-sm text-slate-500">{cardMeta.continueLabel}</p>
      </div>

      <div className="mt-8 grid gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
            <Target className="h-4 w-4 text-emerald-300" />
            Weekly Goal
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-400">{weeklyGoal}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
            <Network className="h-4 w-4 text-sky-300" />
            Knowledge Graph
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Bu kursun kavram ilişkileri ve theorem bağlantıları hazırlanıyor.
          </p>
        </div>
      </div>

      <Link
        href={cardMeta.continueHref}
        className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 font-medium text-slate-950 transition group-hover:gap-3"
      >
        {cardMeta.isComplete ? "Review Path" : "Continue Path"}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}
