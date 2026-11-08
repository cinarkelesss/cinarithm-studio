import type { LessonRichContent } from "@/lib/learning/lesson-content";

export const arsimetOzelligiVeYogunlukLessonContent: LessonRichContent = {
  lessonId: "lesson-real-analysis-archimedean-property",
  courseSlug: "real-analysis",
  lessonSlug: "archimedean-property",
  status: "published",
  version: 2,
  conceptIds: [
    "concept-supremum",
    "concept-real-numbers",
    "concept-density",
    "concept-archimedean-property",
  ],
  exerciseIds: [
    "ex-real-analysis-archimedean-property-threshold-01",
    "ex-real-analysis-archimedean-property-reciprocal-02",
    "ex-real-analysis-archimedean-property-density-03",
    "ex-real-analysis-archimedean-property-integer-gap-04",
  ],
  introducedConceptIds: ["concept-archimedean-property"],
  review: {
    mathematicalAccuracy: "pass",
    pedagogy: "pass",
    language: "pass",
    technical: "pass",
    notes: [
      "Arşimet özelliğinin standart ifadesi ve 1/n < ε uygulaması yeniden yazıldı.",
      "Yoğunluk örneği ile ilgili alıştırmada an < m < bn zinciri açık hale getirildi.",
      "Gereksiz 'Diziler' prerequisite'i kaldırıldı ve kavram özetleri tanımsal dile yaklaştırıldı.",
    ],
  },
  reviewNotes: [
    "Mathematical Review Sprint 1: giriş metnindeki anlam bozan typo düzeltildi.",
    "Yoğunluk ispatı, aralığa tam sayı yerleştirme adımını açık eşitsizlik zinciriyle kuracak şekilde sıkılaştırıldı.",
    "Alıştırma kavram eşleştirmeleri limit/proof yerine dersin ana kavramlarına yaklaştırıldı.",
    "Human Editorial Gate & Publish Batch 1: teknik araç duygusu korunurken metin akışı ve alıştırma kademesi ilk yayın için yeterince berrak bulundu.",
    "Gerçel sayı temelleri mini-sekansını tamamlayan en güçlü üçüncü aday olarak yayımlandı.",
  ],
  lastReviewedAt: "2026-08-15T00:00:00.000Z",
  reviewedBy: "Human Editorial Gate & Publish Batch 1",
  intro:
    "Arşimet özelliği, doğal sayıların büyüklük ve tersleri üzerinden küçüklük kontrolü kurarak analizde neden bu kadar merkezi rol oynadığını açıklayan temel ilkedir.",
  prerequisites: [
    { label: "Gerçel sayılar", href: "/concepts?concept=real-numbers" },
    { label: "Tamlık", href: "/concepts?concept=completeness" },
    { label: "Supremum", href: "/concepts?concept=supremum-and-infimum" },
  ],
  studyGuide: [
    {
      title: "1. Büyük sayı seçme hakkı",
      body: [
        "Arşimet özelliği, her gerçek sayının üstüne çıkabilecek kadar büyük bir doğal sayı seçilebileceğini söyler.",
        "Başka bir deyişle, doğal sayılar yukarıdan sınırlı değildir; hiçbir gerçek sayı onların tamamını yukarıdan kilitleyemez.",
      ],
      statement: "Her x ∈ ℝ için x < n olacak bir n ∈ ℕ vardır.",
    },
    {
      title: "2. Tersini al: küçük sayı seçme hakkı",
      body: [
        "Verilen ε > 0 için 1/n < ε olacak bir n bulmak, özelliği 1/ε sayısına uygulamanın doğrudan sonucudur.",
        "Bu nedenle ε ile yapılan küçüklük kontrolleri çoğu zaman doğal sayılar üzerinden kurulur.",
      ],
      statement: "Her ε > 0 için 1/n < ε olacak bir n ∈ ℕ vardır.",
    },
    {
      title: "3. Yoğunluğa geçiş yap",
      body: [
        "İki sayı arasına rasyonel yerleştirmek için önce aralığı n ile büyütür, sonra bu geniş aralığa bir tam sayı yerleştirirsin.",
        "Arşimet özelliği burada n(b - a) > 1 olacak bir n seçmeni sağlar; tam sayı yerleştirme adımı da buradan gelir.",
      ],
    },
    {
      title: "4. Bu dersi teknik bir alet kutusu gibi düşün",
      body: [
        "Arşimet özelliği tek başına bir slogan değildir; daha sonraki limit ve yoğunluk argümanlarında tekrar tekrar kullanılan teknik bir adımdır.",
        "Dersin asıl değeri, hangi noktada büyük n ya da küçük 1/n seçmen gerektiğini fark etmektir.",
      ],
    },
  ],
  keyConcepts: [
    {
      conceptId: "concept-archimedean-property",
      summary: "Her x ∈ ℝ için x'ten büyük bir n ∈ ℕ bulunacağını söyleyen yapısal ilkedir.",
    },
    {
      conceptId: "concept-density",
      summary: "Her a < b için a < q < b olacak bir q ∈ ℚ bulunabilmesidir.",
    },
    {
      conceptId: "concept-real-numbers",
      summary: "Gerçel sayı doğrusu üzerinde büyüklük ve küçüklük karşılaştırmalarını sayısal olarak düzenleyen bağlamdır.",
    },
    {
      conceptId: "concept-supremum",
      summary: "Arşimet özelliği, supremumla ilgili bazı çelişki argümanlarında doğal sayıların sınırsızlığını devreye sokar.",
    },
  ],
  example: {
    title: "Örnek",
    expression: "a < b, n(b - a) > 1",
    overview:
      "İki gerçek sayı arasına rasyonel yerleştirme fikri, Arşimet özelliğini en somut biçimde kullanan klasik örnektir.",
    steps: [
      "a < b olduğundan b - a > 0 olur.",
      "Arşimet özelliğiyle n(b - a) > 1 olacak kadar büyük bir n seçilir.",
      "Böylece an + 1 < bn olur; ayrıca an'den büyük bir m ∈ ℤ seçildiğinde m ≤ an + 1 da sağlanabilir.",
      "Bu durumda an < m < bn ve dolayısıyla a < m/n < b olur.",
    ],
    contrastTitle: "Karşılaştır",
    contrast: [
      "Bu argüman, yoğunluğu görsel sezgiden çıkarıp sayısal bir inşa haline getirir.",
      "Aynı teknik, 1/n < ε seçimlerinde de büyüklük bilgisini küçüklük kontrolüne çevirir.",
    ],
    takeaway:
      "Arşimet özelliği, büyüklük ve incelik seçimlerini kontrol ederek analizin altyapısında sessiz ama çok etkili çalışır.",
  },
};
