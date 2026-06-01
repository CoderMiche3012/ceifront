import API from "../../../config/apiClient";
import sepomex from "../../../data/sepomex_oaxaca.json";

const BASE_URL = "/api/beneficiarios/expedientes";
const DIRECCION_URL = "/api/beneficiarios/direcciones";

// obtener expedientes
export const obtenerExpedientes = async () => {
  const { data } = await API.get(`${BASE_URL}/`);
  return Array.isArray(data) ? data : data?.data ?? [];
};

// obtener expediente por id
export const obtenerExpedientePorId = async (id) => {
  const { data } = await API.get(`${BASE_URL}/${id}/`);
  return data;
};

// crear expediente
export const crearExpediente = async (payload) => {
  const { data } = await API.post( `${BASE_URL}/`, payload);
  return data;
};

// actualizar expediente
export const actualizarExpediente = async ( id, payload ) => {
  const { data } = await API.patch( `${BASE_URL}/${id}/`, payload );
  return data;
};

// eliminar expediente
export const eliminarExpediente = async (id) => {
  const { data } = await API.delete( `${BASE_URL}/${id}/` );
  return data;
};

// obtener direcciones
export const obtenerDirecciones = async () => {
  const { data } = await API.get( `${DIRECCION_URL}/`);
  return Array.isArray(data) ? data : data?.data ?? [];
};

// actualizar dirección
export const actualizarDireccion = async ( id, payload ) => {
  const { data } = await API.patch( `${DIRECCION_URL}/${id}/`, payload );
  return data;
};

// eliminar dirección
export const eliminarDireccion = async ( id ) => {
  const { data } = await API.delete( `${DIRECCION_URL}/${id}/` );
  return data;
};

// buscar dirección por CP en BD
export const buscarDireccionPorCP = async (cp) => {
  const direcciones = await obtenerDirecciones();

  const coincidencias = direcciones.filter( (d) => String(d.cp).trim() === String(cp).trim() );
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
};

// buscar CP en SEPOMEX
export const buscarCPCompleto = async (cp) => {
  const coincidencias = sepomex.filter(
    (d) => String(d.d_codigo).trim() === String(cp).trim()
  );

  if (coincidencias.length === 0) {
    return {
      municipio: "",
      estado: "",
      colonias: [],
    };
  }

  return {
    municipio: coincidencias[0].D_mnpio,

    estado: coincidencias[0].d_estado,

    colonias: [
      ...new Set(
        coincidencias.map(
          (d) => d.d_asenta
        )
      ),
    ],
  };
};