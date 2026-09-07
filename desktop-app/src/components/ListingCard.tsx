import Link from "next/link";
import { ImageOff, ShieldCheck, Star } from "lucide-react";

import { formatCurrency } from "@/lib/pricing";
import { Badge } from "@/components/ui/badge";
import type { Listing } from "@/types";

export function ListingCard({ listing }: { listing: Listing }) {
  const photo = listing.photos[0];
  const avgRating =
    listing.reviews.length > 0
      ? listing.reviews.reduce((sum, r) => sum + r.rating, 0) / listing.reviews.length
      : 0;

  return (
    <Link
      href={`/listing?id=${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated"
    >
      <div className="relative flex h-40 w-full items-center justify-center bg-muted text-muted-foreground">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element -- static export, no image optimizer server
          <img src={photo.url} alt={photo.altText ?? listing.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1">
            <ImageOff className="h-5 w-5" aria-hidden />
            <span className="text-xs">No photo yet</span>
          </div>
        )}
        <Badge variant="default" className="absolute left-2 top-2 bg-card/90 text-foreground">
          {listing.category.name}
        </Badge>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="font-display text-base font-semibold leading-snug text-foreground">
          {listing.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {listing.city}, {listing.state}
        </p>
        {listing.owner.isVerified && (
          <p className="flex items-center gap-1 text-xs font-medium text-success">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
            Verified supplier
          </p>
        )}
        {avgRating > 0 && (
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" aria-hidden />
            {avgRating.toFixed(1)} ({listing.reviews.length})
          </p>
        )}
        <div className="mt-auto flex items-baseline gap-1 pt-2">
          <span className="text-lg font-bold text-foreground">{formatCurrency(listing.dailyRate)}</span>
          <span className="text-sm text-muted-foreground">/ day</span>
        </div>
      </div>
    </Link>
  );
}
