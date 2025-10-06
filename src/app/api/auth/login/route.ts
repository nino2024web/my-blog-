import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { secret } = await req.json();

  if (secret !== process.env.OWNER_SECRET) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const ts = Date.now().toString();
  const enc = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(process.env.SESSION_SECRET!),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const mac = await crypto.subtle.sign("HMAC", key, enc.encode(ts));
  const macHex = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return new NextResponse("OK", {
    headers: {
      "Set-Cookie": `owner_session=${ts}.${macHex}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 *
        60 * 24 * 30}`,
    },
  });
}
