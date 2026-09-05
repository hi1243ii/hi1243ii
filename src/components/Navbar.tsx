import Link from "next/link";

export function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-brand-700">
          <span aria-hidden>🚧</span>
          EquipRent
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link href="/listings" className="hover:text-brand-600">
            Browse Equipment
          </Link>
          <Link href="/bookings" className="hover:text-brand-600">
            My Bookings
          </Link>
          <Link href="/dashboard" className="hover:text-brand-600">
            Owner Dashboard
          </Link>
          <Link
            href="/listings"
            className="rounded-md bg-brand-600 px-4 py-2 text-white hover:bg-brand-700"
          >
            List Your Equipment
          </Link>
        </nav>
      </div>
    </header>
  );
}
