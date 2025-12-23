import SongDetails from "../components/SongDetails.tsx";
import Lyrics from "../components/Lyrics.tsx";
import DashboardPanel from "../components/DashboardPanel.tsx";
import SongResources from "../components/SongResources.tsx";
import SongExtraInfo from "../components/SongExtraInfo.tsx";
import SongUsageChart from "../components/SongUsageChart.tsx";
import { prepareUsageData } from "../utils/process_usage_data.ts";
import song_details from "../../sample_data/song_details_2.json";

const { labels, datasets } = prepareUsageData(
  song_details.usages,
  new Date(2014, 0, 1),
  new Date(2020, 11, 31)
);

export default function SongDetailsPage() {
  return (
    <div>
      <div className="flex flex-row flex-wrap justify-between gap-5 m-5">
        {/* Left */}
        <div className="flex flex-1 flex-wrap gap-5">
          <DashboardPanel className="flex-1 shrink-0">
            <SongDetails
              title={song_details.title}
              author={song_details.author}
              copyright={song_details.copyright}
            />
          </DashboardPanel>

          <DashboardPanel className="overflow-y-auto overflow-x-hidden">
            <SongExtraInfo
              song_key={song_details.key}
              is_hymn={song_details.is_hymn}
            />
          </DashboardPanel>
          <DashboardPanel className="flex-1">
            <SongResources />
          </DashboardPanel>
          <DashboardPanel className="w-full">
            <SongUsageChart labels={labels} datasets={datasets} />
          </DashboardPanel>
        </div>
        {/* Right */}
        <DashboardPanel className="w-full lg:w-auto overflow-y-auto">
          <Lyrics content={song_details.lyrics} />
        </DashboardPanel>
      </div>
    </div>
  );
}
