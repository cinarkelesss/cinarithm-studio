"use client";

import Image from "next/image";

type Props = {
  onFileSelect: (file: File | null) => void;
  preview: string | null;
};

export default function ImageUpload({
  onFileSelect,
  preview,
}: Props) {
  return (
    <div className="space-y-3">
      <label className="block text-sm text-zinc-400">
        Soru Görseli
      </label>

      <label className="relative flex h-56 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-zinc-700 bg-zinc-900 transition hover:border-white hover:bg-zinc-800">
        {preview ? (
          <Image
            src={preview}
            alt="Preview"
            fill
            unoptimized
            className="object-contain p-3"
          />
        ) : (
          <>
            <span className="text-5xl">📷</span>

            <p className="mt-4 text-sm text-zinc-400">
              Görsel seçmek için tıkla
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              PNG, JPG, WEBP
            </p>
          </>
        )}

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) =>
            onFileSelect(e.target.files?.[0] ?? null)
          }
        />
      </label>
    </div>
  );
}
