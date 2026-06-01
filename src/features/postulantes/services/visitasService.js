import API from "../../../config/apiClient";
const BASE_URL = "/api/beneficiarios/visitas";

// obtener visitas
export const obtenerVisitas = async () => {
  const { data } = await API.get(`${BASE_URL}/`);
  return Array.isArray(data) ? data : data?.data ?? [];
};

// obtener visita por id
export const obtenerVisitaPorId = async (id) => {
  const { data } = await API.get(`${BASE_URL}/${id}/`);
  return data;
};

// crear visita
export const crearVisita = async (payload) => {
  const { data } = await API.post(`${BASE_URL}/`, payload);
  return data;
};

// actualizar visita
export const actualizarVisita = async (id, payload) => {
  const { data } = await API.patch(`${BASE_URL}/${id}/`, payload);
  return data;
};

// eliminar visita
export const eliminarVisita = async (id) => {
  const { data } = await API.delete(`${BASE_URL}/${id}/`);
  return data;
};