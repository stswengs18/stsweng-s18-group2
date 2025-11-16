
const apiUrl = import.meta.env.VITE_API_URL || '/api';
// ========== COUNSELING INTERVENTION CONNECTION ==========
export const fetchCaseData = async (caseID) => {
    try {
        const response = await fetch(`${apiUrl}/intervention/counseling/add/${caseID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials:'include',
        });

        if (!response.ok) {
            throw new Error("Failed to fetch counseling information");
        }

        const sm_data = await response.json();

        return sm_data;
    } catch (error) {
        console.error("Error fetching counseling information:", error);
        return null;
        // throw error;
    }
};

export const fetchCounselingIntervention = async (caseId, counselingId) => {
    try {
        const response = await fetch(`${apiUrl}/intervention/counseling/intervention/${caseId}/${counselingId}`,{
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error("Failed to fetch counseling intervention");
        }

        const intervention = await response.json();
        return intervention;
    } catch (error) {
        console.error("Error fetching counseling intervention:", error);
        return null;
        // throw error;
    }
}

export const fetchAllCounselingInterventionsByMemberId = async (memberID) => {
    try {
        const response = await fetch(`${apiUrl}/intervention/counseling/member/${memberID}`,{
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error("Failed to fetch counseling interventions");
        }

        const interventions = await response.json();
        return interventions;
    } catch (error) {
        console.error("Error fetching counseling interventions:", error);
        throw error;
    }
}

export const addCounselingIntervention = async (data, caseID) => {
    try {
        const response = await fetch(`${apiUrl}/intervention/counseling/add/${caseID}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials:'include',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to add counseling intervention");
        }

        const result = await response.json();        
        return result;
    } catch (error) {
        console.error("Error adding counseling intervention:", error);
        throw error;
    }
};

export const editCounselingIntervention = async (data, counselingId) => {
    try {
        const response = await fetch(`${apiUrl}/intervention/counseling/edit/${counselingId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials:"include",
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to edit counseling intervention");
        }

        const result = await response.json();        
        return result;
    } catch (error) {
        console.error("Error editing counseling intervention:", error);
        throw error;
    }
};

export const deleteCounselingIntervention = async (interventionID) => {
    try {
        const response = await fetch(`${apiUrl}/intervention/counseling/delete/${interventionID}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials:"include",
        });

        if (!response.ok) {
            throw new Error("Failed to delete counseling intervention");
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error deleting counseling intervention:", error);
        throw error;
    }
}