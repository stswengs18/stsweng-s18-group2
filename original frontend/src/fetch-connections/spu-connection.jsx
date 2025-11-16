
const apiUrl = import.meta.env.VITE_API_URL || '/api';
// Fetch all SPUs
export const fetchAllSpus = async () => {
    try {
        const response = await fetch(`${apiUrl}/spu/getAllSpu`,{
            method: 'GET',
            credentials: 'include', 
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) throw new Error("Failed to fetch SPUs");
        return await response.json();
    } catch (error) {
        console.error("Error fetching SPUs:", error);
        return [];
    }
};

// Create a new SPU
export const createSpu = async (spu_name) => {
    try {
        const response = await fetch(`${apiUrl}/spu/addSpu`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ spu_name }),
        });
        if (!response.ok) throw new Error("Failed to create SPU");
        return await response.json();
    } catch (error) {
        console.error("Error creating SPU:", error);
        return null;
    }
};

// Delete an SPU by ID
// export const deleteSpu = async (spuId) => {
//     try {
//         const response = await fetch(`/api/spu/deleteSpu/${spuId}`, {
//             method: 'DELETE',
//         });
//         if (!response.ok) throw new Error("Failed to delete SPU");
//         return await response.json();
//     } catch (error) {
//         console.error("Error deleting SPU:", error);
//         return null;
//     }
// };

export const deleteSpu = async (spuId) => {
    try {
        const res = await fetch(`${apiUrl}/spu/deleteSpu/${spuId}`, {
            method: "DELETE",
            credentials:'include',
            headers: {
           'Content-Type': 'application/json'
        }
        });
        const data = await res.json();

        return {
            ok: res.ok,
            ...data,
        };
    } catch (error) {
        console.error("Delete SPU failed:", error);
        return {
            ok: false,
            error: "Network error or server unreachable.",
        };
    }
};
