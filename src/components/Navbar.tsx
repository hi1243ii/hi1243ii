"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HardHat, Menu, X } from "lucide-react";

import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const NAV_LINKS = [
  { href: "/listings", label: "Browse Equipment" },
  { href: "/bookings", label: "My Bookings" },
  { href: "/dashboard", label: "Owner Dashboard" },
  { href: "/download", label: "Desktop App" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/90 pt-[env(safe-area-inset-top)] backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
          <HardHat className="h-5 w-5 text-primary" aria-hidden />
          EquipRent
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-foreground/70 transition-colors hover:text-foreground",
                pathname?.startsWith(link.href) && "text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Button asChild size="sm">
            <Link href="/dashboard/listings/new">List Your Equipment</Link>
          </Button>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </Container>

      {open && (
        <nav className="border-t border-border bg-card md:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground",
                  pathname?.startsWith(link.href) && "bg-muted text-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild size="sm" className="mt-2">
              <Link href="/dashboard/listings/new" onClick={() => setOpen(false)}>
                List Your Equipment
              </Link>
            </Button>
          </Container>
        </nav>
      )}
    </header>
  );
}
