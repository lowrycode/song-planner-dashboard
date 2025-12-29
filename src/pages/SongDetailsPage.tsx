import { useState, useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import type { DashboardContext, HeaderFilter } from "../types/dashboard.ts";
import SongDetails from "../components/SongDetails.tsx";
import Lyrics from "../components/Lyrics.tsx";
import DashboardPanel from "../components/DashboardPanel.tsx";
import SongResources from "../components/SongResources.tsx";
import SongExtraInfo from "../components/SongExtraInfo.tsx";
import SongUsageChart from "../components/SongUsageChart.tsx";
import { prepareUsageData } from "../utils/process_usage_data.ts";
import { authFetch } from "../utils/auth_fetch.ts";
import FadeLoader from "../components/FadeLoader.tsx";

function buildParams(headerFilters: HeaderFilter) {
  const params = new URLSearchParams();
  if (headerFilters.from_date)
    params.append("from_date", headerFilters.from_date);
  if (headerFilters.to_date) params.append("to_date", headerFilters.to_date);
  headerFilters.church_activities.forEach((id) =>
    params.append("church_activity_id", id)
  );
  return params;
}

interface SongDetailsType {
  id: number;
  first_line: string;
  song_key: string;
  is_hymn: boolean;
  copyright: string;
  author: string;
  duration: number;
  lyrics: {
    content: string;
  };
  resources: {
    sheet_music: string;
    harmony_vid: string;
    harmony_pdf: string;
    harmony_ms: string;
  };
}

interface SongUsagesType {
  id: number;
  used_date: string;
  church_activity_id: number;
}

export default function SongDetailsPage() {
  const { selectedActivities, headerFilters, filtersReady } =
    useOutletContext<DashboardContext>();
  const [songDetails, setSongDetails] = useState<SongDetailsType>({
    id: 0,
    first_line: "",
    song_key: "",
    is_hymn: false,
    copyright: "",
    author: "",
    duration: 0,
    lyrics: {
      content: "",
    },
    resources: {
      sheet_music: "",
      harmony_vid: "",
      harmony_pdf: "",
      harmony_ms: "",
    },
  });
  const [songUsages, setSongUsages] = useState<SongUsagesType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { song_id } = useParams<{ song_id: string }>();
  const songId = Number(song_id);

  // Guard against invalid song IDs
  if (!song_id || Number.isNaN(songId)) {
    return <p>Invalid song ID</p>;
  }

  // Fetch table data
  useEffect(() => {
    if (!filtersReady) return;

    async function fetchSongData() {
      setIsLoading(true);
      setError(null);

      try {
        const params = buildParams(headerFilters).toString();

        const [detailsRes, usageRes] = await Promise.all([
          authFetch(`http://127.0.0.1:8000/songs/${song_id}`),
          authFetch(`http://127.0.0.1:8000/songs/${song_id}/usages?${params}`),
        ]);

        if (!detailsRes.ok) throw new Error("Failed to fetch song details");
        if (!usageRes.ok) throw new Error("Failed to fetch song usage");

        const [detailsData, usageData] = await Promise.all([
          detailsRes.json(),
          usageRes.json(),
        ]);

        setSongDetails(detailsData);
        setSongUsages(usageData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSongData();
  }, [filtersReady, headerFilters, song_id]);

  const { labels, datasets } = prepareUsageData(
    songUsages,
    selectedActivities,
    headerFilters
  );

  return (
    <FadeLoader loading={isLoading} error={error}>
    <div className="flex flex-row flex-wrap justify-between gap-5 m-5">
      {error && <p className="text-red-500">{error}</p>}
      {/* Left */}
      <div className="flex flex-1 flex-wrap gap-5 lg:w-2/3">
        <DashboardPanel className="flex-1 shrink-0">
          {/* Song Headlines */}
          <SongDetails
            title={songDetails.first_line || "No title available"}
            author={songDetails.author || "Unknown author"}
            copyright={songDetails.copyright || "No copyright info"}
          />
        </DashboardPanel>

        <DashboardPanel className="overflow-y-auto overflow-x-hidden">
          {/* Song Key and Type */}
          <SongExtraInfo
            song_key={songDetails.song_key}
            is_hymn={songDetails.is_hymn}
          />
        </DashboardPanel>
        {/* Song Resources */}
        <DashboardPanel className="flex-1">
          <SongResources resources={songDetails.resources} />
        </DashboardPanel>

        {/* Usage Chart */}
        <DashboardPanel className="w-full">
          <SongUsageChart labels={labels} datasets={datasets} />
        </DashboardPanel>
      </div>
      {/* Right */}
      <DashboardPanel className="w-full lg:w-auto overflow-y-auto">
        <Lyrics content={songDetails.lyrics.content || "No lyrics available"} />
      </DashboardPanel>
    </div>
    </FadeLoader>
  );
}
