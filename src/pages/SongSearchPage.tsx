import { useState } from "react";
import type { SongMetric } from "../types/songs.ts"
import SongForm from "../components/SongForm.tsx";
import TableSelectMetric from "../components/TableSelectMetric.tsx";

import songs from "../../sample_data/song_list.json";
import HeaderOverview from "../components/HeaderOverview.tsx";

const baseHeaderMap = {
  first_line: "Song (First Line)",
  newland: "Newland",
  riverside: "Riverside",
  hessle: "Hessle",
  orchard_park: "Orchard Park",
  network: "Network",
};

function getHeaderMap(metric: SongMetric) {
  const totalHeaders: Record<SongMetric, { key: string; label: string }> = {
    usage_count: { key: "overall_usage_count", label: "Total" },
    first_used: { key: "overall_first_used", label: "Any" },
    last_used: { key: "overall_last_used", label: "Any" },
  };

  const header = totalHeaders[metric];
  if (!header) throw new Error(`Unsupported metric: ${metric}`);

  return {
    ...baseHeaderMap,
    [header.key]: header.label,
  };
}

interface VenueData {
  usage_count: number;
  first_used: string | null; // ISO date string or null
  last_used: string | null; // ISO date string or null
}

interface OverallData {
  usage_count: number;
  first_used: string | null;
  last_used: string | null;
}

interface Song {
  id: number;
  first_line: string;
  venues: Record<string, VenueData>; // e.g. { newland: VenueData, riverside: VenueData, ... }
  overall: OverallData;
}

// The flattened row your table expects
interface TableRow {
  id: number;
  first_line: string;
  [venue: string]: string | number | undefined; // venue keys dynamically added here
  overall_usage_count?: number;
  overall_first_used?: string;
  overall_last_used?: string;
}

function normalizeMetric(value: any, metric: SongMetric): string | number {
  if (metric === "first_used" || metric === "last_used") {
    if (!value) return "";
    
    const date = new Date(value);
    const now = new Date();

    // Calculate difference in milliseconds
    const diffMs = now.getTime() - date.getTime();

    // Convert milliseconds to weeks
    const weeksAgo = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));

    return weeksAgo;
  }
  return value ?? 0;
}

function processSongsForTable(songs: Song[], metric: SongMetric): TableRow[] {
  return songs.map((song) => {
    const venueValues = Object.fromEntries(
      Object.entries(song.venues).map(([venue, data]) => [
        venue,
        normalizeMetric(data[metric], metric),
      ])
    );

    return {
      id: song.id,
      first_line: song.first_line,
      ...venueValues,
      ...(metric === "usage_count" && {
        overall_usage_count: normalizeMetric(song.overall.usage_count, metric),
      }),
      ...(metric === "first_used" && {
        overall_first_used: normalizeMetric(song.overall.first_used, metric),
      }),
      ...(metric === "last_used" && {
        overall_last_used: normalizeMetric(song.overall.last_used, metric),
      }),
    };
  });
}

function SongSearchPage() {
  const [metric, setMetric] = useState<SongMetric>("usage_count");
  const headerMap = getHeaderMap(metric);
  const songs_processed = processSongsForTable(songs, metric);

  return (
    <>
      <HeaderOverview />
      <div className="flex flex-wrap gap-5 m-5">
        <SongForm />

        {/* Table */}
        <TableSelectMetric
          headerMap={headerMap}
          data={songs_processed}
          title="Results"
          metric={metric}
          setMetric={setMetric}
        />
      </div>
    </>
  );
}

export default SongSearchPage;
