import type { LessonRichContent } from "@/lib/learning/lesson-content";

export const gercelSayilarRasyonelSayilariIcerirLessonContent: LessonRichContent = {
  lessonId: "lesson-real-analysis-ordered-field-structure",
  courseSlug: "real-analysis",
  lessonSlug: "ordered-field-structure",
  status: "published",
  version: 2,
  conceptIds: ["concept-real-numbers", "concept-density"],
  exerciseIds: [
    "ex-real-analysis-ordered-field-structure-rational-density-01",
    "ex-real-analysis-ordered-field-structure-between-two-reals-02",
    "ex-real-analysis-ordered-field-structure-irrational-between-rationals-03",
    "ex-real-analysis-ordered-field-structure-no-largest-rational-04",
  ],
  introducedConceptIds: ["concept-density"],
  review: {
    mathematicalAccuracy: "pass",
    pedagogy: "pass",
    language: "pass",
    technical: "pass",
    notes: [
      "ℚ ⊆ ℝ, irrasyonel sayılar ve yoğunluk ayrımı daha kesin yazıldı.",
      "Tamlık bu dersin ana kavramı olmaktan çıkarılıp yalnızca karşılaştırma düzeyinde bırakıldı.",
      "Rasyonel ve irrasyonel örnekler açık varsayımlarla yeniden kuruldu.",
    ],
  },
  reviewNotes: [
    "Mathematical Review Sprint 2: ℚ ⊆ ℝ ifadesi eşitlik ya da tamlıkla karışmayacak biçimde yeniden yazıldı.",
    "İrrasyonel sayıların ℝ \\ ℚ kümesinde yer aldığı açıklandı.",
    "Prerequisite ve concept seti dersin gerçek kapsamına daraltıldı.",
    "Human Editorial Gate & Publish Batch 1: video-sonrası çalışma akışı, örnek seçimi ve alıştırma sıralaması ilk kontrollü yayın için yeterli bulundu.",
    "Tamlık Özelliği sonrasına temiz bağlanan, düşük sürtünmeli bir ilk Real Analysis dersi olarak yayımlandı.",
  ],
  lastReviewedAt: "2026-08-15T00:00:00.000Z",
  reviewedBy: "Human Editorial Gate & Publish Batch 1",
  intro:
    "Bu ders, ℚ ⊆ ℝ içermesini doğru okumayı ve rasyonellerin gerçel sayılar içindeki yoğunluğunu, gerçel sayıların tamlığından ayırarak anlamayı amaçlar.",
  prerequisites: [
    { label: "Gerçel sayılar", href: "/concepts?concept=real-numbers" },
    { label: "Kümeler", href: "/concepts?concept=sets" },
  ],
  studyGuide: [
    {
      title: "1. Önce içerme cümlesini doğru oku",
      body: [
        "ℚ ⊆ ℝ demek, her rasyonel sayının aynı zamanda bir gerçel sayı olduğunu söyler.",
        "Bu ifade eşitlik kurmaz; yalnızca rasyonellerin gerçel sayı sistemi içinde yer aldığını belirtir.",
        "Rasyonel sayılar q = a/b biçimindedir; burada a,b ∈ ℤ ve b ≠ 0 olmalıdır.",
      ],
    },
    {
      title: "2. Yoğunluk, salt altküme olmaktan daha güçlüdür",
      body: [
        "Her a < b için a < q < b olacak bir q ∈ ℚ bulunabilir.",
        "Bu nedenle rasyoneller yalnızca gerçel sayıların altkümesi değildir; her aralıkta karşımıza çıkabilen yoğun bir alt yapıdır.",
      ],
      statement: "a < b ise bir q ∈ ℚ için a < q < b",
    },
    {
      title: "3. İrrasyonelleri de doğru konumlandır",
      body: [
        "İrrasyonel sayılar, ℝ \\ ℚ kümesinde yer alan gerçel sayılardır.",
        "Dolayısıyla gerçel sayılar yalnızca rasyonellerden ibaret değildir; √2 gibi örnekler gerçel ama rasyonel olmayan sayılar verir.",
      ],
    },
    {
      title: "4. Yoğunluk ile tamlığı karıştırma",
      body: [
        "Bir aralıkta rasyonel ya da irrasyonel sayı bulabilmek, tamlıkla aynı şey değildir.",
        "Yoğunluk aralıkların doluluğunu anlatır; tamlık ise uygun sınırlı kümeler için supremum varlığını güvenceye alır.",
      ],
    },
  ],
  keyConcepts: [
    {
      conceptId: "concept-real-numbers",
      summary: "Gerçel sayılar, rasyonelleri de içeren ve irrasyonelleri de barındıran sayı sistemidir.",
    },
    {
      conceptId: "concept-density",
      summary: "Yoğunluk, her a < b için araya aynı kümeden yeni bir nokta yerleştirebilme özelliğidir.",
    },
  ],
  example: {
    title: "Örnek",
    expression: "1.41 < x < 1.42",
    overview:
      "Bu kısa aralığı, hem rasyonel hem irrasyonel sayıların aynı anda bulunabildiğini görmek için kullanabiliriz.",
    steps: [
      "1.415 sonlu ondalık açılıma sahip olduğu için rasyoneldir ve aralığın içindedir.",
      "√2 irrasyonel olduğundan 1.41 + √2/1000 da irrasyoneldir; ayrıca √2/1000 < 0.01 olduğu için bu sayı yine aynı aralıkta kalır.",
      "Böylece aynı dar aralık içinde hem rasyonel hem irrasyonel elemanlar buluruz.",
      "Bu durum, gerçel sayı doğrusu üzerinde aralıkların sayı türlerine göre boşluk bırakmadığını gösterir.",
    ],
    contrastTitle: "Karşılaştır",
    contrast: [
      "Rasyoneller yoğun olabilir ama bu, bütün gerçel sayıları kapsadıkları anlamına gelmez.",
      "Aralık içinde sayı bulmak ile üst sınır argümanlarını garanti etmek aynı özellik değildir.",
    ],
    takeaway:
      "ℚ ⊆ ℝ ve yoğunluk bilgisi, gerçel sayıların hem kapsayıcı hem de aralıklar içinde zengin bir yapı taşıdığını gösterir.",
  },
};
