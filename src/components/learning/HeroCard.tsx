export default function HeroCard() {
  return (
    <section className="mt-8 rounded-3xl border bg-card p-8 shadow-sm">
      <p className="text-sm text-muted-foreground">
        Continue Learning
      </p>

      <h2 className="mt-3 text-3xl font-bold">
        Foundations
      </h2>

      <p className="mt-2 text-muted-foreground">
        Proof Techniques • Lesson 6
      </p>

      <div className="mt-6">
        <div className="h-2 w-full rounded-full bg-muted">
          <div className="h-2 w-[78%] rounded-full bg-primary" />
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          78% Complete
        </p>
      </div>

      <button className="mt-8 rounded-xl bg-primary px-5 py-2 text-primary-foreground transition hover:opacity-90">
        Continue Learning
      </button>
    </section>
  );
}