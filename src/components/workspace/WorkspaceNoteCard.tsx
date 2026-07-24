import type { WorkspaceDisplayNote } from "@/lib/learning";

type WorkspaceNoteCardProps = {
  note: WorkspaceDisplayNote;
};

const statusTone = {
  draft: "border-amber-400/20 bg-amber-400/10 text-amber-100",
  linked: "border-emerald-400/20 bg-emerald-400/10 text-emerald-100",
  review: "border-sky-400/20 bg-sky-400/10 text-sky-100",
};

export default function WorkspaceNoteCard({
  note,
}: WorkspaceNoteCardProps) {
  return (
    <article className="glass-panel rounded-[24px] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            {note.collection}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-white">{note.title}</h3>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.18em] ${statusTone[note.status]}`}
        >
          {note.status}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-400">{note.summary}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {note.linkedConceptTitles.map((title) => (
          <span
            key={title}
            className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-slate-300"
          >
            {title}
          </span>
        ))}
      </div>

      <p className="mt-4 text-xs uppercase tracking-[0.18em] text-slate-500">
        Updated {note.updatedAt}
      </p>
    </article>
  );
}
