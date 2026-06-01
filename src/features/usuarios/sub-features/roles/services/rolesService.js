import API from "../../../../../config/apiClient";
const BASE_URL = "/api/cuentas";

//obtener roles
export const obtenerRoles = async () => {
  const { data } = await API.get(`${BASE_URL}/roles/`);
  return Array.isArray(data) ? data : data?.data || [];
};

//obtener permisos
export const obtenerPermisos = async () => {
  const { data } = await API.get(`${BASE_URL}/permisos/`);
  return Array.isArray(data) ? data : data?.data || [];
};

//actualizar rol
export const actualizarRol = async ({ id, payload }) => {
  const { data } = await API.put(`${BASE_URL}/roles/${id}/`, payload);
  return data;
};

//crear rol
export const crearRol = async (payload) => {
  const { data } = await API.post(`${BASE_URL}/roles/`, payload);
  return data;
};

//eliminar rol
export const eliminarRol = async (id) => {
  const { data } = await API.delete(`${BASE_URL}/roles/${id}/`);
  return data;
};