"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, ImageOff, X } from "lucide-react";

import { cn } from "@/lib/cn";

export interface GalleryPhoto {
  id: string;
  url: string;
  altText: string | null;
}

export function PhotoGallery({ photos, title }: { photos: GalleryPhoto[]; title: string }) {
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);

  if (photos.length === 0) {
    return (
      <div className="flex h-72 w-full flex-col items-center justify-center gap-2 rounded-lg bg-muted text-muted-foreground sm:h-96">
        <ImageOff className="h-8 w-8" aria-hidden />
        <span className="text-sm">No photos available yet</span>
      </div>
    );
  }

  const openAt = (i: number) => setLightboxIndex(i);
  const close = () => setLightboxIndex(null);
  const prev = React.useCallback(
    () => setLightboxIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length)),
    [photos.length],
  );
  const next = React.useCallback(
    () => setLightboxIndex((i) => (i === null ? i : (i + 1) % photos.length)),
    [photos.length],
  );

  React.useEffect(() => {
    if (lightboxIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, next, prev]);

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 overflow-hidden rounded-lg sm:h-96 sm:grid-cols-4 sm:grid-rows-2">
        <button
          type="button"
          onClick={() => openAt(0)}
          className="relative col-span-2 row-span-2 h-56 overflow-hidden bg-muted sm:h-full"
        >
          <Image
            src={photos[0].url}
            alt={photos[0].altText ?? title}
            fill
            priority
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(min-width: 640px) 50vw, 100vw"
          />
        </button>
        {photos.slice(1, 5).map((photo, i) => (
          <button
            type="button"
            key={photo.id}
            onClick={() => openAt(i + 1)}
            className="relative hidden h-full overflow-hidden bg-muted sm:block"
          >
            <Image
              src={photo.url}
              alt={photo.altText ?? title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes="25vw"
            />
          </button>
        ))}
      </div>

      {photos.length > 1 && (
        <button
          type="button"
          onClick={() => openAt(0)}
          className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-soft hover:bg-muted sm:hidden"
        >
          <Expand className="h-3.5 w-3.5" aria-hidden />
          View all {photos.length} photos
        </button>
      )}

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-foreground/95 backdrop-blur-sm"
          role="dialog"
          aria-modal
          aria-label={`${title} photos`}
        >
          <div className="flex items-center justify-between p-4">
            <span className="text-sm text-background/70">
              {lightboxIndex + 1} / {photos.length}
            </span>
            <button
              type="button"
              onClick={close}
              className="rounded-full p-2 text-background hover:bg-background/10"
              aria-label="Close photo viewer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative flex-1 px-4 pb-4">
            <div className="relative mx-auto h-full max-w-4xl">
              <Image
                src={photos[lightboxIndex].url}
                alt={photos[lightboxIndex].altText ?? title}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>

            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous photo"
                  className={cn(
                    "absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/10 p-2 text-background hover:bg-background/20",
                  )}
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next photo"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/10 p-2 text-background hover:bg-background/20"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
