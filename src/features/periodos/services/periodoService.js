import API from "../../../config/apiClient";
const BASE_URL = "/api/periodos";

// obtener todos los periodos
export const obtenerPeriodos = async () => {
  const { data } = await API.get(`${BASE_URL}/`);
  return Array.isArray(data) ? data : data?.data ?? [];
};

// obtener por ID
export const obtenerPeriodoPorId = async (id) => {
  const { data } = await API.get(`${BASE_URL}/${id}/`);
  return data;
};

// crear periodo
export const crearPeriodo = async (payload) => {
  const { data } = await API.post(`${BASE_URL}/`, payload);
  return data;
};

// actualizar periodo
export const actualizarPeriodo = async (id, payload) => {
  const { data } = await API.put(`${BASE_URL}/${id}/`, payload);
  return data;
};

// eliminar periodo
export const eliminarPeriodo = async (id) => {
  const { data } = await API.delete(`${BASE_URL}/${id}/`);
  return data;
};