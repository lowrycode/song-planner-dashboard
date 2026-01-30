import { useState } from "react";

interface SongFilter {
  lyric: string;
  songType: string;
  songKey: string;
  filterUsedInRange: boolean;
  filterFirstUsedInRange: boolean;
  filterLastUsedInRange: boolean;
}

export default function SongForm({
  filters,
  onFilterChange,
}: {
  filters: SongFilter;
  onFilterChange: (filters: SongFilter) => void;
}) {
  // State
  const [localFilters, setLocalFilters] = useState(filters);

  // Update local state on input changes
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, type, checked, value } = e.currentTarget;

    setLocalFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // Update local state on select changes
  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const { name, value } = e.currentTarget;

    setLocalFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Submit form handler
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onFilterChange(localFilters);
  }

  return (
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
            onChange={handleInputChange}
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
            id="song-type"
            name="songType"
            className="py-1 px-2 border border-purple-950 hover:cursor-pointer"
            value={localFilters.songType}
            onChange={handleSelectChange}
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
            id="song-key"
            name="songKey"
            className="py-1 px-2 border border-purple-950 hover:cursor-pointer"
            value={localFilters.songKey}
            onChange={handleSelectChange}
          >
            <option value="">Any</option>
            <option value="A">A</option>
            <option value="Bb">Bb</option>
            <option value="B">B</option>
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
        <div className="flex flex-1 gap-x-5 gap-y-3 justify-end items-end">
          <div>
            <div className="flex items-center gap-2">
              <input
                id="filter-used-in-range"
                name="filterUsedInRange"
                type="checkbox"
                className="w-4 h-4 accent-purple-700 border border-purple-950 hover:cursor-pointer"
                checked={localFilters.filterUsedInRange}
                onChange={handleInputChange}
              />
              <label
                htmlFor="filter-used-in-range"
                className="text-purple-950 font-semibold text-sm whitespace-nowrap hover:cursor-pointer"
              >
                Filter used in range
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="filter-first-used-in-range"
                name="filterFirstUsedInRange"
                type="checkbox"
                className="w-4 h-4 accent-purple-700 border border-purple-950 hover:cursor-pointer"
                checked={localFilters.filterFirstUsedInRange}
                onChange={handleInputChange}
              />
              <label
                htmlFor="filter-first-used-in-range"
                className="text-purple-950 font-semibold text-sm whitespace-nowrap hover:cursor-pointer"
              >
                Filter first used in range
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="filter-last-used-in-range"
                name="filterLastUsedInRange"
                type="checkbox"
                className="w-4 h-4 accent-purple-700 border border-purple-950 hover:cursor-pointer"
                checked={localFilters.filterLastUsedInRange}
                onChange={handleInputChange}
              />
              <label
                htmlFor="filter-last-used-in-range"
                className="text-purple-950 font-semibold text-sm whitespace-nowrap hover:cursor-pointer"
              >
                Filter last used in range
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="bg-purple-900 px-3 py-1 text-gray-50 rounded-md hover:bg-purple-700 hover:cursor-pointer"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
}
