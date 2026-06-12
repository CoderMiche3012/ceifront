import API from "../../../config/apiClient";

const BASE_URL = "/api/escolaridad/datos-escolares";

// obtener todos
export const obtenerDatosEscolares = async () => {
  const { data } = await API.get(`${BASE_URL}/`);
  return data;
};

// obtener por ID
export const obtenerDatosEscolaresInd = async (id) => {
  const { data } = await API.get(`${BASE_URL}/${id}/`);
  return data;
};

// crear
export const crearDatosEscolaresInd = async (payload) => {
  const { data } = await API.post(`${BASE_URL}/`, payload);
  return data;
};

// actualizar
export const actualizarDatosEscolaresInd = async (id, payload) => {
  const { data } = await API.patch(`${BASE_URL}/${id}/`, payload);
  return data;
};