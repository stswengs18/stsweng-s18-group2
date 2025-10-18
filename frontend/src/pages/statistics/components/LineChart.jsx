// frontend/src/pages/statistics/components/LineChart.jsx
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function LineChart({ title, labels, data, color = "#23949A" }) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6">
      <h4 className="text-gray-700 mb-4 font-semibold">{title}</h4>
      <Line
        data={{
          labels,
          datasets: [
            {
              label: title,
              data,
              borderColor: color,
              backgroundColor: `${color}33`,
              fill: true,
              tension: 0.3,
              pointRadius: 4,
              pointBackgroundColor: color,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: { mode: "index", intersect: false },
          },
          scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true },
          },
        }}
      />
    </div>
  );
}
