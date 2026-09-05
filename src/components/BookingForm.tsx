"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { calculateRentalTotal, formatCurrency } from "@/lib/pricing";

export function BookingForm({
  listingId,
  dailyRate,
  weeklyRate,
  monthlyRate,
}: {
  listingId: string;
  dailyRate: number;
  weeklyRate: number | null;
  monthlyRate: number | null;
}) {
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [deliveryRequired, setDeliveryRequired] = useState(false);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const estimatedTotal =
    startDate && endDate && new Date(endDate) > new Date(startDate)
      ? calculateRentalTotal({
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          dailyRate,
          weeklyRate,
          monthlyRate,
        })
      : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          // Demo renter — replace with the authenticated user's id once auth is wired up.
          renterId: "demo-renter",
          startDate,
          endDate,
          deliveryRequired,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.formErrors?.[0] ?? data.error ?? "Unable to create booking");
        return;
      }

      router.push("/bookings");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4">
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm text-gray-700">
          Start date
          <input
            type="date"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded border border-gray-300 px-2 py-1.5"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-gray-700">
          End date
          <input
            type="date"
            required
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded border border-gray-300 px-2 py-1.5"
          />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={deliveryRequired}
          onChange={(e) => setDeliveryRequired(e.target.checked)}
        />
        Delivery to jobsite required
      </label>

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Notes for the owner
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="rounded border border-gray-300 px-2 py-1.5"
        />
      </label>

      {estimatedTotal !== null && (
        <p className="text-sm text-gray-600">
          Estimated total: <span className="font-semibold text-gray-900">{formatCurrency(estimatedTotal)}</span>
        </p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700 disabled:opacity-50"
      >
        {submitting ? "Requesting..." : "Request Booking"}
      </button>
    </form>
  );
}
