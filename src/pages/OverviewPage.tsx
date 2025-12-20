import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import type { DashboardContext } from "../types/dashboard.ts";
import type { Song } from "../types/songs.ts";
import TableSortSearch from "../components/TableSortSearch.tsx";
import PieChart from "../components/PieChart.tsx";

export default function OverviewPage() {
  const { selectedActivities, headerFilters, filtersReady } =
    useOutletContext<DashboardContext>();
  const [songs, setSongs] = useState<any[]>([]);
  const [keySummary, setKeySummary] = useState<Record<string, number>>({});
  const [typeSummary, setTypeSummary] = useState<{
    hymn: number;
    song: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch song data
  useEffect(() => {
    if (!filtersReady) return;

    async function fetchSongs() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (headerFilters.from_date)
          params.append("from_date", headerFilters.from_date);
        if (headerFilters.to_date)
          params.append("to_date", headerFilters.to_date);
        headerFilters.church_activities.forEach((id) =>
          params.append("church_activity_id", id)
        );

        const [songsRes, keysRes, typesRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/songs/usages/summary?${params}`),
          fetch(`http://127.0.0.1:8000/songs/keys/summary?${params}`),
          fetch(`http://127.0.0.1:8000/songs/types/summary?${params}`),
        ]);

        if (!songsRes.ok) throw new Error("Failed to fetch songs");
        if (!keysRes.ok) throw new Error("Failed to fetch key summary");
        if (!typesRes.ok) throw new Error("Failed to fetch type summary");

        const [songsData, keysData, typesData] = await Promise.all([
          songsRes.json(),
          keysRes.json(),
          typesRes.json(),
        ]);

        setSongs(songsData);
        setKeySummary(keysData);
        setTypeSummary(typesData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSongs();
  }, [filtersReady, headerFilters]);

  // Get labels and data for pie charts
  const hymnPieLabels = typeSummary ? Object.keys(typeSummary) : [];
  const hymnPieData = typeSummary ? Object.values(typeSummary) : [];
  const keyPieLabels = Object.keys(keySummary);
  const keyPieData = Object.values(keySummary);

  // Get headers and data for table component
  const headerMap = {
    first_line: "Song (First Line)",
    ...Object.fromEntries(selectedActivities.map((a) => [a.slug, a.name])),
    total: "Total",
  };
  const songs_processed = songs.map((song: Song) => {
    const activityCounts = Object.fromEntries(
      Object.entries(song.activities)
        .filter(([activity]) =>
          selectedActivities.some((a) => a.slug === activity)
        )
        .map(([activity, data]) => [activity, data.usage_count])
    );

    return {
      id: song.id,
      first_line: song.first_line,
      ...activityCounts,
      total: song.overall.usage_count,
    };
  });

  // Specify searchable columns in table
  const searchKeys = ["first_line"];

  return (
    <div className="flex flex-wrap gap-5 m-5">
      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <div className="flex flex-1 justify-between flex-wrap gap-5">
            <PieChart
              data={hymnPieData}
              labels={hymnPieLabels}
              title="Hymn vs Song"
            />
            <PieChart data={keyPieData} labels={keyPieLabels} title="Key" />
          </div>
          <div className="flex-3">
            <TableSortSearch
              headerMap={headerMap}
              data={songs_processed}
              searchKeys={searchKeys}
              searchPlaceholder="Filter by song"
              title="Song Counts"
            />
          </div>
        </>
      )}
    </div>
  );
}
