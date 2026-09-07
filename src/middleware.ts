import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Allows the Tauri-bundled desktop app (a different origin — tauri://localhost
// or http://tauri.localhost depending on platform) to call these API routes.
// These endpoints carry no cookies/session today, so a permissive origin is
// low-risk; tighten this if cookie-based auth is added later.
const ALLOWED_ORIGIN = process.env.DESKTOP_APP_ORIGIN || "*";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export function middleware(request: NextRequest) {
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: corsHeaders() });
  }

  const response = NextResponse.next();
  for (const [key, value] of Object.entries(corsHeaders())) {
    response.headers.set(key, value);
  }
  return response;
}

export const config = {
  matcher: "/api/:path*",
};
