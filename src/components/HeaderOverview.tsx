import { useState, useEffect } from "react";
import FadeLoader from "../components/FadeLoader";

interface ChurchActivity {
  id: number;
  name: string;
  slug: string;
}

interface HeaderFilters {
  from_date: string; // ISO date string or empty
  to_date: string;
  church_activities: string[];
}

interface HeaderOverviewProps {
  activities: ChurchActivity[];
  activitiesLoading: boolean;
  activitiesError: string | null;
  headerFilters: HeaderFilters;
  setHeaderFilters: React.Dispatch<React.SetStateAction<HeaderFilters>>;
}

export default function HeaderOverview({
  activities,
  activitiesLoading,
  activitiesError,
  headerFilters,
  setHeaderFilters,
}: HeaderOverviewProps) {
  const [localFilters, setLocalFilters] = useState(headerFilters);

  useEffect(() => {
    setLocalFilters(headerFilters);
  }, [headerFilters]);

  // Check if all activities are selected
  const allSelected =
    activities.length > 0 &&
    activities.every((activity) =>
      localFilters.church_activities.includes(activity.id.toString())
    );

  // Helper: Check if filters are equal (simple shallow comparison)
  function filtersAreEqual(a: HeaderFilters, b: HeaderFilters) {
    if (a.from_date !== b.from_date) return false;
    if (a.to_date !== b.to_date) return false;

    // Compare church_activities ignoring order:
    if (a.church_activities.length !== b.church_activities.length) return false;
    const sortedA = [...a.church_activities].sort();
    const sortedB = [...b.church_activities].sort();
    for (let i = 0; i < sortedA.length; i++) {
      if (sortedA[i] !== sortedB[i]) return false;
    }
    return true;
  }

  const noChanges = filtersAreEqual(localFilters, headerFilters);

  // Handle input changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, checked } = e.target;

    if (name === "church_activities") {
      // For checkboxes
      let newServices = [...localFilters.church_activities];
      if (checked) {
        newServices.push(value);
      } else {
        newServices = newServices.filter((s) => s !== value);
      }
      setLocalFilters((prev) => ({ ...prev, church_activities: newServices }));
    } else if (name === "select_all") {
      // Select All checkbox toggled
      if (checked) {
        // Select all activities by ID as strings
        const allIds = activities.map((a) => a.id.toString());
        setLocalFilters((prev) => ({ ...prev, church_activities: allIds }));
      } else {
        // Deselect all
        setLocalFilters((prev) => ({ ...prev, church_activities: [] }));
      }
    } else {
      // For date inputs
      setLocalFilters((prev) => ({ ...prev, [name]: value }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!noChanges) {
      setHeaderFilters(localFilters);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row justify-between items-center gap-x-5 gap-y-2 my-2 mx-4 "
    >
      <div className="flex flex-1 bg-gray-900 text-gray-50 py-2 px-4 rounded-lg shadow-md flex-wrap gap-x-5 gap-y-3">
        <div className="flex w-full justify-between">
          {/* Date Inputs */}
          <div className="flex gap-x-5 gap-y-1">
            <div className="flex gap-x-3 justify-end items-center">
              <label htmlFor="from">From</label>
              <input
                type="date"
                name="from_date"
                id="from_date"
                className="bg-gray-50 text-gray-500 px-2 py-1 rounded-md text-sm"
                value={localFilters.from_date}
                onChange={handleChange}
              />
            </div>
            <div className="flex gap-x-3 justify-end items-center">
              <label htmlFor="to">To</label>
              <input
                type="date"
                name="to_date"
                id="to_date"
                className="bg-gray-50 text-gray-500 px-2 py-1 rounded-md text-sm"
                value={localFilters.to_date}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* Select All checkbox */}
          <div className="flex items-center">
            <label className="flex items-center gap-2 text-gray-100">
              <input
                type="checkbox"
                name="select_all"
                checked={allSelected}
                onChange={handleChange}
                className="accent-purple-500"
              />
              Toggle Activities
            </label>
          </div>
        </div>
        {/* Activities checkboxes */}
        <FadeLoader
          loading={activitiesLoading}
          error={activitiesError}
        >
          <div className="flex w-full gap-x-5 bg-gray-800 border border-gray-700 rounded-md px-3 py-1 flex-wrap min-h-8">
            {[...activities]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(({ id, name }) => (
                <label key={id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="accent-purple-500"
                    name="church_activities"
                    value={id.toString()} // use ID as string value for checkbox
                    checked={localFilters.church_activities.includes(
                      id.toString()
                    )} // check based on ID string
                    onChange={handleChange}
                  />
                  {name}
                </label>
              ))}
          </div>
        </FadeLoader>
      </div>
      <button
        type="submit"
        disabled={noChanges}
        aria-disabled={noChanges}
        className={`rounded-lg text-gray-100 px-4 py-2 shadow-md ${
          noChanges
            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
            : "bg-purple-900 hover:bg-purple-700 hover:cursor-pointer"
        }`}
      >
        Update
      </button>
    </form>
  );
}
