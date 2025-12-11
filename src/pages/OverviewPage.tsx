import TableSortSearch from "../components/TableSortSearch.tsx";
import HeaderOverview from "../components/HeaderOverview.tsx";
import PieChart from "../components/PieChart.tsx";
import songs from "../../sample_data/song_list.json";
import hymn_pie from "../../sample_data/hymn_pie.json";
import key_pie from "../../sample_data/key_pie.json";

// Songs Table
const songs_processed = songs.map((song) => ({
  id: song.id,
  first_line: song.first_line,
  ...song.venues,
  total: song.total,
}));

const headerMap = {
  first_line: "Song (First Line)",
  newland: "Newland",
  riverside: "Riverside",
  hessle: "Hessle",
  orchard_park: "Orchard Park",
  network: "Network",
  total: "Total",
};

const searchKeys = ["first_line"];

// Pie Charts
const hymnPieLabels = hymn_pie.map(obj => Object.keys(obj)[0]);
const hymnPieData   = hymn_pie.map(obj => Object.values(obj)[0]);
const keyPieLabels = key_pie.map(obj => Object.keys(obj)[0]);
const keyPieData   = key_pie.map(obj => Object.values(obj)[0]);

function OverviewPage() {
  return (
    <div>
      <HeaderOverview />
      <div className="flex flex-wrap gap-5 m-5">
        <div className="flex-3">
          <TableSortSearch
            headerMap={headerMap}
            data={songs_processed}
            searchKeys={searchKeys}
            searchPlaceholder="Filter by song"
            title="Song Counts"
          />
        </div>
        <div className="flex flex-1 justify-between flex-wrap gap-5">
            <PieChart
              data={hymnPieData}
              labels={hymnPieLabels}
              title="Hymn vs Song"
            />
            <PieChart data={keyPieData} labels={keyPieLabels} title="Key" />
        </div>
      </div>
    </div>
  );
}

export default OverviewPage;
