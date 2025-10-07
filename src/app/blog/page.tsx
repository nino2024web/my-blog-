import { listPosts } from "@/lib/mdx";

export const revalidate = 60;
export const metadata = { title: "Blog" };

function normalize(s: string) {
  return s.toLowerCase();
}

export default async function BlogList({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const posts = await listPosts();

  const filtered = q
    ? posts.filter((p) => {
        const hay = [
          p.meta.title ?? "",
          p.meta.description ?? "",
          ...(Array.isArray(p.meta.tags) ? p.meta.tags : []),
          p.slug,
        ]
          .filter(Boolean)
          .map(String)
          .map(normalize)
          .join(" ");
        return hay.includes(normalize(q));
      })
    : posts;

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 py-6">
      <h1 className="text-2xl font-bold mb-6">Blog</h1>

      {q && (
        <p className="mb-4 text-sm text-gray-600">
          検索: <span className="font-medium">“{q}”</span>（{filtered.length}件）
          <a href="/blog" className="ml-2 underline">クリア</a>
        </p>
      )}

      {filtered.length === 0 ? (
        <p className="text-gray-500">該当する記事がありません。</p>
      ) : (
        <ul className="grid gap-4">
          {filtered.map((p) => (
            <li key={p.slug} className="border-b pb-4">
              <a href={`/blog/${p.slug}`} className="text-lg font-semibold hover:underline">
                {p.meta.title ?? p.slug}
              </a>
              <div className="text-sm text-gray-500">{p.meta.date}</div>
              {p.meta.description && <p className="mt-1 text-gray-700">{p.meta.description}</p>}
              {Array.isArray(p.meta.tags) && p.meta.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {p.meta.tags.map((t: string) => (
                    <span key={t} className="rounded-full border px-2 py-0.5 text-xs text-gray-600">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
