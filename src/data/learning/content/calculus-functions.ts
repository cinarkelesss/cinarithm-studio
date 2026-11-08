import { createValidatedLessonReview } from "@/lib/learning/editorial";
import type { LessonRichContent } from "@/lib/learning/lesson-content";

export const calculusFunctionsLessonContent: LessonRichContent = {
  lessonId: "lesson-calculus-functions",
  courseSlug: "calculus",
  lessonSlug: "functions",
  status: "published",
  version: 1,
  conceptIds: ["concept-functions"],
  exerciseIds: [
    "ex-calculus-functions-evaluate",
    "ex-calculus-functions-domain",
    "ex-calculus-functions-image",
  ],
  review: createValidatedLessonReview(),
  intro:
    "Bir fonksiyon, tanım kümesindeki her girdiye tam bir çıktı atar. Videoyu izlerken tanım kümesi, değer kümesi ve görüntü kümesini birbirinden ayırmaya odaklan.",
  prerequisites: [],
  studyGuide: [
    {
      title: "1. Girdi ve çıktı",
      body: [
        "f: A → B yazımı, A'daki her elemanın B'de tam bir görüntüsü olduğunu söyler. Aynı çıktıya birden fazla girdi gidebilir.",
        "A tanım kümesi, B değer kümesidir. Görüntü kümesi ise gerçekten elde edilen çıktıların kümesidir ve B'nin altkümesidir.",
      ],
      statement: "f(A) = {f(x) : x ∈ A} ⊆ B",
    },
    {
      title: "2. Formülün tanım kümesini kontrol et",
      body: [
        "Bir formül verildiğinde her reel sayı otomatik olarak izinli değildir. Payda sıfır olamaz; reel karekökün içi negatif olamaz.",
        "Önce bu kısıtları birlikte yaz, sonra fonksiyon değerlerini hesapla.",
      ],
    },
    {
      title: "3. Birebir ve örten ayrımı",
      body: [
        "Birebirlikte farklı girdiler farklı çıktılar verir. Örtenlikte ise değer kümesindeki her eleman en az bir kez elde edilir.",
        "Bu iki özelliği incelerken yalnızca formüle değil, seçilen tanım ve değer kümelerine de bak.",
      ],
    },
  ],
  keyConcepts: [
    {
      conceptId: "concept-functions",
      summary:
        "Fonksiyonun tanım kümesi izinli girdileri, görüntü kümesi elde edilen çıktıları belirler; görüntü, değer kümesinin içinde kalır.",
    },
  ],
  example: {
    title: "Görüntü, birebirlik ve örtenlik",
    expression: "A = {-1, 0, 1}, B = {0, 1, 2}, f(x) = x²",
    overview: "Aynı formülün üç farklı özelliğini seçilen kümeler üzerinden kontrol et.",
    steps: [
      "f(-1) = 1, f(0) = 0 ve f(1) = 1; dolayısıyla f(A) = {0, 1}.",
      "-1 ve 1 farklı girdiler olduğu halde aynı çıktıyı verdiği için f birebir değildir.",
      "2 ∈ B hiçbir girdiden gelmediği için f, B üzerine örten değildir.",
    ],
    contrastTitle: "Değer kümesini değiştirirsen",
    contrast: [
      "B = {0, 1} seçilseydi aynı kural örten olurdu.",
      "-1 ve 1 yine aynı çıktıya gittiğinden birebirlik değişmezdi.",
    ],
    takeaway: "Birebirlik ve örtenlik yargısını tanım ve değer kümeleriyle birlikte ver.",
  },
};
