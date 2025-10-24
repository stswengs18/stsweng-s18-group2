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


    