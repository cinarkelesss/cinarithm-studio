import { driveArchiveBySourceOrder } from "@/data/learning/drive-archive";
import { createLessonSlug } from "@/lib/learning/ingestion";
import type {
  LearningCatalog,
  LearningConcept,
  LearningCourse,
  LearningExercise,
  LearningLesson,
  LearningModule,
  VideoSource,
} from "@/lib/learning/domain";

type LessonSeed = {
  slug?: string;
  title: string;
  description: string;
  concepts: string[];
  durationMinutes?: number;
  sourceOrder?: number;
  sourceFileName?: string;
  driveFileId?: string;
  prerequisiteLessonSlugs?: string[];
  videoSource?: VideoSource;
};

type ModuleSeed = {
  title: string;
  description: string;
  lessons: LessonSeed[];
  driveFolderUrl?: string;
};

type CourseSeed = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  summary: string;
  kind: LearningCourse["kind"];
  recommended?: boolean;
  flagship?: boolean;
  accent: string;
  modules: ModuleSeed[];
  driveFolderUrl?: string;
};

type ExerciseSeed = {
  id: string;
  title: string;
  prompt: string;
  kind: LearningExercise["kind"];
  format: LearningExercise["format"];
  answerMode?: LearningExercise["answerMode"];
  placeholder?: string;
  hint?: string;
  solution?: string;
  choices?: Array<{
    id: string;
    text: string;
  }>;
  courseSlug: string;
  lessonSlug: string;
  conceptIds: string[];
};

const conceptSeeds: Array<Omit<LearningConcept, "courseIds">> = [
  {
    id: "concept-mathematical-thinking",
    slug: "mathematical-thinking",
    name: "Matematiksel Düşünme",
    description: "Soyut nesnelerle çalışırken tanım, örnek ve karşı örnek ritmini kurma.",
    prerequisiteIds: [],
  },
  {
    id: "concept-sets",
    slug: "sets",
    name: "Kümeler",
    description: "Küme dili, üyelik, alt küme ve işlemler.",
    prerequisiteIds: ["concept-mathematical-thinking"],
  },
  {
    id: "concept-language",
    slug: "language-of-mathematics",
    name: "Matematiğin Dili",
    description: "Niceleyiciler, tanım cümleleri ve sembolik-özlü yazım.",
    prerequisiteIds: ["concept-sets"],
  },
  {
    id: "concept-statements",
    slug: "mathematical-statements",
    name: "Matematiksel Önermeler",
    description: "Önermeler, doğruluk değerleri ve mantıksal akış.",
    prerequisiteIds: ["concept-language"],
  },
  {
    id: "concept-proof",
    slug: "proof-and-reasoning",
    name: "İspat ve Gerekçelendirme",
    description: "İspat taslağı, teknik seçimi ve doğru gerekçelendirme.",
    prerequisiteIds: ["concept-statements"],
  },
  {
    id: "concept-functions",
    slug: "functions",
    name: "Fonksiyonlar",
    description: "Fonksiyonların tanımı, görüntü-kaynak ayrımı ve örnekler.",
    prerequisiteIds: ["concept-language"],
  },
  {
    id: "concept-real-numbers",
    slug: "real-numbers",
    name: "Gerçel Sayılar",
    description: "Gerçek sayı doğrusu, alan yapısı ve düzen.",
    prerequisiteIds: ["concept-functions"],
  },
  {
    id: "concept-upper-bound",
    slug: "upper-bound",
    name: "Yukarıdan Sınır",
    description: "Bir kümenin tüm elemanlarından büyük ya da eşit olan sayı.",
    prerequisiteIds: ["concept-real-numbers", "concept-sets"],
  },
  {
    id: "concept-lower-bound",
    slug: "lower-bound",
    name: "Aşağıdan Sınır",
    description: "Bir kümenin tüm elemanlarından küçük ya da eşit olan sayı.",
    prerequisiteIds: ["concept-real-numbers", "concept-sets"],
  },
  {
    id: "concept-maximum",
    slug: "maximum",
    name: "Maksimum",
    description: "Kümenin içinde bulunan ve tüm elemanlardan büyük ya da eşit olan eleman.",
    prerequisiteIds: ["concept-upper-bound"],
  },
  {
    id: "concept-minimum",
    slug: "minimum",
    name: "Minimum",
    description: "Kümenin içinde bulunan ve tüm elemanlardan küçük ya da eşit olan eleman.",
    prerequisiteIds: ["concept-lower-bound"],
  },
  {
    id: "concept-completeness",
    slug: "completeness",
    name: "Tamlık",
    description: "Her boş olmayan ve yukarıdan sınırlı gerçek sayı kümesinin bir supremuma sahip olması.",
    prerequisiteIds: ["concept-real-numbers", "concept-supremum"],
  },
  {
    id: "concept-supremum",
    slug: "supremum-and-infimum",
    name: "Supremum",
    description: "Bir kümenin en küçük üst sınırı; kümenin dışında olsa bile sınır olarak en sıkı aday.",
    prerequisiteIds: ["concept-upper-bound"],
  },
  {
    id: "concept-infimum",
    slug: "infimum",
    name: "Infimum",
    description: "Bir kümenin en büyük alt sınırı; dual olarak supremumun alt-sınır versiyonu.",
    prerequisiteIds: ["concept-lower-bound"],
  },
  {
    id: "concept-sequences",
    slug: "sequences",
    name: "Diziler",
    description: "Dizilerin davranışı ve limit dili.",
    prerequisiteIds: ["concept-real-numbers"],
  },
  {
    id: "concept-limit",
    slug: "limit",
    name: "Limit",
    description:
      "Bir dizinin ya da fonksiyonun değerlerinin belirli bir hedefe yaklaşma davranışını düzenleyen analiz kavramı.",
    prerequisiteIds: ["concept-sequences", "concept-real-numbers"],
  },
  {
    id: "concept-accumulation-point",
    slug: "accumulation-point",
    name: "Yoğunlaşma Noktası",
    description: "Her komşuluğunda, kendisinden farklı küme noktaları bulunan nokta.",
    prerequisiteIds: ["concept-limit", "concept-sets"],
  },
  {
    id: "concept-density",
    slug: "density",
    name: "Yoğunluk",
    description: "Her a < b için araya aynı kümeden yeni bir nokta yerleştirilebilmesi.",
    prerequisiteIds: ["concept-real-numbers", "concept-sets"],
  },
  {
    id: "concept-archimedean-property",
    slug: "archimedean-property",
    name: "Arşimet Özelliği",
    description: "Her x ∈ ℝ için x'ten büyük bir n ∈ ℕ bulunacağını söyleyen özellik.",
    prerequisiteIds: ["concept-real-numbers", "concept-completeness"],
  },
  {
    id: "concept-cauchy",
    slug: "cauchy-sequences",
    name: "Cauchy Dizileri",
    description: "İçsel yakınlık fikri ve tamlık bağı.",
    prerequisiteIds: ["concept-sequences", "concept-completeness"],
  },
  {
    id: "concept-series",
    slug: "series",
    name: "Sonsuz Seriler",
    description: "Sonsuz toplamlar ve yakınsaklık testleri.",
    prerequisiteIds: ["concept-sequences"],
  },
  {
    id: "concept-continuity",
    slug: "continuity",
    name: "Süreklilik",
    description: "Fonksiyon limitleri ve süreklilik davranışı.",
    prerequisiteIds: ["concept-sequences"],
  },
  {
    id: "concept-uniform-continuity",
    slug: "uniform-continuity",
    name: "Düzgün Süreklilik",
    description: "Noktasal değil aralık düzeyinde kontrol edilen süreklilik.",
    prerequisiteIds: ["concept-continuity"],
  },
  {
    id: "concept-derivative",
    slug: "derivative",
    name: "Türev",
    description: "Türev, lineer yaklaşım ve temel sonuçlar.",
    prerequisiteIds: ["concept-continuity"],
  },
  {
    id: "concept-taylor",
    slug: "taylor-theorem",
    name: "Taylor Teoremi",
    description: "Yerel yaklaşım ve hata terimi sezgisi.",
    prerequisiteIds: ["concept-derivative"],
  },
  {
    id: "concept-integral",
    slug: "riemann-integral",
    name: "Riemann İntegrali",
    description: "Dilimleme, toplam ve integrallenebilirlik yapısı.",
    prerequisiteIds: ["concept-continuity"],
  },
  {
    id: "concept-metric-space",
    slug: "metric-spaces",
    name: "Metrik Uzaylar",
    description: "Mesafe aksiyomlarıyla soyut yakınlık modeli.",
    prerequisiteIds: ["concept-sequences"],
  },
  {
    id: "concept-open-ball",
    slug: "open-ball",
    name: "Açık Küre",
    description: "Bir merkez ve yarıçap seçilerek d(x, y) < r koşuluyla tanımlanan temel komşuluk kümesi.",
    prerequisiteIds: ["concept-metric-space"],
  },
  {
    id: "concept-open-set",
    slug: "open-set",
    name: "Açık Küme",
    description: "Her noktasının etrafında bütünüyle kümenin içinde kalan bir açık küre bulunabilen küme.",
    prerequisiteIds: ["concept-open-ball", "concept-sets"],
  },
  {
    id: "concept-closed-set",
    slug: "closed-set",
    name: "Kapalı Küme",
    description: "Tümleyeni açık olan ya da limit noktalarını içinde barındıran küme.",
    prerequisiteIds: ["concept-open-set"],
  },
  {
    id: "concept-equivalent-metrics",
    slug: "equivalent-metrics",
    name: "Denk Metrikler",
    description: "Aynı açık kümeleri, dolayısıyla aynı topolojik davranışı üreten metrikler.",
    prerequisiteIds: ["concept-open-set", "concept-metric-space"],
  },
  {
    id: "concept-compactness",
    slug: "compactness",
    name: "Kompaktlık",
    description: "Sonluluk benzeri davranış üreten güçlü topolojik özellik.",
    prerequisiteIds: ["concept-metric-space"],
  },
  {
    id: "concept-connectedness",
    slug: "connectedness",
    name: "Bağlılık",
    description: "Uzayın kopmadan tek parça kalma hali.",
    prerequisiteIds: ["concept-metric-space"],
  },
  {
    id: "concept-ordinals",
    slug: "ordinals",
    name: "Ordinaller",
    description: "İyi sıralar ve transfinit sıralama yapısı.",
    prerequisiteIds: ["concept-sets"],
  },
  {
    id: "concept-group",
    slug: "group",
    name: "Grup",
    description: "Bir birleşmeli işlem, bir birim eleman ve tersler ile tanımlanan cebirsel yapı.",
    prerequisiteIds: ["concept-functions"],
  },
  {
    id: "concept-subgroup",
    slug: "subgroup",
    name: "Altgrup",
    description: "Grup işlemi altında kapalı kalıp başlı başına grup oluşturan alt küme.",
    prerequisiteIds: ["concept-group", "concept-sets"],
  },
  {
    id: "concept-normal-subgroup",
    slug: "normal-subgroup",
    name: "Normal Altgrup",
    description: "Sol ve sağ yan sınıfları her eleman için çakışan altgrup.",
    prerequisiteIds: ["concept-subgroup"],
  },
  {
    id: "concept-coset",
    slug: "coset",
    name: "Yan Sınıf",
    description: "Bir grup elemanının altgrubu soldan ya da sağdan kaydırmasıyla elde edilen küme.",
    prerequisiteIds: ["concept-subgroup"],
  },
  {
    id: "concept-group-homomorphism",
    slug: "group-homomorphism",
    name: "Grup Homomorfizması",
    description: "Cebirsel yapılar arasında işlemi koruyan fonksiyon.",
    prerequisiteIds: ["concept-functions"],
  },
  {
    id: "concept-graph-theory",
    slug: "graph-theory",
    name: "Çizge Teorisi",
    description: "Düğümler, kenarlar ve ayrık yapı sezgisi.",
    prerequisiteIds: ["concept-sets"],
  },
  {
    id: "concept-vertex",
    slug: "vertex",
    name: "Düğüm",
    description: "Bir çizgenin temel noktası; kenarlar düğümler arasında kurulur.",
    prerequisiteIds: ["concept-graph-theory"],
  },
  {
    id: "concept-edge",
    slug: "edge",
    name: "Kenar",
    description: "İki düğüm arasındaki bağlantıyı temsil eden çizge elemanı.",
    prerequisiteIds: ["concept-vertex"],
  },
  {
    id: "concept-path",
    slug: "path",
    name: "Yol",
    description: "Ardışık kenarlarla birbirine bağlanan düğüm dizisi.",
    prerequisiteIds: ["concept-edge"],
  },
  {
    id: "concept-cycle",
    slug: "cycle",
    name: "Çevrim",
    description: "Başladığı düğüme geri dönen, tekrar etmeyen kapalı yol.",
    prerequisiteIds: ["concept-path"],
  },
  {
    id: "concept-graph-connectedness",
    slug: "graph-connectedness",
    name: "Çizgede Bağlantılılık",
    description: "Her iki düğüm arasında bir yol bulunması durumu.",
    prerequisiteIds: ["concept-path"],
  },
  {
    id: "concept-automata",
    slug: "finite-automata",
    name: "Sonlu Otomatlar",
    description: "Durum geçişleriyle dil tanıyan sonlu makineler.",
    prerequisiteIds: ["concept-language"],
  },
];

const courseSeeds: CourseSeed[] = [
  {
    slug: "foundations-of-mathematics",
    title: "Foundations of Mathematics",
    shortTitle: "Foundations",
    description:
      "Matematik dilini, kümeleri, önermeleri ve ispatı aynı omurgada oturtan başlangıç rotası.",
    summary: "Önerilen başlangıç noktası. Tüm diğer kursların dili burada kuruluyor.",
    kind: "core",
    recommended: true,
    accent: "bg-zinc-800/60",
    modules: [
      {
        title: "01 — Language, Sets, and Logic",
        description: "Arşivin gerçek başlangıç dersleriyle matematik dilini ve temel mantık akışını kur.",
        lessons: [
          {
            slug: "a-little-philosophy-mathematical-thinking",
            title: "Biraz Felsefe",
            description: "Tanım, örnek ve karşı örnek ritmini kuran giriş dersi.",
            concepts: ["concept-mathematical-thinking"],
            sourceOrder: 1,
          },
          {
            slug: "elements-and-sets",
            title: "Eleman ve Küme",
            description: "Üyelik, alt küme ve küme işlemleri üzerinden temel dili temizle.",
            concepts: ["concept-sets"],
            sourceOrder: 2,
          },
          {
            slug: "language-of-mathematics",
            title: "Matematiğin Dili ve Aksiyomları",
            description: "Niceleyici, tanım ve aksiyom okumayı sakin bir ritimle kur.",
            concepts: ["concept-language", "concept-statements"],
            sourceOrder: 3,
          },
          {
            slug: "axioms-and-modus-ponens",
            title: "Modus Ponens",
            description: "Geçerli çıkarımın en temel modelini aksiyomatik düşünceyle bağla.",
            concepts: ["concept-statements", "concept-proof"],
            sourceOrder: 4,
          },
        ],
      },
      {
        title: "02 — Arithmetic and Functions",
        description: "Sayı yapısı, aksiyomlar ve fonksiyon fikri arasında doğal bir köprü kur.",
        lessons: [
          {
            slug: "proof-and-mathematical-reasoning",
            title: "Bézout Teoremi",
            description: "Bir teoremi sakin bir yapıda okuyup gerekçelendirme ritmini hisset.",
            concepts: ["concept-proof"],
            sourceOrder: 5,
          },
          {
            slug: "arithmetic-foundations",
            title: "Aritmetik Aksiyomları",
            description: "İşlem yapısının hangi garantileri verdiğini aksiyomlar üzerinden gör.",
            concepts: ["concept-real-numbers"],
            sourceOrder: 6,
          },
          {
            slug: "functions",
            title: "Fonksiyon Nedir",
            description: "Fonksiyonları işlem değil yapı olarak okuyup örnekle.",
            concepts: ["concept-functions"],
            sourceOrder: 7,
          },
          {
            title: "Aritmetik Özellikler",
            description: "Sayı sistemleri üstündeki temel cebirsel davranışları pekiştir.",
            concepts: ["concept-real-numbers"],
            sourceOrder: 8,
          },
        ],
      },
      {
        title: "03 — Order, Infinity, and Completeness",
        description: "Düzen yapısı, sonsuzluk sezgisi ve tamlık fikrini aynı rotada birleştir.",
        lessons: [
          {
            slug: "order-axioms",
            title: "Sıralama Aksiyomları",
            description: "Düzen bağıntısı ve sayılar üzerindeki karşılaştırma yapısını kur.",
            concepts: ["concept-real-numbers"],
            sourceOrder: 9,
          },
          {
            title: "Kümeler Kuramının Önemi ve Sonsuzları Karşılaştırmak",
            description: "Sonsuz kümeleri ayırt etmenin neden ciddi bir yapı meselesi olduğunu gör.",
            concepts: ["concept-sets", "concept-ordinals"],
            sourceOrder: 10,
          },
          {
            title: "Hilbert'in Sonsuz Oteli",
            description: "Sonsuzlukla ilgili sezgiyi klasik bir örnek üzerinden keskinleştir.",
            concepts: ["concept-sets", "concept-ordinals"],
            sourceOrder: 11,
          },
          {
            title: "Sıralama Özellikleri",
            description: "Düzen aksiyomlarının sonuçlarını gerçek sayı sezgisiyle birlikte oku.",
            concepts: ["concept-real-numbers"],
            sourceOrder: 12,
          },
          {
            title: "Mutlak Değer",
            description: "Gerçek sayı doğrusu üzerindeki mesafe fikrini mutlak değer diliyle kur.",
            concepts: ["concept-real-numbers"],
            sourceOrder: 13,
          },
          {
            slug: "completeness",
            title: "Tamlık Özelliği",
            description: "Analizin en karakteristik aksiyomunu foundations düzeyinde tanıştır.",
            concepts: ["concept-completeness"],
            sourceOrder: 14,
          },
          {
            slug: "foundations-of-the-real-numbers",
            title: "Gerçel Sayılar Rasyonel Sayıları İçerir",
            description: "Rasyonellerin gerçek sayı sistemi içindeki yerini ve yoğunluk sezgisini kur.",
            concepts: ["concept-real-numbers", "concept-completeness"],
            sourceOrder: 15,
          },
          {
            title: "Supremum",
            description: "Üst sınır fikrini doğrudan arşiv dersinin kendi ritmiyle tanıştır.",
            concepts: ["concept-supremum", "concept-completeness"],
            sourceOrder: 16,
          },
        ],
      },
    ],
  },
  {
    slug: "calculus",
    title: "Calculus",
    shortTitle: "Calculus",
    description: "Fonksiyonlar, seriler, limitler ve büyüme mertebeleri için Drive video çalışma alanı.",
    summary: "12 videoluk Functions serisini izle, ders notlarını tut ve ilerlemeni kaydet.",
    kind: "core",
    accent: "bg-zinc-700/30",
    driveFolderUrl: "https://drive.google.com/drive/folders/1Rs-WbDXNH9rVJOkp6tY27tb7eOQxrCkk?hl=tr",
    modules: [
      {
        title: "01 — Functions",
        description: "Drive'daki Functions videolarını numaralı sırasıyla çalış.",
        driveFolderUrl: "https://drive.google.com/drive/folders/1KF_E01eWbZEjl801L5amJdZZx4LZ9UnU",
        lessons: [
          {
            title: "Functions",
            description: "Fonksiyonlar videosunu izle ve temel fikirleri not et.",
            concepts: ["concept-functions"],
            sourceFileName: "1 Functions.mp4",
            driveFileId: "1Z_fxG0X1cIoOGizyBGovL7_WykZ3NpDX",
            videoSource: { provider: "google-drive", fileId: "1Z_fxG0X1cIoOGizyBGovL7_WykZ3NpDX" },
          },
          {
            title: "Exponentials",
            description: "Üstel fonksiyonlar videosunu çalış ve örneklerini not et.",
            concepts: ["concept-functions"],
            sourceFileName: "2 Exponentials.mp4",
            driveFileId: "1ytS-v810zEOu-DtCGA-bMB3aA_Yac5zQ",
            videoSource: { provider: "google-drive", fileId: "1ytS-v810zEOu-DtCGA-bMB3aA_Yac5zQ" },
          },
          {
            title: "Exponentials — Bonus",
            description: "Üstel fonksiyonlar ek videosunu çalış.",
            concepts: ["concept-functions"],
            sourceFileName: "3 Exponentials BONUS.mp4",
            driveFileId: "1GQXLEe99iS53b7A5_0VsYzjVDkTPb3xR",
            videoSource: { provider: "google-drive", fileId: "1GQXLEe99iS53b7A5_0VsYzjVDkTPb3xR" },
          },
          {
            title: "Taylor Series",
            description: "Taylor serileri videosunu çalış ve kilit noktaları not et.",
            concepts: ["concept-taylor", "concept-series"],
            sourceFileName: "4 Taylor Series.mp4",
            driveFileId: "1JxWmirN3tKSXYRcYEVU0VpGTDcDLgcSf",
            videoSource: { provider: "google-drive", fileId: "1JxWmirN3tKSXYRcYEVU0VpGTDcDLgcSf" },
          },
          {
            title: "Computing Taylor Series",
            description: "Taylor serisi hesabı videosunu çalış.",
            concepts: ["concept-taylor", "concept-series"],
            sourceFileName: "5 Computing Taylor Series.mp4",
            driveFileId: "1Wxbtb9uO_3aKWp0YjaXr4ssTDOu3_psO",
            videoSource: { provider: "google-drive", fileId: "1Wxbtb9uO_3aKWp0YjaXr4ssTDOu3_psO" },
          },
          {
            title: "Convergence",
            description: "Yakınsaklık videosunu çalış ve sorularını not et.",
            concepts: ["concept-series", "concept-limit"],
            sourceFileName: "6 Convergence.mp4",
            driveFileId: "1KGQDisjUd0lT38wqtjPzROW8PQfnbUsz",
            videoSource: { provider: "google-drive", fileId: "1KGQDisjUd0lT38wqtjPzROW8PQfnbUsz" },
          },
          {
            title: "Convergence — Bonus",
            description: "Yakınsaklık ek videosunu çalış.",
            concepts: ["concept-series", "concept-limit"],
            sourceFileName: "7 Convergence BONUS.mp4",
            driveFileId: "1rR6OALwa-hkjIJCDO_3ILit3JjYuhjxi",
            videoSource: { provider: "google-drive", fileId: "1rR6OALwa-hkjIJCDO_3ILit3JjYuhjxi" },
          },
          {
            title: "Expansion Points",
            description: "Açılım noktaları videosunu çalış.",
            concepts: ["concept-taylor"],
            sourceFileName: "8 Expansion Points.mp4",
            driveFileId: "1BLHGEhcha6eP5ULxkR0fKtW7PRay8rPz",
            videoSource: { provider: "google-drive", fileId: "1BLHGEhcha6eP5ULxkR0fKtW7PRay8rPz" },
          },
          {
            title: "Limits",
            description: "Limitler videosunu çalış ve kendi özetini çıkar.",
            concepts: ["concept-limit"],
            sourceFileName: "9 Limits.mp4",
            driveFileId: "1Da86xDIZyKRxvvle1y9PIe1ioo0tJzxl",
            videoSource: { provider: "google-drive", fileId: "1Da86xDIZyKRxvvle1y9PIe1ioo0tJzxl" },
          },
          {
            title: "L-Hopital Rules",
            description: "L'Hôpital kuralları videosunu çalış.",
            concepts: ["concept-limit", "concept-derivative"],
            sourceFileName: "10 L-Hopital Rules.mp4",
            driveFileId: "1QpHGFjTH69Cxa-as7PMbdHoTQryhbx09",
            videoSource: { provider: "google-drive", fileId: "1QpHGFjTH69Cxa-as7PMbdHoTQryhbx09" },
          },
          {
            title: "Orders of Growth",
            description: "Büyüme mertebeleri videosunu çalış.",
            concepts: ["concept-limit", "concept-functions"],
            sourceFileName: "11 Orders of Growth.mp4",
            driveFileId: "1UV04g6A011fmPXVery1QyM4ro6tzWV6x",
            videoSource: { provider: "google-drive", fileId: "1UV04g6A011fmPXVery1QyM4ro6tzWV6x" },
          },
          {
            title: "Orders of Growth — Bonus",
            description: "Büyüme mertebeleri ek videosunu çalış.",
            concepts: ["concept-limit", "concept-functions"],
            sourceFileName: "12 Orders of Growth BONUS.mp4",
            driveFileId: "1HDeOKdDJvN-avgzHmvHHgUUBAxl99ZcZ",
            videoSource: { provider: "google-drive", fileId: "1HDeOKdDJvN-avgzHmvHHgUUBAxl99ZcZ" },
          },
        ],
      },
      {
        title: "02 — Differentiation",
        description: "Drive klasörü hazır; içinde henüz ders videosu bulunmuyor.",
        driveFolderUrl: "https://drive.google.com/drive/folders/1_OVWniyNQWQTorE3kZOgHdo189Nrf5SO",
        lessons: [],
      },
    ],
  },
  {
    slug: "real-analysis",
    title: "Real Analysis",
    shortTitle: "Real Analysis",
    description:
      "Gerçek sayılar, diziler, seriler, süreklilik, türev ve integral boyunca tam bir analiz omurgası.",
    summary: "Learning Hub'ın amiral gemisi. En yoğun ders deneyimi burada.",
    kind: "core",
    flagship: true,
    accent: "bg-zinc-700/40",
    modules: [
      {
        title: "01 — Real Number Foundations",
        description: "Gerçek sayı sistemi, tamlık ve yoğunluk etrafında analizin zeminini kur.",
        lessons: [
          {
            slug: "real-numbers",
            title: "Tamlık Özelliği",
            description: "Gerçek sayı sisteminin analizi neden taşıdığını tamlık üzerinden kur.",
            concepts: [
              "concept-upper-bound",
              "concept-lower-bound",
              "concept-maximum",
              "concept-minimum",
              "concept-supremum",
              "concept-infimum",
              "concept-completeness",
            ],
            sourceOrder: 14,
          },
          {
            slug: "ordered-field-structure",
            title: "Gerçel Sayılar Rasyonel Sayıları İçerir",
            description: "Rasyonellerin yoğunluğu ve gerçek sayı yapısının ayrıntılarını temizle.",
            concepts: ["concept-real-numbers", "concept-density"],
            sourceOrder: 15,
          },
          {
            slug: "supremum-and-infimum",
            title: "Üst Sınır Teoremi ve Tekrar",
            description: "Supremum dilini ve üst sınır teoremini analiz bağlamında netleştir.",
            concepts: [
              "concept-upper-bound",
              "concept-lower-bound",
              "concept-supremum",
              "concept-infimum",
              "concept-completeness",
            ],
            sourceOrder: 24,
          },
          {
            slug: "archimedean-property",
            title: "Arşimet Özelliği ve Yoğunluk",
            description: "Arşimet özelliği ile yoğunluk fikrini tamlık omurgasına bağla.",
            concepts: [
              "concept-supremum",
              "concept-real-numbers",
              "concept-density",
              "concept-archimedean-property",
            ],
            sourceOrder: 23,
          },
          {
            title: "Gerçel Sayılarda n'inci Kök",
            description: "Kök alma ve sıralı alan yapısının birlikte nasıl çalıştığını gör.",
            concepts: ["concept-real-numbers", "concept-completeness"],
            sourceOrder: 27,
          },
        ],
      },
      {
        title: "02 — Limits and Continuity",
        description: "Limit dili, yoğunlaşma noktaları ve sürekliliğin güçlü biçimleri.",
        lessons: [
          {
            slug: "limit-introduction-and-accumulation-point",
            title: "Limit Girişi ve Yoğunlaşma Noktası",
            description: "Limitin neden tek nokta yerine davranış örüntüsü olduğunu gör.",
            concepts: ["concept-sequences", "concept-limit", "concept-accumulation-point"],
            sourceOrder: 152,
          },
          {
            slug: "limits-of-functions",
            title: "Limit ve Yoğunlaşma Noktası Özellikleri",
            description: "Yoğunlaşma noktaları üstünden limit davranışının temel özelliklerini kur.",
            concepts: [
              "concept-sequences",
              "concept-limit",
              "concept-accumulation-point",
              "concept-continuity",
            ],
            sourceOrder: 154,
          },
          {
            title: "Üstel Fonksiyonlar ve Limitleri",
            description: "Üstel fonksiyonların limit davranışını klasik analiz diliyle oku.",
            concepts: ["concept-continuity", "concept-limit", "concept-real-numbers"],
            sourceOrder: 155,
          },
          {
            slug: "uniform-continuity",
            title: "Düzgün Süreklilik",
            description: "Sürekliliğin aralık ölçeğinde nasıl kontrol edildiğini fark et.",
            concepts: [
              "concept-functions",
              "concept-continuity",
              "concept-uniform-continuity",
              "concept-real-numbers",
            ],
            sourceOrder: 145,
          },
          {
            slug: "uniform-continuity-2",
            title: "Düzgün Süreklilik 2",
            description: "İkinci derste düzgün sürekliliğin örnek ve sonuçlarını daha dikkatli ayır.",
            concepts: ["concept-continuity", "concept-uniform-continuity", "concept-functions"],
            sourceOrder: 156,
          },
          {
            title: "Logaritma, Limit ve L'Hospital",
            description: "Logaritma ve limit hesaplarında L'Hospital sezgisini yerli yerinde kullan.",
            concepts: ["concept-limit", "concept-continuity", "concept-derivative"],
            sourceOrder: 162,
          },
        ],
      },
      {
        title: "03 — Series and Inequalities",
        description: "Eşitsizlikler, testler ve problem oturumlarıyla seri sezgisini genişlet.",
        lessons: [
          {
            slug: "inequalities-1",
            title: "Eşitsizlikler 1",
            description: "Serilere gelmeden önce eşitsizlik repertuvarını ilk oturumla kur.",
            concepts: ["concept-series", "concept-sequences"],
            sourceOrder: 153,
          },
          {
            title: "Eşitsizlikler",
            description: "Analiz boyunca tekrar dönen eşitsizlik fikirlerini tek yerde toparla.",
            concepts: ["concept-series", "concept-sequences"],
            sourceOrder: 159,
          },
          {
            slug: "convergence-tests",
            title: "Eşitsizlikler, Oran ve Kök Testi",
            description: "Oran ve kök testlerini eşitsizlik bakışıyla birlikte kullan.",
            concepts: ["concept-series"],
            sourceOrder: 161,
          },
          {
            title: "Aritmetik Geometrik Ortalama",
            description: "Klasik ortalama eşitsizliğini analiz içindeki doğal bağlamıyla oku.",
            concepts: ["concept-series", "concept-sequences"],
            sourceOrder: 165,
          },
          {
            title: "Problemler",
            description: "Analiz problem oturumunu ritim bozmadan ana omurgaya bağla.",
            concepts: ["concept-series", "concept-derivative"],
            sourceOrder: 164,
          },
        ],
      },
      {
        title: "04 — Differentiation",
        description: "Türev, Taylor ve problem oturumlarıyla diferansiyel bakışı derinleştir.",
        lessons: [
          {
            slug: "derivative-properties-and-trigonometry",
            title: "Türev Özellikleri ve Trigonometri",
            description: "Türevin temel özelliklerini trigonometrik örneklerle birlikte diri tut.",
            concepts: ["concept-derivative"],
            sourceOrder: 160,
          },
          {
            slug: "derivative",
            title: "Türev",
            description: "Türevi yerel doğrusal davranış olarak okuyup temel sezgiyi kur.",
            concepts: ["concept-derivative"],
            sourceOrder: 203,
          },
          {
            slug: "derivative-and-taylor-theorem",
            title: "Türev ve Taylor Teoremi",
            description: "Türevin klasik sonuçlarını Taylor yaklaşımıyla birlikte oku.",
            concepts: ["concept-derivative", "concept-taylor"],
            sourceOrder: 204,
          },
          {
            title: "Türev Problemleri 1",
            description: "Türev sezgisini doğrudan soru çözümü üstünden pekiştir.",
            concepts: ["concept-derivative"],
            sourceOrder: 209,
          },
          {
            title: "Türev Problemleri 2",
            description: "İkinci problem oturumu ile türev hesap ve argüman akışını sağlamlaştır.",
            concepts: ["concept-derivative"],
            sourceOrder: 211,
          },
        ],
      },
      {
        title: "05 — Function Sequences",
        description: "Düzgün yakınsaklık ve limit geçişlerinin hangi koşullarda güvenli olduğunu takip et.",
        lessons: [
          {
            slug: "pointwise-and-uniform-convergence",
            title: "Düzgün Yakınsaklık",
            description: "Uniform yakınsaklığın neden ayrı bir limit disiplini istediğini gör.",
            concepts: ["concept-uniform-continuity"],
            sourceOrder: 148,
          },
          {
            title: "Türev ve Düzgün Yakınsaklık",
            description: "Türev ile düzgün yakınsaklık arasındaki hassas ilişkiyi dikkatle takip et.",
            concepts: ["concept-uniform-continuity", "concept-derivative"],
            sourceOrder: 205,
          },
          {
            title: "Düzgün Yakınsaklık",
            description: "İkinci yakınsaklık dersiyle örnekleri ve karşı örnekleri pekiştir.",
            concepts: ["concept-uniform-continuity"],
            sourceOrder: 207,
          },
        ],
      },
      {
        title: "06 — Integration",
        description: "Riemann integrali, esas teorem ve belirsiz integral omurgası.",
        lessons: [
          {
            slug: "riemann-integral",
            title: "Riemann İntegrali 1",
            description: "Riemann toplamlarıyla integralin temel inşasını kur.",
            concepts: ["concept-integral"],
            sourceOrder: 213,
          },
          {
            title: "Riemann İntegrali 2",
            description: "İkinci integral dersini playable olmayan durumlarda bile arşiv bağlantısıyla koru.",
            concepts: ["concept-integral"],
            sourceOrder: 215,
          },
          {
            slug: "integrability-and-the-fundamental-theorem-of-calculus",
            title: "Analizin Esas Teoremi",
            description: "Türev ve integral arasındaki ana köprüyü arşiv dersinin kendi akışıyla izle.",
            concepts: ["concept-integral", "concept-derivative"],
            sourceOrder: 217,
          },
          {
            title: "Belirsiz İntegral Hesabı",
            description: "Belirsiz integral pratiğini arşivden gelen gerçek dersle bağla.",
            concepts: ["concept-integral"],
            sourceOrder: 219,
          },
        ],
      },
      {
        title: "07 — Review and Extensions",
        description: "Analizin ana hattını yoğunluk, ölçülebilirlik ve genel tekrar dersleriyle genişlet.",
        lessons: [
          {
            title: "Calculus",
            description: "Genel calculus bakışını analiz omurgasına geri bağlayan toparlayıcı bir ders.",
            concepts: ["concept-functions", "concept-derivative"],
            sourceOrder: 163,
          },
          {
            title: "Weierstrass Yoğunluk Teoremi",
            description: "Polinom yoğunluğunu analiz dilinin klasik sonuçlarından biri olarak takip et.",
            concepts: ["concept-continuity", "concept-series"],
            sourceOrder: 194,
          },
          {
            title: "Lebesgue ve Borel Ölçülebilir",
            description: "Ölçülebilirlik fikrine analiz tarafından açılan kapıyı kontrollü biçimde görünür kıl.",
            concepts: ["concept-integral"],
            sourceOrder: 149,
          },
        ],
      },
    ],
  },
  {
    slug: "metric-spaces-and-topology",
    title: "Metric Spaces & Topology",
    shortTitle: "Metric Spaces",
    description: "Mesafe, açık kümeler, kompaktlık ve bağlılık etrafında topolojik sezgiyi inşa eder.",
    summary: "Analiz sonrası doğal genişleme.",
    kind: "advanced",
    accent: "bg-zinc-600/25",
    modules: [
      {
        title: "01 — Metric Foundations",
        description: "Metrik, ultrametrik ve temel örneklerle yakınlık dilini başlat.",
        lessons: [
          {
            title: "Metrik Uzaylar",
            description: "Metrik uzay fikrine ikinci bir girişten bakıp temel sezgiyi genişlet.",
            concepts: ["concept-metric-space"],
            sourceOrder: 31,
          },
          {
            slug: "metric-spaces",
            title: "Metrik Uzay",
            description: "Mesafe aksiyomlarını örnekler ve karşı örneklerle oku.",
            concepts: ["concept-metric-space"],
            sourceOrder: 33,
          },
          {
            title: "Ultra Metrik",
            description: "Ultrametrik örnekler üstünden metrik aksiyomlarının sertleşen bir versiyonunu gör.",
            concepts: ["concept-metric-space"],
            sourceOrder: 34,
          },
          {
            title: "Metrik Örnekleri, Cauchy-Schwartz, Minkowski",
            description: "Metrik örnekleriyle norm ve eşitsizlik sezgisini aynı yerde toparla.",
            concepts: ["concept-metric-space"],
            sourceOrder: 35,
          },
          {
            slug: "open-balls-open-sets-closed-sets",
            title: "Açık Kümeler ve Denk Topolojiler",
            description: "Açık küme dilini ve denk topolojileri aynı omurgada kur.",
            concepts: [
              "concept-metric-space",
              "concept-open-ball",
              "concept-open-set",
              "concept-closed-set",
              "concept-equivalent-metrics",
            ],
            sourceOrder: 39,
          },
        ],
      },
      {
        title: "02 — Sequences and Subspaces",
        description: "Yığılma noktaları, diziler ve alt uzay bakışıyla metrik uzay davranışını izle.",
        lessons: [
          {
            title: "Yığılma Noktaları",
            description: "Bir uzayın yerel davranışını yığılma noktaları üzerinden izle.",
            concepts: ["concept-metric-space", "concept-sequences"],
            sourceOrder: 40,
          },
          {
            slug: "convergence-and-cauchy-sequences-in-metric-spaces",
            title: "Metrik Uzayda Dizi",
            description: "Metriğe bağlı yakınsaklık ve dizi davranışını doğrudan arşiv dersiyle bağla.",
            concepts: ["concept-metric-space", "concept-cauchy"],
            sourceOrder: 42,
          },
          {
            title: "Alt Uzayda Açık Küme",
            description: "Alt uzay topolojisinde açıklığın nasıl taşındığını örneklerle ayır.",
            concepts: ["concept-metric-space"],
            sourceOrder: 43,
          },
        ],
      },
    ],
  },
  {
    slug: "set-theory-and-ordinals",
    title: "Set Theory & Ordinals",
    shortTitle: "Set Theory",
    description: "Aksiyomatik kümelerden iyi sıralara ve ordinal aritmetiğe uzanan çizgi.",
    summary: "Temel soyut yapıların resmi dilini derinleştirir.",
    kind: "advanced",
    accent: "bg-zinc-800/50",
    modules: [
      {
        title: "01 — Set-Theoretic Foundations",
        description: "Kümeler kuramının önemi, aksiyomlar ve fonksiyon diliyle resmi başlangıcı kur.",
        lessons: [
          {
            title: "Kümeler Kuramının Önemi ve Sonsuzları Karşılaştırmak",
            description: "Kümeler kuramının neden bağımsız bir disiplin olduğunu sonsuzluk örnekleriyle gör.",
            concepts: ["concept-sets"],
            sourceOrder: 10,
          },
          {
            title: "Kümeler Kuramında Fonksiyonlar",
            description: "Fonksiyonları kümeler kuramı dilinde yeniden kur.",
            concepts: ["concept-sets", "concept-language"],
            sourceOrder: 29,
          },
          {
            title: "Kümeler Kuramı Aksiyom 3",
            description: "Aksiyomatik yapının gerçekten neyi güvence altına aldığını dikkatle oku.",
            concepts: ["concept-sets", "concept-language"],
            sourceOrder: 37,
          },
          {
            title: "Russell Paradoksu",
            description: "Naif küme sezgisinin nerede kırıldığını klasik paradoksla gör.",
            concepts: ["concept-sets"],
            sourceOrder: 38,
          },
          {
            title: "İlk 6 Aksiyom ve İlk Birkaç Doğal Sayı",
            description: "Aksiyomlardan doğal sayı inşasına giden yolu ilk örneklerle birlikte takip et.",
            concepts: ["concept-sets", "concept-functions"],
            sourceOrder: 41,
          },
          {
            title: "Kümeler Kuramı ve Sayılar",
            description: "Sayı sistemlerinin kümeler kuramı ile nasıl bağlandığını temel yapı açısından oku.",
            concepts: ["concept-sets", "concept-real-numbers"],
            sourceOrder: 208,
          },
        ],
      },
      {
        title: "02 — Well-Ordering and Ordinals",
        description: "İyi sıralı kümelerden ordinal yapılara geçiş.",
        lessons: [
          {
            slug: "well-ordered-sets-2",
            title: "İyi Sıralı Kümeler 2",
            description: "İyi sıralama düşüncesini arşiv serisinin iç ritmiyle kur.",
            concepts: ["concept-ordinals"],
            sourceOrder: 133,
          },
          {
            slug: "well-ordered-sets-3",
            title: "İyi Sıralı Kümeler 3",
            description: "İyi sıralı kümelerin bir sonraki oturumunda yapısal sonuçları daha açık gör.",
            concepts: ["concept-ordinals"],
            sourceOrder: 134,
          },
          {
            slug: "well-ordered-sets-4",
            title: "İyi Sıralı Kümeler 4",
            description: "Seriyi dördüncü adımda ordinal bakışa bağlayan geçiş noktalarını yakala.",
            concepts: ["concept-ordinals"],
            sourceOrder: 135,
          },
          {
            slug: "ordinals",
            title: "Ordinaller 1",
            description: "Ordinal sayıların neyi sıraladığını ilk kez temizce kur.",
            concepts: ["concept-ordinals"],
            sourceOrder: 136,
          },
          {
            title: "Sıralı Küme Homomorfizması",
            description: "Sıralı yapıları koruyan fonksiyonların neden önemli olduğunu gör.",
            concepts: ["concept-ordinals"],
            sourceOrder: 138,
          },
          {
            title: "Ordinaller 2",
            description: "Ordinal serisini ikinci adımda daha güçlü örneklerle genişlet.",
            concepts: ["concept-ordinals"],
            sourceOrder: 139,
          },
          {
            slug: "ordinals-3",
            title: "Ordinaller 3",
            description: "Ordinal dizinin üçüncü adımında örnekleri ve karşılaştırmaları genişlet.",
            concepts: ["concept-ordinals"],
            sourceOrder: 140,
          },
          {
            slug: "ordinals-4",
            title: "Ordinaller 4",
            description: "Dördüncü derste ordinal davranışı daha büyük örnekler üstünden izle.",
            concepts: ["concept-ordinals"],
            sourceOrder: 142,
          },
          {
            slug: "ordinals-5",
            title: "Ordinaller 5",
            description: "Beşinci oturum ordinal aritmetiğe geçmeden önce sezgiyi sıkılaştırır.",
            concepts: ["concept-ordinals"],
            sourceOrder: 143,
          },
          {
            title: "Ordinallerde Üs Alma",
            description: "Üs alma işleminin sonlu sezgiden nasıl ayrıldığını fark et.",
            concepts: ["concept-ordinals"],
            sourceOrder: 144,
          },
          {
            title: "Ordinallerde Cantor Normal Form",
            description: "Cantor normal formu ordinal ifadeleri düzenli okumak için kullan.",
            concepts: ["concept-ordinals"],
            sourceOrder: 146,
          },
          {
            title: "Ordinallerde Toplama ve Çarpma Formülü",
            description: "Ordinal aritmetiğin işlem kurallarını kompakt bir çerçevede tamamla.",
            concepts: ["concept-ordinals"],
            sourceOrder: 151,
          },
        ],
      },
    ],
  },
  {
    slug: "abstract-algebra",
    title: "Abstract Algebra",
    shortTitle: "Abstract Algebra",
    description: "Gruplar, halkalar ve homomorfizmler çevresinde yapı merkezli cebir.",
    summary: "İşlem ezberinden çok yapı diline odaklanır.",
    kind: "advanced",
    accent: "bg-zinc-700/30",
    modules: [
      {
        title: "01 — Polynomials and Extensions",
        description: "Cebirsel yapı dilini polinomlar ve cisim genişlemeleri üstünden başlat.",
        lessons: [
          {
            title: "Simetrik Polinomlar",
            description: "Simetrik polinomları yapı merkezli cebir bakışının giriş kapısı olarak oku.",
            concepts: ["concept-functions", "concept-group-homomorphism"],
            sourceOrder: 141,
          },
          {
            title: "Cisim Genişlemesi",
            description: "Alan genişlemelerinin neden cebirde merkezi bir rol oynadığını örneklerle izle.",
            concepts: ["concept-functions", "concept-group-homomorphism"],
            sourceOrder: 189,
          },
        ],
      },
      {
        title: "02 — Group Language",
        description: "Grup teorisinin temel dili, eşleniklik ve ana yapısal teoremler etrafında kurulur.",
        lessons: [
          {
            title: "Grup Teori Özellikleri",
            description: "Grupların temel davranışlarını yapı merkezli bir dille oku.",
            concepts: ["concept-group-homomorphism"],
            sourceOrder: 197,
          },
          {
            title: "Üreteçler ve Grup Eylemleri",
            description: "Üreteçler ve grup eylemlerinin yapıyı nasıl görünür kıldığını gör.",
            concepts: ["concept-group-homomorphism"],
            sourceOrder: 198,
          },
          {
            title: "Grup Etkisi",
            description: "Soyut yapının eylem üzerinden nasıl daha okunur hale geldiğini takip et.",
            concepts: ["concept-group-homomorphism"],
            sourceOrder: 199,
          },
          {
            title: "Centralizers",
            description: "Merkezleyiciler üstünden grup içi yerel yapıyı analiz et.",
            concepts: ["concept-group-homomorphism"],
            sourceOrder: 200,
          },
          {
            title: "Conjugacy Classes",
            description: "Eşleniklik sınıflarını grup yapısını sınıflandıran temel araçlardan biri olarak gör.",
            concepts: ["concept-group-homomorphism"],
            sourceOrder: 201,
          },
          {
            title: "Grup Teorisinin Temel Teoremi",
            description: "Grup teorisinin çekirdek yapısal teoremlerini arşiv dersinin kendi akışıyla takip et.",
            concepts: ["concept-group-homomorphism"],
            sourceOrder: 193,
          },
        ],
      },
      {
        title: "03 — Actions and Structure",
        description: "Soru oturumları ve yapısal sonuçlarla grup teorisi ritmini tamamlar.",
        lessons: [
          {
            title: "Normal Altgrup İncelemeleri",
            description: "Normal altgrupları yapısal sonuçlara hazırlayan örneklerle yeniden ele al.",
            concepts: [
              "concept-group",
              "concept-subgroup",
              "concept-normal-subgroup",
              "concept-coset",
            ],
            sourceOrder: 196,
          },
          {
            title: "Commutators",
            description: "Komütatörler üstünden abelyen olmayan yapıyı daha iyi ayır.",
            concepts: ["concept-group-homomorphism"],
            sourceOrder: 202,
          },
          {
            title: "Grup Teori Soruları",
            description: "Teorik yapıyı soru çözümü üstünden yeniden gözden geçir.",
            concepts: ["concept-group-homomorphism"],
            sourceOrder: 206,
          },
          {
            title: "Grup Teori: Sonlu Endeks Soruları",
            description: "Sonlu endeks sezgisini doğrudan problem üstünden çalış.",
            concepts: ["concept-group-homomorphism"],
            sourceOrder: 210,
          },
          {
            title: "Grup Teori Alıştırmaları (Cauchy Teoremi, p-grup,...)",
            description: "Cauchy ve p-grup çizgisini alıştırma odaklı bir oturumla pekiştir.",
            concepts: ["concept-group-homomorphism"],
            sourceOrder: 214,
          },
          {
            title: "Group Etkileri",
            description: "Eylem bakışını daha büyük örneklerle genişletip grup teorisi ritmini tamamla.",
            concepts: ["concept-group-homomorphism"],
            sourceOrder: 220,
          },
        ],
      },
    ],
  },
  {
    slug: "discrete-mathematics",
    title: "Discrete Mathematics",
    shortTitle: "Discrete Math",
    description: "Sayma teknikleri, graflar ve üretici fonksiyonlar etrafında ayrık düşünce.",
    summary: "Practice tarafını besleyecek güçlü bir problem alanı.",
    kind: "advanced",
    accent: "bg-zinc-600/20",
    modules: [
      {
        title: "01 — Graphs and Discrete Structures",
        description: "Graf sezgisi, izomorfizmalar ve ayrık yapı örüntüleri.",
        lessons: [
          {
            slug: "graph-theory-paths-and-trees",
            title: "Çizgeler Teorisine Giriş",
            description: "Graf temel nesnelerini ve ilk sezgileri temiz bir girişle kur.",
            concepts: [
              "concept-graph-theory",
              "concept-vertex",
              "concept-edge",
              "concept-path",
              "concept-cycle",
              "concept-graph-connectedness",
            ],
            sourceOrder: 17,
          },
          {
            title: "Graf İzomorfizma ve Otomorfizması",
            description: "Graf eşitliğini biçimsel olarak nasıl okuyacağını netleştir.",
            concepts: ["concept-graph-theory"],
            sourceOrder: 18,
          },
          {
            title: "Meşhur Graflar",
            description: "Klasik örnekler üzerinden ayrık yapı sezgisini genişlet.",
            concepts: ["concept-graph-theory"],
            sourceOrder: 19,
          },
          {
            title: "Diziden Grafa ve Graf İzomorfaları",
            description: "Grafı farklı temsil biçimleri arasında taşırken neyin korunduğunu gör.",
            concepts: ["concept-graph-theory"],
            sourceOrder: 20,
          },
          {
            title: "Graf Otomorfizmaları",
            description: "Simetri kavramını doğrudan graf otomorfizmalarıyla çalış.",
            concepts: ["concept-graph-theory"],
            sourceOrder: 21,
          },
          {
            slug: "planar-graphs-and-coloring",
            title: "Düzlemsel ve Renkli Graflar",
            description: "Düzlemsellik ve renklendirme kısıtlarını somut örneklerle takip et.",
            concepts: ["concept-graph-theory"],
            sourceOrder: 22,
          },
        ],
      },
      {
        title: "02 — Counting and Problem Sessions",
        description: "Kombinasyon ve yaratıcı problem oturumlarıyla ayrık düşünceyi genişlet.",
        lessons: [
          {
            title: "Kombinasyon Hesapları Ödev Çözümü",
            description: "Kombinasyon sezgisini ödev çözümü ritmiyle sağlamlaştır.",
            concepts: ["concept-graph-theory"],
            sourceOrder: 25,
          },
          {
            title: "Kare Boyama Problemleri",
            description: "Ayrık problem çözmeyi boyama örüntüleriyle pekiştir.",
            concepts: ["concept-graph-theory"],
            sourceOrder: 150,
          },
        ],
      },
    ],
  },
  {
    slug: "theory-of-computation",
    title: "Theory of Computation",
    shortTitle: "Computation",
    description: "Otomatlar, biçimsel diller ve hesaplanabilirlik üstünden hesap kuramı çizgisi.",
    summary: "Chris Stephenson serisini de taşıyabilecek bir yapı hazırlar.",
    kind: "advanced",
    accent: "bg-zinc-800/40",
    modules: [
      {
        title: "01 — Languages and Machines",
        description: "Chris Stephenson arşivinden gelen gerçek derslerle biçimsel diller çizgisini kur.",
        lessons: [
          {
            title: "Makinanın Formel Tanımına Doğru",
            description: "Biçimsel makine tanımına yaklaşırken hangi kavramların gerekli olduğunu kur.",
            concepts: ["concept-automata"],
            sourceOrder: 221,
          },
          {
            title: "Farklı Diller Arasında İlişki Bulmak",
            description: "Farklı dil sınıfları arasındaki ilişkileri kıyaslayan oturumu koru.",
            concepts: ["concept-automata"],
            sourceOrder: 223,
          },
          {
            title: "Non-determinisitik Sonlu Durum Makinesi",
            description: "Nondeterministic finite automata fikrini doğrudan arşiv dersiyle eşleştir.",
            concepts: ["concept-automata"],
            sourceOrder: 224,
          },
        ],
      },
    ],
  },
  {
    slug: "supplementary-and-miscellaneous",
    title: "Supplementary / Unclassified",
    shortTitle: "Supplementary",
    description: "Henüz tam kursa dönüşmemiş ama kaybolmaması gereken değerli matematik parçaları.",
    summary: "Geçici raf. İleride tam kurslara terfi ettirilebilir.",
    kind: "supplementary",
    accent: "bg-zinc-700/25",
    modules: [
      {
        title: "01 — Supplementary / Unclassified",
        description: "Ana kurslara zorla sokulmayan ama arşivden güvenle taşınan değerli dersler.",
        lessons: [
          {
            title: "İlk Sınav Çözümü",
            description: "Doğrudan ana kurs akışına oturmayan ama arşiv bağlamını koruyan çözüm oturumu.",
            concepts: ["concept-proof", "concept-functions"],
            sourceOrder: 26,
          },
          {
            title: "Özel bir Fonksiyon Arayışında",
            description: "Tekil problem atmosferini koruyan ve ana rotalara zorla bağlanmayan arşiv dersi.",
            concepts: ["concept-functions", "concept-proof"],
            sourceOrder: 28,
          },
          {
            title: "Bir Soru",
            description: "Bağlamı dar olan soru oturumunu kaybetmeden supplement rafında tut.",
            concepts: ["concept-proof"],
            sourceOrder: 32,
          },
          {
            title: "İç Çarpım ve Hilbert Uzayı",
            description: "Hilbert uzayı sezgisini supplement rafında görünür halde tut.",
            concepts: ["concept-metric-space"],
            sourceOrder: 157,
          },
          {
            title: "Ödev ve Soru",
            description: "Bağlamı ders akışına göre dar kalan soru oturumunu supplementte tut.",
            concepts: ["concept-proof", "concept-functions"],
            sourceOrder: 147,
          },
          {
            title: "Alıştırmalar",
            description: "Genel alıştırma oturumunu yapay bir ana kurs düğümüne zorlamadan koru.",
            concepts: ["concept-proof"],
            sourceOrder: 158,
          },
          {
            title: "Taban",
            description: "Tek başına kalmış lineer cebir içeriğini yapay bir kurs açmadan görünür tut.",
            concepts: ["concept-functions"],
            sourceOrder: 185,
          },
          {
            title: "Sabit Nokta Teoremi",
            description: "Analiz ve topolojiye dokunan ama şimdilik tekil kalan bu teoremi supplementte tut.",
            concepts: ["concept-metric-space", "concept-continuity"],
            sourceOrder: 212,
          },
          {
            title: "Pergel, Cetvel",
            description: "Geometriye açılan tekil ders, şimdilik supplementte daha dürüst bir yerde duruyor.",
            concepts: ["concept-proof", "concept-functions"],
            sourceOrder: 218,
          },
        ],
      },
    ],
  },
];

const exerciseSeeds: ExerciseSeed[] = [
  {
    id: "exercise-definition-reading",
    title: "Definition Reading Drill",
    prompt: "Language of Mathematics dersindeki bir tanımı üç parçaya ayır: nesne, koşul, sonuç. Sonra aynı tanımı kendi cümlenle yeniden yaz.",
    kind: "lesson",
    format: "reading",
    courseSlug: "foundations-of-mathematics",
    lessonSlug: "language-of-mathematics",
    conceptIds: ["concept-language"],
  },
  {
    id: "exercise-proof-skeleton",
    title: "Proof Skeleton",
    prompt: "Modus Ponens dersinden bir çıkarım kalıbı seç ve veri, hedef, geçiş adımları halinde kısa bir ispat iskeleti yaz.",
    kind: "lesson",
    format: "proof",
    courseSlug: "foundations-of-mathematics",
    lessonSlug: "axioms-and-modus-ponens",
    conceptIds: ["concept-proof"],
  },
  {
    id: "exercise-function-counterexample",
    title: "Function Counterexample",
    prompt: "Birebir ama örten olmayan ve örten ama birebir olmayan iki fonksiyon örneği üret. Tanım kümesi ile görüntü kümesini açık yaz.",
    kind: "practice",
    format: "reflection",
    courseSlug: "foundations-of-mathematics",
    lessonSlug: "functions",
    conceptIds: ["concept-functions"],
  },
  {
    id: "ex-calculus-functions-evaluate",
    title: "Fonksiyon Değeri ve Ters Soru",
    prompt: "f(x) = 3x - 2 için f(-1) değerini bul. Ayrıca f(x) = 10 eşitliğini sağlayan x kaçtır?",
    kind: "lesson",
    format: "computation",
    answerMode: "short_answer",
    placeholder: "İki sonucu ve işlem adımlarını yaz.",
    hint: "İlk kısımda x yerine -1 koy; ikinci kısımda 3x - 2 = 10 denklemini çöz.",
    solution: "f(-1) = 3(-1) - 2 = -5.\n3x - 2 = 10 ise 3x = 12, dolayısıyla x = 4.",
    courseSlug: "calculus",
    lessonSlug: "functions",
    conceptIds: ["concept-functions"],
  },
  {
    id: "ex-calculus-functions-domain",
    title: "Tanım Kümesini Bul",
    prompt: "g(x) = √(x + 2)/(x - 1) fonksiyonunun reel sayılardaki tanım kümesini bul.",
    kind: "lesson",
    format: "computation",
    answerMode: "short_answer",
    placeholder: "Karekök ve payda kısıtlarını ayrı ayrı yaz.",
    hint: "Karekökün içi negatif olamaz; payda sıfır olamaz.",
    solution:
      "x + 2 ≥ 0 koşulundan x ≥ -2 gelir. x - 1 ≠ 0 koşulundan x ≠ 1 gelir. İki koşulu birlikte sağlayan tanım kümesi [-2, 1) ∪ (1, ∞) olur.",
    courseSlug: "calculus",
    lessonSlug: "functions",
    conceptIds: ["concept-functions"],
  },
  {
    id: "ex-calculus-functions-image",
    title: "Görüntü ve Birebirlik",
    prompt:
      "A = {0, 1, 2}, B = {0, 1, 4, 9} ve f: A → B, f(x) = x² olsun. Görüntü kümesini bul; f birebir ve/veya örten midir?",
    kind: "lesson",
    format: "reflection",
    answerMode: "short_answer",
    placeholder: "Her girdinin çıktısını listele ve B ile karşılaştır.",
    hint: "f(0), f(1), f(2) değerlerini hesapla. 9 elde ediliyor mu?",
    solution:
      "f(0) = 0, f(1) = 1, f(2) = 4; görüntü kümesi {0, 1, 4} olur. Üç girdi farklı çıktılar verdiği için f birebirdir. 9 ∈ B elde edilmediği için f, B üzerine örten değildir.",
    courseSlug: "calculus",
    lessonSlug: "functions",
    conceptIds: ["concept-functions"],
  },
  {
    id: "ex-calculus-exponentials-equation",
    title: "Üstel Denklemi Çöz",
    prompt: "3^(2x - 1) = 27 denklemini çöz.",
    kind: "lesson",
    format: "computation",
    answerMode: "short_answer",
    placeholder: "27'yi 3 tabanında yaz.",
    hint: "27 = 3³ ve 3^x birebirdir.",
    solution: "27 = 3³ olduğundan 2x - 1 = 3 olur. Buradan 2x = 4 ve x = 2 bulunur.",
    courseSlug: "calculus",
    lessonSlug: "exponentials",
    conceptIds: ["concept-functions"],
  },
  {
    id: "ex-calculus-exponentials-decreasing",
    title: "Azalan Üstel Fonksiyon",
    prompt:
      "f(x) = (1/2)^x için f(-1) ve f(2) değerlerini bul. Hangisi daha büyük, neden?",
    kind: "lesson",
    format: "computation",
    answerMode: "short_answer",
    placeholder: "İki değeri hesaplayıp tabanı yorumla.",
    hint: "0 < 1/2 < 1 olduğunda x arttıkça fonksiyon değeri azalır.",
    solution:
      "f(-1) = (1/2)^(-1) = 2 ve f(2) = (1/2)² = 1/4 olur. 2 > 1/4 olduğundan f(-1) daha büyüktür. Taban 1'den küçük olduğu için fonksiyon azalandır.",
    courseSlug: "calculus",
    lessonSlug: "exponentials",
    conceptIds: ["concept-functions"],
  },
  {
    id: "ex-calculus-exponentials-growth-factor",
    title: "Bir Adımlık Büyüme",
    prompt:
      "g(x) = 4^(x - 1) için g(1), g(2) ve g(x + 1)/g(x) değerlerini bul.",
    kind: "lesson",
    format: "computation",
    answerMode: "short_answer",
    placeholder: "Üs kurallarını kullanarak oranı sadeleştir.",
    hint: "g(x + 1) = 4^x olur.",
    solution:
      "g(1) = 4^0 = 1 ve g(2) = 4^1 = 4. Ayrıca g(x + 1)/g(x) = 4^x/4^(x - 1) = 4 her reel x için geçerlidir.",
    courseSlug: "calculus",
    lessonSlug: "exponentials",
    conceptIds: ["concept-functions"],
  },
  {
    id: "ex-calculus-taylor-exponential",
    title: "e^x için Üçüncü Derece",
    prompt:
      "e^x fonksiyonunun 0 merkezli üçüncü derece Taylor polinomunu yaz ve x = 0.2 için değerini hesapla.",
    kind: "lesson",
    format: "computation",
    answerMode: "short_answer",
    placeholder: "Önce 0 noktasındaki türevleri yaz.",
    hint: "e^x'in her türevi yine e^x'tir ve 0'da 1 değerini alır.",
    solution:
      "P₃(x) = 1 + x + x²/2 + x³/6.\nP₃(0.2) = 1 + 0.2 + 0.04/2 + 0.008/6 = 1.221333… olur. Bu, e^(0.2) için bir yaklaşımdır.",
    courseSlug: "calculus",
    lessonSlug: "taylor-series",
    conceptIds: ["concept-taylor", "concept-series"],
  },
  {
    id: "ex-calculus-taylor-sine",
    title: "sin(x) için İlk Terimler",
    prompt:
      "sin(x) fonksiyonunun 0 merkezli üçüncü derece Taylor polinomunu yaz ve x = 0.3 için değerini hesapla.",
    kind: "lesson",
    format: "computation",
    answerMode: "short_answer",
    placeholder: "sin ve cos türevlerini 0'da değerlendir.",
    hint: "Sırasıyla türevler sin, cos, -sin, -cos; 0'daki değerler 0, 1, 0, -1 olur.",
    solution:
      "P₃(x) = x - x³/6.\nP₃(0.3) = 0.3 - 0.027/6 = 0.2955 olur. Bu, sin(0.3) için bir yaklaşımdır.",
    courseSlug: "calculus",
    lessonSlug: "taylor-series",
    conceptIds: ["concept-taylor", "concept-series"],
  },
  {
    id: "ex-calculus-taylor-geometric",
    title: "Geometrik Seriden Taylor Polinomu",
    prompt:
      "f(x) = 1/(1 - x) için 0 merkezli üçüncü derece Taylor polinomunu yaz. x = 0.2 için polinom değeri ve gerçek değer arasındaki mutlak farkı bul.",
    kind: "lesson",
    format: "computation",
    answerMode: "short_answer",
    placeholder: "1 + x + x² + x³ toplamından başla.",
    hint: "|x| < 1 iken 1/(1 - x) geometrik seridir; gerçek değer f(0.2) = 1/0.8 olur.",
    solution:
      "P₃(x) = 1 + x + x² + x³.\nP₃(0.2) = 1 + 0.2 + 0.04 + 0.008 = 1.248.\nf(0.2) = 1/0.8 = 1.25; mutlak fark |1.25 - 1.248| = 0.002 olur.",
    courseSlug: "calculus",
    lessonSlug: "taylor-series",
    conceptIds: ["concept-taylor", "concept-series"],
  },
  {
    id: "exercise-supremum",
    title: "Supremum ile Maksimum Ayrımı",
    prompt:
      "A = (0,1) kümesi için sup A'nın neden 1 olduğunu ve neden maksimum bulunmadığını kısa bir gerekçeyle açıkla.",
    kind: "lesson",
    format: "proof",
    answerMode: "proof",
    placeholder: "Önce 1'in üst sınır olduğunu, sonra 1'in kümeye ait olmadığını tartış.",
    hint:
      "1'den küçük her sayının üst sınır olamayacağını göstermek için (0,1) aralığında ona daha yakın bir eleman seç.",
    solution:
      "1, A için üst sınırdır; çünkü A'nın bütün elemanları 1'den küçüktür. Öte yandan c < 1 ise c ile 1 arasında bir x ∈ (0,1) seçilebilir; bu yüzden c üst sınır olamaz. Demek ki sup A = 1'dir. Ancak 1 ∉ A olduğu için A'nın maksimumu yoktur. Böylece supremum ile maksimumun farklı kavramlar olduğu görülür.",
    courseSlug: "real-analysis",
    lessonSlug: "supremum-and-infimum",
    conceptIds: ["concept-supremum"],
  },
  {
    id: "exercise-completeness-upper-bounds",
    title: "Yukarıdan Sınır Kontrolü",
    prompt:
      "A = {x ∈ ℝ : x < 3} olsun. Aşağıdaki sayılardan hangileri A için yukarıdan sınırdır?",
    kind: "lesson",
    format: "reading",
    answerMode: "multiple_choice",
    choices: [
      { id: "choice-2", text: "2" },
      { id: "choice-3", text: "3" },
      { id: "choice-4", text: "4" },
      { id: "choice-10", text: "10" },
    ],
    hint:
      "Bir M sayısının yukarıdan sınır olması için A içindeki her x için x ≤ M olmalıdır. A elemanlarının 3'e soldan istediğin kadar yaklaşabildiğini düşün.",
    solution:
      "Yukarıdan sınırlar 3, 4 ve 10'dur. 2 yukarıdan sınır değildir; çünkü A'nın 2'den büyük elemanları vardır, örneğin 2.5.",
    courseSlug: "real-analysis",
    lessonSlug: "real-numbers",
    conceptIds: ["concept-upper-bound", "concept-completeness"],
  },
  {
    id: "exercise-completeness-supremum-vs-maximum",
    title: "Supremum ve Maksimum",
    prompt:
      "A = (0, 1) kümesi için sup A'yı bul ve max A'nın var olup olmadığını belirle.",
    kind: "lesson",
    format: "computation",
    answerMode: "short_answer",
    placeholder: "Kısa bir açıklama yaz.",
    hint:
      "Aralığı yukarıdan sınırlayan en küçük sayıyı düşün; sonra bu sayının kümeye ait olup olmadığını sor.",
    solution:
      "sup A = 1'dir; çünkü A'nın her elemanı 1'den küçüktür ve 1'den küçük her sayı yukarıdan sınır olmayı başaramaz. Ancak 1 ∉ A olduğu için max A yoktur.",
    courseSlug: "real-analysis",
    lessonSlug: "real-numbers",
    conceptIds: ["concept-supremum", "concept-maximum"],
  },
  {
    id: "exercise-completeness-supremum-infimum",
    title: "Supremum ve İnfimumu Bul",
    prompt:
      "B = {x ∈ ℝ : -2 < x ≤ 5} olsun. inf B ve sup B'yi bul; ayrıca B'nin minimumu ya da maksimumu olup olmadığını söyle.",
    kind: "lesson",
    format: "computation",
    answerMode: "short_answer",
    placeholder: "inf B, sup B ve min/max durumunu yaz.",
    hint:
      "Hangi uç noktanın kümeye dahil, hangisinin hariç olduğuna dikkat et.",
    solution:
      "Bu küme için inf B = -2 ve sup B = 5'tir. 5 ∈ B olduğu için maksimum vardır ve değeri 5'tir. -2 ∉ B olduğu için minimum yoktur.",
    courseSlug: "real-analysis",
    lessonSlug: "real-numbers",
    conceptIds: ["concept-supremum", "concept-infimum", "concept-maximum", "concept-minimum"],
  },
  {
    id: "exercise-completeness-rationals",
    title: "ℚ Neden Tam Değildir?",
    prompt:
      "S = {q ∈ ℚ : q² < 2} kümesini düşün. S'nin ℚ içinde yukarıdan sınırlı olmasına rağmen neden ℚ içinde supremumu olmadığını açıkla.",
    kind: "lesson",
    format: "reflection",
    answerMode: "short_answer",
    placeholder: "ℚ içinde tamlığın neden bozulduğunu açıkla.",
    hint:
      "Aday en küçük yukarıdan sınır √2 olmak zorundadır. Peki ℚ içinde sorun tam olarak nerede çıkıyor?",
    solution:
      "S boş değildir; örneğin 1 ∈ S. Ayrıca yukarıdan sınırlıdır; örneğin 2 bir yukarıdan sınırdır. ℝ içinde bu kümenin supremumu √2 olur. Fakat √2 irrasyoneldir ve ℚ'nun elemanı değildir. Bu yüzden S'nin ℚ içinde en küçük yukarıdan sınırı yoktur; yani ℚ tam değildir.",
    courseSlug: "real-analysis",
    lessonSlug: "real-numbers",
    conceptIds: ["concept-completeness", "concept-supremum"],
  },
  {
    id: "exercise-completeness-translation-proof",
    title: "Supremumun Ötelenmesi",
    prompt:
      "A ⊆ ℝ boş olmayan ve yukarıdan sınırlı bir küme, c ∈ ℝ olsun. A + c = {a + c : a ∈ A} olmak üzere sup(A + c) = sup(A) + c eşitliğini ispatla.",
    kind: "lesson",
    format: "proof",
    answerMode: "proof",
    placeholder: "Kısa bir ispat yaz. Önce yukarıdan sınır adımıyla başla.",
    hint:
      "Önce sup(A) + c'nin A + c için bir yukarıdan sınır olduğunu göster. Sonra bundan küçük herhangi bir sayının yukarıdan sınır olamayacağını göster.",
    solution:
      "s = sup(A) olsun. Her a ∈ A için a ≤ s olduğundan a + c ≤ s + c elde edilir. Demek ki s + c, A + c için bir yukarıdan sınırdır. Şimdi M, A + c'nin herhangi bir yukarıdan sınırı olsun. O halde her a ∈ A için a + c ≤ M, dolayısıyla a ≤ M - c olur. Bu da M - c'nin A için bir yukarıdan sınır olduğunu gösterir. s en küçük yukarıdan sınır olduğundan s ≤ M - c elde edilir; buradan s + c ≤ M gelir. Yani s + c, A + c'nin her yukarıdan sınırından küçük ya da eşittir. Sonuç olarak sup(A + c) = s + c = sup(A) + c.",
    courseSlug: "real-analysis",
    lessonSlug: "real-numbers",
    conceptIds: ["concept-supremum", "concept-completeness", "concept-proof"],
  },
  {
    id: "ex-real-analysis-ordered-field-structure-rational-density-01",
    title: "Yoğunluk İfadesi",
    prompt:
      "Aşağıdaki ifadelerden hangisi ℚ'nun ℝ içindeki yoğunluğunu doğru anlatır?",
    kind: "lesson",
    format: "reading",
    answerMode: "multiple_choice",
    choices: [
      { id: "ofd-choice-a", text: "Her iki farklı gerçel sayı arasında bir rasyonel sayı vardır." },
      { id: "ofd-choice-b", text: "Her gerçel sayı rasyoneldir." },
      { id: "ofd-choice-c", text: "Her rasyonel sayı en büyük bir komşuyu belirler." },
      { id: "ofd-choice-d", text: "Rasyoneller yalnızca tam sayıların arasında bulunur." },
    ],
    hint:
      "Yoğunluk, sayıların eşit olması değil; aralarına aynı küme içinden yeni sayılar girebilmesidir.",
    solution:
      "Doğru ifade ilk seçenektir. ℚ'nun ℝ içinde yoğun olması, a < b olduğunda a ile b arasında mutlaka bir rasyonel sayı bulunması demektir.",
    courseSlug: "real-analysis",
    lessonSlug: "ordered-field-structure",
    conceptIds: ["concept-real-numbers", "concept-density"],
  },
  {
    id: "ex-real-analysis-ordered-field-structure-between-two-reals-02",
    title: "İki Gerçelin Arasına Rasyonel Seç",
    prompt:
      "a < b olsun. a ile b arasına rasyonel bir sayı seçilebilmesini neden beklediğini kısa bir açıklamayla yaz.",
    kind: "lesson",
    format: "reflection",
    answerMode: "short_answer",
    placeholder: "Ondalık genişleme ya da yoğunluk sezgisiyle açıkla.",
    hint:
      "Aralık ne kadar küçük olursa olsun ondalık ya da kesir seçimiyle araya yeni bir nokta sokulabilir.",
    solution:
      "a ile b arasındaki aralık sıfırdan büyüktür. Bu aralığa sığacak kadar ince bir payda seçildiğinde a'dan büyük, b'den küçük bir kesir bulunabilir. Bu, rasyonellerin gerçel sayılar içindeki yoğunluğunun temel sezgisidir.",
    courseSlug: "real-analysis",
    lessonSlug: "ordered-field-structure",
    conceptIds: ["concept-real-numbers", "concept-density"],
  },
  {
    id: "ex-real-analysis-ordered-field-structure-irrational-between-rationals-03",
    title: "Rasyonellerin Arasında İrrasyonel",
    prompt:
      "İki farklı rasyonel sayı arasında neden bir irrasyonel sayı da bulunur? Kısa bir yapıcı açıklama ver.",
    kind: "lesson",
    format: "reflection",
    answerMode: "short_answer",
    placeholder: "Bir rasyonel sayıyı irrasyonel kaydırmayla kullanabilirsin.",
    hint:
      "Aradaki bir rasyoneli bulup ona yeterince küçük bir irrasyonel miktar eklemeyi düşün.",
    solution:
      "a < b ise önce a ile b arasında bir rasyonel q buluruz. Sonra yeterince küçük bir rasyonel t > 0 için q + t√2 sayısının hâlâ (a,b) içinde kalmasını sağlarız. q rasyonel, t√2 irrasyonel olduğu için q + t√2 irrasyoneldir.",
    courseSlug: "real-analysis",
    lessonSlug: "ordered-field-structure",
    conceptIds: ["concept-real-numbers", "concept-density"],
  },
  {
    id: "ex-real-analysis-ordered-field-structure-no-largest-rational-04",
    title: "Aralıkta En Büyük Rasyonel Yoktur",
    prompt:
      "(0,1) aralığındaki rasyonel sayıların en büyük elemanı olmadığını gerekçelendir.",
    kind: "lesson",
    format: "proof",
    answerMode: "proof",
    placeholder: "q < 1 ise ondan biraz daha büyük yeni bir rasyonel kur.",
    hint:
      "q ∈ (0,1) ve q < 1 ise (q + 1)/2 sayısı nasıl davranır?",
    solution:
      "q ∈ (0,1) rasyonel olsun. O zaman q < (q + 1)/2 < 1 olur. (q + 1)/2 de rasyoneldir. Dolayısıyla q'dan büyük ama hâlâ (0,1) içinde kalan yeni bir rasyonel buluruz. Bu, en büyük rasyonel olamayacağını gösterir.",
    courseSlug: "real-analysis",
    lessonSlug: "ordered-field-structure",
    conceptIds: ["concept-density", "concept-proof"],
  },
  {
    id: "ex-real-analysis-supremum-and-infimum-upper-bound-01",
    title: "Üst Sınır Seçimi",
    prompt:
      "A = {x ∈ ℝ : x < 5} için aşağıdakilerden hangisi üst sınır değildir?",
    kind: "lesson",
    format: "reading",
    answerMode: "multiple_choice",
    choices: [
      { id: "sup-choice-a", text: "4" },
      { id: "sup-choice-b", text: "5" },
      { id: "sup-choice-c", text: "5.5" },
      { id: "sup-choice-d", text: "10" },
    ],
    hint:
      "5'e soldan istenildiği kadar yaklaşan elemanlar olduğunu unutma.",
    solution:
      "Doğru cevap 4'tür. A kümesinde 4'ten büyük elemanlar bulunduğu için 4 üst sınır değildir; buna karşılık 5, 5.5 ve 10 üst sınırdır.",
    courseSlug: "real-analysis",
    lessonSlug: "supremum-and-infimum",
    conceptIds: ["concept-upper-bound"],
  },
  {
    id: "ex-real-analysis-supremum-and-infimum-sup-vs-max-02",
    title: "Supremum ile Maksimumu Ayır",
    prompt:
      "(1,4] kümesi için sup ve max değerlerini yaz; sonra neden çakışabildiklerini açıkla.",
    kind: "lesson",
    format: "computation",
    answerMode: "short_answer",
    placeholder: "sup ve max degerlerini birlikte yaz.",
    hint:
      "Sağ uç noktanın kümeye dahil olup olmadığına dikkat et.",
    solution:
      "sup(1,4] = 4 ve max(1,4] = 4'tür. Çünkü 4 hem en küçük üst sınırdır hem de kümenin elemanıdır. Bu nedenle burada supremum ve maksimum aynı sayıda buluşur.",
    courseSlug: "real-analysis",
    lessonSlug: "supremum-and-infimum",
    conceptIds: ["concept-supremum", "concept-maximum"],
  },
  {
    id: "ex-real-analysis-supremum-and-infimum-infimum-03",
    title: "Infimum ve Minimum",
    prompt:
      "B = (-2,3) kümesi için infimum ve minimum durumunu belirle.",
    kind: "lesson",
    format: "reflection",
    answerMode: "short_answer",
    placeholder: "infimumu ve minimumun varligini yaz.",
    hint:
      "Sol uç noktanın kümede olup olmadığını kontrol et.",
    solution:
      "inf B = -2'dir. Ancak -2 kümenin elemanı olmadığı için minimum yoktur. Bu, infimum ile minimumun farklı kavramlar olduğunu gösterir.",
    courseSlug: "real-analysis",
    lessonSlug: "supremum-and-infimum",
    conceptIds: ["concept-infimum", "concept-minimum"],
  },
  {
    id: "ex-real-analysis-supremum-and-infimum-characterization-04",
    title: "Supremum Karakterizasyonu",
    prompt:
      "s = sup A ise neden her ε > 0 için A içinde s - ε'den büyük bir eleman bulunmak zorundadır? Kısa bir gerekçe yaz.",
    kind: "lesson",
    format: "proof",
    answerMode: "proof",
    placeholder: "Aksi halde s - ε'nin nasıl bir üst sınır olacağını tartış.",
    hint:
      "Eğer hiç böyle bir eleman olmasaydı s - ε bir üst sınır olur muydu?",
    solution:
      "Aksi halde bir ε > 0 için tüm a ∈ A elemanları a ≤ s - ε sağlardı. Bu durumda s - ε, A için bir üst sınır olurdu. Oysa s = sup A olduğundan s'den daha küçük bir üst sınır olamaz. Çelişki elde edilir; demek ki A içinde s - ε'den büyük bir eleman vardır.",
    courseSlug: "real-analysis",
    lessonSlug: "supremum-and-infimum",
    conceptIds: ["concept-supremum", "concept-upper-bound"],
  },
  {
    id: "ex-real-analysis-archimedean-property-threshold-01",
    title: "Arşimet Özelliği Ne Der?",
    prompt:
      "Aşağıdaki ifadelerden hangisi Arşimet özelliğine en yakındır?",
    kind: "lesson",
    format: "reading",
    answerMode: "multiple_choice",
    choices: [
      { id: "arch-choice-a", text: "Her x ∈ ℝ için x'ten büyük bir n ∈ ℕ vardır." },
      { id: "arch-choice-b", text: "Her gerçek sayı bir tam sayıya eşittir." },
      { id: "arch-choice-c", text: "Her gerçek sayının karekökü rasyoneldir." },
      { id: "arch-choice-d", text: "Doğal sayılar sınırlıdır." },
    ],
    hint:
      "Doğal sayıların sınırsız büyüdüğünü ifade eden seçeneği ara.",
    solution:
      "Doğru seçenek ilkidir. Arşimet özelliği, her gerçek sayının üzerine çıkabilecek kadar büyük bir doğal sayı bulunacağını söyler.",
    courseSlug: "real-analysis",
    lessonSlug: "archimedean-property",
    conceptIds: ["concept-archimedean-property", "concept-real-numbers"],
  },
  {
    id: "ex-real-analysis-archimedean-property-reciprocal-02",
    title: "1/n ile Sıkıştır",
    prompt:
      "Verilen ε > 0 için neden 1/n < ε olacak bir n ∈ ℕ seçilebilir?",
    kind: "lesson",
    format: "reflection",
    answerMode: "short_answer",
    placeholder: "Arşimet özelliğini doğrudan uygula.",
    hint:
      "1/ε sayısını geçen bir n seç; sonra terslerini karşılaştır.",
    solution:
      "Arşimet özelliğine göre 1/ε sayısından büyük bir n ∈ ℕ vardır. ε > 0 olduğundan ters alma yönü değişmez ve n > 1/ε eşitsizliğinden 1/n < ε elde edilir. Böylece küçüklük kontrolü doğal sayılarla kurulabilir.",
    courseSlug: "real-analysis",
    lessonSlug: "archimedean-property",
    conceptIds: ["concept-archimedean-property", "concept-real-numbers"],
  },
  {
    id: "ex-real-analysis-archimedean-property-density-03",
    title: "Yoğunluğa Giden Adım",
    prompt:
      "a < b ise neden uygun büyüklükte bir n seçip an ile bn arasına bir tam sayı yerleştirmek yoğunluk ispatında işe yarar?",
    kind: "lesson",
    format: "reflection",
    answerMode: "short_answer",
    placeholder: "Tam sayı seçiminin neden rasyonel ürettiğini açıkla.",
    hint:
      "n(b-a) > 1 olduğunda an ile bn arasındaki uzunluk 1'i geçer; sonra an'den büyük ilk tam sayıyı düşün.",
    solution:
      "Arşimet özelliği sayesinde n(b-a) > 1 olacak kadar büyük bir n seçilebilir. an'den büyük bir m ∈ ℤ tam sayısı alalım; o zaman m ≤ an + 1 olur. n(b-a) > 1 eşitsizliği an + 1 < bn verdiği için an < m < bn elde edilir. Dolayısıyla a < m/n < b ve m/n rasyoneldir. Böylece a ile b arasına yapıcı biçimde bir rasyonel yerleştirilmiş olur.",
    courseSlug: "real-analysis",
    lessonSlug: "archimedean-property",
    conceptIds: ["concept-archimedean-property", "concept-density"],
  },
  {
    id: "ex-real-analysis-archimedean-property-integer-gap-04",
    title: "Aralıkta Tam Sayı Bulma",
    prompt:
      "x ∈ ℝ için x < n olacak bir n ∈ ℕ bulunduğunu kullanarak her gerçek sayının üstünde bir tam sayı olduğunu gerekçelendir.",
    kind: "lesson",
    format: "proof",
    answerMode: "proof",
    placeholder: "Doğal sayının tam sayı olduğunu ve neden yeterli olduğunu yaz.",
    hint:
      "Arşimet özelliği zaten gereken n'i veriyor; bunu tam sayı olarak yorumla.",
    solution:
      "Arşimet özelliğine göre her x ∈ ℝ için x'ten büyük bir n ∈ ℕ vardır. ℕ, ℤ'nin altkümesi olduğundan bu n aynı zamanda bir tam sayıdır. Demek ki her gerçek sayının üstünde en az bir tam sayı bulunur.",
    courseSlug: "real-analysis",
    lessonSlug: "archimedean-property",
    conceptIds: ["concept-archimedean-property", "concept-real-numbers"],
  },
  {
    id: "ex-real-analysis-nth-root-order-01",
    title: "n'inci Kök Sezgisi",
    prompt:
      "a > 1 ve n ∈ ℕ için aşağıdakilerden hangisi doğrudur?",
    kind: "lesson",
    format: "reading",
    answerMode: "multiple_choice",
    choices: [
      { id: "root-choice-a", text: "x^n = a denkleminin pozitif çözümü de 1'den büyüktür." },
      { id: "root-choice-b", text: "Pozitif çözüm her zaman 0'dan küçüktür." },
      { id: "root-choice-c", text: "Pozitif çözüm yalnızca n tek ise vardır." },
      { id: "root-choice-d", text: "Pozitif çözüm daima a'ya eşittir." },
    ],
    hint:
      "a > 1 ise pozitif n'inci kök de pozitiftir; 1'in altında kalsaydı n'inci kuvveti a'yı veremezdi.",
    solution:
      "Doğru seçenek ilkidir. a > 1 ise x^n = a denkleminin pozitif çözümü 1'in üstünde kalır; çünkü 0 < x ≤ 1 olsaydı x^n ≤ 1 olurdu ve a > 1 ile çelişirdi.",
    courseSlug: "real-analysis",
    lessonSlug: "gercel-sayilarda-ninci-kok",
    conceptIds: ["concept-real-numbers", "concept-functions"],
  },
  {
    id: "ex-real-analysis-nth-root-supremum-02",
    title: "Supremumla Kök Kur",
    prompt:
      "a > 0 ve n ∈ ℕ için S = {x > 0 : x^n < a} kümesinin supremumunu almak neden n'inci kök varlığına giden doğal bir adımdır?",
    kind: "lesson",
    format: "reflection",
    answerMode: "short_answer",
    placeholder: "Aday sayının sınır rolünü açıkla.",
    hint:
      "Kök, x^n < a eşitsizliğini sınır noktada eşitliğe taşımaya adaydır.",
    solution:
      "S boş olmayan ve yukarıdan sınırlı bir küme olarak kurulduğunda tamlık sayesinde s = sup S vardır. Bu aday sayı, x^n < a koşulunu daha fazla büyütemeyeceğin sınır noktayı temsil eder. Sonra s^n < a ve s^n > a varsayımlarının ikisi de çelişkiye götürülerek s^n = a elde edilir.",
    courseSlug: "real-analysis",
    lessonSlug: "gercel-sayilarda-ninci-kok",
    conceptIds: ["concept-completeness", "concept-supremum"],
  },
  {
    id: "ex-real-analysis-nth-root-comparison-03",
    title: "Karşılaştırma",
    prompt:
      "0 < a < b ve n ∈ ℕ ise neden a'nın pozitif n'inci kökü, b'nin pozitif n'inci kökünden küçüktür? Kısa bir açıklama yaz.",
    kind: "lesson",
    format: "reflection",
    answerMode: "short_answer",
    placeholder: "x ↦ x^n fonksiyonunun artanlığını kullan.",
    hint:
      "x ↦ x^n fonksiyonunu pozitif sayılarda düşün.",
    solution:
      "Pozitif gerçel sayılarda x ↦ x^n fonksiyonu artandır. Bu nedenle daha büyük sayının pozitif n'inci kökü de daha büyük olur; aksi halde tekrar n'inci kuvvet alınca a < b sırası bozulurdu.",
    courseSlug: "real-analysis",
    lessonSlug: "gercel-sayilarda-ninci-kok",
    conceptIds: ["concept-real-numbers", "concept-functions"],
  },
  {
    id: "ex-real-analysis-nth-root-uniqueness-04",
    title: "Pozitif Kökün Tekliği",
    prompt:
      "x^n = a = y^n, x,y > 0 ve n ∈ ℕ ise neden x = y olmak zorundadır? Gerekçelendir.",
    kind: "lesson",
    format: "proof",
    answerMode: "proof",
    placeholder: "n'inci kuvvet fonksiyonunun artanlığını kullan.",
    hint:
      "x < y veya y < x varsayımları n'inci kuvvet alınca ne olur?",
    solution:
      "x < y olsaydı pozitif sayılarda x^n < y^n olurdu. Bu ise a = x^n = y^n varsayımıyla çelişir. Benzer şekilde y < x de mümkün değildir. O halde tek olasılık x = y'dir; pozitif n'inci kök tektir.",
    courseSlug: "real-analysis",
    lessonSlug: "gercel-sayilarda-ninci-kok",
    conceptIds: ["concept-proof", "concept-functions"],
  },
  {
    id: "ex-real-analysis-limit-intro-definition-01",
    title: "Limit Dilini Tanı",
    prompt:
      "Bir dizinin limiti L demek, sezgisel olarak hangisini söylemektir?",
    kind: "lesson",
    format: "reading",
    answerMode: "multiple_choice",
    choices: [
      { id: "limit-choice-a", text: "Terimler yeterince ileride L'ye istendiği kadar yakın olur." },
      { id: "limit-choice-b", text: "Tüm terimler L'ye eşittir." },
      { id: "limit-choice-c", text: "Dizi sonunda durur." },
      { id: "limit-choice-d", text: "Dizi mutlaka artandır." },
    ],
    hint:
      "Limit, eşitlikten ziyade yakınlaşma davranışıdır.",
    solution:
      "Doğru seçenek ilkidir. Limit, dizinin belli bir andan sonra L civarında kalmasını ifade eder; tüm terimlerin tam eşit olması gerekmez.",
    courseSlug: "real-analysis",
    lessonSlug: "limit-introduction-and-accumulation-point",
    conceptIds: ["concept-limit", "concept-sequences"],
  },
  {
    id: "ex-real-analysis-limit-intro-sequence-02",
    title: "1/n Dizisi",
    prompt:
      "a_n = 1/n dizisinin neden 0'a gittiğini kısa bir açıklamayla yaz.",
    kind: "lesson",
    format: "reflection",
    answerMode: "short_answer",
    placeholder: "n büyüdükçe paydanın nasıl davrandığını anlat.",
    hint:
      "Arşimet özelliği yardımıyla 1/n'i istediğin kadar küçültmeyi düşün.",
    solution:
      "n büyüdükçe 1/n de küçülür. Verilen herhangi bir ε > 0 için 1/n < ε olacak kadar büyük n seçilebilir. Bu yüzden dizi 0'a yaklaşır.",
    courseSlug: "real-analysis",
    lessonSlug: "limit-introduction-and-accumulation-point",
    conceptIds: ["concept-limit", "concept-sequences"],
  },
  {
    id: "ex-real-analysis-limit-intro-accumulation-03",
    title: "Yoğunlaşma Noktasını Ayır",
    prompt:
      "{1/n : n ∈ ℕ} kümesi için 0 neden yoğunlaşma noktasıdır?",
    kind: "lesson",
    format: "reflection",
    answerMode: "short_answer",
    placeholder: "Her komşulukta neden yeni dizi terimi bulunduğunu yaz.",
    hint:
      "0'ın hangi delinmiş komşuluğunu seçersen seç, içine girecek kadar büyük n bulunur.",
    solution:
      "0'ın her komşuluğunda, hatta her delinmiş komşuluğunda, 1/n biçiminde bir terim bulunur. Gerçekten, verilen herhangi bir r > 0 için yeterince büyük n seçildiğinde 1/n < r olur ve 1/n ≠ 0 olduğu için bu terim 0'ın delinmiş komşuluğuna düşer. Bu nedenle 0 bir yoğunlaşma noktasıdır.",
    courseSlug: "real-analysis",
    lessonSlug: "limit-introduction-and-accumulation-point",
    conceptIds: ["concept-accumulation-point", "concept-limit"],
  },
  {
    id: "ex-real-analysis-limit-intro-uniqueness-04",
    title: "Limit Tekliği",
    prompt:
      "Bir dizinin iki farklı limite sahip olamayacağını gerekçelendir.",
    kind: "lesson",
    format: "proof",
    answerMode: "proof",
    placeholder: "İki limit arasındaki uzaklığın yarısını kullan.",
    hint:
      "L ≠ M ise aralarındaki mesafenin yarısı kadar iki ayrı çevre düşün.",
    solution:
      "L ≠ M olsun. ε = |L - M|/2 alalım. Dizi hem L'ye hem M'ye yakınlasıyor olsaydı yeterince büyük n için hem |a_n - L| < ε hem de |a_n - M| < ε olurdu. Üçgen eşitsizliğinden |L - M| ≤ |L - a_n| + |a_n - M| < 2ε = |L - M| çelişkisi çıkar. Demek ki limit tektir.",
    courseSlug: "real-analysis",
    lessonSlug: "limit-introduction-and-accumulation-point",
    conceptIds: ["concept-limit", "concept-sequences"],
  },
  {
    id: "ex-real-analysis-limits-of-functions-deleted-neighborhood-01",
    title: "Silinmiş Civar Fikri",
    prompt:
      "Fonksiyon limiti incelenirken x = a noktasını bazen neden ayırırız?",
    kind: "lesson",
    format: "reading",
    answerMode: "multiple_choice",
    choices: [
      { id: "lof-choice-a", text: "Çünkü limit, noktadaki değerden çok noktaya yaklaşırkenki davranışı ölçer." },
      { id: "lof-choice-b", text: "Çünkü fonksiyonlar a noktasında tanımlı olamaz." },
      { id: "lof-choice-c", text: "Çünkü a her zaman irrasyoneldir." },
      { id: "lof-choice-d", text: "Çünkü limit yalnızca diziler için vardır." },
    ],
    hint:
      "Limit davranışı, hedef noktadaki tek bir değere indirgenmez.",
    solution:
      "Doğru seçenek ilkidir. Fonksiyonun a'daki değeri farklı olsa bile x, a'ya yaklaşırken tek bir davranışa gidiyor olabilir; bu yüzden silinmiş civar kullanırız.",
    courseSlug: "real-analysis",
    lessonSlug: "limits-of-functions",
    conceptIds: ["concept-limit", "concept-functions"],
  },
  {
    id: "ex-real-analysis-limits-of-functions-sum-law-02",
    title: "Toplam Limiti",
    prompt:
      "x → a iken lim f(x) = L ve lim g(x) = M ise neden lim (f + g)(x) = L + M beklenir? Kısa açıklama yaz.",
    kind: "lesson",
    format: "reflection",
    answerMode: "short_answer",
    placeholder: "İki ayrı yakınlaşmayı tek eşitsizlikte birleştir.",
    hint:
      "ε'yi ikiye bölmek iyi bir başlangıçtır.",
    solution:
      "f(x) ile L, g(x) ile M ayrı ayrı yakın olduğunda bu iki hata toplanır. ε > 0 için her birini ε/2 ile kontrol edersek |(f + g)(x) - (L + M)| ≤ |f(x) - L| + |g(x) - M| olur ve toplam hata ε'nin altında kalır.",
    courseSlug: "real-analysis",
    lessonSlug: "limits-of-functions",
    conceptIds: ["concept-limit", "concept-functions"],
  },
  {
    id: "ex-real-analysis-limits-of-functions-accumulation-03",
    title: "Yoğunlaşma Noktası Neden Gerekli?",
    prompt:
      "a noktası tanım kümesinin yoğunlaşma noktası değilse fonksiyon limiti konuşmak neden anlamsızlaşabilir?",
    kind: "lesson",
    format: "reflection",
    answerMode: "short_answer",
    placeholder: "Yaklaşacak nokta eksikliğini açıkla.",
    hint:
      "a'ya yaklaşan farklı x'ler yoksa limit koşulunu test edecek malzeme de kalmaz.",
    solution:
      "Limit, x'in a'ya yaklaşırkenki davranışını inceler. Eğer a tanım kümesinde izoleyse ya da çevresinde başka noktalar yoksa a'ya yaklaşan farklı x değerleri üretilemez. Bu durumda limit koşulu boş bir koşula dönüşür ve kavram anlamlı içeriğini kaybeder.",
    courseSlug: "real-analysis",
    lessonSlug: "limits-of-functions",
    conceptIds: ["concept-accumulation-point", "concept-functions"],
  },
  {
    id: "ex-real-analysis-limits-of-functions-epsilon-04",
    title: "Epsilon-Delta Dili",
    prompt:
      "Fonksiyon limitinde ε ve δ neden iki farklı ölçek olarak kullanılır? Kısa bir gerekçe yaz.",
    kind: "lesson",
    format: "proof",
    answerMode: "short_answer",
    placeholder: "Girdi ve çıktı kontrolünü ayırarak açıkla.",
    hint:
      "δ x'in, ε ise f(x)'in kontrol bölgesidir.",
    solution:
      "Fonksiyon limitinde δ, girdinin hedef noktaya ne kadar yaklaşacağını; ε ise çıktının hedef değere ne kadar yakın kalacağını ölçer. Bu iki ölçeğin ayrı tutulması, x tarafındaki yakınlığın f(x) tarafında hangi hassasiyeti ürettiğini açık biçimde ifade eder.",
    courseSlug: "real-analysis",
    lessonSlug: "limits-of-functions",
    conceptIds: ["concept-limit", "concept-functions"],
  },
  {
    id: "ex-real-analysis-exponential-limits-monotone-01",
    title: "Üstel Büyüme",
    prompt:
      "a > 1 için a^x fonksiyonunun x arttıkça nasıl davrandığını hangi ifade doğru anlatır?",
    kind: "lesson",
    format: "reading",
    answerMode: "multiple_choice",
    choices: [
      { id: "exp-choice-a", text: "Artandır." },
      { id: "exp-choice-b", text: "Azalandır." },
      { id: "exp-choice-c", text: "Sabit kalır." },
      { id: "exp-choice-d", text: "Yalnızca tam sayılarda tanımlıdır." },
    ],
    hint:
      "Taban 1'den büyükse üs arttıkça değer de büyür.",
    solution:
      "Doğru seçenek ilkidir. a > 1 olduğunda a^x fonksiyonu artandır ve büyüme hızı pozitif üslerle birlikte güçlenir.",
    courseSlug: "real-analysis",
    lessonSlug: "ustel-fonksiyonlar-ve-limitleri",
    conceptIds: ["concept-real-numbers", "concept-limit"],
  },
  {
    id: "ex-real-analysis-exponential-limits-zero-02",
    title: "x Sıfıra Giderken",
    prompt:
      "a > 0 iken x → 0 olduğunda a^x ifadesinin neden 1'e yaklaşmasını beklersin?",
    kind: "lesson",
    format: "reflection",
    answerMode: "short_answer",
    placeholder: "0 üssünün rolünü açıkla.",
    hint:
      "x tam olarak 0 olduğunda a^0 = 1 olur; limitte bu davranışın yakınını izleriz.",
    solution:
      "a > 0 için a^0 = 1 olduğundan x sıfıra yaklaşırken a^x de bu değerin çevresinde toplanır. Üstel fonksiyon gerçel eksende sürekli olduğunda nokta limiti ile fonksiyon değeri uyuşur ve limit 1 olur.",
    courseSlug: "real-analysis",
    lessonSlug: "ustel-fonksiyonlar-ve-limitleri",
    conceptIds: ["concept-limit", "concept-continuity"],
  },
  {
    id: "ex-real-analysis-exponential-limits-log-link-03",
    title: "Logaritma Bağlantısı",
    prompt:
      "Neden logaritma, pozitif kalan üstel limit problemlerini yeniden yazmak için kullanışlı bir araçtır?",
    kind: "lesson",
    format: "reflection",
    answerMode: "short_answer",
    placeholder: "Çarpımları toplama çevirmesini hatırla.",
    hint:
      "Üs ve çarpım davranışları logaritmayla daha okunur hale gelir.",
    solution:
      "Logaritma, pozitif ifadelerde çarpımları toplama ve kuvvetleri çarpan olarak dışa alma özelliği verir. Bu nedenle karmaşık üstel ifadeler daha basit toplamsal limit problemlerine çevrilebilir. Sonra sonuç tekrar üstel forma geri taşınabilir.",
    courseSlug: "real-analysis",
    lessonSlug: "ustel-fonksiyonlar-ve-limitleri",
    conceptIds: ["concept-limit", "concept-functions"],
  },
  {
    id: "ex-real-analysis-exponential-limits-continuity-04",
    title: "Üstel Süreklilik Sezgisi",
    prompt:
      "a > 0 için a^x fonksiyonunun sürekli olması neden limit hesabını kolaylaştırır? Kısa bir gerekçe yaz.",
    kind: "lesson",
    format: "proof",
    answerMode: "short_answer",
    placeholder: "Nokta limiti ile fonksiyon değerini bağla.",
    hint:
      "Sürekli fonksiyonlarda x → x0 iken f(x) → f(x0) olur.",
    solution:
      "Süreklilik, x hedef noktaya yaklaşırken a^x'in de doğrudan a^x0 değerine yaklaşması demektir. Böylece ayrı bir limit tekniği kurmak yerine hedef noktadaki fonksiyon değerini hesaplamak yeterli olur. Üstel fonksiyonun limit problemlerinde temel kolaylık budur.",
    courseSlug: "real-analysis",
    lessonSlug: "ustel-fonksiyonlar-ve-limitleri",
    conceptIds: ["concept-continuity", "concept-functions"],
  },
  {
    id: "ex-real-analysis-uniform-continuity-2-composition-01",
    title: "Bileşke Davranışı",
    prompt:
      "f : A → B ve g : B → ℝ düzgün sürekli ise hangisi doğrudur?",
    kind: "lesson",
    format: "reading",
    answerMode: "multiple_choice",
    choices: [
      { id: "uc2-choice-a", text: "g ∘ f de düzgün süreklidir." },
      { id: "uc2-choice-b", text: "g ∘ f asla sürekli olamaz." },
      { id: "uc2-choice-c", text: "Sonuç yalnızca f sabitse doğrudur." },
      { id: "uc2-choice-d", text: "Sonuç yalnızca B sonluysa doğrudur." },
    ],
    hint:
      "Bir kontrol aralığının çıktısını öbür fonksiyonun girdisi olarak kullan.",
    solution:
      "Doğru seçenek ilkidir. İlk fonksiyonun düzgün kontrolü ikinci fonksiyonun düzgün kontrolüne bağlanabildiği için bileşke de düzgün sürekliliğini korur.",
    courseSlug: "real-analysis",
    lessonSlug: "uniform-continuity-2",
    conceptIds: ["concept-uniform-continuity", "concept-functions"],
  },
  {
    id: "ex-real-analysis-uniform-continuity-2-lipschitz-02",
    title: "Lipschitz ve Düzgün Süreklilik",
    prompt:
      "|f(x) - f(y)| ≤ L|x - y| koşulu neden düzgün süreklilik için hemen bir δ verir?",
    kind: "lesson",
    format: "reflection",
    answerMode: "short_answer",
    placeholder: "ε ile L arasındaki ilişkiyi yaz.",
    hint:
      "L > 0 ise δ = ε/L seçimini, L = 0 ise sabit fonksiyon durumunu düşün.",
    solution:
      "Lipschitz koşulu hata büyümesini sabit bir katsayıyla sınırlar. L > 0 ise ε > 0 için δ = ε/L seçilirse |x - y| < δ olduğunda |f(x) - f(y)| ≤ L|x - y| < ε elde edilir. L = 0 ise |f(x) - f(y)| = 0 olur ve fonksiyon zaten sabittir. Her iki durumda da δ noktaya bağlı değildir; dolayısıyla düzgün süreklilik gelir.",
    courseSlug: "real-analysis",
    lessonSlug: "uniform-continuity-2",
    conceptIds: ["concept-uniform-continuity", "concept-functions"],
  },
  {
    id: "ex-real-analysis-uniform-continuity-2-interval-03",
    title: "Kapalı Aralık Rahatlığı",
    prompt:
      "x^2 fonksiyonunun [0,2] üzerinde düzgün sürekli olduğunu neden önceki derse göre daha rahat söyleyebiliriz?",
    kind: "lesson",
    format: "reflection",
    answerMode: "short_answer",
    placeholder: "Sınırlı x + y terimine odaklan.",
    hint:
      "[0,2] aralığında x + y için sabit bir üst sınır bulunur.",
    solution:
      "|x^2 - y^2| = |x - y||x + y| ve [0,2] için |x + y| ≤ 4 olur. Bu yüzden hata 4|x - y| ile kontrol edilir ve tek bir δ seçimi tüm aralıkta çalışır. Sınırlı aralık bu nedenle işi kolaylaştırır.",
    courseSlug: "real-analysis",
    lessonSlug: "uniform-continuity-2",
    conceptIds: ["concept-uniform-continuity", "concept-functions"],
  },
  {
    id: "ex-real-analysis-uniform-continuity-2-difference-04",
    title: "Farkın Davranışı",
    prompt:
      "Düzgün sürekli f ve g için f - g fonksiyonunun da düzgün sürekli olduğunu gerekçelendir.",
    kind: "lesson",
    format: "proof",
    answerMode: "proof",
    placeholder: "Toplam ispatındaki ε/2 fikrini fark için kullan.",
    hint:
      "f - g = f + (-g) olarak bakabilir ya da doğrudan üçgen eşitsizliği yazabilirsin.",
    solution:
      "ε > 0 verilsin. f ve g düzgün sürekli olduğundan ε/2 için sırasıyla δ1 ve δ2 seçilebilir. δ = min{δ1, δ2} alınırsa |x - y| < δ durumunda |f(x) - f(y)| < ε/2 ve |g(x) - g(y)| < ε/2 olur. O zaman |(f - g)(x) - (f - g)(y)| ≤ |f(x) - f(y)| + |g(x) - g(y)| < ε elde edilir.",
    courseSlug: "real-analysis",
    lessonSlug: "uniform-continuity-2",
    conceptIds: ["concept-uniform-continuity", "concept-functions"],
  },
  {
    id: "ex-real-analysis-logarithm-limit-lhospital-indeterminate-01",
    title: "Belirsiz Biçimi Tanı",
    prompt:
      "L'Hospital kuralına gitmeden önce hangi tür belirsiz biçimleri tanımaya çalışırız?",
    kind: "lesson",
    format: "reading",
    answerMode: "multiple_choice",
    choices: [
      { id: "lh-choice-a", text: "0/0 ve ∞/∞ türleri" },
      { id: "lh-choice-b", text: "Yalnızca tam sayılar" },
      { id: "lh-choice-c", text: "Her bölme ifadesi" },
      { id: "lh-choice-d", text: "Yalnızca polinomlar" },
    ],
    hint:
      "Kural en başta her limite değil, belirli belirsiz oranlara yöneliktir.",
    solution:
      "Doğru seçenek ilkidir. L'Hospital kuralının doğrudan uygulandığı temel oranlar 0/0 ve ∞/∞ biçimleridir.",
    courseSlug: "real-analysis",
    lessonSlug: "logaritma-limit-ve-lhospital",
    conceptIds: ["concept-limit", "concept-derivative"],
  },
  {
    id: "ex-real-analysis-logarithm-limit-lhospital-log-limit-02",
    title: "Logaritmik Dönüşüm",
    prompt:
      "Bir limit ifadesini önce logaritmaya taşımak ne zaman yararlı olabilir? Kısa bir örnek fikirle açıkla.",
    kind: "lesson",
    format: "reflection",
    answerMode: "short_answer",
    placeholder: "Üs ya da çarpım içeren pozitif bir ifadeyi düşün.",
    hint:
      "Kuvvetli ifadelerde logaritma üsleri çarpan olarak indirir; ama bunun için ifade pozitif kalmalıdır.",
    solution:
      "x^x, (1 + u(x))^{v(x)} gibi pozitif ifadelerde logaritma almak üsleri öne çıkarır ve çarpım/toplam yapısına çevirir. Böylece daha sonra türev ya da klasik limit teknikleri uygulanabilir. Sonuç en sonda tekrar üstel fonksiyonla geri döndürülür.",
    courseSlug: "real-analysis",
    lessonSlug: "logaritma-limit-ve-lhospital",
    conceptIds: ["concept-limit", "concept-functions"],
  },
  {
    id: "ex-real-analysis-logarithm-limit-lhospital-warning-03",
    title: "Kuralı Ne Zaman Kullanma?",
    prompt:
      "L'Hospital kuralını uygulamadan önce neden oranın gerçekten uygun belirsiz biçimde olduğunu kontrol etmek gerekir?",
    kind: "lesson",
    format: "reflection",
    answerMode: "short_answer",
    placeholder: "Yanlış uygulamanın nasıl hata ürettiğini açıkla.",
    hint:
      "Belirsiz biçim yoksa türev almak gereksiz ya da yanıltıcı olabilir.",
    solution:
      "Her oran için türev almak doğru sonuç vermez. Önce 0/0 ya da ∞/∞ gibi uygun bir belirsiz biçim olduğunu kontrol etmezsen kuralı yanlış bir yerde kullanmış olursun. Bu da ifadenin gerçek limit davranışını maskeleyebilir.",
    courseSlug: "real-analysis",
    lessonSlug: "logaritma-limit-ve-lhospital",
    conceptIds: ["concept-limit", "concept-derivative"],
  },
  {
    id: "ex-real-analysis-logarithm-limit-lhospital-differentiation-04",
    title: "Türev Kontrolü",
    prompt:
      "L'Hospital kuralının türev bilgisine dayanması neden doğaldır? Kısa bir gerekçe yaz.",
    kind: "lesson",
    format: "proof",
    answerMode: "short_answer",
    placeholder: "Yerel değişim oranını limit hesabıyla bağla.",
    hint:
      "Pay ve paydanın yerel değişim hızlarını karşılaştırmaya çalışıyoruz.",
    solution:
      "0/0 ya da ∞/∞ tipindeki oranlarda pay ve paydanın aynı noktaya yaklaşırken ne hızla değiştiği belirleyici olur. Türev tam da bu yerel değişim hızını ölçer. Bu yüzden uygun koşullar altında oranın limitini türevlerin oranıyla karşılaştırmak doğal bir stratejiye dönüşür.",
    courseSlug: "real-analysis",
    lessonSlug: "logaritma-limit-ve-lhospital",
    conceptIds: ["concept-derivative", "concept-limit"],
  },
  {
    id: "exercise-cauchy",
    title: "Uniform Convergence Checklist",
    prompt: "Düzgün Yakınsaklık dersinden sonra, noktasal ve düzgün yakınsaklık arasındaki farkı iki kısa örnekle ayır.",
    kind: "lesson",
    format: "reflection",
    courseSlug: "real-analysis",
    lessonSlug: "pointwise-and-uniform-convergence",
    conceptIds: ["concept-uniform-continuity"],
  },
  {
    id: "exercise-uniform-continuity",
    title: "Doğrusal Fonksiyon İçin δ Seçimi",
    prompt:
      "f(x) = 3x + 1 fonksiyonunun ℝ üzerinde düzgün sürekli olduğunu, ε verildiğinde uygun bir δ seçerek açıkla.",
    kind: "lesson",
    format: "computation",
    answerMode: "short_answer",
    placeholder: "ε ile δ arasındaki ilişkiyi yaz.",
    hint:
      "|f(x) - f(y)| ifadesini önce |x - y| cinsinden sadeleştir. Sabit katsayı neyi belirliyor?",
    solution:
      "|f(x) - f(y)| = |3x + 1 - (3y + 1)| = 3|x - y| olur. ε > 0 verilsin. δ = ε/3 seçersek |x - y| < δ olduğunda |f(x) - f(y)| = 3|x - y| < 3(ε/3) = ε elde edilir. Bu δ noktaya bağlı olmadığı için f düzgün süreklidir.",
    courseSlug: "real-analysis",
    lessonSlug: "uniform-continuity",
    conceptIds: ["concept-functions", "concept-uniform-continuity"],
  },
  {
    id: "exercise-mvt",
    title: "Taylor Approximation",
    prompt: "Türev ve Taylor Teoremi dersinden sonra, bir fonksiyonu yerel polinom yaklaşımıyla nasıl okuyacağını 3-4 cümlede özetle.",
    kind: "lesson",
    format: "reflection",
    courseSlug: "real-analysis",
    lessonSlug: "derivative-and-taylor-theorem",
    conceptIds: ["concept-taylor"],
  },
  {
    id: "exercise-compactness",
    title: "Metric Sequence Checklist",
    prompt: "Metrik Uzayda Dizi dersinden sonra, bir diziyi incelerken ilk bakacağın üç şeyi yaz: mesafe, yakınsaklık adayı ve alt dizi davranışı.",
    kind: "practice",
    format: "reading",
    courseSlug: "metric-spaces-and-topology",
    lessonSlug: "convergence-and-cauchy-sequences-in-metric-spaces",
    conceptIds: ["concept-metric-space"],
  },
  {
    id: "exercise-ordinals",
    title: "Ordinal vs Cardinal",
    prompt: "Ordinal ve cardinal fikirlerinin hangi sorulara cevap verdiğini kısa bir tablo halinde karşılaştır.",
    kind: "practice",
    format: "reflection",
    courseSlug: "set-theory-and-ordinals",
    lessonSlug: "ordinals",
    conceptIds: ["concept-ordinals"],
  },
  {
    id: "exercise-graph-tree",
    title: "El Sıkışma Lemması",
    prompt:
      "Sonlu bir çizgede düğüm derecelerinin toplamının 2|E| olduğunu ispatlayın.",
    kind: "lesson",
    format: "proof",
    answerMode: "proof",
    placeholder: "Her kenarın derece toplamına nasıl katkı verdiğini açıklayarak ispatla.",
    hint:
      "Her kenarı tek tek say. Bir kenar, derece toplamında kaç kez görünür?",
    solution:
      "Bir çizgedeki her kenarın iki ucu vardır. Derece toplamını hesaplarken her düğüm için o düğüme komşu kenarlar birer kez sayılır. Dolayısıyla tek bir kenar, iki ucundan dolayı derece toplamına tam iki katkı yapar. E kümesindeki tüm kenarlar için bu katkıları topladığımızda toplam derece 2|E| olur.",
    courseSlug: "discrete-mathematics",
    lessonSlug: "graph-theory-paths-and-trees",
    conceptIds: ["concept-edge", "concept-vertex", "concept-graph-theory"],
  },
  {
    id: "exercise-uniform-continuity-definition",
    title: "Tanımı Tanı",
    prompt:
      "Aşağıdaki ifadelerden hangisi A ⊆ ℝ üzerinde düzgün sürekliliğin doğru tanımıdır?",
    kind: "lesson",
    format: "reading",
    answerMode: "multiple_choice",
    choices: [
      {
        id: "uniform-choice-a",
        text: "Her x0 ∈ A ve her ε > 0 için, x0'a bağlı bir δ > 0 bulunur.",
      },
      {
        id: "uniform-choice-b",
        text: "Her ε > 0 için, tüm x,y ∈ A için çalışacak ortak bir δ > 0 bulunur.",
      },
      {
        id: "uniform-choice-c",
        text: "Her δ > 0 için, tüm x,y ∈ A için bir ε > 0 seçilir.",
      },
      {
        id: "uniform-choice-d",
        text: "Yalnızca sınırlı aralıklarda tanımlı fonksiyonlar düzgün süreklidir.",
      },
    ],
    hint:
      "Düzgün süreklilikte δ'nın tek bir noktaya değil, bütün kümeye hizmet etmesi gerekir.",
    solution:
      "Doğru fikir ikinci seçenektedir. Düzgün süreklilikte ε > 0 verildiğinde seçilen δ, x ve y'nin kümeye ait hangi noktalar olduğuna göre değişmez; bütün küme için ortak çalışır.",
    courseSlug: "real-analysis",
    lessonSlug: "uniform-continuity",
    conceptIds: ["concept-continuity", "concept-uniform-continuity"],
  },
  {
    id: "exercise-uniform-continuity-reciprocal",
    title: "1/x Neden Sorun Çıkarır?",
    prompt:
      "f(x) = 1/x fonksiyonunun (0,1) üzerinde neden düzgün sürekli olmadığını açıklayın.",
    kind: "lesson",
    format: "reflection",
    answerMode: "short_answer",
    placeholder: "Sıfıra yaklaşan iki nokta seçerek açıkla.",
    hint:
      "x_n = 1/n ve y_n = 1/(n+1) gibi iki dizi düşün. Bu iki nokta birbirine yaklaşırken fonksiyon değerleri ne yapıyor?",
    solution:
      "x_n = 1/n ve y_n = 1/(n+1) seçelim. |x_n - y_n| = 1/(n(n+1)) olduğundan bu fark 0'a gider. Buna karşılık |f(x_n) - f(y_n)| = |n - (n+1)| = 1 olur. Yani girişler çok yaklaşsa da çıktı farkı sabit kalır. Bu yüzden bütün aralık için ortak bir δ seçilemez; f düzgün sürekli değildir.",
    courseSlug: "real-analysis",
    lessonSlug: "uniform-continuity",
    conceptIds: ["concept-uniform-continuity", "concept-real-numbers"],
  },
  {
    id: "exercise-uniform-continuity-domain-comparison",
    title: "Aralık Farkı",
    prompt:
      "Aynı fonksiyon için [0,1] ile (0,1) aralıklarının neden farklı davranabildiğini kısa bir karşılaştırmayla yazın.",
    kind: "lesson",
    format: "reflection",
    answerMode: "short_answer",
    placeholder: "Kompaktlık ve uç noktalara yaklaşma açısından karşılaştır.",
    hint:
      "Kapalı ve sınırlı aralığın sağladığı güvence ile açık aralıkta uç noktaya yaklaşma sorununu birlikte düşün.",
    solution:
      "[0,1] kapalı ve sınırlı olduğu için sürekli fonksiyonlar burada genellikle daha iyi kontrol edilir; Heine-Cantor sonucu bu sezgiyi resmileştirir. (0,1) aralığında ise uç noktalar kümeye ait değildir ve 0'a ya da 1'e yaklaşırken fonksiyon davranışı kontrolden çıkabilir. Bu yüzden aynı fonksiyon bir aralıkta düzgün sürekli olurken diğerinde olmayabilir.",
    courseSlug: "real-analysis",
    lessonSlug: "uniform-continuity",
    conceptIds: ["concept-continuity", "concept-uniform-continuity", "concept-real-numbers"],
  },
  {
    id: "exercise-uniform-continuity-sum-proof",
    title: "Toplamın Düzgün Sürekliliği",
    prompt:
      "A üzerinde düzgün sürekli f ve g fonksiyonları verilsin. f + g fonksiyonunun da düzgün sürekli olduğunu ispatlayın.",
    kind: "lesson",
    format: "proof",
    answerMode: "proof",
    placeholder: "ε/2 fikrini kullanarak kısa bir ispat yaz.",
    hint:
      "f ve g için ayrı ayrı ε/2 kullan. Sonra ortak çalışacak δ'yı iki seçimden küçük olanla al.",
    solution:
      "ε > 0 verilsin. f düzgün sürekli olduğundan ε/2 için bir δ1 > 0, g düzgün sürekli olduğundan yine ε/2 için bir δ2 > 0 vardır. δ = min{δ1, δ2} alalım. |x - y| < δ ise hem |f(x) - f(y)| < ε/2 hem de |g(x) - g(y)| < ε/2 olur. O halde |(f + g)(x) - (f + g)(y)| ≤ |f(x) - f(y)| + |g(x) - g(y)| < ε elde edilir. Demek ki f + g düzgün süreklidir.",
    courseSlug: "real-analysis",
    lessonSlug: "uniform-continuity",
    conceptIds: ["concept-functions", "concept-uniform-continuity", "concept-proof"],
  },
  {
    id: "exercise-open-set-recognition",
    title: "Açık Küme Tanıma",
    prompt:
      "ℝ'nin standart metriğinde aşağıdaki kümelerden hangileri açıktır?",
    kind: "lesson",
    format: "reading",
    answerMode: "multiple_choice",
    choices: [
      { id: "open-choice-a", text: "(0,1)" },
      { id: "open-choice-b", text: "[0,1]" },
      { id: "open-choice-c", text: "(2, +∞)" },
      { id: "open-choice-d", text: "{0}" },
    ],
    hint:
      "Her noktanın etrafına kümenin dışına taşmadan küçük bir açık aralık koyup koyamadığını düşün.",
    solution:
      "(0,1) ve (2,+∞) açıktır. [0,1] kapalı uç noktalar içerdiği için açık değildir; {0} ise 0'ın etrafında bütünüyle küme içinde kalan açık aralık barındırmadığından açık değildir.",
    courseSlug: "metric-spaces-and-topology",
    lessonSlug: "open-balls-open-sets-closed-sets",
    conceptIds: ["concept-open-set", "concept-open-ball"],
  },
  {
    id: "exercise-open-closed-interval-classification",
    title: "Açık mı Kapalı mı?",
    prompt:
      "ℝ'nin standart metriğinde [0,1), ℤ ve (−1,1) kümelerini açık, kapalı ya da ikisi birden değil şeklinde sınıflandırın.",
    kind: "lesson",
    format: "reflection",
    answerMode: "short_answer",
    placeholder: "Her küme için kısa gerekçe yaz.",
    hint:
      "Uç noktalar, tümleyen ve limit noktaları açısından ayrı ayrı düşün.",
    solution:
      "[0,1) ne açıktır ne kapalıdır. ℤ açık değildir fakat kapalıdır; çünkü tümleyeni açık aralıkların birleşimi olarak yazılabilir. (−1,1) açıktır ama kapalı değildir; −1 ve 1 limit noktalarıdır fakat kümenin içinde değildir.",
    courseSlug: "metric-spaces-and-topology",
    lessonSlug: "open-balls-open-sets-closed-sets",
    conceptIds: ["concept-open-set", "concept-closed-set"],
  },
  {
    id: "exercise-discrete-metric-singleton",
    title: "Ayrık Metrikte Tek Nokta",
    prompt:
      "Ayrık metrikte neden her tek elemanlı kümenin açık olduğunu açıklayın.",
    kind: "lesson",
    format: "reflection",
    answerMode: "short_answer",
    placeholder: "Uygun yarıçapı seçerek açıkla.",
    hint:
      "Merkezi x olan ve yarıçapı 1'den küçük bir açık küre düşün.",
    solution:
      "Ayrık metrikte d(x,y) = 0 yalnızca x = y iken, aksi halde 1'dir. Bu yüzden yarıçapı r < 1 olan B_r(x) açık küresi yalnızca x'i içerir. Dolayısıyla {x} = B_r(x) olur ve her tek elemanlı küme açıktır.",
    courseSlug: "metric-spaces-and-topology",
    lessonSlug: "open-balls-open-sets-closed-sets",
    conceptIds: ["concept-metric-space", "concept-open-ball", "concept-open-set"],
  },
  {
    id: "exercise-open-ball-is-open",
    title: "Açık Küre Açıktır",
    prompt:
      "Her metrik uzayda bir açık kürenin açık küme olduğunu ispatlayın.",
    kind: "lesson",
    format: "proof",
    answerMode: "proof",
    placeholder: "Merkezden uzaklığı kalan kadar yeni bir yarıçap seç.",
    hint:
      "y ∈ B_r(x) olsun. d(x,y) ile r arasındaki farkı kullanarak y etrafında daha küçük bir küre kur.",
    solution:
      "B_r(x) içinde bir y noktası alalım. y bu kürede olduğundan d(x,y) < r'dir. ε = r - d(x,y) > 0 tanımlayalım. z ∈ B_ε(y) ise üçgen eşitsizliğinden d(x,z) ≤ d(x,y) + d(y,z) < d(x,y) + ε = r elde edilir. Demek ki B_ε(y) ⊆ B_r(x). y keyfi olduğundan B_r(x) açıktır.",
    courseSlug: "metric-spaces-and-topology",
    lessonSlug: "open-balls-open-sets-closed-sets",
    conceptIds: ["concept-open-ball", "concept-open-set", "concept-proof"],
  },
  {
    id: "exercise-intersection-of-open-sets",
    title: "Açık Kümelerin Kesişimi",
    prompt:
      "İki açık kümenin kesişiminin yine açık olduğunu tanımdan ispatlayın.",
    kind: "lesson",
    format: "proof",
    answerMode: "proof",
    placeholder: "Bir noktayı seçip iki yarıçaptan küçüğünü kullan.",
    hint:
      "x noktası hem U hem V içindeyse, U için bir r1 ve V için bir r2 yarıçapı vardır. Bunlardan küçüğü ne sağlar?",
    solution:
      "U ve V açık olsun. x ∈ U ∩ V alalım. U açık olduğundan B_r1(x) ⊆ U olacak bir r1 > 0 vardır. V açık olduğundan B_r2(x) ⊆ V olacak bir r2 > 0 vardır. r = min{r1, r2} alırsak B_r(x) hem U'nun hem V'nin içinde kalır; dolayısıyla B_r(x) ⊆ U ∩ V olur. Her x için böyle bir yarıçap bulunduğundan U ∩ V açıktır.",
    courseSlug: "metric-spaces-and-topology",
    lessonSlug: "open-balls-open-sets-closed-sets",
    conceptIds: ["concept-open-set", "concept-proof"],
  },
  {
    id: "exercise-subgroup-test-z",
    title: "Altgrup Testi",
    prompt:
      "(ℤ, +) için aşağıdaki kümelerden hangisi altgruptur?",
    kind: "lesson",
    format: "reading",
    answerMode: "multiple_choice",
    choices: [
      { id: "subgroup-choice-a", text: "2ℤ" },
      { id: "subgroup-choice-b", text: "Pozitif tam sayılar" },
      { id: "subgroup-choice-c", text: "Tek tam sayılar" },
      { id: "subgroup-choice-d", text: "Asal sayılar" },
    ],
    hint:
      "Toplama altında kapalılığı, sıfır elemanını ve tersleri kontrol et.",
    solution:
      "2ℤ bir altgruptur; çünkü 0'ı içerir, iki çift sayının toplamı yine çifttir ve çift sayının tersi yine çifttir. Diğer kümeler bu koşullardan en az birini bozuyor.",
    courseSlug: "abstract-algebra",
    lessonSlug: "normal-altgrup-incelemeleri",
    conceptIds: ["concept-group", "concept-subgroup"],
  },
  {
    id: "exercise-normal-subgroup-in-z",
    title: "2ℤ Neden Normaldir?",
    prompt:
      "(ℤ, +) grubunda 2ℤ altgrubunun neden normal olduğunu kısa bir açıklamayla yazın.",
    kind: "lesson",
    format: "reflection",
    answerMode: "short_answer",
    placeholder: "Abelyen grup olmasını kullanabilirsin.",
    hint:
      "Abelyen gruplarda soldan ve sağdan kaydırma arasında fark var mı?",
    solution:
      "(ℤ, +) abelyen bir gruptur; yani a + h = h + a her a ∈ ℤ ve h ∈ 2ℤ için geçerlidir. Bu yüzden sol ve sağ yan sınıflar aynıdır. Dolayısıyla 2ℤ normal altgruptur.",
    courseSlug: "abstract-algebra",
    lessonSlug: "normal-altgrup-incelemeleri",
    conceptIds: ["concept-group", "concept-normal-subgroup"],
  },
  {
    id: "exercise-cosets-in-s3",
    title: "S3 İçinde Yan Sınıf",
    prompt:
      "G = S3 ve H = {e, (12)} olsun. g = (13) için gH ve Hg kümelerini yazın ve eşit olup olmadıklarını belirleyin.",
    kind: "lesson",
    format: "computation",
    answerMode: "short_answer",
    placeholder: "İki çarpımı ayrı ayrı hesapla.",
    hint:
      "gH = {(13), (13)(12)} ve Hg = {(13), (12)(13)} biçiminde başla.",
    solution:
      "gH = {(13), (132)} olur; çünkü (13)(12) = (132). Buna karşılık Hg = {(13), (123)} olur; çünkü (12)(13) = (123). Bu iki küme eşit değildir. O halde H, S3 içinde normal değildir.",
    courseSlug: "abstract-algebra",
    lessonSlug: "normal-altgrup-incelemeleri",
    conceptIds: ["concept-coset", "concept-normal-subgroup"],
  },
  {
    id: "exercise-center-is-normal",
    title: "Merkez Her Zaman Normaldir",
    prompt:
      "Bir grubun merkezi Z(G)'nin neden her zaman normal altgrup olduğunu açıklayın.",
    kind: "lesson",
    format: "reflection",
    answerMode: "short_answer",
    placeholder: "Bir merkez elemanını gzg⁻¹ biçiminde düşün.",
    hint:
      "z merkezdeyse her g ile commute eder. Bu eşitliği gzg⁻¹ ifadesine uygula.",
    solution:
      "z ∈ Z(G) ise zg = gz her g ∈ G için geçerlidir. Buradan gzg⁻¹ = z elde edilir. Yani merkezdeki her eleman her eşlenim altında yine merkezin içinde kalır. Bu da Z(G)'nin normal olduğunu gösterir.",
    courseSlug: "abstract-algebra",
    lessonSlug: "normal-altgrup-incelemeleri",
    conceptIds: ["concept-group", "concept-normal-subgroup"],
  },
  {
    id: "exercise-index-two-normal",
    title: "İndeksi 2 Olan Altgrup",
    prompt:
      "Bir H ≤ G altgrubunun indeksi 2 ise H'nin normal olduğunu ispatlayın.",
    kind: "lesson",
    format: "proof",
    answerMode: "proof",
    placeholder: "G'de yalnızca iki sol ya da sağ yan sınıf olduğunu kullan.",
    hint:
      "G'de H dışında yalnızca tek bir başka yan sınıf vardır. g ∉ H için hem gH hem Hg bu tek diğer sınıf olmak zorunda.",
    solution:
      "[G : H] = 2 ise G, H ve H'nin dışında kalan tek bir başka yan sınıfa ayrılır. g ∉ H alalım. O zaman gH, H'den farklı bir sol yan sınıftır; dolayısıyla G \\ H'ye eşittir. Aynı şekilde Hg de H'den farklı bir sağ yan sınıftır ve yine G \\ H'ye eşittir. Böylece gH = Hg olur. g ∈ H için zaten gH = Hg = H'dir. Sonuç olarak her g ∈ G için gH = Hg olduğundan H normaldir.",
    courseSlug: "abstract-algebra",
    lessonSlug: "normal-altgrup-incelemeleri",
    conceptIds: ["concept-subgroup", "concept-normal-subgroup", "concept-coset", "concept-proof"],
  },
  {
    id: "exercise-graph-vertices-and-edges",
    title: "Düğüm ve Kenar Sayısı",
    prompt:
      "V = {1,2,3,4} ve E = {{1,2}, {2,3}, {3,4}} ile verilen çizgede düğüm ve kenar sayılarını yazın.",
    kind: "lesson",
    format: "reading",
    answerMode: "multiple_choice",
    choices: [
      { id: "graph-count-a", text: "4 düğüm, 3 kenar" },
      { id: "graph-count-b", text: "3 düğüm, 4 kenar" },
      { id: "graph-count-c", text: "4 düğüm, 4 kenar" },
      { id: "graph-count-d", text: "3 düğüm, 3 kenar" },
    ],
    hint:
      "V kümesi düğümleri, E kümesi kenarları listeliyor.",
    solution:
      "V kümesinde 4 eleman, E kümesinde 3 eleman vardır. Dolayısıyla çizgede 4 düğüm ve 3 kenar bulunur.",
    courseSlug: "discrete-mathematics",
    lessonSlug: "graph-theory-paths-and-trees",
    conceptIds: ["concept-vertex", "concept-edge"],
  },
  {
    id: "exercise-graph-degree-sequence",
    title: "Dereceleri Hesapla",
    prompt:
      "V = {1,2,3,4} ve E = {{1,2}, {2,3}, {3,4}} için her düğümün derecesini yazın.",
    kind: "lesson",
    format: "computation",
    answerMode: "short_answer",
    placeholder: "deg(1), deg(2), deg(3), deg(4) biçiminde yaz.",
    hint:
      "Bir düğümün derecesi, o düğüme komşu kenar sayısıdır.",
    solution:
      "deg(1) = 1, deg(2) = 2, deg(3) = 2 ve deg(4) = 1 olur. Çünkü 1 ve 4 uç düğümlerdir; 2 ve 3 ise iki kenarla bağlantılıdır.",
    courseSlug: "discrete-mathematics",
    lessonSlug: "graph-theory-paths-and-trees",
    conceptIds: ["concept-vertex", "concept-edge"],
  },
  {
    id: "exercise-path-vs-cycle",
    title: "Yol mu Çevrim mi?",
    prompt:
      "1-2-3-4 düğümleriyle kurulan yol çizgesine {4,1} kenarını eklersen hangi yeni yapısal özellik ortaya çıkar?",
    kind: "lesson",
    format: "reflection",
    answerMode: "short_answer",
    placeholder: "Yol ve çevrim açısından açıkla.",
    hint:
      "Başlangıç düğümüne geri dönebilen kapalı bir yol oluşup oluşmadığını kontrol et.",
    solution:
      "{4,1} kenarı eklenince 1-2-3-4-1 kapalı yolu oluşur. Böylece çizge yalnızca bir yol olmaktan çıkar ve bir çevrim içerir. Yeni yapı artık C4 örneğine benzer.",
    courseSlug: "discrete-mathematics",
    lessonSlug: "graph-theory-paths-and-trees",
    conceptIds: ["concept-path", "concept-cycle"],
  },
  {
    id: "exercise-graph-connected-example",
    title: "Bağlantılı mı?",
    prompt:
      "İki ayrı üçgenin hiçbir ortak düğüm olmadan yan yana çizildiği bir çizge bağlantılı mıdır? Kısa gerekçe verin.",
    kind: "lesson",
    format: "reflection",
    answerMode: "short_answer",
    placeholder: "İki bileşen arasındaki yol durumunu açıkla.",
    hint:
      "Bir üçgendeki bir düğümden diğer üçgendeki bir düğüme geçecek bir yol var mı?",
    solution:
      "Bağlantılı değildir. Çünkü bir üçgendeki herhangi bir düğümden öteki üçgendeki düğüme giden hiçbir yol yoktur. Çizge en az iki bağlı bileşene ayrılmış olur.",
    courseSlug: "discrete-mathematics",
    lessonSlug: "graph-theory-paths-and-trees",
    conceptIds: ["concept-path", "concept-graph-connectedness"],
  },
];

function toCourseId(courseSlug: string) {
  return `course-${courseSlug}`;
}

function toModuleId(courseSlug: string, moduleIndex: number) {
  return `module-${courseSlug}-${moduleIndex + 1}`;
}

function toLessonId(courseSlug: string, lessonSlug: string) {
  return `lesson-${courseSlug}-${lessonSlug}`;
}

function buildCatalog() {
  const modules: LearningModule[] = [];
  const lessons: LearningLesson[] = [];
  const courses: LearningCourse[] = [];
  const lessonKeyToId = new Map<string, string>();
  const lessonConceptUsage = new Map<string, Set<string>>();
  let globalLessonOrder = 1;

  courseSeeds.forEach((courseSeed) => {
    const courseId = toCourseId(courseSeed.slug);
    const moduleIds: string[] = [];

    courseSeed.modules.forEach((moduleSeed, moduleIndex) => {
      const moduleId = toModuleId(courseSeed.slug, moduleIndex);
      moduleIds.push(moduleId);

      const lessonIds = moduleSeed.lessons.map((lessonSeed) => {
        const archiveEntry =
          lessonSeed.sourceOrder !== undefined
            ? driveArchiveBySourceOrder.get(lessonSeed.sourceOrder)
            : undefined;
        const lessonSlug = lessonSeed.slug ?? createLessonSlug(lessonSeed.title);
        const lessonId = toLessonId(courseSeed.slug, lessonSlug);
        const resolvedTitle = lessonSeed.title;
        const resolvedVideoSource = archiveEntry
          ? archiveEntry.isPlayable
            ? {
                provider: "google-drive" as const,
                fileId: archiveEntry.driveFileId,
                openUrl: archiveEntry.driveUrl,
              }
            : undefined
          : lessonSeed.videoSource;
        lessonKeyToId.set(`${courseSeed.slug}/${lessonSlug}`, lessonId);

        lessonSeed.concepts.forEach((conceptId) => {
          if (!lessonConceptUsage.has(conceptId)) {
            lessonConceptUsage.set(conceptId, new Set());
          }
          lessonConceptUsage.get(conceptId)?.add(courseId);
        });

        lessons.push({
          id: lessonId,
          slug: lessonSlug,
          courseId,
          moduleId,
          title: resolvedTitle,
          description: lessonSeed.description,
          curriculumOrder: globalLessonOrder,
          sourceOrder: lessonSeed.sourceOrder,
          instructor: archiveEntry?.instructor,
          sourceFileName: archiveEntry?.originalFileName ?? lessonSeed.sourceFileName,
          originalFileName: archiveEntry?.originalFileName,
          driveFileId: archiveEntry?.driveFileId ?? lessonSeed.driveFileId,
          driveUrl: archiveEntry?.driveUrl ?? lessonSeed.videoSource?.openUrl,
          fileSizeBytes: archiveEntry?.sizeBytes,
          durationMinutes: archiveEntry ? undefined : lessonSeed.durationMinutes,
          concepts: lessonSeed.concepts,
          prerequisites: lessonSeed.prerequisiteLessonSlugs ?? [],
          exerciseIds: [],
          videoSource: resolvedVideoSource,
        });
        globalLessonOrder += 1;
        return lessonId;
      });

      modules.push({
        id: moduleId,
        slug: createLessonSlug(moduleSeed.title),
        courseId,
        title: moduleSeed.title,
        description: moduleSeed.description,
        curriculumOrder: moduleIndex + 1,
        lessonIds,
        driveFolderUrl: moduleSeed.driveFolderUrl,
      });
    });

    courses.push({
      id: courseId,
      slug: courseSeed.slug,
      title: courseSeed.title,
      shortTitle: courseSeed.shortTitle,
      description: courseSeed.description,
      summary: courseSeed.summary,
      kind: courseSeed.kind,
      recommended: courseSeed.recommended,
      flagship: courseSeed.flagship,
      moduleIds,
      conceptIds: [],
      accent: courseSeed.accent,
      driveFolderUrl: courseSeed.driveFolderUrl,
    });
  });

  const exercises: LearningExercise[] = exerciseSeeds.map((seed) => {
    const lessonId = lessonKeyToId.get(`${seed.courseSlug}/${seed.lessonSlug}`);
    const courseId = toCourseId(seed.courseSlug);

    return {
      id: seed.id,
      title: seed.title,
      prompt: seed.prompt,
      kind: seed.kind,
      format: seed.format,
      answerMode: seed.answerMode,
      placeholder: seed.placeholder,
      hint: seed.hint,
      solution: seed.solution,
      choices: seed.choices,
      lessonId,
      conceptIds: seed.conceptIds,
      courseId,
    };
  });

  const exercisesByLesson = new Map<string, string[]>();
  exercises.forEach((exercise) => {
    if (!exercise.lessonId) {
      return;
    }

    const current = exercisesByLesson.get(exercise.lessonId) ?? [];
    current.push(exercise.id);
    exercisesByLesson.set(exercise.lessonId, current);
  });

  const resolvedLessons = lessons.map((lesson) => {
    const prerequisiteIds = lesson.prerequisites
      .map((slug) => lessonKeyToId.get(`${courseSeeds.find((courseSeed) => toCourseId(courseSeed.slug) === lesson.courseId)?.slug}/${slug}`))
      .filter((value): value is string => Boolean(value));

    return {
      ...lesson,
      prerequisites: prerequisiteIds,
      exerciseIds: exercisesByLesson.get(lesson.id) ?? [],
    };
  });

  const concepts: LearningConcept[] = conceptSeeds.map((concept) => ({
    ...concept,
    courseIds: [...(lessonConceptUsage.get(concept.id) ?? new Set())],
  }));

  const conceptsByCourse = new Map<string, Set<string>>();
  resolvedLessons.forEach((lesson) => {
    if (!conceptsByCourse.has(lesson.courseId)) {
      conceptsByCourse.set(lesson.courseId, new Set());
    }

    lesson.concepts.forEach((conceptId) => {
      conceptsByCourse.get(lesson.courseId)?.add(conceptId);
    });
  });

  const resolvedCourses = courses.map((course) => ({
    ...course,
    conceptIds: [...(conceptsByCourse.get(course.id) ?? new Set())],
  }));

  return {
    courses: resolvedCourses,
    modules,
    lessons: resolvedLessons,
    concepts,
    exercises,
  } satisfies LearningCatalog;
}

export const learningCatalog = buildCatalog();
