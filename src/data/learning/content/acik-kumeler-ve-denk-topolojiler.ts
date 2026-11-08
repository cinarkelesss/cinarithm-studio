import { createValidatedLessonReview } from "@/lib/learning/editorial";
import type { LessonRichContent } from "@/lib/learning/lesson-content";

export const acikKumelerVeDenkTopolojilerLessonContent: LessonRichContent = {
  lessonId: "lesson-metric-spaces-and-topology-open-balls-open-sets-closed-sets",
  courseSlug: "metric-spaces-and-topology",
  lessonSlug: "open-balls-open-sets-closed-sets",
  status: "published",
  version: 1,
  conceptIds: [
    "concept-metric-space",
    "concept-open-ball",
    "concept-open-set",
    "concept-closed-set",
    "concept-equivalent-metrics",
  ],
  exerciseIds: [
    "exercise-open-set-recognition",
    "exercise-open-closed-interval-classification",
    "exercise-discrete-metric-singleton",
    "exercise-open-ball-is-open",
    "exercise-intersection-of-open-sets",
  ],
  review: createValidatedLessonReview(["Manual multi-subject validation tamamlandi."]),
  reviewNotes: ["Yayinlanan topology validation dersi."],
  lastReviewedAt: "2026-08-15T00:00:00.000Z",
  reviewedBy: "Manual editorial validation",
  intro:
    "Açık küme dili, metriğin verdiği yakınlık bilgisini tek tek noktalardan çıkarıp küme düzeyine taşımanın yoludur.",
  prerequisites: [
    {
      label: "Kümeler",
      href: "/concepts?concept=sets",
    },
    {
      label: "Metrik uzaylar",
      href: "/concepts?concept=metric-spaces",
    },
    {
      label: "Matematiğin dili",
      href: "/concepts?concept=language-of-mathematics",
    },
  ],
  studyGuide: [
    {
      title: "1. Açık küre temel yapı taşıdır",
      body: [
        "Bir metrik uzayda merkez x ve yarıçap r ile kurulan açık küre, x noktasına r'den küçük uzaklıktaki tüm noktaları toplar.",
        "Topolojik dilin büyük bölümü bu küçük yerel kümelerin nasıl davranmasına baktığı için başlar.",
      ],
      statement: "B_r(x) = {y : d(x, y) < r}",
    },
    {
      title: "2. Açık küme yerel içerme koşuludur",
      body: [
        "Bir U kümesi açıksa, U içindeki her noktanın etrafında tamamen U'nun içinde kalan küçük bir açık küre vardır.",
        "Bu tanım, tek bir merkezi değil U içindeki her noktayı aynı anda kontrol eder.",
      ],
      statement: "x ∈ U ise bazı r > 0 için B_r(x) ⊆ U",
    },
    {
      title: "3. Kapalı kümeyi tümleyen üzerinden oku",
      body: [
        "Kapalı kümeyi tanımlamanın en temiz yollarından biri tümleyeninin açık olmasıdır.",
        "Bu bakış, açık ve kapalı kavramlarının birbirinden kopuk değil tamamlayıcı olduğunu gösterir.",
      ],
    },
    {
      title: "4. Denk metrikler aynı topolojiyi verir",
      body: [
        "İki metrik aynı açık kümeleri üretiyorsa, topolojik olarak aynı uzayı tarif ediyor deriz.",
        "Böylece yakınsaklık, süreklilik ve açıklık gibi kavramlar metrik formülünden çok üretilen açık kümelere bağlanır.",
      ],
    },
  ],
  keyConcepts: [
    {
      conceptId: "concept-metric-space",
      summary: "Metrik uzay, açıklık ve kapalılık gibi topolojik tanımların üzerinde kurulduğu yakınlık modelidir.",
    },
    {
      conceptId: "concept-open-ball",
      summary: "Yerel yakınlık bilgisini taşıyan temel kümedir; açıklık tanımı bunun üzerinden yapılır.",
    },
    {
      conceptId: "concept-open-set",
      summary: "Her noktasının çevresinde kendisi içinde kalan bir açık küre barındıran kümedir.",
    },
    {
      conceptId: "concept-closed-set",
      summary: "Tümleyeni açık olan ya da limit noktalarını kaçırmayan kümedir.",
    },
    {
      conceptId: "concept-equivalent-metrics",
      summary: "Metrik formülleri değişse bile aynı açık kümeler korunuyorsa topolojik davranış değişmez.",
    },
  ],
  example: {
    title: "Örnek",
    expression: "ℝ üzerinde d(x, y) = |x - y|",
    overview:
      "Standart mutlak değer metriğinde açık küreler, bildiğimiz açık aralıklarla aynı şeydir; bu yüzden topolojik sezgi burada çok somut kalır.",
    steps: [
      "B_r(a) küresi, merkez a ve yarıçap r için (a-r, a+r) aralığına karşılık gelir.",
      "Dolayısıyla (0,1) gibi bir aralık açıktır; çünkü içindeki her noktanın etrafında daha küçük bir açık aralık bulunur.",
      "[0,1] kümesinde ise 0 ve 1 uç noktaları sorun çıkarır; bu noktalardan dışarı taşmadan açık küre kuramazsın.",
      "Böylece aynı uzayda açık ve kapalı kümelerin neden farklı davrandığı görünür hale gelir.",
    ],
    contrastTitle: "Karşılaştır",
    contrast: [
      "Ayrık metrikte ise yeterince küçük yarıçap seçildiğinde açık küre tek bir noktaya iner.",
      "Bu nedenle ayrık metrikte her alt küme açık hale gelir; standart metrikteki sezgiden belirgin biçimde ayrılır.",
    ],
    takeaway:
      "Topoloji, nokta kümelerine hangi açık kürelerin eşlik ettiğini takip ederek uzayın genel davranışını okur.",
  },
};
