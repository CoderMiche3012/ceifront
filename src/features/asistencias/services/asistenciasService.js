import API from "../../../config/apiClient";
const BASE_URL = "/api/beneficiarios/servicios";
const BASE_URL_MASIVO = "/api/beneficiarios/servicios/registro_masivo";
const BASE_URL_MASIVO_EDITAR = "/api/beneficiarios/servicios/edicion_masiva";
import { formatError } from "../../../utils/errorHandlers";
export const crearAsistencia = async (payload) => {
  try {
    const res = await API.post(`${BASE_URL}/`, payload);
    return res.data;
  } catch (error) {
    const errorData = error.response?.data || error;
    if (errorData) {
      throw new Error(formatError(errorData));
    }

    throw new Error(formatError(error.message));
  }
};
export const crearAsistencias = async (payload) => {
  try {
    const res = await API.post(`${BASE_URL_MASIVO}/`, payload);
    return res.data;
  } catch (error) {
    const errorData = error.response?.data || error;
    if (errorData) {
      throw new Error(formatError(errorData));
    }

    throw new Error(formatError(error.message));
  }
};
export const obtenerAsistencias = async () => {
  try {
    const res = await API.get(`${BASE_URL}/`);
    return res.data;
  } catch (error) {
    const errorData = error.response?.data || error;

    if (errorData) {
      throw new Error(formatError(errorData));
    }

    throw new Error(formatError(error.message));
  }
};
export const obtenerAsistenciaIndividual = async (id) => {
  try {
    const res = await API.get(`${BASE_URL}/${id}/`);
    return res.data;
  } catch (error) {
    const errorData = error.response?.data || error;

    if (errorData) {
      throw new Error(formatError(errorData));
    }

    throw new Error(formatError(error.message));
  }
};
export const eliminarAsistencia = async (id) => {
  try {
    const res = await API.delete(`${BASE_URL}/${id}/`);
    return res.data;
  } catch (error) {
    const errorData = error.response?.data || error;

    if (errorData) {
      throw new Error(formatError(errorData));
    }

    throw new Error(formatError(error.message));
  }
};
export const actualizarAsistencia = async (id, payload) => {
  try {
    const res = await API.patch(`${BASE_URL}/${id}/`, payload);
    return res.data;
  } catch (error) {
    const errorData = error.response?.data || error;

    if (errorData) {
      throw new Error(formatErrorAnidado(errorData));
    }

    throw new Error(formatErrorAnidado(error.message));
  }
};
export const actualizarAsistenciasMasivo = async (payload) => {
  try {
    const res = await API.put(`${BASE_URL_MASIVO_EDITAR}/`, payload);
    return res.data;
  } catch (error) {
    const errorData = error.response?.data || error;

    if (errorData) {
      throw new Error(formatErrorAnidado(errorData));
    }

    throw new Error(formatErrorAnidado(error.message));
  }
};

export const obtenerAsistenciasPorFiltro = async (mes, servicio) => {
  try {
    const res = await API.get(
      `/api/beneficiarios/asistencias?mes=${mes}&servicio=${servicio}`
    );
    return res.data;
  } catch (error) {
    console.log(error);

    const errorData = error.response?.data || error;

    if (errorData) {
      throw new Error(formatError(errorData));
    }

    throw new Error(formatError(error.message));
  }
};