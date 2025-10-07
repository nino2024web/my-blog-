export default function Ad({ label = "Sponsored" }: { label?: string }) {
  if (process.env.NEXT_PUBLIC_ADS_ENABLED !== "true") return null; // フラグで切替
  return (
    <aside className="not-prose my-8 rounded-xl border p-4">
      <div className="text-xs uppercase tracking-wider text-gray-500">
        {label}
      </div>
      <div className="mt-2 aspect-[3/1] w-full grid place-items-center bg-gray-50 text-sm text-gray-500">
        広告枠
      </div>
    </aside>
  );
}
