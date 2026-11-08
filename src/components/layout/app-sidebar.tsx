"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { CinarithmLogo } from "@/components/brand/cinarithm-logo";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { navigationItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type AppSidebarProps = {
  supabaseConfigured: boolean;
  compact?: boolean;
  hidden?: boolean;
};

export function AppSidebar({
  supabaseConfigured,
  compact = false,
  hidden = false,
}: AppSidebarProps) {
  const pathname = usePathname();
  const primaryItems = navigationItems.filter((item) => item.group === "core");
  const secondaryItems = navigationItems.filter((item) => item.group === "secondary");

  if (hidden) {
    return null;
  }

  if (compact) {
    return (
      <aside className="hidden border-r border-border bg-[#111113] md:sticky md:top-0 md:block md:h-screen">
        <div className="flex h-full flex-col items-center gap-4 px-2 py-5">
          <div className="flex w-full flex-col items-center gap-3">
            <CinarithmLogo compact className="w-full" />
            <Badge
              variant="outline"
              className="border-white/10 bg-white/[0.04] px-2 text-[11px] text-white/62"
            >
              Alpha
            </Badge>
          </div>

          <Separator className="bg-white/8" />

          <nav className="flex w-full flex-col items-center gap-2">
            {primaryItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.title}
                  aria-label={item.title}
                  className={cn(
                    "group flex h-11 w-11 items-center justify-center rounded-2xl border transition-all",
                    isActive
                      ? "border-white/12 bg-white/[0.08] text-white shadow-lg shadow-black/20"
                      : "border-transparent bg-transparent text-white/58 hover:border-white/8 hover:bg-white/[0.04] hover:text-white/88"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <item.icon className="size-4" />
                </Link>
              );
            })}
          </nav>

          <Separator className="bg-white/8" />

          <nav className="flex w-full flex-col items-center gap-2 opacity-72">
            {secondaryItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.title}
                  aria-label={item.title}
                  className={cn(
                    "group flex h-10 w-10 items-center justify-center rounded-2xl border transition-all",
                    isActive
                      ? "border-white/12 bg-white/[0.08] text-white"
                      : "border-transparent bg-transparent text-white/42 hover:border-white/8 hover:bg-white/[0.04] hover:text-white/72"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <item.icon className="size-4" />
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    );
  }

  return (
    <aside className="border-b border-border bg-[#111113] md:sticky md:top-0 md:h-screen md:border-b-0 md:border-r">
      <div className="flex h-full flex-col gap-4 px-4 py-4 sm:px-6 md:px-5 md:py-6">
        <div className="flex items-start justify-between gap-3 md:block">
          <CinarithmLogo className="min-w-0" />
          <Badge
            variant="outline"
            className="border-white/10 bg-white/[0.04] text-white/70 md:mt-4"
          >
            Alpha
          </Badge>
        </div>

        <Separator className="bg-white/8" />

        <nav className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:mx-0 md:grid md:gap-1 md:overflow-visible md:px-0">
          {primaryItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex min-w-max items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm transition-all md:min-w-0",
                  isActive
                    ? "border-white/12 bg-white/[0.08] text-white shadow-lg shadow-black/20"
                    : "border-transparent bg-transparent text-white/58 hover:border-white/8 hover:bg-white/[0.04] hover:text-white/88"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-xl border transition-colors",
                    isActive
                      ? "border-white/12 bg-white/[0.08] text-white"
                      : "border-white/8 bg-white/[0.03] text-white/60 group-hover:text-white/88"
                  )}
                >
                  <item.icon className="size-4" />
                </span>

                <span className="hidden min-w-0 md:block">
                  <span className="block truncate font-medium">{item.title}</span>
                  <span className="mt-0.5 block truncate text-xs text-white/45">
                    {item.description}
                  </span>
                </span>

                <span className="whitespace-nowrap font-medium md:hidden">
                  {item.title}
                </span>
              </Link>
            );
          })}
        </nav>

        <Separator className="bg-white/8" />

        <div className="space-y-2">
          <p className="px-1 text-[11px] uppercase tracking-[0.22em] text-white/28">
            Diğer
          </p>
          <nav className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:mx-0 md:grid md:gap-1 md:overflow-visible md:px-0">
            {secondaryItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex min-w-max items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm transition-all opacity-76 md:min-w-0",
                    isActive
                      ? "border-white/12 bg-white/[0.08] text-white shadow-lg shadow-black/20"
                      : "border-transparent bg-transparent text-white/44 hover:border-white/8 hover:bg-white/[0.04] hover:text-white/72"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-xl border transition-colors",
                      isActive
                        ? "border-white/12 bg-white/[0.08] text-white"
                        : "border-white/8 bg-white/[0.03] text-white/48 group-hover:text-white/74"
                    )}
                  >
                    <item.icon className="size-4" />
                  </span>

                  <span className="hidden min-w-0 md:block">
                    <span className="block truncate font-medium">{item.title}</span>
                    <span className="mt-0.5 block truncate text-xs text-white/36">
                      {item.description}
                    </span>
                  </span>

                  <span className="whitespace-nowrap font-medium md:hidden">
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <Card className="surface-glow mt-auto border-border bg-card backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-sm text-white">Kurulum Durumu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-white/60">
            <div className="flex items-center justify-between gap-3">
              <span>Arayüz iskeleti</span>
              <Badge className="bg-zinc-300/14 text-zinc-300">Hazır</Badge>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Supabase bağlantısı</span>
              <Badge
                variant="outline"
                className={cn(
                  "border-white/10",
                  supabaseConfigured
                    ? "bg-zinc-300/14 text-zinc-300"
                    : "bg-white/[0.03] text-white/60"
                )}
              >
                {supabaseConfigured ? "Etkin" : "Ortam değişkeni bekliyor"}
              </Badge>
            </div>
            <p className="text-xs leading-6 text-white/40">
              Supabase anahtarlarını eklediğinde veri katmanı hazır şekilde devreye alınabilir.
            </p>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}
