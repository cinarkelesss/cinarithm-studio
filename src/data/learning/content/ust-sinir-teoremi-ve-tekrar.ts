import type { LessonRichContent } from "@/lib/learning/lesson-content";

export const ustSinirTeoremiVeTekrarLessonContent: LessonRichContent = {
  lessonId: "lesson-real-analysis-supremum-and-infimum",
  courseSlug: "real-analysis",
  lessonSlug: "supremum-and-infimum",
  status: "published",
  version: 2,
  conceptIds: [
    "concept-upper-bound",
    "concept-lower-bound",
    "concept-supremum",
    "concept-infimum",
    "concept-completeness",
  ],
  exerciseIds: [
    "exercise-supremum",
    "ex-real-analysis-supremum-and-infimum-upper-bound-01",
    "ex-real-analysis-supremum-and-infimum-sup-vs-max-02",
    "ex-real-analysis-supremum-and-infimum-infimum-03",
    "ex-real-analysis-supremum-and-infimum-characterization-04",
  ],
  review: {
    mathematicalAccuracy: "pass",
    pedagogy: "pass",
    language: "pass",
    technical: "pass",
    notes: [
      "Üst sınır alıştırması tek doğru cevaba indirildi.",
      "Supremum ve infimum özetleri tanımsal dile yaklaştırıldı.",
      "Tamlık bölümü, her somut supremum hesabının doğrudan tamlık kullandığını ima etmeyecek şekilde daraltıldı.",
    ],
  },
  reviewNotes: [
    "Mathematical Review Sprint 1: Üst sınır çoktan seçmeli sorusu tek cevaplı hale getirildi.",
    "Karakterizasyon dili her ε > 0 için s - ε'nin üst sınır olamayacağı biçiminde sıkılaştırıldı.",
    "Terminoloji ve notasyon Türkçe karakterlerle standartlaştırıldı.",
    "Human Editorial Gate & Publish Batch 1: yoğunluk seviyesi video-destekli ders akışı için uygun bulundu ve tekrar metni gereksiz uzamadan korundu.",
    "Tamlık ile supremum ayrımını net taşıdığı için ilk kontrollü yayın kümesine alındı.",
  ],
  lastReviewedAt: "2026-08-15T00:00:00.000Z",
  reviewedBy: "Human Editorial Gate & Publish Batch 1",
  intro:
    "Üst sınır teoremi ve tekrar dersi, sup ve inf kavramlarını yalnızca tanım olarak değil, analizde tekrar tekrar kullanılan çalışma araçları olarak toparlar.",
  prerequisites: [
    { label: "Gerçel sayılar", href: "/concepts?concept=real-numbers" },
    { label: "Tamlık", href: "/concepts?concept=completeness" },
    { label: "Yukarıdan sınır", href: "/concepts?concept=upper-bound" },
  ],
  studyGuide: [
    {
      title: "1. Üst ve alt sınırı ayrı tut",
      body: [
        "Üst sınır ile alt sınır dual kavramlardır; fakat biri kümenin bütün elemanlarını yukarıdan, diğeri aşağıdan kontrol eder.",
        "Bu yön farkını açık tutmak, supremum ile infimumu birbirine karıştırmamanın ilk adımıdır.",
      ],
    },
    {
      title: "2. Supremum maksimum olmak zorunda değildir",
      body: [
        "Bir küme en küçük üst sınıra sahip olabilir; fakat bu sayı kümenin elemanı olmak zorunda değildir.",
        "Dolayısıyla sup A ile max A ancak supremumun kümeye ait olduğu durumda aynı sayıdır.",
      ],
      statement: "max A varsa sup A = max A, ama tersi her zaman zorunlu değildir.",
    },
    {
      title: "3. Karakterizasyonu ezberleme, kullan",
      body: [
        "s = sup A demek, bir yandan s'nin A için üst sınır olması, öte yandan her ε > 0 için s - ε sayısının artık üst sınır olamaması demektir.",
        "Bu ikinci parça, supremumun yakınından A'nın elemanları bulunabildiğini söyleyen kullanışlı bir karakterizasyondur.",
      ],
    },
    {
      title: "4. Tamlık burada arka planda çalışır",
      body: [
        "Boş olmayan ve yukarıdan sınırlı her kümenin supremuma sahip olması, gerçel sayı sisteminin tamlığına dayanır.",
        "Somut örneklerde supremumu doğrudan görebilsek de bu genel varlık ilkesi arka planda tamlık tarafından desteklenir.",
      ],
    },
  ],
  keyConcepts: [
    {
      conceptId: "concept-upper-bound",
      summary: "M sayısı, A kümesinin üst sınırıdır ancak ve ancak her x ∈ A için x ≤ M olur.",
    },
    {
      conceptId: "concept-lower-bound",
      summary: "m sayısı, A kümesinin alt sınırıdır ancak ve ancak her x ∈ A için m ≤ x olur.",
    },
    {
      conceptId: "concept-supremum",
      summary: "Supremum, A'nın hem üst sınırıdır hem de her üst sınırdan küçük ya da eşittir.",
    },
    {
      conceptId: "concept-infimum",
      summary: "İnfimum, A'nın hem alt sınırıdır hem de her alt sınırdan büyük ya da eşittir.",
    },
    {
      conceptId: "concept-completeness",
      summary: "Tamlık, boş olmayan ve yukarıdan sınırlı gerçek sayı kümeleri için supremum varlığını garanti eder.",
    },
  ],
  example: {
    title: "Örnek",
    expression: "A = (0, 1]",
    overview:
      "Bu küme, supremum ile maksimumun aynı; infimum ile minimumun ise farklı olabileceğini tek bakışta gösterir.",
    steps: [
      "1, A için üst sınırdır ve aynı zamanda kümenin elemanıdır.",
      "Bu nedenle sup A = 1 ve max A = 1 olur.",
      "0 ise A için alt sınırdır; fakat 0 kümenin elemanı değildir.",
      "Dolayısıyla inf A = 0 iken minimum yoktur.",
    ],
    contrastTitle: "Karşılaştır",
    contrast: [
      "[0,1] kümesinde hem supremum hem maksimum 1; hem infimum hem minimum 0 olur.",
      "(0,1) kümesinde ise iki uç da dışarıdadır; bu yüzden ne maksimum ne minimum vardır ama sup ve inf yine vardır.",
    ],
    takeaway:
      "Aidiyet sorusu, supremum ile maksimumu ve infimum ile minimumu birbirinden ayıran temel farktır.",
  },
};
