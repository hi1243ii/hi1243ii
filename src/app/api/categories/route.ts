import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/categories — used by the desktop app's category filter.
export async function GET() {
  const categories = await prisma.equipmentCategory.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });

  return NextResponse.json({ categories });
}
