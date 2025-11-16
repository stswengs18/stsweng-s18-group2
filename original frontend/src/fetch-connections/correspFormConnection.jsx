 
const apiUrl = import.meta.env.VITE_API_URL || '/api';
/**
 * Creates a new Intervention Correspondence form for a sponsored member.
 * @param {string} caseId - The ObjectId of the Sponsored Member.
 * @param {object} formData - The data for the new correspondence intervention form.
 * @returns {Promise<object|null>} The newly created form object, or null on error.
 *   Returned variables in the form object:
 *     - _id: string
 *     - interventionType: string
 *     - name_of_sponsor: string
 *     - date_of_sponsorship: string
 *     - identified_problem: string
 *     - assesment: string
 *     - objective: string
 *     - recommendation: string
 *     - intervention_plans: Array<{ action: string, time_frame: string, results: string, _id: string }>
 *     - progress_reports: string[]
 *     - createdAt: string
 *     - updatedAt: string
 *     - __v: number
 */
export const createCorrespForm = async (caseId, formData) => {
    try {
        const response = await fetch(`${apiUrl}/interventions/correspondence/create-form/${caseId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials:'include',
            body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error('API error');
        return await response.json();
    } catch (error) {
        console.error('Error creating correspondence form:', error);
        return null;
    }
};

/**
 * Fetches a specific Intervention Correspondence form and sponsored member info.
 * @param {string} caseId - The ObjectId of the Sponsored Member.
 * @param {string} formId - The ObjectId of the Intervention Correspondence form.
 * @returns {Promise<{sponsored_member: object, form: object}|null>}
 *   sponsored_member: { first_name, middle_name, last_name, sm_number, dob, present_address }
 *   form: { ...all form fields... }
 */
export const fetchCorrespFormData = async (caseId, formId) => {
    try {
        const response = await fetch(`${apiUrl}/interventions/correspondence/viewform/${caseId}/${formId}`,{
            method:'GET',
            credentials:'include',
        });
        if (!response.ok) throw new Error('API error');
        return await response.json();
    } catch (error) {
        console.error('Error fetching correspondence form data:', error);
        return null;
    }
};

/**
 * Fetches all correspondence intervention forms for a sponsored member.
 * @param {string} caseId - The ObjectId of the Sponsored Member.
 * @returns {Promise<Array<{id: string, intervention_number: number}>|null>}
 *   Returns an array of objects with:
 *     - id: string
 *     - intervention_number: number
 */
export const fetchAllCorrespInterventions = async (caseId) => {
    try {
        const response = await fetch(`${apiUrl}/interventions/correspondence/getAllForms/${caseId}`,{
            method: 'GET',
            credentials: 'include',
        });
        if (!response.ok) throw new Error('API error');
        return await response.json();
    } catch (error) {
        console.error('Error fetching correspondence interventions:', error);
        return null;
    }
};

/**
 * Edits a specific Intervention Correspondence form.
 * @param {string} formId - The ObjectId of the form to edit.
 * @param {object} newData - The updated form data.
 * @returns {Promise<object|null>} The updated form object, or null on error.
 */
export const editCorrespForm = async (formId, newData) => {
    try {
        const response = await fetch(`${apiUrl}/interventions/correspondence/edit-form/${formId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials:'include',
            body: JSON.stringify(newData),
        });
        if (!response.ok) throw new Error('API error');
        const result = await response.json();
        return result.form;
    } catch (error) {
        console.error('Error editing correspondence form:', error);
        return null;
    }
};

/**
 * Adds a new intervention plan to an existing correspondence form.
 * @param {string} formId - The ObjectId of the correspondence form.
 * @param {object} planData - The new intervention plan ({ action, time_frame, results }).
 * @returns {Promise<object|null>} The updated form object, or null on error.
 */
export const addCorrespInterventionPlan = async (formId, planData) => {
    try {
        const response = await fetch(`${apiUrl}/interventions/correspondence/add-plans/${formId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials:'include',
            body: JSON.stringify(planData),
        });
        if (!response.ok) throw new Error('API error');
        const result = await response.json();
        return result.form;
    } catch (error) {
        console.error('Error adding intervention plan:', error);
        return null;
    }
};

/**
 * Deletes an intervention plan from a correspondence form by plan _id.
 * @param {string} formId - The ObjectId of the correspondence form.
 * @param {string} planId - The ObjectId of the intervention plan to delete.
 * @returns {Promise<object|null>} The updated form object, or null on error.
 */
export const deleteCorrespInterventionPlan = async (formId, planId) => {
    try {
        const response = await fetch(`${apiUrl}/interventions/correspondence/delete-plan/${formId}/${planId}`, {
            method: 'DELETE',
            credentials:'include',
        });
        if (!response.ok) throw new Error('API error');
        const result = await response.json();
        return result.form;
    } catch (error) {
        console.error('Error deleting intervention plan:', error);
        return null;
    }
};
/**
 * Deletes an  correspondence form by formId.
 * @param {string} formId - The ObjectId of the correspondence form.
 * @returns {Promise<object|null>} The updated form object, or null on error.
 */
export const deleteCorrespInterventionForm = async(formId) => {
    try {
        const response = await fetch(`${apiUrl}/interventions/correspondence/delete/${formId}`, {
            method: 'DELETE',
            credentials:'include',
        });
        if (!response.ok) throw new Error('API error');
        const result = await response.json();
        return result.form;
    } catch (error) {
        console.error('Error deleting intervention correspondence plan:', error);
        return null;
    }
}

export const fetchAutoFillCorrespData = async(caseId) =>{
    try{
        const response = await fetch(`${apiUrl}/interventions/correspondence/getAutoFillForm/${caseId}`,{
            method:'GET',
            credentials:'include',
        })
        if(!response.ok) throw new Error('API Error');
        const result = await response.json();
        return result
    }catch(error){
        console.error('Error fetching Case Data', error);
        return null;
    }
};