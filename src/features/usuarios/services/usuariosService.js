import API from "../../../config/apiClient";

const BASE_URL = "/api/cuentas";

// obtener usuarios
export const obtenerUsuarios = async () => {
  const { data } = await API.get(`${BASE_URL}/usuarios/`);
  return Array.isArray(data) ? data : data?.data || [];
};

// actualizar estatus
export const actualizarEstatusUsuario = async (userId, estatus) => {
  await API.patch(`${BASE_URL}/usuarios/${userId}/`, { estatus });
  return true;
};

// activar / desactivar
export const desactivarUsuario = (userId) =>
  actualizarEstatusUsuario(userId, 0);

export const activarUsuario = (userId) =>
  actualizarEstatusUsuario(userId, 1);

// actualizar parcial
export const actualizarUsuario = async (userId, payload) => {
  const { data } = await API.patch(
    `${BASE_URL}/usuarios/${userId}/`,
    payload
  );
  return data;
};

// crear usuario
export const crearUsuario = async (payload) => {
  const { data } = await API.post(`${BASE_URL}/usuarios/`, payload);
  return data;
};