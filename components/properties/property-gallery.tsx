"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { absoluteImageUrl } from "@/lib/utils";
import { FALLBACK_IMAGE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function PropertyGallery({ images, title }: { images: string[]; title: string }) {
  const normalized = images.length ? images : [FALLBACK_IMAGE];
  const [active, setActive] = useState(0);

  const go = (delta: number) => {
    setActive((prev) => (prev + delta + normalized.length) % normalized.length);
  };

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
        <Image
          src={absoluteImageUrl(normalized[active]) ?? FALLBACK_IMAGE}
          alt={`${title} — image ${active + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
        />
        {normalized.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg transition-colors hover:bg-background"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg transition-colors hover:bg-background"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-slate-900/70 px-3 py-1 text-xs font-medium text-white">
              {active + 1} / {normalized.length}
            </span>
          </>
        )}
        {!images.length && (
          <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-slate-900/70 px-3 py-1 text-xs font-medium text-white">
            <ImageIcon className="h-3.5 w-3.5" /> No images
          </span>
        )}
      </div>

      {normalized.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {normalized.map((image, index) => (
            <button
              key={`${image}-${index}`}
              onClick={() => setActive(index)}
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-lg border-2 transition-colors",
                active === index ? "border-brand-600" : "border-transparent hover:border-border"
              )}
            >
              <Image
                src={absoluteImageUrl(image) ?? FALLBACK_IMAGE}
                alt={`${title} thumbnail ${index + 1}`}
                fill
                sizes="160px"
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
