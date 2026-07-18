import HeroCard from "@/components/learning/HeroCard";

export default function LearningPage() {
  return (
    <main className="mx-auto max-w-7xl p-8">
      <h1 className="text-4xl font-bold">
        Learning Hub
      </h1>

      <p className="mt-2 text-muted-foreground">
        Continue your mathematics journey.
      </p>

      <HeroCard />
    </main>
  );
}