"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ImageOff, ShieldCheck, WifiOff } from "lucide-react";

import { createBooking, fetchDemoSession, fetchListing } from "@/lib/api";
import { cacheViewedListing, getCachedListing } from "@/lib/cache";
import { useOnline } from "@/lib/online";
import { formatCurrency } from "@/lib/pricing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import type { Listing } from "@/types";

function ListingDetail() {
  const online = useOnline();
  const id = useSearchParams().get("id");
  const [listing, setListing] = React.useState<Listing | null>(null);
  const [usingCache, setUsingCache] = React.useState(false);
  const [notFound, setNotFound] = React.useState(false);
  const [renterId, setRenterId] = React.useState<string | null>(null);

  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [deliveryRequired, setDeliveryRequired] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [bookingError, setBookingError] = React.useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = React.useState(false);

  React.useEffect(() => {
    if (!id) return;
    fetchListing(id)
      .then((data) => {
        setListing(data.listing);
        setUsingCache(false);
        cacheViewedListing(data.listing);
      })
      .catch(() => {
        const cached = getCachedListing(id);
        if (cached) {
          setListing(cached);
          setUsingCache(true);
        } else {
          setNotFound(true);
        }
      });
  }, [id]);

  React.useEffect(() => {
    fetchDemoSession()
      .then((s) => setRenterId(s.renterId))
      .catch(() => setRenterId(null));
  }, []);

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    if (!listing || !renterId) return;
    setSubmitting(true);
    setBookingError(null);
    try {
      await createBooking({
        listingId: listing.id,
        renterId,
        startDate,
        endDate,
        deliveryRequired,
      });
      setBookingSuccess(true);
    } catch {
      setBookingError("Couldn't submit that booking request. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!id) return <p className="text-sm text-muted-foreground">No listing selected.</p>;
  if (notFound) return <p className="text-sm text-muted-foreground">Listing not found or unavailable offline.</p>;

  if (!listing) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    );
  }

  const photo = listing.photos[0];
  const specs = listing.specs ?? {};

  return (
    <div className="flex flex-col gap-6">
      <Link href="/" className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to browse
      </Link>

      {usingCache && (
        <p className="flex items-center gap-1.5 rounded-md bg-warning/20 px-3 py-2 text-xs text-warning-foreground">
          <WifiOff className="h-3.5 w-3.5" aria-hidden />
          Showing a cached copy of this listing from your last visit. Availability may be out of date.
        </p>
      )}

      <div className="relative flex h-64 w-full items-center justify-center overflow-hidden rounded-lg bg-muted text-muted-foreground">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo.url} alt={photo.altText ?? listing.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1">
            <ImageOff className="h-6 w-6" aria-hidden />
            <span className="text-sm">No photo yet</span>
          </div>
        )}
      </div>

      <div>
        <Badge>{listing.category.name}</Badge>
        <h1 className="mt-2 font-display text-2xl font-semibold text-foreground">{listing.title}</h1>
        <p className="text-sm text-muted-foreground">
          {listing.city}, {listing.state}
        </p>
        {listing.owner.isVerified && (
          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-success">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
            Verified supplier — {listing.owner.companyName ?? listing.owner.name}
          </p>
        )}
        {listing.description && <p className="mt-4 text-foreground/90">{listing.description}</p>}
      </div>

      {Object.keys(specs).length > 0 && (
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
      )}

      <Card>
        <CardContent className="flex flex-col gap-4 pt-5">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground">{formatCurrency(listing.dailyRate)}</span>
            <span className="text-sm text-muted-foreground">/ day</span>
          </div>

          {!online ? (
            <p className="flex items-center gap-1.5 rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
              <WifiOff className="h-4 w-4" aria-hidden />
              You&apos;re offline. Booking requires a connection to check live availability.
            </p>
          ) : bookingSuccess ? (
            <p className="rounded-md bg-success/10 px-3 py-2 text-sm font-medium text-success">
              Booking request sent! Check My Bookings for status.
            </p>
          ) : (
            <form onSubmit={handleBook} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="ld-start" className="text-xs">
                    Start date
                  </Label>
                  <Input
                    id="ld-start"
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="ld-end" className="text-xs">
                    End date
                  </Label>
                  <Input
                    id="ld-end"
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={deliveryRequired}
                  onChange={(e) => setDeliveryRequired(e.target.checked)}
                  className="h-4 w-4 rounded border-input accent-primary"
                />
                Delivery to jobsite required
              </label>
              {bookingError && <p className="text-xs text-destructive">{bookingError}</p>}
              <Button type="submit" disabled={submitting || !renterId}>
                {submitting ? "Requesting…" : "Request Booking"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ListingPage() {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
      <ListingDetail />
    </Suspense>
  );
}
