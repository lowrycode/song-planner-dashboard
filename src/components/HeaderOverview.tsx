import { useState, useEffect } from "react";

const serviceNames = [
  "Hessle",
  "Network",
  "Newland",
  "Orchard Park",
  "Riverside",
];

interface HeaderFilters {
  from_date: string; // ISO date string or empty
  to_date: string;
  services: string[]; // selected services
}

function HeaderOverview({
  headerFilters,
  setHeaderFilters,
}: {
  headerFilters: HeaderFilters;
  setHeaderFilters: (filters: HeaderFilters) => void;
}) {
  // Local state for controlled inputs (optional, or use directly headerFilters)
  const [localFilters, setLocalFilters] = useState(headerFilters);

  useEffect(() => {
    setLocalFilters(headerFilters);
  }, [headerFilters]);

  // Handle input changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;

    if (name === "services") {
      // For checkboxes
      let newServices = [...localFilters.services];
      if (checked) {
        newServices.push(value);
      } else {
        newServices = newServices.filter((s) => s !== value);
      }
      setLocalFilters((prev) => ({ ...prev, services: newServices }));
    } else {
      // For date inputs
      setLocalFilters((prev) => ({ ...prev, [name]: value }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setHeaderFilters(localFilters);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row justify-between items-center gap-x-5 gap-y-2 my-2 mx-4 ">
      <div className="flex flex-1 justify-between bg-gray-900 text-gray-50 py-2 px-4 rounded-lg shadow-md flex-wrap gap-x-5 gap-y-2">
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
        <div className="flex gap-x-5 flex-wrap">
          {serviceNames.map((s, index) => (
            <label key={index} className="flex items-center gap-2">
              <input type="checkbox"
                className="accent-purple-500"
                name="services"
                value={s}
                checked={localFilters.services.includes(s)}
                onChange={handleChange} />
              {s as string}
            </label>
          ))}
        </div>
      </div>
      <button
        type="submit"
        className="bg-purple-900 rounded-lg text-gray-100 px-4 py-2 shadow-md hover:bg-purple-700 hover:cursor-pointer"
      >
        Update
      </button>
    </form>
  );
}

export default HeaderOverview;
