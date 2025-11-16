import { generateHomeVisitForm } from "../generate-documents/generate-documents";


const apiUrl = import.meta.env.VITE_API_URL || '/api';
export const fetchCaseData = async (caseID) => {
    try {
        const response = await fetch(
            `${apiUrl}/intervention/home-visit-form/${caseID}`,{
            method: 'GET',
            credentials: 'include',
        }
        );

        if (!response.ok) throw new Error("API error");
        const rawData = await response.json();

        // Transform family datat to fit family card
        const transformedFamily = rawData.otherFamily.map((family) => ({
            first: family.first_name,
            last: family.last_name,
            middle: family.middle_name,
            income: family.income,
            occupation: family.occupation,
            education: family.edu_attainment,
            relationship: family.relationship_to_sm,
            civilStatus: family.civil_status,
            status: family.status,
            age: family.age,
        }));
        rawData.transformedFamily = transformedFamily;

        return rawData;
    } catch (err) {
        console.error("Error fetching case data:", err);
        return null;
    }
};

export const fetchFormData = async (caseID, formID) => {
    try {
        const response = await fetch(
            `${apiUrl}/intervention/home-visit-form/${caseID}/${formID}`,{
            method: 'GET',
            credentials: 'include',
        }
        );

        if (!response.ok) throw new Error("API error");
        const rawData = await response.json();
        
        // Transform family datat to fit family card
        const transformedFamily = rawData.form.familyMembers.map((family) => ({
            first: family.first_name,
            last: family.last_name,
            middle: family.middle_name,
            income: family.income,
            occupation: family.occupation,
            education: family.edu_attainment,
            relationship: family.relationship_to_sm,
            civilStatus: family.civil_status,
            status: family.status,
            age: family.age,
        }));
        rawData.transformedFamily = transformedFamily;
        return rawData;
    } catch (err) {
        console.error("Error fetching form data:", err);
        return null;
    }
};

export const fetchAllHomeVisitForms = async (caseID) => {
    try {
        const response = await fetch(
            `${apiUrl}/intervention/home-visit-form/all/${caseID}`,{
            method: 'GET',
            credentials: 'include',
        }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch home visit interventions");
        }

        const interventions = await response.json();
        return interventions;
    } catch (error) {
        console.error("Error fetching home visit interventions:", error);
        throw error;
    }
};

export const createHomeVis = async (createdData, caseID) => {
    try {
        const response = await fetch(
            `${apiUrl}/intervention/home-visit-form/create/${caseID}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials:'include',
                body: JSON.stringify(createdData),
            },
        );

        if (!response.ok) throw new Error("API error");

        const newHomeVis = await response.json();
        return newHomeVis
    } catch (err) {
        console.error("Error creating form:", err);
        return null;
    }
};

export const editHomeVis = async (updatedData, caseID, formID) => {
    try {
        const response = await fetch(
            `${apiUrl}/intervention/home-visit-form/edit/${caseID}/${formID}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials:'include',
                body: JSON.stringify(updatedData),
            },
        );

        if (!response.ok) throw new Error("API error");

        const editedHomeVis = await response.json();
        // console.log(editedHomeVis);
    } catch (err) {
        console.error("Error editing form:", err);
        return null;
    }
};

export const deleteHomeVis = async (formID) => {
    try {
        const response = await fetch(
            `${apiUrl}/intervention/delete/home-visit-form/${formID}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials:'include',
            },
        );

        if (!response.ok) {
            throw new Error("Failed to delete home visit intervention");
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error deleting home visit intervention:", error);
        throw error;
    }
};