import { z } from "zod";

export const createBookingSchema = z
  .object({
    listingId: z.string().cuid(),
    renterId: z.string().cuid(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    deliveryRequired: z.boolean().default(false),
    damageWaiverAccepted: z.boolean().default(false),
    notes: z.string().max(2000).optional(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "endDate must be after startDate",
    path: ["endDate"],
  });

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export const createListingSchema = z.object({
  ownerId: z.string().cuid(),
  categoryId: z.string().cuid(),
  title: z.string().min(3).max(140),
  description: z.string().min(10),
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.number().int().gte(1950).lte(new Date().getFullYear() + 1).optional(),
  condition: z.enum(["NEW", "EXCELLENT", "GOOD", "FAIR"]).default("GOOD"),
  dailyRate: z.number().positive(),
  weeklyRate: z.number().positive().optional(),
  monthlyRate: z.number().positive().optional(),
  depositAmount: z.number().nonnegative().optional(),
  addressLine: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  zipCode: z.string().min(1),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  specs: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
  photoUrls: z.array(z.string().url()).optional(),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;

export const createReviewSchema = z.object({
  bookingId: z.string().cuid(),
  authorId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
