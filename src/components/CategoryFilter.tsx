import Link from "next/link";

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
        className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
          !activeSlug
            ? "border-brand-600 bg-brand-600 text-white"
            : "border-gray-300 text-gray-700 hover:border-brand-400"
        }`}
      >
        All Categories
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/listings?category=${category.slug}`}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
            activeSlug === category.slug
              ? "border-brand-600 bg-brand-600 text-white"
              : "border-gray-300 text-gray-700 hover:border-brand-400"
          }`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
