"use client";

import FoundationsIllustration from "./FoundationsIllustration";
import { courses } from "@/data/courses";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  getCompletedLessonsServerSnapshot,
  getCompletedLessonsSnapshot,
  getCourseContinueLabel,
  getCourseLessonStats,
  getNextLessonForCourse,
  subscribeToCompletedLessons,
} from "@/lib/learning";

export default function HeroCard() {
  const featuredCourse = courses[0];
  const completedLessonIds = useSyncExternalStore(
    subscribeToCompletedLessons,
    getCompletedLessonsSnapshot,
    getCompletedLessonsServerSnapshot
  );
  const courseStats = getCourseLessonStats(featuredCourse, completedLessonIds);
  const nextLesson = getNextLessonForCourse(featuredCourse, completedLessonIds);
  const continueHref = nextLesson
    ? nextLesson.href
    : `/learning/course/${featuredCourse.slug}`;
  const continueLabel = getCourseContinueLabel(
    featuredCourse,
    completedLessonIds
  );

  return (
    <section className="glass-panel subtle-grid relative mt-8 overflow-hidden rounded-[32px] border border-white/10 p-8 shadow-[0_30px_90px_rgba(2,8,23,0.35)] sm:p-10">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-widest text-sky-300">
          Continue Track
        </p>

        <h2 className="mt-4 text-5xl font-bold tracking-tight">
          {featuredCourse.title}
        </h2>

        <p className="mt-3 text-xl text-slate-400">
          {continueLabel}
        </p>

        <div className="mt-8 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/6 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl">
            🎯
          </div>

          <div>
            <p className="font-semibold text-white">Bu Haftanın Hedefi</p>

            <p className="text-sm text-slate-400">
              {featuredCourse.weeklyGoal}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-300">İlerleme</p>
            <p className="text-sm font-medium text-slate-300">
              {courseStats.completedLessons} / {courseStats.totalLessons || featuredCourse.lessons} ders
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 via-blue-400 to-violet-500"
                style={{ width: `${courseStats.progress}%` }}
              />
            </div>

            <span className="whitespace-nowrap text-sm font-semibold text-white">
              %{courseStats.progress}
            </span>
          </div>

          <p className="mt-3 text-sm text-slate-500">
            {featuredCourse.conceptCount} bağlı kavram, {featuredCourse.track} hattı
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href={continueHref}
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-semibold text-black transition hover:scale-[1.01]"
          >
            <span className="text-black">
              {nextLesson ? "Continue Lesson" : "Open Course"}
            </span>
            <span className="text-black">→</span>
          </Link>

          <Link
            href="/concepts"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/6 px-6 py-3 font-semibold text-slate-200 hover:bg-white/10"
          >
            Open Concept Graph
          </Link>
        </div>
      </div>

      <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 lg:block">
        <FoundationsIllustration />
      </div>
    </section>
  );
}
