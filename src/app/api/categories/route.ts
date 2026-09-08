import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// No `request` param / dynamic APIs used here, so Next.js would otherwise treat
// this as a static route and cache the build-time response indefinitely.
export const dynamic = "force-dynamic";

// GET /api/categories — used by the desktop app's category filter.
export async function GET() {
  const categories = await prisma.equipmentCategory.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });

  return NextResponse.json({ categories });
}
