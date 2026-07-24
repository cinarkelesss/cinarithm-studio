import AppShell from "@/components/layout/AppShell";
import WorkspaceNotesClient from "@/components/workspace/WorkspaceNotesClient";

export default function WorkspacePage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Workspace
          </p>
          <h1 className="mt-2 text-4xl font-bold">Linked Notes Workspace</h1>
          <p className="mt-3 text-slate-400">
            Kişisel notlarını concept graph ile bağlayarak her çalışmayı
            tekrar kullanılabilir bir bilgi düğümüne dönüştür.
          </p>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <WorkspaceNotesClient />

          <aside className="space-y-6">
            <section className="glass-panel rounded-[28px] p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Capture Flow
              </p>
              <h2 className="mt-2 text-2xl font-bold">Nasıl işleyecek?</h2>
              <div className="mt-5 space-y-3">
                {[
                  "Ders sırasında kısa not yakala",
                  "Notu concept slug ile bağla",
                  "Problemlerden kanıt veya hata örneği ekle",
                  "Review kuyruğuna geri gönder",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className="text-sm font-semibold text-white">
                      0{index + 1}
                    </p>
                    <p className="mt-2 text-sm text-slate-400">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="glass-panel rounded-[28px] p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Collections
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Analysis Notes", "Linear Algebra", "Proof Writing", "Problem System"].map(
                  (collection) => (
                    <span
                      key={collection}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300"
                    >
                      {collection}
                    </span>
                  )
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
