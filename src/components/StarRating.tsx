import { Star } from "lucide-react";

export function StarRating({ rating, count }: { rating: number; count?: number }) {
  const rounded = Math.round(rating);

  return (
    <div className="flex items-center gap-1.5 text-sm">
      <span className="flex items-center gap-0.5" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={i < rounded ? "h-3.5 w-3.5 fill-primary text-primary" : "h-3.5 w-3.5 text-border"}
          />
        ))}
      </span>
      <span className="text-muted-foreground">
        {rating > 0 ? rating.toFixed(1) : "No ratings"}
        {typeof count === "number" ? ` (${count})` : ""}
      </span>
    </div>
  );
}
