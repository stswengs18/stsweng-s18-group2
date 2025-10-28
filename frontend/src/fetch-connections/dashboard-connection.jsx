const apiUrl = import.meta.env.VITE_API_URL || '/api';

export const fetchActiveCasesCount = async () => {
    try {
        const response = await fetch(`${apiUrl}/dashboard/active-cases-count`, {
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Failed to fetch active cases count');
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching active cases count:", error);
        throw error;
    }
};

export const fetchClosedCasesCount = async () => {
    try {
        const response = await fetch(`${apiUrl}/dashboard/closed-cases-count`, {
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Failed to fetch closed cases count');
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching closed cases count:", error);
        throw error;
    }
};

export const fetchInterventionCorrespondenceCount = async () => {
    try {
        const response = await fetch(`${apiUrl}/dashboard/intervention-correspondence-count`, {
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Failed to fetch intervention correspondence count');
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching intervention correspondence count:", error);
        throw error;
    }
};

export const fetchInterventionCounselingCount = async () => {
    try {
        const response = await fetch(`${apiUrl}/dashboard/intervention-counseling-count`, {
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Failed to fetch intervention counseling count');
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching intervention counseling count:", error);
        throw error;
    }
};

export const fetchInterventionFinancialCount = async () => {
    try {
        const response = await fetch(`${apiUrl}/dashboard/intervention-financial-count`, {
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Failed to fetch intervention financial count');
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching intervention financial count:", error);
        throw error;
    }
};

export const fetchInterventionHomeVisitCount = async () => {
    try {
        const response = await fetch(`${apiUrl}/dashboard/intervention-home-visit-count`, {
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Failed to fetch intervention home visit count');
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching intervention home visit count:", error);
        throw error;
    }
};

export const fetchActiveCasesPerSpu = async () => {
    try {
        const response = await fetch(`${apiUrl}/dashboard/active-cases-per-spu`, {
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Failed to fetch active cases per SPU');
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching active cases per SPU:", error);
        throw error;
    }
};

//case demographic
// Gender Distribution
export const fetchGenderDistribution = async () => {
  try {
    const response = await fetch(`${apiUrl}/dashboard/gender-distribution`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch gender distribution');
    return await response.json();
  } catch (error) {
    console.error("Error fetching gender distribution:", error);
    throw error;
  }
};

// Average Age of Clients
export const fetchAverageAge = async () => {
  try {
    const response = await fetch(`${apiUrl}/dashboard/average-age`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch average age');
    return await response.json();
  } catch (error) {
    console.error("Error fetching average age:", error);
    throw error;
  }
};

// Average Family Size (by last name)
export const fetchAverageFamilySize = async () => {
  try {
    const response = await fetch(`${apiUrl}/dashboard/average-family-size`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch average family size');
    return await response.json();
  } catch (error) {
    console.error("Error fetching average family size:", error);
    throw error;
  }
};

// Average Family Income (earners only)
export const fetchAverageFamilyIncome = async () => {
  try {
    const response = await fetch(`${apiUrl}/dashboard/average-family-income`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch average family income');
    return await response.json();
  } catch (error) {
    console.error("Error fetching average family income:", error);
    throw error;
  }
};

// Average Number of Interventions per Case
export const fetchAverageInterventionsPerCase = async () => {
  try {
    const response = await fetch(`${apiUrl}/dashboard/average-interventions`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch average interventions per case');
    return await response.json();
  } catch (error) {
    console.error("Error fetching average interventions per case:", error);
    throw error;
  }
};

// Average Case Duration (in days)
export const fetchAverageCaseDuration = async () => {
  try {
    const response = await fetch(`${apiUrl}/dashboard/average-case-duration`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch average case duration');
    return await response.json();
  } catch (error) {
    console.error("Error fetching average case duration:", error);
    throw error;
  }
};
    