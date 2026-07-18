import CourseCard from "./CourseCard";

export default function CourseGrid() {
  return (
    <section className="mt-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Kurslar</h2>

        <button className="text-sm text-primary hover:underline">
          Tümünü Gör
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <CourseCard />
        <CourseCard />
        <CourseCard />
      </div>
    </section>
  );
}