const API_URL = "http://localhost:8000/api/cuentas"

export async function obtenerRoles() {
  const response = await fetch(`${API_URL}/roles`)

  if (!response.ok) {
    throw new Error("No se pudieron cargar los roles")
  }

  return response.json()
}

export async function obtenerPermisos() {
  const response = await fetch(`${API_URL}/permisos`)

  if (!response.ok) {
    throw new Error("No se pudieron cargar los permisos")
  }

  return response.json()
}