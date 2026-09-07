"use client";

import { WifiOff } from "lucide-react";

import { useOnline } from "@/lib/online";

export function OfflineBanner() {
  const online = useOnline();
  if (online) return null;

  return (
    <div className="flex items-center justify-center gap-2 bg-warning px-4 py-2 text-center text-xs font-medium text-warning-foreground">
      <WifiOff className="h-3.5 w-3.5" aria-hidden />
      You&apos;re offline — showing your recently viewed listings. Booking and live availability
      need a connection.
    </div>
  );
}
