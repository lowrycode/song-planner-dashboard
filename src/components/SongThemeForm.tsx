import { useState } from "react";
import ExpandablePanel from "./ExpandablePanel";

interface SongThemeFormProps {
  handleSubmit: (
    themes: string,
    limitCount: number,
    minMatch: number,
    searchType: "lyric" | "theme",
  ) => void;
  loading: boolean;
}

export default function SongThemeForm({
  handleSubmit,
  loading,
}: SongThemeFormProps) {
  const [themes, setThemes] = useState<string>("");
  const [limitCount, setLimitCount] = useState<number | "">(20);
  const [minMatch, setMinMatch] = useState<number | "">(75);
  const [searchType, setSearchType] = useState<"lyric" | "theme">("theme");

  // Define limits
  const limitCountMin = 5;
  const limitCountMax = 30;
  const limitCountValid =
    limitCount !== "" &&
    limitCount >= limitCountMin &&
    limitCount <= limitCountMax;

  const limitMatchMin = 1;
  const limitMatchMax = 100;
  const limitMatchValid =
    minMatch !== "" && minMatch >= limitMatchMin && minMatch <= limitMatchMax;

  // Submit form handler
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (limitCount === "" || minMatch === "") return;
    handleSubmit(themes, Number(limitCount), Number(minMatch), searchType);
  }

  function handleLimitCountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (value === "") {
      setLimitCount(""); // Allows input to be cleared
    } else {
      setLimitCount(Number(value));
    }
  }

  function handleMinMatchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (value === "") {
      setMinMatch(""); // Allows input to be cleared
    } else {
      setMinMatch(Number(value));
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <h2 className="text-xl font-extrabold text-purple-900 mb-2">
        Search Songs by Theme
      </h2>
      <div className="flex flex-col flex-wrap gap-3 justify-between items-start">
        {/* Themes */}
        <div className="flex w-full flex-col gap-1">
          <label
            htmlFor="themes"
            className="text-purple-950 font-semibold text-sm"
          >
            Themes
          </label>
          <textarea
            name="themes"
            id="themes"
            className="py-1 px-2 border border-purple-950 bg-white block min-w-[150px] min-h-[100px]"
            value={themes}
            placeholder="Enter themes separated by commas..."
            onChange={(e) => setThemes(e.target.value)}
            rows={4}
          />
        </div>

        {/* Advanced options */}
        <ExpandablePanel caption="Advanced Options">
          <div className="flex w-full flex-wrap flex-1 gap-x-5 gap-y-3 justify-end items-start mt-3">
            <div className="flex flex-1 flex-col gap-1">
              <label
                htmlFor="searchType"
                className="text-purple-950 font-semibold text-sm whitespace-nowrap"
              >
                Compare with:
              </label>
              <select
                id="searchType"
                value={searchType}
                onChange={(e) =>
                  setSearchType(e.target.value as "lyric" | "theme")
                }
                className="w-full min-w-[100px] py-1 px-2 border border-purple-950 bg-white"
              >
                <option value="theme">Song Themes</option>
                <option value="lyric">Song Lyrics</option>
              </select>
            </div>

            <div className="flex flex-1 flex-col gap-1">
              <label
                htmlFor="minMatch"
                className="text-purple-950 font-semibold text-sm whitespace-nowrap"
              >
                Minimum Match (%):
              </label>
              <input
                type="number"
                name="minMatch"
                id="minMatch"
                min={limitMatchMin}
                max={limitMatchMax}
                className="w-full min-w-[100px] py-1 px-2 border border-purple-950 bg-white"
                value={minMatch}
                onChange={handleMinMatchChange}
              />
              {!limitMatchValid && (
                <p className="text-red-600 text-sm">
                  Must be between {limitMatchMin} and {limitMatchMax}
                </p>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-1">
              <label
                htmlFor="limit"
                className="text-purple-950 font-semibold text-sm whitespace-nowrap"
              >
                Limit to top:
              </label>
              <input
                type="number"
                name="limit"
                id="limit"
                min={limitCountMin}
                max={limitCountMax}
                className="w-full min-w-[100px] py-1 px-2 border border-purple-950 bg-white"
                value={limitCount}
                onChange={handleLimitCountChange}
              />
              {!limitCountValid && (
                <p className="text-red-600 text-sm">
                  Must be between {limitCountMin} and {limitCountMax}
                </p>
              )}
            </div>
          </div>
        </ExpandablePanel>

        <div className="flex w-full justify-end items-end">
          <button
            type="submit"
            disabled={
              loading || !themes.trim() || !limitCountValid || !limitMatchValid
            }
            className="bg-purple-900 px-3 py-1 text-gray-50 rounded-md hover:bg-purple-700 hover:cursor-pointer"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
}
