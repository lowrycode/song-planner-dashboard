import { useState, useMemo } from "react";
import DashboardPanel from "../components/DashboardPanel";
import { useAuthFetch } from "../hooks/useAuthFetch";
import SongThemeForm from "../components/SongThemeForm.tsx";
import FadeLoader from "../components/FadeLoader.tsx";
import TableSortSearch from "../components/TableSortSearch.tsx";

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
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authFetch = useAuthFetch();

  // Fetch songs using similarity search
  async function handleSubmit(
    themes: string,
    limit: number,
    minMatch: number,
    searchType: "lyric" | "theme",
  ) {
    setLoading(true);
    setError(null);
    setSongs([]);

    try {
      const res = await authFetch("/songs/by-theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          themes,
          top_k: limit,
          search_type: searchType,
          min_match_score: minMatch,
        }),
      });
      const data = await res.json();
      console.log(data);
      setSongs(data);
    } catch (err: any) {
      console.error("ERROR (theme search):", err);
      setError(err?.message || "Failed to search by theme. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const headerMap = {
    first_line: "Song (First Line)",
    themes: "Themes",
    match_score: "Match (%)",
  };
  const songsProcessed = useMemo(() => processSongsForTable(songs), [songs]);
  const searchKeys = ["first_line", "themes"];

  return (
    <div className="flex flex-wrap gap-5 m-5">
      <DashboardPanel className="w-full">
        <SongThemeForm handleSubmit={handleSubmit} loading={loading} />
        {error && <p className="text-red-500">Error: {error}</p>}
      </DashboardPanel>
      {songs.length > 0 && (
        <DashboardPanel className="w-full">
          <FadeLoader loading={loading} error={error} minHeight="min-h-[550px]">
            <TableSortSearch
              headerMap={headerMap}
              data={songsProcessed}
              searchKeys={searchKeys}
              title="Results"
              maxHeight="550px"
            />
          </FadeLoader>
        </DashboardPanel>
      )}
    </div>
  );
}
