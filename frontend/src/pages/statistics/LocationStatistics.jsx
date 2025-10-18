// frontend/src/pages/statistics/LocationStatistics.jsx
import React from "react";
import Header from "./components/Header";
import StatCard from "./components/StatCard";
import SectionCard from "./components/SectionCard";
import { Info, LoaderCircle } from "lucide-react";

// --- IMPORT YOUR ICONS & THE NEW HOOK ---
import {
  ActiveCasesIcon, CasesClosedIcon, NewCasesAddedIcon, NewInterventionsIcon,
  AvgCaseDurationIcon, AvgInterventionsReportsIcon
} from "./components/CustomIcons";
import { useStatisticsData } from "./useStatisticsData"; // Import the custom hook

export default function LocationStatistics() {
  // Call the hook to get data and state. All logic is hidden away.
  const { data, loading, error } = useStatisticsData();

  // --- RENDER A LOADING STATE ---
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

  // --- RENDER AN ERROR STATE ---
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
  
  // Assign icons to the transformed data
  const icons = [ActiveCasesIcon, CasesClosedIcon, NewCasesAddedIcon, NewInterventionsIcon, AvgCaseDurationIcon, AvgInterventionsReportsIcon];
  const spuStatisticsCards = data.spuStatisticsCards.map((card, index) => ({
      ...card,
      iconComponent: icons[index]
  }));

  // --- RENDER THE DATA WHEN IT'S READY ---
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
              const percentage = maxValue > 0 ? (type.value / maxValue) * 100 : 0;

              return (
                <div key={index} className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 w-16 shrink-0">{type.name}</span>
                  <div className="flex-grow bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${type.color}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-800 w-8 text-right shrink-0">{type.value}</span>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </main>
    </div>
  );
}

