import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const basePalette = [
  "#ef4444",
  "#3b82f6",
  "#fbbf24",
  "#10b981",
  "#8b5cf6",
  "#f472b6",
  "#f97316",
  "#6366f1",
  "#14b8a6",
  "#eab308",
  "#22c55e",
  "#ec4899",
];

type PieChartProps = {
  data: number[];
  labels: string[];
  colors?: string[];
  title?: string;
};

function PieChart({
  data,
  labels,
  colors = [],
  title = "",
}: PieChartProps) {
  const bgColors =
    colors.length > 0
      ? colors
      : data.map((_, i) => basePalette[i % basePalette.length]);

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: bgColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const, // default is 'top', change it to 'right'
        labels: {
          // Optional: customize label styles here
          boxWidth: 20,
          padding: 10,
        },
      },
    },
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg w-110">
      <h2 className="text-xl font-extrabold text-purple-900 mb-5">{title}</h2>
      <div className="flex flex-1">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
}

export default PieChart