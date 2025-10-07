import Image from "next/image";
export default function Figure({
  src,
  alt,
  caption,
  w = 800,
  h = 450,
}: {
  src: string;
  alt: string;
  caption?: string;
  w?: number;
  h?: number;
}) {
  return (
    <figure className="not-prose my-6">
      <Image src={src} alt={alt} width={w} height={h} className="rounded-lg" />
      {caption && (
        <figcaption className="mt-2 text-sm text-gray-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
