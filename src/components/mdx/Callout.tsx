type Props = { type?: "info"|"warn"|"tip"; title?: string; children: React.ReactNode };
const styles = {
  info:  "border-sky-300 bg-sky-50 text-sky-900 dark:bg-sky-900/20",
  warn:  "border-amber-300 bg-amber-50 text-amber-900 dark:bg-amber-900/20",
  tip:   "border-emerald-300 bg-emerald-50 text-emerald-900 dark:bg-emerald-900/20",
};
export default function Callout({ type="info", title, children }: Props) {
  return (
    <aside className={`not-prose my-6 border rounded-xl p-4 ${styles[type]}`}>
      {title && <div className="font-semibold mb-1">{title}</div>}
      <div className="[&>p:last-child]:mb-0">{children}</div>
    </aside>
  );
}