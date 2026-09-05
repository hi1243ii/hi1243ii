import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]),
});

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      listing: { include: { photos: { take: 1 }, owner: { select: { name: true, phone: true } } } },
      renter: { select: { id: true, name: true, phone: true } },
      review: true,
    },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json({ booking });
}

// PATCH /api/bookings/[id] — owner confirms/cancels, or renter cancels
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const booking = await prisma.booking.update({
    where: { id: params.id },
    data: { status: parsed.data.status },
  });

  if (parsed.data.status === "CANCELLED") {
    await prisma.availabilityBlock.deleteMany({ where: { bookingId: booking.id } });
  }

  return NextResponse.json({ booking });
}
