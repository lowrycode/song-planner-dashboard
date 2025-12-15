function SongForm() {
  return (
    <div className="w-full bg-gray-100 px-3 py-2 rounded-lg">
      <form className="">
        <h2 className="text-xl font-extrabold text-purple-900 mb-2">
          Song Criteria
        </h2>
        <div className="flex flex-wrap gap-x-5 gap-y-3 justify-between items-end">
          {/* Lyric */}
          <div className="flex flex-2 flex-col gap-1">
            <label
              htmlFor="lyric"
              className="text-purple-950 font-semibold text-sm"
            >
              Lyric
            </label>
            <input
              type="text"
              name="lyric"
              id="lyric"
              className="py-1 px-2 border border-purple-950"
            />
          </div>
          {/* Hymn / Song */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="song-type"
              className="text-purple-950 font-semibold text-sm"
            >
              Hymn / Song
            </label>
            <select className="py-1 px-2 border border-purple-950">
              <option value="both">Both</option>
              <option value="hymn">Hymn</option>
              <option value="song">Song</option>
            </select>
          </div>
          {/* Song Key */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="song-key"
              className="text-purple-950 font-semibold text-sm"
            >
              Key
            </label>
            <select
              id="song-key"
              className="py-1 px-2 border border-purple-950"
            >
              <option value="">Any</option>
              <option value="a">A</option>
              <option value="bb">Bb</option>
              <option value="b">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="Eb">Eb</option>
              <option value="E">E</option>
              <option value="F">F</option>
              <option value="G">G</option>
              <option value="Ab">Ab</option>
            </select>
          </div>
          {/* DIV - checkbox + submit */}
          <div className="flex flex-1 gap-x-5 gap-y-3 justify-end items-center">
            <div>
              <div className="flex items-center gap-2">
                <input
                  id="filter-first-used-in-range"
                  name="filter-first-used-in-range"
                  type="checkbox"
                  className="w-4 h-4 accent-purple-700 border border-purple-950"
                />
                <label
                  htmlFor="filter-first-used-in-range"
                  className="text-purple-950 font-semibold text-sm whitespace-nowrap"
                >
                  Filter first used in range
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="filter-last-used-in-range"
                  name="filter-last-used-in-range"
                  type="checkbox"
                  className="w-4 h-4 accent-purple-700 border border-purple-950"
                />
                <label
                  htmlFor="filter-last-used-in-range"
                  className="text-purple-950 font-semibold text-sm whitespace-nowrap"
                >
                  Filter last used in range
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="bg-purple-900 px-3 py-1 text-gray-50 rounded-md hover:bg-purple-700"
            >
              Search
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SongForm;
