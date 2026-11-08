import { notFound } from "next/navigation";

import { LessonPage } from "@/components/learning/routes/lesson-page";
import { getCourseBySlug, learningCatalogIndex } from "@/lib/learning/catalog";

export default async function LearningLessonRoutePage({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>;
}) {
  const { slug, lessonSlug } = await params;
  const course = getCourseBySlug(slug);
  const lesson = learningCatalogIndex.lessonBySlug.get(lessonSlug);

  if (!course || !lesson || lesson.courseId !== course.id) {
    notFound();
  }

  return <LessonPage course={course} lesson={lesson} />;
}
