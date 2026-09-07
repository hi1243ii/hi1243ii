"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateRentalTotal, formatCurrency, rangesOverlap } from "@/lib/pricing";
import { cn } from "@/lib/cn";

export interface AvailabilityBlockRange {
  startDate: string;
  endDate: string;
}

export function BookingWidget({
  listingId,
  dailyRate,
  weeklyRate,
  monthlyRate,
  depositAmount,
  deliveryFeeAmount,
  damageWaiverPct,
  availability,
}: {
  listingId: string;
  dailyRate: number;
  weeklyRate: number | null;
  monthlyRate: number | null;
  depositAmount: number | null;
  deliveryFeeAmount: number | null;
  damageWaiverPct: number | null;
  availability: AvailabilityBlockRange[];
}) {
  const router = useRouter();
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [fulfillment, setFulfillment] = React.useState<"pickup" | "delivery">("pickup");
  const [damageWaiverAccepted, setDamageWaiverAccepted] = React.useState(true);

  const parsedStart = startDate ? new Date(startDate) : null;
  const parsedEnd = endDate ? new Date(endDate) : null;
  const validRange = !!parsedStart && !!parsedEnd && parsedEnd > parsedStart;

  const conflict =
    validRange &&
    availability.some((block) =>
      rangesOverlap(parsedStart!, parsedEnd!, new Date(block.startDate), new Date(block.endDate)),
    );

  const subtotal = validRange
    ? calculateRentalTotal({ startDate: parsedStart!, endDate: parsedEnd!, dailyRate, weeklyRate, monthlyRate })
    : null;
  const deliveryFee = fulfillment === "delivery" ? deliveryFeeAmount ?? 0 : 0;
  const damageWaiverFee =
    subtotal !== null && damageWaiverAccepted ? Math.round(subtotal * (damageWaiverPct ?? 0) * 100) / 100 : 0;
  const total = subtotal !== null ? subtotal + deliveryFee + damageWaiverFee : null;

  const canContinue = validRange && !conflict;

  function handleContinue() {
    const params = new URLSearchParams({
      start: startDate,
      end: endDate,
      fulfillment,
      waiver: damageWaiverAccepted ? "1" : "0",
    });
    router.push(`/listings/${listingId}/book?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 shadow-card">
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-foreground">{formatCurrency(dailyRate)}</span>
        <span className="text-sm text-muted-foreground">/ day</span>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {weeklyRate && <span>{formatCurrency(weeklyRate)} / week</span>}
        {monthlyRate && <span>{formatCurrency(monthlyRate)} / month</span>}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <Label htmlFor="bw-start" className="text-xs">
            Start date
          </Label>
          <Input
            id="bw-start"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="bw-end" className="text-xs">
            End date
          </Label>
          <Input id="bw-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
      </div>

      {conflict && (
        <p className="text-xs text-destructive">Those dates overlap an existing booking. Try another range.</p>
      )}

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setFulfillment("pickup")}
          className={cn(
            "flex flex-col items-center gap-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
            fulfillment === "pickup"
              ? "border-primary bg-primary/10 text-foreground"
              : "border-border text-muted-foreground hover:border-primary/50",
          )}
        >
          <ShieldCheck className="h-4 w-4" aria-hidden />
          Pickup
        </button>
        <button
          type="button"
          onClick={() => setFulfillment("delivery")}
          className={cn(
            "flex flex-col items-center gap-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
            fulfillment === "delivery"
              ? "border-primary bg-primary/10 text-foreground"
              : "border-border text-muted-foreground hover:border-primary/50",
          )}
        >
          <Truck className="h-4 w-4" aria-hidden />
          Delivery
          {deliveryFeeAmount ? (
            <span className="text-[10px] text-muted-foreground">+{formatCurrency(deliveryFeeAmount)}</span>
          ) : null}
        </button>
      </div>

      {damageWaiverPct ? (
        <label className="flex items-start gap-2 text-xs text-foreground">
          <input
            type="checkbox"
            checked={damageWaiverAccepted}
            onChange={(e) => setDamageWaiverAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-input accent-primary"
          />
          <span>
            Add damage waiver ({Math.round(damageWaiverPct * 100)}% of rental cost) — waives your
            liability for accidental damage.
          </span>
        </label>
      ) : null}

      {subtotal !== null && (
        <div className="flex flex-col gap-1.5 border-t border-border pt-3 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Rental subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {deliveryFee > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery fee</span>
              <span>{formatCurrency(deliveryFee)}</span>
            </div>
          )}
          {damageWaiverFee > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>Damage waiver</span>
              <span>{formatCurrency(damageWaiverFee)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-border pt-1.5 font-semibold text-foreground">
            <span>Total</span>
            <span>{formatCurrency(total!)}</span>
          </div>
          {depositAmount ? (
            <p className="text-xs text-muted-foreground">
              Plus a refundable {formatCurrency(depositAmount)} deposit, collected at pickup/delivery.
            </p>
          ) : null}
        </div>
      )}

      <Button size="lg" disabled={!canContinue} onClick={handleContinue}>
        {validRange ? "Continue to Checkout" : "Select your dates"}
      </Button>
    </div>
  );
}
