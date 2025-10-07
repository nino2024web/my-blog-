export default function TwoCol({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <div className="not-prose my-6 grid gap-4 md:grid-cols-2">
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}
