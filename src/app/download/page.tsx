import fs from "fs";
import path from "path";
import { AppWindow, Apple, Download, HardHat } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

const GITHUB_REPO = "hi1243ii/hi1243ii";
const RELEASE_TAG = "desktop-latest";
const DOWNLOADS_DIR = path.join(process.cwd(), "public", "downloads");

interface InstallerLink {
  fileName: string;
  size: string;
  url: string;
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface GithubReleaseAsset {
  name: string;
  size: number;
  browser_download_url: string;
}

// Installers are built by .github/workflows/build-desktop.yml and published
// as assets on a rolling "desktop-latest" GitHub Release — that's a stable
// public URL the deployed site can actually link to. (public/downloads/ is a
// local-only, gitignored build artifact; it never reaches the deployed site
// on its own, so it's kept only as a fallback for testing straight after
// `npm run desktop:build` on your own machine.)
async function getReleaseAssets(): Promise<GithubReleaseAsset[]> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases/tags/${RELEASE_TAG}`,
      { headers: { Accept: "application/vnd.github+json" }, next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.assets) ? data.assets : [];
  } catch {
    return [];
  }
}

function findLocalInstaller(matchExt: (ext: string) => boolean): InstallerLink | null {
  let files: string[] = [];
  try {
    files = fs.readdirSync(DOWNLOADS_DIR);
  } catch {
    return null;
  }
  const match = files.find((f) => matchExt(path.extname(f).toLowerCase()));
  if (!match) return null;
  const stat = fs.statSync(path.join(DOWNLOADS_DIR, match));
  return { fileName: match, size: formatBytes(stat.size), url: `/downloads/${match}` };
}

function findReleaseInstaller(
  assets: GithubReleaseAsset[],
  matchExt: (ext: string) => boolean,
): InstallerLink | null {
  const match = assets.find((a) => matchExt(path.extname(a.name).toLowerCase()));
  if (!match) return null;
  return { fileName: match.name, size: formatBytes(match.size), url: match.browser_download_url };
}

export default async function DownloadPage() {
  const assets = await getReleaseAssets();

  // Prefer the NSIS .exe for Windows (simpler install flow for most users);
  // fall back to .msi if that's the only one present. Release assets first,
  // then a local build for same-machine testing.
  const windows =
    findReleaseInstaller(assets, (ext) => ext === ".exe") ??
    findReleaseInstaller(assets, (ext) => ext === ".msi") ??
    findLocalInstaller((ext) => ext === ".exe") ??
    findLocalInstaller((ext) => ext === ".msi");
  const mac =
    findReleaseInstaller(assets, (ext) => ext === ".dmg") ?? findLocalInstaller((ext) => ext === ".dmg");

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
                    <a href={windows.url} download>
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
                    <a href={mac.url} download>
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
