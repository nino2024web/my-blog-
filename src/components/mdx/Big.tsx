type Props = {
  children: React.ReactNode;
  size?: "md" | "lg" | "xl" | "2xl" | "3xl";
  color?: "default" | "rose" | "blue" | "emerald" | "amber" | "slate";
  weight?: "normal" | "semibold" | "bold";
};
const S = {
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
};
const C = {
  default: "text-inherit",
  rose: "text-rose-600",
  blue: "text-blue-600",
  emerald: "text-emerald-600",
  amber: "text-amber-600",
  slate: "text-slate-700 dark:text-slate-300",
};
const W = {
  normal: "font-normal",
  semibold: "font-semibold",
  bold: "font-bold",
};

export default function Big({
  children,
  size = "2xl",
  color = "default",
  weight = "bold",
}: Props) {
  return (
    <div className={`not-prose ${S[size]} ${C[color]} ${W[weight]}`}>
      {children}
    </div>
  );
}
