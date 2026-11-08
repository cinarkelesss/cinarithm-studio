import { createValidatedLessonReview } from "@/lib/learning/editorial";
import type { LessonRichContent } from "@/lib/learning/lesson-content";

export const calculusExponentialsLessonContent: LessonRichContent = {
  lessonId: "lesson-calculus-exponentials",
  courseSlug: "calculus",
  lessonSlug: "exponentials",
  status: "published",
  version: 1,
  conceptIds: ["concept-functions"],
  exerciseIds: [
    "ex-calculus-exponentials-equation",
    "ex-calculus-exponentials-decreasing",
    "ex-calculus-exponentials-growth-factor",
  ],
  review: createValidatedLessonReview(),
  intro:
    "Üstel fonksiyonda değişken üssün içindedir. Pozitif tabanın değeri, fonksiyonun artan mı azalan mı olacağını belirler.",
  prerequisites: [
    { label: "Fonksiyonlar", href: "/learning/course/calculus/lesson/functions" },
  ],
  studyGuide: [
    {
      title: "1. Taban koşulunu yaz",
      body: [
        "a > 0 için a^x her reel x'te tanımlıdır ve pozitiftir. a = 1 olduğunda fonksiyon sabit 1 olur; büyüme veya azalma için a ≠ 1 gerekir.",
        "Üs kurallarından a^(x+y) = a^x · a^y ve a^0 = 1 elde edilir.",
      ],
      statement: "a > 0, a ≠ 1 için f(x) = a^x",
    },
    {
      title: "2. Artış yönünü belirle",
      body: [
        "a > 1 ise a^x artandır. 0 < a < 1 ise a^x azalandır.",
        "Üstel denklemlerde aynı tabana çevirebiliyorsan üsleri eşitle; karşılaştırmalarda ise tabanın 1'in hangi tarafında olduğunu kontrol et.",
      ],
    },
    {
      title: "3. Ters işlem",
      body: [
        "a > 0 ve a ≠ 1 için a^x fonksiyonunun görüntüsü (0, ∞) aralığıdır. Bu fonksiyon birebir ve bu aralığa örtendir.",
        "Bu nedenle ters fonksiyonu logaritmadır: y = a^x ile x = log_a(y) eşdeğerdir; burada y > 0 olmalıdır.",
      ],
    },
  ],
  keyConcepts: [
    {
      conceptId: "concept-functions",
      summary:
        "a > 0, a ≠ 1 için x ↦ a^x tüm reel sayılarda tanımlı, pozitif değerli ve birebir bir fonksiyondur.",
    },
  ],
  example: {
    title: "Aynı tabana çevir",
    expression: "2^(x+1) = 16",
    overview: "Sağ tarafı 2 tabanında yazınca denklem doğrudan çözülür.",
    steps: [
      "16 = 2^4 olduğundan 2^(x+1) = 2^4 yaz.",
      "2^x birebir olduğu için x + 1 = 4 olmalıdır.",
      "Buradan x = 3 bulunur; yerine koyunca 2^4 = 16 elde edilir.",
    ],
    contrastTitle: "Taban 1'den küçük olsaydı",
    contrast: [
      "(1/2)^x yine birebirdir, fakat x arttıkça değerleri azalır.",
      "Denklem çözümünde üsleri eşitleyebilirsin; eşitsizlik çözerken yön değişimine dikkat etmelisin.",
    ],
    takeaway: "Önce tabanı ve tanım koşulunu kontrol et, sonra üs kurallarını kullan.",
  },
};
