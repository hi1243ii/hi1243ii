export type SpecFilterDef =
  | { key: string; label: string; unit: string; type: "range"; min: number; max: number; step?: number }
  | { key: string; label: string; type: "boolean" }
  | { key: string; label: string; type: "select"; options: string[] };

/**
 * Curated per-category spec filters. Equipment specs are freeform JSON on the
 * listing (they vary by category), so filterable fields are hand-mapped to
 * the keys the seed data / listing wizard actually populate.
 */
export const SPEC_FILTERS: Record<string, SpecFilterDef[]> = {
  excavators: [
    { key: "operatingWeightLbs", label: "Operating weight", unit: "lbs", type: "range", min: 0, max: 60000, step: 500 },
    { key: "digDepthFt", label: "Dig depth", unit: "ft", type: "range", min: 0, max: 30, step: 0.5 },
    { key: "horsepower", label: "Horsepower", unit: "hp", type: "range", min: 0, max: 250, step: 5 },
    { key: "engineHours", label: "Engine hours", unit: "hrs", type: "range", min: 0, max: 5000, step: 50 },
  ],
  "skid-steers": [
    { key: "ratedOperatingCapacityLbs", label: "Rated operating capacity", unit: "lbs", type: "range", min: 0, max: 5000, step: 100 },
    { key: "horsepower", label: "Horsepower", unit: "hp", type: "range", min: 0, max: 150, step: 5 },
    { key: "engineHours", label: "Engine hours", unit: "hrs", type: "range", min: 0, max: 5000, step: 50 },
  ],
  generators: [
    { key: "fuelType", label: "Fuel type", type: "select", options: ["Diesel", "Gasoline"] },
    { key: "engineHours", label: "Engine hours", unit: "hrs", type: "range", min: 0, max: 5000, step: 25 },
  ],
  scaffolding: [
    { key: "maxHeightFt", label: "Max height", unit: "ft", type: "range", min: 0, max: 100, step: 5 },
    { key: "coverageSqFt", label: "Coverage", unit: "sq ft", type: "range", min: 0, max: 2000, step: 100 },
    { key: "includesGuardrails", label: "Includes guardrails", type: "boolean" },
  ],
  "aerial-lifts": [
    { key: "platformHeightFt", label: "Platform height", unit: "ft", type: "range", min: 0, max: 80, step: 5 },
    { key: "liftCapacityLbs", label: "Lift capacity", unit: "lbs", type: "range", min: 0, max: 2000, step: 50 },
    { key: "engineHours", label: "Engine hours", unit: "hrs", type: "range", min: 0, max: 5000, step: 25 },
  ],
  "compaction-equipment": [
    { key: "weightLbs", label: "Weight", unit: "lbs", type: "range", min: 0, max: 3000, step: 50 },
    { key: "centrifugalForceLbs", label: "Centrifugal force", unit: "lbs", type: "range", min: 0, max: 30000, step: 500 },
    { key: "engineHours", label: "Engine hours", unit: "hrs", type: "range", min: 0, max: 5000, step: 25 },
  ],
};

export function specFiltersForCategory(slug: string | undefined): SpecFilterDef[] {
  if (!slug) return [];
  return SPEC_FILTERS[slug] ?? [];
}
