import type { LessonRichContent } from "@/lib/learning/lesson-content";

export const limitGirisiVeYogunlasmaNoktasiLessonContent: LessonRichContent = {
  lessonId: "lesson-real-analysis-limit-introduction-and-accumulation-point",
  courseSlug: "real-analysis",
  lessonSlug: "limit-introduction-and-accumulation-point",
  status: "draft",
  version: 2,
  conceptIds: ["concept-sequences", "concept-limit", "concept-accumulation-point"],
  exerciseIds: [
    "ex-real-analysis-limit-intro-definition-01",
    "ex-real-analysis-limit-intro-sequence-02",
    "ex-real-analysis-limit-intro-accumulation-03",
    "ex-real-analysis-limit-intro-uniqueness-04",
  ],
  introducedConceptIds: ["concept-limit", "concept-accumulation-point"],
  review: {
    mathematicalAccuracy: "pass",
    pedagogy: "pass",
    language: "pass",
    technical: "pass",
    notes: [
      "Yoğunlaşma noktası açıklamalarına 'kendisine eşit olmayan nokta' koşulu eklendi.",
      "Komşuluk ve delinmiş komşuluk dili daha açık hale getirildi.",
      "Sabit dizi karşılaştırması, dizi limiti ile değer kümesinin yoğunlaşma noktası farkını belirginleştirecek şekilde düzeltildi.",
    ],
  },
  reviewNotes: [
    "Mathematical Review Sprint 1: yoğunlaşma noktası tanımı kendisinden farklı nokta şartıyla sıkılaştırıldı.",
    "Komşuluk/delinmiş komşuluk dili ders seviyesine uygun ama teknik olarak doğru biçimde yeniden yazıldı.",
    "Limit teklik örneği ve 1/n karşılaştırması gözden geçirilip notasyon Türkçe karakterlerle düzenlendi.",
  ],
  lastReviewedAt: "2026-08-15T00:00:00.000Z",
  reviewedBy: "Mathematical Review Sprint 1",
  intro:
    "Limit girişi, tek tek terimlerin nereye yaklaştığını okumayı; yoğunlaşma noktası ise bu yakınlaşmanın küme düzeyindeki izini görmeyi sağlar.",
  prerequisites: [
    { label: "Diziler", href: "/concepts?concept=sequences" },
    { label: "Gerçel sayılar", href: "/concepts?concept=real-numbers" },
    { label: "Kümeler", href: "/concepts?concept=sets" },
  ],
  studyGuide: [
    {
      title: "1. Limit eşitlik değil davranıştır",
      body: [
        "Bir dizinin limiti L ise, dizi terimleri yeterince ileride L'ye istenildiği kadar yaklaşır.",
        "Bu nedenle limit, sonlu bir anda durmak ya da L'ye tam eşitlenmek demek değildir.",
      ],
    },
    {
      title: "2. Yeterince büyük n fikrini kullan",
      body: [
        "Limit tanımında kritik unsur, belli bir indisten sonra bütün terimlerin hedef çevrede kalmasıdır.",
        "Bu sezgi, daha sonra 'her ε > 0 için yeterince büyük n' biçimindeki epsilon-N diline dönüşür.",
      ],
    },
    {
      title: "3. Yoğunlaşma noktasını kümece oku",
      body: [
        "Bir noktanın her komşuluğunda, o noktadan farklı küme noktaları bulunuyorsa o nokta yoğunlaşma noktasıdır.",
        "Eşdeğer olarak, her delinmiş komşuluğu küme ile kesişir; dizi örneklerinde limit adayları çoğu zaman böyle bir kümeye iz bırakır.",
      ],
    },
    {
      title: "4. Teklik burada ilk ciddi sonuçtur",
      body: [
        "Bir dizi iki farklı limite gidemez; çünkü yeterince ileride aynı anda iki ayrık dar çevrede kalamaz.",
        "Bu teklik, limit kavramının belirli ve kullanılabilir olmasını sağlar.",
      ],
    },
  ],
  keyConcepts: [
    {
      conceptId: "concept-sequences",
      summary: "Limit dili önce diziler üzerinden öğrenilir; terimler indis büyüdükçe sistemli bir ilerleme içindedir.",
    },
    {
      conceptId: "concept-limit",
      summary: "Her ε > 0 için yeterince büyük indislerden sonra hedef değere ε kadar yaklaşma davranışıdır.",
    },
    {
      conceptId: "concept-accumulation-point",
      summary: "Her komşuluğunda, kendisinden farklı küme noktaları bulunan noktadır.",
    },
  ],
  example: {
    title: "Örnek",
    expression: "a_n = 1/n",
    overview:
      "1/n dizisi, limit ile yoğunlaşma noktası dilini ilk kez birlikte görmek için ideal bir başlangıç örneğidir.",
    steps: [
      "n büyüdükçe 1/n küçülür ve 0'a doğru gider.",
      "Her ε > 0 için 1/n < ε olacak kadar büyük n seçilebilir.",
      "Bu nedenle dizinin limiti 0'dır.",
      "Aynı zamanda {1/n : n ∈ ℕ} kümesinin 0'ın her delinmiş komşuluğunda eleman bulunduğu için 0 yoğunlaşma noktasıdır.",
    ],
    contrastTitle: "Karşılaştır",
    contrast: [
      "Sabit 5 dizisinin limiti 5'tir; fakat değer kümesi yalnızca {5} olduğu için 5 bu kümenin yoğunlaşma noktası değildir.",
      "İzole bir noktanın her delinmiş komşuluğunda yeni eleman yoksa yoğunlaşma noktası kavramı da oluşmaz.",
    ],
    takeaway:
      "Bir dizinin limiti ile terim kümesinin yoğunlaşma noktaları farklı sorulardır; 1/n örneği bu iki dili aynı tabloda görünür kılar.",
  },
};
