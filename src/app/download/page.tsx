import fs from "fs";
import path from "path";
import { AppWindow, Apple, Download, HardHat } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

const DOWNLOADS_DIR = path.join(process.cwd(), "public", "downloads");

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function findInstaller(matchExt: (ext: string) => boolean) {
  let files: string[] = [];
  try {
    files = fs.readdirSync(DOWNLOADS_DIR);
  } catch {
    return null;
  }
  const match = files.find((f) => matchExt(path.extname(f).toLowerCase()));
  if (!match) return null;
  const stat = fs.statSync(path.join(DOWNLOADS_DIR, match));
  return { fileName: match, size: formatBytes(stat.size) };
}

export default function DownloadPage() {
  // Prefer the NSIS .exe for Windows (simpler install flow for most users);
  // fall back to .msi if that's the only one present.
  const windows = findInstaller((ext) => ext === ".exe") ?? findInstaller((ext) => ext === ".msi");
  const mac = findInstaller((ext) => ext === ".dmg");

  return (
    <div>
      <div className="relative overflow-hidden border-b border-border bg-foreground text-background">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-hazard-stripes" aria-hidden />
        <Container className="py-16">
          <p className="mb-3 flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            <HardHat className="h-4 w-4" aria-hidden />
            Desktop App
          </p>
          <h1 className="max-w-2xl font-display text-display-lg font-semibold tracking-tight">
            Get EquipRent for your desktop.
          </h1>
          <p className="mt-4 max-w-xl text-background/70">
            Browse equipment, request bookings, and revisit anything you&apos;ve already looked at —
            even offline — right from your desktop.
          </p>
        </Container>
      </div>

      <Container className="py-14">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Card>
            <CardContent className="flex flex-col items-start gap-4 pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-foreground">
                <AppWindow className="h-6 w-6" aria-hidden />
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground">Windows</h2>
                <p className="mt-1 text-sm text-muted-foreground">Windows 10 and 11 (64-bit).</p>
              </div>
              {windows ? (
                <>
                  <Button asChild size="lg" className="w-full">
                    <a href={`/downloads/${windows.fileName}`} download>
                      <Download className="h-4 w-4" />
                      Download for Windows
                    </a>
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    {windows.fileName} &middot; {windows.size}
                  </p>
                </>
              ) : (
                <Button size="lg" className="w-full" disabled>
                  Not built yet
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-start gap-4 pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-foreground">
                <Apple className="h-6 w-6" aria-hidden />
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground">Mac</h2>
                <p className="mt-1 text-sm text-muted-foreground">macOS 12 Monterey or later.</p>
              </div>
              {mac ? (
                <>
                  <Button asChild size="lg" className="w-full">
                    <a href={`/downloads/${mac.fileName}`} download>
                      <Download className="h-4 w-4" />
                      Download for Mac
                    </a>
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    {mac.fileName} &middot; {mac.size}
                  </p>
                </>
              ) : (
                <Button size="lg" className="w-full" disabled>
                  Not built yet
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          The desktop app needs an internet connection for search, bookings, and availability —
          recently viewed listings stay browsable offline.
        </p>
      </Container>
    </div>
  );
}
