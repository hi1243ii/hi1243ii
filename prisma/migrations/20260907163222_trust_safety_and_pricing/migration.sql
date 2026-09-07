/*
  Warnings:

  - Added the required column `subtotal` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DamageReportStatus" AS ENUM ('OPEN', 'IN_REVIEW', 'RESOLVED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "MaintenanceType" AS ENUM ('INSPECTION', 'REPAIR', 'ROUTINE_SERVICE');

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "damageWaiverAccepted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "damageWaiverFee" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "deliveryFee" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "depositAmount" DECIMAL(10,2),
ADD COLUMN     "subtotal" DECIMAL(10,2);

-- Backfill existing rows: treat prior totalPrice as the subtotal (no delivery/waiver fee history).
UPDATE "bookings" SET "subtotal" = "totalPrice" WHERE "subtotal" IS NULL;

ALTER TABLE "bookings" ALTER COLUMN "subtotal" SET NOT NULL;

-- AlterTable
ALTER TABLE "equipment_listings" ADD COLUMN     "damageWaiverPct" DOUBLE PRECISION,
ADD COLUMN     "deliveryFeeAmount" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "photoUrls" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "certifications" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "insuranceProvider" TEXT,
ADD COLUMN     "insuranceVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "damage_reports" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photoUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "DamageReportStatus" NOT NULL DEFAULT 'OPEN',
    "resolutionNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "damage_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_log_entries" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "type" "MaintenanceType" NOT NULL,
    "description" TEXT NOT NULL,
    "performedBy" TEXT,
    "performedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "maintenance_log_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "damage_reports_listingId_idx" ON "damage_reports"("listingId");

-- CreateIndex
CREATE INDEX "damage_reports_bookingId_idx" ON "damage_reports"("bookingId");

-- CreateIndex
CREATE INDEX "maintenance_log_entries_listingId_performedAt_idx" ON "maintenance_log_entries"("listingId", "performedAt");

-- AddForeignKey
ALTER TABLE "damage_reports" ADD CONSTRAINT "damage_reports_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "damage_reports" ADD CONSTRAINT "damage_reports_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "equipment_listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "damage_reports" ADD CONSTRAINT "damage_reports_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_log_entries" ADD CONSTRAINT "maintenance_log_entries_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "equipment_listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
