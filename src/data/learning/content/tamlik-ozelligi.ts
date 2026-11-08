import { createValidatedLessonReview } from "@/lib/learning/editorial";
import type { LessonRichContent } from "@/lib/learning/lesson-content";

export const tamlikOzelligiLessonContent: LessonRichContent = {
  lessonId: "lesson-real-analysis-real-numbers",
  courseSlug: "real-analysis",
  lessonSlug: "real-numbers",
  status: "published",
  version: 1,
  conceptIds: [
    "concept-upper-bound",
    "concept-lower-bound",
    "concept-supremum",
    "concept-infimum",
    "concept-completeness",
  ],
  exerciseIds: [
    "exercise-completeness-upper-bounds",
    "exercise-completeness-supremum-vs-maximum",
    "exercise-completeness-supremum-infimum",
    "exercise-completeness-rationals",
    "exercise-completeness-translation-proof",
  ],
  review: createValidatedLessonReview(["Manual pilot validation tamamlandi."]),
  reviewNotes: ["Yayinlanan pilot ders; multi-lesson validation icinde korundu."],
  lastReviewedAt: "2026-08-15T00:00:00.000Z",
  reviewedBy: "Manual editorial validation",
  intro:
    "Tamlık, ℝ sayılar kümesini ℚ'dan ayıran ve reel analizin kurulmasını mümkün kılan temel yapısal özelliklerden biridir.",
  prerequisites: [
    {
      label: "Kümeler ve altküme gösterimi",
      href: "/concepts?concept=sets",
    },
    {
      label: "Reel sayılar ve sıralama",
      href: "/concepts?concept=real-numbers",
    },
    {
      label: "Matematiksel tanım okuma",
      href: "/concepts?concept=language-of-mathematics",
    },
  ],
  studyGuide: [
    {
      title: "1. Yukarıdan sınır",
      body: [
        "A ⊆ ℝ kümesi, her x ∈ A için x ≤ M olacak biçimde bir M ∈ ℝ varsa yukarıdan sınırlıdır.",
        "Bu tür bir M sayısına yukarıdan sınır denir. Aynı küme için birden fazla yukarıdan sınır bulunabilir; asıl önemli soru bunların en küçüğünün olup olmadığıdır.",
      ],
    },
    {
      title: "2. Supremum",
      body: [
        "A kümesinin supremumu, sup A ile gösterilir ve A'nın en küçük yukarıdan sınırıdır.",
        "Supremumun kümeye ait olması gerekmez. Bu yüzden supremum ile maksimum yakın kavramlardır ama aynı şey değildir.",
      ],
      statement: "sup A = A'nın en küçük yukarıdan sınırı",
      note: "En küçük yukarıdan sınır gerçekten A'nın elemanıysa aynı zamanda max A olur.",
    },
    {
      title: "3. Tamlık",
      body: [
        "Tamlık özelliği, ℝ içindeki yukarıdan sınırların soyut biçimde var olmakla kalmayıp yine ℝ içinde kalan en küçük bir yukarıdan sınıra keskinleştirilebildiğini söyler.",
        "Limit, yakınsaklık ve yaklaşım argümanlarının reel sayılar üzerinde bu kadar düzenli işlemesinin nedenlerinden biri de budur.",
      ],
      statement:
        "Yukarıdan sınırlı her boş olmayan A ⊆ ℝ kümesinin ℝ içinde bir supremumu vardır.",
      note:
        "Benzer biçimde, aşağıdan sınırlı her boş olmayan ℝ altkümesinin de ℝ içinde bir infimumu vardır.",
    },
    {
      title: "4. ℚ neden farklıdır?",
      body: [
        "Rasyonel sayılar sıralama ve cebir yapısını taşır, fakat tamlık özelliğini sağlamaz.",
        "Yukarıdan sınırlı olduğu halde rasyonel bir en küçük yukarıdan sınırı olmayan rasyonel kümeler vardır. Tamlık tam da bu boşluğu kapatır.",
      ],
    },
  ],
  keyConcepts: [
    {
      conceptId: "concept-upper-bound",
      summary: "Her x ∈ A için x ≤ M koşulunu sağlayan M sayısıdır.",
    },
    {
      conceptId: "concept-lower-bound",
      summary: "Her x ∈ A için m ≤ x koşulunu sağlayan m sayısıdır.",
    },
    {
      conceptId: "concept-supremum",
      summary: "Kümeye ait olsun ya da olmasın, bir kümenin en küçük yukarıdan sınırıdır.",
    },
    {
      conceptId: "concept-infimum",
      summary: "Supremumun aşağıdan sınırdaki karşılığı olan en büyük aşağıdan sınırdır.",
    },
    {
      conceptId: "concept-completeness",
      summary:
        "Yukarıdan sınırlı her boş olmayan ℝ altkümesinin ℝ içinde bir supremumu vardır.",
    },
  ],
  example: {
    title: "Örnek",
    expression: "A = {x ∈ ℝ : x² < 2}",
    overview:
      "Bu küme, tamlık özelliğinin nasıl çalıştığını doğrudan ve klasik bir örnek üzerinden görmenin en temiz yollarından biridir.",
    steps: [
      "A boştur değildir; çünkü 1 ∈ A.",
      "A yukarıdan sınırlıdır; örneğin 2 bir yukarıdan sınırdır.",
      "√2 sayısı A için bir yukarıdan sınırdır ve bundan daha küçük her reel sayı yukarıdan sınır olmayı başaramaz.",
      "Dolayısıyla ℝ içinde sup A = √2 olur.",
    ],
    contrastTitle: "ℚ ile karşılaştır",
    contrast: [
      "Şimdi {x ∈ ℚ : x² < 2} kümesini düşün.",
      "Bu küme ℚ içinde yine boş değildir ve yukarıdan sınırlıdır; fakat en küçük yukarıdan sınırı √2 olmak zorundadır.",
      "√2 ∉ ℚ olduğu için bu rasyonel kümenin ℚ içinde bir supremumu yoktur.",
    ],
    takeaway:
      "Tamlık, çalıştığın sayı sisteminin içinde en küçük yukarıdan sınırın gerçekten var olacağını garanti eden özelliktir.",
  },
};
