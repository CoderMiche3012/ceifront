import API from "../../../config/apiClient";
const BASE_URL = "/api/escolaridad/grados";
import { formatError } from "../../../utils/errorHandlers";


export const obtenerGrados = async () => {
  try {
    const res = await API.get(`${BASE_URL}`);
    return res.data;
  } catch (error) {
    const errorData = error.response?.data || error;
    if (errorData) {
      throw new Error(formatError(errorData));
    }
    throw new Error(formatError(error.message));
  }
};

export const obtenerGrado = async (id) => {
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

export const crearGrado = async (payload) => {
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

export const actualizarGrado = async (id, payload) => {
  try {
    const res = await API.put(`${BASE_URL}/${id}/`, payload);
    return res.data;
  } catch (error) {
    const errorData = error.response?.data || error;
    if (errorData) {
      throw new Error(formatError(errorData));
    }
    throw new Error(formatError(error.message));
  }
};

