import { ShieldCheck } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/StarRating";

export function OwnerCard({
  name,
  companyName,
  isVerified,
  insuranceVerified,
  listingCount,
  avgRating,
  reviewCount,
  memberSince,
}: {
  name: string;
  companyName: string | null;
  isVerified: boolean;
  insuranceVerified: boolean;
  listingCount: number;
  avgRating: number;
  reviewCount: number;
  memberSince: Date;
}) {
  const displayName = companyName ?? name;
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 pt-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary font-display text-base font-bold text-primary-foreground">
            {initials}
          </div>
          <div>
            <p className="flex items-center gap-1.5 font-display text-base font-semibold text-foreground">
              {displayName}
              {isVerified && <ShieldCheck className="h-4 w-4 text-success" aria-hidden />}
            </p>
            <p className="text-xs text-muted-foreground">
              Supplier since {memberSince.getFullYear()} &middot; {listingCount} listing
              {listingCount === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        {reviewCount > 0 && <StarRating rating={avgRating} count={reviewCount} />}

        <dl className="grid grid-cols-2 gap-3 border-t border-border pt-3 text-xs">
          <div>
            <dt className="text-muted-foreground">Identity</dt>
            <dd className={isVerified ? "font-medium text-success" : "text-muted-foreground"}>
              {isVerified ? "Verified" : "Not verified"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Insurance</dt>
            <dd className={insuranceVerified ? "font-medium text-success" : "text-muted-foreground"}>
              {insuranceVerified ? "Verified" : "Not on file"}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
