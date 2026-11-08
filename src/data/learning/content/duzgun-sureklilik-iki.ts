import type { LessonRichContent } from "@/lib/learning/lesson-content";

export const duzgunSureklilikIkiLessonContent: LessonRichContent = {
  lessonId: "lesson-real-analysis-uniform-continuity-2",
  courseSlug: "real-analysis",
  lessonSlug: "uniform-continuity-2",
  status: "draft",
  version: 2,
  conceptIds: ["concept-continuity", "concept-uniform-continuity", "concept-functions"],
  exerciseIds: [
    "ex-real-analysis-uniform-continuity-2-composition-01",
    "ex-real-analysis-uniform-continuity-2-lipschitz-02",
    "ex-real-analysis-uniform-continuity-2-interval-03",
    "ex-real-analysis-uniform-continuity-2-difference-04",
  ],
  review: {
    mathematicalAccuracy: "pass",
    pedagogy: "pass",
    language: "pass",
    technical: "pass",
    notes: [
      "Sprint 1 ve yayınlı Düzgün Süreklilik dersiyle niceleyici dili hizalandı.",
      "Lipschitz örneğinde L = 0 ayrıksı durumu kapatıldı.",
      "Kapanış özellikleri ve tanım kümesi vurgusu daha kesin hale getirildi.",
    ],
  },
  reviewNotes: [
    "Mathematical Review Sprint 2: noktasal süreklilik ile düzgün süreklilik niceleyicileri açıkça ayrıldı.",
    "Lipschitz kısayolu L ≥ 0 varsayımıyla yeniden yazıldı.",
    "Yayınlı Düzgün Süreklilik dersiyle terim birliği korundu.",
  ],
  lastReviewedAt: "2026-08-15T00:00:00.000Z",
  reviewedBy: "Mathematical Review Sprint 2",
  intro:
    "İkinci düzgün süreklilik dersi, yayınlı ilk dersin tanımını koruyup bileşke, fark, Lipschitz ve tanım kümesi etkisi gibi kapanış örüntülerini sistemli biçimde toparlar.",
  prerequisites: [
    { label: "Düzgün süreklilik", href: "/concepts?concept=uniform-continuity" },
    { label: "Süreklilik", href: "/concepts?concept=continuity" },
    { label: "Fonksiyonlar", href: "/concepts?concept=functions" },
  ],
  studyGuide: [
    {
      title: "1. Niceleyici farkını açık tut",
      body: [
        "Sıradan süreklilikte δ seçimi hem ε'ye hem de seçilen noktaya bağlı olabilir.",
        "Düzgün süreklilikte ise aynı ε için seçilen δ, bütün tanım kümesinde ortak çalışır.",
      ],
      statement:
        "Düzgün süreklilikte: ∀ ε > 0 ∃ δ > 0 öyle ki tüm x,y için |x-y| < δ ⇒ |f(x)-f(y)| < ε.",
    },
    {
      title: "2. Lipschitz kontrolü hızlı bir kısayoldur",
      body: [
        "Eğer |f(x) - f(y)| ≤ L|x - y| olacak bir L ≥ 0 varsa, fonksiyon düzgün süreklidir.",
        "L > 0 durumunda δ = ε/L seçimi çalışır; L = 0 ise fonksiyon sabittir ve sonuç zaten açıktır.",
      ],
    },
    {
      title: "3. İşlemler altında davranışı izle",
      body: [
        "Bileşke, toplam ve fark gibi işlemlerin düzgün sürekliliği koruyup korumadığını bilmek daha büyük argümanları modüler kurmayı sağlar.",
        "Bu dersin teknik kazancı, tek tek örneklerden genel kapanış kalıplarına geçmektir.",
      ],
    },
    {
      title: "4. Tanım kümesi yine belirleyicidir",
      body: [
        "Aynı formüllü fonksiyon farklı kümelerde farklı düzgün süreklilik davranışı gösterebilir.",
        "Özellikle kapalı ve sınırlı aralıklardaki sürekli fonksiyonların düzgün sürekli olması, tanım kümesinin ne kadar belirleyici olduğunu gösterir.",
      ],
    },
  ],
  keyConcepts: [
    {
      conceptId: "concept-uniform-continuity",
      summary: "Tek bir δ seçiminin bütün tanım kümesi için geçmesini ister.",
    },
    {
      conceptId: "concept-continuity",
      summary: "Düzgün süreklilik, sürekliliğin daha güçlü ve küme-düzeyli hâlidir.",
    },
    {
      conceptId: "concept-functions",
      summary: "Bileşke ve fark gibi fonksiyon işlemleri altında davranışı izlemek ikinci dersin odağıdır.",
    },
  ],
  example: {
    title: "Örnek",
    expression: "|f(x) - f(y)| ≤ 3|x - y|",
    overview:
      "Tek bir Lipschitz eşitsizliği, düzgün sürekliliği tanıma uzun uzun dönmeden de görebilmemizi sağlar.",
    steps: [
      "ε > 0 verildiğinde δ = ε/3 seçilir.",
      "|x - y| < δ ise |f(x) - f(y)| ≤ 3|x - y| < 3δ = ε olur.",
      "Bu seçim x ve y'ye göre değişmez.",
      "Dolayısıyla fonksiyon düzgün süreklidir.",
    ],
    contrastTitle: "Karşılaştır",
    contrast: [
      "Bazı sürekli fonksiyonlar için bu kadar temiz bir Lipschitz sabiti bulunmaz.",
      "Bu durumda ya aralık sınırları ya da daha dikkatli eşitsizlikler devreye girer.",
    ],
    takeaway:
      "İkinci derste düzgün süreklilik yalnızca tanım değil, tanınabilir bir yapısal davranış olarak okunur.",
  },
};
