import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type Post = {
  slug: string;
  content: string;
  meta: {
    title: string;
    date: string;
    type?: string;
    tags?: string[];
    description?: string;
    published: boolean;
  };
};

export async function listPosts(): Promise<Post[]> {
  const files = await fs.readdir(CONTENT_DIR);
  const mdx = files.filter((file) => file.endsWith(".mdx"));
  const posts = await Promise.all(
    mdx.map(async (file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = await fs.readFile(path.join(CONTENT_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      return { slug, content, meta: data as Post["meta"] };
    })
  );
  return posts
    .filter((post) => post.meta.published !== false)
    .sort((a, b) => b.meta.date.localeCompare(a.meta.date));
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const raw = await fs.readFile(
      path.join(CONTENT_DIR, `${slug}.mdx`),
      "utf-8"
    );
    const { data, content } = matter(raw);
    return { slug, content, meta: data as Post["meta"] };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}
