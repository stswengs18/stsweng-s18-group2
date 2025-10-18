// frontend/src/pages/statistics/components/BarChart.jsx
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BarChart({ title, labels, data }) {
  const colors = ["#23949A", "#E46455", "#F2C94C", "#9B51E0", "#6FCF97"];

  return (
    <div className="bg-white shadow-md rounded-2xl p-6">
      <h4 className="text-gray-700 mb-4 font-semibold">{title}</h4>
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: title,
              data,
              backgroundColor: colors.slice(0, data.length),
              borderRadius: 8,
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
            y: { ticks: { stepSize: 5 }, beginAtZero: true },
          },
        }}
      />
    </div>
  );
}
