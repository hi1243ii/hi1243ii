import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import Link from "next/link";
import { HardHat } from "lucide-react";

import { OnlineProvider } from "@/lib/online";
import { OfflineBanner } from "@/components/OfflineBanner";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EquipRent",
  description: "Browse and book construction equipment rentals — desktop app.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="flex min-h-screen flex-col bg-background text-foreground">
        <OnlineProvider>
          <OfflineBanner />
          <header className="border-b border-border bg-card">
            <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
              <Link href="/" className="flex items-center gap-2 font-display text-base font-bold">
                <HardHat className="h-5 w-5 text-primary" aria-hidden />
                EquipRent
              </Link>
              <nav className="flex items-center gap-4 text-sm font-medium">
                <Link href="/" className="text-foreground/70 hover:text-foreground">
                  Browse
                </Link>
                <Link href="/bookings" className="text-foreground/70 hover:text-foreground">
                  My Bookings
                </Link>
              </nav>
            </div>
          </header>
          <main className="flex-1">
            <div className="mx-auto max-w-5xl px-4 py-6">{children}</div>
          </main>
        </OnlineProvider>
      </body>
    </html>
  );
}
