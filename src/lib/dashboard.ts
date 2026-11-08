import {
  BarChart3,
  Library,
  Network,
  ScrollText,
} from "lucide-react";

export const dashboardStats = [
  {
    label: "Seri",
    value: "17 gün",
    detail: "Masaya her gün oturabildiğinde bu seri doğal olarak büyür.",
  },
  {
    label: "XP",
    value: "2.480",
    detail: "Düşük sürtünmeli bir rutin kurduğunda puan otomatik sonuç olur.",
  },
  {
    label: "Aktif kitap ilerlemesi",
    value: "%71",
    detail: "Book of Proof içinde oturan bir ritim, yılın geri kalanını da taşır.",
  },
] as const;

export const todayTasks = [
  {
    id: "proof-1",
    title: "2 ispat yaz",
    subtitle: "İkisini de kendi cümlelerinle ve temiz adımlarla tamamla.",
    completed: true,
  },
  {
    id: "book",
    title: "Book of Proof 2.3",
    subtitle: "Yeni bölümün tanımlarını önce yavaş, sonra tekrar oku.",
    completed: false,
  },
  {
    id: "journal",
    title: "Matematik günlüğünü yaz",
    subtitle: "Bugün nerede zorlandığını ve yarın neye döneceğini kaydet.",
    completed: false,
  },
  {
    id: "english",
    title: "İngilizce 20 dakika",
    subtitle: "Kısa ama kesintisiz bir okuma bloğu yeterli.",
    completed: false,
  },
] as const;

export const currentBook = {
  title: "Book of Proof",
  author: "Richard Hammack",
  progress: 71,
  currentSection: "Fonksiyonlar ve niceleyiciler",
  note: "Bu hafta tanım dilini daha temiz okumaya odaklan.",
} as const;

export const dashboardPlaceholders = [
  {
    title: "Yol Haritası",
    description:
      "Haftalık plan blokları, dönem hedefleri ve kilometre taşları burada netleşecek.",
    status: "Placeholder",
    icon: ScrollText,
  },
  {
    title: "Kütüphanem",
    description:
      "Kitap ilerlemeleri, bölüm notları ve hangi kaynağın aktif olduğu burada görünecek.",
    status: "Placeholder",
    icon: Library,
  },
  {
    title: "Bilgi Ağacı",
    description:
      "Kavram bağlantılarını ileride düğüm yapısında açmak için alan hazır.",
    status: "Placeholder",
    icon: Network,
  },
  {
    title: "İstatistikler",
    description:
      "Saat, ispat ve günlük verileri ileride buradan grafik olarak akacak.",
    status: "Placeholder",
    icon: BarChart3,
  },
] as const;
