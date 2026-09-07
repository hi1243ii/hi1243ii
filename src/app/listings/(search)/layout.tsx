import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { FilterBar } from "@/components/search/FilterBar";

export const dynamic = "force-dynamic";

export default async function ListingsSearchLayout({ children }: { children: React.ReactNode }) {
  const categories = await prisma.equipmentCategory.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });

  return (
    <div>
      <Suspense fallback={<div className="h-[4.5rem] border-b border-border bg-card" />}>
        <FilterBar categories={categories} />
      </Suspense>
      {children}
    </div>
  );
}
