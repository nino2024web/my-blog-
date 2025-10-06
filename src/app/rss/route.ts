import { listPosts } from "@/lib/mdx";

export async function GET() {
  const site = process.env.SITE_URL ?? "http://localhost:3000";
  const posts = (await listPosts()).slice(0, 20);

  const items = posts
    .map((p) => {
      const url = `${site}/blog/${p.slug}`;
      const title = escapeXml(p.meta.title ?? p.slug);
      const desc = escapeXml(p.meta.description ?? "");
      const pubDate = new Date(p.meta.date ?? Date.now()).toUTCString();
      return `<item>
        <title>${url}</title>
        <guid>${url}</guid>
        <pubDate>${pubDate}</pubDate>
        <description><![CDATA[${desc}]]></description>
        </item>`;
    })
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
  <channel>
  <title>${escapeXml(process.env.RSS_TITLE ?? "My Blog")}</title>
  <link>${site}</link>
  <description>${escapeXml(
    process.env.RSS_DESCRIPTION ?? "Updates"
  )}</description>
  <language>ja</language>
  ${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=UTF-8" },
  });
}

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
