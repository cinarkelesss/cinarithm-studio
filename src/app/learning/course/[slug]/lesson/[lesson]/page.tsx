import Link from "next/link";
import { notFound } from "next/navigation";
import { getSuggestedConceptsForLesson } from "@/data/concepts";
import { courses } from "@/data/courses";
import AIAssistant from "@/components/learning/AIAssistant";
import LessonCompletionCard from "@/components/learning/LessonCompletionCard";
import LessonNotesEditor from "@/components/learning/LessonNotesEditor";
import { slugifyLessonTitle } from "@/lib/learning";

type Props = {
  params: Promise<{
    slug: string;
    lesson: string;
  }>;
};

export default async function LessonPage({ params }: Props) {
  const { slug, lesson } = await params;

  const course = courses.find((c) => c.slug === slug);

  if (!course) {
    notFound();
  }

  let currentModule:
    | (typeof course.modules)[number]
    | undefined;

  let currentLesson:
    | (typeof course.modules)[number]["lessons"][number]
    | undefined;

  for (const courseModule of course.modules) {
    currentLesson = courseModule.lessons.find(
      (l) => slugifyLessonTitle(l.title) === lesson
    );

    if (currentLesson) {
      currentModule = courseModule;
      break;
    }
  }

  if (!currentLesson || !currentModule) {
    notFound();
  }

  const lessonSequence = course.modules.flatMap((courseModule) =>
    courseModule.lessons.map((moduleLesson) => ({
      title: moduleLesson.title,
      href: `/learning/course/${course.slug}/lesson/${slugifyLessonTitle(
        moduleLesson.title
      )}`,
    }))
  );
  const currentLessonIndex = lessonSequence.findIndex(
    (item) => item.title === currentLesson.title
  );
  const previousLesson =
    currentLessonIndex > 0 ? lessonSequence[currentLessonIndex - 1] : null;
  const nextLesson =
    currentLessonIndex >= 0 && currentLessonIndex < lessonSequence.length - 1
      ? lessonSequence[currentLessonIndex + 1]
      : null;
  const suggestedConcepts = getSuggestedConceptsForLesson({
    courseSlug: course.slug,
    moduleTitle: currentModule.title,
    lessonConcepts: currentLesson.concepts,
  });

  return (
    <main className="mx-auto max-w-7xl p-10">
      <Link
        href={`/learning/course/${course.slug}`}
        className="inline-flex text-sky-400 hover:text-sky-300"
      >
        ← {course.title}
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <section>
          <p className="text-sky-400 uppercase tracking-widest">
            {currentModule.title}
          </p>

          <h1 className="mt-2 text-5xl font-bold">
            {currentLesson.title}
          </h1>

          <p className="mt-3 text-slate-400">
            ⏱ {currentLesson.duration}
          </p>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold">
              🎥 Video
            </h2>

            {currentLesson.videoUrl ? (
              <Link
                href={currentLesson.videoUrl}
                target="_blank"
                className="mt-4 inline-flex rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950"
              >
                Videoyu Aç
              </Link>
            ) : (
              <p className="mt-4 text-slate-400">
                Bu ders için video linki daha eklenmedi.
              </p>
            )}
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold">
              📖 Ders Özeti
            </h2>

            <p className="mt-4 leading-7 text-slate-300">
              {currentLesson.summary ||
                "Bu dersin akademik özeti henüz eklenmedi."}
            </p>
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold">
              🧠 Ana Kavramlar
            </h2>

            {currentLesson.concepts.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-3">
                {currentLesson.concepts.map((concept) => (
                  <span
                    key={concept}
                    className="rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sm text-sky-200"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-slate-400">
                Bu ders için kavram listesi henüz eklenmedi.
              </p>
            )}
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold">
              🌐 Concept Graph Bağlantıları
            </h2>

            {suggestedConcepts.length > 0 ? (
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {suggestedConcepts.map((concept) => (
                  <Link
                    key={concept.slug}
                    href={`/concepts/${concept.slug}`}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/8"
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      {concept.domain}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-white">
                      {concept.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {concept.summary}
                    </p>
                    <p className="mt-4 text-sm text-sky-300">
                      Open Concept →
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-slate-400">
                Bu ders için concept graph bağlantısı henüz hazırlanmadı.
              </p>
            )}
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold">
              📝 Kendi Notların
            </h2>

            <LessonNotesEditor
              courseSlug={course.slug}
              courseTitle={course.title}
              moduleTitle={currentModule.title}
              lessonTitle={currentLesson.title}
              concepts={currentLesson.concepts}
            />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {previousLesson ? (
              <Link
                href={previousLesson.href}
                className="rounded-2xl border border-white/10 px-5 py-3 text-slate-300 hover:bg-white/6"
              >
                ← {previousLesson.title}
              </Link>
            ) : null}

            {nextLesson ? (
              <Link
                href={nextLesson.href}
                className="rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950"
              >
                {nextLesson.title} →
              </Link>
            ) : null}
          </div>

        </section>

        <aside className="space-y-8">
          <LessonCompletionCard
            courseSlug={course.slug}
            courseTitle={course.title}
            moduleTitle={currentModule.title}
            lessonTitle={currentLesson.title}
            initialCompleted={currentLesson.completed}
          />

          <AIAssistant />
        </aside>
      </div>
    </main>
  );
}
