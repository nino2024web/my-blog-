import { NextResponse } from "next/server";
export async function POST() {
  return new NextResponse("OK", {
    headers: {
      "Set-Cookie":
        "owner_session=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax",
    },
  });
}
