import API from "./api";
const BASE_URL = "/api/cuentas";
import { formatError } from "../utils/errorHandlers";

//guardar usuario 
export const guardarUsuarioLocal = (nuevoUsuario) => {
  const actual = JSON.parse(localStorage.getItem("user") || "{}");

  const usuarioFinal = {
    ...actual,
    ...nuevoUsuario,
    permisos: nuevoUsuario?.permisos ?? actual?.permisos ?? [],
    id_usuario:
      nuevoUsuario?.id_usuario ??
      actual?.id_usuario ??
      nuevoUsuario?.id ??
      actual?.id,
    id:
      nuevoUsuario?.id ??
      actual?.id ??
      nuevoUsuario?.id_usuario ??
      actual?.id_usuario,
    rol: nuevoUsuario?.rol ?? actual?.rol ?? "",
    is_admin:
      nuevoUsuario?.is_admin ?? actual?.is_admin ?? false,
    es_staff:
      nuevoUsuario?.es_staff ?? actual?.es_staff ?? false,
  };
  localStorage.setItem("user", JSON.stringify(usuarioFinal));
  return usuarioFinal;
};
export const obtenerPerfil = async (userId, tokenDirecto = null) => {
  try {
    const config = {};
    if (tokenDirecto) {
      config.headers = { Authorization: `Bearer ${tokenDirecto}` };
    }
    const res = await API.get(`${BASE_URL}/usuarios/${userId}/`, config);
    const data = res.data;
    const idReal = data.id_usuario || data.id;
    return {
      ...data,
      id_usuario: idReal,
      id: idReal,
    };
  } catch (error) {
    console.error("Error en obtenerPerfil:", error);
    return null;
  }
};
export const obtenerInicioSesion = async ({ username, password }) => {
  try {
    const res = await API.post(`${BASE_URL}/login/`, {
      nom_usuario: username.trim(),
      password: password.trim(),
    });

    const data = res.data;
    const userFinal = {
      id_usuario: data.id_usuario,
      id: data.id_usuario,
      nom_usuario: data.nom_usuario,
      rol: data.rol || "",
      permisos: data.permisos || [],
      is_admin: data.is_admin ?? false,
      es_staff: data.es_staff ?? false,
    };

    return {
      access: data.access,
      refresh: data.refresh,
      user: userFinal,
    };

  } catch (error) {
    throw new Error(error.message || "Error de conexión");
  }
};

// obtener usuarios
export const obtenerUsuarios = async () => {
  try {
    const res = await API.get(`${BASE_URL}/usuarios/`);
    const data = res.data;

    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    throw new Error(error.message || "No se pudieron obtener los usuarios");
  }
};

//función base para activar/desactivar
const actualizarEstatusUsuario = async (user, estatus) => {
  try {
    await API.patch(`${BASE_URL}/usuarios/${user.id_usuario}/`, {
      estatus,
    });
    return true;
  } catch (error) {
    throw new Error(
      error.message ||
      `No se pudo cambiar el usuario a ${estatus === 1 ? "activo" : "inactivo"
      }`
    );
  }
};

//desactivar
export const desactivarUsuario = (user) => {
  return actualizarEstatusUsuario(user, 0);
};

//activar
export const activarUsuario = (user) => {
  return actualizarEstatusUsuario(user, 1);
};
//actualizar usuario ( perfil)
export const actualizarUsuario = async (userId, payload) => {
  try {
    const res = await API.patch(
      `${BASE_URL}/usuarios/${userId}/`,
      payload
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};
export const actualizarUsuarioCompleto = async (userId, payload) => {
  try {
    const res = await API.patch(`${BASE_URL}/usuarios/${userId}/`, payload);
    return res.data;
  } catch (error) {
    console.log(error)
    const errorData = error.response?.data || error;

    if (errorData) {
      throw new Error(formatError(errorData));
    }
    throw new Error(formatError(error.message));
  }
};

export const crearUsuario = async (payload) => {
  try {
    const res = await API.post(`${BASE_URL}/usuarios/`, payload);
    return res.data;
  } catch (error) {
    console.log(error)
    // Extraemos la data del error de Axios
    const errorData = error.response?.data || error;

    if (errorData) {
      throw new Error(formatError(errorData));
    }

    throw new Error(formatError(error.message));
  }
};