import API from "../../../config/apiClient";
const BASE_URL = "/api/periodos";
const BASE_URL_ACTIVO = "/api/periodos/activo";
const BASE_URL_CREAR = "/api/periodos/crear-con-migracion";

//obtener todos los periodos 
export const obtenerPeriodos = async () => {
  const { data } = await API.get(`${BASE_URL}/`);
  return Array.isArray(data) ? data : data?.data ?? [];
};
//obtener solo el periodo activo
export const obtenerPeriodoActivo = async () => {
  try {
    const { data } = await API.get(`${BASE_URL_ACTIVO}/`);
    return data?.data ?? data;
  } catch (error) {
    if ( error?.response?.data?.error === "No hay ningún periodo activo en el sistema." ) {
      return null;
    }
    throw error;
  }
};
// crear periodo
export const crearPeriodo = async (payload) => {
  const { data } = await API.post(`${BASE_URL_CREAR}/`, payload);
  return data;
};
// obtener por ID
export const obtenerPeriodoPorId = async (id) => {
  const { data } = await API.get(`${BASE_URL}/${id}/`);
  return data;
};
// actualizar periodo
export const actualizarPeriodo = async (id, payload) => {
  const { data } = await API.put(`${BASE_URL}/${id}/`, payload);
  return data;
};