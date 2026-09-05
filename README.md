# EquipRent

A full-stack construction equipment rental marketplace built with Next.js 14 (App Router),
TypeScript, Tailwind CSS, and PostgreSQL via Prisma.

## Stack

- **Next.js 14** (App Router, Route Handlers)
- **TypeScript**
- **Tailwind CSS**
- **Prisma ORM** + **PostgreSQL**
- **Zod** for request validation

## Core entities

- **User** — a single account model with a `role` (`RENTER`, `OWNER`, `ADMIN`). Owners/suppliers
  carry extra profile fields (`companyName`, `isVerified`).
- **EquipmentCategory** — excavators, skid steers, generators, scaffolding, aerial lifts,
  compaction equipment (seeded; extensible).
- **EquipmentListing** — owner, category, daily/weekly/monthly rate, location, freeform `specs`
  JSON, condition, status.
- **Photo** — ordered photos per listing.
- **AvailabilityBlock** — date ranges a listing is unavailable (booked, under maintenance, or
  manually blocked by the owner). Confirmed bookings automatically create a `BOOKED` block.
- **Booking** — a renter's request for a listing over a date range, with computed total price and
  status (`PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`).
- **Review** — one review per completed booking, tied to the listing.

## Folder structure

```
prisma/
  schema.prisma       Prisma schema (models, enums, relations)
  seed.ts              Seed script: categories, owners, renters, listings, bookings, reviews
  migrations/          SQL migrations

src/
  app/
    layout.tsx, page.tsx        Root layout + home page
    globals.css                 Tailwind entrypoint
    listings/page.tsx           Browse listings (category/city filters)
    listings/[id]/page.tsx      Listing detail: specs, availability calendar, booking form, reviews
    dashboard/page.tsx          Owner dashboard: listings + bookings + revenue
    bookings/page.tsx           Renter's bookings
    api/
      listings/route.ts         GET (list+filter) / POST (create)
      listings/[id]/route.ts    GET / PATCH / DELETE (soft delete via status)
      bookings/route.ts         GET (list) / POST (create, with conflict + pricing logic)
      bookings/[id]/route.ts    GET / PATCH (status transitions)
      reviews/route.ts          GET (by listing) / POST (create, requires completed booking)
  components/
    Navbar.tsx, Footer.tsx
    ListingCard.tsx, CategoryFilter.tsx
    AvailabilityCalendar.tsx     Read-only month grid of booked/maintenance/blocked dates
    BookingForm.tsx              Client component: date range + live price estimate
    ReviewList.tsx, StarRating.tsx
  lib/
    prisma.ts          Prisma client singleton
    pricing.ts          Rate selection (daily/weekly/monthly) + date-range overlap check
    validators.ts        Zod schemas for listings/bookings/reviews
  types/
    listing.ts          Shared listing prop types for components
```

## Getting started

1. Copy the env file and point it at a local Postgres database:

   ```bash
   cp .env.example .env
   ```

2. Install dependencies (this also runs `prisma generate`):

   ```bash
   npm install
   ```

3. Run migrations and seed the database:

   ```bash
   npx prisma migrate dev --name init
   npm run db:seed
   ```

4. Start the dev server:

   ```bash
   npm run dev
   ```

Seed data includes 6 equipment categories, 3 owners, 3 renters, 11 listings (2 per category, plus
excavators split across two owners), and sample bookings in different statuses with one completed
booking that has a review.

## Notes / next steps

- Authentication is not wired up yet — the dashboard and bookings pages currently show the first
  seeded owner/renter, and `BookingForm` posts with a placeholder `renterId`. Swap these for a real
  session (NextAuth, Clerk, etc.) once auth is added.
- Payments/escrow are out of scope for this scaffold; `Booking.totalPrice` and `depositAmount` are
  computed/stored but no payment provider is integrated.
