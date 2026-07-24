"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { getConceptsByCourseSlug } from "@/data/concepts";
import type { Course } from "@/types/course";
import {
  getCompletedLessonsServerSnapshot,
  getCompletedLessonsSnapshot,
  getCourseLessonStats,
  getLessonStatusIcon,
  getResolvedModules,
  slugifyLessonTitle,
  subscribeToCompletedLessons,
} from "@/lib/learning";

type CourseOverviewClientProps = {
  course: Course;
};

export default function CourseOverviewClient({
  course,
}: CourseOverviewClientProps) {
  const completedLessonIds = useSyncExternalStore(
    subscribeToCompletedLessons,
    getCompletedLessonsSnapshot,
    getCompletedLessonsServerSnapshot
  );
  const courseStats = getCourseLessonStats(course, completedLessonIds);
  const resolvedModules = getResolvedModules(course, completedLessonIds);
  const courseConcepts = getConceptsByCourseSlug(course.slug);

  if (course.modules.length === 0) {
    return (
      <>
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <p>İlerleme: %{course.progress}</p>
          <p>Ders Sayısı: {course.lessons}</p>
          <p>Kavram Sayısı: {course.conceptCount}</p>
        </div>

        <section className="mt-10 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Roadmap
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Bu kursun ders akışı hazırlanıyor
            </h2>
            <p className="mt-3 max-w-2xl text-slate-400">
              Şimdilik bu yol için kavram omurgasını ve concept graph bağlantılarını
              kullanabilirsin. Modüller eklendiğinde aynı ekran otomatik olarak ders
              yapısına dönüşecek.
            </p>
          </div>

          {courseConcepts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {courseConcepts.map((concept) => (
                <Link
                  key={concept.slug}
                  href={`/concepts/${concept.slug}`}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/8"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    {concept.domain}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-white">
                    {concept.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {concept.summary}
                  </p>
                  <p className="mt-4 text-sm text-sky-300">
                    Concept sayfasını aç →
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <section className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-400">
              Bu kurs için concept graph bağlantıları henüz eklenmedi.
            </section>
          )}
        </section>
      </>
    );
  }

  return (
    <>
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <p>İlerleme: %{courseStats.progress}</p>
        <p>
          Tamamlanan Ders: {courseStats.completedLessons} / {courseStats.totalLessons}
        </p>
        <p>Kavram Sayısı: {course.conceptCount}</p>
      </div>

      <section className="mt-10 space-y-6">
        {resolvedModules.map((moduleItem) => (
          <div
            key={moduleItem.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">
                  {moduleItem.isUnlocked ? "📚" : "🔒"} {moduleItem.title}
                </h2>

                <p className="mt-2 text-slate-400">{moduleItem.description}</p>
              </div>

              <div className="min-w-40">
                <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-500">
                  <span>
                    {moduleItem.isCompleted
                      ? "Completed"
                      : moduleItem.isUnlocked
                        ? "Active"
                        : "Locked"}
                  </span>
                  <span>%{moduleItem.progress}</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-400 via-blue-400 to-violet-500"
                    style={{ width: `${moduleItem.progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {moduleItem.lessons.map((lesson) => {
                const lessonSlug = slugifyLessonTitle(lesson.title);

                if (!moduleItem.isUnlocked) {
                  return (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between rounded-xl bg-black/20 p-4 opacity-70"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🔒</span>

                        <div>
                          <p className="font-medium">{lesson.title}</p>
                          <p className="text-sm text-slate-400">
                            {lesson.duration}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={lesson.id}
                    href={`/learning/course/${course.slug}/lesson/${lessonSlug}`}
                    className="flex items-center justify-between rounded-xl bg-black/20 p-4 transition hover:bg-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">
                        {getLessonStatusIcon(course.slug, lesson, completedLessonIds)}
                      </span>

                      <div>
                        <p className="font-medium">{lesson.title}</p>

                        <p className="text-sm text-slate-400">
                          {lesson.duration}
                        </p>
                      </div>
                    </div>

                    <span className="text-slate-500">→</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
