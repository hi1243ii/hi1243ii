import Link from "next/link";
import { WifiOff } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export const metadata = { title: "You're offline — EquipRent" };

export default function OfflinePage() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <WifiOff className="h-6 w-6" aria-hidden />
      </div>
      <h1 className="font-display text-2xl font-semibold text-foreground">You&apos;re offline</h1>
      <p className="max-w-sm text-muted-foreground">
        This page hasn&apos;t been saved for offline use yet. Reconnect and try again — pages you&apos;ve
        already visited will keep working without a connection.
      </p>
      <Button asChild className="mt-2">
        <Link href="/">Back to home</Link>
      </Button>
    </Container>
  );
}
