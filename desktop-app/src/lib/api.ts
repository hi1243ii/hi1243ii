import type { Booking, DemoSession, Listing } from "@/types";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000").replace(/\/$/, "");

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    });
  } catch {
    throw new ApiError("network-error");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = typeof body.error === "string" ? body.error : `Request failed (${res.status})`;
    throw new ApiError(message, res.status);
  }

  return res.json();
}

export interface SearchFilters {
  category?: string;
  city?: string;
  minRate?: string;
  maxRate?: string;
}

export function fetchListings(filters: SearchFilters = {}): Promise<{ listings: Listing[] }> {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.city) params.set("city", filters.city);
  if (filters.minRate) params.set("minRate", filters.minRate);
  if (filters.maxRate) params.set("maxRate", filters.maxRate);
  const qs = params.toString();
  return request(`/api/listings${qs ? `?${qs}` : ""}`);
}

export function fetchListing(id: string): Promise<{ listing: Listing }> {
  return request(`/api/listings/${id}`);
}

export function fetchBookings(renterId: string): Promise<{ bookings: Booking[] }> {
  return request(`/api/bookings?renterId=${encodeURIComponent(renterId)}`);
}

export function createBooking(payload: {
  listingId: string;
  renterId: string;
  startDate: string;
  endDate: string;
  deliveryRequired?: boolean;
  damageWaiverAccepted?: boolean;
  notes?: string;
}): Promise<{ booking: Booking }> {
  return request(`/api/bookings`, { method: "POST", body: JSON.stringify(payload) });
}

export function fetchDemoSession(): Promise<DemoSession> {
  return request(`/api/session`);
}

export function fetchCategories(): Promise<{ categories: { id: string; name: string; slug: string }[] }> {
  return request(`/api/categories`);
}

export { API_BASE };
