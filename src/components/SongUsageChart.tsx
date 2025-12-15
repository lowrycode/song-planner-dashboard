import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type SongUsageChartProps = {
  labels: string[];
  datasets: any[];
  title?: string;
};

function SongUsageChart({
  labels,
  datasets,
  title = "Usage Over Time",
}: SongUsageChartProps) {
  const data = { labels, datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { stacked: true },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  return (
    <>
      <h2 className="text-xl font-extrabold text-purple-900 mb-5">{title}</h2>
      <div className="h-56">
        <Bar data={data} options={options} />
      </div>
    </>
  );
}

export default SongUsageChart;
