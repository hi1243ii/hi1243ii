import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/pricing";
import { StarRating } from "@/components/StarRating";
import { AvailabilityCalendar } from "@/components/AvailabilityCalendar";
import { BookingForm } from "@/components/BookingForm";
import { ReviewList } from "@/components/ReviewList";

export const dynamic = "force-dynamic";

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = await prisma.equipmentListing.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      photos: { orderBy: { position: "asc" } },
      owner: { select: { id: true, name: true, companyName: true, isVerified: true, phone: true } },
      availability: true,
      reviews: {
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!listing) {
    notFound();
  }

  const avgRating =
    listing.reviews.length > 0
      ? listing.reviews.reduce((sum, r) => sum + r.rating, 0) / listing.reviews.length
      : 0;

  const specs = (listing.specs as Record<string, string | number | boolean> | null) ?? {};

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-2">
            {listing.photos.map((photo) => (
              <div key={photo.id} className="relative h-56 overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={photo.url}
                  alt={photo.altText ?? listing.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 480px, 100vw"
                />
              </div>
            ))}
          </div>

          <div className="mt-6">
            <span className="rounded bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700">
              {listing.category.name}
            </span>
            <h1 className="mt-2 text-2xl font-bold text-gray-900">{listing.title}</h1>
            <p className="text-sm text-gray-500">
              {listing.city}, {listing.state} {listing.zipCode}
            </p>
            <div className="mt-2">
              <StarRating rating={avgRating} count={listing.reviews.length} />
            </div>
            <p className="mt-4 text-gray-700">{listing.description}</p>
          </div>

          {Object.keys(specs).length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 text-lg font-semibold text-gray-900">Specifications</h2>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 rounded-lg border border-gray-200 p-4 sm:grid-cols-3">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-xs uppercase tracking-wide text-gray-400">
                      {key.replace(/([A-Z])/g, " $1")}
                    </dt>
                    <dd className="font-medium text-gray-900">{String(value)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="mt-8">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">Availability</h2>
            <AvailabilityCalendar blocks={listing.availability} />
          </div>

          <div className="mt-8">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">Reviews</h2>
            <ReviewList reviews={listing.reviews} />
          </div>
        </div>

        <aside className="flex flex-col gap-6">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(listing.dailyRate)}
              </span>
              <span className="text-sm text-gray-500">/ day</span>
            </div>
            {listing.weeklyRate && (
              <p className="text-sm text-gray-500">{formatCurrency(listing.weeklyRate)} / week</p>
            )}
            {listing.monthlyRate && (
              <p className="text-sm text-gray-500">{formatCurrency(listing.monthlyRate)} / month</p>
            )}
            {listing.depositAmount && (
              <p className="mt-2 text-xs text-gray-400">
                Refundable deposit: {formatCurrency(listing.depositAmount)}
              </p>
            )}
          </div>

          <BookingForm
            listingId={listing.id}
            dailyRate={Number(listing.dailyRate)}
            weeklyRate={listing.weeklyRate ? Number(listing.weeklyRate) : null}
            monthlyRate={listing.monthlyRate ? Number(listing.monthlyRate) : null}
          />

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="font-semibold text-gray-900">Supplier</h3>
            <p className="mt-1 text-sm text-gray-700">
              {listing.owner.companyName ?? listing.owner.name}
              {listing.owner.isVerified && (
                <span className="ml-2 rounded bg-green-50 px-1.5 py-0.5 text-xs text-green-700">
                  Verified
                </span>
              )}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
