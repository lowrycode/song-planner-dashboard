import { useState, useEffect, useMemo, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import type { DashboardContext, HeaderFilter } from "../types/dashboard.ts";
import type { Song } from "../types/songs.ts";
import DashboardPanel from "../components/DashboardPanel.tsx";
import TableSort from "../components/TableSort.tsx";
import TableSortSearch from "../components/TableSortSearch.tsx";
import PieChart from "../components/PieChart.tsx";
import PieChartController from "../components/PieChartController.tsx";
import { authFetch } from "../utils/auth_fetch.ts";

interface ActivitySummaryCount {
  church_activity_id: number;
  church_activity_name: string;
  unique_count: number;
  total_count: number;
}

export default function OverviewPage() {
  const { selectedActivities, headerFilters, filtersReady } =
    useOutletContext<DashboardContext>();
  const [songs, setSongs] = useState<Song[]>([]);
  const [activitySongCounts, setActivitySongCounts] = useState<
    ActivitySummaryCount[]
  >([]);
  const [keySummary, setKeySummary] = useState<Record<string, number>>({});
  const [typeSummary, setTypeSummary] = useState<{
    hymn: number;
    song: number;
  } | null>(null);
  const [pieWeightByUsage, setPieWeightByUsage] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [activitySongCountTableLoading, setActivitySongCountTableLoading] =
    useState(false);
  const [pieLoading, setPieLoading] = useState(false);
  const [tableError, setTableError] = useState<string | null>(null);
  const [activitySongCountTableError, setActivitySongCountTableError] =
    useState<string | null>(null);
  const [pieError, setPieError] = useState<string | null>(null);

  // Helper function
  const buildParams = useCallback((headerFilters: HeaderFilter) => {
    const params = new URLSearchParams();
    params.append("used_in_range", "true");
    if (headerFilters.from_date)
      params.append("from_date", headerFilters.from_date);
    if (headerFilters.to_date) params.append("to_date", headerFilters.to_date);
    headerFilters.church_activities.forEach((id) =>
      params.append("church_activity_id", id)
    );
    return params;
  }, []);

  // Fetch table data
  useEffect(() => {
    if (!filtersReady) return;

    async function fetchSongs() {
      setTableLoading(true);
      setTableError(null);

      try {
        const params = buildParams(headerFilters);
        const res = await authFetch(
          `http://127.0.0.1:8000/songs/usages/summary?${params}`
        );
        if (!res.ok) throw new Error("Failed to fetch songs");

        const data = await res.json();
        setSongs(data);
      } catch (err: any) {
        setTableError(err.message);
      } finally {
        setTableLoading(false);
      }
    }

    fetchSongs();
  }, [filtersReady, headerFilters, buildParams]);

  // Fetch Activity Summary table data
  useEffect(() => {
    if (!filtersReady) return;

    async function fetchActivitySongCounts() {
      setActivitySongCountTableLoading(true);
      setActivitySongCountTableError(null);

      try {
        const params = buildParams(headerFilters);
        const res = await authFetch(
          `http://127.0.0.1:8000/songs/usages/activity/summary?${params}`
        );
        if (!res.ok) throw new Error("Failed to fetch songs");

        const data = await res.json();
        setActivitySongCounts(data);
      } catch (err: any) {
        setActivitySongCountTableError(err.message);
      } finally {
        setActivitySongCountTableLoading(false);
      }
    }

    fetchActivitySongCounts();
  }, [filtersReady, headerFilters, buildParams]);

  // Fetch pie data
  useEffect(() => {
    if (!filtersReady) return;

    async function fetchSummaries() {
      setPieLoading(true);
      setPieError(null);

      try {
        const params = buildParams(headerFilters);
        if (pieWeightByUsage === false) params.append("unique", "true");

        const [keysRes, typesRes] = await Promise.all([
          authFetch(`http://127.0.0.1:8000/songs/keys/summary?${params}`),
          authFetch(`http://127.0.0.1:8000/songs/types/summary?${params}`),
        ]);

        if (!keysRes.ok) throw new Error("Failed to fetch key summary");
        if (!typesRes.ok) throw new Error("Failed to fetch type summary");

        const [keysData, typesData] = await Promise.all([
          keysRes.json(),
          typesRes.json(),
        ]);

        setKeySummary(keysData);
        setTypeSummary(typesData);
      } catch (err: any) {
        setPieError(err.message);
      } finally {
        setPieLoading(false);
      }
    }

    fetchSummaries();
  }, [filtersReady, headerFilters, pieWeightByUsage, buildParams]);

  // Get labels and data for pie charts
  const hymnPieLabels = typeSummary ? Object.keys(typeSummary) : [];
  const hymnPieData = typeSummary ? Object.values(typeSummary) : [];
  const keyPieLabels = Object.keys(keySummary);
  const keyPieData = Object.values(keySummary);

  // Get headers and data for table component
  const activityHeaderMap = {
    church_activity_name: "Church Activity",
    unique_count: "Unique",
    total_count: "Total",
  };

  // Get headers and data for table component
  const headerMap = {
    first_line: "Song (First Line)",
    ...Object.fromEntries(selectedActivities.map((a) => [a.slug, a.name])),
    total: "Total",
  };
  const songs_processed = useMemo(() => {
    return songs.map((song: Song) => {
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
  }, [songs, selectedActivities]);

  // Specify searchable columns in table
  const searchKeys = ["first_line"];

  return (
    <div className="flex flex-wrap gap-5 m-5">
      {/* Pie section */}
      <DashboardPanel className="flex flex-2 flex-wrap items-start gap-x-15 gap-y-5 min-h-[270px]">
        <PieChartController
          pieWeightByUsage={pieWeightByUsage}
          setPieWeightByUsage={setPieWeightByUsage}
          pieLoading={pieLoading}
        />
        <div className="flex flex-1 justify-around flex-wrap gap-x-15 gap-y-5">
          {pieError && <p className="text-center text-red-500">{pieError}</p>}
          {pieLoading && <p className="text-center">Loading ...</p>}
          {!pieLoading && !pieError && (
            <>
              <PieChart
                data={hymnPieData}
                labels={hymnPieLabels}
                title="Song Type"
              />
              <PieChart
                data={keyPieData}
                labels={keyPieLabels}
                title="Song Key"
              />
            </>
          )}
        </div>
      </DashboardPanel>

      {/* Usage by Church Activity Summary Table */}
      <DashboardPanel className="flex flex-col flex-1 flex-wrap items-start gap-x-15 min-h-[270px]">
        {activitySongCountTableError && (
          <p className="text-red-500">{activitySongCountTableError}</p>
        )}
        {activitySongCountTableLoading && <p>Loading table…</p>}
        {!activitySongCountTableLoading && !activitySongCountTableError && (
          <TableSort
            data={activitySongCounts}
            headerMap={activityHeaderMap}
            title="Unique vs Total Used"
          />
        )}
      </DashboardPanel>

      {/* Table section */}
      <div className="max-w-full">
        <DashboardPanel>
          {tableError && <p className="text-red-500">{tableError}</p>}
          {tableLoading && <p>Loading table…</p>}
          {!tableLoading && !tableError && (
            <TableSortSearch
              headerMap={headerMap}
              data={songs_processed}
              searchKeys={searchKeys}
              searchPlaceholder="Filter by song"
              title="Song Usages"
            />
          )}
        </DashboardPanel>
      </div>
    </div>
  );
}
