"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Loader2, LocateFixed, Search, SlidersHorizontal, X } from "lucide-react";

import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { specFiltersForCategory } from "@/lib/specFilters";

export interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

const RADIUS_OPTIONS = [10, 25, 50, 100, 250];

export function FilterBar({ categories }: { categories: CategoryOption[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = React.useTransition();

  const [q, setQ] = React.useState(searchParams.get("q") ?? "");
  const [minPrice, setMinPrice] = React.useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = React.useState(searchParams.get("maxPrice") ?? "");
  const [geoLoading, setGeoLoading] = React.useState(false);
  const [geoError, setGeoError] = React.useState<string | null>(null);
  const [showMore, setShowMore] = React.useState(false);

  const category = searchParams.get("category") ?? "";
  const start = searchParams.get("start") ?? "";
  const end = searchParams.get("end") ?? "";
  const hasGeo = searchParams.has("lat") && searchParams.has("lng");
  const radius = searchParams.get("radius") ?? "50";
  const specDefs = specFiltersForCategory(category || undefined);

  const navigate = React.useCallback(
    (mutator: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutator(params);
      startTransition(() => {
        router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname, {
          scroll: false,
        });
      });
    },
    [pathname, router, searchParams],
  );

  React.useEffect(() => {
    const handle = setTimeout(() => {
      navigate((params) => {
        if (q) params.set("q", q);
        else params.delete("q");
      });
    }, 400);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  React.useEffect(() => {
    const handle = setTimeout(() => {
      navigate((params) => {
        if (minPrice) params.set("minPrice", minPrice);
        else params.delete("minPrice");
        if (maxPrice) params.set("maxPrice", maxPrice);
        else params.delete("maxPrice");
      });
    }, 400);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minPrice, maxPrice]);

  function handleCategoryChange(slug: string) {
    setShowMore(false);
    navigate((params) => {
      if (slug) params.set("category", slug);
      else params.delete("category");
      Array.from(params.keys()).forEach((key) => {
        if (key.startsWith("spec_")) params.delete(key);
      });
    });
  }

  function handleDateChange(field: "start" | "end", value: string) {
    navigate((params) => {
      if (value) params.set(field, value);
      else params.delete(field);
    });
  }

  function handleNearMe() {
    if (hasGeo) {
      navigate((params) => {
        params.delete("lat");
        params.delete("lng");
        params.delete("radius");
      });
      return;
    }
    if (!navigator.geolocation) {
      setGeoError("Geolocation isn't supported in this browser.");
      return;
    }
    setGeoError(null);
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        navigate((params) => {
          params.set("lat", pos.coords.latitude.toFixed(4));
          params.set("lng", pos.coords.longitude.toFixed(4));
          if (!params.get("radius")) params.set("radius", "50");
        });
        setGeoLoading(false);
      },
      () => {
        setGeoError("Couldn't get your location.");
        setGeoLoading(false);
      },
      { timeout: 8000 },
    );
  }

  function handleRadiusChange(value: string) {
    navigate((params) => params.set("radius", value));
  }

  function handleSpecChange(key: string, suffix: string | null, value: string) {
    navigate((params) => {
      const paramKey = suffix ? `spec_${key}_${suffix}` : `spec_${key}`;
      if (value) params.set(paramKey, value);
      else params.delete(paramKey);
    });
  }

  function clearAll() {
    setQ("");
    setMinPrice("");
    setMaxPrice("");
    setGeoError(null);
    setShowMore(false);
    startTransition(() => router.replace(pathname, { scroll: false }));
  }

  const activeSpecCount = Array.from(searchParams.keys()).filter((k) => k.startsWith("spec_")).length;
  const activeFilterCount =
    (category ? 1 : 0) +
    (minPrice || maxPrice ? 1 : 0) +
    (start && end ? 1 : 0) +
    (hasGeo ? 1 : 0) +
    activeSpecCount;

  return (
    <div className="sticky top-16 z-30 border-b border-border bg-card/95 backdrop-blur">
      <Container className="flex flex-wrap items-end gap-3 py-3">
        <div className="relative min-w-[180px] flex-1 sm:flex-none sm:basis-64">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search equipment, make, city…"
            aria-label="Search equipment"
            className="pl-9"
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="filter-category" className="text-xs text-muted-foreground">
            Category
          </Label>
          <Select
            id="filter-category"
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-44"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">Price / day</Label>
          <div className="flex items-center gap-1">
            <Input
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-20"
              aria-label="Minimum daily price"
            />
            <span className="text-muted-foreground">–</span>
            <Input
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-20"
              aria-label="Maximum daily price"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">Available dates</Label>
          <div className="flex items-center gap-1">
            <Input
              type="date"
              value={start}
              onChange={(e) => handleDateChange("start", e.target.value)}
              className="w-[8.5rem]"
              aria-label="Availability start date"
            />
            <span className="text-muted-foreground">–</span>
            <Input
              type="date"
              value={end}
              onChange={(e) => handleDateChange("end", e.target.value)}
              className="w-[8.5rem]"
              aria-label="Availability end date"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">Distance</Label>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={hasGeo ? "accent" : "secondary"}
              size="sm"
              onClick={handleNearMe}
              disabled={geoLoading}
            >
              {geoLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LocateFixed className="h-4 w-4" />
              )}
              {hasGeo ? "Near me" : "Use my location"}
              {hasGeo && <X className="h-3.5 w-3.5" aria-hidden />}
            </Button>
            {hasGeo && (
              <Select
                value={radius}
                onChange={(e) => handleRadiusChange(e.target.value)}
                className="w-24"
                aria-label="Search radius"
              >
                {RADIUS_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r} mi
                  </option>
                ))}
              </Select>
            )}
          </div>
        </div>

        {specDefs.length > 0 && (
          <Button
            type="button"
            variant={showMore ? "accent" : "outline"}
            size="sm"
            onClick={() => setShowMore((v) => !v)}
            className="mb-0.5"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Specs
            {activeSpecCount > 0 && (
              <Badge variant="default" className="bg-background/20 text-current">
                {activeSpecCount}
              </Badge>
            )}
          </Button>
        )}

        {activeFilterCount > 0 && (
          <Button type="button" variant="ghost" size="sm" onClick={clearAll} className="mb-0.5">
            Clear all
          </Button>
        )}

        <div
          className={cn(
            "ml-auto flex items-center gap-1 text-xs text-muted-foreground transition-opacity",
            isPending ? "opacity-100" : "opacity-0",
          )}
          aria-hidden={!isPending}
        >
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Updating…
        </div>
      </Container>

      {geoError && (
        <Container className="pb-2">
          <p className="text-xs text-destructive">{geoError}</p>
        </Container>
      )}

      {showMore && specDefs.length > 0 && (
        <div className="border-t border-border bg-muted/40">
          <Container className="grid grid-cols-2 gap-4 py-4 sm:grid-cols-3 lg:grid-cols-4">
            {specDefs.map((def) => {
              if (def.type === "range") {
                const minVal = searchParams.get(`spec_${def.key}_min`) ?? "";
                const maxVal = searchParams.get(`spec_${def.key}_max`) ?? "";
                return (
                  <div key={def.key} className="flex flex-col gap-1">
                    <Label className="text-xs text-muted-foreground">
                      {def.label} ({def.unit})
                    </Label>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min={def.min}
                        max={def.max}
                        step={def.step}
                        placeholder={String(def.min)}
                        defaultValue={minVal}
                        onBlur={(e) => handleSpecChange(def.key, "min", e.target.value)}
                        className="w-full"
                        aria-label={`Minimum ${def.label}`}
                      />
                      <span className="text-muted-foreground">–</span>
                      <Input
                        type="number"
                        min={def.min}
                        max={def.max}
                        step={def.step}
                        placeholder={String(def.max)}
                        defaultValue={maxVal}
                        onBlur={(e) => handleSpecChange(def.key, "max", e.target.value)}
                        className="w-full"
                        aria-label={`Maximum ${def.label}`}
                      />
                    </div>
                  </div>
                );
              }
              if (def.type === "select") {
                const value = searchParams.get(`spec_${def.key}`) ?? "";
                return (
                  <div key={def.key} className="flex flex-col gap-1">
                    <Label className="text-xs text-muted-foreground">{def.label}</Label>
                    <Select
                      value={value}
                      onChange={(e) => handleSpecChange(def.key, null, e.target.value)}
                      aria-label={def.label}
                    >
                      <option value="">Any</option>
                      {def.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </Select>
                  </div>
                );
              }
              const checked = searchParams.get(`spec_${def.key}`) === "true";
              return (
                <label key={def.key} className="flex items-center gap-2 pt-5 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => handleSpecChange(def.key, null, e.target.checked ? "true" : "")}
                    className="h-4 w-4 rounded border-input accent-primary"
                  />
                  {def.label}
                </label>
              );
            })}
          </Container>
        </div>
      )}
    </div>
  );
}
