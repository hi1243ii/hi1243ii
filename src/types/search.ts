import type { ListingSummary } from "@/types/listing";

export interface SearchListing extends ListingSummary {
  latitude: number | null;
  longitude: number | null;
  distanceMi?: number;
}
