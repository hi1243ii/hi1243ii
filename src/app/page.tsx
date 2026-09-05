import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ListingCard } from "@/components/ListingCard";
import type { ListingSummary } from "@/types/listing";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, featuredListings] = await Promise.all([
    prisma.equipmentCategory.findMany({ orderBy: { name: "asc" } }),
    prisma.equipmentListing.findMany({
      where: { status: "ACTIVE" },
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        photos: { orderBy: { position: "asc" } },
        owner: { select: { id: true, name: true, companyName: true, isVerified: true } },
        reviews: { select: { rating: true } },
      },
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 px-8 py-16 text-white">
        <h1 className="max-w-2xl text-4xl font-bold sm:text-5xl">
          Rent construction equipment from local suppliers, by the day, week, or month.
        </h1>
        <p className="mt-4 max-w-xl text-brand-50">
          Excavators, skid steers, generators, scaffolding, aerial lifts, and more — booked and
          insured in minutes.
        </p>
        <Link
          href="/listings"
          className="mt-8 inline-block rounded-md bg-white px-6 py-3 font-semibold text-brand-700 hover:bg-brand-50"
        >
          Browse Equipment
        </Link>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Categories</h2>
        <CategoryFilter categories={categories} />
      </section>

      <section className="mt-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recently Listed</h2>
          <Link href="/listings" className="text-sm font-medium text-brand-700 hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing as unknown as ListingSummary} />
          ))}
        </div>
      </section>
    </div>
  );
}
