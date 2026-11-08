import type { LessonRichContent } from "@/lib/learning/lesson-content";

export const ustelFonksiyonlarVeLimitleriLessonContent: LessonRichContent = {
  lessonId: "lesson-real-analysis-ustel-fonksiyonlar-ve-limitleri",
  courseSlug: "real-analysis",
  lessonSlug: "ustel-fonksiyonlar-ve-limitleri",
  status: "draft",
  version: 2,
  conceptIds: ["concept-continuity", "concept-limit", "concept-real-numbers", "concept-functions"],
  exerciseIds: [
    "ex-real-analysis-exponential-limits-monotone-01",
    "ex-real-analysis-exponential-limits-zero-02",
    "ex-real-analysis-exponential-limits-log-link-03",
    "ex-real-analysis-exponential-limits-continuity-04",
  ],
  review: {
    mathematicalAccuracy: "pass",
    pedagogy: "pass",
    language: "pass",
    technical: "pass",
    notes: [
      "Üstel fonksiyon için a > 0 ve gerekli yerlerde a ≠ 1 varsayımları açıklandı.",
      "Monotonluk 0 < a < 1 ve a > 1 durumlarına ayrıldı.",
      "Logaritma bağlantısı yalnızca pozitif ifadeler ve uygun ileri teknik bağlamında daraltıldı.",
    ],
  },
  reviewNotes: [
    "Mathematical Review Sprint 2: üs tabanı koşulları açık hale getirildi.",
    "Logaritma dönüşümü, pozitif ifadeler için yardımcı ileri teknik olarak sınırlandı.",
    "Üstel süreklilik ve x → 0 limiti daha kesin varsayımlarla yazıldı.",
  ],
  lastReviewedAt: "2026-08-15T00:00:00.000Z",
  reviewedBy: "Mathematical Review Sprint 2",
  intro:
    "Üstel fonksiyonlar ve limitleri dersi, a > 0 tabanlı üstel fonksiyonların limit ve süreklilik davranışını taban koşullarını kaybetmeden okumayı amaçlar.",
  prerequisites: [
    { label: "Limit", href: "/concepts?concept=limit" },
    { label: "Süreklilik", href: "/concepts?concept=continuity" },
    { label: "Fonksiyonlar", href: "/concepts?concept=functions" },
  ],
  studyGuide: [
    {
      title: "1. Üstel fonksiyonun yönünü taban belirler",
      body: [
        "a > 0 ve a ≠ 1 için a^x gerçel eksende tanımlıdır.",
        "a > 1 olduğunda a^x artan, 0 < a < 1 olduğunda ise azalan davranır.",
      ],
      statement: "a > 0, a ≠ 1 için x ↦ a^x tanımlıdır; a > 1 ise artan, 0 < a < 1 ise azalandır.",
    },
    {
      title: "2. x = 0 civarını ciddiye al",
      body: [
        "a > 0 için a^0 = 1 eşitliği, x → 0 limitlerinde doğal referans noktadır.",
        "Üstel fonksiyon sürekli olduğunda lim_{x→0} a^x = a^0 = 1 sonucuna doğrudan ulaşılır.",
      ],
    },
    {
      title: "3. Logaritma yalnızca pozitif ifadelerde yardımcıdır",
      body: [
        "Pozitif kalan kuvvetli ifadelerde logaritma almak üsleri çarpan olarak öne çıkarabilir.",
        "Bu teknik her zaman gerekli değildir; ayrıca logaritma tanımı için ifade pozitif kalmalıdır.",
      ],
    },
    {
      title: "4. Sonsuzdaki davranış da tabana bağlıdır",
      body: [
        "a > 1 ise x → ∞ iken a^x → ∞ ve x → -∞ iken a^x → 0 olur.",
        "0 < a < 1 ise bu davranışlar yer değiştirir; limit yorumunu yaparken tabanı unutmamak gerekir.",
      ],
    },
  ],
  keyConcepts: [
    {
      conceptId: "concept-limit",
      summary: "Limit, üstel fonksiyonun belirli nokta ya da sonsuz civarındaki davranışını ölçer.",
    },
    {
      conceptId: "concept-continuity",
      summary: "Süreklilik, limiti doğrudan fonksiyon değerine bağlayabildiğin temel ilkedir.",
    },
    {
      conceptId: "concept-real-numbers",
      summary: "Gerçel eksende üstel fonksiyon konuşmak için a > 0 varsayımı gerekir.",
    },
    {
      conceptId: "concept-functions",
      summary: "Üstel ifade önce fonksiyon olarak okunmalı; sonra taban koşullarıyla limit davranışı yorumlanmalıdır.",
    },
  ],
  example: {
    title: "Örnek",
    expression: "f(x) = 2^x",
    overview:
      "2^x fonksiyonu, hem a > 1 durumundaki büyümeyi hem de x = 0 civarındaki sürekliliği birlikte görmek için ideal bir örnektir.",
    steps: [
      "x = 0 için 2^x = 1 olur.",
      "x pozitife gittikçe değerler 1'in üzerine çıkar ve sınırsız büyür.",
      "x negatife gittikçe değerler 0 ile 1 arasına iner ama pozitif kalır.",
      "Bu tablo, üstel fonksiyonun sürekliliğini ve tabana bağlı tekdüze davranışını birlikte gösterir.",
    ],
    contrastTitle: "Karşılaştır",
    contrast: [
      "0 < a < 1 olsaydı aynı fonksiyon tipi bu kez azalan olurdu.",
      "Taban 1 olsaydı a^x sabit 1 fonksiyonu olurdu; bu yüzden a ≠ 1 koşulu monotonluk tartışmalarında önemlidir.",
    ],
    takeaway:
      "Üstel fonksiyonlar hızlı büyür ya da küçülür; ama bunu doğru okumak için taban koşullarını her adımda korumak gerekir.",
  },
};
