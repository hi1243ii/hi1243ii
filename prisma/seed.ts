import { PrismaClient, EquipmentCondition } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PASSWORD_HASH = bcrypt.hashSync("password123", 10);

const CATEGORIES = [
  {
    name: "Excavators",
    slug: "excavators",
    description: "Mini to full-size excavators for digging, grading, and demolition.",
    icon: "excavator",
  },
  {
    name: "Skid Steers",
    slug: "skid-steers",
    description: "Compact, maneuverable loaders for tight jobsites.",
    icon: "skid-steer",
  },
  {
    name: "Generators",
    slug: "generators",
    description: "Portable and towable generators for jobsite power.",
    icon: "generator",
  },
  {
    name: "Scaffolding",
    slug: "scaffolding",
    description: "Frame and system scaffolding for access at height.",
    icon: "scaffolding",
  },
  {
    name: "Aerial Lifts",
    slug: "aerial-lifts",
    description: "Boom lifts and scissor lifts for elevated work.",
    icon: "aerial-lift",
  },
  {
    name: "Compaction Equipment",
    slug: "compaction-equipment",
    description: "Plate compactors and rollers for soil and asphalt.",
    icon: "compactor",
  },
] as const;

const OWNERS = [
  {
    email: "owner.summit@equiprent.dev",
    name: "Summit Equipment Rentals",
    companyName: "Summit Equipment Rentals",
    phone: "555-010-1000",
    insuranceVerified: true,
    insuranceProvider: "Travelers Commercial Equipment",
    certifications: ["OSHA 30", "NCCCO Certified"],
  },
  {
    email: "owner.ironpeak@equiprent.dev",
    name: "IronPeak Machinery",
    companyName: "IronPeak Machinery Co.",
    phone: "555-010-2000",
    insuranceVerified: true,
    insuranceProvider: "Liberty Mutual Equipment Coverage",
    certifications: ["OSHA 30"],
  },
  {
    email: "owner.buildright@equiprent.dev",
    name: "BuildRight Supply",
    companyName: "BuildRight Supply",
    phone: "555-010-3000",
    insuranceVerified: false,
    insuranceProvider: null,
    certifications: [],
  },
];

const RENTERS = [
  { email: "renter.jmartinez@equiprent.dev", name: "Jordan Martinez", phone: "555-020-1000" },
  { email: "renter.acole@equiprent.dev", name: "Avery Cole", phone: "555-020-2000" },
  { email: "renter.tpatel@equiprent.dev", name: "Tanvi Patel", phone: "555-020-3000" },
];

async function main() {
  console.log("Seeding database...");

  await prisma.review.deleteMany();
  await prisma.availabilityBlock.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.equipmentListing.deleteMany();
  await prisma.equipmentCategory.deleteMany();
  await prisma.user.deleteMany();

  const categories = await Promise.all(
    CATEGORIES.map((c) => prisma.equipmentCategory.create({ data: c }))
  );
  const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

  const owners = await Promise.all(
    OWNERS.map((o) =>
      prisma.user.create({
        data: {
          ...o,
          passwordHash: PASSWORD_HASH,
          role: "OWNER",
          isVerified: true,
        },
      })
    )
  );

  const renters = await Promise.all(
    RENTERS.map((r) =>
      prisma.user.create({
        data: {
          ...r,
          passwordHash: PASSWORD_HASH,
          role: "RENTER",
        },
      })
    )
  );

  const [summit, ironpeak, buildright] = owners;

  type ListingSeed = {
    ownerId: string;
    categorySlug: keyof typeof categoryBySlug;
    title: string;
    description: string;
    make: string;
    model: string;
    year: number;
    condition: EquipmentCondition;
    dailyRate: number;
    weeklyRate: number;
    monthlyRate: number;
    depositAmount: number;
    city: string;
    state: string;
    zipCode: string;
    latitude: number;
    longitude: number;
    specs: Record<string, string | number | boolean>;
    photoSeed: string;
    deliveryFeeAmount?: number;
    damageWaiverPct?: number;
  };

  const listingSeeds: ListingSeed[] = [
    {
      ownerId: summit.id,
      categorySlug: "excavators",
      title: "CAT 320 Hydraulic Excavator",
      description:
        "Full-size 20-ton excavator, ideal for grading, trenching, and demolition. Recently serviced with new hydraulic hoses.",
      make: "Caterpillar",
      model: "320",
      year: 2021,
      condition: "EXCELLENT",
      dailyRate: 650,
      weeklyRate: 2900,
      monthlyRate: 9800,
      depositAmount: 1500,
      city: "Denver",
      state: "CO",
      zipCode: "80202",
      latitude: 39.7392,
      longitude: -104.9903,
      specs: { operatingWeightLbs: 49000, digDepthFt: 22.6, bucketCapacityCuYd: 1.19, horsepower: 158, engineHours: 1420 },
      photoSeed: "excavator-cat320",
    },
    {
      ownerId: ironpeak.id,
      categorySlug: "excavators",
      title: "Kubota KX057-5 Mini Excavator",
      description: "Compact mini excavator perfect for landscaping and residential jobsites with limited access.",
      make: "Kubota",
      model: "KX057-5",
      year: 2022,
      condition: "EXCELLENT",
      dailyRate: 320,
      weeklyRate: 1400,
      monthlyRate: 4200,
      depositAmount: 800,
      city: "Boulder",
      state: "CO",
      zipCode: "80301",
      latitude: 40.015,
      longitude: -105.2705,
      specs: { operatingWeightLbs: 12787, digDepthFt: 13.4, bucketCapacityCuYd: 0.17, horsepower: 47.6, engineHours: 340 },
      photoSeed: "excavator-kubota",
    },
    {
      ownerId: summit.id,
      categorySlug: "skid-steers",
      title: "Bobcat S650 Skid Steer",
      description: "Reliable skid steer with quick-attach plate, great for material handling and grading.",
      make: "Bobcat",
      model: "S650",
      year: 2020,
      condition: "GOOD",
      dailyRate: 275,
      weeklyRate: 1200,
      monthlyRate: 3600,
      depositAmount: 600,
      city: "Denver",
      state: "CO",
      zipCode: "80204",
      latitude: 39.7285,
      longitude: -105.0126,
      specs: { operatingWeightLbs: 8440, ratedOperatingCapacityLbs: 2690, horsepower: 74.3, engineHours: 980 },
      photoSeed: "skidsteer-bobcat",
    },
    {
      ownerId: buildright.id,
      categorySlug: "skid-steers",
      title: "John Deere 320G Skid Steer",
      description: "High-flow hydraulics, vertical lift path, excellent visibility. Includes bucket and forks.",
      make: "John Deere",
      model: "320G",
      year: 2023,
      condition: "NEW",
      dailyRate: 295,
      weeklyRate: 1300,
      monthlyRate: 3900,
      depositAmount: 700,
      city: "Aurora",
      state: "CO",
      zipCode: "80010",
      latitude: 39.7294,
      longitude: -104.8319,
      specs: { operatingWeightLbs: 9160, ratedOperatingCapacityLbs: 3050, horsepower: 82, engineHours: 210 },
      photoSeed: "skidsteer-deere",
    },
    {
      ownerId: ironpeak.id,
      categorySlug: "generators",
      title: "Generac 20kW Towable Generator",
      description: "Towable diesel generator for continuous jobsite power. Whisper-quiet enclosure.",
      make: "Generac",
      model: "MDG25IF4",
      year: 2021,
      condition: "GOOD",
      dailyRate: 145,
      weeklyRate: 650,
      monthlyRate: 1900,
      depositAmount: 300,
      city: "Boulder",
      state: "CO",
      zipCode: "80302",
      latitude: 40.0176,
      longitude: -105.2797,
      specs: { kwOutput: 20, fuelType: "Diesel", tankCapacityGal: 60, runtimeHoursAt75Pct: 25, engineHours: 610 },
      photoSeed: "generator-towable",
    },
    {
      ownerId: buildright.id,
      categorySlug: "generators",
      title: "Honda EU7000is Portable Generator",
      description: "Ultra-quiet inverter generator, great for finish work and sensitive electronics.",
      make: "Honda",
      model: "EU7000is",
      year: 2022,
      condition: "EXCELLENT",
      dailyRate: 85,
      weeklyRate: 380,
      monthlyRate: 1100,
      depositAmount: 200,
      city: "Aurora",
      state: "CO",
      zipCode: "80011",
      latitude: 39.7089,
      longitude: -104.7317,
      specs: { wattsRated: 5500, wattsPeak: 7000, fuelType: "Gasoline", noiseLevelDb: 58, engineHours: 95 },
      photoSeed: "generator-honda",
    },
    {
      ownerId: summit.id,
      categorySlug: "scaffolding",
      title: "Frame Scaffolding Package (500 sq ft)",
      description: "Complete frame scaffolding package with cross braces, planks, and guardrails. Covers ~500 sq ft of facade.",
      make: "Werner",
      model: "Frame System",
      year: 2019,
      condition: "GOOD",
      dailyRate: 120,
      weeklyRate: 500,
      monthlyRate: 1400,
      depositAmount: 400,
      city: "Denver",
      state: "CO",
      zipCode: "80205",
      latitude: 39.7508,
      longitude: -104.9855,
      specs: { coverageSqFt: 500, maxHeightFt: 24, platformWidthIn: 24, includesGuardrails: true },
      photoSeed: "scaffolding-frame",
    },
    {
      ownerId: ironpeak.id,
      categorySlug: "scaffolding",
      title: "System Scaffolding (Ringlock) 1000 sq ft",
      description: "Ringlock system scaffolding for complex facades and shoring. Rated for heavy loads.",
      make: "Layher-compatible",
      model: "Ringlock",
      year: 2020,
      condition: "GOOD",
      dailyRate: 210,
      weeklyRate: 900,
      monthlyRate: 2600,
      depositAmount: 750,
      city: "Boulder",
      state: "CO",
      zipCode: "80303",
      latitude: 39.9894,
      longitude: -105.2622,
      specs: { coverageSqFt: 1000, maxHeightFt: 60, loadRatingPsf: 75, includesGuardrails: true },
      photoSeed: "scaffolding-ringlock",
    },
    {
      ownerId: buildright.id,
      categorySlug: "aerial-lifts",
      title: "JLG 450AJ Articulating Boom Lift",
      description: "45 ft articulating boom lift with 4WD, ideal for rough terrain and reach-over obstacles.",
      make: "JLG",
      model: "450AJ",
      year: 2021,
      condition: "EXCELLENT",
      dailyRate: 380,
      weeklyRate: 1650,
      monthlyRate: 4800,
      depositAmount: 900,
      city: "Aurora",
      state: "CO",
      zipCode: "80012",
      latitude: 39.6880,
      longitude: -104.7561,
      specs: { platformHeightFt: 45, horizontalReachFt: 24.5, liftCapacityLbs: 500, driveType: "4WD", engineHours: 505 },
      photoSeed: "aeriallift-jlg",
    },
    {
      ownerId: summit.id,
      categorySlug: "aerial-lifts",
      title: "Genie GS-2632 Scissor Lift",
      description: "Electric scissor lift, 26 ft platform height, narrow footprint for indoor and warehouse work.",
      make: "Genie",
      model: "GS-2632",
      year: 2022,
      condition: "EXCELLENT",
      dailyRate: 195,
      weeklyRate: 850,
      monthlyRate: 2400,
      depositAmount: 500,
      city: "Denver",
      state: "CO",
      zipCode: "80206",
      latitude: 39.7328,
      longitude: -104.9594,
      specs: { platformHeightFt: 26, liftCapacityLbs: 500, widthIn: 32, powerSource: "Electric" },
      photoSeed: "aeriallift-genie",
    },
    {
      ownerId: ironpeak.id,
      categorySlug: "compaction-equipment",
      title: "Wacker Neuson Reversible Plate Compactor",
      description: "Reversible plate compactor for granular soils and asphalt patching.",
      make: "Wacker Neuson",
      model: "DPU6555",
      year: 2021,
      condition: "GOOD",
      dailyRate: 95,
      weeklyRate: 400,
      monthlyRate: 1150,
      depositAmount: 250,
      city: "Boulder",
      state: "CO",
      zipCode: "80304",
      latitude: 40.0247,
      longitude: -105.2519,
      specs: { plateWidthIn: 21.7, centrifugalForceLbs: 14742, weightLbs: 794, engineHours: 150 },
      photoSeed: "compactor-plate",
    },
  ];

  const listings = [];
  for (const seed of listingSeeds) {
    const listing = await prisma.equipmentListing.create({
      data: {
        ownerId: seed.ownerId,
        categoryId: categoryBySlug[seed.categorySlug].id,
        title: seed.title,
        description: seed.description,
        make: seed.make,
        model: seed.model,
        year: seed.year,
        condition: seed.condition,
        dailyRate: seed.dailyRate,
        weeklyRate: seed.weeklyRate,
        monthlyRate: seed.monthlyRate,
        depositAmount: seed.depositAmount,
        city: seed.city,
        state: seed.state,
        zipCode: seed.zipCode,
        latitude: seed.latitude,
        longitude: seed.longitude,
        specs: seed.specs,
        deliveryFeeAmount: seed.deliveryFeeAmount ?? Math.round(seed.dailyRate * 0.4),
        damageWaiverPct: seed.damageWaiverPct ?? 0.1,
        // No photos yet — owners upload real equipment photos via the listing wizard.
      },
    });
    listings.push(listing);
  }

  const [excavator320, kubotaMini, bobcatSkid] = listings;
  const [jordan, avery, tanvi] = renters;

  const completedBooking = await prisma.booking.create({
    data: {
      listingId: excavator320.id,
      renterId: jordan.id,
      startDate: new Date("2026-06-01"),
      endDate: new Date("2026-06-05"),
      subtotal: 2600,
      deliveryFee: 0,
      damageWaiverFee: 260,
      totalPrice: 2860,
      depositAmount: 1500,
      damageWaiverAccepted: true,
      status: "COMPLETED",
      notes: "Foundation excavation for residential addition.",
    },
  });
  await prisma.availabilityBlock.create({
    data: {
      listingId: excavator320.id,
      startDate: completedBooking.startDate,
      endDate: completedBooking.endDate,
      reason: "BOOKED",
      bookingId: completedBooking.id,
    },
  });
  await prisma.review.create({
    data: {
      bookingId: completedBooking.id,
      listingId: excavator320.id,
      authorId: jordan.id,
      rating: 5,
      comment: "Machine was in great shape and delivery was on time. Would rent again.",
    },
  });

  const confirmedBooking = await prisma.booking.create({
    data: {
      listingId: kubotaMini.id,
      renterId: avery.id,
      startDate: new Date("2026-09-15"),
      endDate: new Date("2026-09-20"),
      subtotal: 1400,
      deliveryFee: 128,
      damageWaiverFee: 0,
      totalPrice: 1528,
      depositAmount: 800,
      status: "CONFIRMED",
      deliveryRequired: true,
      notes: "Backyard landscaping project, need delivery to site.",
    },
  });
  await prisma.availabilityBlock.create({
    data: {
      listingId: kubotaMini.id,
      startDate: confirmedBooking.startDate,
      endDate: confirmedBooking.endDate,
      reason: "BOOKED",
      bookingId: confirmedBooking.id,
    },
  });

  const pendingBooking = await prisma.booking.create({
    data: {
      listingId: bobcatSkid.id,
      renterId: tanvi.id,
      startDate: new Date("2026-09-22"),
      endDate: new Date("2026-09-25"),
      subtotal: 825,
      deliveryFee: 0,
      damageWaiverFee: 0,
      totalPrice: 825,
      depositAmount: 600,
      status: "PENDING",
      notes: "Site grading before paving crew arrives.",
    },
  });

  await prisma.availabilityBlock.create({
    data: {
      listingId: excavator320.id,
      startDate: new Date("2026-10-01"),
      endDate: new Date("2026-10-10"),
      reason: "MAINTENANCE",
    },
  });

  await prisma.damageReport.create({
    data: {
      bookingId: pendingBooking.id,
      listingId: bobcatSkid.id,
      reporterId: tanvi.id,
      description:
        "Minor hydraulic fluid leak noticed at the quick-attach coupler after the first day on site.",
      status: "IN_REVIEW",
    },
  });

  await prisma.maintenanceLogEntry.createMany({
    data: [
      {
        listingId: excavator320.id,
        type: "ROUTINE_SERVICE",
        description: "500-hour service: hydraulic fluid, filters, and track tension check.",
        performedBy: "Summit Fleet Services",
        performedAt: new Date("2026-05-20"),
      },
      {
        listingId: excavator320.id,
        type: "INSPECTION",
        description: "Annual safety inspection — passed, no deficiencies noted.",
        performedBy: "Colorado Heavy Equipment Inspections",
        performedAt: new Date("2026-08-01"),
      },
      {
        listingId: bobcatSkid.id,
        type: "REPAIR",
        description: "Replaced quick-attach coupler seal following reported leak.",
        performedBy: "Summit Fleet Services",
        performedAt: new Date("2026-09-26"),
      },
      {
        listingId: kubotaMini.id,
        type: "INSPECTION",
        description: "Pre-rental inspection — tracks, hydraulics, and safety switches checked.",
        performedBy: "IronPeak Service Bay",
        performedAt: new Date("2026-09-10"),
      },
    ],
  });

  console.log(
    `Seeded ${categories.length} categories, ${owners.length} owners, ${renters.length} renters, ${listings.length} listings, 3 bookings, 1 review.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
