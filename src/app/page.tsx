import Link from "next/link";
import { ArrowRight, HardHat } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ListingCard } from "@/components/ListingCard";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
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
    <div>
      <div className="relative overflow-hidden border-b border-border bg-foreground text-background">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-hazard-stripes" aria-hidden />
        <Container className="py-20">
          <p className="mb-3 flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            <HardHat className="h-4 w-4" aria-hidden />
            EquipRent Marketplace
          </p>
          <h1 className="max-w-2xl font-display text-display-lg font-semibold tracking-tight sm:text-display-xl">
            Rent construction equipment from verified local suppliers.
          </h1>
          <p className="mt-4 max-w-xl text-background/70">
            Excavators, skid steers, generators, scaffolding, and aerial lifts — booked and insured
            in minutes, by the day, week, or month.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/listings">
              Browse Equipment <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Container>
      </div>

      <Container className="py-12">
        <section>
          <h2 className="mb-4 font-display text-xl font-semibold">Categories</h2>
          <CategoryFilter categories={categories} />
        </section>

        <section className="mt-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Recently Listed</h2>
            <Link href="/listings" className="text-sm font-medium text-accent hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing as unknown as ListingSummary} />
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
