// frontend/src/pages/statistics/mockData.js
export const mockStatistics = {
  spu: "SPU North",
  dateRange: "Last 30 days",
  activeCases: 2840,
  casesClosed: 1256,
  newCases: 136,
  avgCaseDuration: 109,
  newInterventions: 301,
  avgInterventionsPerCase: 2840,

  interventionTypes: [
    { type: "Type 1", count: 28 },
    { type: "Type 2", count: 23 },
    { type: "Type 3", count: 15 },
    { type: "Type 4", count: 8 },
    { type: "Type 5", count: 6 },
  ],

  caseDistribution: {
    total: 1247,
    bySPU: {
      North: 312,
      South: 268,
      East: 243,
      West: 204,
      Central: 220,
    },
  },

  genderDistribution: {
    total: 312,
    male: 187,
    female: 115,
    others: 10,
  },

  demographics: {
    avgAge: 31,
    familyMembers: 4,
    income: 17850,
    interventions: 3.4,
    durationMonths: 7.8,
    progressReports: 5.2,
  },

  workerMetrics: {
    workerToCaseRatio: "1 : 26",
    workerToSupervisorRatio: "4 : 1",
    newEmployees: 4,
    roleDistribution: {
      "Social Workers": 12,
      Supervisors: 3,
      "Case Managers": 8,
      "Support Staff": 5,
      Admin: 2,
    },
  },

  casesOverTime: [10, 12, 14, 16, 18, 21, 22, 24, 25],
  employeesOverTime: [5, 6, 7, 7, 8, 9, 10, 11, 12],
};
