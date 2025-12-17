import { useState } from "react";

function SongForm({
  filters,
  onFilterChange,
}: {
  filters: {
    lyric: string;
    songType: string;
    songKey: string;
    filterFirstUsedInRange: boolean;
    filterLastUsedInRange: boolean;
  };
  onFilterChange: (filters: typeof filters) => void;
}) {
  // Local state to hold form inputs before submit (optional)
  const [localFilters, setLocalFilters] = useState(filters);

  // Update local state on input changes
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value, type, checked } = e.target;
    setLocalFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // Submit form handler
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onFilterChange(localFilters);
  }

  return (
    <div className="w-full bg-gray-100 px-3 py-2 rounded-lg">
      <form onSubmit={handleSubmit}>
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
              value={localFilters.lyric}
              onChange={handleChange}
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
            <select
              name="songType"
              id="songType"
              className="py-1 px-2 border border-purple-950"
              value={localFilters.songType}
              onChange={handleChange}
            >
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
              name="songKey"
              id="songKey"
              className="py-1 px-2 border border-purple-950"
              value={localFilters.songKey}
              onChange={handleChange}
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
                  id="filterFirstUsedInRange"
                  name="filterFirstUsedInRange"
                  type="checkbox"
                  className="w-4 h-4 accent-purple-700 border border-purple-950"
                  checked={localFilters.filterFirstUsedInRange}
                  onChange={handleChange}
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
                  id="filterLastUsedInRange"
                  name="filterLastUsedInRange"
                  type="checkbox"
                  className="w-4 h-4 accent-purple-700 border border-purple-950"
                  checked={localFilters.filterLastUsedInRange}
                  onChange={handleChange}
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
