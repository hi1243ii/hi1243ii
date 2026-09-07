import Image from "next/image";
import Link from "next/link";
import { ImageOff, ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/lib/pricing";
import { StarRating } from "@/components/StarRating";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import type { ListingSummary } from "@/types/listing";

export function ListingCard({
  listing,
  distanceMi,
  className,
  onMouseEnter,
  onMouseLeave,
}: {
  listing: ListingSummary;
  distanceMi?: number;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  const avgRating =
    listing.reviews.length > 0
      ? listing.reviews.reduce((sum, r) => sum + r.rating, 0) / listing.reviews.length
      : 0;
  const photo = listing.photos[0];

  return (
    <Link
      href={`/listings/${listing.id}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated",
        className,
      )}
    >
      <div className="relative h-48 w-full bg-muted">
        {photo ? (
          <Image
            src={photo.url}
            alt={photo.altText ?? listing.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 320px, 100vw"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-muted-foreground">
            <ImageOff className="h-6 w-6" aria-hidden />
            <span className="text-xs">No photo yet</span>
          </div>
        )}
        <Badge variant="default" className="absolute left-2 top-2 bg-card/90 text-foreground">
          {listing.category.name}
        </Badge>
        {typeof distanceMi === "number" && (
          <Badge variant="default" className="absolute right-2 top-2 bg-card/90 text-foreground">
            {distanceMi < 1 ? "< 1 mi" : `${distanceMi.toFixed(0)} mi`}
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold leading-snug text-foreground">
            {listing.title}
          </h3>
        </div>
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          {listing.city}, {listing.state}
        </p>
        {listing.owner.isVerified && (
          <p className="flex items-center gap-1 text-xs font-medium text-success">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
            Verified supplier
          </p>
        )}
        <StarRating rating={avgRating} count={listing.reviews.length} />
        <div className="mt-auto flex items-baseline gap-1 pt-2">
          <span className="text-lg font-bold text-foreground">
            {formatCurrency(listing.dailyRate)}
          </span>
          <span className="text-sm text-muted-foreground">/ day</span>
        </div>
      </div>
    </Link>
  );
}
