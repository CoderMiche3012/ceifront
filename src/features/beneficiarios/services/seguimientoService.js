import API from "../../../config/apiClient";

const BASE_URL = "/api/beneficiarios/seguimientos";

// obtener todos
export const obtenerSeguimientos = async () => {
  const { data } = await API.get(`${BASE_URL}/`);
  return data;
};

// obtener por ID
export const obtenerSeguimiento = async (id) => {
  const { data } = await API.get(`${BASE_URL}/${id}/`);
  return data;
};

// crear
export const crearSeguimiento = async (payload) => {
  const { data } = await API.post(`${BASE_URL}/`, payload);
  return data;
};

// actualizar
export const actualizarSeguimiento = async (id, payload) => {
  const { data } = await API.patch(`${BASE_URL}/${id}/`, payload);
  return data;
};

// eliminar
export const eliminarSeguimiento = async (id) => {
  const { data } = await API.delete(`${BASE_URL}/${id}/`);
  return data;
};

// filtros por beneficiario
export const obtenerSeguimientosPorBeneficiario = async (id_beneficiario) => {
  const { data } = await API.get(`${BASE_URL}/`, {
    params: { id_beneficiario },
  });
  return data;
};

// filtro por beneficiario + periodo
export const obtenerSeguimientoPorPeriodo = async ({
  id_beneficiario,
  id_periodo,
}) => {
  const { data } = await API.get(`${BASE_URL}/`, {
    params: { id_beneficiario, id_periodo },
  });
  return data;
};