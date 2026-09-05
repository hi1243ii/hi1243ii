import { prisma } from "@/lib/prisma";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ListingCard } from "@/components/ListingCard";
import type { ListingSummary } from "@/types/listing";

export const dynamic = "force-dynamic";

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: { category?: string; city?: string };
}) {
  const [categories, listings] = await Promise.all([
    prisma.equipmentCategory.findMany({ orderBy: { name: "asc" } }),
    prisma.equipmentListing.findMany({
      where: {
        status: "ACTIVE",
        category: searchParams.category ? { slug: searchParams.category } : undefined,
        city: searchParams.city ? { equals: searchParams.city, mode: "insensitive" } : undefined,
      },
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        photos: { orderBy: { position: "asc" } },
        owner: { select: { id: true, name: true, companyName: true, isVerified: true } },
        reviews: { select: { rating: true } },
      },
    }),
  ]);

  const activeCategory = categories.find((c) => c.slug === searchParams.category);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">Browse Equipment</h1>
      <p className="mt-1 text-sm text-gray-500">
        {listings.length} listing{listings.length === 1 ? "" : "s"}
        {activeCategory ? ` in ${activeCategory.name}` : ""}
      </p>

      <div className="mt-6">
        <CategoryFilter categories={categories} activeSlug={searchParams.category} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing as unknown as ListingSummary} />
        ))}
        {listings.length === 0 && (
          <p className="col-span-full text-sm text-gray-500">
            No equipment matches these filters yet.
          </p>
        )}
      </div>
    </div>
  );
}
