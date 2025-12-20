import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import type { SongMetric, Song } from "../types/songs.ts";
import SongForm from "../components/SongForm.tsx";
import TableSelectMetric from "../components/TableSelectMetric.tsx";
import type { Activity, DashboardContext } from "../types/dashboard.ts";

// Types
interface TableRow {
  id: number;
  first_line: string;
  [venue: string]: string | number | null | undefined;
  overall_usage_count?: number;
  overall_first_used?: string | null;
  overall_last_used?: string | null;
}

// Helper functions
function buildTableHeaderMap(
  activities: Activity[],
  metric: SongMetric
): Record<string, string> {
  const base = {
    first_line: "Song (First Line)",
  };

  const activityHeaders = Object.fromEntries(
    activities.map((a) => [a.slug, a.name])
  );

  const totals = {
    usage_count: { key: "overall_usage_count", label: "Total" },
    first_used: { key: "overall_first_used", label: "Any" },
    last_used: { key: "overall_last_used", label: "Any" },
  }[metric];

  return {
    ...base,
    ...activityHeaders,
    [totals.key]: totals.label,
  };
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

function processSongsForTable(
  songs: Song[],
  metric: SongMetric,
  selectedActivities: Activity[]
): TableRow[] {
  return songs.map((song) => {
    const activityValues = Object.fromEntries(
      Object.entries(song.activities)
        .filter(([slug]) => selectedActivities.some((a) => a.slug === slug))
        .map(([activity, data]) => [
          activity,
          normalizeMetric(data[metric], metric),
        ])
    );

    return {
      id: song.id,
      first_line: song.first_line,
      ...activityValues,
      ...(metric === "usage_count" && {
        overall_usage_count: song.overall.usage_count,
      }),
      ...(metric === "first_used" && {
        overall_first_used: song.overall.first_used,
      }),
      ...(metric === "last_used" && {
        overall_last_used: song.overall.last_used,
      }),
    };
  });
}

export default function SongSearchPage() {
  // States
  const { headerFilters, selectedActivities, filtersReady } =
    useOutletContext<DashboardContext>();
  const [metric, setMetric] = useState<SongMetric>("usage_count");
  const [songs, setSongs] = useState<Song[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    lyric: "",
    songType: "both",
    songKey: "",
    filterFirstUsedInRange: false,
    filterLastUsedInRange: true,
  });

  // Fetch song data when filters updated
  useEffect(() => {
    if (!filtersReady) return;

    async function fetchSongs() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();

        // Existing params
        if (headerFilters.from_date)
          params.append("from_date", headerFilters.from_date);
        if (headerFilters.to_date)
          params.append("to_date", headerFilters.to_date);
        headerFilters.church_activities.forEach((id) =>
          params.append("church_activity_id", id)
        );

        // Song filter params
        if (filters.lyric) params.append("lyric", filters.lyric);
        if (filters.songType && filters.songType !== "both")
          params.append("song_type", filters.songType);
        if (filters.songKey) params.append("song_key", filters.songKey);
        if (filters.filterFirstUsedInRange)
          params.append("first_used_in_range", "true");
        if (filters.filterLastUsedInRange)
          params.append("last_used_in_range", "true");

        const response = await fetch(
          `http://127.0.0.1:8000/songs/usages/summary?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Song[] = await response.json();
        setSongs(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSongs();
  }, [filters, headerFilters, filtersReady]);

  // Handler to update filters on form submit
  function handleFilterChange(newFilters: typeof filters) {
    setFilters(newFilters);
  }

  // Get headers and data for table component
  const headerMap = buildTableHeaderMap(selectedActivities, metric);
  const songs_processed = songs
    ? processSongsForTable(songs, metric, selectedActivities)
    : [];

  return (
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
  );
}
