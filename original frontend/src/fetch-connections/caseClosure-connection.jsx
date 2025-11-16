/**
 *   Fetches the case data
 *   @param {*} caseID Case selected
 *   @returns Sponsored member object (AND form if it exists)
 */
const apiUrl = import.meta.env.VITE_API_URL || '/api';
export const fetchCaseData = async(caseID) => {
     try {
          const response = await fetch(`${apiUrl}/case-closure/${caseID}`,{
            method: 'GET',
            credentials: 'include',
        });
          
          if (!response.ok) 
               throw new Error('API error');

          const rawData = await response.json();
          return rawData
     } catch (err) {
          console.error('Error fetching case data:', err);
          return null;
     }
};

/**
 *   Fetches case closure form data
 *   @param {*} caseId  Case selected
 *   @param {*} formId Case closure form for that case
 *   @returns case closure form object
 */
export const fetchCaseClosureData = async (caseId) => {
    try {
        const response = await fetch(`${apiUrl}/case-closure/${caseId}`,{
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) throw new Error('API error');
        return await response.json();
    } catch (error) {
        console.error('Error fetching financial intervention data:', error);
        return null;
    }
};

/**
 *   Creates the case closure
 *   @param {*} createdData The details for that creation
 *   @param {*} caseID Case selected
 *   @returns  IF newly created: new case closure form
 *             IF a form is found: case object AND form object
 */
export const createCaseClosureForm = async(createdData, caseID) => {
     try {
          const response = await fetch(`${apiUrl}/case-closure/create/${caseID}`, {
               method: 'PUT',
               headers: {
               'Content-Type': 'application/json',
               },
               credentials:'include',
               body: JSON.stringify(createdData),
          });
          
          if (!response.ok) 
               throw new Error('API error');

          const newCaseClose = await response.json();
          return newCaseClose
     } catch (err) {
          console.error('Error creating form:', err);
          return null;
     }
};

/**
 *   Edits a case closure form
 *   @returns  returnData:
 *                  message -- status message
 *                  case -- case selected; sponsored member object
 *                  form -- updated form; case closure form object
 */
export const editCaseClosureForm = async(updatedData, caseID) => {
     try {
          const response = await fetch(`${apiUrl}/case-closure/edit/${caseID}`, {
               method: 'PUT',
               headers: {
               'Content-Type': 'application/json',
               },
               credentials:'include',
               body: JSON.stringify(updatedData),
          });
          
          if (!response.ok) 
               throw new Error('API error');

          const returnData = await response.json();
          return returnData
     } catch (err) {
          console.error('Error editing form:', err);
          return null;
     }
};

/**
 *   Terminates a case
 *   @returns  returnData:
 *                  message -- status message
 *                  case -- case selected; sponsored member object
 *                  form -- form selected, case closure form object
 */
export const terminateCase = async(caseID) => {
     try {
          const response = await fetch(`${apiUrl}/case-closure/terminate/${caseID}`, {
               method: 'PUT',
               headers: {
               'Content-Type': 'application/json',
               },
               credentials:'include', 
          });
          
          if (!response.ok) 
               throw new Error('API error');

          const returnData = await response.json();
          return returnData
     } catch (err) {
          console.error('Error editing form:', err);
          return null;
     }
};

/**
 *   Deletes a case closure form
 *   @returns  returnData:
 *                  message -- status message
 *                  case -- case selected; sponsored member object
 */
export const deleteCaseClosureForm = async(caseID) => {
     try {
          const response = await fetch(`${apiUrl}/case-closure/delete/${caseID}`, {
               method: 'DELETE',
               headers: {
               'Content-Type': 'application/json',
               },
               credentials:'include',
          });
          
          if (!response.ok) 
               throw new Error('API error');

          const returnData = await response.json();
          return returnData
     } catch (err) {
          console.error('Error editing form:', err);
          return null;
     }
};