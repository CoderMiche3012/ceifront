import API from "../../../config/apiClient";

const BASE_URL = "/api/estudios/estudios";

// obtener lista de estudios
export const obtenerEstudios = async () => {
  const { data } = await API.get(`${BASE_URL}/`);
  return Array.isArray(data) ? data : data?.data ?? [];
};

// obtener estudio por id
export const obtenerEstudioPorId = async (id) => {
  const { data } = await API.get(`${BASE_URL}/${id}/`);
  return data;
};

// crear estudio
export const crearEstudio = async (payload) => {
  const { data } = await API.post(`${BASE_URL}/`, payload);
  return data;
};

// actualizar estudio
export const actualizarEstudio = async (id, payload) => {
  const { data } = await API.patch(`${BASE_URL}/${id}/`, payload);
  return data;
};

// eliminar estudio
export const eliminarEstudio = async (id) => {
  const { data } = await API.delete(`${BASE_URL}/${id}/`);
  return data;
};

