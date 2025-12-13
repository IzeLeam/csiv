import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory rate limiter (per-process). Note: On serverless/edge,
// memory is not shared across instances; use a durable store for production.

type Bucket = { count: number; firstRequest: number };
const requests = new Map<string, Bucket>();

// Default global limits
const DEFAULT_LIMIT = 60; // max requests per interval per IP
const DEFAULT_INTERVAL_MS = 60_000; // 1 minute window

// Per-path overrides (e.g., stricter for propose-question)
const PATH_LIMITS: Record<string, { limit: number; intervalMs: number }> = {
  "/api/propose-question": { limit: 1, intervalMs: 60_000 },
  "/api/report-question": { limit: 1, intervalMs: 60_000 },
};

// Paths to skip (static files, assets, Next internal)
const SKIP_PATH_PREFIXES = [
  "/_next",
  "/static",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/public",
];

function getClientIp(req: NextRequest): string {
  const xfwd = req.headers.get("x-forwarded-for");
  if (xfwd) {
    const first = xfwd.split(",")[0].trim();
    if (first) return first;
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  // NextRequest.ip is available on some platforms (typed as string | undefined)
  const ip = (req as NextRequest & { ip?: string }).ip;
  if (ip) return ip;
  return "unknown";
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip rate limit for some paths
  if (SKIP_PATH_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const ip = getClientIp(req);
  const now = Date.now();

  // Determine limits for this path
  const override = PATH_LIMITS[pathname];
  const limit = override?.limit ?? DEFAULT_LIMIT;
  const intervalMs = override?.intervalMs ?? DEFAULT_INTERVAL_MS;

  let bucket = requests.get(ip);
  if (!bucket) {
    bucket = { count: 0, firstRequest: now };
    requests.set(ip, bucket);
  }

  // Reset if window elapsed
  if (now - bucket.firstRequest > intervalMs) {
    bucket.count = 0;
    bucket.firstRequest = now;
  }

  bucket.count += 1;

  if (bucket.count > limit) {
    const retryAfter = Math.ceil((bucket.firstRequest + intervalMs - now) / 1000);
    return new NextResponse(
      JSON.stringify({ message: "Too many requests, please try again later.", retryAfter }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(retryAfter),
        },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  // Apply proxy only to API routes, excluding internal assets
  matcher: ["/api/:path*"],
};
