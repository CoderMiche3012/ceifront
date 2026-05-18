import API from "../../../config/apiClient";
const BASE_URL = "/api/escolaridad/municipios";
import { formatError } from "../../../utils/errorHandlers";


export const obtenerMunicipios = async () => {
  try {
    const res = await API.get(`${BASE_URL}`);
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

export const obtenerMunicipio = async (id) => {
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
export const crearMunicipio = async (payload) => {
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
export const actualizarMunicipio = async (id, payload) => {
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

