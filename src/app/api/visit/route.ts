import { recordVisit } from "@/lib/visits";

// the beacon posts here once per page load; the IP and location come from the
// headers Vercel sets, never from the request body
const clip = (value: string | null | undefined, max: number) =>
  (value ?? "").slice(0, max);

// Vercel URL-encodes the city name; a malformed one is kept as sent
const decode = (value: string | null) => {
  try {
    return decodeURIComponent(value ?? "");
  } catch {
    return value ?? "";
  }
};

export async function POST(request: Request) {
  const headers = request.headers;
  const ip =
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown";

  let path = "/";
  try {
    const body = (await request.json()) as { path?: unknown };
    if (typeof body.path === "string") path = body.path;
  } catch {
    // an empty or malformed beacon still counts as a visit
  }

  try {
    await recordVisit({
      at: new Date().toISOString(),
      ip: clip(ip, 64),
      country: clip(headers.get("x-vercel-ip-country"), 8),
      city: clip(decode(headers.get("x-vercel-ip-city")), 64),
      path: clip(path, 200),
      referrer: clip(headers.get("referer"), 300),
      ua: clip(headers.get("user-agent"), 300),
    });
  } catch (error) {
    console.error("visit not recorded", error);
  }

  return new Response(null, { status: 204 });
}
