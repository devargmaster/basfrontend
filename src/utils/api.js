// Utilidad para hacer peticiones autenticadas a la API
const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * Obtiene los headers de autenticación
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

/**
 * Realiza una petición GET autenticada
 */
export const apiGet = async (endpoint) => {
  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

/**
 * Realiza una petición POST autenticada
 */
export const apiPost = async (endpoint, data) => {
  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch (e) {
      // Si no se puede parsear la respuesta, usar el mensaje por defecto
    }
    throw new Error(errorMessage);
  }
  
  return response.json();
};

/**
 * Realiza una petición PUT autenticada
 */
export const apiPut = async (endpoint, data) => {
  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch (e) {
      // Si no se puede parsear la respuesta, usar el mensaje por defecto
    }
    throw new Error(errorMessage);
  }
  
  return response.json();
};

/**
 * Realiza una petición DELETE autenticada
 */
export const apiDelete = async (endpoint) => {
  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.ok;
};

/**
 * Petición fetch personalizada con autenticación
 */
export const apiFetch = async (endpoint, options = {}) => {
  const config = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers
    }
  };
  
  const response = await fetch(`${baseUrl}${endpoint}`, config);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response;
};

/**
 * Funciones específicas para logs de usuario
 */

/**
 * Obtiene logs de usuario con filtros opcionales
 */
export const getUserLogs = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.userId) params.append('userId', filters.userId);
  if (filters.fromDate) params.append('fromDate', filters.fromDate);
  if (filters.toDate) params.append('toDate', filters.toDate);
  if (filters.limit) params.append('limit', filters.limit);
  
  const queryString = params.toString();
  const endpoint = `/api/userlogs${queryString ? '?' + queryString : ''}`;
  
  return apiGet(endpoint);
};

/**
 * Obtiene logs por acción específica
 */
export const getUserLogsByAction = async (action, limit = 100) => {
  return apiGet(`/api/userlogs/by-action/${encodeURIComponent(action)}?limit=${limit}`);
};

/**
 * Obtiene logs de un usuario específico
 */
export const getUserLogsByUserId = async (userId, limit = 100) => {
  return apiGet(`/api/userlogs/user/${userId}?limit=${limit}`);
};

/**
 * Registra un log manual
 */
export const logManualAction = async (logData) => {
  return apiPost('/api/userlogs/manual', logData);
};
