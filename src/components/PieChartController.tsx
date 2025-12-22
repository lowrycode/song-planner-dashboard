import type { Dispatch, SetStateAction } from "react";

type PieChartControllerProps = {
  pieWeightByUsage: boolean;
  setPieWeightByUsage: Dispatch<SetStateAction<boolean>>;
  pieLoading: boolean;
};

export default function PieChartController({
  pieWeightByUsage,
  setPieWeightByUsage,
  pieLoading,
}: PieChartControllerProps) {
  return (
      <div className="flex w-full items-center gap-x-4 bg-purple-900 px-5 py-2 text-gray-50 rounded-lg">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="accent-purple-500"
            disabled={pieLoading}
            checked={pieWeightByUsage}
            onChange={(e) => setPieWeightByUsage(e.target.checked)}
          />
          Weight by usage
        </label>
      </div>
  );
}
