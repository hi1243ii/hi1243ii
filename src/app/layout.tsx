import type { Metadata, Viewport } from "next";
import { Inter, Oswald } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const APP_NAME = "EquipRent";

export const metadata: Metadata = {
  title: "EquipRent — Construction Equipment Rental Marketplace",
  description:
    "Rent excavators, skid steers, generators, scaffolding, and aerial lifts from verified local suppliers.",
  manifest: "/manifest.webmanifest",
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5b700" },
    { media: "(prefers-color-scheme: dark)", color: "#22262e" },
  ],
};

// Common iOS device sizes (logical CSS px + device pixel ratio) mapped to a
// pre-rendered splash image, so the app doesn't flash blank white on launch.
const APPLE_SPLASH_SCREENS: { file: string; width: number; height: number; dpr: number }[] = [
  { file: "apple-splash-1290-2796.png", width: 430, height: 932, dpr: 3 },
  { file: "apple-splash-1179-2556.png", width: 393, height: 852, dpr: 3 },
  { file: "apple-splash-1170-2532.png", width: 390, height: 844, dpr: 3 },
  { file: "apple-splash-1242-2688.png", width: 414, height: 896, dpr: 3 },
  { file: "apple-splash-828-1792.png", width: 414, height: 896, dpr: 2 },
  { file: "apple-splash-750-1334.png", width: 375, height: 667, dpr: 2 },
  { file: "apple-splash-2048-2732.png", width: 1024, height: 1366, dpr: 2 },
  { file: "apple-splash-1668-2388.png", width: 834, height: 1194, dpr: 2 },
];

const themeInitScript = `
(function () {
  try {
    var stored = window.localStorage.getItem("theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (stored === "dark" || (!stored && prefersDark)) {
      document.documentElement.classList.add("dark");
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {APPLE_SPLASH_SCREENS.map((s) => (
          <link
            key={s.file}
            rel="apple-touch-startup-image"
            href={`/splash/${s.file}`}
            media={`(device-width: ${s.width}px) and (device-height: ${s.height}px) and (-webkit-device-pixel-ratio: ${s.dpr}) and (orientation: portrait)`}
          />
        ))}
      </head>
      <body className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <InstallPrompt />
      </body>
    </html>
  );
}
