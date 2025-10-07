export const runtime = "nodejs";
import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
const CONTENT_DIR = path.join(process.cwd(), "content");
const okSlug = (s: string) => /^[a-z0-9][a-z0-9\-]*[a-z0-9]$/.test(s);

export async function POST(req: Request) {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.AllOW_EDIT_ON_PROD !== "true"
  ) {
    return new NextResponse("Forbidden", { status: 403 });
  }
  const { slug, content } = await req.json();
  if (!slug || !okSlug(slug))
    return new NextResponse("Bad Request", { status: 400 });
  if (typeof content !== "string" || !content.trim())
    return new NextResponse("No content", { status: 400 });

  await fs.mkdir(CONTENT_DIR, { recursive: true });
  await fs.writeFile(path.join(CONTENT_DIR, `${slug}.mdx`), content, "utf-8");
  return NextResponse.json({ saved: true });
}
