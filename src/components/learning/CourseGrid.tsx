import Link from "next/link";
import CourseCard from "./CourseCard";
import { courses } from "@/data/courses";

export default function CourseGrid() {
  return (
    <section className="mt-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Paths
          </p>
          <h2 className="mt-2 text-2xl font-bold">Aktif Öğrenme Yolları</h2>
        </div>

        <Link
          href="/workspace"
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/6"
        >
          Workspace
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.id} {...course} />
        ))}
      </div>
    </section>
  );
}
