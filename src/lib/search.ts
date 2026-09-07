import { prisma } from "@/lib/prisma";
import { haversineMiles } from "@/lib/geo";
import { specFiltersForCategory } from "@/lib/specFilters";
import { rangesOverlap } from "@/lib/pricing";

export type SearchParamsShape = Record<string, string | string[] | undefined>;

export async function searchListings(searchParams: SearchParamsShape) {
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined;
  const q = typeof searchParams.q === "string" ? searchParams.q.trim() : undefined;
  const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : undefined;
  const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined;
  const start = searchParams.start ? new Date(String(searchParams.start)) : undefined;
  const end = searchParams.end ? new Date(String(searchParams.end)) : undefined;
  const lat = searchParams.lat ? Number(searchParams.lat) : undefined;
  const lng = searchParams.lng ? Number(searchParams.lng) : undefined;
  const radius = searchParams.radius ? Number(searchParams.radius) : 50;

  const candidates = await prisma.equipmentListing.findMany({
    where: {
      status: "ACTIVE",
      category: category ? { slug: category } : undefined,
      dailyRate: {
        gte: minPrice,
        lte: maxPrice,
      },
      OR: q
        ? [
            { title: { contains: q, mode: "insensitive" } },
            { city: { contains: q, mode: "insensitive" } },
            { state: { contains: q, mode: "insensitive" } },
            { make: { contains: q, mode: "insensitive" } },
            { model: { contains: q, mode: "insensitive" } },
          ]
        : undefined,
    },
    include: {
      category: true,
      photos: { orderBy: { position: "asc" } },
      owner: { select: { id: true, name: true, companyName: true, isVerified: true } },
      reviews: { select: { rating: true } },
      availability: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const specDefs = specFiltersForCategory(category);
  const hasDateRange = !!start && !!end && end > start;

  const filtered = candidates.filter((listing) => {
    if (hasDateRange) {
      const conflict = listing.availability.some((block) =>
        rangesOverlap(start!, end!, block.startDate, block.endDate),
      );
      if (conflict) return false;
    }

    const specs = (listing.specs as Record<string, string | number | boolean> | null) ?? {};
    for (const def of specDefs) {
      if (def.type === "range") {
        const minParam = searchParams[`spec_${def.key}_min`];
        const maxParam = searchParams[`spec_${def.key}_max`];
        if (minParam || maxParam) {
          const value = typeof specs[def.key] === "number" ? (specs[def.key] as number) : undefined;
          if (value === undefined) return false;
          if (minParam && value < Number(minParam)) return false;
          if (maxParam && value > Number(maxParam)) return false;
        }
      } else if (def.type === "boolean") {
        const param = searchParams[`spec_${def.key}`];
        if (param === "true" && specs[def.key] !== true) return false;
      } else if (def.type === "select") {
        const param = searchParams[`spec_${def.key}`];
        if (param && specs[def.key] !== param) return false;
      }
    }

    return true;
  });

  const withDistance = filtered.map((listing) => {
    const distanceMi =
      lat !== undefined && lng !== undefined && listing.latitude != null && listing.longitude != null
        ? haversineMiles(lat, lng, listing.latitude, listing.longitude)
        : undefined;
    return { ...listing, distanceMi };
  });

  if (lat !== undefined && lng !== undefined) {
    const withinRadius = withDistance.filter((l) => l.distanceMi === undefined || l.distanceMi <= radius);
    withinRadius.sort((a, b) => (a.distanceMi ?? Infinity) - (b.distanceMi ?? Infinity));
    return withinRadius;
  }

  return withDistance;
}

export type SearchListingResult = Awaited<ReturnType<typeof searchListings>>[number];
