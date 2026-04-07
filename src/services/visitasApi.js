import API from "./api";
const BASE_URL = "/api/beneficiarios/visitas";
import { formatError } from "../utils/errorHandlers";

//obtener periodos
export const obtenerVisita = async () => {
  try {
    const res = await API.get(`${BASE_URL}/`);
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
//crear periodos
export const crearVisita = async (payload) => {
  try {
    const res = await API.post(`${BASE_URL}/`, payload);
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
//editar periodos
export const actualizarVisita = async (payload) => {
  try {
    const res = await API.put(`${BASE_URL}/`, payload);
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