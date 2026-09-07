import { searchListings } from "@/lib/search";
import { SearchResults } from "@/components/search/SearchResults";
import type { SearchListing } from "@/types/search";

export const dynamic = "force-dynamic";

export default async function ListingsSearchPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const results = await searchListings(searchParams);

  const listings: SearchListing[] = results.map((listing) => ({
    id: listing.id,
    title: listing.title,
    city: listing.city,
    state: listing.state,
    dailyRate: Number(listing.dailyRate),
    weeklyRate: listing.weeklyRate ? Number(listing.weeklyRate) : null,
    condition: listing.condition,
    category: {
      id: listing.category.id,
      name: listing.category.name,
      slug: listing.category.slug,
    },
    photos: listing.photos.map((p) => ({
      id: p.id,
      url: p.url,
      altText: p.altText,
      position: p.position,
    })),
    owner: {
      id: listing.owner.id,
      name: listing.owner.name,
      companyName: listing.owner.companyName,
      isVerified: listing.owner.isVerified,
    },
    reviews: listing.reviews,
    latitude: listing.latitude,
    longitude: listing.longitude,
    distanceMi: listing.distanceMi,
  }));

  return <SearchResults listings={listings} />;
}
