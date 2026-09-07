import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/pricing";
import { StarRating } from "@/components/StarRating";
import { AvailabilityCalendar } from "@/components/AvailabilityCalendar";
import { ReviewList } from "@/components/ReviewList";
import { PhotoGallery } from "@/components/listing/PhotoGallery";
import { TrustBadges } from "@/components/listing/TrustBadges";
import { OwnerCard } from "@/components/listing/OwnerCard";
import { BookingWidget } from "@/components/listing/BookingWidget";
import { MaintenanceLog } from "@/components/listing/MaintenanceLog";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = await prisma.equipmentListing.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      photos: { orderBy: { position: "asc" } },
      owner: {
        select: {
          id: true,
          name: true,
          companyName: true,
          isVerified: true,
          insuranceVerified: true,
          certifications: true,
          createdAt: true,
        },
      },
      availability: true,
      reviews: {
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
      maintenanceLogs: true,
    },
  });

  if (!listing) {
    notFound();
  }

  const [ownerListingCount, ownerReviews] = await Promise.all([
    prisma.equipmentListing.count({ where: { ownerId: listing.owner.id, status: "ACTIVE" } }),
    prisma.review.findMany({ where: { listing: { ownerId: listing.owner.id } }, select: { rating: true } }),
  ]);

  const avgRating =
    listing.reviews.length > 0
      ? listing.reviews.reduce((sum, r) => sum + r.rating, 0) / listing.reviews.length
      : 0;
  const ownerAvgRating =
    ownerReviews.length > 0
      ? ownerReviews.reduce((sum, r) => sum + r.rating, 0) / ownerReviews.length
      : 0;

  const specs = (listing.specs as Record<string, string | number | boolean> | null) ?? {};

  return (
    <Container className="py-8">
      <PhotoGallery
        photos={listing.photos.map((p) => ({ id: p.id, url: p.url, altText: p.altText }))}
        title={listing.title}
      />

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Badge variant="default">{listing.category.name}</Badge>
          <h1 className="mt-2 font-display text-2xl font-semibold text-foreground sm:text-3xl">
            {listing.title}
          </h1>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            {listing.city}, {listing.state} {listing.zipCode}
          </p>
          <div className="mt-2">
            <StarRating rating={avgRating} count={listing.reviews.length} />
          </div>

          <div className="mt-4">
            <TrustBadges
              isVerified={listing.owner.isVerified}
              insuranceVerified={listing.owner.insuranceVerified}
              certifications={listing.owner.certifications}
            />
          </div>

          <Separator className="my-6" />

          <p className="whitespace-pre-line text-foreground/90">{listing.description}</p>

          {(listing.make || listing.model || listing.year) && (
            <p className="mt-3 text-sm text-muted-foreground">
              {[listing.make, listing.model, listing.year].filter(Boolean).join(" · ")} &middot;{" "}
              {listing.condition.charAt(0) + listing.condition.slice(1).toLowerCase()} condition
            </p>
          )}

          {Object.keys(specs).length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 font-display text-lg font-semibold text-foreground">Specifications</h2>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-3">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                      {key.replace(/([A-Z])/g, " $1")}
                    </dt>
                    <dd className="font-medium text-foreground">
                      {typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="mt-8">
            <h2 className="mb-3 font-display text-lg font-semibold text-foreground">Availability</h2>
            <div className="rounded-lg border border-border bg-card p-4">
              <AvailabilityCalendar blocks={listing.availability} />
            </div>
          </div>

          <div className="mt-8">
            <h2 className="mb-3 font-display text-lg font-semibold text-foreground">
              Maintenance &amp; inspection history
            </h2>
            <MaintenanceLog entries={listing.maintenanceLogs} />
          </div>

          <div className="mt-8">
            <h2 className="mb-3 font-display text-lg font-semibold text-foreground">Reviews</h2>
            <ReviewList reviews={listing.reviews} />
          </div>
        </div>

        <aside className="flex flex-col gap-6">
          <div className="lg:sticky lg:top-20 lg:flex lg:flex-col lg:gap-6">
            <BookingWidget
              listingId={listing.id}
              dailyRate={Number(listing.dailyRate)}
              weeklyRate={listing.weeklyRate ? Number(listing.weeklyRate) : null}
              monthlyRate={listing.monthlyRate ? Number(listing.monthlyRate) : null}
              depositAmount={listing.depositAmount ? Number(listing.depositAmount) : null}
              deliveryFeeAmount={listing.deliveryFeeAmount ? Number(listing.deliveryFeeAmount) : null}
              damageWaiverPct={listing.damageWaiverPct}
              availability={listing.availability.map((b) => ({
                startDate: b.startDate.toISOString(),
                endDate: b.endDate.toISOString(),
              }))}
            />

            <OwnerCard
              name={listing.owner.name}
              companyName={listing.owner.companyName}
              isVerified={listing.owner.isVerified}
              insuranceVerified={listing.owner.insuranceVerified}
              listingCount={ownerListingCount}
              avgRating={ownerAvgRating}
              reviewCount={ownerReviews.length}
              memberSince={listing.owner.createdAt}
            />
          </div>
        </aside>
      </div>
    </Container>
  );
}
