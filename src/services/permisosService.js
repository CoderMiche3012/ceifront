import { obtenerPermisos } from "./cuentasApi";
import { obtenerUsuarioLocal } from "../utils/authStorage";

export async function cargarPermisosUsuario() {
  const userData = obtenerUsuarioLocal();

  if (!userData) return [];

  // 🔥 CASO 1: superadmin → todos los permisos
  if (userData?.is_admin) {
    try {
      const permisosData = await obtenerPermisos();

      const allPermissions = permisosData.map(
        (permiso) => permiso.nombre_permiso
      );

      // opcional: asegurar permiso especial
      if (!allPermissions.includes("Ver Permisos")) {
        allPermissions.push("Ver Permisos");
      }

      return allPermissions;
    } catch (error) {
      console.error("Error obteniendo permisos:", error);
      return [];
    }
  }

  // 🔥 CASO 2: usuario normal → usar permisos del login
  if (Array.isArray(userData.permisos)) {
    return userData.permisos;
  }

  return [];
}