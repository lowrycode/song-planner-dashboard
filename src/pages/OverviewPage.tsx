import TableSortSearch from "../components/TableSortSearch.tsx";
import songs from "../../sample_data/song_list.json";

const songs_processed = songs.map((song) => ({
  id: song.id,
  first_line: song.first_line,
  ...song.venues,
  total: song.total,
}));


const headerMap = {
  "first_line": "Song (First Line)",
  "newland": "Newland",
  "riverside": "Riverside",
  "hessle": "Hessle",
  "orchard_park": "Orchard Park",
  "network": "Network",
  "total": "Total",
};

const searchKeys = ["first_line"]

function OverviewPage() {
  return (
    <div>
      <div className="flex h-9/10 m-5">
        <div className="w-full">
          <TableSortSearch
            headerMap={headerMap}
            data={songs_processed}
            searchKeys={searchKeys}
            searchPlaceholder="Filter by song"
            title="Song Counts"
          />
        </div>
      </div>
    </div>
  );
}

export default OverviewPage;
