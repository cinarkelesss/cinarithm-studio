import AppShell from "@/components/layout/AppShell";
import ConceptCard from "@/components/concepts/ConceptCard";
import ConceptRelationshipMap from "@/components/concepts/ConceptRelationshipMap";
import { concepts, getConceptsBySlugs } from "@/data/concepts";

export default function ConceptsPage() {
  const featuredConcepts = concepts.slice(0, 4);

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Concepts
          </p>
          <h1 className="mt-2 text-4xl font-bold">Knowledge Graph</h1>
          <p className="mt-3 text-slate-400">
            Teoremler, tanımlar ve proof pattern’lerini bağlantılı bir bilgi
            ağı içinde takip ederek öğrenmeyi daha sistematik hale getir.
          </p>
        </div>

        <div className="mt-8">
          <ConceptRelationshipMap
            title="Core Concept Map"
            concepts={featuredConcepts}
          />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          {concepts.map((concept) => (
            <ConceptCard
              key={concept.slug}
              concept={concept}
              prerequisiteTitles={getConceptsBySlugs(concept.prerequisites).map(
                (item) => item.title
              )}
            />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
