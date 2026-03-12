import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import CopyButton from "./CopyButton";
import { FaRegEdit } from "react-icons/fa";
import SliderSwitch from "./SliderSwitch";

type SongYouTubeLinkWithUsageType = {
  id: number;
  url: string;
  start_seconds: number | null;
  end_seconds: number | null;
  is_featured: boolean;
  title: string;
  description: string | null;
  thumbnail_key: string | null;
  usage_id: number;
  used_date: string;
  church_activity_id: number;
};

type SongYouTubeLinksProps = {
  links: SongYouTubeLinkWithUsageType[];
  isEditor: boolean;
  songId: number;
};

function buildYouTubeUrl(url: string, start?: number | null) {
  const params = new URLSearchParams();
  if (start) params.append("t", start.toString());

  return `${url}&${params.toString()}`;
}

export default function SongYouTubeLinks({
  links,
  isEditor = false,
  songId,
}: SongYouTubeLinksProps) {
  const [editMode, setEditMode] = useState<boolean>(false);

  // Sort links: featured first, then reverse chronological by used_date
  const sortedLinks = useMemo(() => {
    return [...links].sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return new Date(b.used_date).getTime() - new Date(a.used_date).getTime();
    });
  }, [links]);

  if (!links.length) {
    return (
      <div>
        <h2 className="text-purple-900 font-bold text-xl mb-4">
          YouTube Links
        </h2>
        <p className="text-gray-500">
          No YouTube links available for this time range.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h2 className="text-purple-900 font-bold text-lg">YouTube Links</h2>
        {links.length && isEditor && (
          <SliderSwitch
            ariaLabel="Toggle Edit Mode"
            label="Edit"
            checked={editMode}
            setChecked={setEditMode}
          />
        )}
      </div>
      <div className="max-h-128 overflow-y-auto">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-4">
          {sortedLinks.map((link) => {
            const thumbnail =
              link.thumbnail_key || "/images/video_placeholder.webp";

            const title = link.title.split(" - ")[0];

            return (
              <div
                key={link.id}
                className="group border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition hover:cursor-pointer bg-white relative"
              >
                {/* Clickable overlay */}
                {editMode ? (
                  <Link
                    to={`/songs/links/${link.id}/edit`}
                    state={{ songId: songId }}
                    className="absolute inset-0 z-10"
                    title="Go to edit page (opens in new tab)"
                  />
                ) : (
                  <a
                    href={buildYouTubeUrl(link.url, link.start_seconds)}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute inset-0 z-10"
                    title="Watch on YouTube (opens in new tab)"
                  />
                )}

                {/* Thumbnail */}
                <div className="relative w-full aspect-video overflow-hidden">
                  <img
                    src={thumbnail}
                    alt={link.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = "/images/video_placeholder.webp";
                    }}
                  />

                  {link.is_featured && (
                    <span className="absolute top-1 right-2 text-yellow-400 text-3xl z-20">
                      ★
                    </span>
                  )}
                </div>

                {/* Text */}
                <div className="p-3 flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{title}</h4>
                    {link.description && (
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {link.description}
                      </p>
                    )}
                  </div>
                  {editMode ? (
                    <div>
                      <FaRegEdit />
                    </div>
                  ) : (
                    <div className="z-20">
                      <CopyButton value={link.url} label="Copy url" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
