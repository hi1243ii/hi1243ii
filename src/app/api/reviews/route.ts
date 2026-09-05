import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createReviewSchema } from "@/lib/validators";

// GET /api/reviews?listingId=...
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const listingId = searchParams.get("listingId") ?? undefined;

  const reviews = await prisma.review.findMany({
    where: { listingId },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ reviews });
}

// POST /api/reviews — leave a review for a completed booking
export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = createReviewSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { bookingId, authorId, rating, comment } = parsed.data;

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

  if (!booking || booking.renterId !== authorId) {
    return NextResponse.json({ error: "Booking not found for this renter" }, { status: 404 });
  }

  if (booking.status !== "COMPLETED") {
    return NextResponse.json(
      { error: "Reviews can only be left for completed bookings" },
      { status: 400 }
    );
  }

  const review = await prisma.review.create({
    data: {
      bookingId,
      authorId,
      listingId: booking.listingId,
      rating,
      comment,
    },
  });

  return NextResponse.json({ review }, { status: 201 });
}
