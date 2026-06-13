import API from "../../../config/apiClient";
import { formatError } from "../../../utils/errorHandlers";

const BASE_URL = "/api/beneficiarios/beneficiarios";
const BASE_URL2 = "/api/beneficiarios/beneficiarios";

// obtener todos
export const obtenerBeneficiarios = async () => {
  const { data } = await API.get(`${BASE_URL}/`);
  return data;
};

// obtener uno
export const obtenerBeneficiarioId = async (id) => {
  const { data } = await API.get(`${BASE_URL}/${id}/`);
  return data;
};

// crear
export const crearBeneficiario = async (payload) => {
  const { data } = await API.post(`${BASE_URL}/`, payload);
  return data;
};

// actualizar
export const actualizarBeneficiario = async (id, payload) => {
  const { data } = await API.patch(`${BASE_URL}/${id}/`, payload);
  return data;
};

// eliminar
export const eliminarBeneficiario = async (id) => {
  const { data } = await API.delete(`${BASE_URL}/${id}/`);
  return data;
};

export const obtenerBeneficiariosActivos = async () => {
  const { data } = await API.get("/api/beneficiarios/beneficiarios/activos/");
  return Array.isArray(data) ? data : data?.data ?? [];
};

export const obtenerAntecedentesIngreso = async (idBeneficiario) => {
  try {
    const res = await API.get(
      `${BASE_URL2}/${idBeneficiario}/antecedentes-ingreso/`
    );

    return res.data;
  } catch (error) {
    const errorData = error.response?.data;
    throw formatError(errorData, "Error al obtener antecedentes de ingreso");
  }
};

// obtiene a los beneficiarios que tienen un seguimiento en el periodo selccionado solo manda ese seguimiento
export const obtenerBeneficiariosPorPeriodo = async ({periodo,}) => {
  const { data } = await API.get(`${BASE_URL}/`, {
    params: { periodo },
  });
  return data;
};
// manda los datos del ultimo periodo que tiene registrado cada beneficiario
export const obtenerBeneficiariosUltimoPorPeriodo = async () => {
  const { data } = await API.get("/api/beneficiarios/beneficiarios/resumen/");
  return Array.isArray(data) ? data : data?.data ?? [];
};