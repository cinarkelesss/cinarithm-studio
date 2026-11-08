import { notFound } from "next/navigation";

import { CoursePage } from "@/components/learning/routes/course-page";
import { getCourseBySlug } from "@/lib/learning/catalog";

export default async function LearningCourseRoutePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  return <CoursePage course={course} />;
}
