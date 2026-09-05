export interface ListingCategorySummary {
  id: string;
  name: string;
  slug: string;
}

export interface ListingPhoto {
  id: string;
  url: string;
  altText: string | null;
  position: number;
}

export interface ListingOwnerSummary {
  id: string;
  name: string;
  companyName: string | null;
  isVerified: boolean;
}

export interface ListingSummary {
  id: string;
  title: string;
  city: string;
  state: string;
  dailyRate: string | number;
  weeklyRate: string | number | null;
  condition: string;
  category: ListingCategorySummary;
  photos: ListingPhoto[];
  owner: ListingOwnerSummary;
  reviews: { rating: number }[];
}
