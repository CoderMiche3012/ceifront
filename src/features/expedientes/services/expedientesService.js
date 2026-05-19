import API from "../../../config/apiClient";
const BASE_URL = "/api/beneficiarios/expedientes";
const BASE_URL2 = "/api/beneficiarios/direcciones";
import { formatErrorAnidado } from "../../../utils/errorHandlers";
import sepomex from "../../../data/sepomex_oaxaca.json";


export const obtenerExpediente = async () => {
  try {
    const res = await API.get(`${BASE_URL}/`);
    return res.data;
  } catch (error) {
    console.log(error);

    const mensaje = formatErrorAnidado(
      error.response?.data || error.message
    );

    throw {
      ...error,
      message: mensaje,
    };
  }
};

export const crearExpediente = async (data) => {
  try {
    const res = await API.post(`${BASE_URL}/`, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const actualizarExpediente = async (id, payload) => {
  try {
    const res = await API.patch(`${BASE_URL}/${id}/`, payload);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const actualizarDireccion = async (id, payload) => {
  try {
    const res = await API.patch(`${BASE_URL2}/${id}/`, payload);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const obtenerExpedienteIndividual = async (id) => {
  try {
    const res = await API.get(`${BASE_URL}/${id}/`);
    return res.data;
  } catch (error) {
    console.log(error);

    const mensaje = formatErrorAnidado(
      error.response?.data || error.message
    );

    throw {
      ...error,
      message: mensaje,
    };
  }
};
export const eliminarExpediente = async (id) => {
  try {
    const res = await API.delete(`${BASE_URL}/${id}/`);
    return res.data;
  } catch (error) {
    console.log(error);

    const mensaje = formatErrorAnidado(
      error.response?.data || error.message
    );

    throw {
      ...error,
      message: mensaje,
    };
  }
};

export const obtenerDireccion = async () => {
  try {
    const res = await API.get(`${BASE_URL2}/`);
    return res.data;
  } catch (error) {
    console.log(error);

    const mensaje = formatErrorAnidado(
      error.response?.data || error.message
    );

    throw {
      ...error,
      message: mensaje,
    };
  }
};

export const buscarDireccionPorCP = async (cp) => {
  try {
    const direcciones = await obtenerDireccion();

    const coincidencias = direcciones.filter(
      (d) => d.cp === cp
    );

    if (coincidencias.length > 0) {
      return {
        municipio: coincidencias[0].municipio,
        colonias: [
          ...new Set(
            coincidencias.map((d) => d.colonia)
          ),
        ],
        source: "db",
      };
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const buscarCPCompleto = async (cp) => {

  try {

    const coincidencias = sepomex.filter(
      (d) =>
        String(d.d_codigo).trim() ===
        String(cp).trim()
    );

    if (coincidencias.length === 0) {

      return {
        municipio: "",
        estado: "",
        colonias: [],
      };
    }

    return {

      municipio:
        coincidencias[0].D_mnpio,

      estado:
        coincidencias[0].d_estado,

      colonias: [

        ...new Set(
          coincidencias.map(
            (d) => d.d_asenta
          )
        ),

      ],
    };

  } catch (error) {

    console.log(error);

    return {
      municipio: "",
      estado: "",
      colonias: [],
    };
  }
};