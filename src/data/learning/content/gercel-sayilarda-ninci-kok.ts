import type { LessonRichContent } from "@/lib/learning/lesson-content";

export const gercelSayilardaNinciKokLessonContent: LessonRichContent = {
  lessonId: "lesson-real-analysis-gercel-sayilarda-ninci-kok",
  courseSlug: "real-analysis",
  lessonSlug: "gercel-sayilarda-ninci-kok",
  status: "draft",
  version: 2,
  conceptIds: [
    "concept-real-numbers",
    "concept-completeness",
    "concept-functions",
    "concept-supremum",
  ],
  exerciseIds: [
    "ex-real-analysis-nth-root-order-01",
    "ex-real-analysis-nth-root-supremum-02",
    "ex-real-analysis-nth-root-comparison-03",
    "ex-real-analysis-nth-root-uniqueness-04",
  ],
  review: {
    mathematicalAccuracy: "pass",
    pedagogy: "pass",
    language: "pass",
    technical: "pass",
    notes: [
      "Pozitif n'inci kök teoremi varsayımları açık yazıldı.",
      "Çift ve tek n durumlarının ℝ içindeki farkı ayrıca belirtildi.",
      "Dersin supremum inşası dairesel akıl yürütmeden kaçınacak biçimde daraltıldı.",
    ],
  },
  reviewNotes: [
    "Mathematical Review Sprint 2: varlık ve teklik cümleleri a > 0 ve n ∈ ℕ varsayımlarıyla sıkılaştırıldı.",
    "Çift/tek n ayrımı ders metnine eklendi.",
    "Kök notasyonu kullanılmadan önce hangi kökün varlığının kanıtlandığı netleştirildi.",
  ],
  lastReviewedAt: "2026-08-15T00:00:00.000Z",
  reviewedBy: "Mathematical Review Sprint 2",
  intro:
    "n'inci kök dersi, a > 0 ve n ∈ ℕ için x^n = a denkleminin pozitif çözümünü tamlık yardımıyla kurmayı ve hangi durumlarda gerçek kökün tanımlı olduğunu netleştirmeyi amaçlar.",
  prerequisites: [
    { label: "Gerçel sayılar", href: "/concepts?concept=real-numbers" },
    { label: "Tamlık", href: "/concepts?concept=completeness" },
    { label: "Supremum", href: "/concepts?concept=supremum-and-infimum" },
  ],
  studyGuide: [
    {
      title: "1. Varlık sorusunu önce pozitif tarafta kur",
      body: [
        "a > 0 ve n ∈ ℕ verildiğinde x^n = a denkleminin pozitif bir çözümü olup olmadığı temel sorudur.",
        "Bu soru, pozitif sayılarda x ↦ x^n fonksiyonunun davranışı ile tamlığın birlikte çalışmasını gerektirir.",
      ],
      statement: "Her a > 0 ve n ∈ ℕ için x^n = a denkleminin tek bir pozitif çözümü vardır.",
    },
    {
      title: "2. Aday küme inşa et",
      body: [
        "S = {x > 0 : x^n < a} kümesi, kökten küçük kalan pozitif adayları toplar.",
        "Bu küme boş değilse ve yukarıdan sınırlıysa supremumu doğal bir kök adayı üretir.",
      ],
      statement: "S = {x > 0 : x^n < a}",
    },
    {
      title: "3. Supremumdan eşitliğe geç",
      body: [
        "s = sup S için s^n < a olsaydı s'den biraz büyük bir sayı yine S'ye girebilirdi; s^n > a olsaydı s'den biraz küçük bir üst sınır elde edilirdi.",
        "Her iki durum çelişkiye götürdüğü için geriye yalnızca s^n = a kalır.",
      ],
    },
    {
      title: "4. Çift ve tek n durumlarını ayır",
      body: [
        "Pozitif tarafta x ↦ x^n fonksiyonu artandır; bu yüzden aynı a > 0 sayısının iki farklı pozitif kökü olamaz.",
        "Ayrıca n tek ise her x ∈ ℝ için gerçek n'inci kök tanımlıdır; n çift ise ℝ içinde gerçek kök için x ≥ 0 koşulu gerekir.",
      ],
    },
  ],
  keyConcepts: [
    {
      conceptId: "concept-real-numbers",
      summary: "Gerçek kök tartışması, pozitiflik ve düzen yapısına dayanır; çift n için x ≥ 0 şartı gerekir.",
    },
    {
      conceptId: "concept-completeness",
      summary: "Supremum adayı kurabilmek için gerçel sayıların tamlık özelliği kullanılır.",
    },
    {
      conceptId: "concept-functions",
      summary: "Pozitif sayılarda x ↦ x^n fonksiyonunun artanlığı kökün teklik kısmını belirler.",
    },
    {
      conceptId: "concept-supremum",
      summary: "Kökün varlığı, S = {x > 0 : x^n < a} kümesinin supremumu alınarak inşa edilir.",
    },
  ],
  example: {
    title: "Örnek",
    expression: "x^3 = 2",
    overview:
      "Küp kök örneği, hem supremum inşasını hem de tekliği birlikte görmek için kullanışlıdır.",
    steps: [
      "S = {x > 0 : x^3 < 2} kümesi boş değildir; örneğin 1 ∈ S.",
      "Bu küme yukarıdan sınırlıdır; örneğin 2 bir üst sınırdır.",
      "s = sup S alınır ve s^3 < 2 ya da s^3 > 2 varsayımlarının ikisi de çelişkiye götürülür.",
      "Sonunda s^3 = 2 elde edilir; yani 2'nin tek bir pozitif küp kökü vardır.",
    ],
    contrastTitle: "Karşılaştır",
    contrast: [
      "n = 2 olsaydı aynı inşa yalnızca a ≥ 0 için gerçek karekök verirdi.",
      "n tek olduğunda ise negatif sayılar da gerçek n'inci köke sahiptir; bu fark çift ve tek kuvvetlerin davranışını ayırır.",
    ],
    takeaway:
      "Kök varlığı, tamlık ile kuvvet fonksiyonunun düzenli davranışını aynı anda kullanmayı gerektirir.",
  },
};
