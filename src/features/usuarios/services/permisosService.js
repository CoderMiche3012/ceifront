import { obtenerUsuarioLocal } from "../../../utils/authStorage";
import { obtenerPermisos } from "../sub-features/roles/services/rolesService";
export async function cargarPermisosUsuario() {
  const userData = obtenerUsuarioLocal();
  if (!userData) return [];
  //todos los permisos
  if (userData?.is_admin) {
    try {
      const permisosData = await obtenerPermisos();
      const allPermissions = permisosData.map(
        (permiso) => permiso.nombre_permiso
      );
      //asegurar permiso especial
      if (!allPermissions.includes("Ver Permisos")) {
        allPermissions.push("Ver Permisos");
      }
      return allPermissions;
    } catch (error) {
      console.error("Error obteniendo permisos:", error);
      return [];
    }
  }
  //usar permisos del login
  if (Array.isArray(userData.permisos)) {
    return userData.permisos;
  }
  return [];
}