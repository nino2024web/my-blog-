import { Post } from "@/lib/mdx";

export const isBook = (post: Post) =>
  post.meta?.type === "book" ||
  (Array.isArray(post.meta?.tags) && post.meta.tags.includes("book"));

export const toCategories = (posts: Post[]) => {
  const counts = new Map<string, number>();
  for (const post of posts) {
    const tags = Array.isArray(post.meta?.tags) ? post.meta.tags : [];
    for (const tag of tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
};