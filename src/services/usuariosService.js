const BASE_URL = "http://localhost:8000/api/cuentas";
//autenticación usando el token guardado
export const getAuthHeaders = () => {
  const token = localStorage.getItem("access");
  if (!token) return null;
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

//guarda el usuario en localStorage conservando campos importantes existentes
export const guardarUsuarioLocal = (nuevoUsuario) => {
  const actual = JSON.parse(localStorage.getItem("user") || "{}");
  const usuarioFinal = {
    ...actual,
    ...nuevoUsuario,
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
    es_superadmin:
      nuevoUsuario?.es_superadmin ?? actual?.es_superadmin ?? false,
    es_staff:
      nuevoUsuario?.es_staff ?? actual?.es_staff ?? false,
  };
  localStorage.setItem("user", JSON.stringify(usuarioFinal));
  return usuarioFinal;
};
//obtiene el perfil completo del usuario desde la API
export const obtenerPerfil = async (userId, token) => {
  try {
    const response = await fetch(`${BASE_URL}/usuarios/${userId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    if (!response.ok) return null;
    const data = await response.json();
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
//maneja el inicio de sesión y completa la información del usuario
export const obtenerInicioSesion = async ({ username, password }) => {
  try {
    if (!username || !password) {
      throw new Error("Usuario y contraseña son obligatorios");
    }
    const response = await fetch(`${BASE_URL}/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom_usuario: username.trim(),
        password: password.trim(),
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        data?.detail || data?.error || "Usuario o contraseña incorrectos"
      );
    }
    console.log("Respuesta completa login:", data);
    console.log("Usuario desde login:", data.user);
    const userId = data.user?.id || data.user?.id_usuario || data.user?.pk;
    let userFinal = { ...(data.user || {}) };
    //intenta complementar con el perfil completo
    if (userId) {
      const perfilCompleto = await obtenerPerfil(userId, data.access);
      console.log("Perfil completo:", perfilCompleto);
      userFinal = {
        ...(perfilCompleto || {}),
        ...(data.user || {}),
        id_usuario:
          perfilCompleto?.id_usuario ??
          data.user?.id_usuario ??
          data.user?.id ??
          userId,
        id:
          perfilCompleto?.id ??
          data.user?.id ??
          perfilCompleto?.id_usuario ??
          userId,
        rol: data.user?.rol ?? perfilCompleto?.rol ?? "",
        es_superadmin:
          data.user?.es_superadmin ?? perfilCompleto?.es_superadmin ?? false,
        es_staff:
          data.user?.es_staff ?? perfilCompleto?.es_staff ?? false,
      };
    }
    console.log("Usuario final que se guardará:", userFinal);
    return {
      ...data,
      user: userFinal,
    };
  } catch (error) {
    throw new Error(error.message || "Error de conexión");
  }
};

//obtiene la lista de usuarios autenticados
export const obtenerUsuarios = async () => {
  const headers = getAuthHeaders();

  if (!headers) {
    throw new Error("No se encontró el token de autenticación");
  }
  const response = await fetch(`${BASE_URL}/usuarios/`, {
    method: "GET",
    headers,
  });
  if (response.status === 401) {
    throw new Error("Sesión expirada o no autorizada");
  }
  if (!response.ok) {
    throw new Error("No se pudieron obtener los usuarios");
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.data || [];
};
//cambia el estatus del usuario a inactivo
export const desactivarUsuario = async (user) => {
  const headers = getAuthHeaders();
  if (!headers) {
    throw new Error("No se encontró el token de autenticación");
  }
  const response = await fetch(`${BASE_URL}/usuarios/${user.id_usuario}/`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      nom_usuario: user.nom_usuario,
      nombre: user.nombre,
      apellido_p: user.apellido_p,
      apellido_m: user.apellido_m,
      correo: user.correo,
      telefono: user.telefono,
      id_rol: user.id_rol,
      estatus: 0,
    }),
  });
  const responseText = await response.text();
  let errorMessage = "No se pudo cambiar el usuario a inactivo";
  if (responseText) {
    try {
      const responseData = JSON.parse(responseText);
      errorMessage =
        responseData?.detail ||
        responseData?.message ||
        responseData?.error ||
        JSON.stringify(responseData);
    } catch {
      errorMessage = responseText;
    }
  }
  if (response.status === 401) {
    throw new Error("Sesión expirada o no autorizada");
  }
  if (!response.ok) {
    throw new Error(errorMessage);
  }
  return true;
};

//estatus del usuario a activo
export const activarUsuario = async (user) => {
  const headers = getAuthHeaders();
  if (!headers) {
    throw new Error("No se encontró el token de autenticación");
  }
  const response = await fetch(`${BASE_URL}/usuarios/${user.id_usuario}/`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      nom_usuario: user.nom_usuario,
      nombre: user.nombre,
      apellido_p: user.apellido_p,
      apellido_m: user.apellido_m,
      correo: user.correo,
      telefono: user.telefono,
      id_rol: user.id_rol,
      estatus: 1,
    }),
  });
  const responseText = await response.text();
  let errorMessage = "No se pudo cambiar el usuario a inactivo";
  if (responseText) {
    try {
      const responseData = JSON.parse(responseText);
      errorMessage =
        responseData?.detail ||
        responseData?.message ||
        responseData?.error ||
        JSON.stringify(responseData);
    } catch {
      errorMessage = responseText;
    }
  }
  if (response.status === 401) {
    throw new Error("Sesión expirada o no autorizada");
  }
  if (!response.ok) {
    throw new Error(errorMessage);
  }
  return true;
};