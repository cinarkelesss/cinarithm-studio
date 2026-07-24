import Link from "next/link";
import { notFound } from "next/navigation";
import CourseOverviewClient from "@/components/learning/CourseOverviewClient";
import { courses } from "@/data/courses";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CoursePage({ params }: Props) {
  const { slug } = await params;

  const course = courses.find((c) => c.slug === slug);

  if (!course) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl p-10">
      <Link
        href="/learning"
        className="mb-8 inline-flex text-sky-400 hover:text-sky-300"
      >
        ← Learning Hub
      </Link>

      <h1 className="mt-4 text-5xl font-bold">{course.title}</h1>

      <p className="mt-4 text-slate-400">{course.description}</p>

      <CourseOverviewClient course={course} />
    </main>
  );
}
