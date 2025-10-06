import { listPosts } from "@/lib/mdx";
import Link from "next/link";

export const revalidate = 60;

export default async function BlogList() {
    const posts = await listPosts();
    return (
        <main className="mx-auto max-w-3xl p-5">
            <h1 className="text-2xl font-bold mb-4">Blog</h1>
            <ul className="space-y-3">
                {posts.map((post) => (
                    <li key={post.slug}>
                        <Link className="underline" href={`/blog/${post.slug}`}>{post.meta.title}</Link>
                        <div className="text-sm text-gray-500">{post.meta.date}</div>
                    </li>
                ))}
            </ul>
        </main>
    );
}