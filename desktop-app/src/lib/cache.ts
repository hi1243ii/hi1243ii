import type { Listing } from "@/types";

const RECENT_LISTINGS_KEY = "eqr:recent-listings";
const LAST_SEARCH_KEY = "eqr:last-search-results";
const MAX_RECENT = 30;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable (private browsing) — caching is best-effort.
  }
}

/** Remember a listing the user actually opened, most-recent-first, capped. */
export function cacheViewedListing(listing: Listing) {
  const existing = read<Listing[]>(RECENT_LISTINGS_KEY, []);
  const next = [
    { ...listing, cachedAt: Date.now() },
    ...existing.filter((l) => l.id !== listing.id),
  ].slice(0, MAX_RECENT);
  write(RECENT_LISTINGS_KEY, next);
}

export function getCachedListing(id: string): Listing | null {
  return read<Listing[]>(RECENT_LISTINGS_KEY, []).find((l) => l.id === id) ?? null;
}

export function getRecentListings(): Listing[] {
  return read<Listing[]>(RECENT_LISTINGS_KEY, []);
}

/** Remember the last successful search result set, for offline browsing. */
export function cacheSearchResults(listings: Listing[]) {
  write(LAST_SEARCH_KEY, { listings, cachedAt: Date.now() });
}

export function getCachedSearchResults(): { listings: Listing[]; cachedAt: number } | null {
  return read(LAST_SEARCH_KEY, null);
}
