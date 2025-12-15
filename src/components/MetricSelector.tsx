// MetricSelector.tsx
import React from "react";

type SongMetric = "usage_count" | "first_used" | "last_used";

const metricOptions: { value: SongMetric; label: string }[] = [
  { value: "usage_count", label: "Usage Count" },
  { value: "first_used", label: "First Used" },
  { value: "last_used", label: "Last Used" },
];

interface MetricSelectorProps {
  metric: SongMetric;
  setMetric: React.Dispatch<React.SetStateAction<SongMetric>>;
}

function MetricSelector({ metric, setMetric }: MetricSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMetric(e.target.value as SongMetric);
  };

  return (
    <div className="flex items-center gap-x-3 gap-y-2">
      <label htmlFor="metric-select" className="text-purple-900 font-semibold">
        Metric:
      </label>
      <select
        id="metric-select"
        value={metric}
        onChange={handleChange}
        className="border border-purple-950 rounded p-1"
      >
        {metricOptions.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default MetricSelector;
