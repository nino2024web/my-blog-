import Link from "next/link";
import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import * as Mdx from "@/components/mdx";
import { listPosts, type Post } from "@/lib/mdx";

export const revalidate = 60;
export const metadata = { title: "Blog" };

type SP = Promise<Record<string, string | string[] | undefined>>;
const PAGE_SIZE = 10;

const isBook = (p: Post) =>
  p.meta?.type === "book" ||
  (Array.isArray(p.meta?.tags) && p.meta.tags.includes("book"));

const toCategories = (posts: Post[]) => {
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
  const posts = (await listPosts()).sort((a, b) => {
    const dateA = a.meta.date ? new Date(a.meta.date).getTime() : 0;
    const dateB = b.meta.date ? new Date(b.meta.date).getTime() : 0;
    return dateB - dateA;
  });

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
      <main className="bg-slate-100 dark:bg-zinc-950 min-h-screen">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
          <h1 className="text-2xl font-bold mb-6">Blog</h1>
          {q ? (
            <p className="text-gray-500">
              “{q}” に一致する記事はありません。
              <Link className="underline" href="/blog">
                クリア
              </Link>
            </p>
          ) : (
            <p className="text-gray-500">まだ記事がありません。</p>
          )}
        </div>
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
  const components = Mdx as unknown as MDXRemoteProps["components"];

  return (
    <main className="bg-slate-100 dark:bg-zinc-950 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 grid gap-8 lg:grid-cols-[1fr_320px]">
        <section className="space-y-8 bg-white dark:bg-zinc-900 p-8 shadow-sm">
          <article className="space-y-6">
            <header className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                <Link
                  href={`/blog/${featured.slug}`}
                  className="hover:underline"
                >
                  {featured.meta.title ?? featured.slug}
                </Link>
              </h2>
              <p className="text-sm text-gray-500">{featured.meta.date}</p>
              {featured.meta.description && (
                <p className="text-gray-700 dark:text-gray-300">
                  {featured.meta.description}
                </p>
              )}
              {Array.isArray(featured.meta.tags) && (
                <div className="flex flex-wrap gap-2">
                  {featured.meta.tags.map((t: string) => (
                    <span
                      key={t}
                      className="bg-gray-200 px-2 py-0.5 text-xs text-gray-700 dark:bg-zinc-800 dark:text-gray-200"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </header>

            <div className="prose max-w-none dark:prose-invert">
              <MDXRemote
                source={featured.content}
                options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
                components={components}
              />
            </div>

            <div>
              <Link
                href={`/blog/${featured.slug}`}
                className="inline-flex items-center text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                続きを読む
              </Link>
            </div>
          </article>

          <ul className="space-y-6">
            {pageItems.map((p) => (
              <li key={p.slug} className="pb-4">
                <Link
                  href={`/blog/${p.slug}`}
                  className="text-lg font-semibold hover:underline"
                >
                  {p.meta.title ?? p.slug}
                </Link>
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
              className="mt-4 flex items-center justify-center gap-3 text-sm"
              aria-label="ページネーション"
            >
              {page > 1 ? (
                <Link
                  href={`/blog?page=${Math.max(1, page - 1)}${
                    q ? `&q=${encodeURIComponent(q)}` : ""
                  }`}
                  className="bg-gray-200 px-4 py-2 text-gray-700 transition hover:bg-gray-300 dark:bg-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-700"
                >
                  前へ
                </Link>
              ) : (
                <span className="bg-gray-200 px-4 py-2 text-gray-400 dark:bg-zinc-800 dark:text-zinc-600">
                  前へ
                </span>
              )}
              <span className="text-gray-600 dark:text-gray-300">
                {page} / {totalPages}
              </span>
              {page < totalPages ? (
                <Link
                  href={`/blog?page=${Math.min(totalPages, page + 1)}${
                    q ? `&q=${encodeURIComponent(q)}` : ""
                  }`}
                  className="bg-gray-200 px-4 py-2 text-gray-700 transition hover:bg-gray-300 dark:bg-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-700"
                >
                  次へ
                </Link>
              ) : (
                <span className="bg-gray-200 px-4 py-2 text-gray-400 dark:bg-zinc-800 dark:text-zinc-600">
                  次へ
                </span>
              )}
              <Link
                href="/blog?page=1"
                className="ml-3 text-gray-700 underline dark:text-gray-200"
              >
                全ページ一覧
              </Link>
            </nav>
          )}
        </section>

        <aside className="bg-gray-100 p-6 text-sm text-gray-800 dark:bg-zinc-900 dark:text-gray-200">
          <section className="space-y-3">
            <h3 className="text-xs font-semibold tracking-wide text-gray-600 dark:text-gray-400">
              最新の記事
            </h3>
            <ul className="space-y-2">
              {latest5.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="hover:underline">
                    {p.meta.title ?? p.slug}
                  </Link>
                  <div className="text-xs text-gray-500">{p.meta.date}</div>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3 pt-6">
            <h3 className="text-xs font-semibold tracking-wide text-gray-600 dark:text-gray-400">
              最近紹介した本
            </h3>
            {book5.length === 0 ? (
              <p className="text-xs text-gray-500">まだありません。</p>
            ) : (
              <ul className="space-y-2">
                {book5.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/blog/${p.slug}`} className="hover:underline">
                      {p.meta.title ?? p.slug}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="space-y-3 pt-6">
            <h3 className="text-xs font-semibold tracking-wide text-gray-600 dark:text-gray-400">
              カテゴリー
            </h3>
            <div className="flex flex-wrap gap-2">
              {toCategories(filtered)
                .slice(0, 50)
                .map(([tag, count]) => (
                  <Link
                    key={tag}
                    href={`/blog?q=${encodeURIComponent(tag)}`}
                    className="bg-white px-2 py-0.5 text-xs text-gray-700 transition hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-700"
                  >
                    #{tag} <span className="text-gray-400">({count})</span>
                  </Link>
                ))}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
