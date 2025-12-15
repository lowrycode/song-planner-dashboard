import { FaRegCopyright } from "react-icons/fa";

type SongDetailsProps = {
  title: string;
  author?: string;
  copyright?: string;
};

function SongDetails({
  title,
  author = "Unknown Author",
  copyright = "No copyright info",
}: SongDetailsProps) {
  return (
    <div>
      <h2 className="text-purple-900 font-extrabold uppercase text-2xl">
        {title}
      </h2>
      <p>{author}</p>
      <div className="flex items-center gap-1.5 text-sm">
        <FaRegCopyright />
        <p> {copyright}</p>
      </div>
    </div>
  );
}

export default SongDetails;
