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

// Demo owner dashboard — in production, scope this to the authenticated owner.
export default async function DashboardPage() {
  const owner = await prisma.user.findFirst({ where: { role: "OWNER" } });

  if (!owner) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-gray-500">No owner accounts yet. Run the seed script first.</p>
      </div>
    );
  }

  const listings = await prisma.equipmentListing.findMany({
    where: { ownerId: owner.id },
    include: {
      photos: { take: 1 },
      bookings: { orderBy: { startDate: "desc" }, include: { renter: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalBookings = listings.reduce((sum, l) => sum + l.bookings.length, 0);
  const totalRevenue = listings.reduce(
    (sum, l) =>
      sum +
      l.bookings
        .filter((b) => b.status === "COMPLETED" || b.status === "CONFIRMED")
        .reduce((s, b) => s + Number(b.totalPrice), 0),
    0
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Owner Dashboard</h1>
          <p className="text-sm text-gray-500">{owner.companyName ?? owner.name}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs uppercase text-gray-400">Listings</p>
          <p className="text-2xl font-bold text-gray-900">{listings.length}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs uppercase text-gray-400">Bookings</p>
          <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs uppercase text-gray-400">Revenue (confirmed/completed)</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-6">
        {listings.map((listing) => (
          <div key={listing.id} className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <Link href={`/listings/${listing.id}`} className="font-semibold text-gray-900 hover:underline">
                {listing.title}
              </Link>
              <span className="text-sm text-gray-500">{formatCurrency(listing.dailyRate)}/day</span>
            </div>

            {listing.bookings.length === 0 ? (
              <p className="mt-2 text-sm text-gray-400">No bookings yet.</p>
            ) : (
              <table className="mt-3 w-full text-left text-sm">
                <thead className="text-xs uppercase text-gray-400">
                  <tr>
                    <th className="pb-2">Renter</th>
                    <th className="pb-2">Dates</th>
                    <th className="pb-2">Total</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {listing.bookings.map((booking) => (
                    <tr key={booking.id} className="border-t border-gray-100">
                      <td className="py-2">{booking.renter.name}</td>
                      <td className="py-2 text-gray-500">
                        {new Date(booking.startDate).toLocaleDateString()} –{" "}
                        {new Date(booking.endDate).toLocaleDateString()}
                      </td>
                      <td className="py-2">{formatCurrency(booking.totalPrice)}</td>
                      <td className="py-2">
                        <span className={`rounded px-2 py-0.5 text-xs font-medium ${STATUS_COLOR[booking.status]}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
