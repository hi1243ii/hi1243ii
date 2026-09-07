import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/session — the app has no real auth yet, so every client (web and
// desktop) acts as the first seeded renter, same convention as /bookings.
// Replace with real session lookup once auth exists.
export async function GET() {
  const renter = await prisma.user.findFirst({ where: { role: "RENTER" } });

  if (!renter) {
    return NextResponse.json({ error: "No renter accounts yet. Run the seed script." }, { status: 404 });
  }

  return NextResponse.json({ renterId: renter.id, renterName: renter.name });
}
