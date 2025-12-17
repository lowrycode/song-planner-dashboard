import { useState, useEffect } from "react";
import type { SongMetric } from "../types/songs.ts";
import SongForm from "../components/SongForm.tsx";
import TableSelectMetric from "../components/TableSelectMetric.tsx";
import HeaderOverview from "../components/HeaderOverview.tsx";

const baseHeaderMap = {
  first_line: "Song (First Line)",
  Newland: "Newland",
  Riverside: "Riverside",
  Hessle: "Hessle",
  Orchard_Park: "Orchard Park",
  Network: "Network",
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
  const [songs, setSongs] = useState<Song[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [filters, setFilters] = useState({
    lyric: "",
    songType: "both",
    songKey: "",
    filterFirstUsedInRange: false,
    filterLastUsedInRange: false,
  });

  const [headerFilters, setHeaderFilters] = useState({
    from_date: "",
    to_date: "",
    services: [] as string[],
  });

  useEffect(() => {
    async function fetchSongs() {
      setLoading(true);
      setError(null);

      try {
        // Optionally send filters as query params
        const params = new URLSearchParams();

        if (filters.lyric) params.append("lyric", filters.lyric);
        if (filters.songType !== "both") params.append("song_type", filters.songType);
        if (filters.songKey) params.append("song_key", filters.songKey);
        if (filters.filterFirstUsedInRange) params.append("first_used_in_range", "true");
        if (filters.filterLastUsedInRange) params.append("last_used_in_range", "true");

        // HeaderOverview filters
        if (headerFilters.from_date) params.append("from_date", headerFilters.from_date);
        if (headerFilters.to_date) params.append("to_date", headerFilters.to_date);
        if (headerFilters.services.length > 0) {
          // Append multiple services as repeated params or comma separated
          headerFilters.services.forEach((service) => params.append("used_at", service));
          // Or params.append("services", headerFilters.services.join(","));
        }

        const url = `http://127.0.0.1:8000/songs/usage-summary?${params.toString()}`;
  
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Song[] = await response.json();
        setSongs(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch songs");
      } finally {
        setLoading(false);
      }
    }

    fetchSongs();
  }, [filters, headerFilters]);

  const headerMap = getHeaderMap(metric);
  const songs_processed = songs ? processSongsForTable(songs, metric) : [];

  // Handler to update filters on form submit
  function handleFilterChange(newFilters: typeof filters) {
    setFilters(newFilters);
  }

  return (
    <>
      <HeaderOverview headerFilters={headerFilters} setHeaderFilters={setHeaderFilters} />
      <div className="flex flex-wrap gap-5 m-5">
        <SongForm filters={filters} onFilterChange={handleFilterChange} />
        {loading && <p>Loading songs...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {/* Table */}
        {!loading && !error && (
          <TableSelectMetric
            headerMap={headerMap}
            data={songs_processed}
            title="Results"
            metric={metric}
            setMetric={setMetric}
          />
        )}
      </div>
    </>
  );
}

export default SongSearchPage;
