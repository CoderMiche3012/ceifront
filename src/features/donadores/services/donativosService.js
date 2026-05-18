import API from "./../../../config/apiClient";
const BASE_URL = "/api/donadores/donativos";
import { formatError } from "../../../utils/errorHandlers";

export const crearDonativo = async (payload) => {
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

export const obtenerDonativo = async () => {
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

export const actualizarDonativo = async (id, payload) => {
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
export const obtenerDonativos = async () => {
  try {
    const [resDonativos, resPeriodos] =
      await Promise.all([
        API.get(`${BASE_URL}/`),
        API.get(`/api/periodos/`),
      ]);

    const donativos =
      Array.isArray(resDonativos.data)
        ? resDonativos.data
        : [];

    const rawPeriodos =
      resPeriodos.data;

    const periodos =
      Array.isArray(rawPeriodos)
        ? rawPeriodos
        : Array.isArray(
            rawPeriodos?.results
          )
        ? rawPeriodos.results
        : Array.isArray(
            rawPeriodos?.data
          )
        ? rawPeriodos.data
        : [];

    return donativos.map(
      (item) => {
        const periodo =
          periodos.find(
            (p) =>
              Number(
                p.id_periodo
              ) ===
              Number(
                item.id_periodo
              )
          );

        return {
          ...item,
          ciclo_escolar:
            periodo?.ciclo_escolar ||
            "Sin ciclo",
        };
      }
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};