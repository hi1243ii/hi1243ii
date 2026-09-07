"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { List, Map as MapIcon, SearchX } from "lucide-react";

import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/ListingCard";
import type { SearchListing } from "@/types/search";

const ResultsMap = dynamic(() => import("./ResultsMap").then((m) => m.ResultsMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-muted">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  ),
});

export function SearchResults({ listings }: { listings: SearchListing[] }) {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);
  const [mobileView, setMobileView] = React.useState<"list" | "map">("list");

  return (
    <div className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
        <div className={cn("flex-col gap-6 py-6", mobileView === "list" ? "flex" : "hidden lg:flex")}>
          <div className="px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-muted-foreground">
              {listings.length} listing{listings.length === 1 ? "" : "s"}
            </p>
          </div>

          {listings.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-20 text-center">
              <SearchX className="h-10 w-10 text-muted-foreground" aria-hidden />
              <p className="font-display text-lg font-semibold">No equipment matches these filters</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Try widening your price range, clearing a spec filter, or searching a larger radius.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:px-8 xl:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  distanceMi={listing.distanceMi}
                  onMouseEnter={() => setHoveredId(listing.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={cn(hoveredId === listing.id && "ring-2 ring-primary")}
                />
              ))}
            </div>
          )}
        </div>

        <div
          className={cn(
            "sticky top-[8.5rem] h-[calc(100vh-8.5rem)] border-l border-border",
            mobileView === "map" ? "block" : "hidden lg:block",
          )}
        >
          <ResultsMap listings={listings} hoveredId={hoveredId} onHoverListing={setHoveredId} />
        </div>
      </div>

      <div className="fixed bottom-6 left-1/2 z-30 -translate-x-1/2 lg:hidden">
        <Button
          size="sm"
          variant="secondary"
          className="shadow-elevated"
          onClick={() => setMobileView((v) => (v === "list" ? "map" : "list"))}
        >
          {mobileView === "list" ? (
            <>
              <MapIcon className="h-4 w-4" /> Map
            </>
          ) : (
            <>
              <List className="h-4 w-4" /> List
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
