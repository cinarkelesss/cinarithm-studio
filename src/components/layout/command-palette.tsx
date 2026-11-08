"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Command, Search } from "lucide-react";

import { buildSearchIndex } from "@/lib/learning/catalog";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchItems = useMemo(() => buildSearchIndex(), []);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("en-US");
    if (!normalized) {
      return searchItems.slice(0, 9);
    }

    return searchItems
      .filter(
        (item) =>
          item.title.toLocaleLowerCase("en-US").includes(normalized) ||
          item.subtitle.toLocaleLowerCase("en-US").includes(normalized)
      )
      .slice(0, 9);
  }, [query, searchItems]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm text-white/58 transition hover:bg-white/[0.07]"
      >
        <span className="flex items-center gap-2">
          <Search className="size-4" />
          Search courses, lessons, concepts
        </span>
        <span className="flex items-center gap-1 rounded-xl border border-white/10 bg-black/20 px-2 py-1 text-xs text-white/48">
          <Command className="size-3.5" />
          K
        </span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 bg-black/60 px-4 py-10 backdrop-blur-sm">
          <div className="mx-auto max-w-2xl rounded-[28px] border border-white/10 bg-[#18181b] shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
            <div className="border-b border-white/8 px-4 py-4">
              <label className="flex items-center gap-3 rounded-2xl border border-white/8 bg-black/18 px-4 py-3 text-sm text-white/58">
                <Search className="size-4" />
                <input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Real Analysis, compactness, Cauchy..."
                  className="w-full bg-transparent text-white outline-none placeholder:text-white/28"
                />
              </label>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-3">
              {filteredItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => {
                    setOpen(false);
                    setQuery("");
                  }}
                  className="block rounded-2xl px-4 py-3 text-sm transition hover:bg-white/[0.05]"
                >
                  <p className="font-medium text-white">{item.title}</p>
                  <p className="mt-1 text-white/46">{item.subtitle}</p>
                </Link>
              ))}
              {filteredItems.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-white/46">
                  Sonuc yok. Daha dar veya farklı bir anahtar kelime dene.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
