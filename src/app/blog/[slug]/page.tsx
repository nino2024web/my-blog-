import Link from "next/link";
import { getPost, listPosts } from "@/lib/mdx";
import { notFound } from "next/navigation";
import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import * as Mdx from "@/components/mdx"
import { isBook, toCategories } from "../sidebar-utils";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await listPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post || post.meta.published === false) return notFound();

  const posts = await listPosts();
  const categories = toCategories(posts).slice(0, 50);
  const otherPosts = posts.filter((p) => p.slug !== post.slug);
  const latest5 = otherPosts.slice(0, 5);
  const book5 = otherPosts.filter(isBook).slice(0, 5);
  const components = Mdx as unknown as MDXRemoteProps["components"];
  const displayDate = typeof post.meta.date === "string" ? post.meta.date : "";
  const tags = Array.isArray(post.meta.tags) ? post.meta.tags : [];

  return (
    <main className="bg-slate-100 dark:bg-zinc-950 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 grid gap-8 lg:grid-cols-[1fr_320px]">
        <article className="space-y-6 bg-white p-8 shadow-sm dark:bg-zinc-900">
          <header className="space-y-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <time dateTime={displayDate || undefined}>{displayDate}</time>
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              {post.meta.title ?? post.slug}
            </h1>
            {post.meta.description && (
              <p className="text-gray-700 dark:text-gray-300">
                {post.meta.description}
              </p>
            )}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/blog?q=${encodeURIComponent(tag)}`}
                    className="bg-gray-200 px-2 py-0.5 text-xs text-gray-700 transition hover:bg-gray-300 dark:bg-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-700"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </header>

          <div className="prose max-w-none dark:prose-invert">
            <MDXRemote
              source={post.content}
              options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
              components={components}
            />
          </div>

          <div>
            <Link
              href="/blog"
              className="inline-flex items-center text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              記事一覧に戻る
            </Link>
          </div>
        </article>

        <aside className="bg-gray-100 p-6 text-sm text-gray-800 dark:bg-zinc-900 dark:text-gray-200">
          <section className="space-y-3">
            <h3 className="text-xs font-semibold tracking-wide text-gray-600 dark:text-gray-400">
              最新の記事
            </h3>
            {latest5.length === 0 ? (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                まだありません。
              </p>
            ) : (
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
            )}
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
              {categories.length === 0 ? (
                <p className="text-xs text-gray-500">まだありません。</p>
              ) : (
                categories.map(([tag, count]) => (
                  <Link
                    key={tag}
                    href={`/blog?q=${encodeURIComponent(tag)}`}
                    className="bg-white px-2 py-0.5 text-xs text-gray-700 transition hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-700"
                  >
                    #{tag} <span className="text-gray-400">({count})</span>
                  </Link>
                ))
              )}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
