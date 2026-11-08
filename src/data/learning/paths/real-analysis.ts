import type { LearningPath, LessonPathMetadata } from "@/lib/learning/domain";

function defineLesson(
  lessonId: string,
  prerequisiteLessonIds: string[] = [],
  recommendedPreviousLessonIds: string[] = []
): LessonPathMetadata {
  return {
    lessonId,
    prerequisiteLessonIds,
    recommendedPreviousLessonIds,
  };
}

export const realAnalysisLearningPath: LearningPath = {
  id: "learning-path-real-analysis-temel-yol-v1",
  courseId: "course-real-analysis",
  title: "Real Analysis — Temel Yol",
  description:
    "Gerçel sayı temellerinden limit, türev ve integrale uzanan ana çalışma çizgisi.",
  stages: [
    {
      id: "real-analysis-stage-real-number-foundations",
      title: "Aşama 1 · Gerçel Sayı Temelleri",
      description:
        "Tamlık, yoğunluk ve supremum dili üzerinden analizin zeminini kur.",
      lessonIds: [
        "lesson-real-analysis-real-numbers",
        "lesson-real-analysis-ordered-field-structure",
        "lesson-real-analysis-supremum-and-infimum",
        "lesson-real-analysis-archimedean-property",
        "lesson-real-analysis-gercel-sayilarda-ninci-kok",
      ],
    },
    {
      id: "real-analysis-stage-limits-and-continuity",
      title: "Aşama 2 · Limit ve Süreklilik",
      description:
        "Limit fikrini, yoğunlaşma noktalarını ve düzgün süreklilik çizgisini yerleştir.",
      lessonIds: [
        "lesson-real-analysis-limit-introduction-and-accumulation-point",
        "lesson-real-analysis-limits-of-functions",
        "lesson-real-analysis-ustel-fonksiyonlar-ve-limitleri",
        "lesson-real-analysis-uniform-continuity",
        "lesson-real-analysis-uniform-continuity-2",
        "lesson-real-analysis-logaritma-limit-ve-lhospital",
      ],
    },
    {
      id: "real-analysis-stage-inequalities-and-series-intuition",
      title: "Aşama 3 · Eşitsizlikler ve Seri Sezgisi",
      description:
        "Eşitsizlik araçlarını ve test mantığını seriler tarafına hazırlık olarak toparla.",
      lessonIds: [
        "lesson-real-analysis-inequalities-1",
        "lesson-real-analysis-esitsizlikler",
        "lesson-real-analysis-convergence-tests",
        "lesson-real-analysis-aritmetik-geometrik-ortalama",
        "lesson-real-analysis-problemler",
      ],
    },
    {
      id: "real-analysis-stage-differentiation",
      title: "Aşama 4 · Türev",
      description:
        "Türev dili, Taylor bakışı ve problem oturumlarıyla diferansiyel düşünceyi oturt.",
      lessonIds: [
        "lesson-real-analysis-derivative-properties-and-trigonometry",
        "lesson-real-analysis-derivative",
        "lesson-real-analysis-derivative-and-taylor-theorem",
        "lesson-real-analysis-turev-problemleri-1",
        "lesson-real-analysis-turev-problemleri-2",
      ],
    },
    {
      id: "real-analysis-stage-function-sequences",
      title: "Aşama 5 · Fonksiyon Dizileri ve Düzgün Yakınsaklık",
      description:
        "Düzgün yakınsaklık, türev geçişleri ve örnekler üstünden limit disiplinini güçlendir.",
      lessonIds: [
        "lesson-real-analysis-pointwise-and-uniform-convergence",
        "lesson-real-analysis-turev-ve-duzgun-yakinsaklik",
        "lesson-real-analysis-duzgun-yakinsaklik",
      ],
    },
    {
      id: "real-analysis-stage-integration",
      title: "Aşama 6 · İntegral",
      description:
        "Riemann integrali ve esas teorem çizgisini türev altyapısıyla birleştir.",
      lessonIds: [
        "lesson-real-analysis-riemann-integral",
        "lesson-real-analysis-riemann-integrali-2",
        "lesson-real-analysis-integrability-and-the-fundamental-theorem-of-calculus",
        "lesson-real-analysis-belirsiz-integral-hesabi",
      ],
    },
    {
      id: "real-analysis-stage-review-and-extensions",
      title: "Aşama 7 · Tekrar ve Genişlemeler",
      description:
        "Genel calculus bakışını, yoğunluk teoremini ve ölçülebilirlik kapısını kontrollü biçimde tamamla.",
      lessonIds: [
        "lesson-real-analysis-calculus",
        "lesson-real-analysis-weierstrass-yogunluk-teoremi",
        "lesson-real-analysis-lebesgue-ve-borel-olculebilir",
      ],
    },
  ],
  lessonMetadata: [
    defineLesson("lesson-real-analysis-real-numbers"),
    defineLesson(
      "lesson-real-analysis-ordered-field-structure",
      ["lesson-real-analysis-real-numbers"],
      ["lesson-real-analysis-real-numbers"]
    ),
    defineLesson(
      "lesson-real-analysis-supremum-and-infimum",
      ["lesson-real-analysis-real-numbers"],
      ["lesson-real-analysis-ordered-field-structure"]
    ),
    defineLesson(
      "lesson-real-analysis-archimedean-property",
      [
        "lesson-real-analysis-ordered-field-structure",
        "lesson-real-analysis-supremum-and-infimum",
      ],
      ["lesson-real-analysis-supremum-and-infimum"]
    ),
    defineLesson(
      "lesson-real-analysis-gercel-sayilarda-ninci-kok",
      ["lesson-real-analysis-supremum-and-infimum"],
      ["lesson-real-analysis-archimedean-property"]
    ),
    defineLesson(
      "lesson-real-analysis-limit-introduction-and-accumulation-point",
      ["lesson-real-analysis-archimedean-property"],
      ["lesson-real-analysis-gercel-sayilarda-ninci-kok"]
    ),
    defineLesson(
      "lesson-real-analysis-limits-of-functions",
      ["lesson-real-analysis-limit-introduction-and-accumulation-point"],
      ["lesson-real-analysis-limit-introduction-and-accumulation-point"]
    ),
    defineLesson(
      "lesson-real-analysis-ustel-fonksiyonlar-ve-limitleri",
      ["lesson-real-analysis-limits-of-functions"],
      ["lesson-real-analysis-limits-of-functions"]
    ),
    defineLesson(
      "lesson-real-analysis-uniform-continuity",
      ["lesson-real-analysis-limits-of-functions"],
      ["lesson-real-analysis-ustel-fonksiyonlar-ve-limitleri"]
    ),
    defineLesson(
      "lesson-real-analysis-uniform-continuity-2",
      ["lesson-real-analysis-uniform-continuity"],
      ["lesson-real-analysis-uniform-continuity"]
    ),
    defineLesson(
      "lesson-real-analysis-logaritma-limit-ve-lhospital",
      ["lesson-real-analysis-ustel-fonksiyonlar-ve-limitleri"],
      ["lesson-real-analysis-uniform-continuity-2"]
    ),
    defineLesson(
      "lesson-real-analysis-inequalities-1",
      ["lesson-real-analysis-limits-of-functions"],
      ["lesson-real-analysis-logaritma-limit-ve-lhospital"]
    ),
    defineLesson(
      "lesson-real-analysis-esitsizlikler",
      ["lesson-real-analysis-inequalities-1"],
      ["lesson-real-analysis-inequalities-1"]
    ),
    defineLesson(
      "lesson-real-analysis-convergence-tests",
      [
        "lesson-real-analysis-inequalities-1",
        "lesson-real-analysis-esitsizlikler",
      ],
      ["lesson-real-analysis-esitsizlikler"]
    ),
    defineLesson(
      "lesson-real-analysis-aritmetik-geometrik-ortalama",
      ["lesson-real-analysis-esitsizlikler"],
      ["lesson-real-analysis-convergence-tests"]
    ),
    defineLesson(
      "lesson-real-analysis-problemler",
      ["lesson-real-analysis-convergence-tests"],
      ["lesson-real-analysis-aritmetik-geometrik-ortalama"]
    ),
    defineLesson(
      "lesson-real-analysis-derivative-properties-and-trigonometry",
      ["lesson-real-analysis-uniform-continuity-2"],
      ["lesson-real-analysis-problemler"]
    ),
    defineLesson(
      "lesson-real-analysis-derivative",
      ["lesson-real-analysis-derivative-properties-and-trigonometry"],
      ["lesson-real-analysis-derivative-properties-and-trigonometry"]
    ),
    defineLesson(
      "lesson-real-analysis-derivative-and-taylor-theorem",
      ["lesson-real-analysis-derivative"],
      ["lesson-real-analysis-derivative"]
    ),
    defineLesson(
      "lesson-real-analysis-turev-problemleri-1",
      ["lesson-real-analysis-derivative-and-taylor-theorem"],
      ["lesson-real-analysis-derivative-and-taylor-theorem"]
    ),
    defineLesson(
      "lesson-real-analysis-turev-problemleri-2",
      ["lesson-real-analysis-turev-problemleri-1"],
      ["lesson-real-analysis-turev-problemleri-1"]
    ),
    defineLesson(
      "lesson-real-analysis-pointwise-and-uniform-convergence",
      ["lesson-real-analysis-uniform-continuity-2"],
      ["lesson-real-analysis-turev-problemleri-2"]
    ),
    defineLesson(
      "lesson-real-analysis-turev-ve-duzgun-yakinsaklik",
      [
        "lesson-real-analysis-pointwise-and-uniform-convergence",
        "lesson-real-analysis-derivative",
      ],
      ["lesson-real-analysis-pointwise-and-uniform-convergence"]
    ),
    defineLesson(
      "lesson-real-analysis-duzgun-yakinsaklik",
      ["lesson-real-analysis-pointwise-and-uniform-convergence"],
      ["lesson-real-analysis-turev-ve-duzgun-yakinsaklik"]
    ),
    defineLesson(
      "lesson-real-analysis-riemann-integral",
      ["lesson-real-analysis-derivative"],
      ["lesson-real-analysis-duzgun-yakinsaklik"]
    ),
    defineLesson(
      "lesson-real-analysis-riemann-integrali-2",
      ["lesson-real-analysis-riemann-integral"],
      ["lesson-real-analysis-riemann-integral"]
    ),
    defineLesson(
      "lesson-real-analysis-integrability-and-the-fundamental-theorem-of-calculus",
      [
        "lesson-real-analysis-riemann-integrali-2",
        "lesson-real-analysis-derivative-and-taylor-theorem",
      ],
      ["lesson-real-analysis-riemann-integrali-2"]
    ),
    defineLesson(
      "lesson-real-analysis-belirsiz-integral-hesabi",
      ["lesson-real-analysis-integrability-and-the-fundamental-theorem-of-calculus"],
      ["lesson-real-analysis-integrability-and-the-fundamental-theorem-of-calculus"]
    ),
    defineLesson(
      "lesson-real-analysis-calculus",
      ["lesson-real-analysis-derivative"],
      ["lesson-real-analysis-belirsiz-integral-hesabi"]
    ),
    defineLesson(
      "lesson-real-analysis-weierstrass-yogunluk-teoremi",
      ["lesson-real-analysis-convergence-tests"],
      ["lesson-real-analysis-calculus"]
    ),
    defineLesson(
      "lesson-real-analysis-lebesgue-ve-borel-olculebilir",
      ["lesson-real-analysis-riemann-integral"],
      ["lesson-real-analysis-weierstrass-yogunluk-teoremi"]
    ),
  ],
};
