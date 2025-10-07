export default function YouTube({ id }: { id: string }) {
  return (
    <div className="not-prose my-6 aspect-video">
      <iframe
        className="w-full h-full rounded-lg"
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title="YouTube video"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
