import {Users,Heart,ClipboardList,GraduationCap,BarChart3,User,} from "lucide-react"

//modulos del sistema 
export const modules = [
  { key: "beneficiarios", name: "Beneficiarios", icon: Users },
  { key: "donadores", name: "Donadores", icon: Heart },
  { key: "postulantes", name: "Postulantes", icon: ClipboardList },
  { key: "cursos", name: "Cursos", icon: GraduationCap },
  { key: "reportes", name: "Reportes", icon: BarChart3 },
  { key: "usuarios", name: "Usuarios", icon: User },
]
// etiquetas visibles y claves internas de acciones
export const actionsMap = {
  Ver: "ver",
  Crear: "crear",
  Editar: "editar",
  Eliminar: "eliminar",
}
//genera un objeto base de permisos con todos en false
export function getEmptyPermissions() {
  return modules.reduce((acc, module) => {
    acc[module.key] = {
      ver: false,
      crear: false,
      editar: false,
      eliminar: false,
    }
    return acc
  }, {})
}
// objeto vacío reutilizable de permisos
export const emptyPermissions = getEmptyPermissions()
//convierte un nombre de permiso 
export function permissionNameToModuleAction(nombrePermiso) {
  const parts = nombrePermiso.trim().split(" ")
  const actionLabel = parts[0]
  const moduleName = parts.slice(1).join(" ").toLowerCase()
  const actionKey = actionsMap[actionLabel]
  if (!actionKey) return null
  const matchedModule = modules.find(
    (module) => module.name.toLowerCase() === moduleName
  )
  if (!matchedModule) return null
  return {
    moduleKey: matchedModule.key,
    actionKey,
  }
}

//convierte un rol a un objeto de permisos
export function roleToPermissionsObject(role, catalog) {
  const result = getEmptyPermissions()
  const permissionIds = role?.permisos || []
  permissionIds.forEach((permissionId) => {
    const permission = catalog.find((item) => item.id_permiso === permissionId)
    if (!permission) return

    const parsed = permissionNameToModuleAction(permission.nombre_permiso)
    if (!parsed) return

    result[parsed.moduleKey][parsed.actionKey] = true
  })
  return result
}

//convierte el objeto de permisos a un arreglo de IDs para enviar al backend
export function permissionsObjectToIds(permissionsObject, catalog) {
  const selectedIds = []

  catalog.forEach((permission) => {
    const parsed = permissionNameToModuleAction(permission.nombre_permiso)
    if (!parsed) return

    const isChecked =
      permissionsObject?.[parsed.moduleKey]?.[parsed.actionKey] === true

    if (isChecked) {
      selectedIds.push(permission.id_permiso)
    }
  })
  return selectedIds
}

//verifica si un rol es protegido 
export function isProtectedRole(role) {
  if (!role?.nombre_rol) return false
  const roleName = role.nombre_rol.trim().toLowerCase()
  return ["administrador", "super admin", "superadmin", "admin"].includes(roleName)
}