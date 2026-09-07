"use client";

import * as React from "react";
import { Search as SearchIcon, WifiOff } from "lucide-react";

import { fetchCategories, fetchListings } from "@/lib/api";
import { cacheSearchResults, getCachedSearchResults } from "@/lib/cache";
import { useOnline } from "@/lib/online";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ListingCard } from "@/components/ListingCard";
import type { Listing } from "@/types";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function BrowsePage() {
  const online = useOnline();
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [category, setCategory] = React.useState("");
  const [city, setCity] = React.useState("");
  const [listings, setListings] = React.useState<Listing[] | null>(null);
  const [usingCache, setUsingCache] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(data.categories))
      .catch(() => setCategories([]));
  }, []);

  const load = React.useCallback(async () => {
    setError(null);
    try {
      const data = await fetchListings({ category: category || undefined, city: city || undefined });
      setListings(data.listings);
      setUsingCache(false);
      cacheSearchResults(data.listings);
    } catch {
      const cached = getCachedSearchResults();
      if (cached) {
        setListings(cached.listings);
        setUsingCache(true);
      } else {
        setListings([]);
        setError("Couldn't reach EquipRent, and nothing is cached yet for this device.");
      }
    }
  }, [category, city]);

  React.useEffect(() => {
    const handle = setTimeout(load, 250);
    return () => clearTimeout(handle);
  }, [load]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">Browse Equipment</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {usingCache
            ? "Showing your last cached results — reconnect for live listings."
            : "Live listings from EquipRent."}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-[200px] flex-1">
          <SearchIcon
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City…"
            className="pl-9"
            disabled={!online}
          />
        </div>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-48"
          disabled={!online}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>

      {!online && (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <WifiOff className="h-3.5 w-3.5" aria-hidden />
          Filters are disabled offline — showing cached results.
        </p>
      )}

      {listings === null ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : listings.length === 0 ? (
        <p className="text-sm text-muted-foreground">No equipment matches these filters yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
