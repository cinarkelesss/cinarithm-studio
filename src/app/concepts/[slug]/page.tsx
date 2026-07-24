import { notFound } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { concepts, getConceptBySlug, getConceptsBySlugs } from "@/data/concepts";
import { studyNotes } from "@/data/notes";

type ConceptDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return concepts.map((concept) => ({ slug: concept.slug }));
}

export default async function ConceptDetailPage({
  params,
}: ConceptDetailPageProps) {
  const { slug } = await params;
  const concept = getConceptBySlug(slug);

  if (!concept) {
    notFound();
  }

  const prerequisites = getConceptsBySlugs(concept.prerequisites);
  const related = getConceptsBySlugs(concept.related);
  const linkedNotes = studyNotes.filter((note) =>
    note.linkedConceptSlugs.includes(concept.slug)
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl">
        <div className="glass-panel rounded-[32px] p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            {concept.domain}
          </p>
          <h1 className="mt-3 text-4xl font-bold text-white">{concept.title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-400">
            {concept.summary}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-slate-300">
              Mastery %{concept.mastery}
            </span>
            <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-slate-300">
              Course {concept.courseSlug}
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <section className="glass-panel rounded-[28px] p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Proof Pattern
              </p>
              <h2 className="mt-2 text-2xl font-bold">Nasıl düşünülmeli?</h2>
              <p className="mt-4 leading-7 text-slate-400">
                {concept.proofPattern}
              </p>
            </section>

            <section className="glass-panel rounded-[28px] p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Problem Signal
              </p>
              <h2 className="mt-2 text-2xl font-bold">Soru tipi bağlantısı</h2>
              <p className="mt-4 leading-7 text-slate-400">
                {concept.questionSignal}
              </p>
            </section>

            <section className="glass-panel rounded-[28px] p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Linked Notes
              </p>
              <h2 className="mt-2 text-2xl font-bold">Workspace bağlantıları</h2>
              <div className="mt-5 space-y-3">
                {linkedNotes.length > 0 ? (
                  linkedNotes.map((note) => (
                    <article
                      key={note.id}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <p className="font-semibold text-white">{note.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {note.summary}
                      </p>
                    </article>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    Bu kavrama bağlı workspace notu henüz oluşturulmadı.
                  </p>
                )}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="glass-panel rounded-[28px] p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Prerequisites
              </p>
              <h2 className="mt-2 text-xl font-bold">Önkoşullar</h2>
              <div className="mt-4 space-y-3">
                {prerequisites.length > 0 ? (
                  prerequisites.map((item) => (
                    <div
                      key={item.slug}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <p className="font-semibold text-white">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-400">{item.summary}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    Bu kavram, graph içindeki giriş düğümlerinden biri.
                  </p>
                )}
              </div>
            </section>

            <section className="glass-panel rounded-[28px] p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Related
              </p>
              <h2 className="mt-2 text-xl font-bold">Komşu düğümler</h2>
              <div className="mt-4 space-y-3">
                {related.map((item) => (
                  <div
                    key={item.slug}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-400">{item.summary}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
