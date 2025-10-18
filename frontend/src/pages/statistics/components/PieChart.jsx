// frontend/src/pages/statistics/components/PieChart.jsx
import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ title, labels, data }) {
  const colors = ["#23949A", "#E46455", "#F2C94C", "#9B51E0", "#6FCF97"];

  return (
    <div className="bg-white shadow-md rounded-2xl p-6">
      <h4 className="text-gray-700 mb-4 font-semibold">{title}</h4>
      <Pie
        data={{
          labels,
          datasets: [
            {
              data,
              backgroundColor: colors,
              borderWidth: 1,
            },
          ],
        }}
        options={{
          plugins: {
            legend: {
              position: "bottom",
              labels: { color: "#333", boxWidth: 12, padding: 15 },
            },
          },
        }}
      />
    </div>
  );
}
