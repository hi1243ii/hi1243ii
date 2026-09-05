import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const listing = await prisma.equipmentListing.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      photos: { orderBy: { position: "asc" } },
      owner: { select: { id: true, name: true, companyName: true, isVerified: true, phone: true } },
      availability: true,
      reviews: {
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  return NextResponse.json({ listing });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();

  const listing = await prisma.equipmentListing.update({
    where: { id: params.id },
    data: body,
  });

  return NextResponse.json({ listing });
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  await prisma.equipmentListing.update({
    where: { id: params.id },
    data: { status: "INACTIVE" },
  });

  return NextResponse.json({ success: true });
}
