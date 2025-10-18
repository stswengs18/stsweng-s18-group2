// frontend/src/pages/statistics/components/StatCard.jsx
import React from "react";

export default function StatCard({
  title,
  value,
  subtext,
  iconComponent: Icon = null,
  // The 'iconBgColor' prop is no longer used but kept for component signature consistency
  iconBgColor = "bg-transparent", 
  valueColor = "text-gray-900",
}) {
  return (
    <div className="bg-white shadow-sm rounded-xl p-4 flex flex-col justify-between border border-gray-100">
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col">
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className={`text-3xl font-bold mt-1 ${valueColor}`}>{value}</p>
        </div>
        {/* The wrapper div is gone, and the icon is much larger */}
        {Icon && <Icon className="h-16 w-16" />}
      </div>
      {subtext && <p className="text-xs text-gray-400">{subtext}</p>}
    </div>
  );
}