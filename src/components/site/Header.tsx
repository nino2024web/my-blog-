type Props = {
  siteTitle?: string;
};

export default function Header({
  siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE ?? "音のなき嘘",
}: Props) {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-black/50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex h-20 sm:h-24 items-center gap-3">
          <a
            href="/blog"
            className="shrink-0 text-2xl sm:text-3xl font-extrabold tracking-tight hover:opacity-90"
            aria-label={siteTitle}
          >
            {siteTitle}
          </a>

          <form
            action="/blog"
            method="GET"
            className="ml-auto hidden min-w-0 items-center gap-2 sm:flex"
            role="search"
            aria-label="サイト内検索"
          >
            <input
              type="search"
              name="q"
              placeholder="検索…"
              className="w-60 rounded-full border px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
            />
            <button
              className="rounded-full border px-4 py-1.5 text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
              aria-label="検索"
            >
              検索
            </button>
          </form>

          <a
            href="/login"
            className="ml-2 rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
          >
            管理者ログイン
          </a>
        </div>

        <form
          action="/blog"
          method="GET"
          className="sm:hidden pb-3"
          role="search"
          aria-label="サイト内検索"
        >
          <input
            type="search"
            name="q"
            placeholder="検索…"
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
          />
        </form>
      </div>
    </header>
  );
}
