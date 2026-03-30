const BASE_URL = "http://localhost:8000/api/periodos/periodos";

export const getAuthHeaders = () => {
  const token = localStorage.getItem("access");
  if (!token) return null;
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const handleResponse = async (response, defaultError) => {
  const text = await response.text();
  let errorMessage = defaultError;

  if (text) {
    try {
      const data = JSON.parse(text);
      errorMessage = data?.detail || data?.message || data?.error || JSON.stringify(data);
    } catch {
      errorMessage = text;
    }
  }

  if (response.status === 401) throw new Error("Sesión expirada");
  if (!response.ok) throw new Error(errorMessage);

  return text ? JSON.parse(text) : true;
};

export const obtenerPeriodos = async () => {
  const headers = getAuthHeaders();
  if (!headers) throw new Error("Sin autenticación");
  const res = await fetch(`${BASE_URL}/`, { headers });
  return handleResponse(res, "Error al obtener periodos");
};

export const crearPeriodo = async (payload) => {
  const headers = getAuthHeaders();
  const res = await fetch(`${BASE_URL}/`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  return handleResponse(res, "Error al crear periodo");
};

// Función genérica para actualizar, usada para editar o desactivar
export const actualizarPeriodo = async (id, payload) => {
  const headers = getAuthHeaders();
  const res = await fetch(`${BASE_URL}/${id}/`, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  });
  return handleResponse(res, "Error al actualizar periodo");
};