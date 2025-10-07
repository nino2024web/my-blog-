"use client";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[ぁ-んァ-ン]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);

export default function Write() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [tags, setTags] = useState("memo");
  const [description, setDescription] = useState("");
  const [published, setPublished] = useState(false);
  const [body, setBody] = useState("# 見出し\n\n本文を書いてください。");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!slug && title) setSlug(slugify(title));
  }, [title]);

  useEffect(() => {
    const key = "write_autosave";
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const j = JSON.parse(saved);
        setTitle(j.title ?? "");
        setSlug(j.slug ?? "");
        setDate(j.date ?? date);
        setTags(j.tags ?? "memo");
        setDescription(j.description ?? "");
        setPublished(!!j.published);
        setBody(j.body ?? body);
      } catch {}
    }
  }, []);
  useEffect(() => {
    const key = "write_autosave";
    localStorage.setItem(
      key,
      JSON.stringify({ title, slug, date, tags, description, published, body })
    );
  }, [title, slug, date, tags, description, published, body]);

  const mdx = `---
title: "${title || slug}"
date: "${date}"
tags: [${tags
    .split(",")
    .map((t) => `"${t.trim()}"`)
    .join(", ")}]
description: "${description}"
published: ${published}
---

${body}
`;

  async function saveDraft() {
    if (!slug) {
      setMsg("slug を入力してください");
      return;
    }
    setSaving(true);
    setMsg("保存中…");
    const r = await fetch("/api/content/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, content: mdx }),
    });
    setSaving(false);
    setMsg(r.ok ? `下書き保存: content/${slug}.mdx` : `保存失敗 ${r.status}`);
  }

  async function publish() {
    setMsg("公開処理中…");

    const r1 = await fetch("/api/content/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        content: mdx.replace(/published:\s*false/, "published: true"),
      }),
    });
    if (!r1.ok) {
      setMsg(`保存失敗 ${r1.status}`);
      return;
    }
    const r2 = await fetch("/api/content/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    setMsg(r2.ok ? "公開完了（git push 済）" : `push失敗 ${r2.status}`);
  }

  async function handlePasteOrDrop(file: File) {
    if (!file || !slug) return;
    setMsg("画像アップロード中…");
    const fd = new FormData();
    fd.append("slug", slug);
    fd.append("file", file);
    const r = await fetch("/api/content/upload", { method: "POST", body: fd });
    if (!r.ok) {
      setMsg(`アップロード失敗 ${r.status}`);
      return;
    }
    const { url } = (await r.json()) as { url: string };

    const ta = textareaRef.current!;
    const insert = `\n\n![${file.name}](${url})\n\n`;
    const start = ta.selectionStart,
      end = ta.selectionEnd;
    const next = body.slice(0, start) + insert + body.slice(end);
    setBody(next);
    setMsg("画像を挿入しました");
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-bold mb-4">記事を書く</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="space-y-2">
          <input
            className="w-full border rounded p-2"
            placeholder="タイトル"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="w-full border rounded p-2"
            placeholder="スラッグ（英数と-）"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <div className="grid grid-cols-3 gap-2">
            <input
              className="border rounded p-2"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <input
              className="border rounded p-2 col-span-2"
              placeholder="タグ（,区切り）"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <input
            className="w-full border rounded p-2"
            placeholder="説明（meta用）"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            公開（published）
          </label>

          <div className="flex gap-2 text-sm">
            <button
              onClick={() => setBody((b) => b + "\n\n## 見出し\n")}
              className="px-2 py-1 rounded border"
            >
              H2
            </button>
            <button
              onClick={() => setBody((b) => b + "\n\n**強調**\n")}
              className="px-2 py-1 rounded border"
            >
              B
            </button>
            <button
              onClick={() => setBody((b) => b + "\n\n```ts\n// code\n```\n")}
              className="px-2 py-1 rounded border"
            >
              Code
            </button>
          </div>

          <textarea
            ref={textareaRef}
            className="w-full h-80 border rounded p-2 font-mono"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onPaste={async (e) => {
              const f = Array.from(e.clipboardData?.files ?? [])[0];
              if (f) {
                e.preventDefault();
                await handlePasteOrDrop(f);
              }
            }}
            onDrop={async (e) => {
              e.preventDefault();
              const f = Array.from(e.dataTransfer?.files ?? [])[0];
              if (f) await handlePasteOrDrop(f);
            }}
          />

          <div className="flex gap-2">
            <button
              disabled={saving}
              onClick={saveDraft}
              className="px-4 py-2 rounded bg-black text-white"
            >
              下書き保存
            </button>
            <button onClick={publish} className="px-4 py-2 rounded border">
              公開（git push）
            </button>
          </div>
          {msg && <p className="text-sm text-gray-600">{msg}</p>}
        </section>

        <section className="prose max-w-none">
          <h2>プレビュー</h2>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
        </section>
      </div>
    </main>
  );
}
