"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { formatCurrency } from "@/lib/pricing";
import type { SearchListing } from "@/types/search";

function priceIcon(listing: SearchListing, active: boolean): L.DivIcon {
  const label = formatCurrency(listing.dailyRate).replace(/\.00$/, "");
  return L.divIcon({
    className: "",
    html: `<div class="rounded-full border px-2.5 py-1 text-xs font-semibold shadow-elevated transition-colors ${
      active
        ? "border-transparent bg-primary text-primary-foreground scale-110"
        : "border-border bg-card text-foreground"
    }">${label}</div>`,
    iconSize: undefined,
    iconAnchor: [0, 0],
  });
}

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  React.useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 12);
      return;
    }
    map.fitBounds(L.latLngBounds(points), { padding: [48, 48], maxZoom: 13 });
  }, [map, points]);
  return null;
}

/**
 * The map can mount while its container is `display:none` (e.g. behind the
 * mobile list/map toggle), leaving Leaflet's internal size stuck at 0x0.
 * Re-measure whenever the container's box actually changes size.
 */
function AutoInvalidateSize() {
  const map = useMap();
  React.useEffect(() => {
    const container = map.getContainer();
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(container);
    return () => observer.disconnect();
  }, [map]);
  return null;
}

export function ResultsMap({
  listings,
  hoveredId,
  onHoverListing,
}: {
  listings: SearchListing[];
  hoveredId: string | null;
  onHoverListing: (id: string | null) => void;
}) {
  const geoListings = listings.filter(
    (l): l is SearchListing & { latitude: number; longitude: number } =>
      l.latitude != null && l.longitude != null,
  );
  const points = geoListings.map((l) => [l.latitude, l.longitude] as [number, number]);
  const center: [number, number] = points[0] ?? [39.7392, -104.9903];

  return (
    <MapContainer
      center={center}
      zoom={11}
      scrollWheelZoom
      className="h-full w-full"
      attributionControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds points={points} />
      <AutoInvalidateSize />
      {geoListings.map((listing) => (
        <Marker
          key={listing.id}
          position={[listing.latitude, listing.longitude]}
          icon={priceIcon(listing, hoveredId === listing.id)}
          eventHandlers={{
            mouseover: () => onHoverListing(listing.id),
            mouseout: () => onHoverListing(null),
          }}
        >
          <Popup>
            <Link href={`/listings/${listing.id}`} className="flex w-48 flex-col gap-2 no-underline">
              {listing.photos[0] && (
                <div className="relative h-24 w-full overflow-hidden rounded">
                  <Image
                    src={listing.photos[0].url}
                    alt={listing.photos[0].altText ?? listing.title}
                    fill
                    className="object-cover"
                    sizes="192px"
                  />
                </div>
              )}
              <span className="text-sm font-semibold text-steel-900">{listing.title}</span>
              <span className="text-xs text-steel-500">
                {listing.city}, {listing.state}
              </span>
              <span className="text-sm font-bold text-steel-900">
                {formatCurrency(listing.dailyRate)}
                <span className="font-normal text-steel-500"> / day</span>
              </span>
            </Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
