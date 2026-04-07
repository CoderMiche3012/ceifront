import API from "./api";
const BASE_URL = "/api/cuentas";

//lista de roles
export const getRoles = async () => {
  const res = await API.get(`${BASE_URL}/roles/`);
  return res.data;
};

//lista de permisos
export const getPermissions = async () => {
  const res = await API.get(`${BASE_URL}/permisos/`);
  return res.data;
};

//actualizar rol
export const updateRole = async (id, payload) => {
  const res = await API.put(`${BASE_URL}/roles/${id}/`, payload);
  return res.data;
};

//crear rol
export const createRole = async (payload) => {
  const res = await API.post(`${BASE_URL}/roles/`, payload);
  return res.data;
};

//eliminar rol
export const deleteRole = async (id) => {
  const res = await API.delete(`${BASE_URL}/roles/${id}/`);
  return res.data;
};