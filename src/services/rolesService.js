// URL base 
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"
//para hacer peticiones HTTP con manejo de token y errores
async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("token")
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      // Agrega Authorization solo si existe token
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  })
  //manejo de errores de respuesta
  if (!response.ok) {
    let message = "Ocurrió un error en la solicitud"
    try {
      const errorData = await response.json()
      message = errorData?.message || message
    } catch {
    }
    throw new Error(message)
  }
  //si no hay contenido 
  if (response.status === 204) return null
  return response.json()
}
//lista de roles
export async function getRoles() {
  return apiRequest("/api/cuentas/roles/")
}
//lista de permisos
export async function getPermissions() {
  return apiRequest("/api/cuentas/permisos/")
}
//actualiza un rol existente
export async function updateRole(id, payload) {
  return apiRequest(`/api/cuentas/roles/${id}/`, {
    method: "PUT",
    body: JSON.stringify(payload),
  })
}
// crea un nuevo rol
export async function createRole(payload) {
  return apiRequest("/api/cuentas/roles/", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}
//elimina un rol por id
export async function deleteRole(id) {
  return apiRequest(`/api/cuentas/roles/${id}/`, {
    method: "DELETE",
  })
}