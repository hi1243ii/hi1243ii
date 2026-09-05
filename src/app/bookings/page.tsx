import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/pricing";

export const dynamic = "force-dynamic";

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-gray-200 text-gray-600",
};

// Demo renter view — in production, scope this to the authenticated renter.
export default async function BookingsPage() {
  const renter = await prisma.user.findFirst({ where: { role: "RENTER" } });

  if (!renter) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-gray-500">No renter accounts yet. Run the seed script first.</p>
      </div>
    );
  }

  const bookings = await prisma.booking.findMany({
    where: { renterId: renter.id },
    include: {
      listing: { include: { photos: { take: 1 }, category: true } },
    },
    orderBy: { startDate: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
      <p className="text-sm text-gray-500">{renter.name}</p>

      <div className="mt-6 flex flex-col gap-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
            <div>
              <Link href={`/listings/${booking.listing.id}`} className="font-semibold text-gray-900 hover:underline">
                {booking.listing.title}
              </Link>
              <p className="text-sm text-gray-500">{booking.listing.category.name}</p>
              <p className="text-sm text-gray-500">
                {new Date(booking.startDate).toLocaleDateString()} –{" "}
                {new Date(booking.endDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`rounded px-2 py-0.5 text-xs font-medium ${STATUS_COLOR[booking.status]}`}>
                {booking.status}
              </span>
              <span className="font-semibold text-gray-900">{formatCurrency(booking.totalPrice)}</span>
            </div>
          </div>
        ))}
        {bookings.length === 0 && <p className="text-sm text-gray-500">No bookings yet.</p>}
      </div>
    </div>
  );
}
