import API from "../../../config/apiClient";
const BASE_URL = "/api/estudios/familia";
import { formatError } from "../../../utils/errorHandlers";

export const obtenerFamilia = async () => {
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

export const crearFamilia = async (payload) => {
  try {
    const res = await API.post(`${BASE_URL}/`, payload);
    return res.data;
  } catch (error) {
    console.log("ERROR ORIGINAL:", error);
    const errorData = error.response?.data || error;
    throw {
      original: error, 
      response: error.response, 
      message: formatError(errorData) 
    };
  }
};

export const actualizarFamilia = async (id, payload) => {
  try {
    const res = await API.patch(`${BASE_URL}/${id}/`, payload);
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

export const eliminarFamilia = async (id) => {
  try {
    const res = await API.delete(`${BASE_URL}/${id}/`);
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

