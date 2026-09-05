import { StarRating } from "@/components/StarRating";

export interface ReviewSummary {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string | Date;
  author: { name: string };
}

export function ReviewList({ reviews }: { reviews: ReviewSummary[] }) {
  if (reviews.length === 0) {
    return <p className="text-sm text-gray-500">No reviews yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-4">
      {reviews.map((review) => (
        <li key={review.id} className="rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900">{review.author.name}</span>
            <StarRating rating={review.rating} />
          </div>
          {review.comment && <p className="mt-2 text-sm text-gray-600">{review.comment}</p>}
        </li>
      ))}
    </ul>
  );
}
