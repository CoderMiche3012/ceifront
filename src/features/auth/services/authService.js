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
export const obtenerPerfil = async (userId) => {
  const { data } = await API.get(`${BASE_URL}/usuarios/${userId}/`);
  return data;
};