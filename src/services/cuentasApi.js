import API from "./api"; 

const BASE_URL = "/api/cuentas";
export async function obtenerRoles() {
  try {
    const response = await API.get(`${BASE_URL}/roles`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || "No se pudieron cargar los puestos");
  }
}
export async function obtenerPermisos() {
  try {
    const response = await API.get(`${BASE_URL}/permisos`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || "No se pudieron cargar los permisos");
  }
}