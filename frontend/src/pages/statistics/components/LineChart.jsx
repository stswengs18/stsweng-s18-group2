import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function LineChart({ data, color = "#06B6D4", height = 200 }) {
  // data: [{ date, value }]
  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: "Value",
        data: data.map(d => d.value),
        borderColor: color,
        backgroundColor: color + "33", // semi-transparent fill
        fill: true,
        tension: 0.3,
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {},
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { display: true }, beginAtZero: true },
    },
  };

  return <Line data={chartData} options={options} height={height} />;
}
