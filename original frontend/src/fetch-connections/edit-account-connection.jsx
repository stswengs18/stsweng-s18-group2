const apiUrl = import.meta.env.VITE_API_URL || '/api';

export const editAccount = async (userId, userData) => {
    try {
        const response = await fetch(`${apiUrl}/profile/edit/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
            credentials: 'include' 
        });

        const data = await response.json();
        
        if (!response.ok) {
            return {
                success: false,
                status: response.status,
                message: data.message || 'Error updating account'
            };
        }

        return {
            success: true,
            data: data
        };
    } catch (error) {
        console.error("Error updating account:", error);
        return {
            success: false,
            message: "Network error or server unavailable"
        };
    }
};