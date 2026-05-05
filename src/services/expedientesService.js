import API from "./api";
const BASE_URL = "/api/beneficiarios/expedientes";
const BASE_URL2 = "/api/beneficiarios/direcciones";
import { formatErrorAnidado } from "../utils/errorHandlers";

export const obtenerExpediente = async () => {
  try {
    const res = await API.get(`${BASE_URL}/`);
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

export const crearExpediente = async (data) => {
  try {
    const res = await API.post(`${BASE_URL}/`, data);
    return res.data;
  } catch (error) {
    console.log(error);

    const errorData = error.response?.data || error;

    if (errorData) {
      throw new Error(formatErrorAnidado(errorData));
    }

    throw new Error(formatErrorAnidado(error.message));
  }
};

export const actualizarExpediente = async (id, payload) => {
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

export const actualizarDireccion = async (id, payload) => {
  try {
    const res = await API.patch(`${BASE_URL2}/${id}/`, payload);
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

export const obtenerExpedienteIndividual = async (id) => {
  try {
    const res = await API.get(`${BASE_URL}/${id}/`);
    return res.data;
  } catch (error) {
    console.log(error);

    const errorData = error.response?.data || error;

    if (errorData) {
      throw new Error(formatErrorAnidado(errorData));
    }

    throw new Error(formatErrorAnidado(error.message));
  }
};
export const eliminarExpediente = async (id) => {
  try {
    const res = await API.delete(`${BASE_URL}/${id}/`);
    return res.data;
  } catch (error) {
    console.log(error);

    const errorData = error.response?.data || error;

    if (errorData) {
      throw new Error(formatErrorAnidado(errorData));
    }

    throw new Error(formatErrorAnidado(error.message));
  }
};