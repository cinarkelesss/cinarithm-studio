import type { Concept } from "@/types/concept";

type ConceptRelationshipMapProps = {
  title: string;
  concepts: Concept[];
};

export default function ConceptRelationshipMap({
  title,
  concepts,
}: ConceptRelationshipMapProps) {
  return (
    <section className="glass-panel rounded-[28px] p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Graph
          </p>
          <h2 className="mt-2 text-2xl font-bold">{title}</h2>
        </div>

        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
          {concepts.length} Nodes
        </span>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {concepts.map((concept) => (
          <div
            key={concept.slug}
            className="rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">{concept.title}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                  {concept.domain}
                </p>
              </div>

              <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-slate-300">
                %{concept.mastery}
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 via-blue-400 to-violet-500"
                style={{ width: `${concept.mastery}%` }}
              />
            </div>

            <p className="mt-3 text-sm text-slate-400">
              {concept.related.length} ilişki, {concept.prerequisites.length} önkoşul
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
