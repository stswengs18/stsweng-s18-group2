import { useState, useEffect } from 'react';
import { mockStatistics } from './mockData';

// --- THE MAGIC SWITCH ---
// Set this to `false` when you're ready to use the real API.
const USE_MOCK_DATA = true;

// The API endpoint the backend team will eventually provide.
const API_ENDPOINT = '/api/statistics'; // Example endpoint

/**
 * Custom hook to fetch and process statistics data.
 * This hook abstracts the data source from the components.
 * Components will just get data, loading, and error states.
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
          // --- MOCK DATA PATH ---
          // Simulate a network delay to test loading states.
          await new Promise(resolve => setTimeout(resolve, 500));
          rawData = mockStatistics;

        } else {
          // --- REAL API PATH ---
          // When ready, uncomment this block and the backend will provide the data.
          // const response = await fetch(API_ENDPOINT);
          // if (!response.ok) {
          //   throw new Error('Failed to fetch data from the server.');
          // }
          // rawData = await response.json();
        }

        // --- DATA TRANSFORMATION ---
        // This logic transforms the raw data (whether mock or real)
        // into the exact structure your UI components need.
        const transformedData = {
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
            types: rawData.interventionTypes.map((item, index) => {
              const interventionColors = ["bg-teal-500", "bg-green-500", "bg-red-500", "bg-gray-500", "bg-yellow-500"];
              return {
                name: item.type,
                value: item.count,
                color: interventionColors[index % interventionColors.length],
              };
            }),
          },
          // You can add more transformations here for other charts and sections.
        };

        setData(transformedData);

      } catch (err) {
        setError(err.message);
        console.error("Error fetching statistics data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []); // The empty dependency array means this effect runs once on component mount.

  return { data, loading, error };
}
