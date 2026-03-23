//convertir formatos de estatus a un valor 
export const normalizeStatus = (estatus) => {
  if (estatus === 1 || estatus === true) return "Activo";
  if (estatus === 0 || estatus === false) return "Inactivo";
  if (typeof estatus === "string") return estatus;
  if (typeof estatus === "object" && estatus !== null) {
    return estatus?.nombre || estatus?.estatus || "Sin estatus";
  }
  return "Sin estatus";
};

//obtener el id del rol del usuario como string para facilitar comparaciones
export const getRoleId = (user) => {
  return String(user?.id_rol || "");
};

//busca y devuelve el nombre del rol según el catálogo recibido
export const getRoleLabel = (user, roles = []) => {
  const roleId = getRoleId(user);
  const foundRole = roles.find(
    (rol) => String(rol?.id_rol || rol?.id || "") === roleId
  );
  return foundRole?.nombre_rol || foundRole?.nombre || "Sin rol";
};

//construye opciones únicas de roles para filtros
export const buildRoleOptions = (roles = []) => {
  const uniqueRoles = new Map();
  roles.forEach((rol) => {
    const value = String( rol.id || rol.id_rol || rol.pk_id_rol || rol.rol_id || "");
    const label = rol.nombre || rol.nombre_rol || rol.nb_rol || rol.name || rol.rol;
    if (!value || !label) return;
    if (!uniqueRoles.has(value)) {
      uniqueRoles.set(value, {
        value,
        label: String(label),
      });
    }
  });
  return Array.from(uniqueRoles.values());
};

//filtra usuarios por búsqueda, estatus y rol
export const filterAndSortUsers = ({users = [],search = "",statusFilter = "",roleFilter = "",}) => {
  const term = search.toLowerCase();
  const filtered = users.filter((user) => {
    const fullName =
      `${user.nombre || ""} ${user.apellido_p || ""} ${user.apellido_m || ""}`.toLowerCase();
    const matchesSearch =
      fullName.includes(term) ||
      user.correo?.toLowerCase().includes(term) ||
      user.nom_usuario?.toLowerCase().includes(term);
    const matchesStatus = statusFilter
      ? user.estatus?.toLowerCase() === statusFilter.toLowerCase()
      : true;
    const matchesRole = roleFilter
      ? getRoleId(user) === String(roleFilter)
      : true;
    return matchesSearch && matchesStatus && matchesRole;
  });
  //priorizar usuarios activos y después ordena alfabéticamente por nombre
  return filtered.sort((a, b) => {
    const aPriority = a.estatus === "Activo" ? 0 : 1;
    const bPriority = b.estatus === "Activo" ? 0 : 1;
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }
    const aName = `${a.nombre || ""} ${a.apellido_p || ""} ${a.apellido_m || ""}`.toLowerCase();
    const bName = `${b.nombre || ""} ${b.apellido_p || ""} ${b.apellido_m || ""}`.toLowerCase();
    return aName.localeCompare(bName);
  });
};