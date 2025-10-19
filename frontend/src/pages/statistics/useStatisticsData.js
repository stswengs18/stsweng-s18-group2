import { useState, useEffect } from 'react';
import { mockStatistics } from './mockData';

// --- THE MAGIC SWITCH ---
const USE_MOCK_DATA = true;
const API_ENDPOINT = '/api/statistics';

/**
 * Custom hook to fetch and process statistics data.
 */
export function useStatisticsData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        let rawData;
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 500));
          rawData = mockStatistics;
        } else {
          // Real API call logic would go here
        }

        // --- DATA TRANSFORMATION ---
        const transformedData = transformRawData(rawData);
        setData(transformedData);

      } catch (err) {
        setError(err.message);
        console.error("Error fetching statistics data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}


/**
 * Helper function to transform raw data into UI-ready structures.
 */
function transformRawData(rawData) {
    const interventionColors = ["bg-teal-500", "bg-green-500", "bg-red-500", "bg-gray-500", "bg-yellow-500"];
    
    // --- New Transformation for Doughnut Chart ---
    const spuDistributionColors = {
        'North': { hex: '#06B6D4', tw: 'bg-cyan-500' },   // SPU North: Teal
        'East': { hex: '#F97316', tw: 'bg-orange-500' },  // SPU East: Orange
        'Central': { hex: '#FBBF24', tw: 'bg-amber-400' }, // SPU Central: Yellow
        'South': { hex: '#22C55E', tw: 'bg-green-500' },  // SPU South: Green
        'West': { hex: '#6B7280', tw: 'bg-gray-500' },    // SPU West: Gray
    };

    const spuLabels = Object.keys(rawData.caseDistribution.bySPU);
    const spuData = Object.values(rawData.caseDistribution.bySPU);
    const totalCases = rawData.caseDistribution.total;

    return {
        spuStatisticsCards: [
            { title: "Active Cases", value: rawData.activeCases.toLocaleString(), subtext: "Across all SPUs" },
            { title: "Cases Closed", value: rawData.casesClosed.toLocaleString(), subtext: "This period" },
            { title: "New Cases Added", value: rawData.newCases.toLocaleString(), subtext: "This period" },
            { title: "New Interventions", value: rawData.newInterventions.toLocaleString(), subtext: "This period" },
            { title: "Avg Case Duration", value: rawData.avgCaseDuration.toLocaleString(), subtext: "This period" },
            { title: "Average Interventions & Reports", value: rawData.avgInterventionsPerCase.toLocaleString(), subtext: "Across all SPUs" },
        ],
        interventionsByTypeData: {
            title: "Interventions by Type",
            types: rawData.interventionTypes.map((item, index) => ({
                name: item.type,
                value: item.count,
                color: interventionColors[index % interventionColors.length],
            })),
        },
        // --- Data structure for the new SPU Distribution section ---
        caseDistributionData: {
            title: "Active Cases Distribution by SPU",
            subtitle: "Current distribution across SPUs",
            totalCases: totalCases.toLocaleString(),
            chartData: {
                labels: spuLabels.map(label => `SPU ${label}`),
                datasets: [{
                    data: spuData,
                    backgroundColor: spuLabels.map(label => spuDistributionColors[label].hex),
                    borderColor: '#FFFFFF',
                    borderWidth: 4,
                    hoverBorderWidth: 4,
                }]
            },
            legendData: spuLabels.map(label => ({
                label: `SPU ${label}`,
                value: rawData.caseDistribution.bySPU[label],
                percentage: ((rawData.caseDistribution.bySPU[label] / totalCases) * 100).toFixed(0),
                color: spuDistributionColors[label].tw,
            }))
        }
    };
}

