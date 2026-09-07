import Image from "next/image";
import { StarRating } from "@/components/StarRating";

export interface ReviewSummary {
  id: string;
  rating: number;
  comment: string | null;
  photoUrls: string[];
  createdAt: string | Date;
  author: { name: string };
}

export function ReviewList({ reviews }: { reviews: ReviewSummary[] }) {
  if (reviews.length === 0) {
    return <p className="text-sm text-muted-foreground">No reviews yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-4">
      {reviews.map((review) => (
        <li key={review.id} className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">{review.author.name}</span>
            <StarRating rating={review.rating} />
          </div>
          {review.comment && <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>}
          {review.photoUrls.length > 0 && (
            <div className="mt-3 flex gap-2">
              {review.photoUrls.map((url) => (
                <div key={url} className="relative h-16 w-16 overflow-hidden rounded-md bg-muted">
                  <Image src={url} alt="Review photo" fill className="object-cover" sizes="64px" />
                </div>
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
