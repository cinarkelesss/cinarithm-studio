import { ConceptsPage } from "@/components/learning/routes/concepts-page";

export default async function ConceptsRoutePage({
  searchParams,
}: {
  searchParams: Promise<{ concept?: string }>;
}) {
  const params = await searchParams;
  return <ConceptsPage initialConceptSlug={params.concept} />;
}
