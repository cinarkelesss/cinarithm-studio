import { notFound } from "next/navigation";

import { ReviewContentPage } from "@/components/learning/review-content-preview";
import { getBaseLessonRichContentByLessonId } from "@/data/learning/content";
import { learningCatalogIndex } from "@/lib/learning/catalog";

export default async function ReviewLessonContentRoutePage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const lesson = learningCatalogIndex.lessonMap.get(lessonId);
  const content = getBaseLessonRichContentByLessonId(lessonId);

  if (!lesson || !content) {
    notFound();
  }

  return <ReviewContentPage lessonId={lessonId} />;
}
