import { differenceInCalendarDays } from "date-fns";

/**
 * Picks the cheapest applicable rate combination for a rental span.
 * Falls back to the daily rate when weekly/monthly rates aren't set.
 */
export function calculateRentalTotal({
  startDate,
  endDate,
  dailyRate,
  weeklyRate,
  monthlyRate,
}: {
  startDate: Date;
  endDate: Date;
  dailyRate: number;
  weeklyRate?: number | null;
  monthlyRate?: number | null;
}): number {
  const days = Math.max(1, differenceInCalendarDays(endDate, startDate));

  if (monthlyRate && days >= 28) {
    const months = Math.floor(days / 30);
    const remainderDays = days % 30;
    return months * monthlyRate + remainderDays * dailyRate;
  }

  if (weeklyRate && days >= 7) {
    const weeks = Math.floor(days / 7);
    const remainderDays = days % 7;
    return weeks * weeklyRate + remainderDays * dailyRate;
  }

  return days * dailyRate;
}

export function formatCurrency(amount: number | string | { toString(): string }): string {
  const value = typeof amount === "number" ? amount : parseFloat(amount.toString());
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

/** True when [aStart, aEnd) overlaps [bStart, bEnd). */
export function rangesOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && bStart < aEnd;
}
