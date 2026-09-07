export interface ListingPhoto {
  id: string;
  url: string;
  altText: string | null;
}

export interface ListingCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ListingOwner {
  id: string;
  name: string;
  companyName: string | null;
  isVerified: boolean;
  insuranceVerified?: boolean;
  phone?: string | null;
}

export interface ListingReview {
  id?: string;
  rating: number;
  comment?: string | null;
  author?: { name: string };
}

export interface Listing {
  id: string;
  title: string;
  description?: string;
  city: string;
  state: string;
  zipCode?: string;
  dailyRate: number | string;
  weeklyRate: number | string | null;
  monthlyRate?: number | string | null;
  depositAmount?: number | string | null;
  condition: string;
  category: ListingCategory;
  photos: ListingPhoto[];
  owner: ListingOwner;
  reviews: ListingReview[];
  specs?: Record<string, string | number | boolean> | null;
  cachedAt?: number;
}

export interface Booking {
  id: string;
  listingId: string;
  startDate: string;
  endDate: string;
  totalPrice: number | string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  listing: {
    id: string;
    title: string;
    category: ListingCategory;
    photos: ListingPhoto[];
  };
}

export interface DemoSession {
  renterId: string;
  renterName: string;
}
