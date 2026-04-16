import API from "./api";
const BASE_URL = "/api/estudios/estudios";
import { formatError } from "../utils/errorHandlers";

export const crearEstudio = async (payload) => {
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

export const obtenerEstudios = async () => {
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
export const actualizarEstudio = async (id, payload) => {
  try {
    const res = await API.patch(`${BASE_URL}/${id}/`, payload);
    return res.data;
  } catch (error) {
    console.log(error)
    const errorData = error.response?.data || error;

    if (errorData) {
      throw new Error(formatErrorAnidado(errorData));
    }

    throw new Error(formatErrorAnidado(error.message));
  }
};
