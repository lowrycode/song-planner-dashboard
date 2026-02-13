import { useState, useMemo, useRef, useEffect } from "react";
import DashboardPanel from "../components/DashboardPanel";
import { useAuthFetch } from "../hooks/useAuthFetch";
import SongThemeForm from "../components/SongThemeForm.tsx";
import FadeLoader from "../components/FadeLoader.tsx";
import TableSortSearch from "../components/TableSortSearch.tsx";
import type { SongThemeFilter } from "../components/SongThemeForm.tsx";
import type { DashboardContext } from "../types/dashboard.ts";
import { useOutletContext } from "react-router-dom";

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

interface Song {
  id: number;
  first_line: string;
  themes: string;
  match_score: number;
}

// Helper functions
function processSongsForTable(songs: Song[]): TableRow[] {
  return songs.map((song) => {
    return {
      id: song.id,
      first_line: {
        display: song.first_line,
        to: `/songs/${song.id}`,
      },
      themes: song.themes,
      match_score: song.match_score,
    };
  });
}

export default function SongThemePage() {
  const { headerFilters } = useOutletContext<DashboardContext>();
  const [hasSearched, setHasSearched] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const authFetch = useAuthFetch();

  // Fetch songs using similarity search
  async function handleSubmit(filters: SongThemeFilter) {
    setLoading(true);
    setError(null);
    setSongs([]);
    setHasSearched(true);

    try {
      const res = await authFetch("/songs/by-theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          themes: filters.themes,
          search_type: filters.searchType,
          top_k: filters.limitCount,
          min_match_score: filters.minMatch,
          used_in_range: filters.filterUsedInRange,
          first_used_in_range: filters.filterFirstUsedInRange,
          last_used_in_range: filters.filterLastUsedInRange,
          from_date: headerFilters.from_date,
          to_date: headerFilters.to_date,
          church_activity_id: headerFilters.church_activities,
        }),
      });
      const data = await res.json();
      setSongs(data);
    } catch (err: any) {
      console.error("ERROR (theme search):", err);
      setError(err?.message || "Failed to search by theme. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!loading && hasSearched) {
      scrollToResults();
    }
  }, [loading, hasSearched]);

  function scrollToResults() {
    resultsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  // Define table props
  const headerMap = {
    first_line: "Song (First Line)",
    themes: "Themes",
    match_score: "Match (%)",
  };
  const songsProcessed = useMemo(() => processSongsForTable(songs), [songs]);
  const searchKeys = ["first_line", "themes"];

  return (
    <div className="flex flex-wrap gap-2 md:gap-4 my-4 mx-2 md:mx-3">
      <DashboardPanel className="w-full">
        <SongThemeForm handleSubmit={handleSubmit} loading={loading} />
        {error && <p className="text-red-500">Error: {error}</p>}
      </DashboardPanel>
      {hasSearched && !loading && (
        <DashboardPanel className="w-full">
          <FadeLoader loading={loading} error={error} minHeight="min-h-[550px]">
            <div ref={resultsRef}>
              <TableSortSearch
                headerMap={headerMap}
                data={songsProcessed}
                searchKeys={searchKeys}
                title="Results"
                maxHeight="550px"
              />
            </div>
          </FadeLoader>
        </DashboardPanel>
      )}
    </div>
  );
}
