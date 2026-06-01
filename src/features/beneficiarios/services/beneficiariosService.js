import API from "../../../config/apiClient";
import { formatError } from "../../../utils/errorHandlers";

const BASE_URL = "/api/beneficiarios/beneficiarios";

// obtener todos
export const obtenerBeneficiarios = async () => {
  const { data } = await API.get(`${BASE_URL}/`);
  return data;
};

// obtener uno
export const obtenerBeneficiarioId = async (id) => {
  const { data } = await API.get(`${BASE_URL}/${id}/`);
  return data;
};

// crear
export const crearBeneficiario = async (payload) => {
  const { data } = await API.post(`${BASE_URL}/`, payload);
  return data;
};

// actualizar
export const actualizarBeneficiario = async (id, payload) => {
  const { data } = await API.patch(`${BASE_URL}/${id}/`, payload);
  return data;
};

// eliminar
export const eliminarBeneficiario = async (id) => {
  const { data } = await API.delete(`${BASE_URL}/${id}/`);
  return data;
};