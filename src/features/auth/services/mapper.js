export const mapearUsuario = (data) => {
  return {
    id: data.id_usuario ?? data.id,
    nombreUsuario: data.nom_usuario ?? "",
    nombre: data.nombre ?? "",
    apellido_p: data.apellido_p ?? "",
    apellido_m: data.apellido_m ?? "",
    correo: data.correo ?? "",
    telefono: data.telefono ?? "",
    rol: data.rol?.nombre || data.rol || "",
    permisos: Array.isArray(data.permisos) ? data.permisos : [],
    esAdmin: data.is_admin === true,
    esSuperUser: data.is_superuser === true,
    esStaff: data.is_staff === true,
  };
};
// adaptar respuesta de login
export const mapearInicioSesion = (data) => {
  return {
    access: data.access,
    refresh: data.refresh,
  };
};
// adaptar perfil
export const mapearPerfil = (data) => {
  return mapearUsuario(data);
};

