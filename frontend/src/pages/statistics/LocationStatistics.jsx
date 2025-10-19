// frontend/src/pages/statistics/LocationStatistics.jsx
import React from "react";
import Header from "./components/Header";
import StatCard from "./components/StatCard";
import SectionCard from "./components/SectionCard";
import DoughnutChart from "./components/DoughnutChart"; // Import the new chart component
import { Info, LoaderCircle } from "lucide-react";

import {
  ActiveCasesIcon, CasesClosedIcon, NewCasesAddedIcon, NewInterventionsIcon,
  AvgCaseDurationIcon, AvgInterventionsReportsIcon
} from "./components/CustomIcons";
import { useStatisticsData } from "./useStatisticsData";

export default function LocationStatistics() {
  const { data, loading, error } = useStatisticsData();

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen">
        <Header />
        <div className="flex h-[calc(100vh-80px)] items-center justify-center">
            <div className="flex flex-col items-center space-y-2 text-gray-500">
                <LoaderCircle className="animate-spin h-8 w-8" />
                <span>Loading Statistics...</span>
            </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
        <div className="bg-slate-50 min-h-screen">
            <Header />
            <div className="flex h-[calc(100vh-80px)] items-center justify-center">
                <div className="text-center text-red-600 bg-red-50 p-6 rounded-lg border border-red-200">
                    <h2 className="text-lg font-semibold">Failed to load data</h2>
                    <p>{error}</p>
                </div>
            </div>
        </div>
    );
  }
  
  const icons = [ActiveCasesIcon, CasesClosedIcon, NewCasesAddedIcon, NewInterventionsIcon, AvgCaseDurationIcon, AvgInterventionsReportsIcon];
  const spuStatisticsCards = data.spuStatisticsCards.map((card, index) => ({
      ...card,
      iconComponent: icons[index]
  }));

  return (
    <div className="bg-slate-50 min-h-screen">
      <Header />
      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">SPU Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {spuStatisticsCards.map((card, index) => (
            <StatCard
              key={index}
              title={card.title}
              value={card.value}
              subtext={card.subtext}
              iconComponent={card.iconComponent}
            />
          ))}
        </div>

        <SectionCard
          title={data.interventionsByTypeData.title}
          headerAction={
            <button className="text-gray-400 hover:text-gray-600" aria-label="More info">
              <Info size={18} />
            </button>
          }
        >
          <div className="space-y-4 pt-2">
            {data.interventionsByTypeData.types.map((type, index) => {
              const maxValue = Math.max(...data.interventionsByTypeData.types.map((t) => t.value));
              // --- THIS LINE IS NOW FIXED ---
              const percentage = maxValue > 0 ? (type.value / maxValue) * 100 : 0;
              return (
                <div key={index} className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 w-16 shrink-0">{type.name}</span>
                  <div className="flex-grow bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full ${type.color}`} style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-gray-800 w-8 text-right shrink-0">{type.value}</span>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* --- SECTION: Active Cases Distribution --- */}
        <SectionCard>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">{data.caseDistributionData.title}</h3>
              <p className="text-sm text-gray-500">{data.caseDistributionData.subtitle}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Doughnut Chart */}
            <div className="relative h-64 w-64 mx-auto">
              <DoughnutChart 
                data={data.caseDistributionData.chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  cutout: '70%',
                  plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true },
                  }
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-gray-800">{data.caseDistributionData.totalCases}</span>
                <span className="text-sm text-gray-500">Total Cases</span>
              </div>
            </div>

            {/* Custom Legend */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {data.caseDistributionData.legendData.map((item) => (
                <div key={item.label} className="flex items-center">
                  <span className={`h-3 w-3 rounded-full mr-3 ${item.color}`}></span>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <span className="text-sm font-semibold text-gray-800">
                      {item.value.toLocaleString()} ({item.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

      </main>
    </div>
  );
}

