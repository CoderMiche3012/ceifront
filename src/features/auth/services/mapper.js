export const mapearUsuario = (data) => {
  return {
    id: data.id_usuario ?? data.id,
    nombreUsuario: data.nom_usuario,

    nombre: data.nombre ?? "",
    apellido_p: data.apellido_p ?? "",
    apellido_m: data.apellido_m ?? "",
    correo: data.correo ?? "",

    rol: data.rol?.nombre || data.rol || "",
    permisos: Array.isArray(data.permisos)
      ? data.permisos
      : [],

    esAdmin: data.is_admin ?? false,
    esStaff: data.es_staff ?? false,
  };
};

// adaptar respuesta de login
export const mapearInicioSesion = (data) => {
  return {
    access: data.access,
    refresh: data.refresh,
    usuario: mapearUsuario(data),
  };
};

// adaptar perfil
export const mapearPerfil = (data) => {
  return mapearUsuario(data);
};

