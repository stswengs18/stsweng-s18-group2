// export const createAccount = async (req, res) => {
//     try {
//         const response = await fetch('${apiUrl}/create-account', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(req.body),
//         });

//         if (!response.ok) {
//             const errorData = await response.json();
//             return res.status(response.status).json({ message: errorData.message });
//         }

//         return await response.json();
//     } catch (error) {
//         console.error("Error creating account:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// }

// fetch-connections/create-account-connection.js
const apiUrl = import.meta.env.VITE_API_URL || '/api';
export const fetchEmployeeById = async (employeeId) => {
  try {
    const response = await fetch(`${apiUrl}/employee/${employeeId}`, {
      credentials: 'include',
    });
    const data = await response.json();
    return { ok: response.ok, data };
  } catch (error) {
    console.error("Error fetching employee by ID:", error);
    return { ok: false, data: { message: "Network error" } };
  }
};

/**
 * Updates an employee by ID.
 * 
 * @param {string} employeeId - The ID of the employee to update.
 * @param {object} updatedData - The fields to update.
 * @returns {Promise<{ ok: boolean, data: object }>}
 */
export const updateEmployeeById = async (employeeId, updatedData) => {
  try {
    const response = await fetch(`${apiUrl}/employees/edit/${employeeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updatedData),
    });

    
    const data = await response.json();

    return { ok: response.ok, data };

  } catch (error) {
    console.error('Error updating employee:', error);
    return { ok: false, data: { message: 'Network error' } };
  }
};


export const fetchEmployeeByUsername = async (sdwId) => {
  try {
    const response = await fetch(`${apiUrl}/employees/by-username/${sdwId}`, {
      credentials: 'include',
    });

    const data = await response.json();
    return { ok: response.ok, data };
    
  } catch (error) {
    console.error('Error fetching employee by SDW ID:', error);
    return { ok: false, data: { message: 'Network error' } };
  }
};


export const fetchEmployeeBySDWId = async (sdwId) => {
  try {
    const response = await fetch(`${apiUrl}/employees/by-sdw/${sdwId}`, {
      credentials: 'include',
    });

    const data = await response.json();
    return { ok: response.ok, data };
    
  } catch (error) {
    console.error('Error fetching employee by SDW ID:', error);
    return { ok: false, data: { message: 'Network error' } };
  }
};

export const updateEmployeePasswordById = async (employeeId, updatedPasswordData) => {
  try {
    const response = await fetch(`${apiUrl}/employees/edit-password/${employeeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updatedPasswordData),
    });

    const data = await response.json();

    return { ok: response.ok, data };

  } catch (error) {
    console.error('Error updating employee password:', error);
    return { ok: false, data: { message: 'Network error' } };
  }
};

export const createAccount = async (payload) => {
  try {
    const response = await fetch(`${apiUrl}/create-account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return { ok: response.ok, data };
  } catch (error) {
    console.error("Error creating account:", error);
    return { ok: false, data: { message: "Network error" } };
  }
};

// create-account-connection.js
export const loginUser = async (payload) => {
  const response = await fetch(`${apiUrl}/login`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  return { ok: response.ok, data };
};

export const logoutUser = async () => {
  const res = await fetch(`${apiUrl}/logout`, {
    method: "PUT",
    credentials: "include",
  });
  return res.ok;
};

export const fetchSession = async () => {
  const response = await fetch(`${apiUrl}/session`, {
    credentials: 'include'
  });
  return response.json();
};

export const fetchAllSDWs = async () => {
  try {
    const response = await fetch(`${apiUrl}/cases/getsdw`,{
            method: 'GET',
            credentials: 'include',
        });
    if (!response.ok) throw new Error('Failed to fetch employees');
    return await response.json();
  } catch (err) {
    console.error('Error fetching employees:', err);
    return [];
  }
};


export const fetchHeadView = async () => {
  const response = await fetch(`${apiUrl}/head`, {
    credentials: 'include'
  });
  return response.json();
};

export const fetchHeadViewBySpu = async (spu) => {
  // GET can’t have body, so use query param:
  const response = await fetch(`${apiUrl}/head/spu?spu=${encodeURIComponent(spu)}`, {
    credentials: 'include'
  });
  return response.json();
};

export const fetchSupervisorView = async () => {
  const response = await fetch(`${apiUrl}/supervisor`, {
    credentials: 'include'
  });
  return response.json();
};

export const fetchSDWView = async () => {
  const response = await fetch(`${apiUrl}/socialdevelopmentworker`, {
    credentials: 'include'
  });
  return response.json();
};

export const fetchHeadViewBySupervisor = async (supervisorId) => {
  const response = await fetch(`${apiUrl}/head/${supervisorId}`, {
    credentials: 'include'
  });
  return response.json();
};

export const fetchSDWViewByParam = async (supervisorId, sdwId) => {
  const response = await fetch(`${apiUrl}/head/${supervisorId}/${sdwId}`, {
    credentials: 'include'
  });
  return response.json();
};

export const fetchSDWViewById = async (sdwId) => {
  const response = await fetch(`${apiUrl}/supervisors/${sdwId}`, {
    credentials: 'include'
  });
  return response.json();
};

export const terminateWorker = async (account) => {
  try {
    const response = await fetch(`${apiUrl}/delete-account/${account}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials:'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, message: "Connection error" };
  }
};