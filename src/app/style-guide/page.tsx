import type { Metadata } from "next";
import { AlertTriangle, ArrowRight, HardHat, Search, Wrench } from "lucide-react";

import { Container } from "@/components/ui/container";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export const metadata: Metadata = {
  title: "Design System — EquipRent",
};

function Section({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border py-14">
      <Container>
        <div className="mb-8 max-w-2xl">
          <p className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            {eyebrow}
          </p>
          <h2 className="font-display text-display-sm font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          {description && <p className="mt-2 text-muted-foreground">{description}</p>}
        </div>
        {children}
      </Container>
    </section>
  );
}

const steelSwatches = [
  { label: "50", className: "bg-steel-50" },
  { label: "100", className: "bg-steel-100" },
  { label: "200", className: "bg-steel-200" },
  { label: "300", className: "bg-steel-300" },
  { label: "400", className: "bg-steel-400" },
  { label: "500", className: "bg-steel-500" },
  { label: "600", className: "bg-steel-600" },
  { label: "700", className: "bg-steel-700" },
  { label: "800", className: "bg-steel-800" },
  { label: "900", className: "bg-steel-900" },
  { label: "950", className: "bg-steel-950" },
];

const yellowSwatches = [
  { label: "50", className: "bg-safety-yellow-50" },
  { label: "100", className: "bg-safety-yellow-100" },
  { label: "200", className: "bg-safety-yellow-200" },
  { label: "300", className: "bg-safety-yellow-300" },
  { label: "400", className: "bg-safety-yellow-400" },
  { label: "500", className: "bg-safety-yellow-500" },
  { label: "600", className: "bg-safety-yellow-600" },
  { label: "700", className: "bg-safety-yellow-700" },
  { label: "800", className: "bg-safety-yellow-800" },
  { label: "900", className: "bg-safety-yellow-900" },
  { label: "950", className: "bg-safety-yellow-950" },
];

const orangeSwatches = [
  { label: "50", className: "bg-safety-orange-50" },
  { label: "100", className: "bg-safety-orange-100" },
  { label: "200", className: "bg-safety-orange-200" },
  { label: "300", className: "bg-safety-orange-300" },
  { label: "400", className: "bg-safety-orange-400" },
  { label: "500", className: "bg-safety-orange-500" },
  { label: "600", className: "bg-safety-orange-600" },
  { label: "700", className: "bg-safety-orange-700" },
  { label: "800", className: "bg-safety-orange-800" },
  { label: "900", className: "bg-safety-orange-900" },
  { label: "950", className: "bg-safety-orange-950" },
];

const semanticSwatches = [
  { label: "background", className: "bg-background", border: true },
  { label: "foreground", className: "bg-foreground" },
  { label: "card", className: "bg-card", border: true },
  { label: "primary", className: "bg-primary" },
  { label: "secondary", className: "bg-secondary" },
  { label: "accent", className: "bg-accent" },
  { label: "muted", className: "bg-muted" },
  { label: "destructive", className: "bg-destructive" },
  { label: "success", className: "bg-success" },
  { label: "warning", className: "bg-warning" },
  { label: "border", className: "bg-border" },
];

const spacingScale = [
  { token: "1", px: "4px", className: "w-1" },
  { token: "2", px: "8px", className: "w-2" },
  { token: "3", px: "12px", className: "w-3" },
  { token: "4", px: "16px", className: "w-4" },
  { token: "6", px: "24px", className: "w-6" },
  { token: "8", px: "32px", className: "w-8" },
  { token: "12", px: "48px", className: "w-12" },
  { token: "16", px: "64px", className: "w-16" },
  { token: "24", px: "96px", className: "w-24" },
  { token: "32", px: "128px", className: "w-32" },
];

export default function StyleGuidePage() {
  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border bg-foreground text-background">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-hazard-stripes" aria-hidden />
        <Container className="py-16">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="mb-3 flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                <HardHat className="h-4 w-4" aria-hidden />
                EquipRent Design System
              </p>
              <h1 className="max-w-3xl font-display text-display-lg font-semibold tracking-tight">
                Industrial materials. Modern precision.
              </h1>
              <p className="mt-4 max-w-xl text-background/70">
                Color, type, spacing, and the button / card / input primitives every EquipRent
                screen is built from. Built for durability on a job site and clarity in a browser.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-background/15 bg-background/5 px-4 py-3">
              <span className="text-sm text-background/70">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </Container>
      </div>

      {/* Color */}
      <Section
        eyebrow="Foundations"
        title="Color"
        description="A cool steel neutral scale for structure, plus a two-color safety accent system — yellow for primary action, orange for secondary emphasis. Semantic tokens remap automatically in dark mode."
      >
        <div className="mb-10">
          <h3 className="mb-3 font-display text-base font-semibold">Semantic tokens</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {semanticSwatches.map((s) => (
              <div key={s.label} className="flex flex-col gap-2">
                <div
                  className={`h-16 rounded-md ${s.className} ${
                    s.border ? "border border-border" : ""
                  } shadow-soft`}
                />
                <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <h3 className="mb-3 font-display text-base font-semibold">Steel — neutral scale</h3>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-11">
            {steelSwatches.map((s) => (
              <div key={s.label} className="flex flex-col gap-2">
                <div className={`h-14 rounded-md ${s.className} border border-border/50 shadow-soft`} />
                <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <h3 className="mb-3 font-display text-base font-semibold">Safety yellow — primary accent</h3>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-11">
            {yellowSwatches.map((s) => (
              <div key={s.label} className="flex flex-col gap-2">
                <div className={`h-14 rounded-md ${s.className} border border-border/50 shadow-soft`} />
                <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-display text-base font-semibold">Safety orange — secondary accent</h3>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-11">
            {orangeSwatches.map((s) => (
              <div key={s.label} className="flex flex-col gap-2">
                <div className={`h-14 rounded-md ${s.className} border border-border/50 shadow-soft`} />
                <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Typography */}
      <Section
        eyebrow="Foundations"
        title="Typography"
        description="Oswald — condensed, utilitarian — carries headings and signage moments. Inter carries every paragraph and UI label for maximum readability."
      >
        <div className="space-y-6 rounded-lg border border-border bg-card p-6 shadow-card sm:p-10">
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              display-2xl / font-display / 72px
            </p>
            <p className="font-display text-display-2xl font-semibold tracking-tight">Heavy Load</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              display-xl / font-display / 60px
            </p>
            <p className="font-display text-display-xl font-semibold tracking-tight">Heavy Load</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              display-lg / font-display / 48px
            </p>
            <p className="font-display text-display-lg font-semibold tracking-tight">Heavy Load</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              display-md / font-display / 36px
            </p>
            <p className="font-display text-display-md font-semibold">Heavy Load</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              display-sm / font-display / 30px
            </p>
            <p className="font-display text-display-sm font-semibold">Heavy Load</p>
          </div>

          <Separator className="my-2" />

          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              text-2xl / font-sans / semibold
            </p>
            <p className="text-2xl font-semibold">Rent the right equipment, fast.</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              text-lg / font-sans / medium
            </p>
            <p className="text-lg font-medium">Rent the right equipment, fast.</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              text-base / font-sans / regular
            </p>
            <p className="text-base">
              Body copy sits here. It should stay comfortable at long lengths — spec sheets,
              rental terms, and supplier descriptions all use this size.
            </p>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              text-sm / font-sans / muted
            </p>
            <p className="text-sm text-muted-foreground">
              Secondary copy — captions, helper text, timestamps.
            </p>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              text-xs / font-sans / uppercase label
            </p>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Available Now
            </p>
          </div>
        </div>
      </Section>

      {/* Spacing */}
      <Section
        eyebrow="Foundations"
        title="Spacing"
        description="A 4px base grid (Tailwind's default scale). Consistent spacing is what makes dense equipment listings feel calm rather than cluttered."
      >
        <div className="space-y-3 rounded-lg border border-border bg-card p-6 shadow-card">
          {spacingScale.map((s) => (
            <div key={s.token} className="flex items-center gap-4">
              <span className="w-12 shrink-0 font-mono text-xs text-muted-foreground">{s.token}</span>
              <div className={`h-4 ${s.className} rounded bg-accent`} />
              <span className="text-xs text-muted-foreground">{s.px}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Buttons */}
      <Section
        eyebrow="Components"
        title="Button"
        description="Primary actions are safety yellow — unmissable, like equipment signage. Secondary and outline styles recede for lower-priority actions."
      >
        <div className="space-y-8">
          <div>
            <h3 className="mb-3 font-display text-base font-semibold">Variants</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">
                Book Now <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="accent">Contact Supplier</Button>
              <Button variant="secondary">Save for Later</Button>
              <Button variant="outline">View Spec Sheet</Button>
              <Button variant="ghost">Cancel</Button>
              <Button variant="destructive">
                <AlertTriangle className="h-4 w-4" /> Report Issue
              </Button>
              <Button variant="link">Learn more</Button>
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-display text-base font-semibold">Sizes</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon" aria-label="Search">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-display text-base font-semibold">States</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button loading>Processing</Button>
              <Button disabled>Disabled</Button>
              <Button variant="secondary" disabled>
                Disabled
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Badges */}
      <Section eyebrow="Components" title="Badge" description="Status and category tags used across listing cards, bookings, and dashboards.">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Excavators</Badge>
          <Badge variant="primary">Available Now</Badge>
          <Badge variant="accent">New Listing</Badge>
          <Badge variant="success">Verified Supplier</Badge>
          <Badge variant="destructive">Booked</Badge>
          <Badge variant="outline">Delivery Included</Badge>
        </div>
      </Section>

      {/* Cards */}
      <Section
        eyebrow="Components"
        title="Card"
        description="The base surface for listings, stats, and forms — a flat plane that lifts slightly off the page background."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-accent" aria-hidden />
                <CardTitle>Basic Card</CardTitle>
              </div>
              <CardDescription>Header, content, and footer slots.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Use for simple grouped content — settings panels, confirmation summaries, and
                empty states.
              </p>
            </CardContent>
            <CardFooter>
              <Button size="sm">Continue</Button>
              <Button size="sm" variant="ghost">
                Skip
              </Button>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden">
            <div className="relative flex h-40 items-center justify-center bg-steel-800 text-steel-400">
              <HardHat className="h-10 w-10" aria-hidden />
              <Badge variant="primary" className="absolute left-3 top-3">
                Skid Steers
              </Badge>
            </div>
            <CardContent className="pt-5">
              <p className="font-display text-lg font-semibold">CAT 259D Compact Track Loader</p>
              <p className="text-sm text-muted-foreground">Denver, CO · 4.9 (128 reviews)</p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-xl font-bold text-foreground">$285</span>
                <span className="text-sm text-muted-foreground">/ day</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                View Listing <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-foreground text-background">
            <CardContent className="pt-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                This Month
              </p>
              <p className="mt-2 font-display text-display-md font-semibold">$18,420</p>
              <p className="mt-1 text-sm text-background/60">Total rental revenue</p>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Forms */}
      <Section
        eyebrow="Components"
        title="Form inputs"
        description="Inputs, textareas, and selects share height, radius, and focus-ring treatment so mixed forms feel like one system."
      >
        <div className="grid gap-8 rounded-lg border border-border bg-card p-6 shadow-card sm:grid-cols-2 sm:p-10">
          <div className="space-y-2">
            <Label htmlFor="sg-name" required>
              Equipment name
            </Label>
            <Input id="sg-name" placeholder="e.g. CAT 259D Track Loader" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sg-email">Contact email</Label>
            <Input id="sg-email" type="email" defaultValue="not-an-email" invalid />
            <p className="text-xs text-destructive">Enter a valid email address.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sg-category">Category</Label>
            <Select id="sg-category" defaultValue="excavators">
              <option value="excavators">Excavators</option>
              <option value="skid-steers">Skid Steers</option>
              <option value="generators">Generators</option>
              <option value="aerial-lifts">Aerial Lifts</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sg-rate">Daily rate</Label>
            <Input id="sg-rate" type="number" placeholder="0.00" disabled />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="sg-desc">Description</Label>
            <Textarea id="sg-desc" placeholder="Condition, included attachments, delivery radius…" />
          </div>
        </div>
      </Section>
    </div>
  );
}
