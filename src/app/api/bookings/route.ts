import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createBookingSchema } from "@/lib/validators";
import { calculateRentalTotal, rangesOverlap } from "@/lib/pricing";

// GET /api/bookings?renterId=...&listingId=...
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const renterId = searchParams.get("renterId") ?? undefined;
  const listingId = searchParams.get("listingId") ?? undefined;

  const bookings = await prisma.booking.findMany({
    where: { renterId, listingId },
    include: {
      listing: { include: { photos: { take: 1 }, category: true } },
      renter: { select: { id: true, name: true } },
    },
    orderBy: { startDate: "desc" },
  });

  return NextResponse.json({ bookings });
}

// POST /api/bookings — create a booking after checking for date conflicts
export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = createBookingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { listingId, renterId, startDate, endDate, deliveryRequired, notes } = parsed.data;

  const listing = await prisma.equipmentListing.findUnique({
    where: { id: listingId },
    include: { availability: true },
  });

  if (!listing || listing.status !== "ACTIVE") {
    return NextResponse.json({ error: "Listing is not available for booking" }, { status: 404 });
  }

  const hasConflict = listing.availability.some((block) =>
    rangesOverlap(startDate, endDate, block.startDate, block.endDate)
  );

  if (hasConflict) {
    return NextResponse.json(
      { error: "Selected dates overlap with an existing booking or block" },
      { status: 409 }
    );
  }

  const totalPrice = calculateRentalTotal({
    startDate,
    endDate,
    dailyRate: Number(listing.dailyRate),
    weeklyRate: listing.weeklyRate ? Number(listing.weeklyRate) : null,
    monthlyRate: listing.monthlyRate ? Number(listing.monthlyRate) : null,
  });

  const booking = await prisma.booking.create({
    data: {
      listingId,
      renterId,
      startDate,
      endDate,
      totalPrice,
      deliveryRequired,
      notes,
      status: "PENDING",
    },
  });

  await prisma.availabilityBlock.create({
    data: {
      listingId,
      startDate,
      endDate,
      reason: "BOOKED",
      bookingId: booking.id,
    },
  });

  return NextResponse.json({ booking }, { status: 201 });
}
