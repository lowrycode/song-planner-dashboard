import HeaderOverview from "../components/HeaderOverview.tsx";
import SongDetails from "../components/SongDetails.tsx";
import Lyrics from "../components/Lyrics.tsx";
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

function SongDetailsPage() {
  return (
    <div>
      <HeaderOverview />
      <div className="flex flex-row flex-wrap justify-between gap-5 m-5">
        {/* Left */}
        <div className="flex flex-1 flex-wrap gap-5">
          <div className="flex-1 shrink-0 bg-gray-100 px-5 py-3 rounded-lg">
            <SongDetails
              title={song_details.title}
              author={song_details.author}
              copyright={song_details.copyright}
            />
          </div>
          <div className="overflow-y-auto overflow-x-hidden bg-gray-100 px-5 py-3 rounded-lg">
            <SongExtraInfo song_key={song_details.key} is_hymn={song_details.is_hymn}/>
          </div>
          <div className="flex-1 bg-gray-100 px-5 py-3 rounded-lg">
            <SongResources />
          </div>
          <div className="w-full bg-gray-100 px-5 py-3 rounded-lg">
            <SongUsageChart labels={labels} datasets={datasets}/>
          </div>
        </div>
        {/* Right */}
        <div className="w-full lg:w-auto overflow-y-auto bg-gray-100 px-5 py-3 rounded-lg text-sm">
          <Lyrics content={song_details.lyrics} />
        </div>
      </div>
    </div>
  );
}

export default SongDetailsPage;
