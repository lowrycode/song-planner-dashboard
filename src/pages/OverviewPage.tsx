import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import type { DashboardContext } from "../layouts/DashboardLayout";
import TableSortSearch from "../components/TableSortSearch.tsx";
import PieChart from "../components/PieChart.tsx";
import hymn_pie from "../../sample_data/hymn_pie.json";
import key_pie from "../../sample_data/key_pie.json";

// Pie Charts
const hymnPieLabels = hymn_pie.map((obj) => Object.keys(obj)[0]);
const hymnPieData = hymn_pie.map((obj) => Object.values(obj)[0]);
const keyPieLabels = key_pie.map((obj) => Object.keys(obj)[0]);
const keyPieData = key_pie.map((obj) => Object.values(obj)[0]);

export default function OverviewPage() {
  const { selectedActivities, headerFilters, filtersReady } =
    useOutletContext<DashboardContext>();
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

        const response = await fetch(
          `http://127.0.0.1:8000/songs/usage-summary?${params.toString()}`
        );
        if (!response.ok) throw new Error("Failed to fetch songs");

        const data = await response.json();
        setSongs(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSongs();
  }, [filtersReady, headerFilters]);

  const headerMap = {
    first_line: "Song (First Line)",
    ...Object.fromEntries(selectedActivities.map((a) => [a.slug, a.name])),
    total: "Total",
  };

  const songs_processed = songs.map((song) => {
    console.log("song activities:", Object.keys(song.activities));
    console.log(
      "selected slugs:",
      selectedActivities.map((a) => a.slug)
    );
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

  const searchKeys = ["first_line"];

  return (
    <div className="flex flex-wrap gap-5 m-5">
      {loading && <p>Loading songs...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="flex-3">
          <TableSortSearch
            headerMap={headerMap}
            data={songs_processed}
            searchKeys={searchKeys}
            searchPlaceholder="Filter by song"
            title="Song Counts"
          />
        </div>
      )}

      <div className="flex flex-1 justify-between flex-wrap gap-5">
        <PieChart
          data={hymnPieData}
          labels={hymnPieLabels}
          title="Hymn vs Song"
        />
        <PieChart data={keyPieData} labels={keyPieLabels} title="Key" />
      </div>
    </div>
  );
}
