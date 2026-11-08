import { notFound } from "next/navigation";

import { getEmbeddedLearningPage } from "@/lib/embedded-learning-pages";

type EmbeddedLearningPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return ["tanim-okuma-karti", "ispat-akisi-karti"].map((slug) => ({ slug }));
}

export default async function EmbeddedLearningPage({
  params,
}: EmbeddedLearningPageProps) {
  const { slug } = await params;
  const page = getEmbeddedLearningPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#09090b] px-5 py-8 text-white sm:px-8">
      <article className="mx-auto max-w-3xl rounded-[2rem] border border-[#27272a] bg-[#18181b] p-6 shadow-[0_24px_64px_rgba(0,0,0,0.3)]">
        <p className="text-xs uppercase tracking-[0.24em] text-zinc-300/72">
          {page.eyebrow}
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
          {page.title}
        </h1>
        <p className="mt-4 text-base leading-8 text-white/72">{page.summary}</p>

        <section className="mt-8 rounded-[1.5rem] border border-white/8 bg-black/20 p-5">
          <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-white/52">
            Adım adım
          </h2>
          <ol className="mt-4 space-y-3 text-sm leading-7 text-white/78">
            {page.bullets.map((bullet) => (
              <li key={bullet} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                {bullet}
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-6 rounded-[1.5rem] border border-zinc-300/16 bg-zinc-300/10 p-5">
          <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-200">
            Mini görev
          </h2>
          <p className="mt-3 text-sm leading-7 text-zinc-50/88">
            {page.prompt}
          </p>
        </section>
      </article>
    </main>
  );
}
