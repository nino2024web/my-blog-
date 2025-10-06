// src/app/blog/[slug]/page.tsx
import { getPost, listPosts } from "@/lib/mdx";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

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
  const { slug } = await params; // ← まず await
  const post = await getPost(slug);
  if (!post || post.meta.published === false) return notFound();

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold mb-2">{post.meta.title}</h1>
      <p className="text-gray-500 mb-8">{post.meta.date}</p>
      <article className="prose max-w-none">
        <MDXRemote
          source={post.content}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
        />
      </article>
    </main>
  );
}
