import { useEffect, useMemo, useState } from "react"
import {emptyPermissions,getEmptyPermissions,permissionsObjectToIds,roleToPermissionsObject,isProtectedRole,} from "../utils/roles"
import {getRoles,getPermissions,updateRole,createRole,deleteRole,} from "../services/rolesService"
export default function useRoles() {
  const [roles, setRoles] = useState([])
  const [permissionsCatalog, setPermissionsCatalog] = useState([])
  const [selectedRole, setSelectedRole] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [draftPermissions, setDraftPermissions] = useState(null)
  const [draftRole, setDraftRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [creatingRole, setCreatingRole] = useState(false)
  const [deletingRole, setDeletingRole] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showConfirmSaveEditModal, setShowConfirmSaveEditModal] = useState(false)
  const [showConfirmCreateRoleModal, setShowConfirmCreateRoleModal] = useState(false)
  const [showConfirmDeleteRoleModal, setShowConfirmDeleteRoleModal] = useState(false)
  const [createRoleForm, setCreateRoleForm] = useState({
    nombre_rol: "",
    descripcion: "",
    permisos: getEmptyPermissions(),
  })
  //carga inicial de roles y catálogo de permisos
  useEffect(() => {
    loadInitialData()
  }, [])
  async function loadInitialData() {
    try {
      setLoading(true)
      setError("")
      const [rolesResponse, permissionsResponse] = await Promise.all([
        getRoles(),
        getPermissions(),
      ])
      const rolesData = Array.isArray(rolesResponse)
        ? rolesResponse
        : rolesResponse?.data || []
      const permissionsData = Array.isArray(permissionsResponse)
        ? permissionsResponse
        : permissionsResponse?.data || []
      setRoles(rolesData)
      setPermissionsCatalog(permissionsData)
      if (rolesData.length > 0) {
        setSelectedRole(rolesData[0])
      }
    } catch (err) {
      setError(err.message || "No se pudo cargar la información")
    } finally {
      setLoading(false)
    }
  }

  function handleSelectRole(role) {
    if (editMode) return
    setSelectedRole(role)
    setError("")
    setSuccess("")
  }
  //prepara edición del rol seleccionado
  function handleEditPermissions() {
    if (!selectedRole) return
    setDraftPermissions(roleToPermissionsObject(selectedRole, permissionsCatalog))
    setDraftRole({
      descripcion: selectedRole.descripcion || "",
    })
    setEditMode(true)
    setError("")
    setSuccess("")
  }
  function handleCancelEdit() {
    setDraftPermissions(null)
    setDraftRole(null)
    setEditMode(false)
    setShowConfirmSaveEditModal(false)
  }
  function handlePermissionChange(moduleKey, action) {
    if (!editMode) return
    setDraftPermissions((prev) => ({
      ...prev,
      [moduleKey]: {
        ...prev[moduleKey],
        [action]: !prev[moduleKey][action],
      },
    }))
  }
  function handleDraftRoleChange(value) {
    if (!editMode) return
    setDraftRole((prev) => ({
      ...prev,
      descripcion: value,
    }))
  }
  //guarda los cambios del rol editado
  async function handleSavePermissions() {
    if (!selectedRole || !draftPermissions || !draftRole) return
    try {
      setSaving(true)
      setError("")
      setSuccess("")
      const permisosIds = permissionsObjectToIds(
        draftPermissions,
        permissionsCatalog
      )
      const payload = {
        nombre_rol: selectedRole.nombre_rol,
        descripcion: draftRole.descripcion.trim(),
        permisos: permisosIds,
      }
      await updateRole(selectedRole.id_rol, payload)
      const updatedRole = {
        ...selectedRole,
        descripcion: payload.descripcion,
        permisos: permisosIds,
      }
      setRoles((prev) =>
        prev.map((role) =>
          role.id_rol === selectedRole.id_rol ? updatedRole : role
        )
      )
      setSelectedRole(updatedRole)
      setDraftPermissions(null)
      setDraftRole(null)
      setEditMode(false)
      setShowConfirmSaveEditModal(false)
      setSuccess("Rol actualizado correctamente")
    } catch (err) {
      setError(err.message || "No se pudieron guardar los cambios")
    } finally {
      setSaving(false)
    }
  }
  //modal para crear un nuevo rol con formulario limpio
  function openCreateModal() {
    setCreateRoleForm({
      nombre_rol: "",
      descripcion: "",
      permisos: getEmptyPermissions(),
    })
    setShowCreateModal(true)
    setShowConfirmCreateRoleModal(false)
    setError("")
    setSuccess("")
  }
  function closeCreateModal() {
    if (creatingRole) return
    setShowCreateModal(false)
    setShowConfirmCreateRoleModal(false)
  }
  function handleCreateFormChange(field, value) {
    setCreateRoleForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }
  function handleCreatePermissionChange(moduleKey, action) {
    setCreateRoleForm((prev) => ({
      ...prev,
      permisos: {
        ...prev.permisos,
        [moduleKey]: {
          ...prev.permisos[moduleKey],
          [action]: !prev.permisos[moduleKey][action],
        },
      },
    }))
  }
  function openConfirmCreateRoleModal() {
    if (!createRoleForm.nombre_rol.trim()) {
      setError("El nombre del rol es obligatorio")
      return
    }
    setShowConfirmCreateRoleModal(true)
  }
  //crea un nuevo rol y lo agrega al estado local
  async function handleCreateRole() {
    const nombre_rol = createRoleForm.nombre_rol.trim()
    const descripcion = createRoleForm.descripcion.trim()
    if (!nombre_rol) {
      setError("El nombre del rol es obligatorio")
      return
    }
    try {
      setCreatingRole(true)
      setError("")
      setSuccess("")
      const permisosIds = permissionsObjectToIds(
        createRoleForm.permisos,
        permissionsCatalog
      )
      const payload = {
        nombre_rol,
        descripcion,
        permisos: permisosIds,
      }
      const response = await createRole(payload)
      const newRole = response?.data || response
      if (!newRole?.id_rol) {
        throw new Error("La API no devolvió el rol creado correctamente")
      }
      const normalizedNewRole = {
        ...newRole,
        permisos: newRole.permisos || permisosIds,
      }
      setRoles((prev) => [...prev, normalizedNewRole])
      setSelectedRole(normalizedNewRole)
      setShowConfirmCreateRoleModal(false)
      setShowCreateModal(false)
      setSuccess("Rol creado correctamente")
    } catch (err) {
      setError(err.message || "No se pudo crear el rol")
    } finally {
      setCreatingRole(false)
    }
  }
  // valida si el rol se puede eliminar antes de abrir confirmación
  function openConfirmDeleteRoleModal() {
    if (!selectedRole) return
    if (isProtectedRole(selectedRole)) {
      setError("Este rol está protegido y no se puede eliminar")
      return
    }
    setShowConfirmDeleteRoleModal(true)
    setError("")
    setSuccess("")
  }
  //elimina el rol seleccionado y actualiza la lista local
  async function handleDeleteRole() {
    if (!selectedRole) return
    try {
      setDeletingRole(true)
      setError("")
      setSuccess("")
      const roleIdToDelete = selectedRole.id_rol
      await deleteRole(roleIdToDelete)
      const updatedRoles = roles.filter((role) => role.id_rol !== roleIdToDelete)
      setRoles(updatedRoles)
      setSelectedRole(updatedRoles.length > 0 ? updatedRoles[0] : null)
      setShowConfirmDeleteRoleModal(false)
      setSuccess("Rol eliminado correctamente")
    } catch (err) {
      setError(
        err.message || "No se pudo eliminar el rol. Puede que tenga usuarios asignados."
      )
    } finally {
      setDeletingRole(false)
    }
  }
  //permisos actuales según el rol seleccionado o el borrador en edición
  const currentPermissions = useMemo(() => {
    if (!selectedRole) return emptyPermissions
    if (editMode) return draftPermissions || emptyPermissions
    return roleToPermissionsObject(selectedRole, permissionsCatalog)
  }, [selectedRole, permissionsCatalog, editMode, draftPermissions])
  return {
    roles,permissionsCatalog,selectedRole,editMode,draftPermissions,draftRole,loading,saving,creatingRole,deletingRole,
    error,success,showCreateModal,showConfirmSaveEditModal,showConfirmCreateRoleModal,showConfirmDeleteRoleModal,
    createRoleForm,currentPermissions,

    setShowConfirmSaveEditModal,setShowConfirmCreateRoleModal,setShowConfirmDeleteRoleModal,

    handleSelectRole,handleEditPermissions,handleCancelEdit,handlePermissionChange,handleDraftRoleChange,
    handleSavePermissions,openCreateModal,closeCreateModal,handleCreateFormChange,handleCreatePermissionChange,
    openConfirmCreateRoleModal,handleCreateRole,openConfirmDeleteRoleModal,handleDeleteRole,
  }
}