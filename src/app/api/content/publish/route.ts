export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
const execP = promisify(execFile);
const okSlug = (s:string)=>/^[a-z0-9\-]+$/.test(s);


export async function POST(req: Request) {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.AllOW_EDIT_ON_PROD !== "true"
  ) {
    return new NextResponse("Forbidden", { status: 403 });
  }
  const { slug } = await req.json();
  if (!okSlug(slug)) return new NextResponse("Bad slug", { status: 400 });
  const name = process.env.GIT_AUTHOR_NAME ?? "owner";
  const email = process.env.GIT_AUTHOR_EMAIL ?? "owner@example.com";
  await execP("git", ["config", "user.name", name]);
  await execP("git", ["config", "user.email", email]);
  await execP("git", ["add", `content/${slug}.mdx`, `public/images/${slug}`]);
  await execP("git", ["commit", "-m", `post: ${slug}`]).catch(() => {});
  await execP("git", ["push", "origin", "main"]);
  return NextResponse.json({ pushed: true });
}
