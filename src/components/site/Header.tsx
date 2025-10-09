import Link from "next/link";

type Props = {
  siteTitle?: string;
};

export default function Header({
  siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE ?? "音のなき嘘",
}: Props) {
  return (
    <header className="sticky top-0 z-40 border-b bg-slate-900 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-20 sm:h-24 items-center gap-4">
          <Link
            href="/blog"
            className="shrink-0 text-2xl sm:text-3xl font-extrabold tracking-tight hover:opacity-90"
            aria-label={siteTitle}
          >
            {siteTitle}
          </Link>

          <form
            action="/blog"
            method="GET"
            className="ml-auto hidden min-w-0 items-center gap-3 sm:flex"
            role="search"
            aria-label="サイト内検索"
          >
            <input
              type="search"
              name="q"
              placeholder="検索…"
              className="w-60 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-white/40"
            />
            <button
              className="bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-white/40"
              aria-label="検索"
            >
              検索
            </button>
          </form>

          <Link
            href="/login"
            className="ml-3 px-2 py-1 text-xs text-white/70 transition hover:text-white"
          >
            管理者ログイン
          </Link>
        </div>

        <form
          action="/blog"
          method="GET"
          className="sm:hidden pb-4"
          role="search"
          aria-label="サイト内検索"
        >
          <input
            type="search"
            name="q"
            placeholder="検索…"
            className="w-full bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-400"
          />
        </form>
      </div>
    </header>
  );
}
