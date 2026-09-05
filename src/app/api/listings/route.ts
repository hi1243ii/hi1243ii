import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createListingSchema } from "@/lib/validators";

// GET /api/listings?category=excavators&city=Denver&minRate=100&maxRate=500
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const city = searchParams.get("city");
  const minRate = searchParams.get("minRate");
  const maxRate = searchParams.get("maxRate");

  const listings = await prisma.equipmentListing.findMany({
    where: {
      status: "ACTIVE",
      category: category ? { slug: category } : undefined,
      city: city ? { equals: city, mode: "insensitive" } : undefined,
      dailyRate: {
        gte: minRate ? Number(minRate) : undefined,
        lte: maxRate ? Number(maxRate) : undefined,
      },
    },
    include: {
      category: true,
      photos: { orderBy: { position: "asc" } },
      owner: { select: { id: true, name: true, companyName: true, isVerified: true } },
      reviews: { select: { rating: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ listings });
}

// POST /api/listings — create a new equipment listing
export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = createListingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { photoUrls, ...data } = parsed.data;

  const listing = await prisma.equipmentListing.create({
    data: {
      ...data,
      photos: photoUrls
        ? { create: photoUrls.map((url, position) => ({ url, position })) }
        : undefined,
    },
    include: { photos: true, category: true },
  });

  return NextResponse.json({ listing }, { status: 201 });
}
