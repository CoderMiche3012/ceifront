import API from "../../../config/apiClient";
const BASE_URL = "/api/beneficiarios/postulantes";

// obtener lista de postulantes
export const obtenerPostulantes = async () => {
  const { data } = await API.get(`${BASE_URL}/`);
  return Array.isArray(data) ? data : data?.data ?? [];
};

// obtener datos del postulante por id
export const obtenerPostulantePorId = async (id) => {
  const { data } = await API.get(`${BASE_URL}/${id}/`);
  return data;
};

// crear postulante
export const crearPostulante = async (payload) => {
  const { data } = await API.post(`${BASE_URL}/`, payload);
  return data;
};

// actualizar postulante
export const actualizarPostulante = async (id, payload) => {
  const { data } = await API.patch(`${BASE_URL}/${id}/`, payload);
  return data;
};

// eliminar postulante
export const eliminarPostulante = async (id) => {
  const { data } = await API.delete(`${BASE_URL}/${id}/`);
  return data;
};