import type { StudyNote } from "@/types/note";

export const studyNotes: StudyNote[] = [
  {
    id: 1,
    title: "Limit tanımı ve sezgisi",
    updatedAt: "19 Jul 2026",
    summary:
      "Epsilon-delta tanımını görsel sezgiyle sadeleştiren ve hata payını örneklerle açan çalışma notu.",
    status: "linked",
    collection: "Analysis Notes",
    linkedConceptSlugs: ["limit-definition", "metric-space"],
  },
  {
    id: 2,
    title: "Kernel ve image köprüsü",
    updatedAt: "18 Jul 2026",
    summary:
      "Lineer dönüşümlerde kernel-image ikilisini baz seçimiyle bağlayan kısa referans.",
    status: "linked",
    collection: "Linear Algebra",
    linkedConceptSlugs: ["linear-transformation"],
  },
  {
    id: 3,
    title: "İspat kalıbı: contradiction checklist",
    updatedAt: "17 Jul 2026",
    summary:
      "Çelişki ile ispat kurarken tekrar edilen hataları azaltmak için kısa kontrol listesi.",
    status: "review",
    collection: "Proof Writing",
    linkedConceptSlugs: ["proof-techniques", "mathematical-logic"],
  },
  {
    id: 4,
    title: "ÖSYM türev etiket şeması",
    updatedAt: "16 Jul 2026",
    summary:
      "Problem bankasında türev sorularını konu, teknik ve hata türüne göre ayıran ilk taslak.",
    status: "draft",
    collection: "Problem System",
    linkedConceptSlugs: ["limit-definition"],
  },
];
