export function StarRating({ rating, count }: { rating: number; count?: number }) {
  const rounded = Math.round(rating);

  return (
    <div className="flex items-center gap-1 text-sm text-amber-500">
      <span aria-hidden>
        {"★".repeat(rounded)}
        {"☆".repeat(5 - rounded)}
      </span>
      <span className="text-gray-500">
        {rating > 0 ? rating.toFixed(1) : "No ratings"}
        {typeof count === "number" ? ` (${count})` : ""}
      </span>
    </div>
  );
}
