"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Filter, Search, Sigma } from "lucide-react";

import { SectionShell } from "@/components/app/section-shell";
import { useLearningWorkspace } from "@/components/providers/learning-workspace-provider";
import { learningCatalog } from "@/data/learning/curriculum";
import { getMasteryLevelLabel } from "@/lib/learning/ui-copy";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type ConceptsPageProps = {
  initialConceptSlug?: string;
};

export function ConceptsPage({ initialConceptSlug }: ConceptsPageProps) {
  const { getConceptMasteryValue } = useLearningWorkspace();
  const [query, setQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");

  const filteredConcepts = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("tr-TR");
    return learningCatalog.concepts.filter((concept) => {
      const matchesQuery =
        !normalized ||
        concept.name.toLocaleLowerCase("tr-TR").includes(normalized) ||
        concept.description.toLocaleLowerCase("tr-TR").includes(normalized);

      const matchesCourse =
        courseFilter === "all" || concept.courseIds.includes(courseFilter);

      const matchesInitial = initialConceptSlug ? concept.slug === initialConceptSlug : true;

      return matchesQuery && matchesCourse && matchesInitial;
    });
  }, [courseFilter, initialConceptSlug, query]);

  return (
    <SectionShell
      eyebrow="Kavramlar"
      title="Kavram Kütüphanesi"
      description="Kavram ağacını devasa bir görsele çevirmeden önce arama, filtre ve hakimiyet ile okunabilir hale getiriyoruz."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <Card className="surface-glow border-border bg-card backdrop-blur-xl md:col-span-2">
          <CardContent className="grid gap-4 px-5 py-5 sm:px-6 lg:grid-cols-[1fr_220px]">
            <label className="flex items-center gap-3 rounded-2xl border border-white/8 bg-black/12 px-4 py-3 text-sm text-white/56">
              <Search className="size-4" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Supremum, compactness, group..."
                className="w-full bg-transparent text-white outline-none placeholder:text-white/30"
              />
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-white/8 bg-black/12 px-4 py-3 text-sm text-white/56">
              <Filter className="size-4" />
              <select
                value={courseFilter}
                onChange={(event) => setCourseFilter(event.target.value)}
                className="w-full bg-transparent text-white outline-none"
              >
                <option value="all">Tüm kurslar</option>
                {learningCatalog.courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </label>
          </CardContent>
        </Card>

        <Card className="surface-glow border-border bg-card backdrop-blur-xl">
          <CardContent className="space-y-3 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-2 text-sm text-white/66">
              <Sigma className="size-4" />
              <span>Şu an görünenler</span>
            </div>
            <p className="font-heading text-3xl text-white">{filteredConcepts.length}</p>
            <p className="text-sm leading-6 text-white/45">
              Filtre sonrası ekranda görünen kavram sayısı.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {filteredConcepts.map((concept) => {
          const mastery = getConceptMasteryValue(concept.id);
          return (
            <Card
              key={concept.id}
              className="surface-glow border-border bg-card backdrop-blur-xl"
            >
              <CardContent className="space-y-4 px-5 py-5 sm:px-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-white/66">
                      <Sigma className="size-4" />
                      <span>{concept.slug}</span>
                    </div>
                    <h2 className="mt-3 font-heading text-2xl text-white">{concept.name}</h2>
                    <p className="mt-3 text-sm leading-7 text-white/52">
                      {concept.description}
                    </p>
                  </div>

                  <div className="min-w-[108px] rounded-[24px] border border-white/8 bg-black/12 px-3 py-3 text-center">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/32">Hakimiyet</p>
                    <p className="mt-2 text-xl font-semibold text-white">{mastery.score}</p>
                    <p className="mt-1 text-xs text-white/48">{getMasteryLevelLabel(mastery.level)}</p>
                  </div>
                </div>

                <Progress
                  value={mastery.score}
                  className="[&_[data-slot='progress-track']]:h-2 [&_[data-slot='progress-track']]:bg-white/8 [&_[data-slot='progress-indicator']]:bg-white"
                />

                <div className="space-y-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-white/32">Kurslar</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {concept.courseIds.map((courseId) => {
                        const course = learningCatalog.courses.find((item) => item.id === courseId);
                        return course ? (
                          <Link key={courseId} href={`/learning/course/${course.slug}`}>
                            <Badge className="bg-white/10 text-white/72">{course.shortTitle}</Badge>
                          </Link>
                        ) : (
                          <Badge key={courseId} className="bg-white/10 text-white/72">
                            {courseId}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-white/32">
                      Önkoşullar
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {concept.prerequisiteIds.length > 0 ? (
                        concept.prerequisiteIds.map((prerequisiteId) => {
                          const prerequisite = learningCatalog.concepts.find(
                            (item) => item.id === prerequisiteId
                          );
                          return (
                            <Badge key={prerequisiteId} className="bg-white/10 text-white/72">
                              {prerequisite?.name ?? prerequisiteId}
                            </Badge>
                          );
                        })
                      ) : (
                        <Badge className="bg-white/10 text-white/72">Yok</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </SectionShell>
  );
}
