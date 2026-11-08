import { createValidatedLessonReview } from "@/lib/learning/editorial";
import type { LessonRichContent } from "@/lib/learning/lesson-content";

export const calculusTaylorSeriesLessonContent: LessonRichContent = {
  lessonId: "lesson-calculus-taylor-series",
  courseSlug: "calculus",
  lessonSlug: "taylor-series",
  status: "published",
  version: 1,
  conceptIds: ["concept-taylor", "concept-series"],
  exerciseIds: [
    "ex-calculus-taylor-exponential",
    "ex-calculus-taylor-sine",
    "ex-calculus-taylor-geometric",
  ],
  review: createValidatedLessonReview(),
  intro:
    "Taylor polinomu, bir fonksiyonun seçilen nokta çevresindeki davranışını türevlerinden kurulan bir polinomla yaklaştırır. Merkez 0 ise buna Maclaurin polinomu denir.",
  prerequisites: [
    { label: "Türev", href: "/concepts?concept=derivative" },
    { label: "Üstel fonksiyonlar", href: "/learning/course/calculus/lesson/exponentials" },
  ],
  studyGuide: [
    {
      title: "1. Merkez ve dereceyi seç",
      body: [
        "a noktasındaki n'inci derece Taylor polinomu, f(a), f'(a), …, f^(n)(a) değerlerini aynı noktada eşleştirir.",
        "Terimlerin katsayıları k'inci türev değerinin k! ile bölümünden gelir; (x-a) kuvvetleri merkezden uzaklığı ölçer.",
      ],
      statement: "P₂(x) = f(a) + f'(a)(x-a) + f''(a)(x-a)²/2",
    },
    {
      title: "2. Maclaurin örneklerini tanı",
      body: [
        "e^x için 0 çevresinde ilk terimler 1 + x + x²/2 + x³/6 biçimindedir.",
        "sin(x) için ilk sıfır olmayan terimler x - x³/6 biçimindedir. Sabit ve x² terimleri sıfırdır.",
      ],
    },
    {
      title: "3. Yaklaşımın sınırını bil",
      body: [
        "Polinomun merkezdeki türevleri eşleşir; bu tek başına bütün x değerlerinde fonksiyonla eşit olduğu anlamına gelmez.",
        "Yaklaşım hatasını değerlendirmek için kalan terimi ve fonksiyonun ilgili aralıktaki türev davranışını incele.",
      ],
    },
  ],
  keyConcepts: [
    {
      conceptId: "concept-taylor",
      summary:
        "Taylor polinomu, bir noktadaki türev bilgilerini polinom katsayılarına dönüştürerek yerel yaklaşım kurar.",
    },
    {
      conceptId: "concept-series",
      summary:
        "Dereceyi artırmak polinoma yeni terimler ekler; sonsuz seriye eşitlik için ayrıca yakınsaklık ve kalanın sıfıra gitmesi gerekir.",
    },
  ],
  example: {
    title: "e^x için ikinci derece yaklaşım",
    expression: "P₂(x) = 1 + x + x²/2",
    overview: "e^x fonksiyonunun bütün türevleri yine e^x'tir; 0 noktasında hepsi 1 eder.",
    steps: [
      "f(0) = f'(0) = f''(0) = 1 yaz.",
      "Taylor formülüne yerleştirince P₂(x) = 1 + x + x²/2 elde edilir.",
      "x = 0.1 için P₂(0.1) = 1 + 0.1 + 0.01/2 = 1.105 bulunur.",
    ],
    contrastTitle: "Polinom ile fonksiyon",
    contrast: [
      "P₂(0.1) yaklaşık bir değerdir; e^(0.1) ile tam eşit olduğunu söylemez.",
      "Merkezden uzak noktalarda hata büyüyebilir; gerektiğinde daha yüksek derece veya hata sınırı kullan.",
    ],
    takeaway: "Taylor polinomunu yazarken önce merkezdeki türevleri, sonra dereceyi kontrol et.",
  },
};
