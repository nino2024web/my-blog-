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
  const form = await req.formData();
  const slug = String(form.get("slug") ?? "");
  const file = form.get("file") as File | null;
  if (!okSlug(slug) || !file)
    return new NextResponse("Bad request", { status: 400 });

  const buf = Buffer.from(await file.arrayBuffer());
  const dir = path.join(process.cwd(), "public", "images", slug);
  await fs.mkdir(dir, { recursive: true });
  const name = `${Date.now()}-${file.name.replace(/[^a-z0-9]/g, "-")}`;
  const p = path.join(dir, name);
  await fs.writeFile(p, buf);
  const url = `/images/${slug}/${name}`;
  return NextResponse.json({ url });
}
