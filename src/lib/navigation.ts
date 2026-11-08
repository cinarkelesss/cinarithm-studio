import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookText,
  GraduationCap,
  Home,
  Library,
  Map,
  Network,
  NotebookPen,
  Puzzle,
  ScrollText,
  Settings2,
  Sigma,
  Trophy,
} from "lucide-react";

export type NavigationItem = {
  title: string;
  href: string;
  description: string;
  icon: LucideIcon;
  group: "core" | "secondary";
};

export const navigationItems: NavigationItem[] = [
  {
    title: "Ana Sayfa",
    href: "/",
    description: "Bugün ne çalışılacak",
    icon: Home,
    group: "core",
  },
  {
    title: "Dersler",
    href: "/learning",
    description: "Müfredat kütüphanesi",
    icon: GraduationCap,
    group: "core",
  },
  {
    title: "Alıştırmalar",
    href: "/practice",
    description: "Pekiştirme bankası",
    icon: Puzzle,
    group: "core",
  },
  {
    title: "Kavramlar",
    href: "/concepts",
    description: "Kavram haritası",
    icon: Network,
    group: "core",
  },
  {
    title: "Notlar",
    href: "/notes",
    description: "Ders notları",
    icon: NotebookPen,
    group: "core",
  },
  {
    title: "Yol Haritası",
    href: "/yol-haritasi",
    description: "Haftalık plan",
    icon: Map,
    group: "secondary",
  },
  {
    title: "Kütüphanem",
    href: "/kutuphanem",
    description: "Kitaplar ve notlar",
    icon: Library,
    group: "secondary",
  },
  {
    title: "İspatlarım",
    href: "/ispatlarim",
    description: "Yazdığın ispatlar",
    icon: Sigma,
    group: "secondary",
  },
  {
    title: "Matematik Günlüğüm",
    href: "/matematik-gunlugum",
    description: "Günlük kayıtlar",
    icon: ScrollText,
    group: "secondary",
  },
  {
    title: "İstatistikler",
    href: "/istatistikler",
    description: "İlerleme verileri",
    icon: BarChart3,
    group: "secondary",
  },
  {
    title: "Başarılarım",
    href: "/basarilarim",
    description: "Kilometre taşları",
    icon: Trophy,
    group: "secondary",
  },
  {
    title: "Bilgi Ağacı",
    href: "/bilgi-agaci",
    description: "Eski kavram sayfası",
    icon: BookText,
    group: "secondary",
  },
  {
    title: "Ayarlar",
    href: "/ayarlar",
    description: "Tercihler ve bağlantılar",
    icon: Settings2,
    group: "secondary",
  },
];
