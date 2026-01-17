import { useState, useEffect, useMemo, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import type { DashboardContext, HeaderFilter } from "../types/dashboard.ts";
import type { Song } from "../types/songs.ts";
import DashboardPanel from "../components/DashboardPanel.tsx";
import TableSortSearch from "../components/TableSortSearch.tsx";
import FadeLoader from "../components/FadeLoader.tsx";
import TargetActivitySelector from "../components/TargetActivitySelector.tsx";
import { useAuthFetch } from "../hooks/useAuthFetch";
import type { Activity } from "../types/dashboard.ts";

// Types
interface BaseSongInfo {
  id: number;
  first_line: {
    display: string;
    to: string;
    hover: string;
  };
}

interface ProcessedSong extends BaseSongInfo {
  total: number;
  [activitySlug: string]: number | BaseSongInfo["first_line"] | undefined;
}

interface SongAtTargetOnly extends BaseSongInfo {
  usage_count: number;
}

export default function ComparePage() {
  // State
  const { selectedActivities, headerFilters, filtersReady } =
    useOutletContext<DashboardContext>();
  const [songs, setSongs] = useState<Song[]>([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [tableError, setTableError] = useState<string | null>(null);
  const [targetActivity, setTargetActivity] = useState<Activity | null>(null);

  const authFetch = useAuthFetch();
  
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

  const hasUsage = (value: unknown): value is number =>
    typeof value === "number" && value > 0;

  // Fetch table data
  useEffect(() => {
    if (!filtersReady) return;

    async function fetchSongs() {
      setTableLoading(true);
      setTableError(null);

      try {
        const params = buildParams(headerFilters);
        const res = await authFetch(
          `/songs/usages/summary?${params}`
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

  // Get headers and data for table component
  const headerMap: Record<string, string> = useMemo(
    () => ({
      first_line: "Song (First Line)",
      ...Object.fromEntries(selectedActivities.map((a) => [a.slug, a.name])),
      total: "Total",
    }),
    [selectedActivities]
  );

  const headerMapTargetOnly = {
    first_line: "Song (First Line)",
    usage_count: "Usage Count",
  };

  const headerMapOthersOnly: Record<string, string> = useMemo(() => {
    if (!targetActivity) return headerMap;

    const { [targetActivity.slug]: _, ...rest } = headerMap;
    return rest;
  }, [headerMap, targetActivity]);

  // Base processing of song data for table components
  const songs_processed: ProcessedSong[] = useMemo(() => {
    return songs.map((song) => {
      const activityCounts = Object.fromEntries(
        Object.entries(song.activities)
          .filter(([slug]) => selectedActivities.some((a) => a.slug === slug))
          .map(([slug, data]) => [slug, data.usage_count])
      );

      return {
        id: song.id,
        first_line: {
          display: song.first_line,
          to: `/songs/${song.id}`,
          hover: "View song details",
        },
        ...activityCounts,
        total: song.overall.usage_count,
      };
    });
  }, [songs, selectedActivities]);

  // Process base data for songsDoneInOthersOnly
  const songsDoneInOthersOnly = useMemo(() => {
    if (!targetActivity) return [];

    // Precompute other activity slugs once
    const otherActivitySlugs = selectedActivities
      .map((a) => a.slug)
      .filter((slug) => slug !== targetActivity.slug);

    return songs_processed
      .filter((song) => {
        // Exclude if used at target
        if (hasUsage(song[targetActivity.slug])) return false;

        // Include only if used in at least one other activity
        return otherActivitySlugs.some((slug) => {
          return hasUsage(song[slug]);
        });
      })
      .map(({ [targetActivity.slug]: _, ...rest }) => rest);
  }, [songs_processed, targetActivity, selectedActivities]);

  // Process base data for songsDoneOnlyAtTarget
  const songsDoneOnlyAtTarget = useMemo<SongAtTargetOnly[]>(() => {
    if (!targetActivity) return [];

    // Precompute other activity slugs once
    const otherActivitySlugs = selectedActivities
      .map((a) => a.slug)
      .filter((slug) => slug !== targetActivity.slug);

    return songs_processed
      .filter((song) => {
        // Reject if not used in target
        if (!hasUsage(song[targetActivity.slug])) return false;

        // Reject if used anywhere else
        for (const slug of otherActivitySlugs) {
          if (hasUsage(song[slug])) return false;
        }

        return true;
      })
      .map((song) => ({
        id: song.id,
        first_line: song.first_line,
        usage_count: song[targetActivity.slug] as number,
      }));
  }, [songs_processed, targetActivity, selectedActivities]);

  // Process base data for songsDoneAtTargetAndOthers
  const songsDoneAtTargetAndOthers = useMemo<ProcessedSong[]>(() => {
    if (!targetActivity) return [];

    // Precompute other activity slugs once
    const otherActivitySlugs = selectedActivities
      .map((a) => a.slug)
      .filter((slug) => slug !== targetActivity.slug);

    return songs_processed.filter((song) => {
      // Reject if not used in target
      if (!hasUsage(song[targetActivity.slug])) return false;

      // Accept if used anywhere else
      for (const slug of otherActivitySlugs) {
        if (hasUsage(song[slug])) return true;
      }

      return false;
    });
  }, [songs_processed, targetActivity, selectedActivities]);

  // Specify searchable columns in table
  const searchKeys = ["first_line"];

  // Check at least two activities selected in header
  if (selectedActivities.length <= 1) {
    return (
      <FadeLoader loading={!filtersReady}>
        <div className="m-5 p-5 border border-yellow-400 rounded bg-yellow-50 text-yellow-900">
          <h2 className="text-xl font-semibold mb-3">
            Not enough activities selected
          </h2>
          <p>
            To compare song usage, please select at least two church services or
            activities.
          </p>
        </div>
      </FadeLoader>
    );
  }
  return (
    <FadeLoader loading={!filtersReady}>
      <div className="flex flex-wrap gap-5 m-5">
        {/* Select Target Church Activity */}
        <DashboardPanel>
          <TargetActivitySelector
            selectedActivities={selectedActivities}
            targetActivity={targetActivity}
            setTargetActivity={setTargetActivity}
          />
        </DashboardPanel>

        {/* Comparison Tables section */}
        {targetActivity && (
          <FadeLoader loading={tableLoading} error={tableError}>
          {tableError && <p className="text-red-500">{tableError}</p>}
            <div className="flex flex-wrap max-w-full gap-5">
              <DashboardPanel className="flex flex-col flex-1 min-h-[450px]">
                <TableSortSearch
                  headerMap={headerMapTargetOnly}
                  data={songsDoneOnlyAtTarget}
                  searchKeys={searchKeys}
                  textHeaders={["first_line"]}
                  searchPlaceholder="Filter by song"
                  title={`Only used at ${targetActivity?.name || "Target"}`}
                />
              </DashboardPanel>
              <DashboardPanel className="flex flex-col flex-1 xl:max-w-1/2 min-h-[450px]">
                <TableSortSearch
                  headerMap={headerMapOthersOnly}
                  data={songsDoneInOthersOnly}
                  searchKeys={searchKeys}
                  textHeaders={["first_line"]}
                  searchPlaceholder="Filter by song"
                  title="Only used elsewhere"
                />
              </DashboardPanel>
              <DashboardPanel className="flex flex-col flex-1 min-h-[450px]">
                <TableSortSearch
                  headerMap={headerMap}
                  data={songsDoneAtTargetAndOthers}
                  searchKeys={searchKeys}
                  textHeaders={["first_line"]}
                  searchPlaceholder="Filter by song"
                  title={`Used both at ${
                    targetActivity?.name || "Target"
                  } and elsewhere`}
                />
              </DashboardPanel>
            </div>
          </FadeLoader>
        )}
      </div>
    </FadeLoader>
  );
}
