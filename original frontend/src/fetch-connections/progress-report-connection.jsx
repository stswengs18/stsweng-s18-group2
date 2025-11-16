const apiUrl = import.meta.env.VITE_API_URL || '/api';
export const fetchProgressReport = async (caseID, reportID) => {
    try {
        const response = await fetch(`${apiUrl}/progress-report/view/${caseID}/${reportID}`,{
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error("Failed to fetch progress report");
        }

        const report = await response.json();
        return report;
    } catch (error) {
        console.error("Error fetching progress report:", error);
        return null;
        // throw error;
    }
}

export const fetchCaseData = async (caseID) => {
    try {
        const response = await fetch(`${apiUrl}/progress-report/add/${caseID}`,{
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error("Failed to fetch case data");
        }

        const caseData = await response.json();
        return caseData;
    } catch (error) {
        console.error("Error fetching case data:", error);
        return null;
        // throw error;
    }
}

export const fetchProgressReportsForCase = async (caseID) => {
    try {
        const response = await fetch(`${apiUrl}/progress-report/case/${caseID}`,{
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error("Failed to fetch progress reports for case");
        }

        const reports = await response.json();
        return reports;
    } catch (error) {
        console.error("Error fetching progress reports for case:", error);
        throw error;
    }
}

export const addProgressReport = async (data, caseID) => {
    try {
        const response = await fetch(`${apiUrl}/progress-report/add/${caseID}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials:"include",
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to add progress report");
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error adding progress report:", error);
        throw error;
    }
}

export const deleteProgressReport = async (reportID) => {
    try {
        const response = await fetch(`${apiUrl}/progress-report/delete/${reportID}`, {
            method: "DELETE",
            credentials:"include",
        });

        if (!response.ok) {
            throw new Error("Failed to delete progress report");
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error deleting progress report:", error);
        throw error;
    }
}

export const editProgressReport = async (reportID, data) => {
    try {
        const response = await fetch(`${apiUrl}/progress-report/edit/${reportID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials:"include",
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to edit progress report");
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error editing progress report:", error);
        throw error;
    }
}