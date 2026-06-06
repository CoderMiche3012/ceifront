import API from "../../../config/apiClient";
const BASE_URL = "/api/donadores/donadores";
const BASE_URL2 = "/api/beneficiarios/catalogos";

// obtener todos
export const obtenerDonadores = async () => {
  const { data } = await API.get(`${BASE_URL}/`);
  return Array.isArray(data) ? data : data?.data ?? [];
};

// obtener por id
export const obtenerDonadorPorId = async (id) => {
  const { data } = await API.get(`${BASE_URL}/${id}/`);
  return data;
};

// crear donador
export const crearDonador = async (payload) => {
  const { data } = await API.post(`${BASE_URL}/`, payload);
  return data;
};

// actualizar donador
export const actualizarDonador = async (id, payload) => {
  const { data } = await API.patch(`${BASE_URL}/${id}/`, payload);
  return data;
};

// buscar CP
export const obtenerDireccionPorCP = async (cp, pais = "MX") => {
  const { data } = await API.get("/api/beneficiarios/geografia", {
    params: {
      cp,
      pais,
    },
  });

  return data;
};

// Obtener países
export const obtenerPaises = async () => {
  const { data } = await API.get(`${BASE_URL2}/paises/`);
  return Array.isArray(data) ? data : [];
};