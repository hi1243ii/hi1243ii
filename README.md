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

## Desktop app (Tauri)

`desktop-app/` is a separate, minimal Next.js app built with `output: "export"` — a static
frontend (Browse, Listing Detail, My Bookings) with no server of its own. It talks to this app's
`/api/*` routes over the network for all live data, and caches recently viewed listings in
`localStorage` so they stay browsable offline (booking and live availability always require a
connection). `src-tauri/` wraps that static build into a native window with Tauri, using the
`EquipRent` icon in `public/icons/`.

**Prerequisites** (one-time, per machine): [Rust](https://rustup.rs/) and, on Windows, the
"Desktop development with C++" workload from
[Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/).

**Point the app at your backend.** The API base URL is baked into the static build at build time:

```bash
cp desktop-app/.env.example desktop-app/.env
# edit NEXT_PUBLIC_API_BASE_URL — defaults to http://localhost:3000 for local dev
```

For a real installer you hand to other people, this needs to be a **hosted** deployment of this
app (e.g. Vercel + a hosted Postgres like Neon or Supabase) — an installer pointed at
`localhost:3000` only works on your own machine.

**Run it in dev mode** (hot-reloads the desktop-app frontend inside a Tauri window):

```bash
npm run desktop:dev
```

**Build both installers with one command:**

```bash
npm run desktop:build
```

This builds the static frontend, compiles the native app, and collects the output into:

```
dist-installers/windows/   EquipRent_x.y.z_x64-setup.exe, EquipRent_x.y.z_x64_en-US.msi
dist-installers/mac/       EquipRent_x.y.z_x64.dmg
```

...and copies the same files into `public/downloads/`, which the `/download` page on the website
serves directly ("Download for Windows" / "Download for Mac").

**Important:** a machine can only build installers for its own OS — Apple's toolchain (needed to
produce a signed-enough `.dmg`) only runs on macOS, same as the Windows `.exe`/`.msi` can only be
built on Windows. Running `npm run desktop:build` on Windows gives you the Windows installer only;
you (or CI) need to run it again on a Mac for the `.dmg`. `.github/workflows/build-desktop.yml`
does exactly that — it builds on both a Windows and a macOS runner in one workflow run
(triggered manually, or by pushing a `desktop-v*` tag) and uploads both installers as artifacts.
Set the `NEXT_PUBLIC_API_BASE_URL` repository variable there to your hosted deployment's URL.

## Notes / next steps

- Authentication is not wired up yet — the dashboard and bookings pages currently show the first
  seeded owner/renter, and `BookingForm` posts with a placeholder `renterId`. Swap these for a real
  session (NextAuth, Clerk, etc.) once auth is added.
- Payments/escrow are out of scope for this scaffold; `Booking.totalPrice` and `depositAmount` are
  computed/stored but no payment provider is integrated.
