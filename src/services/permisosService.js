import { obtenerPermisos, obtenerRoles } from "./cuentasApi"
import { obtenerUsuarioLocal } from "../utils/authStorage"

export async function cargarPermisosUsuario() {
  const userData = obtenerUsuarioLocal()

  if (userData?.es_superadmin) {
    const permisosData = await obtenerPermisos()

    const allPermissions = permisosData.map(
      (permiso) => permiso.nombre_permiso
    )

    if (!allPermissions.includes("Ver Permisos")) {
      allPermissions.push("Ver Permisos")
    }

    return allPermissions
  }

  const userRoleId = Number(userData?.id_rol)

  if (!userRoleId) {
    return []
  }

  const [rolesData, permisosData] = await Promise.all([
    obtenerRoles(),
    obtenerPermisos(),
  ])

  const currentRole = rolesData.find(
    (rol) => Number(rol.id_rol) === userRoleId
  )

  if (!currentRole) {
    return []
  }

  const permisosDelRol = (currentRole.permisos || []).map(Number)

  return permisosData
    .filter((permiso) => permisosDelRol.includes(Number(permiso.id_permiso)))
    .map((permiso) => permiso.nombre_permiso)
}