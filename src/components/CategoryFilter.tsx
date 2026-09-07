import Link from "next/link";

import { cn } from "@/lib/cn";

export interface CategoryFilterItem {
  id: string;
  name: string;
  slug: string;
}

export function CategoryFilter({
  categories,
  activeSlug,
}: {
  categories: CategoryFilterItem[];
  activeSlug?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/listings"
        className={cn(
          "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
          !activeSlug
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border text-foreground/70 hover:border-primary/60 hover:text-foreground",
        )}
      >
        All Categories
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/listings?category=${category.slug}`}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
            activeSlug === category.slug
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-foreground/70 hover:border-primary/60 hover:text-foreground",
          )}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
