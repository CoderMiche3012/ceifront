import API from "../../../config/apiClient";
const BASE_URL = "/api/estudios/familia";

// obtener familias
export const obtenerFamilia = async () => {
  const { data } = await API.get(`${BASE_URL}/`);
  return Array.isArray(data) ? data : data?.data ?? [];
};

// obtener familia por id
export const obtenerFamiliaId = async (id) => {
  const { data } = await API.get( `${BASE_URL}/${id}/` );
  return data;
};

// crear familia
export const crearFamilia = async (payload) => {
  const { data } = await API.post( `${BASE_URL}/`,payload );
  return data;
};

// actualizar familia
export const actualizarFamilia = async ( id, payload ) => {
  const { data } = await API.patch( `${BASE_URL}/${id}/`, payload );
  return data;
};

// eliminar familia
export const eliminarFamilia = async (id) => {
  const { data } = await API.delete( `${BASE_URL}/${id}/` );
  return data;
};