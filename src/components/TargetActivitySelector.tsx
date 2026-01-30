import type { Activity } from "../types/dashboard";

interface TargetActivitySelectorProps {
  selectedActivities: Activity[];
  targetActivity: Activity | null;
  setTargetActivity: (activity: Activity | null) => void;
}

export default function TargetActivitySelector({
  selectedActivities,
  targetActivity,
  setTargetActivity,
}: TargetActivitySelectorProps) {
  // Helper function
  return (
    <>
      <h2 className="text-xl font-extrabold text-purple-900 mb-3">
        Target
      </h2>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="select-target-activity"
          className="text-purple-950 font-semibold text-sm"
        >
          Choose a church service/activity:
        </label>
        <select
          id="select-target-activity"
          name="targetActivity"
          className="py-1 px-2 border border-purple-950 hover:cursor-pointer"
          value={targetActivity?.id || ""}
          onChange={(e) => {
            const id = parseInt(e.target.value, 10);
            const activity = selectedActivities.find((a) => a.id === id);
            setTargetActivity(activity || null);
          }}
        >
          <option value="" disabled>
            - Choose Target -
          </option>
          {selectedActivities.map((a) => {
            return (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            );
          })}
        </select>
      </div>
      <p className="text-sm italic text-gray-600 mt-3">
        NOTE: This will be compared with all other church services / activities
        that are selected in the header.
      </p>
    </>
  );
}
