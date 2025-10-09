import { listPosts } from "@/lib/mdx";
import Ad from "@/components/mdx/Ad";

export const revalidate = 60;
export const metadata = { title: "Blog" };

type SP = Promise<Record<string, string | string[] | undefined>>;
const PAGE_SIZE = 10;

const isBook = (p: any) =>
  p.meta?.type === "book" ||
  (Array.isArray(p.meta?.tags) && p.meta.tags.includes("book"));

const toCategories = (posts: any[]) => {
  const m = new Map<string, number>();
  for (const p of posts)
    for (const t of Array.isArray(p.meta?.tags) ? p.meta.tags : [])
      m.set(t, (m.get(t) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
};

const normalize = (s: string) => s.toLowerCase();

export default async function BlogIndex({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const page = Math.max(1, Number(sp.page ?? 1));
  const posts = (await listPosts()).sort(
    (a: any, b: any) =>
      new Date(b.meta?.date ?? 0).getTime() -
      new Date(a.meta?.date ?? 0).getTime()
  );

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

  if (!filtered.length) {
    return (
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        <h1 className="text-2xl font-bold mb-6">Blog</h1>
        {q ? (
          <p className="text-gray-500">
            “{q}” に一致する記事はありません。
            <a className="underline" href="/blog">
              クリア
            </a>
          </p>
        ) : (
          <p className="text-gray-500">まだ記事がありません。</p>
        )}
      </main>
    );
  }

  const [featured, ...rest] = filtered;
  const total = rest.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = rest.slice(start, start + PAGE_SIZE);

  const latest5 = filtered.slice(0, 5);
  const book5 = filtered.filter(isBook).slice(0, 5);
  const categories = toCategories(filtered);

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <section className="space-y-8">
          <article className="rounded-2xl border p-6 shadow-sm bg-white/70 dark:bg-black/30">
            <a href={`/blog/${featured.slug}`} className="block group">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight group-hover:underline">
                {featured.meta.title ?? featured.slug}
              </h2>
              <p className="mt-1 text-sm text-gray-500">{featured.meta.date}</p>
              {featured.meta.description && (
                <p className="mt-3 text-gray-700 dark:text-gray-300">
                  {featured.meta.description}
                </p>
              )}
              {Array.isArray(featured.meta.tags) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {featured.meta.tags.map((t: string) => (
                    <span
                      key={t}
                      className="rounded-full border px-2 py-0.5 text-xs text-gray-600"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </a>
          </article>

          <ul className="grid gap-6">
            {pageItems.map((p) => (
              <li key={p.slug} className="border-b pb-4">
                <a
                  href={`/blog/${p.slug}`}
                  className="text-lg font-semibold hover:underline"
                >
                  {p.meta.title ?? p.slug}
                </a>
                <div className="text-sm text-gray-500">{p.meta.date}</div>
                {p.meta.description && (
                  <p className="mt-1 text-gray-700 dark:text-gray-300">
                    {p.meta.description}
                  </p>
                )}
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <nav
              className="mt-4 flex items-center justify-center gap-2"
              aria-label="ページネーション"
            >
              <a
                href={`/blog?page=${Math.max(1, page - 1)}${
                  q ? `&q=${encodeURIComponent(q)}` : ""
                }`}
                className="rounded border px-3 py-1 text-sm aria-disabled:pointer-events-none aria-disabled:opacity-50"
                aria-disabled={page === 1}
              >
                前へ
              </a>
              <span className="text-sm text-gray-600">
                {page} / {totalPages}
              </span>
              <a
                href={`/blog?page=${Math.min(totalPages, page + 1)}${
                  q ? `&q=${encodeURIComponent(q)}` : ""
                }`}
                className="rounded border px-3 py-1 text-sm aria-disabled:pointer-events-none aria-disabled:opacity-50"
                aria-disabled={page === totalPages}
              >
                次へ
              </a>
              <a href="/blog?page=1" className="ml-3 text-sm underline">
                全ページ一覧
              </a>
            </nav>
          )}
        </section>

        <aside className="space-y-6">
          <section className="rounded-xl border p-4">
            <h3 className="mb-3 text-sm font-semibold tracking-wide text-gray-600">
              最新の記事
            </h3>
            <ul className="space-y-2">
              {latest5.map((p) => (
                <li key={p.slug} className="text-sm">
                  <a href={`/blog/${p.slug}`} className="hover:underline">
                    {p.meta.title ?? p.slug}
                  </a>
                  <div className="text-xs text-gray-500">{p.meta.date}</div>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border p-4">
            <h3 className="mb-3 text-sm font-semibold tracking-wide text-gray-600">
              最近紹介した本
            </h3>
            {book5.length === 0 ? (
              <p className="text-xs text-gray-500">まだありません。</p>
            ) : (
              <ul className="space-y-2">
                {book5.map((p) => (
                  <li key={p.slug} className="text-sm">
                    <a href={`/blog/${p.slug}`} className="hover:underline">
                      {p.meta.title ?? p.slug}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-xl border p-4">
            <h3 className="mb-3 text-sm font-semibold tracking-wide text-gray-600">
              カテゴリー
            </h3>
            <div className="flex flex-wrap gap-2">
              {toCategories(filtered)
                .slice(0, 50)
                .map(([tag, count]) => (
                  <a
                    key={tag}
                    href={`/blog?q=${encodeURIComponent(tag)}`}
                    className="rounded-full border px-2 py-0.5 text-xs text-gray-700 hover:bg-gray-50"
                  >
                    #{tag} <span className="text-gray-400">({count})</span>
                  </a>
                ))}
            </div>
          </section>

          <section className="rounded-xl border p-4"></section>
        </aside>
      </div>
    </main>
  );
}
