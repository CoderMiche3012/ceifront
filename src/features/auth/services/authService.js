import API from "../../../config/apiClient";
const BASE_URL = "/api/cuentas";

// iniciar sesión
export const iniciarSesion = async ({ username, password }) => {
  const { data } = await API.post(`${BASE_URL}/login/`, {
    nom_usuario: username.trim(),
    password: password.trim(),
  });
  return data;
};
// obtener perfil de usuario
export const obtenerPerfil = async () => {
  const { data } = await API.get( `${BASE_URL}/perfil/`);
  return data;
};
//actualizar perfil
export const actualizarPerfil = async (payload) => {
  const { data } = await API.patch( `${BASE_URL}/perfil/`, payload );
  return data;
};