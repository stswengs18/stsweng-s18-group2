const apiUrl = import.meta.env.VITE_API_URL || '/api';
/**
 * Fetches data for Head view, including all active sponsored members and all employees.
 * Session automatically handles authentication through cookies.
 * @returns {Promise<{cases: Array, employees: Array}|null>}
 *   Returns an object with:
 *     - cases: Array of sponsored members with basic info and assigned SDW
 *     - employees: Array of employees with basic info and role
 */
export const fetchHeadViewData = async () => {
    try {
        const response = await fetch(`${apiUrl}/dashboard/head`, {
            method: 'GET',
            credentials: 'include', 
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Not authenticated');
            }
            throw new Error('API error');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching head view data:', error);
        return null;
    }
};

/**
 * Fetches Head view data filtered by a specific SPU.
 * @body {string} spu - The SPU ID to filter by
 * @returns {Promise<{cases: Array, employees: Array}|null>}
 *   Returns an object with:
 *     - cases: Array of sponsored members in the specified SPU
 *     - employees: Array of employees in the specified SPU
 */
export const fetchHeadViewBySPU = async (spu) => {
    try {
        const response = await fetch(`${apiUrl}/dashboard/head/spu`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ spu })
        });
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Not authenticated');
            }
            throw new Error('API error');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching head view data by SPU:', error);
        return null;
    }
};

/**
 * Fetches Supervisor view data for the logged-in supervisor's SPU.
 * Uses session data to identify the supervisor and their SPU.
 * @returns {Promise<{cases: Array, employees: Array}|null>}
 *   Returns an object with:
 *     - cases: Array of sponsored members in the supervisor's SPU
 *     - employees: Array of employees (excluding heads/admins) in the supervisor's SPU
 */
export const fetchSupervisorViewData = async () => {
    try {
        const response = await fetch(`${apiUrl}/dashboard/supervisor`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Not authenticated');
            }
            throw new Error('API error');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching supervisor view data:', error);
        return null;
    }
};

/**
 * Fetches Social Development Worker view data for the logged-in SDW.
 * Uses session data to identify the SDW and their assigned cases.
 * @returns {Promise<{cases: Array}|null>}
 *   Returns an object with:
 *     - cases: Array of sponsored members assigned to the SDW
 */
export const fetchSDWViewData = async () => {
    try {
        const response = await fetch(`${apiUrl}/dashboard/socialdevelopmentworker`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Not authenticated');
            }
            throw new Error('API error');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching SDW view data:', error);
        return null;
    }
};

/**
 * Fetches all Social Development Workers managed by a specific supervisor.
 * @param {string} supervisorId - The ObjectId of the supervisor
 * @returns {Promise<Array|null>} Array of SDWs with basic info
 */
export const fetchSDWsBySupervisor = async (supervisorId) => {
    try {
        const response = await fetch(`${apiUrl}/dashboard/head/${supervisorId}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Not authenticated');
            }
            throw new Error('API error');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching SDWs by supervisor:', error);
        return null;
    }
};

/**
 * Fetches all cases (sponsored members) assigned to a specific SDW.
 * For use by Supervisors viewing their SDWs' cases.
 * @param {string} sdwId - The ObjectId of the SDW
 * @returns {Promise<Array|null>} Array of sponsored members assigned to the SDW
 */
export const fetchCasesBySDW = async (sdwId) => {
    try {
        const response = await fetch(`${apiUrl}/dashboard/supervisors/${sdwId}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Not authenticated');
            }
            throw new Error('API error');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching cases by SDW:', error);
        return null;
    }
};

/**
 * Fetches all cases (sponsored members) assigned to a specific SDW, accessible by Head user.
 * @param {string} supervisorId - The ObjectId of the supervisor
 * @param {string} sdwId - The ObjectId of the SDW
 * @returns {Promise<Array|null>} Array of sponsored members assigned to the SDW
 */
export const fetchCasesBySDWForHead = async (supervisorId, sdwId) => {
    try {
        const response = await fetch(`${apiUrl}/dashboard/head/${supervisorId}/${sdwId}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Not authenticated');
            }
            throw new Error('API error');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching cases by SDW for head:', error);
        return null;
    }
};

/**
 * Checks if user is currently logged in by attempting to get session data.
 * @returns {Promise<{isAuthenticated: boolean, user: Object|null}>} Authentication status and user data
 */
export const checkAuthentication = async () => {
    try {
        // You would need to create this endpoint in your backend
        const response = await fetch(`${apiUrl}/auth/check-session`, {
            credentials: 'include'
        });
        if (!response.ok) {
            return { isAuthenticated: false, user: null };
        }
        const userData = await response.json();
        return { isAuthenticated: true, user: userData };
    } catch (error) {
        console.error('Error checking authentication:', error);
        return { isAuthenticated: false, user: null };
    }
};

/**
 * Sets a test session for development purposes.
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
export const setTestSession = async () => {
    try {
        const response = await fetch('/setTestSession', {
            method: 'GET',
            credentials: 'include'
        });
        return response.ok;
    } catch (error) {
        console.error('Error setting test session:', error);
        return false;
    }
};