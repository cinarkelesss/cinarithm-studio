import Link from "next/link";
import { ArrowRight, Network, Sparkles } from "lucide-react";
import type { Concept } from "@/types/concept";

type ConceptCardProps = {
  concept: Concept;
  prerequisiteTitles: string[];
};

const statusTone = {
  stable: "border-emerald-400/20 bg-emerald-400/10 text-emerald-100",
  growing: "border-sky-400/20 bg-sky-400/10 text-sky-100",
  new: "border-violet-400/20 bg-violet-400/10 text-violet-100",
};

export default function ConceptCard({
  concept,
  prerequisiteTitles,
}: ConceptCardProps) {
  return (
    <article className="glass-panel rounded-[28px] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            {concept.domain}
          </p>
          <h3 className="mt-2 text-2xl font-bold text-white">{concept.title}</h3>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.18em] ${statusTone[concept.status]}`}
        >
          {concept.status}
        </span>
      </div>

      <p className="mt-4 leading-7 text-slate-400">{concept.summary}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-slate-300">
          Mastery %{concept.mastery}
        </span>
        <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-slate-300">
          {concept.related.length} connected nodes
        </span>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
          <Sparkles className="h-4 w-4 text-sky-300" />
          Proof Pattern
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          {concept.proofPattern}
        </p>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
          <Network className="h-4 w-4 text-violet-300" />
          Prerequisites
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {prerequisiteTitles.length > 0 ? (
            prerequisiteTitles.map((title) => (
              <span
                key={title}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300"
              >
                {title}
              </span>
            ))
          ) : (
            <span className="text-sm text-slate-500">Bu kavram giriş noktası.</span>
          )}
        </div>
      </div>

      <Link
        href={`/concepts/${concept.slug}`}
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 font-medium text-slate-950 transition hover:gap-3"
      >
        Open Concept
        <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}
