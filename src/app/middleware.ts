import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = { matcher: ["/write/:path*", "/api/content/:path*"] };

const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 30; // 30日

async function hmac(ts: string, keyStr: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(keyStr),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const mac = await crypto.subtle.sign("HMAC", key, enc.encode(ts));
  return Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("owner_session")?.value;

  if (!token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  const [ts, sig] = token.split(".");
  if (!ts || !sig) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (Date.now() - Number(ts) > MAX_AGE_MS) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const expect = await hmac(ts, process.env.SESSION_SECRET!);
  if (sig !== expect) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
