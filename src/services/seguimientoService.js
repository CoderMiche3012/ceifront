import API from "./api";
const BASE_URL = "/api/beneficiarios/seguimientos";
import { formatError } from "../utils/errorHandlers";

//obtener periodos
export const obtenerSeguimientos = async () => {
  try {
    const res = await API.get(`${BASE_URL}/`);
    return res.data;
  } catch (error) {
    console.log(error)
    const errorData = error.response?.data || error;
    if (errorData) {
      throw new Error(formatError(errorData));
    }
    throw new Error(formatError(error.message));
  }
};

export const obtenerSeguimiento = async (id) => {
  try {
    const res = await API.get(`${BASE_URL}/${id}/`);
    return res.data;
  } catch (error) {
    console.log(error)
    const errorData = error.response?.data || error;
    if (errorData) {
      throw new Error(formatError(errorData));
    }
    throw new Error(formatError(error.message));
  }
};
//crear periodos
export const crearSeguimiento = async (payload) => {
  try {
    const res = await API.post(`${BASE_URL}/`, payload);
    return res.data;
  } catch (error) {
    console.log(error)
    const errorData = error.response?.data || error;
    if (errorData) {
      throw new Error(formatError(errorData));
    }
    throw new Error(formatError(error.message));
  }
};

//editar o desactivar periodo
export const actualizarSeguimiento = async (id, payload) => {
  try {
    const res = await API.put(`${BASE_URL}/${id}/`, payload);
    return res.data;
  } catch (error) {
    console.log(error)
    // Extraemos la data del error de Axios
    const errorData = error.response?.data || error;

    if (errorData) {
      throw new Error(formatError(errorData));
    }

    throw new Error(formatError(error.message));
  }
};

export const obtenerSeguimientosPorBeneficiario = async (id_beneficiario) => {
  try {
    const res = await API.get(`${BASE_URL}/`, {
      params: { id_beneficiario }
    });
    return res.data;
  } catch (error) {
    const errorData = error.response?.data || error;
    throw new Error(formatError(errorData));
  }
};

export const obtenerSeguimientoPorPeriodo = async ({
  id_beneficiario,
  id_periodo,
}) => {
  try {
    const res = await API.get(`${BASE_URL}/`, {
      params: { id_beneficiario, id_periodo }
    });
    return res.data;
  } catch (error) {
    const errorData = error.response?.data || error;
    throw new Error(formatError(errorData));
  }
};