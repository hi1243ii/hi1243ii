import Link from "next/link";
import { HardHat } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";

const COLUMNS = [
  {
    heading: "Marketplace",
    links: [
      { href: "/listings", label: "Browse Equipment" },
      { href: "/dashboard/listings/new", label: "List Your Equipment" },
      { href: "/bookings", label: "My Bookings" },
    ],
  },
  {
    heading: "Trust & Safety",
    links: [
      { href: "/listings", label: "Verified Suppliers" },
      { href: "/listings", label: "Insurance & Certification" },
      { href: "/listings", label: "Damage Protection" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-foreground text-background">
      <Container className="py-12">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
              <HardHat className="h-5 w-5 text-primary" aria-hidden />
              EquipRent
            </Link>
            <p className="mt-3 text-sm text-background/60">
              Rent excavators, skid steers, generators, scaffolding, and aerial lifts from verified
              local suppliers.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            {COLUMNS.map((col) => (
              <div key={col.heading}>
                <p className="font-display text-xs font-semibold uppercase tracking-widest text-background/50">
                  {col.heading}
                </p>
                <ul className="mt-3 flex flex-col gap-2 text-sm">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-background/80 hover:text-primary">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-8 bg-background/10" />

        <p className="text-xs text-background/50">
          © {new Date().getFullYear()} EquipRent. Construction equipment rental marketplace.
        </p>
      </Container>
    </footer>
  );
}
