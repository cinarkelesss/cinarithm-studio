import { getDateKeyDaysAgo, toDateKey } from "@/lib/date";
import {
  defaultLearningCategories,
  defaultLearningCourses,
  defaultLearningResources,
} from "@/lib/learning-data";
import type { AppData } from "@/lib/types";

function uid(prefix: string, suffix: string) {
  return `${prefix}-${suffix}`;
}

function cloneLearningCategories() {
  return defaultLearningCategories.map((category) => ({ ...category }));
}

function cloneLearningResources() {
  return defaultLearningResources.map((resource) => ({
    ...resource,
    items: resource.items.map((item) => ({ ...item })),
  }));
}

function cloneLearningCourses() {
  return defaultLearningCourses.map((course) => ({
    ...course,
    topics: [...course.topics],
    resourceIds: [...course.resourceIds],
    relatedBookIds: [...course.relatedBookIds],
    relatedNodeIds: [...course.relatedNodeIds],
    relatedProofIds: [...course.relatedProofIds],
  }));
}

export function createDefaultAppData(now = new Date()): AppData {
  const today = toDateKey(now);
  const yesterday = getDateKeyDaysAgo(1, now);
  const twoDaysAgo = getDateKeyDaysAgo(2, now);
  const threeDaysAgo = getDateKeyDaysAgo(3, now);
  const fourDaysAgo = getDateKeyDaysAgo(4, now);
  const fiveDaysAgo = getDateKeyDaysAgo(5, now);

  return {
    profile: {
      displayName: "Çınar",
      slogan: "Matematikte derinleşmek için.",
      dailyGoalHours: 3,
      focusArea: "Hazırlık yılı temelleri",
    },
    books: [
      {
        id: "book-proof",
        title: "Book of Proof",
        author: "Richard Hammack",
        progress: 71,
        currentSection: "Fonksiyonlar ve niceleyiciler",
        note: "Bu hafta tanım dilini daha temiz okumaya odaklan.",
        isActive: true,
        updatedAt: today,
      },
      {
        id: "book-spivak",
        title: "Calculus",
        author: "Michael Spivak",
        progress: 24,
        currentSection: "Limit fikri",
        note: "Hesaptan önce fikri anlamaya çalış.",
        isActive: false,
        updatedAt: yesterday,
      },
      {
        id: "book-axler",
        title: "Linear Algebra Done Right",
        author: "Sheldon Axler",
        progress: 16,
        currentSection: "Vektör uzayları",
        note: "Tanımları ezberleme, örnek kur.",
        isActive: false,
        updatedAt: twoDaysAgo,
      },
    ],
    proofs: [
      {
        id: uid("proof", "1"),
        title: "Birleşimin birleşmeli olduğunu göster",
        technique: "Doğrudan ispat",
        source: "Book of Proof",
        difficulty: "kolay",
        note: "Küme üyeliği dilini temiz yazınca akış çok rahatladı.",
        createdAt: today,
      },
      {
        id: uid("proof", "2"),
        title: "Teklik ispatı örneği",
        technique: "Çelişki ile ispat",
        source: "Book of Proof",
        difficulty: "orta",
        note: "Aynı nesneden iki tane varsayıp eşitliğe zorladım.",
        createdAt: threeDaysAgo,
      },
    ],
    journalEntries: [
      {
        id: uid("journal", "1"),
        title: "İndüksiyon ilk kez oturmaya başladı",
        body: "Bugün basamak fikrini daha doğal hissettim. Sadece formülü değil, neden ileri ittiğini düşününce ispat akmaya başladı.",
        tag: "ispat",
        createdAt: today,
      },
      {
        id: uid("journal", "2"),
        title: "Tanımları yavaş okumak işe yarıyor",
        body: "Hızlı geçince yanlış anlıyorum. Özellikle niceleyicilerde acele etmek çok hata doğuruyor.",
        tag: "okuma",
        createdAt: fourDaysAgo,
      },
    ],
    roadmapWeeks: [
      {
        id: "week-1",
        weekNumber: 1,
        title: "Sistemi kur",
        focus: "Book of Proof başlangıcı, günlük, temel araçlar",
        progress: 100,
        status: "tamamlandı",
      },
      {
        id: "week-2",
        weekNumber: 2,
        title: "İspat ritmi oluştur",
        focus: "Doğrudan ispat, kümeler, her gün kısa yazı",
        progress: 80,
        status: "devam ediyor",
      },
      {
        id: "week-3",
        weekNumber: 3,
        title: "Fonksiyon diline gir",
        focus: "Fonksiyon, birebir, örten, karşı örnek",
        progress: 25,
        status: "planlandı",
      },
      {
        id: "week-4",
        weekNumber: 4,
        title: "Calculus kıvılcımı",
        focus: "Spivak ilk bölümler ve sezgisel limit fikri",
        progress: 10,
        status: "planlandı",
      },
    ],
    knowledgeNodes: [
      {
        id: "node-sets",
        title: "Kümeler",
        branch: "Temeller",
        status: "oturdu",
        note: "Birleşim, kesişim ve alt küme dili rahat.",
      },
      {
        id: "node-functions",
        title: "Fonksiyonlar",
        branch: "Temeller",
        status: "çalışılıyor",
        note: "Birebir ve örten örneklerini artır.",
      },
      {
        id: "node-induction",
        title: "İndüksiyon",
        branch: "İspat Teknikleri",
        status: "çalışılıyor",
        note: "Varsayım adımını daha net yaz.",
      },
    ],
    problems: [
      {
        id: "problem-1",
        title: "Her birebir fonksiyonun tersi var mıdır?",
        source: "Kendi sorum",
        difficulty: "orta",
        status: "çalışılıyor",
        note: "Tanım kümesi ve görüntü kümesini dikkatli düşün.",
        createdAt: yesterday,
      },
      {
        id: "problem-2",
        title: "Bir indüksiyon örneğini iki farklı yoldan çöz",
        source: "Book of Proof",
        difficulty: "kolay",
        status: "çözüldü",
        note: "Doğrudan ve güçlü indüksiyon farkını gördüm.",
        createdAt: fiveDaysAgo,
      },
    ],
    learningCategories: cloneLearningCategories(),
    learningResources: cloneLearningResources(),
    learningCourses: cloneLearningCourses(),
    dailyTaskTemplates: [
      {
        id: "task-proof",
        title: "2 ispat yaz",
        subtitle: "İkisini de kendi cümlelerinle ve temiz adımlarla tamamla.",
        xp: 10,
        estimatedMinutes: 45,
      },
      {
        id: "task-book",
        title: "Aktif kitaptan 5 sayfa çalış",
        subtitle: "Tanımları yavaş oku ve en az bir not çıkar.",
        xp: 8,
        estimatedMinutes: 35,
      },
      {
        id: "task-journal",
        title: "Matematik günlüğünü yaz",
        subtitle: "Bugün nerede zorlandığını ve yarın neye döneceğini kaydet.",
        xp: 6,
        estimatedMinutes: 20,
      },
      {
        id: "task-english",
        title: "İngilizce 20 dakika",
        subtitle: "Kısa ama kesintisiz bir okuma bloğu yeterli.",
        xp: 5,
        estimatedMinutes: 20,
      },
    ],
    taskCompletions: {
      [today]: ["task-proof"],
      [yesterday]: ["task-proof", "task-journal", "task-book"],
      [twoDaysAgo]: ["task-book", "task-english"],
    },
    activityLog: [
      {
        id: "activity-task-proof-today",
        kind: "task",
        entityId: "task-proof",
        label: "Bugünün ilk iki ispatı yazıldı",
        date: today,
        xp: 10,
      },
      {
        id: "activity-proof-1",
        kind: "proof",
        entityId: "proof-1",
        label: "Yeni bir ispat eklendi",
        date: today,
        xp: 12,
      },
      {
        id: "activity-journal-1",
        kind: "journal",
        entityId: "journal-1",
        label: "Günlük kaydı yazıldı",
        date: today,
        xp: 8,
      },
      {
        id: "activity-task-yesterday",
        kind: "task",
        entityId: "task-book",
        label: "Aktif kitap bloğu tamamlandı",
        date: yesterday,
        xp: 8,
      },
      {
        id: "activity-roadmap-1",
        kind: "roadmap",
        entityId: "week-1",
        label: "1. hafta tamamlandı",
        date: yesterday,
        xp: 15,
      },
      {
        id: "activity-proof-2",
        kind: "proof",
        entityId: "proof-2",
        label: "Teklik ispatı eklendi",
        date: threeDaysAgo,
        xp: 12,
      },
      {
        id: "activity-journal-2",
        kind: "journal",
        entityId: "journal-2",
        label: "Günlükte tanım okuma notu tutuldu",
        date: fourDaysAgo,
        xp: 8,
      },
      {
        id: "activity-problem-2",
        kind: "problem",
        entityId: "problem-2",
        label: "Bir problem çözüldü",
        date: fiveDaysAgo,
        xp: 10,
      },
    ],
    settings: {
      language: "tr",
      storageMode: "yerel",
    },
  };
}
