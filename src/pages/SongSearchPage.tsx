import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import type { SongMetric, Song } from "../types/songs.ts";
import DashboardPanel from "../components/DashboardPanel.tsx";
import SongForm from "../components/SongForm.tsx";
import TableSelectMetric from "../components/TableSelectMetric.tsx";
import type { Activity, DashboardContext } from "../types/dashboard.ts";
import { useAuthFetch } from "../hooks/useAuthFetch";
import FadeLoader from "../components/FadeLoader.tsx";

// Types
type CellValue = {
  display: React.ReactNode;
  hover?: string;
  to?: string;
};

interface TableRow {
  id: number;
  first_line: CellValue;
  [key: string]: CellValue | number | string;
}

// Constants
export const DEFAULT_SONG_FILTERS = {
  lyric: "",
  songType: "both",
  songKey: "",
  filterUsedInRange: true,
  filterFirstUsedInRange: false,
  filterLastUsedInRange: false,
};

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

function normalizeMetric(value: any, metric: SongMetric): number | null {
  if (metric === "first_used" || metric === "last_used") {
    if (!value) return null;

    const date = new Date(value);
    const now = new Date();

    // Calculate difference in milliseconds
    const diffMs = now.getTime() - date.getTime();

    // Convert milliseconds to weeks
    const weeksAgo = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));

    // Offset by 1 to make easier to compare with next week
    return weeksAgo + 1;
  }
  return value ?? 0;
}

function formatDateDDMMYY(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = String(date.getFullYear());

  return `${day}/${month}/${year}`;
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
        .map(([activity, data]) => {
          if (metric === "first_used" || metric === "last_used") {
            return [
              activity,
              {
                display: normalizeMetric(data[metric], metric), // weeks ago
                hover: formatDateDDMMYY(data[metric]), // date string shown on hover
              },
            ];
          } else {
            return [
              activity,
              {
                display: data[metric] ?? 0,
                hover: undefined, // No hover tooltip for usage_count
              },
            ];
          }
        })
    );

    let overallDisplay: number | null = null;
    let overallHover: string | undefined = undefined;

    if (metric === "usage_count") {
      overallDisplay = song.overall.usage_count;
      overallHover = undefined;
    } else if (metric === "first_used" || metric === "last_used") {
      overallDisplay = normalizeMetric(song.overall[metric], metric);
      overallHover = formatDateDDMMYY(song.overall[metric]);
    }

    return {
      id: song.id,
      first_line: {
        display: song.first_line,
        to: `/songs/${song.id}`,
        hover: "View song details",
      },
      ...activityValues,
      ...(metric === "usage_count" && {
        overall_usage_count: { display: overallDisplay, hover: overallHover },
      }),
      ...(metric === "first_used" && {
        overall_first_used: { display: overallDisplay, hover: overallHover },
      }),
      ...(metric === "last_used" && {
        overall_last_used: { display: overallDisplay, hover: overallHover },
      }),
    };
  });
}

export default function SongSearchPage() {
  // States
  const { headerFilters, selectedActivities, filtersReady } =
    useOutletContext<DashboardContext>();
  const [metric, setMetric] = useState<SongMetric>("last_used");
  const [songs, setSongs] = useState<Song[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState(DEFAULT_SONG_FILTERS);


  const authFetch = useAuthFetch();

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
        if (filters.filterUsedInRange) params.append("used_in_range", "true");
        if (filters.filterFirstUsedInRange)
          params.append("first_used_in_range", "true");
        if (filters.filterLastUsedInRange)
          params.append("last_used_in_range", "true");

        const response = await authFetch(
          `/songs/usages/summary?${params.toString()}`
        );
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
    <div className="flex flex-wrap gap-2 md:gap-4 my-4 mx-2 md:mx-3">
      <DashboardPanel className="w-full">
        <SongForm filters={filters} defaultFilters={DEFAULT_SONG_FILTERS} onFilterChange={handleFilterChange} />
      </DashboardPanel>
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Table */}
      <DashboardPanel className="w-full">
        <FadeLoader loading={loading} error={error} minHeight="min-h-[450px]">
          <TableSelectMetric
            headerMap={headerMap}
            textHeaders={["first_line"]}
            data={songs_processed}
            title="Results"
            metric={metric}
            setMetric={setMetric}
          />
        </FadeLoader>
      </DashboardPanel>
    </div>
  );
}
