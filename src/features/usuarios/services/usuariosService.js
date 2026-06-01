import API from "../../../config/apiClient";
const BASE_URL = "/api/cuentas/usuarios";

// obtener usuarios
export const obtenerUsuarios = async () => {
  const { data } = await API.get(`${BASE_URL}/`);
  return Array.isArray(data) ? data : data?.data ?? [];
};

// actualizar estatus
export const actualizarEstatusUsuario = async ({ userId, estatus, }) => {
  await API.patch(`${BASE_URL}/${userId}/`, { estatus, });
  return true;
};

// activar usuario
export const activarUsuario = (userId) =>
  actualizarEstatusUsuario({ userId, estatus: 1, });

// desactivar usuario
export const desactivarUsuario = (userId) =>
  actualizarEstatusUsuario({ userId, estatus: 0, });

// actualizar usuario
export const actualizarUsuario = async (userId, payload) => {
  const { data } = await API.patch(
    `${BASE_URL}/${userId}/`,
    payload
  );
  return data;
};

// crear usuario
export const crearUsuario = async (payload) => {
  const { data } = await API.post( `${BASE_URL}/`, payload );
  return data;
};