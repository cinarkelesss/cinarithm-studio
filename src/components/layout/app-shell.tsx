"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { CommandPalette } from "@/components/layout/command-palette";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppStateProvider } from "@/components/providers/app-state-provider";
import { LearningWorkspaceProvider } from "@/components/providers/learning-workspace-provider";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { cn } from "@/lib/utils";

const LESSON_FOCUS_EVENT = "cinarithm:lesson-focus";

function isLessonRoute(pathname: string) {
  return /^\/learning\/course\/[^/]+\/lesson\/[^/]+/.test(pathname);
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const supabaseConfigured = hasSupabaseEnv();
  const lessonRoute = isLessonRoute(pathname);
  const [lessonFocus, setLessonFocus] = useState(false);

  useEffect(() => {
    const handleFocusEvent = (event: Event) => {
      const detail = (event as CustomEvent<{ active?: boolean }>).detail;
      setLessonFocus(Boolean(detail?.active));
    };

    window.addEventListener(LESSON_FOCUS_EVENT, handleFocusEvent as EventListener);

    return () => {
      window.removeEventListener(
        LESSON_FOCUS_EVENT,
        handleFocusEvent as EventListener
      );
    };
  }, []);

  useEffect(() => {
    if (!lessonRoute) {
      setLessonFocus(false);
    }
  }, [lessonRoute]);

  return (
    <AppStateProvider>
      <LearningWorkspaceProvider>
        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="grid-fade absolute inset-0 opacity-35" />
          </div>

          <div
            className={cn(
              "relative mx-auto flex min-h-screen w-full flex-col",
              lessonRoute ? "max-w-[1760px]" : "max-w-[1600px]",
              lessonRoute
                ? lessonFocus
                  ? "md:grid md:grid-cols-[minmax(0,1fr)]"
                  : "md:grid md:grid-cols-[78px_minmax(0,1fr)]"
                : "md:grid md:grid-cols-[290px_minmax(0,1fr)]"
            )}
          >
            <AppSidebar
              supabaseConfigured={supabaseConfigured}
              compact={lessonRoute}
              hidden={lessonRoute && lessonFocus}
            />

            <main
              className={cn(
                "space-y-5 px-4 pb-8 pt-5 sm:px-6",
                lessonRoute
                  ? "md:px-6 md:pb-8 md:pt-5 xl:px-7"
                  : "md:px-8 md:pb-10 md:pt-8"
              )}
            >
              <CommandPalette />
              {children}
            </main>
          </div>
        </div>
      </LearningWorkspaceProvider>
    </AppStateProvider>
  );
}
