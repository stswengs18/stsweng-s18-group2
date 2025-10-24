import { useState, useEffect } from 'react';
import { mockStatistics } from './mockData';

const USE_MOCK_DATA = true;

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
        } else { /* Future API call */ }
        
        const transformedData = transformRawData(rawData);
        setData(transformedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { data, loading, error };
}

function transformRawData(rawData) {
    const interventionColors = ["bg-teal-500", "bg-green-500", "bg-red-500", "bg-gray-500", "bg-yellow-500"];
    const spuDistributionColors = {
        'North': { hex: '#06B6D4', tw: 'bg-cyan-500' },
        'East': { hex: '#F97316', tw: 'bg-orange-500' },
        'Central': { hex: '#FBBF24', tw: 'bg-amber-400' },
        'South': { hex: '#22C55E', tw: 'bg-green-500' },
        'West': { hex: '#6B7280', tw: 'bg-gray-500' },
    };
    const genderDistributionColors = {
        'Male': { hex: '#3B82F6', tw: 'bg-blue-500' },
        'Female': { hex: '#F97316', tw: 'bg-orange-500' },
        'Others': { hex: '#FBBF24', tw: 'bg-amber-400' },
    };

    const spuLabels = Object.keys(rawData.caseDistribution.bySPU);
    const totalSPUCases = rawData.caseDistribution.total;
    const genderData = rawData.genderDistribution;

    return {
        spuStatisticsCards: [
            { title: "Active Cases", value: rawData.activeCases.toLocaleString(), subtext: "Across all SPUs" },
            { title: "Cases Closed", value: rawData.casesClosed.toLocaleString(), subtext: "This period" },
            { title: "New Cases Added", value: rawData.newCases.toLocaleString(), subtext: "This period" },
            { title: "New Interventions", value: rawData.newInterventions.toLocaleString(), subtext: "This period" },
            { title: "Avg Case Duration", value: rawData.avgCaseDuration.toLocaleString(), subtext: "Days" },
            { title: "Average Interventions & Reports", value: rawData.avgInterventionsPerCase.toLocaleString(), subtext: "Per Case" },
        ],
        interventionsByTypeData: {
            title: "Interventions by Type",
            types: rawData.interventionTypes.map((item, index) => ({
                name: item.type,
                value: item.count,
                color: interventionColors[index % interventionColors.length],
            })),
        },

        caseDistributionData: {
            title: "Active Cases Distribution by SPU",
            subtitle: "Current distribution across SPUs",
            totalCases: totalSPUCases.toLocaleString(),
            chartData: {
                labels: spuLabels,
                datasets: [{
                    data: Object.values(rawData.caseDistribution.bySPU),
                    backgroundColor: spuLabels.map(label => spuDistributionColors[label]?.hex || '#CCCCCC'),
                    borderColor: '#FFFFFF',
                    borderWidth: 4,
                }]
            },
            legendData: spuLabels.map(label => ({
                label: `SPU ${label}`,
                value: rawData.caseDistribution.bySPU[label],
                percentage: ((rawData.caseDistribution.bySPU[label] / totalSPUCases) * 100).toFixed(0),
                color: spuDistributionColors[label]?.tw || 'bg-gray-400',
            }))
        },
        genderDistributionData: {
            title: "Gender Distribution",
            totalCases: genderData.total.toLocaleString(),
            chartData: {
                labels: ['Male', 'Female', 'Others'],
                datasets: [{
                    data: [genderData.male, genderData.female, genderData.others],
                    backgroundColor: [genderDistributionColors.Male.hex, genderDistributionColors.Female.hex, genderDistributionColors.Others.hex],
                    borderColor: '#FFFFFF',
                    borderWidth: 4,
                }]
            },
            legendData: [
                { label: 'Male', value: genderData.male, percentage: ((genderData.male / genderData.total) * 100).toFixed(0), color: genderDistributionColors.Male.tw },
                { label: 'Female', value: genderData.female, percentage: ((genderData.female / genderData.total) * 100).toFixed(0), color: genderDistributionColors.Female.tw },
                { label: 'Others', value: genderData.others, percentage: ((genderData.others / genderData.total) * 100).toFixed(0), color: genderDistributionColors.Others.tw },
            ]
        },
        keyDemographicsData: [
            { title: "Average Age", subtitle: "of clients", value: `${rawData.demographics.avgAge} years` },
            { title: "Family Members", subtitle: "average per case", value: `${rawData.demographics.familyMembers} members` },
            { title: "Family Income", subtitle: "excluding non-earners", value: `₱${rawData.demographics.income.toLocaleString()}` },
            { title: "Interventions", subtitle: "average per case", value: rawData.demographics.interventions },
            { title: "Case Duration", subtitle: "average time length", value: `${rawData.demographics.durationMonths} months` },
            { title: "Progress Reports", subtitle: "average per case", value: rawData.demographics.progressReports },
        ],
        workerDistributionData: {
            title: "Employee Distribution by Roles",
            subtitle: "Current distribution across all departments",
            chartData: [
                { label: "Social Workers", value: 12, color: "bg-teal-600" },
                { label: "Supervisors", value: 3, color: "bg-gray-600" },
                { label: "Heads", value: 8, color: "bg-green-600" },
            ],
            totalEmployees: 12 + 3 + 8 + 5,
        },

    };
}

