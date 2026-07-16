import AppShell from "@/components/layout/AppShell";

export default function OsymPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight">
            ÖSYM Database
          </h1>

          <p className="mt-2 text-zinc-400">
            Manage and search all ÖSYM mathematics questions.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-10">
          <p className="text-zinc-400">
            Database module is under construction...
          </p>
        </div>
      </div>
    </AppShell>
  );
}