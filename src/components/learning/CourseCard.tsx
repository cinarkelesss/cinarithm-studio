import { ArrowRight, BookOpen } from "lucide-react";

export default function CourseCard() {
  return (
    <div className="group cursor-pointer rounded-3xl border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-primary" />

        <h3 className="text-xl font-semibold">
          Matematiğin Temelleri
        </h3>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        Matematiksel düşünmenin temellerini oluştur.
      </p>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-sm">
          <span>İlerleme</span>
          <span className="font-medium">%78</span>
        </div>

        <div className="h-2 rounded-full bg-muted">
          <div className="h-2 w-[78%] rounded-full bg-primary" />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          28 Ders
        </span>

        <div className="flex items-center gap-1 text-primary">
          Devam Et

          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
}