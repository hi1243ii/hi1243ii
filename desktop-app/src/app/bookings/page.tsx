"use client";

import * as React from "react";
import Link from "next/link";
import { WifiOff } from "lucide-react";

import { fetchBookings, fetchDemoSession } from "@/lib/api";
import { useOnline } from "@/lib/online";
import { formatCurrency } from "@/lib/pricing";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Booking } from "@/types";

const STATUS_VARIANT: Record<Booking["status"], "default" | "primary" | "success" | "destructive"> = {
  PENDING: "default",
  CONFIRMED: "primary",
  COMPLETED: "success",
  CANCELLED: "destructive",
};

export default function BookingsPage() {
  const online = useOnline();
  const [bookings, setBookings] = React.useState<Booking[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!online) {
      setError("Booking history needs a connection — it isn't cached on this device.");
      setBookings([]);
      return;
    }
    fetchDemoSession()
      .then((session) => fetchBookings(session.renterId))
      .then((data) => setBookings(data.bookings))
      .catch(() => {
        setError("Couldn't load your bookings. Check your connection and try again.");
        setBookings([]);
      });
  }, [online]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-semibold text-foreground">My Bookings</h1>

      {!online && (
        <p className="flex items-center gap-1.5 rounded-md bg-warning/20 px-3 py-2 text-xs text-warning-foreground">
          <WifiOff className="h-3.5 w-3.5" aria-hidden />
          You&apos;re offline — booking history isn&apos;t available without a connection.
        </p>
      )}

      {bookings === null ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : error && bookings.length === 0 ? (
        <p className="text-sm text-muted-foreground">{error}</p>
      ) : bookings.length === 0 ? (
        <p className="text-sm text-muted-foreground">No bookings yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
            >
              <div>
                <Link href={`/listing?id=${booking.listing.id}`} className="font-semibold text-foreground hover:underline">
                  {booking.listing.title}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {new Date(booking.startDate).toLocaleDateString()} –{" "}
                  {new Date(booking.endDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant={STATUS_VARIANT[booking.status]}>{booking.status}</Badge>
                <span className="font-semibold text-foreground">{formatCurrency(booking.totalPrice)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
