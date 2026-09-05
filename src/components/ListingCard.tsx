import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/pricing";
import { StarRating } from "@/components/StarRating";
import type { ListingSummary } from "@/types/listing";

export function ListingCard({ listing }: { listing: ListingSummary }) {
  const avgRating =
    listing.reviews.length > 0
      ? listing.reviews.reduce((sum, r) => sum + r.rating, 0) / listing.reviews.length
      : 0;
  const photo = listing.photos[0];

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative h-48 w-full bg-gray-100">
        {photo && (
          <Image
            src={photo.url}
            alt={photo.altText ?? listing.title}
            fill
            className="object-cover transition group-hover:scale-105"
            sizes="(min-width: 1024px) 320px, 100vw"
          />
        )}
        <span className="absolute left-2 top-2 rounded bg-white/90 px-2 py-1 text-xs font-medium text-gray-700">
          {listing.category.name}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold text-gray-900">{listing.title}</h3>
        <p className="text-sm text-gray-500">
          {listing.city}, {listing.state}
        </p>
        <StarRating rating={avgRating} count={listing.reviews.length} />
        <div className="mt-auto flex items-baseline gap-1 pt-2">
          <span className="text-lg font-bold text-brand-700">
            {formatCurrency(listing.dailyRate)}
          </span>
          <span className="text-sm text-gray-500">/ day</span>
        </div>
      </div>
    </Link>
  );
}
